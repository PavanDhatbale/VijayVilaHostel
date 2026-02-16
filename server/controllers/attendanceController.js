const User = require('../models/User');
const Attendance = require('../models/Attendance');

// @desc    Mark or update attendance
// @route   POST /api/attendance/mark
// @access  Private/Monitor
const markAttendance = async (req, res) => {
    try {
        const { studentId, status, date } = req.body;

        if (!studentId || !status || !date) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Validate future date
        const inputDate = new Date(date);
        inputDate.setUTCHours(0, 0, 0, 0);
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        if (inputDate > today) {
            return res.status(400).json({ message: 'Cannot mark attendance for future dates' });
        }

        const student = await User.findById(studentId);
        if (!student || student.role !== 'student' || student.admissionStatus !== 'approved' || !student.roomNumber || !student.bedNumber) {
            return res.status(400).json({ message: 'Invalid student for attendance' });
        }

        // Upsert logic
        const filter = { student: studentId, date: inputDate };
        const update = {
            status,
            markedBy: req.user._id,
            roomNo: student.roomNumber,
            bedNo: student.bedNumber,
            createdAt: Date.now()
        };

        const attendance = await Attendance.findOneAndUpdate(filter, update, {
            new: true,
            upsert: true
        });

        // Recalculate attendance percentage for the student
        const allAttendance = await Attendance.find({ student: studentId });
        const totalSessions = allAttendance.length;
        const presentSessions = allAttendance.filter(a => a.status === 'present').length;
        const percentage = totalSessions > 0 ? (presentSessions / totalSessions) * 100 : 100;

        await User.findByIdAndUpdate(studentId, { attendancePercentage: Math.round(percentage) });

        res.status(200).json({
            message: 'Attendance marked successfully',
            attendance
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get attendance history for a student
// @route   GET /api/attendance/history?studentId=&from=&to=
// @access  Private
const getAttendanceHistory = async (req, res) => {
    try {
        const { studentId, from, to } = req.query;

        let query = {};

        // Security: If the user is a student, they can ONLY see their own attendance
        if (req.user.role === 'student') {
            query.student = req.user._id;
        } else if (studentId) {
            // Monitors/Managers can specify a studentId
            query.student = studentId;
        } else {
            return res.status(400).json({ message: 'Student ID is required' });
        }

        if (from || to) {
            query.date = {};
            if (from) {
                const start = new Date(from);
                start.setUTCHours(0, 0, 0, 0);
                query.date.$gte = start;
            }
            if (to) {
                const end = new Date(to);
                end.setUTCHours(23, 59, 59, 999);
                query.date.$lte = end;
            }
        }

        const history = await Attendance.find(query).sort({ date: 1 }).populate('markedBy', 'name');

        res.status(200).json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    markAttendance,
    getAttendanceHistory
};
