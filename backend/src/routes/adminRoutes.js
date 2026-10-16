const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getAccessLogs,
  getMedicalProfiles,
} = require('../controllers/adminController');

// All admin routes require token authentication AND admin role
router.use(authenticateToken, requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/access-logs', getAccessLogs);
router.get('/medical-profiles', getMedicalProfiles);

module.exports = router;
