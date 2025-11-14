'use strict';
const CryptoJS = require('crypto-js');

module.exports = (sequelize, DataTypes) => {
  const UserCloudinaryConfig = sequelize.define('UserCloudinaryConfig', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    cloudName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'cloud_name'
    },
    apiKey: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'api_key'
    },
    apiSecret: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'api_secret',
      get() {
        const encrypted = this.getDataValue('apiSecret');
        if (!encrypted) return null;

        try {
          const secretKey = process.env.ENCRYPTION_SECRET || 'default-secret-key-change-in-production';
          const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
          return bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
          console.error('Decryption error:', error);
          return null;
        }
      },
      set(value) {
        if (value) {
          const secretKey = process.env.ENCRYPTION_SECRET || 'default-secret-key-change-in-production';
          const encrypted = CryptoJS.AES.encrypt(value, secretKey).toString();
          this.setDataValue('apiSecret', encrypted);
        }
      }
    },
    folder: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'uploads',
      comment: 'Default folder for uploads'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      field: 'is_active'
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Additional cloudinary settings'
    }
  }, {
    tableName: 'user_cloudinary_configs',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  UserCloudinaryConfig.associate = function(models) {
    UserCloudinaryConfig.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return UserCloudinaryConfig;
};
