const SibApiV3Sdk = require('sib-api-v3-sdk');

/**
 * Brevo Email Service
 */
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

/**
 * Sends a verification email to a new user
 * @param {string} userEmail - Recipient email address
 * @param {string} token - Verification token
 * @returns {Promise} - Result of the API call
 */
const sendVerificationEmail = async (userEmail, token) => {
    const verificationUrl = `https://www.vijayvilahostel.in/verify/${token}`;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = "Verify your email – Vijay Vila Hostel";
    sendSmtpEmail.htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e1e1e1; border-radius: 16px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1e40af; margin: 0; font-size: 28px;">Vijay Vila Hostel</h1>
                <p style="color: #6b7280; font-size: 14px;">Premium Student Living</p>
            </div>
            
            <div style="border-top: 4px solid #1e40af; padding-top: 30px;">
                <h2 style="color: #111827; font-size: 22px; margin-bottom: 20px;">Welcome to the Community!</h2>
                <p style="color: #374151; font-size: 16px; line-height: 1.6;">Welcome to Vijay Vila Hostel. We are excited to have you with us. To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
                
                <div style="text-align: center; margin: 40px 0;">
                    <a href="${verificationUrl}" style="background-color: #1e40af; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">Verify Email Address</a>
                </div>
                
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">This verification link will expire in 24 hours. If the button doesn't work, copy and paste this URL into your browser:</p>
                <p style="color: #1e40af; font-size: 12px; word-break: break-all;">${verificationUrl}</p>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f3f4f6; text-align: center;">
                <p style="color: #9ca3af; font-size: 12px;">If you did not create an account, please ignore this email.</p>
                <p style="color: #9ca3af; font-size: 12px; margin-top: 10px;">© 2026 Vijay Vila Hostel. All rights reserved.</p>
            </div>
        </div>
    `;
    sendSmtpEmail.sender = { name: "Vijay Vila Hostel", email: "noreply@vijayvilahostel.in" };
    sendSmtpEmail.to = [{ email: userEmail }];

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`[Email Service] Verification email sent successfully to: ${userEmail}. Message ID: ${data.messageId}`);
        return data;
    } catch (error) {
        console.error(`[Email Service] Failed to send verification email to ${userEmail}:`, error.response ? error.response.body : error.message);
        throw new Error(error.response ? (error.response.body.message || error.response.body.code) : error.message);
    }
};

module.exports = {
    sendVerificationEmail
};
