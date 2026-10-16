const { prisma } = require('../config/env');

const getMyAccessLogs = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const qrProfile = await prisma.qRProfile.findUnique({
      where: { userId },
    });

    if (!qrProfile) {
      return res.json({
        success: true,
        logs: [],
        totalScans: 0,
      });
    }

    const logs = await prisma.accessLog.findMany({
      where: { qrProfileId: qrProfile.id },
      orderBy: { accessedAt: 'desc' },
      take: 50,
    });

    const totalScans = await prisma.accessLog.count({
      where: { qrProfileId: qrProfile.id },
    });

    return res.json({
      success: true,
      logs,
      totalScans,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyAccessLogs,
};
