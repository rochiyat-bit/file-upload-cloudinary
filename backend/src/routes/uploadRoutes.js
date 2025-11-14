const express = require('express');
const router = express.Router();
const { upload, handleMulterError } = require('../middleware/upload');
const {
  uploadSingle,
  uploadMultiple,
  getUploads,
  getUploadById,
  deleteUpload,
  getUploadStats
} = require('../controllers/uploadController');

// Upload routes
router.post(
  '/single',
  upload.single('file'),
  handleMulterError,
  uploadSingle
);

router.post(
  '/multiple',
  upload.array('files', parseInt(process.env.MAX_FILES) || 5),
  handleMulterError,
  uploadMultiple
);

// Get routes
router.get('/', getUploads);
router.get('/stats', getUploadStats);
router.get('/:id', getUploadById);

// Delete route
router.delete('/:id', deleteUpload);

module.exports = router;
