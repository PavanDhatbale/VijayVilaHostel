require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admission', require('./routes/admissionRoutes'));
app.use('/api/student-dashboard', require('./routes/studentDashboardRoutes'));
app.use('/api/manager', require('./routes/managerRoutes'));
app.use('/api/monitor', require('./routes/monitorRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/public', require('./routes/contentRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/hostel-location', require('./routes/locationRoutes'));
app.use('/api/contributions', require('./routes/contributionRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));

// Basic Route for testing
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
