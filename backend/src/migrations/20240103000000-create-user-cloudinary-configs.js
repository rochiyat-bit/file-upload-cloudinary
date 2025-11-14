'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_cloudinary_configs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cloud_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      api_key: {
        type: Sequelize.STRING,
        allowNull: false
      },
      api_secret: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      folder: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'uploads'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true
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
      }
    });

    // Add indexes
    await queryInterface.addIndex('user_cloudinary_configs', ['user_id'], {
      unique: true,
      name: 'user_cloudinary_configs_user_id_unique'
    });

    await queryInterface.addIndex('user_cloudinary_configs', ['is_active'], {
      name: 'user_cloudinary_configs_is_active_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_cloudinary_configs');
  }
};
