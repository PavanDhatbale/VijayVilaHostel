const express = require('express');
const router = express.Router();
const { signup, verifyEmail, login, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/auth/signup
router.post('/signup', signup);

// @route   GET /api/auth/verify-email
router.get('/verify-email', verifyEmail);

// @route   GET /api/users/verify/:token
router.get('/verify/:token', verifyEmail);

// @route   GET /api/auth/verify
router.get('/verify', verifyEmail);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/profile
router.get('/profile', protect, getProfile);

// @route   PUT /api/auth/profile
router.put('/profile', protect, updateProfile);

module.exports = router;
