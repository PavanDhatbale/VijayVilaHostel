const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT == 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000,    // 5 seconds
});

// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('[Email Service] Error: Verification failed!', error.message);
    } else {
        console.log('[Email Service] Success: Server is ready to take our messages');
    }
});

module.exports = transporter;
