const express = require('express');
const router = express.Router();
const {
  getConfig,
  saveConfig,
  testConfig,
  deleteConfig,
  toggleConfig,
  getConfigByUserId
} = require('../controllers/cloudinaryConfigController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// User routes - manage own cloudinary config
router.get('/', getConfig);
router.post('/', saveConfig);
router.put('/', saveConfig);
router.post('/test', testConfig);
router.delete('/', deleteConfig);
router.patch('/toggle', toggleConfig);

// Admin routes - view user cloudinary config
router.get('/user/:userId', authorize('admin', 'moderator'), getConfigByUserId);

module.exports = router;
