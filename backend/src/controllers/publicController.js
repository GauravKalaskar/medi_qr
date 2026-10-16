const { prisma } = require('../config/env');

const getPublicProfileByToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Invalid or missing QR token.' });
    }

    // Find QR Profile with user & medical profile
    const qrProfile = await prisma.qRProfile.findUnique({
      where: { secureToken: token },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            dateOfBirth: true,
            gender: true,
            isActive: true,
          },
        },
      },
    });

    if (!qrProfile) {
      return res.status(404).json({
        success: false,
        message: 'Invalid Medical QR Code. Token not found or has expired.',
      });
    }

    if (!qrProfile.isActive || !qrProfile.user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This Emergency Medical QR profile is currently deactivated by the patient.',
        isDeactivated: true,
      });
    }

    // Retrieve Medical Profile
    const medicalProfile = await prisma.medicalProfile.findUnique({
      where: { userId: qrProfile.userId },
    });

    if (!medicalProfile) {
      return res.status(404).json({
        success: false,
        message: 'No medical information registered for this profile yet.',
      });
    }

    // Log the QR Access Event asynchronously
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    await prisma.accessLog.create({
      data: {
        qrProfileId: qrProfile.id,
        userAgent,
        ipAddress: String(ipAddress),
        accessType: req.query.source === 'manual' ? 'MANUAL_SEARCH' : 'QR_SCAN',
        metadata: JSON.stringify({
          referrer: req.headers['referer'] || null,
          accessedAt: new Date().toISOString(),
        }),
      },
    });

    // Sanitized Emergency Response (NO Sensitive Passwords, User IDs, DB Secrets)
    return res.json({
      success: true,
      data: {
        patient: {
          name: qrProfile.user.name,
          dateOfBirth: qrProfile.user.dateOfBirth,
          gender: qrProfile.user.gender,
        },
        emergencySummary: {
          bloodGroup: medicalProfile.bloodGroup,
          rhFactor: medicalProfile.rhFactor,
          allergies: medicalProfile.allergies || 'None Reported',
          criticalConditions: medicalProfile.medicalConditions || 'None Reported',
          currentMedications: medicalProfile.currentMedications || 'None Reported',
          emergencyContactName: medicalProfile.emergencyContactName,
          emergencyContactNumber: medicalProfile.emergencyContactNumber,
          emergencyContactRelationship: medicalProfile.emergencyContactRelationship,
        },
        medicalDetails: {
          chronicDiseases: medicalProfile.chronicDiseases,
          previousSurgeries: medicalProfile.previousSurgeries,
          previousMedications: medicalProfile.previousMedications,
          disabilityInfo: medicalProfile.disabilityInfo,
          preferredHospital: medicalProfile.preferredHospital,
          primaryDoctor: medicalProfile.primaryDoctor,
          doctorContact: medicalProfile.doctorContact,
          height: medicalProfile.height,
          weight: medicalProfile.weight,
          smokingStatus: medicalProfile.smokingStatus,
          alcoholStatus: medicalProfile.alcoholStatus,
          organDonorStatus: medicalProfile.organDonorStatus,
          insuranceProvider: medicalProfile.insuranceProvider,
          insurancePolicyNumber: medicalProfile.insurancePolicyNumber,
          additionalNotes: medicalProfile.additionalNotes,
        },
        lastUpdated: medicalProfile.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicProfileByToken,
};
