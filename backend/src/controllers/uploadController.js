const { Upload } = require('../models');
const {
  uploadToCloudinary,
  deleteFromCloudinary,
  uploadMultipleToCloudinary
} = require('../utils/cloudinaryHelper');
const { Op } = require('sequelize');

/**
 * Upload single file
 */
const uploadSingle = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer, {
      folder: process.env.CLOUDINARY_FOLDER || 'uploads',
      resource_type: 'auto'
    });

    // Save to database
    const upload = await Upload.create({
      filename: req.file.originalname,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      cloudinaryPublicId: cloudinaryResult.public_id,
      cloudinaryUrl: cloudinaryResult.url,
      cloudinarySecureUrl: cloudinaryResult.secure_url,
      width: cloudinaryResult.width || null,
      height: cloudinaryResult.height || null,
      format: cloudinaryResult.format,
      resourceType: cloudinaryResult.resource_type,
      folder: cloudinaryResult.folder,
      uploadedBy: req.body.uploadedBy || null,
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      metadata: {
        bytes: cloudinaryResult.bytes,
        created_at: cloudinaryResult.created_at
      }
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: upload
    });
  } catch (error) {
    console.error('Upload error:', error);
    next(error);
  }
};

/**
 * Upload multiple files
 */
const uploadMultiple = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Upload all files to Cloudinary
    const uploadPromises = req.files.map(async (file) => {
      const cloudinaryResult = await uploadToCloudinary(file.buffer, {
        folder: process.env.CLOUDINARY_FOLDER || 'uploads',
        resource_type: 'auto'
      });

      return {
        filename: file.originalname,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        cloudinaryPublicId: cloudinaryResult.public_id,
        cloudinaryUrl: cloudinaryResult.url,
        cloudinarySecureUrl: cloudinaryResult.secure_url,
        width: cloudinaryResult.width || null,
        height: cloudinaryResult.height || null,
        format: cloudinaryResult.format,
        resourceType: cloudinaryResult.resource_type,
        folder: cloudinaryResult.folder,
        uploadedBy: req.body.uploadedBy || null,
        tags: req.body.tags ? JSON.parse(req.body.tags) : [],
        metadata: {
          bytes: cloudinaryResult.bytes,
          created_at: cloudinaryResult.created_at
        }
      };
    });

    const uploadData = await Promise.all(uploadPromises);

    // Bulk insert to database
    const uploads = await Upload.bulkCreate(uploadData);

    res.status(201).json({
      success: true,
      message: `${uploads.length} files uploaded successfully`,
      data: uploads
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    next(error);
  }
};

/**
 * Get all uploads with pagination and filters
 */
const getUploads = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      resourceType,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      search = ''
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const whereClause = {
      isActive: true
    };

    if (resourceType) {
      whereClause.resourceType = resourceType;
    }

    if (search) {
      whereClause[Op.or] = [
        { filename: { [Op.like]: `%${search}%` } },
        { originalName: { [Op.like]: `%${search}%` } }
      ];
    }

    // Get uploads
    const { count, rows: uploads } = await Upload.findAndCountAll({
      where: whereClause,
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: offset,
      attributes: { exclude: ['deletedAt'] }
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    res.status(200).json({
      success: true,
      message: 'Uploads retrieved successfully',
      data: {
        uploads,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit),
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get uploads error:', error);
    next(error);
  }
};

/**
 * Get single upload by ID
 */
const getUploadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const upload = await Upload.findOne({
      where: {
        id,
        isActive: true
      }
    });

    if (!upload) {
      return res.status(404).json({
        success: false,
        message: 'Upload not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Upload retrieved successfully',
      data: upload
    });
  } catch (error) {
    console.error('Get upload error:', error);
    next(error);
  }
};

/**
 * Delete upload
 */
const deleteUpload = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { deleteFromCloudinary: shouldDeleteFromCloudinary = true } = req.body;

    const upload = await Upload.findOne({
      where: {
        id,
        isActive: true
      }
    });

    if (!upload) {
      return res.status(404).json({
        success: false,
        message: 'Upload not found'
      });
    }

    // Delete from Cloudinary if requested
    if (shouldDeleteFromCloudinary) {
      try {
        await deleteFromCloudinary(
          upload.cloudinaryPublicId,
          upload.resourceType
        );
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error:', cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Soft delete from database
    await upload.destroy();

    res.status(200).json({
      success: true,
      message: 'Upload deleted successfully'
    });
  } catch (error) {
    console.error('Delete upload error:', error);
    next(error);
  }
};

/**
 * Get upload statistics
 */
const getUploadStats = async (req, res, next) => {
  try {
    const totalUploads = await Upload.count({
      where: { isActive: true }
    });

    const totalSize = await Upload.sum('size', {
      where: { isActive: true }
    });

    const uploadsByType = await Upload.findAll({
      attributes: [
        'resourceType',
        [Upload.sequelize.fn('COUNT', Upload.sequelize.col('id')), 'count'],
        [Upload.sequelize.fn('SUM', Upload.sequelize.col('size')), 'totalSize']
      ],
      where: { isActive: true },
      group: ['resourceType']
    });

    res.status(200).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: {
        totalUploads,
        totalSize,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
        uploadsByType
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    next(error);
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  getUploads,
  getUploadById,
  deleteUpload,
  getUploadStats
};
