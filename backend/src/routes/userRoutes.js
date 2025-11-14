const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Admin/Moderator only routes
router.get('/', authorize('admin', 'moderator'), getAllUsers);
router.get('/stats', authorize('admin'), getUserStats);
router.get('/:id', authorize('admin', 'moderator'), getUserById);

// Admin only routes
router.post('/', authorize('admin'), createUser);
router.put('/:id', authorize('admin', 'moderator'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
