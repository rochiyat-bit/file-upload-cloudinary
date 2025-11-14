'use strict';

module.exports = (sequelize, DataTypes) => {
  const Upload = sequelize.define('Upload', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'original_name'
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'mime_type'
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'File size in bytes'
    },
    cloudinaryPublicId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'cloudinary_public_id'
    },
    cloudinaryUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'cloudinary_url'
    },
    cloudinarySecureUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'cloudinary_secure_url'
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Image width in pixels'
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Image height in pixels'
    },
    format: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resourceType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'image',
      field: 'resource_type',
      comment: 'Resource type: image, video, raw, auto'
    },
    folder: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Cloudinary folder path'
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Additional metadata'
    },
    uploadedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'uploaded_by',
      comment: 'User ID or identifier'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    }
  }, {
    tableName: 'uploads',
    timestamps: true,
    underscored: true,
    paranoid: true,
    indexes: [
      {
        fields: ['cloudinary_public_id']
      },
      {
        fields: ['resource_type']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['created_at']
      }
    ]
  });

  Upload.associate = function(models) {
    // Add associations here if needed
    // Example: Upload.belongsTo(models.User, { foreignKey: 'uploadedBy' });
  };

  return Upload;
};
