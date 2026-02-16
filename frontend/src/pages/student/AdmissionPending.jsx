import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Clock, ShieldCheck, LogOut, RefreshCcw, Home } from 'lucide-react';
import toast from 'react-hot-toast';

const AdmissionPending = () => {
    const { user, logout } = useAuth();
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        // In a real app, we'd fetch the latest user data from the API
        setTimeout(() => {
            setRefreshing(false);
            window.location.reload();
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="h-24 w-24 bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
                            <Clock className="h-12 w-12 text-orange-500" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-sm">
                            <ShieldCheck className="h-6 w-6 text-orange-500" />
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">Application Pending</h2>
                <p className="text-gray-600 text-lg mb-8">
                    Hi {user?.name.split(' ')[0]}, your admission request is currently under review by our hostel manager.
                </p>

                <div className="space-y-6">
                    <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 text-left">
                        <h4 className="font-bold text-orange-900 mb-2 text-sm uppercase tracking-wider">What happens next?</h4>
                        <ul className="text-sm text-orange-800 space-y-3">
                            <li className="flex gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0"></span>
                                The manager will review your submitted profile.
                            </li>
                            <li className="flex gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0"></span>
                                You may receive a call or email for verification.
                            </li>
                            <li className="flex gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0"></span>
                                Once approved, you'll gain full access to the hostel dashboard.
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 shadow-lg shadow-gray-200 disabled:opacity-50"
                        >
                            <RefreshCcw size={18} className={refreshing ? "animate-spin" : ""} />
                            {refreshing ? "Checking Status..." : "Refresh Status"}
                        </button>

                        <button
                            onClick={logout}
                            className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <LogOut size={18} /> Log Out
                        </button>

                        <Link
                            to="/"
                            className="w-full py-3 text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center justify-center gap-2 mt-2"
                        >
                            <Home size={18} /> Back to Home
                        </Link>
                    </div>

                    <p className="text-xs text-gray-400">
                        Average response time: 24-48 hours.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdmissionPending;
