const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Admission = require('../models/Admission');
const Notice = require('../models/Notice');
const MonitorHistory = require('../models/MonitorHistory');
const uploadToCloudinaryStream = require('../utils/cloudinaryStream');

// @desc    Get all approved students
// @route   GET /api/manager/students
// @access  Private/Manager
const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({
            role: 'student',
            admissionStatus: 'approved'
        }).select('-password').lean();

        // Calculate real-time attendance for each student
        const studentsWithRealAttendance = await Promise.all(students.map(async (student) => {
            const records = await Attendance.find({ student: student._id });
            const total = records.length;
            const present = records.filter(r => r.status === 'present').length;
            const percentage = total > 0 ? (present / total) * 100 : 0; // Default to 0 if no records

            return {
                ...student,
                attendancePercentage: Math.round(percentage)
            };
        }));

        res.json(studentsWithRealAttendance);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update student details
// @route   PUT /api/manager/students/:studentId
// @access  Private/Manager
const updateStudent = async (req, res) => {
    try {
        const {
            roomNumber, bedNumber, studentStatus, department, year,
            location, hostelStay, examCleared, currentPosition,
            keyAchievements, testimony, instagram, facebook, contactNumber
        } = req.body;

        const student = await User.findById(req.params.studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Update basic fields
        if (roomNumber !== undefined) student.roomNumber = roomNumber;
        if (bedNumber !== undefined) student.bedNumber = bedNumber;
        if (studentStatus) {
            student.studentStatus = studentStatus;
            if (studentStatus === 'inactive') {
                student.roomNumber = null;
                student.bedNumber = null;
            }
        }
        if (department) student.department = department;
        if (year) student.year = year;
        if (location) student.location = location;
        if (hostelStay) student.hostelStay = hostelStay;
        if (examCleared) student.examCleared = examCleared;
        if (currentPosition) student.currentPosition = currentPosition;
        if (testimony) student.testimony = testimony;
        if (contactNumber) student.contactNumber = contactNumber;

        // Update social links
        if (instagram !== undefined || facebook !== undefined) {
            student.socialLinks = {
                instagram: instagram !== undefined ? instagram : student.socialLinks.instagram,
                facebook: facebook !== undefined ? facebook : student.socialLinks.facebook
            };
        }

        // Handle keyAchievements (parse if string)
        if (keyAchievements !== undefined) {
            let achievementsArray = [];
            try {
                achievementsArray = JSON.parse(keyAchievements);
            } catch (e) {
                achievementsArray = typeof keyAchievements === 'string'
                    ? keyAchievements.split(',').map(a => a.trim()).filter(a => a !== '')
                    : [keyAchievements];
            }
            student.keyAchievements = achievementsArray;
        }

        // Handle profile image upload
        if (req.files && req.files['profileImage']) {
            const uploadResult = await uploadToCloudinaryStream(req.files['profileImage'][0].buffer, 'students/profile', 'image');
            student.profileImage = {
                url: uploadResult.url,
                publicId: uploadResult.public_id
            };
        }

        // Handle experience video upload
        if (req.files && req.files['experienceVideo']) {
            const uploadResult = await uploadToCloudinaryStream(req.files['experienceVideo'][0].buffer, 'students/videos', 'video');
            student.experienceVideo = {
                url: uploadResult.url,
                publicId: uploadResult.public_id
            };
        }

        await student.save();

        res.json({
            message: 'Student updated successfully',
            student
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete/Deactivate student
// @route   DELETE /api/manager/students/:studentId
// @access  Private/Manager
const deleteStudent = async (req, res) => {
    try {
        const student = await User.findById(req.params.studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // 1. Find and update the associated admission record to 'rejected'
        // We search by the user ID
        await Admission.findOneAndUpdate(
            { user: student._id },
            {
                status: 'rejected',
                rejectionReason: 'Student deleted by manager'
            }
        );

        // 2. Hard delete the user record
        await User.findByIdAndDelete(req.params.studentId);

        res.json({ message: 'Student deleted and admission marked as rejected' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get dashboard summary stats
// @route   GET /api/manager/summary
// @access  Private/Manager
const getManagerSummary = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({
            role: { $in: ['student', 'monitor'] },
            admissionStatus: 'approved',
            studentStatus: 'active'
        });

        // Assuming max capacity is a fixed number or stored in a setting
        const totalBeds = 14;
        const occupiedBeds = await User.countDocuments({
            role: { $in: ['student', 'monitor'] },
            admissionStatus: 'approved',
            studentStatus: 'active',
            roomNumber: { $ne: null },
            bedNumber: { $ne: null }
        });
        const vacantBeds = totalBeds - occupiedBeds;

        const pendingAdmissions = await User.countDocuments({
            role: 'student',
            admissionStatus: 'pending'
        });

        // Current Monitor - assuming we pick the first one with 'monitor' role
        const monitor = await User.findOne({ role: 'monitor' });
        const monitorName = monitor ? monitor.name : 'None';

        // Calculate average attendance across all students (and monitor)
        const students = await User.find({ role: { $in: ['student', 'monitor'] }, admissionStatus: 'approved' });
        const attendanceRecords = await Attendance.find();

        // Simple avg calc
        let avgAttendance = 0;
        if (students.length > 0) {
            const studentCounts = students.map(s => {
                const sRecords = attendanceRecords.filter(r => r.student.toString() === s._id.toString());
                const total = sRecords.length;
                const present = sRecords.filter(r => r.status === 'present').length;
                return total > 0 ? (present / total) * 100 : 0;
            });
            avgAttendance = studentCounts.reduce((a, b) => a + b, 0) / students.length;
        }

        res.json({
            totalStudents,
            vacantBeds: `${vacantBeds}/${totalBeds}`,
            monitorName,
            pendingAdmissions,
            avgAttendance: Math.round(avgAttendance) + '%'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get detailed current monitor info
// @route   GET /api/manager/monitor
// @access  Private/Manager
const getCurrentMonitor = async (req, res) => {
    try {
        const monitor = await User.findOne({ role: 'monitor' }).select('-password').lean();

        if (!monitor) {
            return res.status(404).json({ message: 'No monitor assigned' });
        }

        // Fetch admission details to get personal/family info
        const admission = await Admission.findOne({ user: monitor._id }).lean();

        res.json({
            ...monitor,
            admissionDetails: admission || {}
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Assign new monitor
// @route   POST /api/manager/assign-monitor/:studentId
// @access  Private/Manager
const assignMonitor = async (req, res) => {
    try {
        const newMonitorId = req.params.studentId;

        // 1. Find current monitor (if any)
        const currentMonitor = await User.findOne({ role: 'monitor' });

        if (currentMonitor) {
            // Update current monitor role to student
            currentMonitor.role = 'student';
            await currentMonitor.save();

            // Close their history record
            const activeHistory = await MonitorHistory.findOne({
                user: currentMonitor._id,
                endDate: { $exists: false }
            });

            if (activeHistory) {
                activeHistory.endDate = Date.now();
                activeHistory.removalReason = 'New monitor appointed';
                await activeHistory.save();
            }
        }

        // 2. Assign new monitor
        const newMonitor = await User.findById(newMonitorId);
        if (!newMonitor) {
            return res.status(404).json({ message: 'Student not found' });
        }

        newMonitor.role = 'monitor';
        await newMonitor.save();

        // 3. Create new history record
        await MonitorHistory.create({
            user: newMonitor._id,
            startDate: Date.now()
        });

        res.json({
            message: `Successfully appointed ${newMonitor.name} as the new monitor`,
            monitor: newMonitor
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getMonitorHistory = async (req, res) => {
    try {
        const history = await MonitorHistory.find()
            .populate('user', 'name image')
            .sort({ startDate: -1 })
            .lean();

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete monitor history record
// @route   DELETE /api/manager/monitor-history/:id
// @access  Private/Manager
const deleteMonitorHistory = async (req, res) => {
    try {
        const history = await MonitorHistory.findById(req.params.id);

        if (!history) {
            return res.status(404).json({ message: 'History record not found' });
        }

        await MonitorHistory.findByIdAndDelete(req.params.id);

        res.json({ message: 'History record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Add a new student
// @route   POST /api/manager/students
// @access  Private/Manager
const addStudent = async (req, res) => {
    try {
        const {
            name, email, password, phone, department, year, studentType,
            location, hostelStay, examCleared, currentPosition,
            keyAchievements, testimony, instagram, facebook, contactNumber
        } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email and password' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        let profileImageData = { url: null, publicId: null };
        let experienceVideoData = { url: null, publicId: null };

        // Handle profile image upload if present
        if (req.files && req.files['profileImage']) {
            const uploadResult = await uploadToCloudinaryStream(req.files['profileImage'][0].buffer, 'students/profile', 'image');
            profileImageData = {
                url: uploadResult.url,
                publicId: uploadResult.public_id
            };
        }

        // Handle experience video upload if present
        if (req.files && req.files['experienceVideo']) {
            const uploadResult = await uploadToCloudinaryStream(req.files['experienceVideo'][0].buffer, 'students/videos', 'video');
            experienceVideoData = {
                url: uploadResult.url,
                publicId: uploadResult.public_id
            };
        }

        // Parse keyAchievements if it's a string (from FormData)
        let achievementsArray = [];
        if (keyAchievements) {
            try {
                achievementsArray = JSON.parse(keyAchievements);
            } catch (e) {
                // If not JSON, maybe it's a comma-separated string or just a single string
                achievementsArray = typeof keyAchievements === 'string'
                    ? keyAchievements.split(',').map(a => a.trim()).filter(a => a !== '')
                    : [keyAchievements];
            }
        }

        // Create student user
        const student = await User.create({
            name,
            email,
            password,
            role: 'student',
            admissionStatus: 'approved',
            isEmailVerified: true,
            department,
            year,
            studentType: studentType || 'current',
            profileImage: profileImageData,
            studentStatus: 'active',
            location,
            hostelStay,
            examCleared,
            currentPosition,
            keyAchievements: achievementsArray,
            testimony,
            experienceVideo: experienceVideoData,
            socialLinks: {
                instagram,
                facebook
            },
            contactNumber: contactNumber || phone
        });

        // Also create a basic admission record for compatibility
        await Admission.create({
            user: student._id,
            personalDetails: {
                fullName: name,
                age: 0,
                contact: phone || 'N/A',
                email: email,
                address: location || 'N/A'
            },
            educationDetails: {
                course: department || 'N/A',
                tenthScore: 'N/A',
                twelfthScore: 'N/A',
                examFocus: 'N/A'
            },
            familyDetails: {
                fatherOccupation: 'N/A',
                annualIncome: '0',
            },
            documents: {
                tenthMarksheet: 'N/A',
                twelfthMarksheet: 'N/A',
                incomeCertificate: 'N/A',
                aadhaarCard: 'N/A'
            },
            status: 'approved',
            reviewedBy: req.user._id,
            reviewedAt: Date.now()
        });

        res.status(201).json({
            message: 'Student added successfully',
            student: {
                _id: student._id,
                name: student.name,
                email: student.email,
                role: student.role,
                admissionStatus: student.admissionStatus,
                profileImage: student.profileImage
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get recent activities for the manager
// @route   GET /api/manager/activities
// @access  Private/Manager
const getManagerActivities = async (req, res) => {
    try {
        // 1. Fetch last 10 admissions
        const admissions = await Admission.find()
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        // 2. Fetch last 10 global notices/messages
        const notices = await Notice.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        // 3. Fetch last 10 students added to system
        const newStudents = await User.find({ role: 'student', admissionStatus: 'approved' })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        // Transform and combine
        const transformedAdmissions = admissions.map(a => ({
            id: `adm-${a._id}`,
            title: `Admission ${a.status.charAt(0).toUpperCase() + a.status.slice(1)}`,
            user: `${a.personalDetails?.fullName || a.user?.name || 'Applicant'}`,
            time: a.createdAt,
            type: 'admission'
        }));

        const transformedNotices = notices.map(n => ({
            id: `ntc-${n._id}`,
            title: n.category === 'Message' ? 'Message Sent' : 'Notice Posted',
            user: n.title,
            time: n.createdAt,
            type: n.category === 'Message' ? 'message' : 'notice'
        }));

        const transformedStudents = newStudents.map(s => ({
            id: `stu-${s._id}`,
            title: 'New Student Added',
            user: s.name,
            time: s.createdAt,
            type: 'update'
        }));

        const allActivities = [...transformedAdmissions, ...transformedNotices, ...transformedStudents]
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, 15);

        res.status(200).json(allActivities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get manager profile stats
// @route   GET /api/manager/profile-stats
// @access  Private/Manager
const getManagerProfileStats = async (req, res) => {
    try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        // 1. Total Actions This Month
        // - Admissions reviewed this month
        const admissionsReviewedMonth = await Admission.countDocuments({
            reviewedBy: req.user._id,
            reviewedAt: { $gte: startOfMonth }
        });

        // - Notices/Messages posted this month by manager
        const noticesPostedMonth = await Notice.countDocuments({
            sender: req.user._id,
            createdAt: { $gte: startOfMonth }
        });

        // - Students added/approved this month (if added manually by manager)
        // We can approximate this by students created this month
        const studentsAddedMonth = await User.countDocuments({
            role: 'student',
            createdAt: { $gte: startOfMonth }
        });

        const totalActionsMonth = admissionsReviewedMonth + noticesPostedMonth + studentsAddedMonth;

        // 2. Messages Sent (Total Lifetime)
        const totalMessagesSent = await Notice.countDocuments({
            sender: req.user._id
        });

        // 3. Reports/Admissions Generated (Total Lifetime)
        // Using "Admissions Reviewed" as a proxy for Reports Generated
        const totalReportsGenerated = await Admission.countDocuments({
            status: { $in: ['approved', 'rejected'] }
        });

        res.json({
            totalActionsMonth,
            messagesSent: totalMessagesSent,
            reportsGenerated: totalReportsGenerated
        });
    } catch (error) {
        console.error('Error fetching manager stats:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllStudents,
    updateStudent,
    deleteStudent,
    getManagerSummary,
    getCurrentMonitor,
    assignMonitor,
    getMonitorHistory,
    deleteMonitorHistory,
    addStudent,
    getManagerActivities,
    getManagerProfileStats
};
