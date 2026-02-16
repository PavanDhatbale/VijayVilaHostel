import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { CalendarCheck, BedDouble, Bell, CheckCircle, ChevronRight, XCircle, Clock, Info, AlertCircle, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import PersonalGallery from '../components/dashboard/PersonalGallery';

const StudentDashboard = () => {
    const { user, refreshProfile } = useAuth();
    const [attendanceData, setAttendanceData] = useState({
        history: [],
        percentage: 0,
        todayStatus: 'pending'
    });
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noticesLoading, setNoticesLoading] = useState(true);
    const [isUpdatesExpanded, setIsUpdatesExpanded] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchAttendance = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/student-dashboard/attendance`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setAttendanceData(data);
                // Also refresh profile to update sidebar/header stats
                refreshProfile();
            }
        } catch (error) {
            console.error('Error fetching attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNotices = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/notices`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setNotices(data);
            }
        } catch (error) {
            console.error('Error fetching notices:', error);
        } finally {
            setNoticesLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
        fetchNotices();

        // Polling for real-time updates every 30 seconds
        const interval = setInterval(() => {
            fetchAttendance();
            fetchNotices();
        }, 30000);
        return () => clearInterval(interval);
    }, [API_BASE_URL]);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 ml-64 flex flex-col">
                <Header title="Dashboard" />

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto space-y-8">

                        {/* Welcome Banner */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 animate-fade-in-up">
                            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name.split(' ')[0]}!</h1>
                            <p className="opacity-90">Focus on your preparation and stay disciplined</p>
                        </div>

                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Card 1: Attendance Percentage */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up animation-delay-100">
                                <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                                    <CalendarCheck className="h-6 w-6 text-emerald-500" />
                                </div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Attendance Rate</h3>
                                <div className="text-2xl font-bold text-gray-900 mb-1">{attendanceData.percentage}%</div>
                                <p className="text-xs text-gray-400">Monthly Average</p>
                            </div>

                            {/* Card 2: Today's Status */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up animation-delay-200">
                                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${attendanceData.todayStatus === 'present' ? 'bg-emerald-50' :
                                    attendanceData.todayStatus === 'absent' ? 'bg-rose-50' : 'bg-amber-50'
                                    }`}>
                                    {attendanceData.todayStatus === 'present' ? <CheckCircle className="h-6 w-6 text-emerald-500" /> :
                                        attendanceData.todayStatus === 'absent' ? <XCircle className="h-6 w-6 text-rose-500" /> :
                                            <Clock className="h-6 w-6 text-amber-500" />}
                                </div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Today's Status</h3>
                                <div className={`text-2xl font-bold mb-1 capitalize ${attendanceData.todayStatus === 'present' ? 'text-emerald-600' :
                                    attendanceData.todayStatus === 'absent' ? 'text-rose-600' : 'text-amber-500'
                                    }`}>
                                    {attendanceData.todayStatus}
                                </div>
                                <p className="text-xs text-gray-400">Marked by Monitor</p>
                            </div>

                            {/* Card 3: Room Info */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up animation-delay-300">
                                <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                                    <BedDouble className="h-6 w-6 text-indigo-500" />
                                </div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Room & Bed Info</h3>
                                {user?.roomNumber ? (
                                    <>
                                        <div className="text-2xl font-bold text-gray-900 mb-1">Room {user.roomNumber}</div>
                                        <p className="text-xs text-gray-400">Bed Number: {user.bedNumber || 'N/A'}</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="text-lg font-bold text-gray-400 mb-1 leading-tight">Assignment Pending</div>
                                        <p className="text-[10px] text-orange-500 font-medium">Pending assignment.</p>
                                    </>
                                )}
                            </div>

                            {/* Card 4: Account Status */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up animation-delay-300">
                                <div className="h-12 w-12 bg-violet-50 rounded-xl flex items-center justify-center mb-4">
                                    <Bell className="h-6 w-6 text-violet-500" />
                                </div>
                                <h3 className="text-gray-500 text-sm font-medium mb-1">Account Status</h3>
                                <div className={`text-2xl font-bold mb-1 uppercase ${user?.studentStatus === 'active' ? 'text-emerald-600' : 'text-rose-500'}`}>
                                    {user?.studentStatus || 'Active'}
                                </div>
                                <p className="text-xs text-gray-400">Regular Member</p>
                            </div>
                        </div>

                        {/* Recent Updates (Notices) */}
                        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-200">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                                        <Bell size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Recent Updates</h2>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {noticesLoading ? (
                                    <p className="text-gray-500">Loading updates...</p>
                                ) : notices.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Bell className="h-8 w-8 text-gray-300" />
                                        </div>
                                        <p className="text-gray-500 italic">No updates found yet.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-4">
                                            {(isUpdatesExpanded ? notices : notices.slice(0, 3)).map((notice) => (
                                                <div key={notice._id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-50 hover:bg-white transition-colors cursor-pointer group">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-3 rounded-xl ${notice.priority ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                                            {notice.priority ? <AlertCircle size={20} /> : <Info size={20} />}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{notice.title}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-[10px] font-black uppercase text-blue-600/60 bg-blue-50 px-2 py-0.5 rounded-md">{notice.category}</span>
                                                                <span className="text-[10px] text-gray-400 font-medium">{new Date(notice.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                                                </div>
                                            ))}
                                        </div>

                                        {notices.length > 3 && (
                                            <button
                                                onClick={() => setIsUpdatesExpanded(!isUpdatesExpanded)}
                                                className="w-full mt-6 py-4 rounded-2xl border-2 border-dashed border-gray-100 text-gray-500 font-bold hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 group"
                                            >
                                                {isUpdatesExpanded ? (
                                                    <>Show Less</>
                                                ) : (
                                                    <>
                                                        View {notices.length - 3} More {notices.length - 3 === 1 ? 'Update' : 'Updates'}
                                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Personal Gallery Section */}
                        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-300">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                                        <ImageIcon size={20} />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Personal Gallery</h2>
                                </div>
                            </div>
                            <PersonalGallery studentId={user?._id} isOwner={true} />
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;
