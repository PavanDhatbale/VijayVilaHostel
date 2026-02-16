const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    mediaType: {
        type: String,
        required: true,
        enum: ['photo', 'video', 'news']
    },
    mediaUrl: {
        type: String,
        required: true
    },
    publicId: {
        type: String
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    date: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
