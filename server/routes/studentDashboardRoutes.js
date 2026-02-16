const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const checkAdmissionStatus = require('../middleware/checkAdmissionStatus');

// Protect all routes in this router with both authentication and admission status check
router.use(protect);
router.use(checkAdmissionStatus);

// @desc    Get student dashboard data (Placeholder)
// @route   GET /api/student-dashboard/overview
router.get('/overview', (req, res) => {
    res.status(200).json({
        message: 'Welcome to your student dashboard!',
        attendance: '92%',
        room: '2A',
        bed: '5'
    });
});

// @desc    Get student's own attendance data
// @route   GET /api/student-dashboard/attendance
router.get('/attendance', async (req, res) => {
    try {
        const Attendance = require('../models/Attendance');
        const attendance = await Attendance.find({ student: req.user._id }).sort({ date: -1 });

        // Calculate monthly percentage
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const firstDayOfMonth = new Date(today.getUTCFullYear(), today.getUTCMonth(), 1);
        const monthAttendance = attendance.filter(a => {
            const aDate = new Date(a.date);
            return aDate >= firstDayOfMonth;
        });
        const presentCount = monthAttendance.filter(a => a.status === 'present').length;
        const totalMarked = monthAttendance.length;
        const percentage = totalMarked > 0 ? (presentCount / totalMarked) * 100 : 0;

        res.status(200).json({
            history: attendance,
            percentage: Math.round(percentage),
            todayStatus: attendance.find(a => {
                const aDate = new Date(a.date);
                aDate.setUTCHours(0, 0, 0, 0);
                return aDate.getTime() === today.getTime();
            })?.status || 'pending'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
