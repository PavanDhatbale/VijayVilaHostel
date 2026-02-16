const LeaveApplication = require('../models/LeaveApplication');
const User = require('../models/User');

// @desc    Apply for leave
// @route   POST /api/leaves/apply
// @access  Student
const applyLeave = async (req, res) => {
    try {
        const { hostelName, startDate, returnDate, subject, description } = req.body;

        const leave = await LeaveApplication.create({
            student: req.user._id,
            hostelName: hostelName || 'Vijay Vila Hostel',
            startDate,
            returnDate,
            subject,
            description,
            status: 'pending'
        });

        res.status(201).json(leave);
    } catch (error) {
        console.error('Error applying for leave:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged in student's leave applications
// @route   GET /api/leaves/my-leaves
// @access  Student
const getStudentLeaves = async (req, res) => {
    try {
        const leaves = await LeaveApplication.find({ student: req.user._id }).sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        console.error('Error fetching student leaves:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all leave applications (for monitor)
// @route   GET /api/leaves/all-leaves
// @access  Monitor
const getMonitorLeaves = async (req, res) => {
    try {
        const leaves = await LeaveApplication.find()
            .populate('student', 'name roomNumber bedNumber')
            .sort({ createdAt: -1 });
        res.json(leaves);
    } catch (error) {
        console.error('Error fetching monitor leaves:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update leave status
// @route   PUT /api/leaves/:id/status
// @access  Monitor
const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const leave = await LeaveApplication.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave application not found' });
        }

        leave.status = status;
        await leave.save();

        res.json(leave);
    } catch (error) {
        console.error('Error updating leave status:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete leave application
// @route   DELETE /api/leaves/:id
// @access  Private
const deleteLeave = async (req, res) => {
    try {
        const leave = await LeaveApplication.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave application not found' });
        }

        // Check permissions
        // 1. Student can delete ONLY their own pending leaves
        if (req.user.role === 'student') {
            if (leave.student.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            if (leave.status !== 'pending') {
                return res.status(400).json({ message: 'Cannot delete processed applications' });
            }
        }
        // 2. Monitors/Managers can delete any leave (already protected by auth middleware)

        await LeaveApplication.findByIdAndDelete(req.params.id);
        res.json({ message: 'Leave application removed' });
    } catch (error) {
        console.error('Error deleting leave:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    applyLeave,
    getStudentLeaves,
    getMonitorLeaves,
    updateLeaveStatus,
    deleteLeave
};
