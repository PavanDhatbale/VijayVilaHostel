const express = require('express');
const router = express.Router();
const {
    getFeaturedStudents,
    getFeaturedStudentById,
    addFeaturedStudent,
    updateFeaturedStudent,
    deleteFeaturedStudent,
    getGalleryItems,
    addGalleryItem,
    deleteGalleryItem,
    getHostelConfig,
    updateHostelConfig
} = require('../controllers/contentController');
const { protect } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/students', getFeaturedStudents);
router.get('/students/:id', getFeaturedStudentById);
router.get('/gallery', getGalleryItems);
router.get('/config', getHostelConfig);

// Manager only routes
router.post('/students', protect, roleMiddleware.authorize('hostelManager'), upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'experienceVideo', maxCount: 1 },
    { name: 'hostelGallery', maxCount: 5 }
]), addFeaturedStudent);
router.delete('/students/:id', protect, roleMiddleware.authorize('hostelManager'), deleteFeaturedStudent);
router.put('/students/:id', protect, roleMiddleware.authorize('hostelManager'), upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'experienceVideo', maxCount: 1 },
    { name: 'hostelGallery', maxCount: 5 }
]), updateFeaturedStudent);

router.post('/gallery', protect, roleMiddleware.authorize('hostelManager'), upload.single('media'), addGalleryItem);
router.post('/gallery', protect, roleMiddleware.authorize('hostelManager'), upload.single('media'), addGalleryItem);
router.delete('/gallery/:id', protect, roleMiddleware.authorize('hostelManager'), deleteGalleryItem);

router.put('/config', protect, roleMiddleware.authorize('hostelManager'), upload.fields([
    { name: 'ownerImage', maxCount: 1 },
    { name: 'heroImage', maxCount: 1 },
    { name: 'landingGallery', maxCount: 10 }
]), updateHostelConfig);

router.delete('/config/gallery/:id', protect, roleMiddleware.authorize('hostelManager'), require('../controllers/contentController').deleteLandingGalleryImage);

module.exports = router;
