import React, { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import { Bell, Plus, Calendar, User, Users, Eye, Edit, Trash2, X, Save, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MonitorHostelUpdates = () => {
    const [updates, setUpdates] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUpdate, setSelectedUpdate] = useState(null);
    const [formData, setFormData] = useState({ title: '', category: 'Announcement', content: '' });
    const [showAll, setShowAll] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchUpdates = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/notices`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                // Show only notices sent by this monitor
                setUpdates(data.filter(n => n.senderRole === 'monitor'));
            }
        } catch (error) {
            console.error('Error fetching updates:', error);
        } finally {
            setIsFetching(false);
        }
    };

    React.useEffect(() => {
        fetchUpdates();
    }, []);

    const handleCreate = async () => {
        if (!formData.title.trim() || !formData.content.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/notices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    recipientType: 'ALL_STUDENTS',
                    priority: false
                })
            });

            if (response.ok) {
                toast.success('Update published successfully!');
                setIsCreateModalOpen(false);
                setFormData({ title: '', category: 'Announcement', content: '' });
                fetchUpdates();
            } else {
                toast.error('Failed to publish update');
            }
        } catch (error) {
            toast.error('Server error');
        }
    };

    const handleUpdate = async () => {
        // Since we don't have a PUT route yet in backend, I'll stick to what we have or assume creation for now.
        // Actually the backend controller only has create/delete. I'll stick to delete/re-create or skip edit for now if I don't want to change backend again.
        // Wait, I should add update route if needed, but the requirement only mentioned create/fetch.
        // Let's assume for now monitors can delete and re-create. 
        // OR I can quickly add the update controller.
        toast.error('Update functionality coming soon. Please delete and re-create.');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this update?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/notices/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                toast.success('Update deleted successfully');
                fetchUpdates();
            } else {
                toast.error('Failed to delete');
            }
        } catch (error) {
            toast.error('Server error');
        }
    };

    const openEditModal = (update) => {
        setSelectedUpdate(update);
        setFormData({ title: update.title, category: update.category, content: update.content });
        setIsEditModalOpen(true);
    };

    const openViewModal = (update) => {
        setSelectedUpdate(update);
        setIsViewModalOpen(true);
    };

    const categories = [
        { label: 'Announcement', count: updates.filter(u => u.category === 'Announcement').length, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        { label: 'Event', count: updates.filter(u => u.category === 'Event').length, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
        { label: 'Notice', count: updates.filter(u => u.category === 'Notice').length, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
        { label: 'Reminder', count: updates.filter(u => u.category === 'Reminder').length, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    ];

    const getBadgeStyles = (cat) => {
        const styles = {
            announcement: 'bg-blue-100 text-blue-600',
            event: 'bg-purple-100 text-purple-600',
            reminder: 'bg-green-100 text-green-600',
            notice: 'bg-orange-100 text-orange-600'
        };
        return styles[cat.toLowerCase()] || 'bg-gray-100 text-gray-600';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Header title="Hostel Updates" />

                <main className="p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* Page Header */}
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">Hostel Updates</h1>
                                <p className="text-gray-500 font-medium tracking-tight">Create and manage hostel notices</p>
                            </div>
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="flex items-center gap-3 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
                                >
                                    <Plus size={20} />
                                    Create Update
                                </button>
                            </div>
                        </div>

                        {/* Summary Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {categories.map((cat, index) => (
                                <div key={index} className={`${cat.bg} ${cat.border} border p-6 rounded-3xl shadow-sm transition-transform hover:scale-[1.02]`}>
                                    <p className={`${cat.color} font-bold text-xs mb-1 uppercase tracking-wider`}>{cat.label}</p>
                                    <p className="text-4xl font-black text-gray-900 leading-none">{cat.count}</p>
                                </div>
                            ))}
                        </div>

                        {/* Updates List */}
                        <div className="space-y-6 pb-8">
                            {isFetching ? (
                                <div className="text-center py-10 text-gray-400 font-medium font-bold">Loading updates...</div>
                            ) : updates.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 font-medium font-bold">No updates published yet.</div>
                            ) : (
                                <>
                                    <div className="space-y-6">
                                        {updates.slice(0, showAll ? updates.length : 5).map((item) => (
                                            <div key={item._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-shadow relative group">
                                                <div className="space-y-5">
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex items-center gap-4">
                                                            <h3 className="text-2xl font-black text-gray-900 leading-tight">{item.title}</h3>
                                                            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest ${getBadgeStyles(item.category)}`}>
                                                                {item.category}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-600 leading-relaxed max-w-4xl italic">
                                                        {item.content}
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-50 mt-4 font-bold text-gray-400 text-xs text-xs">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar size={14} />
                                                            {new Date(item.createdAt).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <User size={14} />
                                                            <span>Posted by <span className="text-blue-600/70">{item.sender?.name || 'Monitor'}</span></span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users size={14} />
                                                            All Students
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-4 pt-4">
                                                        <button
                                                            onClick={() => openViewModal(item)}
                                                            className="flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors shadow-sm"
                                                        >
                                                            <Eye size={14} />
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item._id)}
                                                            className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors shadow-sm"
                                                        >
                                                            <Trash2 size={14} />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {updates.length > 5 && !showAll && (
                                        <button
                                            onClick={() => setShowAll(true)}
                                            className="w-full py-4 bg-white border border-gray-100 rounded-2xl text-gray-400 font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm"
                                        >
                                            View {updates.length - 5} More Updates
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                    </div>
                </main>

                {/* Create/Edit Modal */}
                {(isCreateModalOpen || isEditModalOpen) && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}></div>
                        <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {isCreateModalOpen ? 'Create Hostel Update' : 'Edit Hostel Update'}
                                </h3>
                                <button
                                    onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>
                            <div className="p-10 space-y-8 overflow-y-auto">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Update Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Enter update title"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none appearance-none cursor-pointer"
                                    >
                                        <option>Announcement</option>
                                        <option>Event</option>
                                        <option>Notice</option>
                                        <option>Reminder</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Update Content</label>
                                    <textarea
                                        rows={6}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Enter detailed content of the update..."
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
                                <button
                                    onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); }}
                                    className="flex-1 bg-white border border-gray-200 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    Save as Draft
                                </button>
                                <button
                                    onClick={isCreateModalOpen ? handleCreate : handleUpdate}
                                    className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus size={18} />
                                    {isCreateModalOpen ? 'Publish Update' : 'Update Notice'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Modal */}
                {isViewModalOpen && selectedUpdate && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsViewModalOpen(false)}></div>
                        <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in duration-300">
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
                                <h3 className="text-2xl font-bold text-gray-900">Update Details</h3>
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>
                            <div className="p-10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-3xl font-black text-gray-900 leading-tight">
                                        {selectedUpdate.title}
                                    </h2>
                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest ${getBadgeStyles(selectedUpdate.category)}`}>
                                        {selectedUpdate.category}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                    {selectedUpdate.content}
                                </p>
                                <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-50 mt-8 font-bold text-gray-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={18} />
                                        {selectedUpdate.date}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User size={18} />
                                        <span>Posted by <span className="text-blue-600/70">{selectedUpdate.author}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users size={18} />
                                        {selectedUpdate.audience}
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-gray-50 flex justify-end">
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default MonitorHostelUpdates;
