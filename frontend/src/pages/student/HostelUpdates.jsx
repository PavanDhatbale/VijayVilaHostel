import { useState, useEffect } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import { Bell, Calendar, User, Info, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const HostelUpdates = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all' or 'unread'
    const [showAll, setShowAll] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchNotices = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/notices`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setNotices(data);
            }
        } catch (error) {
            console.error('Error fetching notices:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_BASE_URL}/api/notices/${id}/read`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Update local state to reflect read status without full re-fetch if possible
            setNotices(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleDeleteNotice = async (id) => {
        if (!window.confirm('Are you sure you want to remove this update from your view?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/notices/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                toast.success('Message removed');
                setNotices(prev => prev.filter(n => n._id !== id));
            } else {
                toast.error('Failed to remove message');
            }
        } catch (error) {
            toast.error('Server error');
        }
    };

    const filteredNotices = filter === 'unread' ? notices.filter(n => !n.isRead) : notices;
    const displayedNotices = showAll ? filteredNotices : filteredNotices.slice(0, 5);
    const unreadCount = notices.filter(n => !n.isRead).length;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Header title="Hostel Updates" />

                <main className="p-8 overflow-y-auto">
                    <div className="max-w-4xl mx-auto space-y-8">

                        {/* Page Header */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <Bell className="h-6 w-6 text-blue-600" />
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold text-gray-900">Hostel Updates</h1>
                                    {unreadCount > 0 && (
                                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount} New</span>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-500 font-medium tracking-tight">Stay informed about hostel announcements and notices</p>
                        </div>

                        {/* Filters */}
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-6 py-2.5 font-bold rounded-xl text-sm transition-all ${filter === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                                >
                                    All Updates
                                </button>
                                <button
                                    onClick={() => setFilter('unread')}
                                    className={`px-6 py-2.5 font-bold rounded-xl text-sm transition-all ${filter === 'unread' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                                >
                                    Unread ({unreadCount})
                                </button>
                            </div>
                        </div>

                        {/* Notices List */}
                        <div className="space-y-6">
                            {loading ? (
                                <div className="text-center py-20 text-gray-400 font-bold">Loading updates...</div>
                            ) : filteredNotices.length === 0 ? (
                                <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center">
                                    <div className="bg-blue-50 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Info className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">No Updates Found</h3>
                                    <p className="text-gray-500 font-medium tracking-tight">You're all caught up! Check back later for new announcements.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-6">
                                        {displayedNotices.map((notice) => (
                                            <div
                                                key={notice._id}
                                                onClick={() => !notice.isRead && handleMarkAsRead(notice._id)}
                                                className={`bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden cursor-pointer ${!notice.isRead ? 'border-blue-200' : 'border-gray-100 opacity-80'} group`}
                                            >
                                                <div className={`absolute top-0 left-0 w-1.5 h-full ${notice.category === 'Announcement' ? 'bg-blue-500' :
                                                    notice.category === 'Event' ? 'bg-orange-500' :
                                                        notice.category === 'Notice' ? 'bg-purple-500' :
                                                            notice.category === 'Reminder' ? 'bg-green-500' : 'bg-gray-400'
                                                    }`}></div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteNotice(notice._id);
                                                    }}
                                                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 z-10"
                                                    title="Delete Message"
                                                >
                                                    <Trash2 size={18} />
                                                </button>

                                                <div className="flex justify-between items-start mb-4 pr-10">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className={`text-lg font-bold text-gray-900 ${!notice.isRead ? 'font-black' : ''}`}>{notice.title}</h3>
                                                        {!notice.isRead && (
                                                            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                                                                NEW
                                                            </span>
                                                        )}
                                                        {notice.priority && (
                                                            <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-orange-100">PRIORITY</span>
                                                        )}
                                                    </div>
                                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${notice.category === 'Announcement' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        notice.category === 'Event' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                            notice.category === 'Notice' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                                notice.category === 'Reminder' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-600 border-gray-100'
                                                        }`}>
                                                        {notice.category}
                                                    </span>
                                                </div>

                                                <p className="text-gray-600 text-sm font-medium leading-relaxed mb-6">
                                                    {notice.content}
                                                </p>

                                                <div className="flex items-center gap-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest border-t border-gray-50 pt-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {new Date(notice.createdAt).toLocaleString()}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <User className="h-3.5 w-3.5" />
                                                        <span>
                                                            Posted by <span className="text-blue-600/80">
                                                                {notice.senderRole === 'hostelManager' ? 'Hostel Manager' : 'Monitor'}
                                                                {notice.sender?.name && ` (${notice.sender.name})`}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {filteredNotices.length > 5 && !showAll && (
                                        <button
                                            onClick={() => setShowAll(true)}
                                            className="w-full py-4 bg-white border border-gray-100 rounded-2xl text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm"
                                        >
                                            View {filteredNotices.length - 5} More Updates
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default HostelUpdates;
