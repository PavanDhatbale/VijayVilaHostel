const express = require('express');
const router = express.Router();
const {
    createNotice,
    getNotices,
    markAsRead,
    getUnreadCount,
    deleteNotice
} = require('../controllers/noticeController');
const { protect, manager, monitor } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Creation and deletion restricted to manager/monitor
router.post('/', createNotice);
router.delete('/:id', deleteNotice);

// Fetching and read status for all authenticated users
router.get('/', getNotices);
router.get('/unread-count', getUnreadCount);
router.post('/:id/read', markAsRead);

module.exports = router;
