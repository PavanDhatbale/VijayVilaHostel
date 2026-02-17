const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

/**
 * Upload a file to Cloudinary
 * @param {string} filePath - Path to the local file
 * @param {string} folder - Cloudinary folder name
 * @param {string} resourceType - 'image' or 'video'
 * @returns {Promise<Object>} - Cloudinary upload response object
 */
const uploadToCloudinary = async (filePath, folder, resourceType = 'auto') => {
    try {
        console.log(`Starting upload to Cloudinary: ${filePath} (Exists: ${fs.existsSync(filePath)})`);

        // Wait 2 seconds to ensure file handle is released by filesystem (Windows fix)
        await new Promise(resolve => setTimeout(resolve, 2000));

        let result;
        if (resourceType === 'video') {
            result = await cloudinary.uploader.upload_large(filePath, {
                folder: `hostel/${folder}`,
                resource_type: resourceType,
                chunk_size: 6000000, // 6MB chunks for better stability
                timeout: 600000 // 10 minutes timeout
            });
        } else {
            result = await cloudinary.uploader.upload(filePath, {
                folder: `hostel/${folder}`,
                resource_type: resourceType,
                quality: 'auto',
                fetch_format: 'auto'
            });
        }

        // Remove file from local storage after upload
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
        // Remove file from local storage if upload fails
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        console.error('Cloudinary Upload Error:', error);
        throw new Error('Media upload failed');
    }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - Cloudinary public ID of the file
 * @param {string} resourceType - 'image' or 'video'
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
    try {
        if (!publicId) return;
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
        console.error('Cloudinary Deletion Error:', error);
    }
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary
};
