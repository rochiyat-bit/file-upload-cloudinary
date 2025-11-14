const { UserCloudinaryConfig } = require('../models');
const cloudinary = require('cloudinary').v2;

/**
 * Get user's cloudinary config
 */
const getConfig = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const config = await UserCloudinaryConfig.findOne({
      where: { userId },
      attributes: ['id', 'cloudName', 'apiKey', 'folder', 'isActive', 'metadata', 'createdAt', 'updatedAt']
    });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Cloudinary configuration not found. Please set up your configuration.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Configuration retrieved successfully',
      data: config
    });
  } catch (error) {
    console.error('Get config error:', error);
    next(error);
  }
};

/**
 * Create or update cloudinary config
 */
const saveConfig = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { cloudName, apiKey, apiSecret, folder, metadata } = req.body;

    // Test cloudinary credentials
    try {
      const tempCloudinary = cloudinary;
      tempCloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret
      });

      // Test by fetching account details
      await tempCloudinary.api.ping();
    } catch (cloudinaryError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Cloudinary credentials',
        error: cloudinaryError.message
      });
    }

    // Check if config already exists
    let config = await UserCloudinaryConfig.findOne({
      where: { userId }
    });

    if (config) {
      // Update existing config
      await config.update({
        cloudName,
        apiKey,
        apiSecret,
        folder: folder || 'uploads',
        metadata: metadata || config.metadata,
        isActive: true
      });

      res.status(200).json({
        success: true,
        message: 'Cloudinary configuration updated successfully',
        data: {
          id: config.id,
          cloudName: config.cloudName,
          apiKey: config.apiKey,
          folder: config.folder,
          isActive: config.isActive
        }
      });
    } else {
      // Create new config
      config = await UserCloudinaryConfig.create({
        userId,
        cloudName,
        apiKey,
        apiSecret,
        folder: folder || 'uploads',
        metadata,
        isActive: true
      });

      res.status(201).json({
        success: true,
        message: 'Cloudinary configuration created successfully',
        data: {
          id: config.id,
          cloudName: config.cloudName,
          apiKey: config.apiKey,
          folder: config.folder,
          isActive: config.isActive
        }
      });
    }
  } catch (error) {
    console.error('Save config error:', error);
    next(error);
  }
};

/**
 * Test cloudinary connection
 */
const testConfig = async (req, res, next) => {
  try {
    const { cloudName, apiKey, apiSecret } = req.body;

    const tempCloudinary = cloudinary;
    tempCloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret
    });

    // Test connection
    const result = await tempCloudinary.api.ping();

    res.status(200).json({
      success: true,
      message: 'Cloudinary credentials are valid',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid Cloudinary credentials',
      error: error.message
    });
  }
};

/**
 * Delete cloudinary config
 */
const deleteConfig = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const config = await UserCloudinaryConfig.findOne({
      where: { userId }
    });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Configuration not found'
      });
    }

    await config.destroy();

    res.status(200).json({
      success: true,
      message: 'Cloudinary configuration deleted successfully'
    });
  } catch (error) {
    console.error('Delete config error:', error);
    next(error);
  }
};

/**
 * Toggle config status
 */
const toggleConfig = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const config = await UserCloudinaryConfig.findOne({
      where: { userId }
    });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Configuration not found'
      });
    }

    await config.update({
      isActive: !config.isActive
    });

    res.status(200).json({
      success: true,
      message: `Configuration ${config.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        isActive: config.isActive
      }
    });
  } catch (error) {
    console.error('Toggle config error:', error);
    next(error);
  }
};

/**
 * Get user's cloudinary config for admin
 */
const getConfigByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const config = await UserCloudinaryConfig.findOne({
      where: { userId },
      attributes: ['id', 'userId', 'cloudName', 'apiKey', 'folder', 'isActive', 'metadata', 'createdAt', 'updatedAt']
    });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Cloudinary configuration not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Configuration retrieved successfully',
      data: config
    });
  } catch (error) {
    console.error('Get config by user ID error:', error);
    next(error);
  }
};

module.exports = {
  getConfig,
  saveConfig,
  testConfig,
  deleteConfig,
  toggleConfig,
  getConfigByUserId
};
