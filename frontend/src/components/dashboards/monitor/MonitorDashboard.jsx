import React from 'react';

const MonitorDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900">Assigned Floor</h3>
                    <p className="mt-2 text-3xl font-bold text-blue-600">2nd Floor</p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900">Students Monitored</h3>
                    <p className="mt-2 text-3xl font-bold text-blue-600">45</p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900">Pending Issues</h3>
                    <p className="mt-2 text-3xl font-bold text-orange-600">3</p>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
                <p className="mt-2 text-gray-500">List of recent activities will appear here.</p>
            </div>
        </div>
    );
};

export default MonitorDashboard;
