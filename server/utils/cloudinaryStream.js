const streamifier = require('streamifier');
const { cloudinary } = require('../config/cloudinary');

/**
 * Upload a buffer to Cloudinary using upload_stream
 * @param {Buffer} buffer - The file buffer
 * @param {string} folder - The folder to upload to
 * @param {string} resourceType - 'image', 'video', or 'auto'
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadToCloudinaryStream = (buffer, folder, resourceType = 'auto', publicId = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            folder: `hostel/${folder}`,
            resource_type: resourceType,
        };

        if (publicId) {
            options.public_id = publicId;
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) {
                    console.error('Cloudinary Stream Upload Error:', error);
                    return reject(error);
                }
                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

module.exports = uploadToCloudinaryStream;
