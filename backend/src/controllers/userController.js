const { prisma } = require('../config/env');

// Update user personal details
const updateMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, mobile, dateOfBirth, gender, profilePhoto } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(mobile && { mobile }),
        ...(dateOfBirth !== undefined && { dateOfBirth }),
        ...(gender !== undefined && { gender }),
        ...(profilePhoto !== undefined && { profilePhoto }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        dateOfBirth: true,
        gender: true,
        profilePhoto: true,
        updatedAt: true,
      },
    });

    return res.json({
      success: true,
      message: 'Personal details updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Delete/deactivate self account
const deleteMe = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Deactivate account
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    // Also deactivate QR profile if exists
    await prisma.qRProfile.updateMany({
      where: { userId },
      data: { isActive: false },
    });

    return res.json({
      success: true,
      message: 'Your profile and QR code have been deactivated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateMe,
  deleteMe,
};
