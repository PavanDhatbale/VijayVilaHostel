const Admission = require('../models/Admission');
const User = require('../models/User');
const uploadToCloudinaryStream = require('../utils/cloudinaryStream');

// @desc    Apply for admission
// @route   POST /api/admission/apply
// @access  Private (Student only)
const applyForAdmission = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.admissionStatus !== 'not_applied') {
            return res.status(400).json({ message: 'Admission already processed or application pending' });
        }

        // Parse text fields from req.body (Multer makes them strings for multipart)
        let { personalDetails, educationDetails, familyDetails } = req.body;

        if (typeof personalDetails === 'string') personalDetails = JSON.parse(personalDetails);
        if (typeof educationDetails === 'string') educationDetails = JSON.parse(educationDetails);
        if (typeof familyDetails === 'string') familyDetails = JSON.parse(familyDetails);

        // Check if all documents are uploaded
        if (!req.files || !req.files.tenthMarksheet || !req.files.twelfthMarksheet ||
            !req.files.incomeCertificate || !req.files.aadhaarCard) {
            return res.status(400).json({ message: 'All 4 documents are required' });
        }

        // Import Cloudinary utility
        // const { uploadToCloudinary } = require('../config/cloudinary');

        // Helper to upload file and return object
        const uploadDoc = async (file) => {
            const result = await uploadToCloudinaryStream(file.buffer, 'admissions', 'auto');
            return {
                url: result.url,
                publicId: result.public_id
            };
        };

        // Upload all documents in parallel
        const [tenthMarksheet, twelfthMarksheet, incomeCertificate, aadhaarCard] = await Promise.all([
            uploadDoc(req.files.tenthMarksheet[0]),
            uploadDoc(req.files.twelfthMarksheet[0]),
            uploadDoc(req.files.incomeCertificate[0]),
            uploadDoc(req.files.aadhaarCard[0])
        ]);

        const documents = {
            tenthMarksheet,
            twelfthMarksheet,
            incomeCertificate,
            aadhaarCard
        };

        const admission = new Admission({
            user: userId,
            personalDetails,
            educationDetails,
            familyDetails,
            documents
        });

        await admission.save();

        user.admissionStatus = 'pending';
        await user.save();

        res.status(201).json({
            message: 'Application submitted successfully. Please wait for approval.',
            admission
        });
    } catch (error) {
        // If there's an error, we should probably clean up any successful uploads
        // forcing a best-effort cleanup could be adding a TODO here
        console.error('Admission Application Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all admissions (Manager only)
// @route   GET /api/admission
// @access  Private (Hostel Manager only)
const getAllAdmissions = async (req, res) => {
    try {
        const admissions = await Admission.find().populate('user', 'name email').sort('-createdAt');
        res.status(200).json(admissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve admission
// @route   PUT /api/admission/:id/approve
// @access  Private (Hostel Manager only)
const approveAdmission = async (req, res) => {
    try {
        const { managerMessage } = req.body;
        const admission = await Admission.findById(req.params.id);

        if (!admission) {
            return res.status(404).json({ message: 'Admission not found' });
        }

        if (admission.status !== 'pending') {
            return res.status(400).json({ message: 'Admission already processed' });
        }

        admission.status = 'approved';
        admission.managerMessage = managerMessage; // Save the message
        admission.reviewedBy = req.user._id;
        admission.reviewedAt = Date.now();
        await admission.save();

        // Update User status
        await User.findByIdAndUpdate(admission.user, { admissionStatus: 'approved' });

        res.status(200).json({
            message: 'Admission approved successfully',
            admission
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reject admission
// @route   PUT /api/admission/:id/reject
// @access  Private (Hostel Manager only)
const rejectAdmission = async (req, res) => {
    try {
        const { rejectionReason, managerMessage } = req.body;

        if (!rejectionReason) {
            return res.status(400).json({ message: 'Rejection reason is required' });
        }

        const admission = await Admission.findById(req.params.id);

        if (!admission) {
            return res.status(404).json({ message: 'Admission not found' });
        }

        if (admission.status !== 'pending') {
            return res.status(400).json({ message: 'Admission already processed' });
        }

        admission.status = 'rejected';
        admission.rejectionReason = rejectionReason;
        admission.managerMessage = managerMessage; // Save the message
        admission.reviewedBy = req.user._id;
        admission.reviewedAt = Date.now();
        await admission.save();

        // Update User status
        await User.findByIdAndUpdate(admission.user, { admissionStatus: 'rejected' });

        res.status(200).json({
            message: 'Admission rejected successfully',
            admission
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Accept admission (Student)
// @route   PUT /api/admission/accept
// @access  Private (Student only)
const acceptAdmission = async (req, res) => {
    try {
        const userId = req.user._id;
        const admission = await Admission.findOne({ user: userId });

        if (!admission) {
            return res.status(404).json({ message: 'Admission record not found' });
        }

        if (admission.status !== 'approved') {
            return res.status(400).json({ message: 'Admission is not approved yet' });
        }

        if (admission.isAcceptedByStudent) {
            return res.status(400).json({ message: 'Admission already accepted' });
        }

        admission.isAcceptedByStudent = true;
        await admission.save();

        // Activate user status
        await User.findByIdAndUpdate(userId, { studentStatus: 'active' });

        res.status(200).json({
            message: 'Admission accepted successfully! Welcome to the hostel.',
            admission
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete admission (Manager only)
// @route   DELETE /api/admission/:id
// @access  Private (Hostel Manager only)
const deleteAdmission = async (req, res) => {
    try {
        const admission = await Admission.findById(req.params.id);

        if (!admission) {
            return res.status(404).json({ message: 'Admission not found' });
        }

        // Only allow deleting rejected admissions
        if (admission.status !== 'rejected') {
            return res.status(400).json({ message: 'Only rejected admissions can be deleted' });
        }

        const userId = admission.user;

        // Delete the admission
        await admission.deleteOne();

        // Reset User status to 'not_applied' so they can re-apply if needed
        await User.findByIdAndUpdate(userId, { admissionStatus: 'not_applied' });

        res.status(200).json({ message: 'Admission deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyForAdmission,
    getAllAdmissions,
    approveAdmission,
    rejectAdmission,
    acceptAdmission,
    deleteAdmission
};
