const streamifier = require('streamifier');
const { cloudinary } = require('../config/cloudinary');

const uploadVideoToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "video",
                folder: "hostel_video"
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

module.exports = uploadVideoToCloudinary;
