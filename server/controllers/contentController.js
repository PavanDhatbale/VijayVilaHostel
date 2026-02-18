const FeaturedStudent = require('../models/FeaturedStudent');
const GalleryItem = require('../models/GalleryItem');
const HostelConfig = require('../models/HostelConfig');
const { deleteFromCloudinary } = require('../config/cloudinary');
const uploadToCloudinaryStream = require('../utils/cloudinaryStream');

// @desc    Get all featured students
// @route   GET /api/public/students
// @access  Public
const getFeaturedStudents = async (req, res) => {
    try {
        const students = await FeaturedStudent.find().sort({ createdAt: -1 });
        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get featured student by id
// @route   GET /api/public/students/:id
// @access  Public
const getFeaturedStudentById = async (req, res) => {
    try {
        const student = await FeaturedStudent.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a featured student
// @route   POST /api/public/students
// @access  Private/Manager
const addFeaturedStudent = async (req, res) => {
    let uploadedMedia = null;
    let uploadedVideo = null;
    let uploadedGallery = [];
    try {
        if (!req.files || !req.files['image']) {
            return res.status(400).json({ message: 'Please upload a profile photo' });
        }

        // Upload profile image to Cloudinary
        uploadedMedia = await uploadToCloudinaryStream(req.files['image'][0].buffer, 'students/profile', 'image');

        // Handle optional experience video
        if (req.files['experienceVideo']) {
            try {
                uploadedVideo = await uploadToCloudinaryStream(req.files['experienceVideo'][0].buffer, 'students/videos', 'video');
            } catch (err) {
                console.error('Video upload failed:', err);
                throw new Error('Experience video upload failed (possibly too large)');
            }
        }

        // Handle optional hostel gallery images (up to 5)
        if (req.files['hostelGallery']) {
            for (const file of req.files['hostelGallery']) {
                try {
                    const galleryImg = await uploadToCloudinaryStream(file.buffer, 'students/gallery', 'image');
                    uploadedGallery.push({
                        url: galleryImg.url,
                        publicId: galleryImg.public_id
                    });
                } catch (err) {
                    console.error('Gallery image upload failed:', err);
                    throw new Error('Gallery image upload failed');
                }
            }
        }

        const { keyAchievements, socials, ...rest } = req.body;

        // Parse keyAchievements if string
        let achievementsArray = [];
        if (keyAchievements) {
            try {
                achievementsArray = JSON.parse(keyAchievements);
            } catch (e) {
                achievementsArray = typeof keyAchievements === 'string'
                    ? keyAchievements.split(',').map(a => a.trim()).filter(a => a !== '')
                    : [keyAchievements];
            }
        }

        // Parse socials if string
        let socialsObj = socials;
        if (typeof socials === 'string') {
            socialsObj = JSON.parse(socials);
        }

        const studentData = {
            ...rest,
            keyAchievements: achievementsArray,
            socials: socialsObj,
            profileImage: {
                url: uploadedMedia.url,
                publicId: uploadedMedia.public_id
            },
            experienceVideo: uploadedVideo ? {
                url: uploadedVideo.url,
                publicId: uploadedVideo.public_id
            } : null,
            hostelGallery: uploadedGallery
        };

        const student = new FeaturedStudent(studentData);
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        // Cleanup Cloudinary if DB save fails
        if (uploadedMedia) await deleteFromCloudinary(uploadedMedia.public_id);
        if (uploadedVideo) await deleteFromCloudinary(uploadedVideo.public_id, 'video');
        for (const img of uploadedGallery) {
            await deleteFromCloudinary(img.publicId);
        }

        console.error('Add Featured Student Error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Update a featured student
// @route   PUT /api/public/students/:id
// @access  Private/Manager
const updateFeaturedStudent = async (req, res) => {
    try {
        const student = await FeaturedStudent.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // --- 1. Handle Profile Image Deletion (if requested and NO new image uploaded) ---
        // If a new image IS uploaded, the existing code below will handle the replacement.
        // We only need to act if delete is requested explicitly.
        if (req.body.deleteProfileImage === 'true' && (!req.files || !req.files['image'])) {
            if (student.profileImage && student.profileImage.publicId) {
                await deleteFromCloudinary(student.profileImage.publicId);
            }
            // Reset to default or null. 
            // Schema has a default URL. 
            // Setting it to null might break frontend if it expects a URL.
            // Let's check schema... it has a default. 
            // So we can set it to the default object structure or just undefined?
            // Mongoose defaults apply on creation. On update, we explicitly set it.
            student.profileImage = {
                url: 'https://images.unsplash.com/photo-1544526226-d4568090ffb8?q=80&w=2070', // Default from schema
                publicId: null
            };
        }

        // --- 2. Handle Profile Image Upload (Replacement) ---
        if (req.files && req.files['image']) {
            // Delete old image
            if (student.profileImage && student.profileImage.publicId) {
                await deleteFromCloudinary(student.profileImage.publicId);
            }
            // Upload new image
            const uploadedMedia = await uploadToCloudinaryStream(req.files['image'][0].buffer, 'students/profile', 'image');
            student.profileImage = {
                url: uploadedMedia.url,
                publicId: uploadedMedia.public_id
            };
        }

        // --- 3. Handle Video Update ---
        if (req.files && req.files['experienceVideo']) {
            // Delete old video
            if (student.experienceVideo && student.experienceVideo.publicId) {
                await deleteFromCloudinary(student.experienceVideo.publicId, 'video');
            }
            try {
                const uploadedVideo = await uploadToCloudinaryStream(req.files['experienceVideo'][0].buffer, 'students/videos', 'video');
                student.experienceVideo = {
                    url: uploadedVideo.url,
                    publicId: uploadedVideo.public_id
                };
            } catch (err) {
                console.error('Video update failed:', err);
                return res.status(500).json({ message: 'Video upload failed' });
            }
        }

        // --- 4. Handle Gallery Image Deletion ---
        if (req.body.deletedGalleryImages) {
            let imagesToDelete = [];
            try {
                imagesToDelete = JSON.parse(req.body.deletedGalleryImages);
            } catch (e) {
                console.error('Error parsing deletedGalleryImages:', e);
            }

            if (Array.isArray(imagesToDelete) && imagesToDelete.length > 0) {
                // Filter out the images to be deleted from student's gallery
                // and delete them from Cloudinary
                const newGallery = [];
                for (const img of student.hostelGallery) {
                    if (imagesToDelete.includes(img._id.toString())) { // Compare distinct IDs
                        if (img.publicId) {
                            await deleteFromCloudinary(img.publicId);
                        }
                    } else {
                        newGallery.push(img);
                    }
                }
                student.hostelGallery = newGallery;
            }
        }

        // --- 5. Handle Gallery Image Append (Uploads) ---
        if (req.files && req.files['hostelGallery']) {
            for (const file of req.files['hostelGallery']) {
                try {
                    const galleryImg = await uploadToCloudinaryStream(file.buffer, 'students/gallery', 'image');
                    student.hostelGallery.push({
                        url: galleryImg.url,
                        publicId: galleryImg.public_id
                    });
                } catch (err) {
                    console.error('Gallery image upload failed:', err);
                }
            }
        }

        // Update text fields
        const { keyAchievements, socials, ...rest } = req.body;

        // Parse keyAchievements
        if (keyAchievements) {
            let achievementsArray = [];
            try {
                achievementsArray = JSON.parse(keyAchievements);
            } catch (e) {
                achievementsArray = typeof keyAchievements === 'string'
                    ? keyAchievements.split(',').map(a => a.trim()).filter(a => a !== '')
                    : [keyAchievements];
            }
            student.keyAchievements = achievementsArray;
        }

        // Parse socials
        if (socials) {
            let socialsObj = socials;
            if (typeof socials === 'string') {
                try {
                    socialsObj = JSON.parse(socials);
                } catch (e) {
                    console.error('Socials parse error', e);
                }
            }
            student.socials = socialsObj;
        }

        // Update other fields
        // Exclude delete flags and special fields handled above
        const fieldsToExclude = ['deleteProfileImage', 'deletedGalleryImages', 'keyAchievements', 'socials'];
        Object.keys(rest).forEach(key => {
            if (!fieldsToExclude.includes(key)) {
                student[key] = rest[key];
            }
        });

        await student.save();
        res.status(200).json(student);

    } catch (error) {
        console.error('Update Featured Student Error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Delete a featured student
// @route   DELETE /api/public/students/:id
// @access  Private/Manager
const deleteFeaturedStudent = async (req, res) => {
    try {
        const student = await FeaturedStudent.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Delete from Cloudinary
        if (student.profileImage && student.profileImage.publicId) {
            await deleteFromCloudinary(student.profileImage.publicId);
        }

        await FeaturedStudent.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Delete Featured Student Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get gallery items
// @route   GET /api/public/gallery
// @access  Public
const getGalleryItems = async (req, res) => {
    try {
        const { mediaType } = req.query;
        const query = { isActive: true };
        if (mediaType && mediaType !== 'all') {
            query.mediaType = mediaType;
        }
        const items = await GalleryItem.find(query).sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add gallery item
// @route   POST /api/public/gallery
// @access  Private/Manager
const addGalleryItem = async (req, res) => {
    let uploadedMedia = null;
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const { mediaType, title, description, date } = req.body;
        const folderMap = {
            photo: 'gallery/photos',
            video: 'gallery/videos',
            news: 'gallery/news'
        };

        const folder = folderMap[mediaType] || 'gallery/others';
        const resourceType = mediaType === 'video' ? 'video' : 'image';

        // Upload to Cloudinary
        uploadedMedia = await uploadToCloudinaryStream(req.file.buffer, folder, resourceType);

        const galleryItem = new GalleryItem({
            title,
            description,
            mediaType,
            date,
            mediaUrl: uploadedMedia.url,
            publicId: uploadedMedia.public_id,
            uploadedBy: req.user._id
        });

        await galleryItem.save();
        res.status(201).json(galleryItem);
    } catch (error) {
        // Cleanup Cloudinary if DB save fails
        if (uploadedMedia) {
            const resourceType = req.body.mediaType === 'video' ? 'video' : 'image';
            await deleteFromCloudinary(uploadedMedia.public_id, resourceType);
        }
        console.error('Add Gallery Item Error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Delete gallery item
// @route   DELETE /api/public/gallery/:id
// @access  Private/Manager
const deleteGalleryItem = async (req, res) => {
    try {
        const item = await GalleryItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Gallery item not found' });
        }

        // Delete from Cloudinary
        if (item.publicId) {
            const resourceType = item.mediaType === 'video' ? 'video' : 'image';
            await deleteFromCloudinary(item.publicId, resourceType);
        }

        await GalleryItem.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Gallery item deleted successfully' });
    } catch (error) {
        console.error('Delete Gallery Item Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get hostel config (owner details)
// @route   GET /api/public/config
// @access  Public
const getHostelConfig = async (req, res) => {
    try {
        const config = await HostelConfig.findOne();
        if (!config) {
            // Should be seeded or created on first access if using getSingleton approach, 
            // but finding one is safer. If not found, return defaults.
            const defaultConfig = new HostelConfig(); // Returns defaults from schema
            return res.status(200).json(defaultConfig);
        }
        res.status(200).json(config);
    } catch (error) {
        console.error('Get Config Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update hostel config
// @route   PUT /api/public/config
// @access  Private/Manager
const updateHostelConfig = async (req, res) => {
    try {
        let config = await HostelConfig.findOne();
        if (!config) {
            config = new HostelConfig();
        }

        // Handle owner image update
        if (req.files && req.files['ownerImage']) {
            if (config.ownerImage && config.ownerImage.publicId) {
                await deleteFromCloudinary(config.ownerImage.publicId);
            }
            const uploadedMedia = await uploadToCloudinaryStream(req.files['ownerImage'][0].buffer, 'hostel/config', 'image');
            config.ownerImage = {
                url: uploadedMedia.url,
                publicId: uploadedMedia.public_id
            };
        }

        // Handle hero image update
        if (req.files && req.files['heroImage']) {
            if (config.heroImage && config.heroImage.publicId) {
                await deleteFromCloudinary(config.heroImage.publicId);
            }
            const uploadedMedia = await uploadToCloudinaryStream(req.files['heroImage'][0].buffer, 'hostel/config', 'image');
            config.heroImage = {
                url: uploadedMedia.url,
                publicId: uploadedMedia.public_id
            };
        }

        // Handle hostel video update (Direct Upload or File Upload)
        if (req.body.videoUrl && req.body.videoPublicId) {
            // Direct upload from frontend
            if (config.hostelVideo && config.hostelVideo.publicId) {
                await deleteFromCloudinary(config.hostelVideo.publicId, 'video');
            }
            config.hostelVideo = {
                url: req.body.videoUrl,
                publicId: req.body.videoPublicId
            };
        } else if (req.files && req.files['hostelVideo']) {
            if (config.hostelVideo && config.hostelVideo.publicId) {
                await deleteFromCloudinary(config.hostelVideo.publicId, 'video');
            }
            try {
                const uploadedVideo = await uploadToCloudinaryStream(req.files['hostelVideo'][0].buffer, 'hostel/config/video', 'video');
                config.hostelVideo = {
                    url: uploadedVideo.url,
                    publicId: uploadedVideo.public_id
                };
            } catch (err) {
                console.error('Hostel Video upload failed:', err);
                throw new Error('Hostel video upload failed');
            }
        }

        // Handle landing gallery update (append or replace? typically replace for configuration or specific add/remove endpoints are better, but let's stick to append for now or just replace all if provided? User said "manager can able to change all images", implies replacing or managing. Let's assume replacing specific indexes or just adding. For simplicity in this single endpoint, if gallery is provided, we might be adding. But `landingGallery` is an array.
        // Better approach: config.landingGallery is an array.
        // If we want to replace a specific image, we need an index.
        // But `req.files` doesn't give us index easily with `landingGallery`.
        // Let's assume we Appending new images. Deletion should be a separate action or we need a more complex update logic. 
        // Given complexity, let's just Append for now. And maybe add a delete route or allow passing an array of publicIds to keep?
        // Actually, let's just Append any uploaded images to the gallery.
        if (req.files && req.files['landingGallery']) {
            for (const file of req.files['landingGallery']) {
                const uploadedMedia = await uploadToCloudinaryStream(file.buffer, 'hostel/config/gallery', 'image');
                config.landingGallery.push({
                    url: uploadedMedia.url,
                    publicId: uploadedMedia.public_id
                });
            }
        }

        // Update text fields
        if (req.body.ownerName) config.ownerName = req.body.ownerName;
        if (req.body.ownerRole) config.ownerRole = req.body.ownerRole;
        if (req.body.ownerBio) config.ownerBio = req.body.ownerBio;

        await config.save();
        res.status(200).json(config);

    } catch (error) {
        console.error('Update Config Error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};



// @desc    Delete landing gallery image
// @route   DELETE /api/public/config/gallery/:id
// @access  Private/Manager
const deleteLandingGalleryImage = async (req, res) => {
    try {
        const config = await HostelConfig.findOne();
        if (!config) {
            return res.status(404).json({ message: 'Config not found' });
        }

        const imageIndex = config.landingGallery.findIndex(img => img._id.toString() === req.params.id);

        if (imageIndex === -1) {
            return res.status(404).json({ message: 'Image not found' });
        }

        const image = config.landingGallery[imageIndex];

        // Delete from Cloudinary
        if (image.publicId) {
            await deleteFromCloudinary(image.publicId);
        }

        // Remove from array
        config.landingGallery.splice(imageIndex, 1);
        await config.save();

        res.status(200).json(config);
    } catch (error) {
        console.error('Delete Landing Gallery Image Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update Hostel Video
// @route   PUT /api/public/config/video
// @access  Private/Manager
const updateHostelVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Video file required" });
        }

        // Upload to Cloudinary using stream
        const result = await uploadToCloudinaryStream(req.file.buffer, 'hostel_video', 'video');

        // Update database
        const updatedConfig = await HostelConfig.findOneAndUpdate(
            {},
            { hostelVideo: result.secure_url },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: "Hostel video uploaded successfully",
            config: updatedConfig
        });

    } catch (error) {
        console.error('Video upload error:', error);
        res.status(500).json({ message: "Video upload failed" });
    }
};

module.exports = {
    getFeaturedStudents,
    getFeaturedStudentById,
    addFeaturedStudent,
    updateFeaturedStudent,
    deleteFeaturedStudent,
    getGalleryItems,
    addGalleryItem,
    deleteGalleryItem,
    getHostelConfig,
    updateHostelConfig,
    deleteLandingGalleryImage,
    updateHostelVideo
};
