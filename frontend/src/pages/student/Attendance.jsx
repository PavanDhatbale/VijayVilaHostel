import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import { Calendar, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Attendance = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchAttendanceHistory = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const from = new Date(year, month, 1).toISOString();
            const to = new Date(year, month + 1, 0).toISOString();

            const response = await fetch(`${API_BASE_URL}/api/attendance/history?from=${from}&to=${to}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setAttendanceData(data);
            }
        } catch (error) {
            console.error('Error fetching attendance history:', error);
            toast.error('Failed to fetch attendance records');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendanceHistory();
    }, [currentDate]);

    // Calendar Calculations
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const calendarDays = [];
    // Add empty slots for days of prev month
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
    }
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    // Stats Calculation
    const presentDays = attendanceData.filter(a => a.status === 'present').length;
    const absentDays = attendanceData.filter(a => a.status === 'absent').length;
    const totalMarked = attendanceData.length;
    const attendancePercentage = totalMarked > 0 ? ((presentDays / totalMarked) * 100).toFixed(1) : '0';

    const stats = [
        { label: 'Present Days', value: presentDays, color: 'green', bg: 'bg-green-50', text: 'text-green-600' },
        { label: 'Absent Days', value: absentDays, color: 'red', bg: 'bg-red-50', text: 'text-red-600' },
        { label: 'Total Days', value: totalMarked, color: 'blue', bg: 'bg-blue-50', text: 'text-blue-600' },
        { label: 'Percentage', value: `${attendancePercentage}%`, color: 'purple', bg: 'bg-purple-50', text: 'text-purple-600' },
    ];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const getDayStatus = (day) => {
        if (!day) return null;
        const dateStr = new Date(year, month, day).toDateString();
        const record = attendanceData.find(a => new Date(a.date).toDateString() === dateStr);
        return record ? record.status : 'no-record';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Header title="Attendance" />

                <main className="p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto space-y-8">

                        {/* Page Header */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <Calendar className="h-6 w-6 text-blue-600" />
                                <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
                            </div>
                            <p className="text-gray-500">View your monthly attendance record</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className={`${stat.bg} p-6 rounded-2xl border border-gray-100`}>
                                    <p className={`text-sm font-medium ${stat.text} mb-1 opacity-80`}>{stat.label}</p>
                                    <h3 className={`text-3xl font-bold ${stat.text}`}>{loading ? '...' : stat.value}</h3>
                                </div>
                            ))}
                        </div>

                        {/* Calendar Section */}
                        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                            {/* Calendar Header */}
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <button
                                    onClick={handlePrevMonth}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <h2 className="text-xl font-bold text-gray-900">{monthName} {year}</h2>
                                <button
                                    onClick={handleNextMonth}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                            {/* Legend */}
                            <div className="px-6 py-4 flex justify-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-green-500"></div>
                                    <span className="text-gray-600">Present</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-red-500"></div>
                                    <span className="text-gray-600">Absent</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded bg-gray-200"></div>
                                    <span className="text-gray-600">No Record</span>
                                </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="p-6">
                                <div className="grid grid-cols-7 gap-4 mb-4 text-center">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className="text-sm font-medium text-gray-500 font-bold">{day}</div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-4">
                                    {loading ? (
                                        <div className="col-span-7 py-20 text-center text-gray-400 font-bold">Loading calendar...</div>
                                    ) : calendarDays.map((day, index) => {
                                        const status = getDayStatus(day);
                                        if (day === null) return <div key={`empty-${index}`} className="aspect-square"></div>;

                                        return (
                                            <div
                                                key={day}
                                                className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative transition-all hover:shadow-md
                                                    ${status === 'present'
                                                        ? 'bg-green-50 border-green-200 text-green-700'
                                                        : status === 'absent'
                                                            ? 'bg-red-50 border-red-200 text-red-700'
                                                            : 'bg-white border-gray-100 text-gray-400'
                                                    }`}
                                            >
                                                <span className="text-sm font-bold">{day}</span>
                                                <div className="absolute top-2 right-2">
                                                    {status === 'present' ? (
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                    ) : status === 'absent' ? (
                                                        <XCircle className="h-4 w-4 text-red-500" />
                                                    ) : null}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Footer Note */}
                            <div className="bg-blue-50 p-4 flex items-start gap-3 border-t border-blue-100 m-6 rounded-xl">
                                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="text-sm font-bold text-blue-800">Read-only View</h4>
                                    <p className="text-sm text-blue-600 mt-1">
                                        Attendance is marked by hostel monitors. If you notice any discrepancies, please contact the management.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default Attendance;
