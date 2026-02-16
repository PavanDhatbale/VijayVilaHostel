const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Check all students
        const allStudents = await User.find({ role: 'student' });
        console.log(`Total Students in DB: ${allStudents.length}`);

        // Check approved students
        const approved = allStudents.filter(s => s.admissionStatus === 'approved');
        console.log(`Approved Students: ${approved.length}`);

        // Check students with room numbers
        const withRoom = approved.filter(s => s.roomNumber);
        console.log(`Approved & Assigned Room: ${withRoom.length}`);

        // Check students matching the exact monitor query
        const matchingQuery = await User.find({
            role: 'student',
            admissionStatus: 'approved',
            roomNumber: { $ne: null },
            bedNumber: { $ne: null },
            studentStatus: 'active'
        });
        console.log(`Matching Monitor Query: ${matchingQuery.length}`);

        if (matchingQuery.length === 0 && withRoom.length > 0) {
            console.log('--- Sample Student Data ---');
            const sample = withRoom[0];
            console.log('Name:', sample.name);
            console.log('Role:', sample.role);
            console.log('AdmissionStatus:', sample.admissionStatus);
            console.log('RoomNumber:', sample.roomNumber, 'Type:', typeof sample.roomNumber);
            console.log('BedNumber:', sample.bedNumber, 'Type:', typeof sample.bedNumber);
            console.log('StudentStatus:', sample.studentStatus);
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

connectDB();
