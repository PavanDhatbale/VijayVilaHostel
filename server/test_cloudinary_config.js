const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const cloudinary = require('cloudinary').v2;

const fs = require('fs');
const logFile = path.join(__dirname, 'cloudinary_debug.txt');

function log(message) {
    fs.appendFileSync(logFile, message + '\n');
    console.log(message);
}

// Clear previous log
fs.writeFileSync(logFile, '');

log('Testing Cloudinary Configuration...');
log('Cloud Name: ' + process.env.CLOUDINARY_CLOUD_NAME);
log('API Key: ' + (process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set'));
log('API Secret: ' + (process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set'));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// Try to ping by listing details of the cloud
cloudinary.api.ping((error, result) => {
    if (error) {
        log('❌ Cloudinary Connection Failed: ' + error.message);
        if (error.http_code === 401) {
            log('-> Check your API Key and Secret.');
        } else if (error.http_code === 404) {
            log('-> Check your Cloud Name.');
        }
    } else {
        log('✅ Cloudinary Connection Successful!');
        log('Status: ' + result.status);
    }
});
