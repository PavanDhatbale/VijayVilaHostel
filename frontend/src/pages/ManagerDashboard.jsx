import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import toast from 'react-hot-toast';
import {
    Users,
    Bed,
    UserCog,
    FileCheck,
    MessageSquare,
    ClipboardList,
    Plus,
    Image,
    Video,
    Check,
    X,
    Clock,
    Eye,
    MapPin,
    Briefcase,
    Heart,
    GraduationCap,
    FileText
} from 'lucide-react';

const ManagerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [pendingAdmissions, setPendingAdmissions] = useState([]);
    const [activities, setActivities] = useState([]);
    const [activitiesLoading, setActivitiesLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(5);
    const [summary, setSummary] = useState({
        totalStudents: 0,
        vacantBeds: '0/0',
        monitorName: '...',
        pendingAdmissions: 0,
        avgAttendance: '0%'
    });
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [admissionsRes, summaryRes, activitiesRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/admission`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_BASE_URL}/api/manager/summary`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_BASE_URL}/api/manager/activities`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const admissionsData = await admissionsRes.json();
            const summaryData = await summaryRes.json();
            const activitiesData = await activitiesRes.json();

            if (admissionsRes.ok) {
                const pending = admissionsData.filter(item => item.status === 'pending');
                setPendingAdmissions(pending);
            }
            if (summaryRes.ok) {
                setSummary(summaryData);
            }
            if (activitiesRes.ok) {
                setActivities(activitiesData);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
            setActivitiesLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApprove = async (admissionId) => {
        if (!window.confirm('Are you sure you want to approve this admission?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/admission/${admissionId}/approve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Admission approved!');
                setPendingAdmissions(prev => prev.filter(s => s._id !== admissionId));
                if (selectedApp?._id === admissionId) setSelectedApp(null);
            } else {
                toast.error(data.message || 'Approval failed');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const handleReject = async (admissionId) => {
        const reason = window.prompt('Please enter a rejection reason:');
        if (reason === null) return;
        if (!reason.trim()) {
            toast.error('Rejection reason is required');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/admission/${admissionId}/reject`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rejectionReason: reason })
            });
            const data = await response.json();

            if (response.ok) {
                toast.success('Admission rejected');
                setPendingAdmissions(prev => prev.filter(app => app._id !== admissionId));
                if (selectedApp?._id === admissionId) setSelectedApp(null);
            } else {
                toast.error(data.message || 'Rejection failed');
            }
        } catch (error) {
            toast.error('Server error');
        }
    };

    const stats = [
        { label: 'Total Active Students', value: summary.totalStudents.toString(), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Total Vacant Beds', value: summary.vacantBeds, icon: Bed, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Current Monitor', value: summary.monitorName, icon: UserCog, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Pending Admissions', value: summary.pendingAdmissions.toString(), icon: FileCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Avg Attendance', value: summary.avgAttendance, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Disciplinary Actions', value: '0', icon: MessageSquare, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    const getRelativeTime = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffInMs = now - past;
        const diffInMins = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMins / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMins < 1) return 'Just now';
        if (diffInMins < 60) return `${diffInMins}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return `${diffInDays}d ago`;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Header title="Dashboard" />

                <main className="p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* Welcome Banner */}
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-10 text-white border border-gray-800 shadow-xl shadow-gray-200 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h1 className="text-3xl font-semibold mb-2 tracking-tight">
                                        Welcome, {user?.name || 'Manager'}
                                    </h1>
                                    <p className="text-gray-400 text-lg font-medium">
                                        Overall control and governance of Vijay Vila Hostel
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <button
                                        onClick={() => navigate('/manager-students')}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/30 transition-all active:scale-95 text-sm"
                                    >
                                        <Users size={20} />
                                        Manage Students
                                    </button>
                                    <button
                                        onClick={() => navigate('/manager-admissions')}
                                        className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 text-sm"
                                    >
                                        <FileCheck size={20} />
                                        Review Admissions
                                    </button>
                                </div>
                            </div>
                            {/* Abstract decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-white/5 to-transparent opacity-50"></div>
                        </div>

                        {/* Consolidated Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className={`bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up animation-delay-${(index + 1) * 100}`}>
                                    <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <p className="text-gray-500 font-medium text-sm mb-2 uppercase tracking-tight">{stat.label}</p>
                                    <h3 className="text-3xl font-semibold text-[#111827] tracking-tighter">{stat.value}</h3>
                                </div>
                            ))}
                        </div>

                        {/* Pending Admissions Section */}
                        {pendingAdmissions.length > 0 && (
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-200">
                                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-orange-50/30">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                            <Clock className="h-6 w-6 text-orange-600" />
                                        </div>
                                        <h2 className="text-2xl font-semibold text-[#111827]">Pending Admissions</h2>
                                    </div>
                                    <span className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-bold">
                                        {pendingAdmissions.length} Applications
                                    </span>
                                </div>
                                <div className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                        {pendingAdmissions.map((student) => (
                                            <div key={student._id} className="flex flex-col sm:flex-row items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
                                                        {(student.personalDetails?.fullName || student.user?.name || 'S').charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 line-clamp-1">{student.personalDetails?.fullName || student.user?.name}</h4>
                                                        <p className="text-sm text-gray-500 line-clamp-1">{student.personalDetails?.email || student.user?.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 w-full sm:w-auto">
                                                    <button
                                                        onClick={() => setSelectedApp(student)}
                                                        className="flex-1 sm:flex-none h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-colors border border-blue-100"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleApprove(student._id)}
                                                        className="flex-1 sm:flex-none h-10 px-4 bg-green-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition-colors font-bold text-sm shadow-md shadow-green-100 active:scale-95"
                                                    >
                                                        <Check size={18} /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(student._id)}
                                                        className="flex-1 sm:flex-none h-10 w-10 bg-white text-red-600 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors border border-red-50"
                                                        title="Reject"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recent Activities */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-300">
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                                <h2 className="text-2xl font-semibold text-[#111827]">Recent Activities</h2>
                            </div>
                            <div className="p-8 space-y-10">
                                {activitiesLoading ? (
                                    <p className="text-gray-500 italic text-center">Loading activities...</p>
                                ) : activities.length === 0 ? (
                                    <p className="text-gray-500 italic text-center">No recent activities.</p>
                                ) : (
                                    <>
                                        {activities.slice(0, visibleCount).map((activity, index) => (
                                            <div key={activity.id} className="relative flex gap-6 group">
                                                {/* Connector Line */}
                                                {index !== activities.slice(0, visibleCount).length - 1 && (
                                                    <div className="absolute left-[7px] top-8 bottom-[-40px] w-0.5 bg-gray-100 group-last:hidden"></div>
                                                )}

                                                <div className={`z-10 w-4 h-4 rounded-full ring-4 mt-2 flex-shrink-0 ${activity.type === 'admission' ? 'bg-orange-600 ring-orange-50' :
                                                    activity.type === 'message' ? 'bg-purple-600 ring-purple-50' :
                                                        activity.type === 'notice' ? 'bg-blue-600 ring-blue-50' :
                                                            'bg-green-600 ring-green-50'
                                                    }`}></div>

                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="text-xl font-semibold text-[#111827] tracking-tight mb-1">
                                                            {activity.title}
                                                        </h4>
                                                    </div>
                                                    <p className="text-gray-600 font-medium text-lg mb-1">{activity.user}</p>
                                                    <p className="text-gray-400 font-semibold text-sm uppercase tracking-wider">
                                                        {getRelativeTime(activity.time)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                        {activities.length > visibleCount && (
                                            <div className="pt-4 flex justify-center">
                                                <button
                                                    onClick={() => setVisibleCount(prev => prev + 5)}
                                                    className="px-8 py-3 rounded-2xl bg-gray-50 text-gray-600 font-bold border border-gray-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all flex items-center gap-2 active:scale-95"
                                                >
                                                    <Plus size={18} />
                                                    View More Activities
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                </main>
            </div>

            {/* Application Details Modal */}
            {selectedApp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                                    <ClipboardList size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">Application Details</h2>
                                    <p className="text-gray-500 font-medium tracking-tight">Reviewing {selectedApp.personalDetails?.fullName}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="h-12 w-12 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center shdaow-sm"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Left Column: Personal & Family */}
                                <div className="space-y-10">
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                                <Users size={18} />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider text-sm">Personal Info</h3>
                                        </div>
                                        <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
                                            <DetailItem label="Full Name" value={selectedApp.personalDetails?.fullName} />
                                            <DetailItem label="Email Address" value={selectedApp.personalDetails?.email} />
                                            <DetailItem label="Contact Number" value={selectedApp.personalDetails?.contact} />
                                            <DetailItem label="Age" value={selectedApp.personalDetails?.age} />
                                            <DetailItem label="Full Address" value={selectedApp.personalDetails?.address} />
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                                <Heart size={18} />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider text-sm">Family Details</h3>
                                        </div>
                                        <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
                                            <DetailItem label="Father's Occupation" value={selectedApp.familyDetails?.fatherOccupation} />
                                            <DetailItem label="Annual Income" value={selectedApp.familyDetails?.annualIncome} />
                                            <DetailItem label="Financial Need" value={selectedApp.familyDetails?.financialNeed} />
                                        </div>
                                    </section>
                                </div>

                                {/* Right Column: Education */}
                                <div className="space-y-10">
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                                <GraduationCap size={18} />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider text-sm">Academic Profile</h3>
                                        </div>
                                        <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
                                            <DetailItem label="Exam Focus" value={selectedApp.educationDetails?.examFocus} />
                                            <DetailItem label="College/Course" value={selectedApp.educationDetails?.course} />
                                            <DetailItem label="10th Percentage" value={selectedApp.educationDetails?.tenthScore ? `${selectedApp.educationDetails.tenthScore}%` : null} />
                                            <DetailItem label="12th Percentage" value={selectedApp.educationDetails?.twelfthScore ? `${selectedApp.educationDetails.twelfthScore}%` : null} />
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                                                <Clock size={18} />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider text-sm">Application Status</h3>
                                        </div>
                                        <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
                                            <DetailItem label="Current Status" value={selectedApp.status?.toUpperCase()} />
                                            <DetailItem label="Applied On" value={new Date(selectedApp.createdAt).toLocaleDateString()} />
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                                                <FileText size={18} />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider text-sm">Documents</h3>
                                        </div>
                                        <div className="bg-gray-50 rounded-3xl p-6 grid grid-cols-2 gap-4">
                                            <DocumentLink label="10th Marksheet" path={selectedApp.documents?.tenthMarksheet} />
                                            <DocumentLink label="12th Marksheet" path={selectedApp.documents?.twelfthMarksheet} />
                                            <DocumentLink label="Income Cert." path={selectedApp.documents?.incomeCertificate} />
                                            <DocumentLink label="Aadhaar Card" path={selectedApp.documents?.aadhaarCard} />
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-4">
                            <button
                                onClick={() => handleReject(selectedApp._id)}
                                className="px-8 py-3 rounded-2xl font-bold bg-white text-red-600 border-2 border-red-50 hover:bg-red-50 transition-all flex items-center gap-2"
                            >
                                <X size={20} /> Reject
                            </button>
                            <button
                                onClick={() => handleApprove(selectedApp._id)}
                                className="px-8 py-3 rounded-2xl font-bold bg-green-600 text-white shadow-lg shadow-green-100 hover:scale-[1.02] transition-all flex items-center gap-2"
                            >
                                <Check size={20} /> Approve Admission
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailItem = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-gray-900 font-semibold">{value || 'Not provided'}</p>
    </div>
);

const DocumentLink = ({ label, path }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL+"/api";

    // Debugging: Log the path type and value
    // console.log(`DocumentLink [${label}]:`, typeof path, path);

    if (!path) return (
        <div className="p-3 bg-white border border-gray-100 rounded-xl opacity-50">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
            <p className="text-gray-400 text-xs italic">Not uploaded</p>
        </div>
    );

    let docUrl = null;
    let isCloudinary = false;

    // Handle Object Structure (Cloudinary)
    if (typeof path === 'object') {
        if (path.url) {
            docUrl = path.url;
            isCloudinary = true;
        } else {
            // Fallback if object doesn't have url property (unexpected)
            console.error(`Invalid document object for ${label}:`, path);
            // Try to find any string property that looks like a URL? No, safer to fail gracefully.
            return (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{label}</p>
                    <p className="text-red-500 text-xs italic">Invalid Format</p>
                </div>
            );
        }
    }
    // Handle String Structure (Legacy or direct URL)
    else if (typeof path === 'string') {
        // Double check against "[object Object]" string
        if (path === '[object Object]') {
            console.error(`Corrupted document path for ${label}: [object Object]`);
            return (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{label}</p>
                    <p className="text-red-500 text-xs italic">File Error</p>
                </div>
            );
        }
        docUrl = path;
        if (docUrl.startsWith('http')) {
            isCloudinary = true;
        }
    }

    if (!docUrl) return null;

    // Determine the full URL
    let fullUrl;
    if (isCloudinary) {
        fullUrl = docUrl;
    } else {
        // It's a local path, prepend base URL (stripping /api if needed)
        const FILE_BASE_URL = API_BASE_URL.replace('/api', '');
        fullUrl = `${FILE_BASE_URL}/${docUrl}`;
    }

    return (
        <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all group block"
        >
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500">{label}</p>
            <div className="flex items-center gap-1.5 mt-1">
                <FileText size={14} className="text-blue-600" />
                <span className="text-blue-600 text-xs font-bold">View Document</span>
            </div>
        </a>
    );
};

export default ManagerDashboard;
