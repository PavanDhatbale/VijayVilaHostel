const express = require('express');
const router = express.Router();
const {
    getAllStudents,
    updateStudent,
    deleteStudent,
    getManagerSummary,
    getCurrentMonitor,
    assignMonitor,
    getMonitorHistory,
    addStudent,
    getManagerActivities,
    getManagerProfileStats,
    deleteMonitorHistory
} = require('../controllers/managerController');
const { protect, manager } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All routes here require manager authentication
router.use(protect);
router.use(manager);

// @route   GET /api/manager/students
router.get('/students', getAllStudents);

// @route   GET /api/manager/summary
router.get('/summary', getManagerSummary);

// @route   GET /api/manager/activities
router.get('/activities', getManagerActivities);

// @route   GET /api/manager/profile-stats
router.get('/profile-stats', getManagerProfileStats);

// @route   GET /api/manager/monitor
router.get('/monitor', getCurrentMonitor);

// @route   GET /api/manager/monitor-history
router.get('/monitor-history', getMonitorHistory);

// @route   DELETE /api/manager/monitor-history/:id
router.delete('/monitor-history/:id', deleteMonitorHistory);

// @route   POST /api/manager/assign-monitor/:studentId
router.post('/assign-monitor/:studentId', assignMonitor);

// @route   POST /api/manager/students
router.post('/students', upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'experienceVideo', maxCount: 1 }
]), addStudent);

// @route   PUT /api/manager/students/:studentId
router.put('/students/:studentId', upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'experienceVideo', maxCount: 1 }
]), updateStudent);

// @route   DELETE /api/manager/students/:studentId
router.delete('/students/:studentId', deleteStudent);

module.exports = router;
