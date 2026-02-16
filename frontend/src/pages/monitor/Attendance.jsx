import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const MonitorAttendance = () => {
    const [students, setStudents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [summary, setSummary] = useState({ present: 0, absent: 0, pending: 0 });
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const calculateSummary = (studentsList) => {
        const present = studentsList.filter(s => s.attendanceStatus === 'present').length;
        const absent = studentsList.filter(s => s.attendanceStatus === 'absent').length;
        const pending = studentsList.filter(s => s.attendanceStatus === 'pending').length;
        setSummary({ present, absent, pending });
    };

    const fetchStudents = async (date) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/monitor/students?date=${date}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setStudents(data);
                calculateSummary(data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents(selectedDate);
    }, [selectedDate]);

    const handleMarkAttendance = async (studentId, status) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/attendance/mark`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    studentId,
                    status,
                    date: selectedDate
                })
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);

                // Update local state using functional update to avoid stale closures
                setStudents(prev => {
                    const updated = prev.map(s =>
                        s._id.toString() === studentId.toString() ? { ...s, attendanceStatus: status } : s
                    );
                    calculateSummary(updated);
                    return updated;
                });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error marking attendance:', error);
            toast.error('Failed to mark attendance');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Header title="Attendance" />

                <main className="p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* Page Header */}
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">Daily Attendance</h1>
                                <p className="text-gray-500">Mark attendance for all students</p>
                            </div>

                        </div>

                        {/* Date Selector and Stats */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Date Picker Card */}
                            <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-center">
                                <label className="text-sm font-bold text-gray-500 mb-3 block">Select Date</label>
                                <div className="relative">
                                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 font-bold text-gray-700 shadow-inner focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-green-50/50 border border-green-100 p-6 rounded-3xl shadow-sm flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-100">
                                        <CheckCircle size={28} />
                                    </div>
                                    <div>
                                        <p className="text-green-800 font-bold mb-0.5">Present</p>
                                        <p className="text-3xl font-black text-green-900 leading-none">{summary.present}</p>
                                    </div>
                                </div>
                                <div className="bg-red-50/50 border border-red-100 p-6 rounded-3xl shadow-sm flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-100">
                                        <XCircle size={28} />
                                    </div>
                                    <div>
                                        <p className="text-red-800 font-bold mb-0.5">Absent</p>
                                        <p className="text-3xl font-black text-red-900 leading-none">{summary.absent}</p>
                                    </div>
                                </div>
                                <div className="bg-orange-50/50 border border-orange-100 p-6 rounded-3xl shadow-sm flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-100">
                                        <Clock size={28} />
                                    </div>
                                    <div>
                                        <p className="text-orange-800 font-bold mb-0.5">Pending</p>
                                        <p className="text-3xl font-black text-orange-900 leading-none">{summary.pending}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mark Attendance List */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden pb-6">
                            <div className="p-8 border-b border-gray-50">
                                <h2 className="text-xl font-bold text-gray-900">Mark Attendance</h2>
                            </div>
                            <div className="px-8 pt-4 space-y-4">
                                {loading ? (
                                    <div className="p-10 text-center text-gray-500">Loading students...</div>
                                ) : students.length === 0 ? (
                                    <div className="p-10 text-center text-gray-500">No active students found</div>
                                ) : (
                                    students.map((student) => (
                                        <div key={student._id} className="flex items-center justify-between p-5 hover:bg-gray-50/50 rounded-2xl transition-all border border-transparent hover:border-gray-100 bg-white">
                                            <div className="flex items-center gap-5">
                                                <div className="h-14 w-14 rounded-full ring-2 ring-gray-100 overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl shadow-sm">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900">{student.name}</h4>
                                                    <p className="text-sm text-gray-400 font-medium">Room {student.roomNumber} • Bed {student.bedNumber}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => handleMarkAttendance(student._id, 'present')}
                                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm ${student.attendanceStatus === 'present'
                                                        ? 'bg-green-600 text-white shadow-green-200'
                                                        : 'bg-white border border-green-100 text-green-600 hover:bg-green-50'
                                                        }`}>
                                                    <CheckCircle size={18} />
                                                    Present
                                                </button>
                                                <button
                                                    onClick={() => handleMarkAttendance(student._id, 'absent')}
                                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm ${student.attendanceStatus === 'absent'
                                                        ? 'bg-red-600 text-white shadow-red-200'
                                                        : 'bg-white border border-red-100 text-red-600 hover:bg-red-50'
                                                        }`}>
                                                    <XCircle size={18} />
                                                    Absent
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Info Note */}
                            {summary.pending > 0 && (
                                <div className="px-8 mt-10">
                                    <div className="w-full bg-orange-50 border border-orange-100 rounded-2xl p-6 text-orange-800 font-medium flex gap-3 italic">
                                        <span className="font-bold">Note:</span>
                                        Please mark attendance for all {summary.pending} pending student(s).
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default MonitorAttendance;
