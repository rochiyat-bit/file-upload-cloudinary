'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('uploads', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      filename: {
        type: Sequelize.STRING,
        allowNull: false
      },
      original_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mime_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      size: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'File size in bytes'
      },
      cloudinary_public_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      cloudinary_url: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      cloudinary_secure_url: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      width: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Image width in pixels'
      },
      height: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Image height in pixels'
      },
      format: {
        type: Sequelize.STRING,
        allowNull: true
      },
      resource_type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'image',
        comment: 'Resource type: image, video, raw, auto'
      },
      folder: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Cloudinary folder path'
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Additional metadata'
      },
      uploaded_by: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'User ID or identifier'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Add indexes
    await queryInterface.addIndex('uploads', ['cloudinary_public_id'], {
      name: 'uploads_cloudinary_public_id_index'
    });

    await queryInterface.addIndex('uploads', ['resource_type'], {
      name: 'uploads_resource_type_index'
    });

    await queryInterface.addIndex('uploads', ['is_active'], {
      name: 'uploads_is_active_index'
    });

    await queryInterface.addIndex('uploads', ['created_at'], {
      name: 'uploads_created_at_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('uploads');
  }
};
