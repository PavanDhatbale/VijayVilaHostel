import React from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import PersonalGallery from '../../components/dashboard/PersonalGallery';
import { useAuth } from '../../context/AuthContext';

const StudentGallery = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Header title="My Personal Gallery" />

                <main className="p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <PersonalGallery studentId={user?._id} isOwner={true} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentGallery;
