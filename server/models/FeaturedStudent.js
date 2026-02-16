const mongoose = require('mongoose');

const featuredStudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    exam: {
        type: String,
        required: true,
        enum: ['UPSC', 'MPSC', 'Banking', 'NEET', 'JEE', 'GATE', 'POLICE BHARATI', 'CMA & CA', 'Other']
    },
    status: {
        type: String,
        required: true,
        enum: ['Current', 'Alumni']
    },
    profileImage: {
        url: {
            type: String,
            default: 'https://images.unsplash.com/photo-1544526226-d4568090ffb8?q=80&w=2070'
        },
        publicId: String
    },
    stayFrom: {
        type: String,
        required: true
    },
    stayTo: {
        type: String,
        required: true
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
    hostelGallery: [
        {
            url: String,
            publicId: String
        }
    ],
    testimony: {
        type: String,
        default: null
    },
    socials: {
        instagram: String,
        facebook: String,
        phone: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('FeaturedStudent', featuredStudentSchema);
