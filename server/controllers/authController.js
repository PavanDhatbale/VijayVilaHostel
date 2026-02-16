const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admission = require('../models/Admission');
const transporter = require('../config/mailer');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
    const { name, email, password } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields (name, email, password)' });
    }

    try {
        // 2. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log(`[Signup] Attempted registration with existing email: ${email}`);
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // However, the requirement says "User is saved in MongoDB with: isEmailVerified = false"
        // So let's create the user first.
        const user = await User.create({
            name,
            email,
            password,
            role: 'student',
            isEmailVerified: false,
            admissionStatus: 'not_applied',
        });

        // 3. Generate verification token
        const verificationToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const verificationUrl = `${process.env.FRONTEND_URL}/#/verify-email?token=${verificationToken}`;

        // 4. Send verification email
        const mailOptions = {
            from: `"Vijay Vila Hostel" <${process.env.EMAIL_FROM}>`,
            to: user.email,
            subject: 'Verify your email – Vijay Vila Hostel',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #e1e1e1; border-radius: 16px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #1e40af; margin: 0; font-size: 28px;">Vijay Vila Hostel</h1>
                        <p style="color: #6b7280; font-size: 14px;">Premium Student Living</p>
                    </div>
                    
                    <div style="border-top: 4px solid #1e40af; padding-top: 30px;">
                        <h2 style="color: #111827; font-size: 22px; margin-bottom: 20px;">Welcome to the Community!</h2>
                        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Dear <strong>${user.name}</strong>,</p>
                        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Thank you for choosing Vijay Vila Hostel. We are excited to have you with us. To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
                        
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
            `,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`[Signup] Verification email sent successfully to: ${user.email}`);

            return res.status(201).json({
                message: 'Signup successful! Please check your email to verify your account.',
            });
        } catch (mailError) {
            console.error(`[Signup] Failed to send email to ${user.email}:`, mailError.message);
            // Delete the user if email fails, as we don't want "zombie" accounts
            await User.findByIdAndDelete(user._id);
            return res.status(500).json({
                message: 'Failed to send verification email. Please try again later.',
                error: mailError.message
            });
        }
    } catch (error) {
        console.error('[Signup Error]:', error);
        return res.status(500).json({
            message: 'Internal server error during registration',
            error: error.message
        });
    }
};

// @desc    Verify email address
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        console.log('[Verification] Attempted verification without token query param');
        return res.status(400).json({ message: 'Missing verification token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user) {
            console.log(`[Verification] User not found for token: ${decoded.userId}`);
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isEmailVerified) {
            console.log(`[Verification] Email already verified for: ${user.email}`);
            return res.status(400).json({ message: 'Email already verified' });
        }

        user.isEmailVerified = true;
        await user.save();

        console.log(`[Verification] Email verified successfully for: ${user.email}`);
        res.status(200).json({
            success: true,
            message: 'Email verified successfully! You can now login.'
        });
    } catch (error) {
        console.error('[Verification Error]:', error.message);
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            if (!user.isEmailVerified) {
                return res.status(401).json({ message: 'Please verify your email before logging in' });
            }

            // Removed blocking of inactive students to allow them to access profile/gallery
            // if (user.role === 'student' && user.studentStatus === 'inactive') {
            //     return res.status(403).json({ message: 'Your account is inactive. Please contact the hostel manager.' });
            // }

            let admission = null;
            if (user.role === 'student') {
                admission = await Admission.findOne({ user: user._id });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
                admissionStatus: user.admissionStatus,
                roomNumber: user.roomNumber,
                bedNumber: user.bedNumber,
                attendancePercentage: user.attendancePercentage,
                studentStatus: user.studentStatus,
                admission: admission, // Include admission data for document paths
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            let admission = null;
            if (user.role === 'student' || user.role === 'monitor') {
                admission = await Admission.findOne({ user: user._id });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                image: user.image,
                admissionStatus: user.admissionStatus,
                roomNumber: user.roomNumber,
                bedNumber: user.bedNumber,
                attendancePercentage: user.attendancePercentage,
                studentStatus: user.studentStatus,
                admission: admission
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, image, phone } = req.body;

        // Update User model
        if (name) user.name = name;
        if (image !== undefined) user.image = image;
        await user.save();

        // Update Admission model if student/monitor
        if (user.role === 'student' || user.role === 'monitor') {
            const admission = await Admission.findOne({ user: user._id });
            if (admission) {
                if (name) admission.personalDetails.fullName = name;
                if (phone) admission.personalDetails.contact = phone;
                await admission.save();
            }
        }

        // Return updated profile (same structure as getProfile)
        let admission = null;
        if (user.role === 'student' || user.role === 'monitor') {
            admission = await Admission.findOne({ user: user._id });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            admissionStatus: user.admissionStatus,
            roomNumber: user.roomNumber,
            bedNumber: user.bedNumber,
            attendancePercentage: user.attendancePercentage,
            studentStatus: user.studentStatus,
            admission: admission
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { signup, verifyEmail, login, getProfile, updateProfile };
