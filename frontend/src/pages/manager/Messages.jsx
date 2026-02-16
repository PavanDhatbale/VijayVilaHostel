import React, { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import toast from 'react-hot-toast';
import {
    Send,
    Users,
    UserCircle,
    AlertCircle,
    MessageSquare,
    Info,
    CheckCircle2,
    Clock,
    Trash2,
    ChevronDown,
    ChevronUp,
    Inbox,
    X,
    Mail,
    ArrowLeft,
    SendHorizontal
} from 'lucide-react';

const Messages = () => {
    const [recipient, setRecipient] = useState('ALL_STUDENTS');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPriority, setIsPriority] = useState(false);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { user } = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/notices`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setHistory(data);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setFetching(false);
        }
    };

    React.useEffect(() => {
        fetchHistory();
    }, []);

    const handleSendMessage = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error('Please fill in both title and content');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/notices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    content,
                    recipientType: recipient,
                    priority: isPriority,
                    category: 'Message'
                })
            });

            if (response.ok) {
                toast.success('Message sent successfully!');
                setTitle('');
                setContent('');
                setIsPriority(false);
                setIsComposeModalOpen(false); // Close modal on success
                fetchHistory(); // Refresh history
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to send message');
            }
        } catch (error) {
            toast.error('Server error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNotice = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/notices/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                toast.success('Message deleted');
                setHistory(prev => prev.filter(msg => msg._id !== id));
            } else {
                toast.error('Failed to delete message');
            }
        } catch (error) {
            toast.error('Server error');
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/notices/${id}/read`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                // Update specific message in history to be read
                setHistory(prev => prev.map(msg =>
                    msg._id === id ? { ...msg, isRead: true } : msg
                ));
                // Dispatch event to update header badge immediately
                window.dispatchEvent(new Event('noticeRead'));
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    // Filter messages
    const receivedMessages = history.filter(msg => msg.recipientType === 'HOSTEL_MANAGER');
    const sentMessages = history.filter(msg => msg.senderRole === 'hostelManager');

    const displayedSentHistory = showAll ? sentMessages : sentMessages.slice(0, 5);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Header title="Messages" />

                <main className="p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">

                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-semibold text-[#111827] mb-1 font-inter">Messages</h1>
                                <p className="text-gray-500 font-medium">Manage communication with students and monitor</p>
                            </div>
                            <button
                                onClick={() => setIsComposeModalOpen(true)}
                                className="flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
                            >
                                <Send size={20} />
                                Compose New Message
                            </button>
                        </div>

                        {/* Received Messages (Inbox) */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden pb-4">
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                        <Inbox size={24} />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Inbox (From Monitor)</h2>
                                </div>
                                <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-xs">
                                    {receivedMessages.length} Messages
                                </span>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {fetching ? (
                                    <div className="p-8 text-center text-gray-400 font-medium">Loading inbox...</div>
                                ) : receivedMessages.length === 0 ? (
                                    <div className="p-12 text-center flex flex-col items-center gap-4">
                                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                            <Inbox size={32} />
                                        </div>
                                        <p className="text-gray-400 font-medium">No messages received from monitor.</p>
                                    </div>
                                ) : (
                                    receivedMessages.map((msg) => (
                                        <div
                                            key={msg._id}
                                            onClick={() => !msg.isRead && markAsRead(msg._id)}
                                            className={`p-8 hover:bg-blue-50/30 transition-colors group relative cursor-pointer border-l-4 ${!msg.isRead ? 'border-blue-500 bg-blue-50/10' : 'border-transparent'}`}
                                        >
                                            {/* Allow manager to delete received messages if needed, or keep implementation consistent */}
                                            <button
                                                onClick={() => handleDeleteNotice(msg._id)}
                                                className="absolute top-8 right-8 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                title="Delete Message"
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                            <div className="flex items-start gap-5">
                                                <div className="h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm bg-purple-50 text-purple-600 border border-purple-100">
                                                    <UserCircle size={24} />
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="font-bold text-gray-900 text-lg leading-tight">{msg.title}</h4>
                                                        {msg.priority && (
                                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-orange-100 text-orange-600">
                                                                PRIORITY
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm font-medium">
                                                        <span className="text-gray-900">
                                                            From: {msg.sender?.name || 'Monitor'}
                                                        </span>
                                                        <span className="text-gray-300">•</span>
                                                        <span className="text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                                                    </div>
                                                    <p className="text-gray-600 text-sm leading-relaxed max-w-4xl pt-1">
                                                        {msg.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Sent History List */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900">Sent History</h2>
                            </div>

                            {fetching ? (
                                <div className="text-center py-10 text-gray-400 font-medium tracking-tight">Loading history...</div>
                            ) : sentMessages.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 font-medium tracking-tight">No messages sent yet.</div>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        {displayedSentHistory.map((msg) => (
                                            <div key={msg._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow relative group">
                                                <button
                                                    onClick={() => handleDeleteNotice(msg._id)}
                                                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                    title="Delete Message"
                                                >
                                                    <Trash2 size={18} />
                                                </button>

                                                <div className="flex justify-between items-start mb-2 pr-10">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-lg font-bold text-gray-900 tracking-tight">{msg.title}</h3>
                                                        {msg.priority && (
                                                            <span className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-orange-100">Priority</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-gray-500 font-medium mb-4 leading-relaxed pr-8">{msg.content}</p>
                                                <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Sent To:</span>
                                                        <span className="text-gray-900 font-bold text-xs tracking-tight bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                                            {msg.recipientType === 'ALL_STUDENTS' ? 'All Students' : 'Monitor'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                                                        <Clock size={14} />
                                                        <span>{new Date(msg.createdAt).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {sentMessages.length > 5 && !showAll && (
                                        <button
                                            onClick={() => setShowAll(true)}
                                            className="w-full py-4 bg-white border border-gray-100 rounded-3xl text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm"
                                        >
                                            View {sentMessages.length - 5} More Messages
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Compose Modal */}
                        {isComposeModalOpen && (
                            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsComposeModalOpen(false)}></div>

                                <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in duration-300">
                                    <div className="bg-blue-600 p-8 text-white relative">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Mail size={24} />
                                                    <h3 className="text-2xl font-bold">Compose Message</h3>
                                                </div>
                                                <p className="text-blue-100">Send updates to students or monitor</p>
                                            </div>
                                            <button
                                                onClick={() => setIsComposeModalOpen(false)}
                                                className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-10 space-y-6">
                                        {/* Recipient Selection */}
                                        <div className="space-y-3">
                                            <label className="text-sm font-semibold text-gray-900">Select Recipient</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => setRecipient('ALL_STUDENTS')}
                                                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${recipient === 'ALL_STUDENTS' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                                                >
                                                    <div className={`p-3 rounded-xl ${recipient === 'ALL_STUDENTS' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                        <Users size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">All Students</p>
                                                        <p className="text-xs font-medium text-gray-400">Active students</p>
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={() => setRecipient('MONITOR')}
                                                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${recipient === 'MONITOR' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                                                >
                                                    <div className={`p-3 rounded-xl ${recipient === 'MONITOR' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                        <UserCircle size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">Monitor</p>
                                                        <p className="text-xs font-medium text-gray-400">Hostel Monitor</p>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-900">Message Title</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter message subject..."
                                                    className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-700 shadow-sm"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-900">Message Content</label>
                                                <textarea
                                                    placeholder="Type your message here..."
                                                    rows={4}
                                                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-700 shadow-sm"
                                                    value={content}
                                                    onChange={(e) => setContent(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Priority Toggle */}
                                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                            <label className="flex items-center justify-between cursor-pointer group">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative inline-flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={isPriority}
                                                            onChange={() => setIsPriority(!isPriority)}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <AlertCircle size={20} className="text-orange-500" />
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Mark as Priority Notice</p>
                                                            <p className="text-xs font-medium text-gray-400">Recipients will be notified immediately</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>

                                        <div className="flex justify-end pt-4 border-t border-gray-50 gap-4">
                                            <button
                                                onClick={() => setIsComposeModalOpen(false)}
                                                className="px-6 py-3.5 rounded-2xl font-bold hover:bg-gray-100 transition-colors text-gray-600"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSendMessage}
                                                disabled={loading}
                                                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:scale-[1.02] transition-transform active:scale-95 group disabled:opacity-50"
                                            >
                                                <SendHorizontal size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                {loading ? 'Sending...' : 'Send Message'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
};

export default Messages;
