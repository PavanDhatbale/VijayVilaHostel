const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    personalDetails: {
        fullName: { type: String, required: true },
        age: { type: Number, required: true },
        contact: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true }
    },
    educationDetails: {
        course: { type: String, required: true },
        tenthScore: { type: String, required: true },
        twelfthScore: { type: String, required: true },
        examFocus: { type: String, required: true }
    },
    familyDetails: {
        fatherOccupation: { type: String, required: true },
        annualIncome: { type: String, required: true },
        financialNeed: { type: String }
    },
    documents: {
        tenthMarksheet: { type: mongoose.Schema.Types.Mixed, required: true },
        twelfthMarksheet: { type: mongoose.Schema.Types.Mixed, required: true },
        incomeCertificate: { type: mongoose.Schema.Types.Mixed, required: true },
        aadhaarCard: { type: mongoose.Schema.Types.Mixed, required: true }
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedAt: {
        type: Date
    },
    rejectionReason: {
        type: String
    },
    managerMessage: {
        type: String,
        default: null
    },
    isAcceptedByStudent: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Admission', admissionSchema);
