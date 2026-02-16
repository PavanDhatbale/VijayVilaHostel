const checkAdmissionStatus = (req, res, next) => {
    if (req.user && req.user.role === 'student' && req.user.admissionStatus !== 'approved') {
        return res.status(403).json({
            message: 'Admission not approved yet. Please complete your application and wait for approval.',
            admissionStatus: req.user.admissionStatus
        });
    }
    next();
};

module.exports = checkAdmissionStatus;
