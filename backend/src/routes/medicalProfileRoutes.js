const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { authenticateToken } = require('../middleware/authMiddleware');
const { medicalProfileSchema } = require('../validators/profileValidator');
const { getProfile, upsertProfile } = require('../controllers/medicalProfileController');

router.get('/', authenticateToken, getProfile);
router.post('/', authenticateToken, validate(medicalProfileSchema), upsertProfile);
router.put('/', authenticateToken, validate(medicalProfileSchema), upsertProfile);

module.exports = router;
