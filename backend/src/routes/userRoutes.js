const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { updateMe, deleteMe } = require('../controllers/userController');

router.put('/me', authenticateToken, updateMe);
router.delete('/me', authenticateToken, deleteMe);

module.exports = router;
