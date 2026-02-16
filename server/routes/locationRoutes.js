const express = require('express');
const router = express.Router();
const { getLocation, updateLocation } = require('../controllers/locationController');
const { protect, manager } = require('../middleware/authMiddleware');

// @route   GET /api/hostel-location
// @access  Public
router.get('/', getLocation);

// @route   POST /api/hostel-location
// @access  Private (Manager only)
router.post('/', protect, manager, updateLocation);

module.exports = router;
