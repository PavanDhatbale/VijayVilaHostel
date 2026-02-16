import React from 'react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from '../components/dashboards/student/StudentDashboard';
import MonitorDashboard from '../components/dashboards/monitor/MonitorDashboard';
import ManagerDashboard from '../components/dashboards/manager/ManagerDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}!</h2>
                <p className="text-gray-600">
                    You are logged in as a <span className="font-bold uppercase">{user?.role}</span>.
                </p>
                <div className="mt-6 border-t border-gray-200 pt-6">
                    {user?.role === 'student' && <StudentDashboard />}
                    {user?.role === 'manager' && <ManagerDashboard />}
                    {user?.role === 'monitor' && <MonitorDashboard />}
                    {!user?.role && <p className="text-gray-500">Role not assigned. Please contact administrator.</p>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
