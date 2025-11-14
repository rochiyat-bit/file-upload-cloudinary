const Joi = require('joi');

// Validate request middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    next();
  };
};

// Upload validation schemas
const uploadSchemas = {
  getUploads: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    resourceType: Joi.string().valid('image', 'video', 'raw', 'auto'),
    sortBy: Joi.string().valid('createdAt', 'size', 'filename').default('createdAt'),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC'),
    search: Joi.string().allow('').max(255)
  }),

  deleteUpload: Joi.object({
    deleteFromCloudinary: Joi.boolean().default(true)
  })
};

module.exports = {
  validate,
  uploadSchemas
};
