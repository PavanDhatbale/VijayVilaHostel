const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false, // Don't return password by default
    },
    role: {
        type: String,
        enum: ['student', 'monitor', 'hostelManager'],
        default: 'student',
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    admissionStatus: {
        type: String,
        enum: ['not_applied', 'pending', 'approved', 'rejected'],
        default: 'not_applied',
    },
    // Student Management Fields
    department: {
        type: String,
        default: null
    },
    year: {
        type: String,
        default: null
    },
    studentType: {
        type: String,
        enum: ['current', 'alumni'],
        default: 'current'
    },
    roomNumber: {
        type: String,
        default: null
    },
    bedNumber: {
        type: String,
        default: null
    },
    attendancePercentage: {
        type: Number,
        default: 100
    },
    studentStatus: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    image: {
        type: String,
        default: null
    },
    profileImage: {
        url: {
            type: String,
            default: null
        },
        publicId: {
            type: String,
            default: null
        }
    },
    location: {
        type: String,
        default: null
    },
    hostelStay: {
        type: String, // e.g., "2020 - 2023"
        default: null
    },
    examCleared: {
        type: String,
        default: null
    },
    currentPosition: {
        type: String,
        default: null
    },
    keyAchievements: [String],
    testimony: {
        type: String,
        default: null
    },
    experienceVideo: {
        url: {
            type: String,
            default: null
        },
        publicId: {
            type: String,
            default: null
        }
    },
    socialLinks: {
        instagram: { type: String, default: null },
        facebook: { type: String, default: null }
    },
    contactNumber: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
