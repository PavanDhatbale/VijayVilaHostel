const ContributionRequest = require('../models/ContributionRequest');
const ContributionPayment = require('../models/ContributionPayment');
const uploadToCloudinaryStream = require('../utils/cloudinaryStream');

// @desc    Create a new contribution request
// @route   POST /api/contributions
// @access  Private (Monitor only)
exports.createRequest = async (req, res) => {
    try {
        const { title, description, amountPerStudent, dueDate } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: 'Please upload a QR code image' });
        }

        // Upload QR code to Cloudinary
        const result = await uploadToCloudinaryStream(file.buffer, 'qr-codes');

        const request = await ContributionRequest.create({
            title,
            description,
            amountPerStudent,
            dueDate,
            qrCodeImage: {
                url: result.url,
                publicId: result.public_id
            },
            createdBy: req.user.id
        });

        res.status(201).json({
            success: true,
            data: request
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get all contribution requests (Monitor view)
// @route   GET /api/contributions/monitor
// @access  Private (Monitor only)
exports.getMonitorRequests = async (req, res) => {
    try {
        const requests = await ContributionRequest.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: requests.length, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get payments for a specific request
// @route   GET /api/contributions/:id/payments
// @access  Private (Monitor only)
exports.getRequestPayments = async (req, res) => {
    try {
        const payments = await ContributionPayment.find({ contributionRequest: req.params.id })
            .populate('student', 'firstName lastName roomNumber confirmed')
            .sort({ submittedAt: -1 });

        res.status(200).json({ success: true, count: payments.length, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update payment status (Approve/Reject)
// @route   PATCH /api/payments/:id/status
// @access  Private (Monitor only)
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { status, remarks } = req.body;

        let payment = await ContributionPayment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        payment.status = status;
        payment.remarks = remarks;
        payment.verifiedAt = Date.now();
        payment.verifiedBy = req.user.id;

        await payment.save();

        res.status(200).json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get active contribution requests (Student view)
// @route   GET /api/contributions/active
// @access  Private (Student only)
exports.getActiveRequests = async (req, res) => {
    try {
        const requests = await ContributionRequest.find({ status: 'active' }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: requests.length, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Upload payment screenshot
// @route   POST /api/payments/upload
// @access  Private (Student only)
exports.uploadPayment = async (req, res) => {
    try {
        const { requestId } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: 'Please upload payment screenshot' });
        }

        // Check if already paid
        const existingPayment = await ContributionPayment.findOne({
            student: req.user.id,
            contributionRequest: requestId
        });

        if (existingPayment && existingPayment.status !== 'rejected') {
            return res.status(400).json({ success: false, message: 'Payment already submitted and pending/approved' });
        }

        // Upload screenshot
        const result = await uploadToCloudinaryStream(file.buffer, 'payment-screenshots');

        let payment;
        if (existingPayment && existingPayment.status === 'rejected') {
            // Update existing rejected payment
            existingPayment.screenshot = { url: result.url, publicId: result.public_id };
            existingPayment.status = 'pending';
            existingPayment.submittedAt = Date.now();
            existingPayment.remarks = undefined; // Clear previous rejection remarks
            payment = await existingPayment.save();
        } else {
            // Create new payment
            payment = await ContributionPayment.create({
                student: req.user.id,
                contributionRequest: requestId,
                screenshot: {
                    url: result.url,
                    publicId: result.public_id
                }
            });
        }

        res.status(201).json({ success: true, data: payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get my payment status
// @route   GET /api/payments/my-status
// @access  Private (Student only)
exports.getMyPaymentStatus = async (req, res) => {
    try {
        const payments = await ContributionPayment.find({ student: req.user.id })
            .populate('contributionRequest', 'title amountPerStudent');

        res.status(200).json({ success: true, count: payments.length, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
