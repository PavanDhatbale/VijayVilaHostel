const multer = require('multer');
const path = require('path');
const fs = require('fs');



// Use directory OUTSIDE server folder to guarantee nodemon doesn't watch it
const uploadDir = path.join(__dirname, '../../temp_uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

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
