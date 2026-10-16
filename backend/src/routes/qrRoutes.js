const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getMyQR, generateQR, regenerateQR, toggleQRStatus } = require('../controllers/qrController');

router.get('/', authenticateToken, getMyQR);
router.post('/generate', authenticateToken, generateQR);
router.post('/regenerate', authenticateToken, regenerateQR);
router.patch('/toggle', authenticateToken, toggleQRStatus);

module.exports = router;
