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

// Comprehensive Healthcare & Emergency Data Analysis
const getAnalytics = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      include: {
        medicalProfile: true,
        qrProfile: {
          include: {
            accessLogs: true,
          },
        },
      },
    });

    const medicalProfiles = await prisma.medicalProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            gender: true,
            dateOfBirth: true,
            createdAt: true,
          },
        },
      },
    });

    const accessLogs = await prisma.accessLog.findMany({
      orderBy: { accessedAt: 'desc' },
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

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.isActive).length;
    const totalMedicalProfiles = medicalProfiles.length;
    const totalQRProfiles = users.filter((u) => u.qrProfile && u.qrProfile.isActive).length;
    const totalScans = accessLogs.length;

    // 1. Blood Group Analysis
    const bloodGroupCounts = {
      'O+': 0, 'O-': 0, 'A+': 0, 'A-': 0,
      'B+': 0, 'B-': 0, 'AB+': 0, 'AB-': 0, 'Other': 0,
    };
    medicalProfiles.forEach((p) => {
      const bg = (p.bloodGroup || '').toUpperCase().trim();
      const rh = (p.rhFactor || '').toLowerCase().trim();
      let fullBg = bg;
      if (!fullBg.includes('+') && !fullBg.includes('-')) {
        fullBg = rh.includes('neg') ? `${bg}-` : `${bg}+`;
      }
      if (bloodGroupCounts[fullBg] !== undefined) {
        bloodGroupCounts[fullBg]++;
      } else {
        bloodGroupCounts['Other']++;
      }
    });

    const bloodGroupDistribution = Object.entries(bloodGroupCounts).map(([type, count]) => ({
      type,
      count,
      percentage: totalMedicalProfiles > 0 ? Number(((count / totalMedicalProfiles) * 100).toFixed(1)) : 0,
      isUniversalDonor: type === 'O-',
      isUniversalRecipient: type === 'AB+',
      isRare: ['AB-', 'B-', 'O-'].includes(type),
    }));

    // 2. Demographic Analysis (Gender & Age Groups)
    const genderCounts = { Male: 0, Female: 0, Other: 0 };
    const ageGroups = {
      'Under 18 (Pediatric)': 0,
      '18-35 (Young Adult)': 0,
      '36-55 (Adult)': 0,
      '56+ (Senior)': 0,
      'Not Specified': 0,
    };
    let totalAgeSum = 0;
    let ageCount = 0;
    const currentYear = new Date().getFullYear();

    users.forEach((u) => {
      const gender = (u.gender || '').toLowerCase();
      if (gender === 'male' || gender === 'm') genderCounts.Male++;
      else if (gender === 'female' || gender === 'f') genderCounts.Female++;
      else genderCounts.Other++;

      if (u.dateOfBirth) {
        const birthYear = new Date(u.dateOfBirth).getFullYear();
        if (!isNaN(birthYear) && birthYear > 1900 && birthYear <= currentYear) {
          const age = currentYear - birthYear;
          totalAgeSum += age;
          ageCount++;
          if (age < 18) ageGroups['Under 18 (Pediatric)']++;
          else if (age <= 35) ageGroups['18-35 (Young Adult)']++;
          else if (age <= 55) ageGroups['36-55 (Adult)']++;
          else ageGroups['56+ (Senior)']++;
        } else {
          ageGroups['Not Specified']++;
        }
      } else {
        ageGroups['Not Specified']++;
      }
    });

    const averageAge = ageCount > 0 ? Math.round(totalAgeSum / ageCount) : null;

    // 3. Clinical Conditions & Critical Allergies Analysis
    const conditionKeywords = [
      { name: 'Hypertension', regex: /hypertens|high blood pressure|bp/i },
      { name: 'Diabetes', regex: /diabet|insulin|t1d|t2d/i },
      { name: 'Asthma / Respiratory', regex: /asthma|copd|bronch/i },
      { name: 'Cardiovascular', regex: /cardiac|heart|coronary|arrhythm/i },
      { name: 'Thyroid Disorder', regex: /thyroid|hypo|hyper/i },
      { name: 'Arthritis', regex: /arthrit|joint/i },
      { name: 'Kidney / Renal', regex: /kidney|renal/i },
      { name: 'Epilepsy / Seizures', regex: /epilep|seiz/i },
    ];

    const conditionStats = conditionKeywords.map((c) => {
      let count = 0;
      medicalProfiles.forEach((p) => {
        const text = `${p.medicalConditions || ''} ${p.chronicDiseases || ''}`;
        if (c.regex.test(text)) count++;
      });
      return {
        name: c.name,
        count,
        percentage: totalMedicalProfiles > 0 ? Number(((count / totalMedicalProfiles) * 100).toFixed(1)) : 0,
      };
    }).sort((a, b) => b.count - a.count);

    const allergyKeywords = [
      { name: 'Penicillin / Antibiotics', regex: /penicillin|amoxicillin|ampicillin/i },
      { name: 'Sulfa Drugs', regex: /sulfa/i },
      { name: 'Aspirin / NSAIDs', regex: /aspirin|nsaid|ibuprofen/i },
      { name: 'Peanut / Nut Allergy', regex: /peanut|tree nut|nut/i },
      { name: 'Latex Allergy', regex: /latex/i },
      { name: 'Shellfish / Seafood', regex: /shellfish|seafood|fish/i },
      { name: 'Iodine / Contrast Dye', regex: /iodine|contrast/i },
    ];

    const allergyStats = allergyKeywords.map((a) => {
      let count = 0;
      medicalProfiles.forEach((p) => {
        if (a.regex.test(p.allergies || '')) count++;
      });
      return {
        name: a.name,
        count,
        percentage: totalMedicalProfiles > 0 ? Number(((count / totalMedicalProfiles) * 100).toFixed(1)) : 0,
      };
    }).sort((a, b) => b.count - a.count);

    // Organ Donors & Lifestyle
    let donorCount = 0;
    let smokersCount = 0;
    let alcoholCount = 0;
    let insuredCount = 0;
    const insuranceProviders = {};

    medicalProfiles.forEach((p) => {
      if ((p.organDonorStatus || '').toLowerCase().includes('yes')) donorCount++;
      if ((p.smokingStatus || '').toLowerCase().includes('smoker') && !(p.smokingStatus || '').toLowerCase().includes('non')) smokersCount++;
      if ((p.alcoholStatus || '').toLowerCase().includes('yes') || (p.alcoholStatus || '').toLowerCase().includes('social') || (p.alcoholStatus || '').toLowerCase().includes('occasional')) alcoholCount++;
      if (p.insuranceProvider && p.insuranceProvider.trim() !== '' && !p.insuranceProvider.toLowerCase().includes('none')) {
        insuredCount++;
        const providerName = p.insuranceProvider.trim();
        insuranceProviders[providerName] = (insuranceProviders[providerName] || 0) + 1;
      }
    });

    const topInsurers = Object.entries(insuranceProviders)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 4. Emergency Scan Intelligence & Temporal Patterns
    const scansByHour = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      label: `${i.toString().padStart(2, '0')}:00`,
      count: 0,
    }));

    const deviceTypes = { Mobile: 0, Desktop: 0, Tablet: 0, Unknown: 0 };

    accessLogs.forEach((log) => {
      const date = new Date(log.accessedAt);
      const hour = date.getHours();
      if (scansByHour[hour]) scansByHour[hour].count++;

      const ua = (log.userAgent || '').toLowerCase();
      if (ua.includes('iphone') || ua.includes('android') || ua.includes('mobile')) {
        deviceTypes.Mobile++;
      } else if (ua.includes('ipad') || ua.includes('tablet')) {
        deviceTypes.Tablet++;
      } else if (ua.includes('windows') || ua.includes('macintosh') || ua.includes('linux')) {
        deviceTypes.Desktop++;
      } else {
        deviceTypes.Unknown++;
      }
    });

    // Daily scans over last 14 days
    const last14Days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = accessLogs.filter((l) => l.accessedAt && l.accessedAt.toISOString().startsWith(dateStr)).length;
      last14Days.push({
        date: dateStr,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count,
      });
    }

    // Top scanned profiles
    const scanCountByProfile = {};
    accessLogs.forEach((l) => {
      const pId = l.qrProfileId;
      const userName = l.qrProfile?.user?.name || 'Anonymous Patient';
      if (!scanCountByProfile[pId]) {
        scanCountByProfile[pId] = { name: userName, scans: 0, lastScan: l.accessedAt };
      }
      scanCountByProfile[pId].scans++;
    });
    const topScannedPatients = Object.values(scanCountByProfile)
      .sort((a, b) => b.scans - a.scans)
      .slice(0, 5);

    // 5. Automated Clinical Insights & Risk Indicators
    const insights = [];
    if (bloodGroupCounts['O-'] > 0) {
      insights.push({
        type: 'critical',
        category: 'Blood Reserve',
        title: 'Universal Blood Donors Available',
        description: `${bloodGroupCounts['O-']} registered patient(s) have O- Negative (universal donor) blood, critical for emergency transfusions.`,
      });
    }
    const highRiskAllergiesCount = allergyStats.reduce((sum, a) => sum + a.count, 0);
    if (highRiskAllergiesCount > 0) {
      insights.push({
        type: 'warning',
        category: 'Anaphylaxis Alert',
        title: 'Severe Drug & Food Allergies Registered',
        description: `${highRiskAllergiesCount} severe drug/food allergies flagged. First responders should inspect digital allergy badges before administering antibiotics or NSAIDs.`,
      });
    }
    const donorPercentage = totalMedicalProfiles > 0 ? Math.round((donorCount / totalMedicalProfiles) * 100) : 0;
    insights.push({
      type: 'info',
      category: 'Organ Registry',
      title: `${donorPercentage}% Organ Donation Pledge Rate`,
      description: `${donorCount} out of ${totalMedicalProfiles} patients are verified registered organ donors.`,
    });
    if (totalUsers > 0 && totalMedicalProfiles < totalUsers) {
      const missingCount = totalUsers - totalMedicalProfiles;
      insights.push({
        type: 'action',
        category: 'Compliance',
        title: `${missingCount} Patient(s) Incomplete`,
        description: `${missingCount} user accounts lack medical profiles. Remind patients to complete their emergency details to activate their QR code.`,
      });
    }

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        totalUsers,
        activeUsers,
        totalMedicalProfiles,
        profileCompletionRate: totalUsers > 0 ? Math.round((totalMedicalProfiles / totalUsers) * 100) : 0,
        totalQRProfiles,
        totalScans,
        averageAge,
        donorRate: donorPercentage,
        insuredRate: totalMedicalProfiles > 0 ? Math.round((insuredCount / totalMedicalProfiles) * 100) : 0,
        smokersRate: totalMedicalProfiles > 0 ? Math.round((smokersCount / totalMedicalProfiles) * 100) : 0,
      },
      bloodGroups: {
        distribution: bloodGroupDistribution,
        universalDonorsCount: bloodGroupCounts['O-'],
        universalRecipientsCount: bloodGroupCounts['AB+'],
      },
      demographics: {
        gender: genderCounts,
        ageGroups,
      },
      clinical: {
        conditions: conditionStats,
        allergies: allergyStats,
        topInsurers,
      },
      scans: {
        timeline: last14Days,
        hourly: scansByHour,
        devices: deviceTypes,
        topScannedPatients,
      },
      insights,
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
  getAnalytics,
};
