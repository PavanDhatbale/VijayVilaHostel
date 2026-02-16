import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/dashboard/Header';
import Sidebar from '../../components/dashboard/Sidebar';
import { CheckCircle, XCircle, Clock, Calendar, User, Search, Filter, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MonitorLeave = () => {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
    const [searchTerm, setSearchTerm] = useState('');

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/leaves/all-leaves`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setLeaves(data);
            }
        } catch (error) {
            console.error('Error fetching leaves:', error);
            toast.error('Failed to load leave applications');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this application?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/leaves/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                toast.success('Application deleted successfully');
                setLeaves(leaves.filter(leave => leave._id !== id));
            } else {
                toast.error('Failed to delete application');
            }
        } catch (error) {
            console.error('Error deleting leave:', error);
            toast.error('Server error');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/leaves/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                toast.success(`Application ${newStatus} successfully`);
                // Update local state
                setLeaves(leaves.map(leave =>
                    leave._id === id ? { ...leave, status: newStatus } : leave
                ));
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Server error');
        }
    };

    const [showAllLeaves, setShowAllLeaves] = useState(false);

    const filteredLeaves = leaves.filter(leave => {
        const matchesFilter = filter === 'all' || leave.status === filter;
        const matchesSearch = leave.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            leave.subject?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const displayedLeaves = showAllLeaves ? filteredLeaves : filteredLeaves.slice(0, 4);

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 ml-64 bg-gray-50 min-h-screen">
                <Header title="Leave Applications" />

                <div className="p-8 max-w-7xl mx-auto">
                    {/* Filters */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                            {['all', 'pending', 'approved', 'rejected'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === status
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by student or subject..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Applications Grid */}
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Loading applications...</div>
                    ) : filteredLeaves.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Filter className="text-gray-400" size={32} />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No applications found</h3>
                            <p className="text-gray-500">Try adjusting your filters.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {displayedLeaves.map((leave) => (
                                    <div key={leave._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDelete(leave._id)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1 bg-white rounded-full shadow-sm border border-gray-100"
                                            title="Delete Application"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                                    {leave.student?.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{leave.student?.name || 'Unknown User'}</h3>
                                                    <p className="text-xs text-gray-500">Room {leave.student?.roomNumber || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(leave.status)}`}>
                                                {leave.status.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="font-semibold text-gray-800 mb-1">{leave.subject}</h4>
                                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{leave.description}</p>
                                        </div>

                                        <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} />
                                                <span>{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.returnDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="text-xs">
                                                Applied: {new Date(leave.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>

                                        {leave.status === 'pending' && (
                                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                                <button
                                                    onClick={() => handleStatusUpdate(leave._id, 'approved')}
                                                    className="flex-1 bg-green-50 text-green-700 py-2 rounded-xl font-semibold hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle size={18} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(leave._id, 'rejected')}
                                                    className="flex-1 bg-red-50 text-red-700 py-2 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <XCircle size={18} /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {filteredLeaves.length > 4 && (
                                <div className="mt-8 text-center">
                                    <button
                                        onClick={() => setShowAllLeaves(!showAllLeaves)}
                                        className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                                    >
                                        {showAllLeaves ? 'Show Less' : `View ${filteredLeaves.length - 4} More Applications`}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MonitorLeave;
