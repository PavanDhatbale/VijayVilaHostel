const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mediaType: {
        type: String,
        enum: ['photo', 'video'],
        required: true
    },
    mediaUrl: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Media', mediaSchema);
