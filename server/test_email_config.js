const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const nodemailer = require('nodemailer');

const fs = require('fs');
const logFile = path.join(__dirname, 'debug_output_4.txt');

function log(message) {
    fs.appendFileSync(logFile, message + '\n');
    console.log(message);
}

// Clear previous log
fs.writeFileSync(logFile, '');

log('Testing Gmail Configuration (Fallback)...');
const gmailUser = 'pavandhatbale17@gmail.com'; // Trying the email associated with the app password
// Or maybe 'vijayvilahostel@gmail.com' if that's where the app pass is from.
// The comment "ylbe iqmg bmrm ryhb" looks like a Gmail App Password.
// Let's try to detect which email it belongs to, or try both.
// Actually, let's just use the credentials from the comments to test connectivity.

const gmailHost = 'smtp.gmail.com';
const gmailPort = 587;
const gmailPass = 'ylbe iqmg bmrm ryhb'; // From .env comments
// We need to know the user for this pass. I'll guess 'pavandhatbale17@gmail.com' or 'vijayvilahostel@gmail.com'
// Let's try 'vijayvilahostel@gmail.com' first since that's the current active one.

log('Host: ' + gmailHost);
log('User: vijayvilahostel@gmail.com');
log('Pass: (Hidden App Password)');

async function testGmail(user) {
    log(`Testing Gmail for user: ${user}...`);
    const transporter = nodemailer.createTransport({
        host: gmailHost,
        port: gmailPort,
        secure: false,
        auth: {
            user: user,
            pass: gmailPass,
        },
        tls: { rejectUnauthorized: false }
    });

    try {
        await transporter.verify();
        log(`✅ Gmail Success for ${user}! Code is working fine.`);
        return true;
    } catch (error) {
        log(`❌ Gmail Failed for ${user}: ${error.message}`);
        return false;
    }
}

(async () => {
    // Try connection with the original Brevo config first (already logged failure)
    // Now try Gmail to prove network is okay.
    await testGmail('vijayvilahostel@gmail.com');
    await testGmail('pavandhatbale17@gmail.com');
})();


const pass = process.env.EMAIL_PASS;
log('Password Length: ' + (pass ? pass.length : 0));
log('Password First 3: ' + (pass ? pass.substring(0, 3) : 'N/A'));
log('Password Last 3: ' + (pass ? pass.substring(pass.length - 3) : 'N/A'));
log('Contains Whitespace: ' + (pass ? /\s/.test(pass) : 'N/A'));

async function testConnection(port) {
    log(`\nTesting connection on port ${port}...`);
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: port,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: pass ? pass.trim() : '',
        },
        tls: {
            rejectUnauthorized: false
        },
        connectionTimeout: 10000,
    });

    try {
        await transporter.verify();
        log(`✅ Success on port ${port}!`);
        return true;
    } catch (error) {
        log(`❌ Failed on port ${port}: ${error.message}`);
        if (error.responseCode) log('Response Code: ' + error.responseCode);
        return false;
    }
}

// Running the test function defined above

