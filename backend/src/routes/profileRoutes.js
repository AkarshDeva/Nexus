const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getMyProfile, updateMyProfile } = require('../controllers/profileController');

// GET /api/profile/me
router.get('/me', authMiddleware, getMyProfile);

// PUT /api/profile/me
router.put('/me', authMiddleware, updateMyProfile);

module.exports = router;