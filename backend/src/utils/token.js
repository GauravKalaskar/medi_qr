const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

const generateSecureQRToken = () => {
  return `med_qr_${crypto.randomBytes(16).toString('hex')}`;
};

module.exports = {
  generateToken,
  verifyToken,
  generateSecureQRToken,
};
