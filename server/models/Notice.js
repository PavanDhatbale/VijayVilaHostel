const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Announcement', 'Event', 'Notice', 'Reminder', 'Message'],
        default: 'Announcement'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderRole: {
        type: String,
        enum: ['hostelManager', 'monitor'],
        required: true
    },
    recipientType: {
        type: String,
        enum: ['ALL_STUDENTS', 'MONITOR', 'HOSTEL_MANAGER'],
        required: true
    },
    priority: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notice', noticeSchema);
