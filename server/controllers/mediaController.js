const Media = require('../models/Media');
const { deleteFromCloudinary } = require('../config/cloudinary');
const uploadToCloudinaryStream = require('../utils/cloudinaryStream');
const cloudinary = require('cloudinary').v2;

// @desc    Upload media for student gallery
// @route   POST /api/media/upload
// @access  Private/Student
const uploadMedia = async (req, res) => {
    try {
        const { caption } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const isVideo = req.file.mimetype.startsWith('video');
        const mediaType = isVideo ? 'video' : 'photo';

        // Upload to Cloudinary
        // Folder: hostel/students/media/{studentId}
        const folder = `students/media/${req.user._id}`;
        const uploadResult = await uploadToCloudinaryStream(req.file.buffer, folder, isVideo ? 'video' : 'image');

        // Save to DB
        const media = await Media.create({
            student: req.user._id,
            mediaType,
            mediaUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            caption: caption || ''
        });

        res.status(201).json({
            message: 'Media uploaded successfully',
            media
        });
    } catch (error) {
        // Log error and respond
        console.error('Media Upload Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get student media (Personal Gallery)
// @route   GET /api/media/student/:studentId
// @access  Private (Student, Manager, Monitor-read)
const getStudentMedia = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Authorization check: 
        // 1. If requester is a student, they can only view their own media
        // 2. Managers and Monitors can view anyone's media
        if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
            return res.status(403).json({ message: 'Not authorized to view this gallery' });
        }

        const media = await Media.find({ student: studentId, isActive: true }).sort({ createdAt: -1 });
        res.json(media);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete media
// @route   DELETE /api/media/:mediaId
// @access  Private/Student (Owner only)
const deleteMedia = async (req, res) => {
    try {
        const media = await Media.findById(req.params.mediaId);

        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }

        // Only the owner (student) or a manager can delete media
        const isOwner = media.student.toString() === req.user._id.toString();
        const isManager = req.user.role === 'hostelManager';

        if (!isOwner && !isManager) {
            return res.status(403).json({ message: 'Not authorized to delete this media' });
        }

        // Delete from Cloudinary
        await deleteFromCloudinary(media.publicId, media.mediaType === 'video' ? 'video' : 'image');

        // Delete from DB
        await Media.findByIdAndDelete(req.params.mediaId);

        res.json({ message: 'Media deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Upload profile image (Generic)
// @route   POST /api/media/profile-image
// @access  Private (All roles)
const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        // Check if it's an image
        if (!req.file.mimetype.startsWith('image')) {
            return res.status(400).json({ message: 'Only image files are allowed' });
        }

        // Upload to Cloudinary
        // Folder: hostel/profiles/{userId}
        const folder = `profiles/${req.user._id}`;
        const uploadResult = await uploadToCloudinaryStream(req.file.buffer, folder, 'image');

        // Return the URL directly - we don't create a Media document for profile pics
        // The frontend will save this URL to the User profile
        res.status(200).json({
            message: 'Image uploaded successfully',
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id
        });
    } catch (error) {
        console.error('Profile Image Upload Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    uploadMedia,
    getStudentMedia,
    deleteMedia,
    uploadProfileImage
};
