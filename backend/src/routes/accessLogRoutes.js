const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getMyAccessLogs } = require('../controllers/accessLogController');

router.get('/', authenticateToken, getMyAccessLogs);

module.exports = router;
