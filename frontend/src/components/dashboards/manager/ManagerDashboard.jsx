import React, { useState } from 'react';
import ManagerStudents from './ManagerStudents';
import ManagerMonitors from './ManagerMonitors';

const ManagerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-4">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-md ${activeTab === 'overview' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`px-4 py-2 rounded-md ${activeTab === 'students' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Manage Students
                    </button>
                    <button
                        onClick={() => setActiveTab('monitors')}
                        className={`px-4 py-2 rounded-md ${activeTab === 'monitors' ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        Manage Monitors
                    </button>
                </div>
            </div>

            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900">Total Applications</h3>
                        <p className="mt-2 text-3xl font-bold text-blue-600">120</p>
                    </div>
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900">Occupancy</h3>
                        <p className="mt-2 text-3xl font-bold text-green-600">85%</p>
                    </div>
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900">Pending Approvals</h3>
                        <p className="mt-2 text-3xl font-bold text-orange-600">12</p>
                    </div>
                </div>
            )}

            {activeTab === 'students' && <ManagerStudents />}
            {activeTab === 'monitors' && <ManagerMonitors />}
        </div>
    );
};

export default ManagerDashboard;
