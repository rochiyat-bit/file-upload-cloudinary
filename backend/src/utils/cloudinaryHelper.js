const cloudinary = require('../config/cloudinary');
const cloudinaryLib = require('cloudinary').v2;
const streamifier = require('streamifier');

/**
 * Upload file buffer to Cloudinary with custom config
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {Object} options - Upload options
 * @param {Object} customConfig - Custom cloudinary config (cloudName, apiKey, apiSecret)
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadToCloudinary = (fileBuffer, options = {}, customConfig = null) => {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      folder: process.env.CLOUDINARY_FOLDER || 'uploads',
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      ...options
    };

    // Use custom config if provided, otherwise use default
    let cloudinaryInstance = cloudinary;

    if (customConfig && customConfig.cloudName && customConfig.apiKey && customConfig.apiSecret) {
      // Create a new cloudinary instance with custom config
      cloudinaryInstance = cloudinaryLib;
      cloudinaryInstance.config({
        cloud_name: customConfig.cloudName,
        api_key: customConfig.apiKey,
        api_secret: customConfig.apiSecret,
        secure: true
      });

      // Override folder if provided in custom config
      if (customConfig.folder) {
        defaultOptions.folder = customConfig.folder;
      }
    }

    const uploadStream = cloudinaryInstance.uploader.upload_stream(
      defaultOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

/**
 * Delete file from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @param {String} resourceType - Resource type (image, video, raw)
 * @returns {Promise<Object>} - Cloudinary deletion result
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true
    });
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Get Cloudinary resource details
 * @param {String} publicId - Cloudinary public ID
 * @param {String} resourceType - Resource type
 * @returns {Promise<Object>} - Resource details
 */
const getCloudinaryResource = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Generate transformation URL
 * @param {String} publicId - Cloudinary public ID
 * @param {Object} transformations - Transformation options
 * @returns {String} - Transformed URL
 */
const generateTransformationUrl = (publicId, transformations = {}) => {
  return cloudinary.url(publicId, {
    secure: true,
    ...transformations
  });
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array} files - Array of file buffers
 * @param {Object} options - Upload options
 * @returns {Promise<Array>} - Array of upload results
 */
const uploadMultipleToCloudinary = async (files, options = {}) => {
  const uploadPromises = files.map(file =>
    uploadToCloudinary(file.buffer, {
      ...options,
      folder: options.folder || process.env.CLOUDINARY_FOLDER || 'uploads'
    })
  );

  return Promise.all(uploadPromises);
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  getCloudinaryResource,
  generateTransformationUrl,
  uploadMultipleToCloudinary
};
