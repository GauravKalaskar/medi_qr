const { prisma } = require('../config/env');
const { generateSecureQRToken } = require('../utils/token');

// Get Patient's Own Medical Profile
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const profile = await prisma.medicalProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            mobile: true,
            dateOfBirth: true,
            gender: true,
          },
        },
      },
    });

    const consent = await prisma.consent.findFirst({
      where: { userId, consentType: 'EMERGENCY_QR_SHARING' },
      orderBy: { acceptedAt: 'desc' },
    });

    const qr = await prisma.qRProfile.findUnique({
      where: { userId },
    });

    return res.json({
      success: true,
      profile: profile || null,
      consentAccepted: !!consent?.accepted,
      qrProfile: qr || null,
    });
  } catch (error) {
    next(error);
  }
};

// Create or Update Medical Profile
const upsertProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      bloodGroup,
      rhFactor,
      address,
      allergies,
      medicalConditions,
      chronicDiseases,
      previousSurgeries,
      currentMedications,
      previousMedications,
      disabilityInfo,
      emergencyContactName,
      emergencyContactNumber,
      emergencyContactRelationship,
      preferredHospital,
      primaryDoctor,
      doctorContact,
      height,
      weight,
      smokingStatus,
      alcoholStatus,
      organDonorStatus,
      insuranceProvider,
      insurancePolicyNumber,
      additionalNotes,
      consentAccepted,
    } = req.body;

    // Upsert Medical Profile
    const profile = await prisma.medicalProfile.upsert({
      where: { userId },
      update: {
        bloodGroup,
        rhFactor,
        address,
        allergies,
        medicalConditions,
        chronicDiseases,
        previousSurgeries,
        currentMedications,
        previousMedications,
        disabilityInfo,
        emergencyContactName,
        emergencyContactNumber,
        emergencyContactRelationship,
        preferredHospital,
        primaryDoctor,
        doctorContact,
        height,
        weight,
        smokingStatus,
        alcoholStatus,
        organDonorStatus,
        insuranceProvider,
        insurancePolicyNumber,
        additionalNotes,
      },
      create: {
        userId,
        bloodGroup,
        rhFactor,
        address,
        allergies,
        medicalConditions,
        chronicDiseases,
        previousSurgeries,
        currentMedications,
        previousMedications,
        disabilityInfo,
        emergencyContactName,
        emergencyContactNumber,
        emergencyContactRelationship,
        preferredHospital,
        primaryDoctor,
        doctorContact,
        height,
        weight,
        smokingStatus,
        alcoholStatus,
        organDonorStatus,
        insuranceProvider,
        insurancePolicyNumber,
        additionalNotes,
      },
    });

    // Record Consent if provided
    if (consentAccepted) {
      await prisma.consent.create({
        data: {
          userId,
          consentType: 'EMERGENCY_QR_SHARING',
          accepted: true,
        },
      });
    }

    // Auto-generate active QR Profile if not existing and consent is accepted
    let qrProfile = await prisma.qRProfile.findUnique({ where: { userId } });
    if (!qrProfile && consentAccepted) {
      const secureToken = generateSecureQRToken();
      qrProfile = await prisma.qRProfile.create({
        data: {
          userId,
          secureToken,
          isActive: true,
        },
      });
    }

    return res.json({
      success: true,
      message: 'Medical profile saved successfully!',
      profile,
      qrProfile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  upsertProfile,
};
