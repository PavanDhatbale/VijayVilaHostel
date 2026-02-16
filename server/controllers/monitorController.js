const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Notice = require('../models/Notice');

// @desc    Get all active & approved students with today's attendance status
// @route   GET /api/monitor/students
// @access  Private/Monitor
const getMonitorStudents = async (req, res) => {
    try {
        const dateStr = req.query.date;
        let queryDate = new Date();
        if (dateStr) {
            queryDate = new Date(dateStr);
        }
        queryDate.setUTCHours(0, 0, 0, 0);

        // Fetch students who are approved and have room/bed assigned
        // Handling possibly missing/empty roomNumber/bedNumber fields
        // Also handling missing studentStatus (treating missing as active)
        const students = await User.find({
            role: 'student',
            admissionStatus: 'approved',
            roomNumber: { $exists: true, $ne: null, $ne: '' },
            bedNumber: { $exists: true, $ne: null, $ne: '' },
            $or: [
                { studentStatus: 'active' },
                { studentStatus: { $exists: false } },
                { studentStatus: null }
            ]
        }).select('name roomNumber bedNumber email').lean();

        const attendanceRecords = await Attendance.find({
            date: queryDate,
            student: { $in: students.map(s => s._id) }
        }).lean();

        const studentsWithAttendance = students.map(student => {
            const record = attendanceRecords.find(r => r.student.toString() === student._id.toString());
            return {
                ...student,
                attendanceStatus: record ? record.status : 'pending'
            };
        });

        res.status(200).json(studentsWithAttendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get daily attendance summary
// @route   GET /api/monitor/summary?date=YYYY-MM-DD
// @access  Private/Monitor
const getAttendanceSummary = async (req, res) => {
    try {
        const dateStr = req.query.date;
        let queryDate = new Date();
        if (dateStr) {
            queryDate = new Date(dateStr);
        }
        queryDate.setUTCHours(0, 0, 0, 0);

        // Fetch Total Active Students for stats (excluding monitors here if just student count needed, but user asked for vacant beds context)
        // Let's keep total 'students' as just students for the count, but use the fuller logic for beds.

        const totalStudentsCount = await User.countDocuments({
            role: 'student',
            admissionStatus: 'approved',
            studentStatus: 'active'
        });

        // Calculate vacant beds - LOGIC MATCHING MANAGER CONTROLLER
        // Capacity is 14
        const TOTAL_CAPACITY = 14;

        const occupiedBeds = await User.countDocuments({
            role: { $in: ['student', 'monitor'] },
            admissionStatus: 'approved',
            studentStatus: 'active',
            roomNumber: { $exists: true, $ne: null, $ne: '' },
            bedNumber: { $exists: true, $ne: null, $ne: '' }
        });

        const vacantBeds = Math.max(0, TOTAL_CAPACITY - occupiedBeds);

        // Attendance stats (for students only, usually monitors mark their own separately or are assumed present)
        // The original code filtered attendanceRecords by student IDs.
        // Let's make sure we are consistent.
        // The attendance summary usually refers to the students the monitor is monitoring.

        const studentsForAttendance = await User.find({
            role: 'student',
            admissionStatus: 'approved',
            $or: [
                { studentStatus: 'active' },
                { studentStatus: { $exists: false } },
                { studentStatus: null }
            ]
        }).select('_id');

        const attendanceRecords = await Attendance.find({
            date: queryDate,
            student: { $in: studentsForAttendance.map(s => s._id) }
        }).lean();

        const present = attendanceRecords.filter(r => r.status === 'present').length;
        const absent = attendanceRecords.filter(r => r.status === 'absent').length;
        const pending = Math.max(0, studentsForAttendance.length - (present + absent));

        res.status(200).json({
            totalStudents: totalStudentsCount,
            vacantBeds,
            present,
            absent,
            pending
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get recent activities for the monitor
// @route   GET /api/monitor/activities
// @access  Private/Monitor
const getMonitorActivities = async (req, res) => {
    try {
        // Fetch last 5 attendance markings by this monitor
        const attendanceActivities = await Attendance.find({ markedBy: req.user._id })
            .populate('student', 'name')
            .sort({ createdAt: -1 })
            .limit(15)
            .lean();

        // Fetch last 5 notices sent by this monitor
        const noticeActivities = await Notice.find({ sender: req.user._id })
            .sort({ createdAt: -1 })
            .limit(15)
            .lean();

        // Transform and combine
        const transformedAttendance = attendanceActivities.map(a => ({
            id: `att-${a._id}`,
            title: `Attendance marked for ${a.student?.name || 'Student'}`,
            time: a.createdAt,
            type: 'Attendance',
            icon: 'CheckCircle'
        }));

        const transformedNotices = noticeActivities.map(n => ({
            id: `ntc-${n._id}`,
            title: `Posted notice: ${n.title}`,
            time: n.createdAt,
            type: 'Notice',
            icon: 'Bell'
        }));

        const allActivities = [...transformedAttendance, ...transformedNotices]
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, 15);

        res.status(200).json(allActivities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get profile statistics for the monitor
// @route   GET /api/monitor/profile-stats
// @access  Private/Monitor
const getMonitorProfileStats = async (req, res) => {
    try {
        const attendanceCount = await Attendance.countDocuments({ markedBy: req.user._id });

        // Count messages sent by this monitor
        const messagesCount = await Notice.countDocuments({
            sender: req.user._id,
            category: 'Message'
        });

        // Count updates (Notices) posted by this monitor
        const updatesCount = await Notice.countDocuments({
            sender: req.user._id,
            category: { $ne: 'Message' }
        });

        res.status(200).json({
            attendanceCount,
            messagesCount,
            updatesCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getMonitorStudents,
    getAttendanceSummary,
    getMonitorActivities,
    getMonitorProfileStats
};
