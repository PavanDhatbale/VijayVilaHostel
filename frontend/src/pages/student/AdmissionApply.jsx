import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, CheckCircle2, ChevronRight, Bed, Wifi, Utensils, ShieldCheck, Home } from 'lucide-react';

const AdmissionApply = () => {
    const { user, logout } = useAuth();

    const benefits = [
        { icon: ShieldCheck, text: "Safe & secure accommodation" },
        { icon: Wifi, text: "24/7 Wi-Fi & electricity" },
        { icon: Utensils, text: "Hygienic food & facilities" },
        { icon: Bed, text: "Study-friendly environment" }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="mx-auto h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                        <ClipboardList className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Apply for Hostel Admission</h2>
                    <p className="text-gray-500 leading-relaxed">
                        You have not applied for hostel admission yet. Complete the application to request hostel access.
                    </p>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <CheckCircle2 size={16} /> Hostel Benefits
                    </h4>
                    <ul className="space-y-4">
                        {benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center gap-3 text-blue-800">
                                <benefit.icon size={18} className="text-blue-500 flex-shrink-0" />
                                <span className="text-sm font-medium">{benefit.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-4">
                    <Link
                        to="/admission"
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1"
                    >
                        Apply for Admission <ChevronRight size={18} />
                    </Link>

                    <button
                        onClick={logout}
                        className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors"
                    >
                        Log Out
                    </button>
                </div>

                <div className="mt-4">
                    <Link
                        to="/"
                        className="w-full py-3 text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <Home size={18} /> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdmissionApply;
