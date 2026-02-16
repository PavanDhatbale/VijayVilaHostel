const express = require('express');
const router = express.Router();
const { getMonitorStudents, getAttendanceSummary, getMonitorActivities, getMonitorProfileStats } = require('../controllers/monitorController');
const { protect, authorize } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All routes here require monitor authentication
router.use(protect);
router.use(roleMiddleware.authorize('monitor'));

// @route   GET /api/monitor/students
router.get('/students', getMonitorStudents);

// @route   GET /api/monitor/summary
router.get('/summary', getAttendanceSummary);

// @route   GET /api/monitor/activities
router.get('/activities', getMonitorActivities);

// @route   GET /api/monitor/profile-stats
router.get('/profile-stats', getMonitorProfileStats);

module.exports = router;
