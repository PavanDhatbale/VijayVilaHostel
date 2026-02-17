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
// app.use(cors());
app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        'https://vijay-vila-hostel.vercel.app',
        'http://localhost:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
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

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Increase timeout to 30 minutes for large video uploads
server.timeout = 1800000;
server.keepAliveTimeout = 1800000;
server.headersTimeout = 1800000;
