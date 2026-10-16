const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { authenticateToken } = require('../middleware/authMiddleware');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require('../validators/authValidator');
const {
  register,
  login,
  adminLogin,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
} = require('../controllers/authController');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/admin/login', validate(loginSchema), adminLogin);
router.get('/me', authenticateToken, getMe);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/change-password', authenticateToken, validate(changePasswordSchema), changePassword);

module.exports = router;
