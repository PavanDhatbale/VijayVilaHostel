const mongoose = require('mongoose');

const monitorHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    endDate: {
        type: Date
    },
    performance: {
        type: String,
        default: '85%' // Default initial performance
    },
    removalReason: {
        type: String
    },
    role: {
        type: String,
        default: 'Former Monitor'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MonitorHistory', monitorHistorySchema);
