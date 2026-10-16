const express = require('express');
const router = express.Router();
const { getPublicProfileByToken } = require('../controllers/publicController');

router.get('/medical/:token', getPublicProfileByToken);

module.exports = router;
