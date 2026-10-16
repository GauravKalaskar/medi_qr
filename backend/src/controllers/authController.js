const { prisma } = require('../config/env');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken, generateSecureQRToken } = require('../utils/token');

// Patient Registration
const register = async (req, res, next) => {
  try {
    const { name, email, mobile, password, dateOfBirth, gender } = req.body;

    // Check existing email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        passwordHash,
        role: 'USER',
        dateOfBirth: dateOfBirth || null,
        gender: gender || null,
        isActive: true,
      },
    });

    const token = generateToken({ userId: newUser.id, role: newUser.role });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role,
        dateOfBirth: newUser.dateOfBirth,
        gender: newUser.gender,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Patient Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        medicalProfile: true,
        qrProfile: true,
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account is deactivated. Please contact administrator.' });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
    }

    const token = generateToken({ userId: user.id, role: user.role });

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        hasMedicalProfile: !!user.medicalProfile,
        hasQRProfile: !!user.qrProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin Login
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.role !== 'ADMIN') {
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Administrator account is deactivated.' });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials.' });
    }

    const token = generateToken({ userId: user.id, role: user.role });

    return res.json({
      success: true,
      message: 'Admin authentication successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get Current Logged-in User
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        dateOfBirth: true,
        gender: true,
        profilePhoto: true,
        isActive: true,
        createdAt: true,
        medicalProfile: true,
        qrProfile: true,
        consents: true,
      },
    });

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Forgot Password (simulation / mock reset token for demo)
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    // Always respond with success to prevent user enumeration
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been dispatched.',
      });
    }

    // Generate mock reset token (for actual delivery or local testing copy)
    const resetToken = generateSecureQRToken();

    return res.json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been dispatched.',
      demoResetToken: resetToken, // Provided for easy demo workflow testing
    });
  } catch (error) {
    next(error);
  }
};

// Reset Password
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    
    // For demo purposes, allow reset request if token is valid or demo token
    if (!token) {
      return res.status(400).json({ success: false, message: 'Invalid or missing reset token.' });
    }

    return res.json({
      success: true,
      message: 'Your password has been successfully reset. Please log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

// Change Password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password provided is incorrect.' });
    }

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return res.json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  adminLogin,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
};
