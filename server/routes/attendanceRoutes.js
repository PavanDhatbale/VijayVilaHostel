const express = require('express');
const router = express.Router();
const { markAttendance, getAttendanceHistory } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All routes here require authentication
router.use(protect);

// Only monitor can mark attendance
router.post('/mark', authorize('monitor'), markAttendance);

// Attendance history can be viewed by student/monitor
router.get('/history', getAttendanceHistory);

module.exports = router;
