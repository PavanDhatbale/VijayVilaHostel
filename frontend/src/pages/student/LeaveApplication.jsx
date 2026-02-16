import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/dashboard/Header';
import Sidebar from '../../components/dashboard/Sidebar';
import { Calendar, Send, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StudentLeave = () => {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllLeaves, setShowAllLeaves] = useState(false);
    const [formData, setFormData] = useState({
        hostelName: 'Vijay Vila Hostel',
        startDate: '',
        returnDate: '',
        subject: '',
        description: ''
    });

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/leaves/my-leaves`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setLeaves(data);
            }
        } catch (error) {
            console.error('Error fetching leaves:', error);
            toast.error('Failed to load leave history');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/leaves/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast.success('Leave application submitted successfully');
                setFormData({
                    hostelName: 'Vijay Vila Hostel',
                    startDate: '',
                    returnDate: '',
                    subject: '',
                    description: ''
                });
                fetchLeaves();
            } else {
                const error = await response.json();
                toast.error(error.message || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Error submitting leave:', error);
            toast.error('Server error');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <CheckCircle size={16} className="mr-1" />;
            case 'rejected': return <XCircle size={16} className="mr-1" />;
            default: return <Clock size={16} className="mr-1" />;
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this application?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/leaves/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success('Application deleted successfully');
                setLeaves(leaves.filter(leave => leave._id !== id));
            } else {
                const error = await response.json();
                toast.error(error.message || 'Failed to delete application');
            }
        } catch (error) {
            console.error('Error deleting leave:', error);
            toast.error('Failed to delete application');
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 ml-64 bg-gray-50 min-h-screen">
                <Header title="Leave Application" />

                <div className="p-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Application Form */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <Send size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">New Application</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Name</label>
                                    <input
                                        type="text"
                                        name="hostelName"
                                        value={formData.hostelName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-500 cursor-not-allowed"
                                        readOnly
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                                        <input
                                            type="date"
                                            name="returnDate"
                                            value={formData.returnDate}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Reason for leave (e.g., Going home for festival)"
                                        required
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Detailed explanation..."
                                        required
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                                >
                                    Submit Application
                                </button>
                            </form>
                        </div>

                        {/* Application History */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                    <Clock size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Application History</h2>
                            </div>

                            {loading ? (
                                <div className="text-center py-8 text-gray-500">Loading history...</div>
                            ) : leaves.length === 0 ? (
                                <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
                                    <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                        <Calendar className="text-gray-400" size={32} />
                                    </div>
                                    <h3 className="text-gray-900 font-medium mb-1">No Applications Yet</h3>
                                    <p className="text-gray-500 text-sm">Your leave history will appear here.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        {(showAllLeaves ? leaves : leaves.slice(0, 3)).map((leave) => (
                                            <div key={leave._id} className="bg-white rounded-2xl padding-6 p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900">{leave.subject}</h3>
                                                        <p className="text-xs text-gray-500 mt-1">Applied on {new Date(leave.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center border ${getStatusColor(leave.status)}`}>
                                                        {getStatusIcon(leave.status)}
                                                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mb-3">
                                                    <div>
                                                        <span className="block text-xs text-gray-400 font-medium uppercase">Using From</span>
                                                        <span className="font-medium">{new Date(leave.startDate).toLocaleDateString()}</span>
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs text-gray-400 font-medium uppercase">Returning On</span>
                                                        <span className="font-medium">{new Date(leave.returnDate).toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                <p className="text-sm text-gray-600 line-clamp-2">{leave.description}</p>

                                                {leave.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleDelete(leave._id)}
                                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                                                        title="Delete Application"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {leaves.length > 3 && (
                                        <button
                                            onClick={() => setShowAllLeaves(!showAllLeaves)}
                                            className="w-full py-3 mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                                        >
                                            {showAllLeaves ? (
                                                <>Show Less <ChevronUp size={16} /></>
                                            ) : (
                                                <>View {leaves.length - 3} More Applications <ChevronDown size={16} /></>
                                            )}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default StudentLeave;
