import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import toast from 'react-hot-toast';
import {
    Search,
    Eye,
    Edit2,
    Trash2,
    X,
    Save,
    AlertCircle,
    Upload,
    UserPlus,
    Instagram,
    Facebook,
    Phone,
    Award,
    Briefcase,
    MapPin,
    Calendar,
    GraduationCap,
    Video,
    ChevronRight,
    ExternalLink,
    Globe
} from 'lucide-react';

const ManagerStudents = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const initialFormData = {
        name: '',
        email: '',
        password: '',
        phone: '',
        department: '',
        year: '',
        studentType: 'current',
        location: '',
        hostelStay: '',
        examCleared: '',
        currentPosition: '',
        keyAchievements: '',
        testimony: '',
        instagram: '',
        facebook: '',
        contactNumber: '',
        profileImage: null,
        experienceVideo: null,
        roomNumber: '',
        bedNumber: '',
        studentStatus: 'active'
    };

    const [addFormData, setAddFormData] = useState(initialFormData);
    const [editFormData, setEditFormData] = useState(initialFormData);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/manager/students`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setStudents(data);
            } else {
                toast.error(data.message || 'Failed to fetch students');
            }
        } catch (error) {
            toast.error('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleEditClick = (student) => {
        setSelectedStudent(student);
        setEditFormData({
            ...initialFormData,
            roomNumber: student.roomNumber || '',
            bedNumber: student.bedNumber || '',
            studentStatus: student.studentStatus || 'active',
            department: student.department || '',
            year: student.year || '',
            location: student.location || '',
            hostelStay: student.hostelStay || '',
            examCleared: student.examCleared || '',
            currentPosition: student.currentPosition || '',
            keyAchievements: Array.isArray(student.keyAchievements) ? student.keyAchievements.join(', ') : '',
            testimony: student.testimony || '',
            instagram: student.socialLinks?.instagram || '',
            facebook: student.socialLinks?.facebook || '',
            contactNumber: student.contactNumber || student.phone || '',
        });
        setIsEditModalOpen(true);
    };

    const handleViewClick = (student) => {
        setSelectedStudent(student);
        setIsViewModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Updating student...');
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            Object.keys(editFormData).forEach(key => {
                if ((key === 'profileImage' || key === 'experienceVideo') && editFormData[key]) {
                    formData.append(key, editFormData[key]);
                } else if (editFormData[key] !== null && key !== 'profileImage' && key !== 'experienceVideo') {
                    formData.append(key, editFormData[key]);
                }
            });

            const response = await fetch(`${API_BASE_URL}/manager/students/${selectedStudent._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Student updated successfully', { id: loadingToast });
                setIsEditModalOpen(false);
                fetchStudents();
            } else {
                toast.error(data.message || 'Update failed', { id: loadingToast });
            }
        } catch (error) {
            toast.error('Error updating student', { id: loadingToast });
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Adding student...');
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            Object.keys(addFormData).forEach(key => {
                if ((key === 'profileImage' || key === 'experienceVideo') && addFormData[key]) {
                    formData.append(key, addFormData[key]);
                } else if (addFormData[key] !== null && key !== 'profileImage' && key !== 'experienceVideo') {
                    formData.append(key, addFormData[key]);
                }
            });

            const response = await fetch(`${API_BASE_URL}/manager/students`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Student added successfully', { id: loadingToast });
                setIsAddModalOpen(false);
                setAddFormData(initialFormData);
                fetchStudents();
            } else {
                toast.error(data.message || 'Failed to add student', { id: loadingToast });
            }
        } catch (error) {
            toast.error('Error adding student', { id: loadingToast });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to PERMANENTLY delete this student? usage will be removed but admission record kept as rejected.')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/manager/students/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success('Student deleted successfully');
                fetchStudents();
            } else {
                const data = await response.json();
                toast.error(data.message || 'Deactivation failed');
            }
        } catch (error) {
            toast.error('Error deactivating student');
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = [
        { label: 'Total Students', value: students.length, color: 'text-gray-900' },
        { label: 'Active Students', value: students.filter(s => s.studentStatus === 'active').length, color: 'text-green-600' },
        {
            label: 'Avg Attendance',
            value: students.length > 0
                ? `${(students.reduce((acc, s) => acc + (s.attendancePercentage || 0), 0) / students.length).toFixed(1)}%`
                : '0%',
            color: 'text-blue-600'
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Header title="Students Management" />

                <main className="p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* Header & Search */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-bold text-[#111827] mb-1">Students Management</h1>
                                <p className="text-gray-500 font-medium">Manage student profiles, credentials, and achievements</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative w-full md:w-96 group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search students..."
                                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-700 shadow-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Summary Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                                    <p className="text-gray-500 font-medium text-sm mb-3 uppercase tracking-wider">{stat.label}</p>
                                    <h3 className={`text-4xl font-bold ${stat.color} tracking-tighter`}>{stat.value}</h3>
                                </div>
                            ))}
                        </div>

                        {/* Students Table Section */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                            {loading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : filteredStudents.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                    <AlertCircle size={48} className="mb-4 opacity-20" />
                                    <p className="text-lg font-medium">No students found</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Student</th>
                                                <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Room/Bed</th>
                                                <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                                                <th className="px-6 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Location</th>
                                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {filteredStudents.map((student) => (
                                                <tr key={student._id} className="hover:bg-gray-50/50 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            {student.profileImage?.url ? (
                                                                <img src={student.profileImage.url} alt="" className="h-12 w-12 rounded-xl object-cover ring-2 ring-gray-50 shadow-sm" />
                                                            ) : (
                                                                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg uppercase">
                                                                    {student.name.charAt(0)}
                                                                </div>
                                                            )}
                                                            <div>
                                                                <h4 className="text-base font-bold text-gray-900 leading-tight">{student.name}</h4>
                                                                <p className="text-xs font-medium text-gray-400 mt-0.5">{student.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 text-center">
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-sm font-bold text-gray-700">R: {student.roomNumber || '-'}</span>
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase">B: {student.bedNumber || '-'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 text-center">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${student.studentStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {student.studentStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <div className="flex items-center gap-2 text-gray-500">
                                                            <MapPin size={14} />
                                                            <span className="text-sm font-medium">{student.location || 'N/A'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleViewClick(student)}
                                                                className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                                                                title="View Profile"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditClick(student)}
                                                                className="p-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-900 hover:text-white transition-all"
                                                                title="Edit"
                                                            >
                                                                <Edit2 size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(student._id)}
                                                                className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                                                                title="Deactivate"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                    </div>
                </main>

                {/* Simple View Modal - As Requested */}
                {
                    isViewModalOpen && selectedStudent && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-fade-in-up p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Student Details</h3>
                                    <button onClick={() => setIsViewModalOpen(false)} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                                        <X size={20} className="text-gray-500" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center">
                                        <span className="text-gray-500 font-medium">Room Number</span>
                                        <span className="text-xl font-bold text-blue-600">{selectedStudent.roomNumber || 'N/A'}</span>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center">
                                        <span className="text-gray-500 font-medium">Bed Number</span>
                                        <span className="text-xl font-bold text-blue-600">{selectedStudent.bedNumber || 'N/A'}</span>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center">
                                        <span className="text-gray-500 font-medium">Status</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${selectedStudent.studentStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {selectedStudent.studentStatus}
                                        </span>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 font-medium">Stay From</span>
                                            <span className="font-semibold text-gray-900">{selectedStudent.hostelStay?.split('-')[0] || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 font-medium">Stay To</span>
                                            <span className="font-semibold text-gray-900">{selectedStudent.hostelStay?.split('-')[1] || 'Present'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }


                {/* Edit Modal - Comprehensive */}
                {
                    isEditModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                            <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-fade-in-up flex flex-col">
                                <div className="bg-[#111827] p-8 text-white flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold">Edit Professional Profile</h3>
                                        <p className="text-gray-400 text-sm mt-1">Updating resources for {selectedStudent?.name}</p>
                                    </div>
                                    <button onClick={() => setIsEditModalOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
                                        <X size={28} />
                                    </button>
                                </div>

                                <form onSubmit={handleUpdate} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                                    {/* Basic Hostel Info */}
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-bold text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2 flex items-center gap-2">
                                            <Calendar size={16} /> Basic Hostel Details
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Room Number</label>
                                                <input
                                                    type="text"
                                                    value={editFormData.roomNumber}
                                                    onChange={(e) => setEditFormData({ ...editFormData, roomNumber: e.target.value })}
                                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-gray-700 hover:border-blue-200 transition-all"
                                                    placeholder="101"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Bed Number</label>
                                                <input
                                                    type="text"
                                                    value={editFormData.bedNumber}
                                                    onChange={(e) => setEditFormData({ ...editFormData, bedNumber: e.target.value })}
                                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-gray-700 hover:border-blue-200 transition-all"
                                                    placeholder="A1"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Hostel Stay</label>
                                                <input
                                                    type="text"
                                                    value={editFormData.hostelStay}
                                                    onChange={(e) => setEditFormData({ ...editFormData, hostelStay: e.target.value })}
                                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-gray-700 hover:border-blue-200 transition-all"
                                                    placeholder="2020 - 2023"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Status</label>
                                                <select
                                                    value={editFormData.studentStatus}
                                                    onChange={(e) => setEditFormData({ ...editFormData, studentStatus: e.target.value })}
                                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-gray-700 shadow-sm"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>





                                    <div className="pt-8 flex gap-4 border-t border-gray-50">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditModalOpen(false)}
                                            className="flex-1 py-4 px-6 rounded-2xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-[2] py-4 px-6 rounded-2xl bg-black text-white font-bold hover:bg-gray-900 shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            <Save size={20} /> Save Professional Profile
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }

                {/* Add Student Modal - Same fields as Edit */}
                {
                    isAddModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                            <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-fade-in-up flex flex-col">
                                <div className="bg-blue-600 p-8 text-white flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold">Add New Student Profile</h3>
                                        <p className="text-blue-100 text-sm mt-1">Create a comprehensive profile for a new student</p>
                                    </div>
                                    <button onClick={() => setIsAddModalOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
                                        <X size={28} />
                                    </button>
                                </div>

                                <form onSubmit={handleAddStudent} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                                    {/* Account Credentials */}
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-bold text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2">Account Credentials</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={addFormData.name}
                                                    onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-gray-700"
                                                    placeholder="Student Name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address *</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={addFormData.email}
                                                    onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-gray-700"
                                                    placeholder="email@example.com"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password *</label>
                                                <input
                                                    type="password"
                                                    required
                                                    value={addFormData.password}
                                                    onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-gray-700"
                                                    placeholder="Min 6 characters"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Academic & Professional */}
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-bold text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2">Professional Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Department</label>
                                                    <input
                                                        type="text"
                                                        value={addFormData.department}
                                                        onChange={(e) => setAddFormData({ ...addFormData, department: e.target.value })}
                                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-gray-700"
                                                        placeholder="CS, Civil, etc."
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Location</label>
                                                    <input
                                                        type="text"
                                                        value={addFormData.location}
                                                        onChange={(e) => setAddFormData({ ...addFormData, location: e.target.value })}
                                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-gray-700"
                                                        placeholder="City, State"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Exams Cleared</label>
                                                    <input
                                                        type="text"
                                                        value={addFormData.examCleared}
                                                        onChange={(e) => setAddFormData({ ...addFormData, examCleared: e.target.value })}
                                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-gray-700"
                                                        placeholder="MPSC, UPSC"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Current Position</label>
                                                    <input
                                                        type="text"
                                                        value={addFormData.currentPosition}
                                                        onChange={(e) => setAddFormData({ ...addFormData, currentPosition: e.target.value })}
                                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-gray-700"
                                                        placeholder="Job Title"
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Hostel Experience (Public Testimony)</label>
                                                <textarea
                                                    rows="3"
                                                    value={addFormData.testimony}
                                                    onChange={(e) => setAddFormData({ ...addFormData, testimony: e.target.value })}
                                                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-gray-700 resize-none"
                                                    placeholder="Describe the hostel experience..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Media & Social */}
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-bold text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2">Media & Social</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Profile Image (Optional)</label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        id="addImg"
                                                        onChange={(e) => setAddFormData({ ...addFormData, profileImage: e.target.files[0] })}
                                                        className="hidden"
                                                    />
                                                    <label htmlFor="addImg" className="flex items-center gap-3 px-6 py-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl hover:border-blue-400 cursor-pointer transition-all">
                                                        <Upload size={20} className="text-gray-400" />
                                                        <span className="text-gray-600 font-bold text-sm">{addFormData.profileImage ? addFormData.profileImage.name : 'Upload Profile Photo'}</span>
                                                    </label>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Experience Video (Optional)</label>
                                                    <input
                                                        type="file"
                                                        accept="video/*"
                                                        id="addVideo"
                                                        onChange={(e) => setAddFormData({ ...addFormData, experienceVideo: e.target.files[0] })}
                                                        className="hidden"
                                                    />
                                                    <label htmlFor="addVideo" className="flex items-center gap-3 px-6 py-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl hover:border-blue-400 cursor-pointer transition-all">
                                                        <Video size={20} className="text-gray-400" />
                                                        <span className="text-gray-600 font-bold text-sm">{addFormData.experienceVideo ? addFormData.experienceVideo.name : 'Upload Testimony Video'}</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Instagram Link</label>
                                                    <input
                                                        type="text"
                                                        value={addFormData.instagram}
                                                        onChange={(e) => setAddFormData({ ...addFormData, instagram: e.target.value })}
                                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-gray-700"
                                                        placeholder="Profile Link"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Contact Phone</label>
                                                    <input
                                                        type="text"
                                                        value={addFormData.contactNumber}
                                                        onChange={(e) => setAddFormData({ ...addFormData, contactNumber: e.target.value })}
                                                        className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-gray-700"
                                                        placeholder="+91..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 flex gap-4 border-t border-gray-50">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="flex-1 py-4 px-6 rounded-2xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all active:scale-95"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-[2] py-4 px-6 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            <Plus size={20} /> Create Student Profile
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }
            </div >
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
            `}} />
        </div >
    );
};

export default ManagerStudents;
