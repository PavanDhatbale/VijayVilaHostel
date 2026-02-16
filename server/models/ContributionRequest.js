const mongoose = require('mongoose');

const contributionRequestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    amountPerStudent: {
        type: Number,
        required: [true, 'Please add amount per student']
    },
    dueDate: {
        type: Date,
        required: [true, 'Please add a due date']
    },
    qrCodeImage: {
        url: {
            type: String,
            required: [true, 'Please upload a QR code']
        },
        publicId: {
            type: String,
            required: true
        }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'archived'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ContributionRequest', contributionRequestSchema);
