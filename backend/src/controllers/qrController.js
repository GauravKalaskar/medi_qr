const { prisma, FRONTEND_URL } = require('../config/env');
const { generateSecureQRToken } = require('../utils/token');

// Get User's Active QR Profile
const getMyQR = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const qrProfile = await prisma.qRProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const medicalProfile = await prisma.medicalProfile.findUnique({
      where: { userId },
      select: {
        bloodGroup: true,
        rhFactor: true,
        updatedAt: true,
      },
    });

    if (!qrProfile) {
      return res.json({
        success: true,
        hasQR: false,
        qrProfile: null,
        medicalProfile,
      });
    }

    const publicUrl = `${FRONTEND_URL}/medical/${qrProfile.secureToken}`;

    return res.json({
      success: true,
      hasQR: true,
      qrProfile: {
        id: qrProfile.id,
        secureToken: qrProfile.secureToken,
        isActive: qrProfile.isActive,
        createdAt: qrProfile.createdAt,
        updatedAt: qrProfile.updatedAt,
        publicUrl,
      },
      patientName: qrProfile.user.name,
      bloodGroup: medicalProfile ? `${medicalProfile.bloodGroup} ${medicalProfile.rhFactor || ''}` : 'Not Specified',
      lastProfileUpdate: medicalProfile?.updatedAt || qrProfile.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

// Generate initial QR Code
const generateQR = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Check if patient has a medical profile
    const profile = await prisma.medicalProfile.findUnique({ where: { userId } });
    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Please create your medical profile before generating a QR code.',
      });
    }

    const existingQR = await prisma.qRProfile.findUnique({ where: { userId } });
    if (existingQR) {
      return res.json({
        success: true,
        message: 'QR profile already exists.',
        qrProfile: existingQR,
        publicUrl: `${FRONTEND_URL}/medical/${existingQR.secureToken}`,
      });
    }

    const secureToken = generateSecureQRToken();
    const qrProfile = await prisma.qRProfile.create({
      data: {
        userId,
        secureToken,
        isActive: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'QR code generated successfully!',
      qrProfile,
      publicUrl: `${FRONTEND_URL}/medical/${qrProfile.secureToken}`,
    });
  } catch (error) {
    next(error);
  }
};

// Regenerate QR Code Token (Revokes previous QR link)
const regenerateQR = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const newToken = generateSecureQRToken();

    const updated = await prisma.qRProfile.upsert({
      where: { userId },
      update: {
        secureToken: newToken,
        isActive: true,
      },
      create: {
        userId,
        secureToken: newToken,
        isActive: true,
      },
    });

    return res.json({
      success: true,
      message: 'QR Code regenerated successfully. Previous QR codes are now revoked.',
      qrProfile: updated,
      publicUrl: `${FRONTEND_URL}/medical/${updated.secureToken}`,
    });
  } catch (error) {
    next(error);
  }
};

// Toggle active/inactive QR code
const toggleQRStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const qr = await prisma.qRProfile.findUnique({ where: { userId } });

    if (!qr) {
      return res.status(404).json({ success: false, message: 'QR Profile not found.' });
    }

    const updated = await prisma.qRProfile.update({
      where: { userId },
      data: { isActive: !qr.isActive },
    });

    return res.json({
      success: true,
      message: `QR code ${updated.isActive ? 'activated' : 'deactivated'} successfully.`,
      isActive: updated.isActive,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyQR,
  generateQR,
  regenerateQR,
  toggleQRStatus,
};
