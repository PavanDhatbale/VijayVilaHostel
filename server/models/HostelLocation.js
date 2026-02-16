const mongoose = require('mongoose');

const hostelLocationSchema = new mongoose.Schema({
    hostelName: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        default: 'Pune'
    },
    state: {
        type: String,
        default: 'Maharashtra'
    },
    pincode: {
        type: String,
        required: true
    },
    landmark: {
        type: String
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    mapEmbedUrl: {
        type: String,
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('HostelLocation', hostelLocationSchema);
