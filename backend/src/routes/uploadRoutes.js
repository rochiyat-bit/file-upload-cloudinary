const express = require('express');
const router = express.Router();
const { upload, handleMulterError } = require('../middleware/upload');
const { authenticate, optionalAuth } = require('../middleware/auth');
const {
  uploadSingle,
  uploadMultiple,
  getUploads,
  getUploadById,
  deleteUpload,
  getUploadStats
} = require('../controllers/uploadController');

// Upload routes (requires authentication)
router.post(
  '/single',
  authenticate,
  upload.single('file'),
  handleMulterError,
  uploadSingle
);

router.post(
  '/multiple',
  authenticate,
  upload.array('files', parseInt(process.env.MAX_FILES) || 5),
  handleMulterError,
  uploadMultiple
);

// Get routes (optional authentication for filtering by user)
router.get('/', optionalAuth, getUploads);
router.get('/stats', optionalAuth, getUploadStats);
router.get('/:id', optionalAuth, getUploadById);

// Delete route (requires authentication)
router.delete('/:id', authenticate, deleteUpload);

module.exports = router;
