const mongoose = require('mongoose');

const noticeReadStatusSchema = new mongoose.Schema({
    notice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notice',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isHidden: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Compound index to ensure a user has only one read status per notice
noticeReadStatusSchema.index({ notice: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('NoticeReadStatus', noticeReadStatusSchema);
