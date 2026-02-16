const express = require('express');
const router = express.Router();
const { protect, student, monitor } = require('../middleware/authMiddleware');
const {
    applyLeave,
    getStudentLeaves,
    getMonitorLeaves,
    updateLeaveStatus
} = require('../controllers/leaveController');

// Student routes
router.post('/apply', protect, student, applyLeave);
router.get('/my-leaves', protect, student, getStudentLeaves);

// Monitor routes
router.get('/all-leaves', protect, monitor, getMonitorLeaves);
router.put('/:id/status', protect, monitor, updateLeaveStatus);
router.delete('/:id', protect, require('../controllers/leaveController').deleteLeave);

module.exports = router;
