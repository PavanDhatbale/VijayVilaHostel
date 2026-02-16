const mongoose = require('mongoose');

const contributionPaymentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contributionRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContributionRequest',
        required: true
    },
    screenshot: {
        url: {
            type: String,
            required: [true, 'Please upload payment screenshot']
        },
        publicId: {
            type: String,
            required: true
        }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    remarks: {
        type: String,
        trim: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    verifiedAt: {
        type: Date
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Ensure one payment per request per student
contributionPaymentSchema.index({ student: 1, contributionRequest: 1 }, { unique: true });

module.exports = mongoose.model('ContributionPayment', contributionPaymentSchema);
