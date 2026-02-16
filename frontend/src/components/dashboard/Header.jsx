import React from 'react';
import { Bell, ChevronDown, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const isManager = user?.role === 'hostelManager';
    const [unreadCount, setUnreadCount] = React.useState(0);

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/notices/unread-count`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setUnreadCount(data.unreadCount);
            }
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    React.useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds

        // Listen for read events
        const handleRead = () => fetchUnreadCount();
        window.addEventListener('noticeRead', handleRead);

        return () => {
            clearInterval(interval);
            window.removeEventListener('noticeRead', handleRead);
        };
    }, []);

    const handleNotificationClick = () => {
        if (user?.role === 'student') {
            navigate('/notices');
        } else if (user?.role === 'monitor') {
            navigate('/monitor-messages');
        } else if (isManager) {
            navigate('/manager-messages');
        }
    };

    return (
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
            {/* Left Section: Back Button and Title */}
            <div className="flex items-center gap-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-xl transition-colors font-semibold text-sm border border-gray-100"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>
                <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                    <span
                        onClick={() => navigate('/')}
                        className="hover:text-blue-600 cursor-pointer transition-colors"
                    >
                        Home
                    </span>
                    <span className="text-gray-200">/</span>
                    <span className="font-bold text-gray-900 text-lg">{title}</span>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <div
                    className="relative cursor-pointer group"
                    onClick={handleNotificationClick}
                >
                    <div className="p-2.5 rounded-xl bg-gray-50 group-hover:bg-gray-100 transition-colors">
                        <Bell className="h-6 w-6 text-gray-500 hover:text-gray-700 transition-colors" />
                    </div>
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold border-2 border-white shadow-sm">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </div>

                {/* Profile Dropdown */}
                <div
                    className="flex items-center gap-4 pl-6 border-l border-gray-100 cursor-pointer group"
                    onClick={() => {
                        if (user?.role === 'student') navigate('/profile');
                        else if (user?.role === 'monitor') navigate('/monitor/profile');
                        else if (isManager) navigate('/manager-profile');
                    }}
                >
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900 leading-tight">
                            {user?.name || 'User Name'}
                        </p>
                        <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mt-0.5">
                            {isManager ? 'Hostel Manager' : (user?.role === 'monitor' ? 'Monitor' : 'Student')}
                        </p>
                    </div>
                    <div className="h-11 w-11 rounded-xl bg-gray-200 overflow-hidden ring-2 ring-gray-100 shadow-sm transition-transform group-hover:scale-105">
                        <img
                            src={user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"}
                            alt="Profile"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-y-0.5" />
                </div>
            </div>
        </header>
    );
};

export default Header;
