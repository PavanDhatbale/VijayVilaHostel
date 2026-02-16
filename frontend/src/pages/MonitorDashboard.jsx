import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import { Users, CheckCircle, Clock, MessageSquare, Bell, Calendar, Plus, Send, ClipboardList, XCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MonitorDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [summary, setSummary] = useState({
        totalStudents: 0,
        present: 0,
        absent: 0,
        pending: 0,
        vacantBeds: 0
    });
    const [visibleCount, setVisibleCount] = useState(6);
    const [activities, setActivities] = useState([]);
    const [activitiesLoading, setActivitiesLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/api/monitor/summary`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setSummary(data);
                }
            } catch (error) {
                console.error('Error fetching summary:', error);
            }
        };

        const fetchActivities = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/api/monitor/activities`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setActivities(data);
                }
            } catch (error) {
                console.error('Error fetching activities:', error);
            } finally {
                setActivitiesLoading(false);
            }
        };

        fetchSummary();
        fetchActivities();
    }, [API_BASE_URL]);

    // Helper for relative time
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

    const stats = [
        { label: 'Active Students', value: summary.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Present Today', value: summary.present, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Absent Today', value: summary.absent, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Pending', value: summary.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Vacant Beds', value: summary.vacantBeds, icon: Bell, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];


    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Header title="Dashboard" />

                <main className="p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* Welcome Banner */}
                        <div className="bg-gradient-to-r from-blue-700 to-cyan-600 rounded-3xl p-10 text-white relative overflow-hidden shadow-xl shadow-blue-200 animate-fade-in-up">
                            <div className="relative z-10">
                                <h1 className="text-4xl font-bold mb-4">Welcome, {user?.name?.split(' ')[0] || 'Amit'}!</h1>
                                <p className="text-blue-50 text-lg">Maintain discipline and smooth hostel operations</p>
                            </div>
                            {/* Decorative Circles */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-white opacity-10 rounded-full translate-y-1/2"></div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up animation-delay-${(index + 1) * 100}`}>
                                    <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                                        <stat.icon size={20} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-200">
                            <button
                                onClick={() => navigate('/monitor/attendance')}
                                className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Calendar size={20} />
                                Mark Attendance
                            </button>
                            <button
                                onClick={() => navigate('/monitor-messages')}
                                className="flex items-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Send size={20} />
                                Send Message
                            </button>
                            <button
                                onClick={() => navigate('/monitor-notices')}
                                className="flex items-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 hover:scale-105 active:scale-95 transition-all"
                            >
                                <Plus size={20} />
                                Post Notice
                            </button>
                        </div>

                        {/* Content Grid */}
                        <div className="space-y-8">
                            {/* Recent Activities */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden pb-4 hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-300">
                                <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                                    <h2 className="text-2xl font-semibold text-[#111827]">Recent Activities</h2>
                                </div>
                                <div className="px-8 pt-4 space-y-4">
                                    {activitiesLoading ? (
                                        <p className="p-8 text-gray-500 text-center italic">Loading activities...</p>
                                    ) : activities.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <ClipboardList className="h-8 w-8 text-gray-300" />
                                            </div>
                                            <p className="text-gray-500 italic">No recent activities found.</p>
                                        </div>
                                    ) : (
                                        <>
                                            {activities.slice(0, visibleCount).map((activity, index) => (
                                                <div key={activity.id} className="relative flex gap-6 group">
                                                    {/* Connector Line */}
                                                    {index !== activities.slice(0, visibleCount).length - 1 && (
                                                        <div className="absolute left-[7px] top-8 bottom-[-40px] w-0.5 bg-gray-100 group-last:hidden"></div>
                                                    )}

                                                    <div className={`z-10 w-4 h-4 rounded-full ring-4 mt-2 flex-shrink-0 ${activity.type === 'Attendance' ? 'bg-green-600 ring-green-50' :
                                                        'bg-blue-600 ring-blue-50'
                                                        }`}></div>

                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="text-xl font-semibold text-[#111827] tracking-tight mb-1">
                                                                {activity.title}
                                                            </h4>
                                                        </div>
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

                            {/* Monitor Responsibilities */}
                            <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-8 hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-300">
                                <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                                    <ClipboardList className="h-6 w-6" />
                                    Monitor Responsibilities
                                </h3>
                                <ul className="space-y-4">
                                    {[
                                        'Mark daily attendance for all students before 10 AM',
                                        'Respond to student messages and queries promptly',
                                        'Post important hostel notices and maintain discipline',
                                        'Keep student records updated and accurate'
                                    ].map((duty, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                            <p className="text-blue-800 font-medium">{duty}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default MonitorDashboard;
