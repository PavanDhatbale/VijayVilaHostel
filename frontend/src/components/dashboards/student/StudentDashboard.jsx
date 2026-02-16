import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../ui/Button';

const StudentDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">Application Status</h3>
                <p className="mt-2 text-gray-600">You have not submitted a hostel admission application yet.</p>
                <div className="mt-4">
                    <Link to="/admission">
                        <Button variant="primary">Apply for Hostel</Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                <p className="mt-2 text-gray-500">No new notifications.</p>
            </div>
        </div>
    );
};

export default StudentDashboard;
