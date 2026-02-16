import React from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';

const Attendance = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Header title="Attendance Overlook" />
                <main className="p-8">
                    <div className="max-w-7xl mx-auto bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold mb-4">Attendance Overlook</h2>
                        <p className="text-gray-500 italic">This page is under development.</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Attendance;
