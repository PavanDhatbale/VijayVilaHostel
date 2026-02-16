const express = require('express');
const router = express.Router();
const {
    uploadMedia,
    getStudentMedia,
    deleteMedia
} = require('../controllers/mediaController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All media routes require authentication
router.use(protect);

// Student only: Upload media
router.post('/upload', upload.single('media'), uploadMedia);

// All roles: Upload profile image
router.post('/profile-image', upload.single('image'), require('../controllers/mediaController').uploadProfileImage);

// Delete media (Owner only checked in controller)
router.delete('/:mediaId', deleteMedia);

// Get student's media (Student, Manager, Monitor)
router.get('/student/:studentId', getStudentMedia);

module.exports = router;
