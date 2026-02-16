const express = require('express');
const router = express.Router();
const {
    createRequest,
    getMonitorRequests,
    getRequestPayments,
    updatePaymentStatus,
    getActiveRequests,
    uploadPayment,
    getMyPaymentStatus
} = require('../controllers/contributionController');
const { protect, monitor, student } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Monitor Routes
router.post('/', protect, monitor, upload.single('qrCode'), createRequest);
router.get('/monitor', protect, monitor, getMonitorRequests);
router.get('/:id/payments', protect, monitor, getRequestPayments);
router.patch('/payments/:id/status', protect, monitor, updatePaymentStatus);

// Student Routes
router.get('/active', protect, student, getActiveRequests);
router.post('/payments/upload', protect, student, upload.single('screenshot'), uploadPayment);
router.get('/payments/my-status', protect, student, getMyPaymentStatus);

module.exports = router;
