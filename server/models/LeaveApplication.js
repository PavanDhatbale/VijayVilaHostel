const mongoose = require('mongoose');

const leaveApplicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hostelName: {
        type: String,
        required: true,
        default: 'Vijay Vila Hostel'
    },
    startDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LeaveApplication', leaveApplicationSchema);
