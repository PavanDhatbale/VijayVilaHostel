const Notice = require('../models/Notice');
const NoticeReadStatus = require('../models/NoticeReadStatus');
const User = require('../models/User');
const LeaveApplication = require('../models/LeaveApplication');

// @desc    Create a new notice
// @route   POST /api/notices
// @access  Private (Manager/Monitor)
const createNotice = async (req, res) => {
    try {
        const { title, content, category, recipientType, priority } = req.body;

        // Role-based restrictions
        if (req.user.role === 'monitor' && !['ALL_STUDENTS', 'HOSTEL_MANAGER'].includes(recipientType)) {
            return res.status(403).json({ message: 'Monitors can only send updates to students or manager' });
        }

        const notice = await Notice.create({
            title,
            content,
            category: category || 'Announcement',
            sender: req.user._id,
            senderRole: req.user.role,
            recipientType,
            priority: priority || false
        });

        res.status(201).json({
            message: 'Notice created successfully',
            notice
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get notices based on user role
// @route   GET /api/notices
// @access  Private
const getNotices = async (req, res) => {
    try {
        let query = { isActive: true };

        if (req.user.role === 'student') {
            query.recipientType = 'ALL_STUDENTS';
        } else if (req.user.role === 'monitor') {
            // Monitor sees messages for them OR messages they sent
            query.$or = [
                { recipientType: 'MONITOR' },
                { sender: req.user._id }
            ];
        } else if (req.user.role === 'hostelManager') {
            // Manager sees:
            // 1. Everything they sent
            // 2. Messages sent TO them (recipientType: HOSTEL_MANAGER)
            // 3. Messages sent TO monitor (for oversight)
            // 4. Messages sent TO all students (for oversight)
            query.$or = [
                { sender: req.user._id },
                { recipientType: 'HOSTEL_MANAGER' },
                { recipientType: 'MONITOR' },
                { recipientType: 'ALL_STUDENTS' }
            ];
        }

        const notices = await Notice.find(query)
            .populate('sender', 'name role')
            .sort({ createdAt: -1 })
            .limit(15);

        // If student or monitor, attach read status and filter hidden ones
        if (req.user.role === 'student' || req.user.role === 'monitor' || req.user.role === 'hostelManager') {
            const readStatuses = await NoticeReadStatus.find({ user: req.user._id });
            const readNoticeIds = readStatuses.filter(s => s.isRead).map(s => s.notice.toString());
            const hiddenNoticeIds = readStatuses.filter(s => s.isHidden).map(s => s.notice.toString());

            // Filter out hidden notices
            const visibleNotices = notices.filter(n => !hiddenNoticeIds.includes(n._id.toString()));

            const noticesWithReadStatus = visibleNotices.map(notice => ({
                ...notice.toObject(),
                isRead: readNoticeIds.includes(notice._id.toString())
            }));

            return res.json(noticesWithReadStatus);
        }

        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Mark notice as read
// @route   POST /api/notices/:id/read
// @access  Private (Student)
const markAsRead = async (req, res) => {
    try {
        const noticeId = req.params.id;

        await NoticeReadStatus.findOneAndUpdate(
            { notice: noticeId, user: req.user._id },
            { isRead: true, readAt: new Date() },
            { upsert: true, new: true }
        );

        res.json({ message: 'Notice marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get unread count for badges
// @route   GET /api/notices/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
    try {
        let totalQuery = { isActive: true };

        if (req.user.role === 'student') {
            totalQuery.recipientType = 'ALL_STUDENTS';
        } else if (req.user.role === 'monitor') {
            totalQuery.recipientType = 'MONITOR'; // Only count direct messages or specific updates
        } else if (req.user.role === 'hostelManager') {
            totalQuery.recipientType = 'HOSTEL_MANAGER';
        } else {
            return res.json({ unreadCount: 0 });
        }

        // Get IDs of hidden notices to exclude from count
        const hiddenStatuses = await NoticeReadStatus.find({ user: req.user._id, isHidden: true });
        const hiddenNoticeIds = hiddenStatuses.map(s => s.notice);

        if (hiddenNoticeIds.length > 0) {
            totalQuery._id = { $nin: hiddenNoticeIds };
        }

        const totalNotices = await Notice.countDocuments(totalQuery);
        const readCount = await NoticeReadStatus.countDocuments({
            user: req.user._id,
            isRead: true,
            // Only count read status for notices that are still active and for this role
            notice: { $in: await Notice.find(totalQuery).distinct('_id') }
        });

        let pendingAdmissionsCount = 0;
        if (req.user.role === 'hostelManager') {
            pendingAdmissionsCount = await User.countDocuments({
                role: 'student',
                admissionStatus: 'pending'
            });
        }

        let pendingLeavesCount = 0;
        if (req.user.role && req.user.role.toLowerCase() === 'monitor') {
            pendingLeavesCount = await LeaveApplication.countDocuments({
                status: 'pending'
            });
        }

        const unreadNoticesCount = Math.max(0, totalNotices - readCount);

        res.json({
            unreadCount: unreadNoticesCount + pendingAdmissionsCount + pendingLeavesCount,
            unreadNotices: unreadNoticesCount,
            pendingAdmissions: pendingAdmissionsCount,
            pendingLeaves: pendingLeavesCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete notice (only own) or Hide if recipient
// @route   DELETE /api/notices/:id
// @access  Private
const deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);

        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }

        // Only sender can delete, but Manager can delete any notice (admin)
        // Also allow Monitor to delete messages sent TO them (recipientType: 'MONITOR')
        const isSender = notice.sender.toString() === req.user._id.toString();
        const isManager = req.user.role === 'hostelManager';
        const isMonitor = req.user.role === 'monitor';
        const isStudent = req.user.role === 'student';

        // Logic:
        // 1. Manager -> Can Delete Anything (Hard Delete)
        // 2. Sender -> Can Delete Own (Hard Delete)
        // 3. Recipient (Student/Monitor) -> Can "Hide" (Soft Delete)

        if (isManager || isSender) {
            await notice.deleteOne();
            return res.json({ message: 'Notice removed permanently' });
        }

        // If not manager/sender, check if they are a valid recipient to allow hiding
        // Students receive 'ALL_STUDENTS', Monitors receive 'MONITOR' (or 'ALL_STUDENTS' depending on logic, but usually explicit)
        let canHide = false;
        if (isStudent && notice.recipientType === 'ALL_STUDENTS') canHide = true;
        if (isMonitor && notice.recipientType === 'MONITOR') canHide = true;

        if (canHide) {
            await NoticeReadStatus.findOneAndUpdate(
                { notice: notice._id, user: req.user._id },
                { isHidden: true, isRead: true }, // Mark read too if hidden
                { upsert: true, new: true }
            );
            return res.json({ message: 'Notice removed from view' });
        }

        return res.status(403).json({ message: 'Not authorized to delete this notice' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createNotice,
    getNotices,
    markAsRead,
    getUnreadCount,
    deleteNotice
};
