import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdmissionApply from './AdmissionApply';
import AdmissionPending from './AdmissionPending';
import { XCircle, RefreshCcw } from 'lucide-react';

const StudentStatusDashboard = () => {
    const { user, login, refreshProfile } = useAuth(); // Assuming login or a refreshUser function can update the context
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        // Redirect ONLY if approved AND accepted by student
        if (user?.role === 'student' && user?.admissionStatus === 'approved' && user?.admission?.isAcceptedByStudent) {
            navigate('/student-dashboard', { replace: true });
        } else if (user?.role === 'hostelManager') {
            navigate('/manager-dashboard', { replace: true });
        } else if (user?.role === 'monitor') {
            navigate('/monitor-dashboard', { replace: true });
        }
    }, [user, navigate]);

    const handleAcceptAdmission = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/admission/accept`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                // Determine the next route based on role (should be student-dashboard)
                // We need to refresh the user context here to get the updated admission status 
                await refreshProfile();
                // The useEffect will handle the redirect once 'user' is updated
            } else {
                // Handle specific error where admission is already accepted but UI is out of sync
                if (response.status === 400 && data.message === 'Admission already accepted') {
                    console.log('Admission already accepted, refreshing profile...');
                    await refreshProfile();
                } else {
                    console.error(data.message);
                }
            }
        } catch (error) {
            console.error('Error accepting admission:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    if (user.role === 'student') {
        // If approved and accepted, we render nothing (useEffect redirects)
        if (user.admissionStatus === 'approved' && user.admission?.isAcceptedByStudent) {
            return null;
        }

        switch (user.admissionStatus) {
            case 'not_applied':
                return <AdmissionApply />;
            case 'pending':
                return <AdmissionPending />;
            case 'rejected':
            case 'approved':
                // Show dual cards for Approved (not yet accepted) and Rejected
                return (
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Status Card (Left) */}
                            <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100 flex flex-col items-center text-center justify-center h-full">
                                <div className={`h-24 w-24 rounded-full flex items-center justify-center mb-6 ${user.admissionStatus === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                    {user.admissionStatus === 'approved' ? <RefreshCcw className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {user.admissionStatus === 'approved' ? 'Admission Approved!' : 'Admission Rejected'}
                                </h2>
                                <p className="text-gray-500 font-medium">
                                    {user.admissionStatus === 'approved'
                                        ? 'Your application has been reviewed and approved.'
                                        : 'Your application has been reviewed.'}
                                </p>
                            </div>

                            {/* Manager Decision Card (Right) */}
                            <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100 flex flex-col h-full relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500" />

                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                                    Manager's Decision
                                </h3>

                                <div className="flex-1 bg-gray-50 rounded-2xl p-6 mb-8">
                                    <p className="text-gray-700 font-medium italic leading-relaxed">
                                        "{user.admission?.managerMessage || (user.admissionStatus === 'rejected' ? user.admission?.rejectionReason : 'No message provided.')}"
                                    </p>
                                    <div className="mt-4 flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-gray-200" />
                                        <div>
                                            <p className="text-xs font-bold text-gray-900">Hostel Manager</p>
                                            <p className="text-[10px] text-gray-400">Vijay Vila Hostel</p>
                                        </div>
                                    </div>
                                </div>

                                {user.admissionStatus === 'approved' && (
                                    <div className="flex gap-4 mt-auto">
                                        {/* <button className="flex-1 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                                            Decline
                                        </button> */}
                                        <button
                                            onClick={handleAcceptAdmission}
                                            disabled={loading}
                                            className="flex-1 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold shadow-lg shadow-gray-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Processing...' : 'Accept Admission'}
                                        </button>
                                    </div>
                                )}

                                {user.admissionStatus === 'rejected' && (
                                    <div className="mt-auto">
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-bold transition-all"
                                        >
                                            Check for Updates
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                );
            default:
                return (
                    <div className="p-10 text-center">
                        <p>Loading your portal...</p>
                    </div>
                );
        }
    }

    return null;
};

export default StudentStatusDashboard;
