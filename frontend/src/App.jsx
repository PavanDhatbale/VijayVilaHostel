import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import StudentDashboard from './pages/StudentDashboard';
import Attendance from './pages/student/Attendance';
import Contributions from './pages/student/StudentContributions';
import HostelUpdates from './pages/student/HostelUpdates';
import Profile from './pages/student/Profile';
import StudentGallery from './pages/student/Gallery';
import MonitorDashboard from './pages/MonitorDashboard';
import MonitorStudents from './pages/monitor/Students';
import MonitorAttendance from './pages/monitor/Attendance';
import MonitorMessages from './pages/monitor/Messages';
import MonitorContributions from './pages/monitor/Contributions';
import MonitorHostelUpdates from './pages/monitor/HostelUpdates';
import MonitorProfile from './pages/monitor/Profile';
import ManagerDashboard from './pages/ManagerDashboard';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Students from './pages/Students';
import StudentDetails from './pages/StudentDetails';
import Gallery from './pages/Gallery';
import AdmissionApply from './pages/student/AdmissionApply';
import AdmissionPending from './pages/student/AdmissionPending';
import StudentStatusDashboard from './pages/student/StudentStatusDashboard';
import AdmissionForm from './components/admission/AdmissionForm';

import ManagerStudents from './pages/manager/Students';
import ManagerMonitor from './pages/manager/Monitor';
import ManagerAdmissions from './pages/manager/Admissions';
import ManagerAttendance from './pages/manager/Attendance';
import ManagerMessages from './pages/manager/Messages';
import ManagerProfile from './pages/manager/Profile';

import StudentLeave from './pages/student/LeaveApplication';
import MonitorLeave from './pages/monitor/LeaveApplications';

function App() {
  const { user } = useAuth();
  const location = useLocation();

  // Debug Log
  console.log('App: Current path:', location.pathname);

  const hideNavbarRoutes = [
    '/student-dashboard',
    '/monitor-dashboard',
    '/manager-dashboard',
    '/login',
    '/signup',
    '/verify-email',
    '/unauthorized',
    '/attendance',
    '/notices',
    '/profile',
    '/student-gallery',
    '/admission-apply',
    '/admission-pending',
    '/monitor-students',
    '/monitor/attendance',
    '/monitor-messages',
    '/monitor-notices',
    '/monitor/profile',
    '/manager-students',
    '/manager-monitor',
    '/manager-admissions',
    '/manager-attendance',
    '/manager-messages',
    '/manager-profile',
    '/dashboard',
    '/leave-application',
    '/monitor-leaves'
  ];

  const showNavbar = !hideNavbarRoutes.some(route => location.pathname.startsWith(route));

  // Also hide footer on these routes
  const showFooter = showNavbar;

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Login />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentDetails />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/about" element={<div className="p-10 text-center">About Page Placeholder</div>} />
          <Route path="/contact" element={<div className="p-10 text-center">Contact Page Placeholder</div>} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StudentStatusDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/monitor-dashboard"
            element={
              <ProtectedRoute allowedRoles={['monitor']}>
                <MonitorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager-dashboard"
            element={
              <ProtectedRoute allowedRoles={['hostelManager']}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Student Specific Routes */}
          <Route path="/attendance" element={<ProtectedRoute allowedRoles={['student']}><Attendance /></ProtectedRoute>} />
          <Route path="/notices" element={<ProtectedRoute allowedRoles={['student']}><HostelUpdates /></ProtectedRoute>} />
          <Route path="/leave-application" element={<ProtectedRoute allowedRoles={['student']}><StudentLeave /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['student']}><Profile /></ProtectedRoute>} />
          <Route path="/student-gallery" element={<ProtectedRoute allowedRoles={['student']}><StudentGallery /></ProtectedRoute>} />

          {/* Monitor Specific Routes */}
          <Route path="/monitor-students" element={<ProtectedRoute allowedRoles={['monitor']}><MonitorStudents /></ProtectedRoute>} />
          <Route path="/monitor/attendance" element={<ProtectedRoute role="monitor"><MonitorAttendance /></ProtectedRoute>} />
          <Route path="/monitor-messages" element={<ProtectedRoute allowedRoles={['monitor']}><MonitorMessages /></ProtectedRoute>} />
          <Route path="/monitor-notices" element={<ProtectedRoute allowedRoles={['monitor']}><MonitorHostelUpdates /></ProtectedRoute>} />
          <Route path="/monitor-leaves" element={<ProtectedRoute allowedRoles={['monitor']}><MonitorLeave /></ProtectedRoute>} />
          <Route path="/monitor/profile" element={<ProtectedRoute role="monitor"><MonitorProfile /></ProtectedRoute>} />

          {/* Manager Specific Routes */}
          <Route path="/manager-students" element={<ProtectedRoute allowedRoles={['hostelManager']}><ManagerStudents /></ProtectedRoute>} />
          <Route path="/manager-monitor" element={<ProtectedRoute allowedRoles={['hostelManager']}><ManagerMonitor /></ProtectedRoute>} />
          <Route path="/manager-admissions" element={<ProtectedRoute allowedRoles={['hostelManager']}><ManagerAdmissions /></ProtectedRoute>} />
          <Route path="/manager-attendance" element={<ProtectedRoute allowedRoles={['hostelManager']}><ManagerAttendance /></ProtectedRoute>} />
          <Route path="/manager-messages" element={<ProtectedRoute allowedRoles={['hostelManager']}><ManagerMessages /></ProtectedRoute>} />
          <Route path="/manager-profile" element={<ProtectedRoute allowedRoles={['hostelManager']}><ManagerProfile /></ProtectedRoute>} />

          <Route path="/admission-apply" element={<ProtectedRoute allowedRoles={['student']}><AdmissionApply /></ProtectedRoute>} />
          <Route path="/admission-pending" element={<ProtectedRoute allowedRoles={['student']}><AdmissionPending /></ProtectedRoute>} />

          <Route
            path="/admission"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <AdmissionForm />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {showFooter && <Footer />}
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
