const express = require('express');
const router = express.Router();
const {
    applyForAdmission,
    getAllAdmissions,
    approveAdmission,
    rejectAdmission,
    deleteAdmission,
    acceptAdmission
} = require('../controllers/admissionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Student routes
router.post('/apply', protect, authorize('student'), upload.fields([
    { name: 'tenthMarksheet', maxCount: 1 },
    { name: 'twelfthMarksheet', maxCount: 1 },
    { name: 'incomeCertificate', maxCount: 1 },
    { name: 'aadhaarCard', maxCount: 1 }
]), applyForAdmission);

// Manager routes
router.get('/', protect, authorize('hostelManager'), getAllAdmissions);
router.put('/:id/approve', protect, authorize('hostelManager'), approveAdmission);
router.put('/:id/reject', protect, authorize('hostelManager'), rejectAdmission);
router.delete('/:id', protect, authorize('hostelManager'), deleteAdmission);

// Student accept route
router.put('/accept', protect, authorize('student'), acceptAdmission);

module.exports = router;
