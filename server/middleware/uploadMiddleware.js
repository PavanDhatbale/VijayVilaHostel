const multer = require('multer');

// Use memory storage to handle file in Buffer
// This prevents 'ENOENT' issues on ephemeral filesystems like Render
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') ||
        file.mimetype.startsWith('video/') ||
        file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only images, videos, and PDFs are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 300 * 1024 * 1024 // 300MB limit
    }
});

module.exports = upload;
