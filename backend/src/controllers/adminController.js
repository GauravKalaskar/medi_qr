const { prisma } = require('../config/env');

// Admin Dashboard Summary Metrics
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await prisma.user.count({ where: { role: 'USER' } });
    const activeUsers = await prisma.user.count({ where: { role: 'USER', isActive: true } });
    const inactiveUsers = await prisma.user.count({ where: { role: 'USER', isActive: false } });
    const totalQRProfiles = await prisma.qRProfile.count({ where: { isActive: true } });
    const totalScans = await prisma.accessLog.count();

    const recentUsers = await prisma.user.findMany({
      where: { role: 'USER' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        createdAt: true,
        isActive: true,
        medicalProfile: {
          select: {
            bloodGroup: true,
          },
        },
      },
    });

    const recentLogs = await prisma.accessLog.findMany({
      orderBy: { accessedAt: 'desc' },
      take: 5,
      include: {
        qrProfile: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        totalQRProfiles,
        totalScans,
      },
      recentUsers,
      recentLogs,
    });
  } catch (error) {
    next(error);
  }
};

// Admin User Management Table
const getUsers = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where = {
      role: 'USER',
      ...(status === 'active' && { isActive: true }),
      ...(status === 'inactive' && { isActive: false }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
          { mobile: { contains: search } },
        ],
      }),
    };

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        isActive: true,
        createdAt: true,
        dateOfBirth: true,
        gender: true,
        medicalProfile: {
          select: {
            bloodGroup: true,
            rhFactor: true,
            emergencyContactName: true,
          },
        },
        qrProfile: {
          select: {
            id: true,
            secureToken: true,
            isActive: true,
          },
        },
      },
    });

    const total = await prisma.user.count({ where });

    return res.json({
      success: true,
      users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get Detailed Single User Profile
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        medicalProfile: true,
        qrProfile: {
          include: {
            accessLogs: {
              orderBy: { accessedAt: 'desc' },
              take: 20,
            },
          },
        },
        consents: {
          orderBy: { acceptedAt: 'desc' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Patient profile not found.' });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle User Active / Inactive Status
const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
    });

    // Also sync QR profile status
    await prisma.qRProfile.updateMany({
      where: { userId: id },
      data: { isActive },
    });

    return res.json({
      success: true,
      message: `User ${updatedUser.name} has been ${isActive ? 'activated' : 'deactivated'}.`,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Delete User Account
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.role === 'ADMIN') {
      return res.status(400).json({ success: false, message: 'Cannot delete primary administrator accounts.' });
    }

    await prisma.user.delete({ where: { id } });

    return res.json({
      success: true,
      message: `Patient account for ${user.name} deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

// Get Global System Access Logs
const getAccessLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const logs = await prisma.accessLog.findMany({
      orderBy: { accessedAt: 'desc' },
      skip,
      take: limitNum,
      include: {
        qrProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const total = await prisma.accessLog.count();

    return res.json({
      success: true,
      logs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get Medical Profiles List
const getMedicalProfiles = async (req, res, next) => {
  try {
    const profiles = await prisma.medicalProfile.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            mobile: true,
            isActive: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      profiles,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getAccessLogs,
  getMedicalProfiles,
};
