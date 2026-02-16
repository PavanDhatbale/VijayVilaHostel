import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import { User, Search, Filter, Eye, Edit, MoreHorizontal, CheckCircle, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const MonitorStudents = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/monitor/students`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setStudents(data);
                }
            } catch (error) {
                console.error('Error fetching students:', error);
                toast.error('Failed to fetch students');
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, [API_BASE_URL]);

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Header title="Students" />

                <main className="p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-6">

                        {/* Page Header */}
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">Student Management</h1>
                                <p className="text-gray-500">View and manage active students</p>
                            </div>
                            <p className="text-sm font-bold text-gray-600">Total Students: <span className="text-blue-600 text-lg">{students.length}</span></p>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or room..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                                />
                            </div>
                            <button className="bg-white border border-gray-200 rounded-2xl px-6 flex items-center gap-3 font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                                <Filter className="h-5 w-5 text-gray-400" />
                                All Rooms
                            </button>
                        </div>

                        {/* Students Table */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full border-collapse">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Photo</th>
                                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Room No</th>
                                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Bed No</th>
                                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Today's Attendance</th>
                                        <th className="px-8 py-5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-10 text-center text-gray-500">Loading students...</td>
                                        </tr>
                                    ) : filteredStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-10 text-center text-gray-500">No students found</td>
                                        </tr>
                                    ) : (
                                        filteredStudents.map((student) => (
                                            <tr key={student._id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-4 whitespace-nowrap">
                                                    <div className="h-12 w-12 rounded-full ring-2 ring-gray-100 overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shadow-sm">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="font-bold text-gray-900">{student.name}</div>
                                                        <div className="text-xs text-gray-400 font-medium">{student.email}</div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-4 whitespace-nowrap text-sm font-bold text-gray-600">{student.roomNumber}</td>
                                                <td className="px-8 py-4 whitespace-nowrap text-sm font-bold text-gray-600">{student.bedNumber}</td>
                                                <td className="px-8 py-4 whitespace-nowrap">
                                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit ${student.attendanceStatus === 'present'
                                                        ? 'bg-green-50 text-green-600'
                                                        : student.attendanceStatus === 'absent'
                                                            ? 'bg-red-50 text-red-600'
                                                            : 'bg-orange-50 text-orange-600'
                                                        }`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${student.attendanceStatus === 'present' ? 'bg-green-500' : student.attendanceStatus === 'absent' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                                                        {student.attendanceStatus === 'present' ? 'Present' : student.attendanceStatus === 'absent' ? 'Absent' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-4 whitespace-nowrap">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shadow-sm bg-white border border-blue-50">
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default MonitorStudents;
