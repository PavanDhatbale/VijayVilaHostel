import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import {
    User,
    Mail,
    Phone,
    Home,
    MapPin,
    Calendar,
    Settings,
    UserMinus,
    History,
    TrendingUp,
    CheckCircle,
    Clock,
    Zap,
    Users,
    X,
    Search,
    Trash
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManagerMonitor = () => {
    const [currentMonitor, setCurrentMonitor] = useState(null);
    const [students, setStudents] = useState([]);
    const [historyLogs, setHistoryLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [monitorRes, historyRes, studentsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/manager/monitor`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_BASE_URL}/manager/monitor-history`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_BASE_URL}/manager/students`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            const monitorData = await monitorRes.json();
            const historyData = await historyRes.json();
            const studentsData = await studentsRes.json();

            if (monitorRes.ok) setCurrentMonitor(monitorData);
            if (historyRes.ok) setHistoryLogs(historyData);
            if (studentsRes.ok) setStudents(studentsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssignMonitor = async (studentId) => {
        if (!window.confirm('Are you sure you want to appoint this student as the new monitor?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/manager/assign-monitor/${studentId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                setIsModalOpen(false);
                fetchData(); // Refresh all data
            } else {
                toast.error(data.message || 'Failed to assign monitor');
            }
        } catch (error) {
            toast.error('Server error');
        }
    };

    const handleDeleteHistory = async (historyId) => {
        if (!window.confirm('Are you sure you want to delete this history record?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/manager/monitor-history/${historyId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (response.ok) {
                toast.success('History record deleted');
                setHistoryLogs(prev => prev.filter(log => log._id !== historyId));
            } else {
                toast.error(data.message || 'Failed to delete history');
            }
        } catch (error) {
            toast.error('Server error');
        }
    };

    const performance = [
        { label: 'Overall Performance', value: '92%', progress: 92, color: 'bg-green-500', icon: TrendingUp },
        { label: 'Tasks Completed', value: '145', progress: 100, color: 'bg-blue-500', icon: CheckCircle },
        { label: 'Attendance Marked', value: '98%', progress: 98, color: 'bg-purple-500', icon: Clock },
        { label: 'Responsiveness', value: '95%', progress: 95, color: 'bg-orange-500', icon: Zap },
    ];

    const history = [
        {
            name: 'Vikas Patil',
            role: 'Former Monitor',
            period: 'Nov 2023 - Jan 2024',
            performance: '88%',
            reason: 'Resigned - Personal reasons',
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100"
        },
        {
            name: 'Suresh Kumar',
            role: 'Former Monitor',
            period: 'Aug 2023 - Oct 2023',
            performance: '85%',
            reason: 'Removed - Performance issues',
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Header title="Monitor Management" />

                <main className="p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">

                        <div>
                            <h1 className="text-3xl font-semibold text-[#111827] mb-1">Monitor Management</h1>
                            <p className="text-gray-500 font-medium">Manage current monitor and view history</p>
                        </div>

                        {/* Current Monitor Card & Performance Overview */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Profile Card */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-8 h-full flex flex-col items-center text-center">
                                    {loading ? (
                                        <div className="py-20 text-gray-400 font-bold">Loading...</div>
                                    ) : !currentMonitor ? (
                                        <div className="py-10 flex flex-col items-center">
                                            <div className="bg-gray-50 h-24 w-24 rounded-3xl flex items-center justify-center mb-6">
                                                <User size={48} className="text-gray-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Monitor</h3>
                                            <p className="text-gray-500 text-sm font-medium mb-6">Assign a student to start tracking performance.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="relative mb-6">
                                                <div className="h-40 w-40 rounded-full ring-8 ring-blue-50 overflow-hidden shadow-lg border-4 border-white bg-blue-100 flex items-center justify-center">
                                                    {currentMonitor.image ? (
                                                        <img src={currentMonitor.image} alt={currentMonitor.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <span className="text-4xl font-bold text-blue-600">{currentMonitor.name?.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                                                    Current Monitor
                                                </div>
                                            </div>

                                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{currentMonitor.name}</h2>
                                            <p className="text-gray-400 font-semibold text-sm flex items-center gap-1.5 justify-center mb-6">
                                                <Calendar size={14} />
                                                Appointed: {new Date(currentMonitor.createdAt).toLocaleDateString()}
                                            </p>

                                            <div className="w-full space-y-4 text-left border-t border-gray-50 pt-6">
                                                <div className="flex items-center gap-3 text-gray-600">
                                                    <Mail size={18} className="text-gray-400" />
                                                    <span className="font-semibold text-sm truncate">{currentMonitor.email}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-gray-600">
                                                    <Phone size={18} className="text-gray-400" />
                                                    <span className="font-semibold text-sm">{currentMonitor.admissionDetails?.personalDetails?.contact || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-gray-600">
                                                    <Home size={18} className="text-gray-400" />
                                                    <span className="font-semibold text-sm">Room: {currentMonitor.roomNumber || 'N/A'}, Bed: {currentMonitor.bedNumber || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Performance Grid */}
                            <div className="lg:col-span-2 space-y-6">
                                <h3 className="text-xl font-bold text-gray-900 px-2">Performance Overview</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {performance.map((item, index) => (
                                        <div key={index} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="text-gray-500 font-bold text-[11px] uppercase tracking-widest">{item.label}</div>
                                                <item.icon size={18} className="text-gray-400" />
                                            </div>
                                            <div className="flex items-end justify-between gap-4 mb-3">
                                                <div className="text-4xl font-bold text-gray-900">
                                                    {index === 2 ? `${currentMonitor?.attendancePercentage || 0}%` : item.value}
                                                </div>
                                                <div className="text-[10px] font-bold text-gray-400">TARGET: 90%</div>
                                            </div>
                                            <div className="h-2.5 bg-gray-50 rounded-full overflow-hidden shadow-inner border border-gray-100/50">
                                                <div
                                                    className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                                                    style={{ width: `${index === 2 ? (currentMonitor?.attendancePercentage || 0) : item.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Assign New Monitor Banner - FULL WIDTH */}
                        <div className="bg-blue-600/5 p-8 rounded-[40px] border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="bg-blue-600 h-16 w-16 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
                                    <Users size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-blue-900 mb-1">Assign New Monitor</h3>
                                    <p className="text-sm font-bold text-blue-700/70">Select a student from the active hostel list to assign as the new monitor</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full md:w-auto bg-blue-600 text-white px-12 py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:scale-[1.02] transition-all active:scale-95 whitespace-nowrap"
                            >
                                Select from Students
                            </button>
                        </div>

                        {/* History Log */}
                        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-10 border-b border-gray-50 flex items-center gap-4 bg-gray-50/30">
                                <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-md text-gray-400 border border-gray-100">
                                    <History size={28} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Monitor History Log</h2>
                            </div>
                            <div className="p-10 space-y-6">
                                {/* Filter out active monitors (those without endDate) */}
                                {historyLogs.filter(log => log.endDate).length === 0 ? (
                                    <div className="text-center py-16 text-gray-400 font-bold">No previous monitor history found.</div>
                                ) : (
                                    <>
                                        <div className="space-y-6">
                                            {(isHistoryExpanded ? historyLogs.filter(log => log.endDate) : historyLogs.filter(log => log.endDate).slice(0, 4)).map((prev, index) => (
                                                <div key={prev._id || index} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-gray-50 rounded-[32px] border border-gray-100 gap-8 group hover:bg-white hover:shadow-2xl hover:shadow-gray-100 transition-all duration-500">
                                                    <div className="flex items-center gap-8">
                                                        <div className="h-20 w-20 rounded-[28px] overflow-hidden shadow-lg border-4 border-white ring-2 ring-gray-100 bg-blue-100 flex items-center justify-center">
                                                            {prev.user?.image ? (
                                                                <img src={prev.user.image} alt={prev.user.name} className="h-full w-full object-cover" />
                                                            ) : (
                                                                <span className="text-2xl font-bold text-blue-600">{prev.user?.name?.charAt(0)}</span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-xl font-bold text-gray-900">{prev.user?.name}</h4>
                                                            <p className="text-sm font-bold text-gray-400 mt-0.5 uppercase tracking-wider">
                                                                Period: {new Date(prev.startDate).toLocaleDateString()} - {new Date(prev.endDate).toLocaleDateString()}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-3">
                                                                <span className="text-[10px] font-black text-gray-300 tracking-widest uppercase">Performance Index</span>
                                                                <span className="text-sm font-bold text-blue-600">{prev.performance || 'N/A'}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex flex-col items-end gap-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="inline-block bg-white text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full border border-gray-100 shadow-sm">
                                                                Former Monitor
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteHistory(prev._id)}
                                                                className="h-8 w-8 bg-red-50 text-red-600 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"
                                                                title="Delete History Record"
                                                            >
                                                                <Trash size={14} />
                                                            </button>
                                                        </div>
                                                        <p className="text-sm font-bold text-gray-500 italic max-w-xs">{prev.removalReason}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {historyLogs.filter(log => log.endDate).length > 4 && !isHistoryExpanded && (
                                            <div className="pt-6 text-center">
                                                <button
                                                    onClick={() => setIsHistoryExpanded(true)}
                                                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-100 hover:text-gray-900 transition-all border border-gray-100 shadow-sm active:scale-95"
                                                >
                                                    <History size={18} />
                                                    View {historyLogs.filter(log => log.endDate).length - 4} more history records
                                                </button>
                                            </div>
                                        )}

                                        {isHistoryExpanded && historyLogs.filter(log => log.endDate).length > 4 && (
                                            <div className="pt-6 text-center">
                                                <button
                                                    onClick={() => setIsHistoryExpanded(false)}
                                                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-100 hover:text-gray-900 transition-all border border-gray-100 shadow-sm active:scale-95"
                                                >
                                                    View Less
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

            {/* Select Student Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
                    <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                        {/* Modal Header */}
                        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-6">
                                <div className="h-16 w-16 bg-blue-600 rounded-[20px] flex items-center justify-center text-white shadow-xl shadow-blue-100">
                                    <Users size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">Select New Monitor</h2>
                                    <p className="text-gray-500 font-bold tracking-tight text-sm">Assign a student from the active list</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="h-12 w-12 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="px-10 py-8 border-b border-gray-50">
                            <div className="relative group">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={22} />
                                <input
                                    type="text"
                                    placeholder="Search by student name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all font-bold text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Student List */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-4 custom-scrollbar">
                            {students
                                .filter(s => s.role === 'student' && s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((student) => (
                                    <div key={student._id} className="p-6 bg-white border border-gray-100 rounded-[32px] flex items-center justify-between group hover:border-blue-200 hover:bg-blue-50/20 transition-all duration-300">
                                        <div className="flex items-center gap-5">
                                            <div className="h-16 w-16 rounded-[20px] bg-blue-50 flex items-center justify-center text-blue-600 font-black text-2xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-lg tracking-tight">{student.name}</h4>
                                                <p className="text-sm text-gray-400 font-bold">Room: {student.roomNumber || 'N/A'}, Bed: {student.bedNumber || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAssignMonitor(student._id)}
                                            className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-2xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all shadow-md active:scale-95"
                                        >
                                            Select as Monitor
                                        </button>
                                    </div>
                                ))}
                            {students.filter(s => s.role === 'student' && s.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                                <div className="text-center py-16">
                                    <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                        <Search size={40} />
                                    </div>
                                    <p className="text-gray-400 font-black tracking-widest uppercase text-xs">No students matched your search</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerMonitor;
