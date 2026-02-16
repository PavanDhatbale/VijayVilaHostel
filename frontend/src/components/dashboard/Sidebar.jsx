import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserCog, FileText, Calendar, MessageSquare, User, LogOut, Image } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const [counts, setCounts] = React.useState({
        unreadCount: 0,
        unreadNotices: 0,
        pendingAdmissions: 0,
        pendingLeaves: 0
    });

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const response = await fetch(`${API_BASE_URL}/api/notices/unread-count`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setCounts(data);
            }
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    React.useEffect(() => {
        fetchUnreadCount();
        // Refresh unread count every 30 seconds
        const interval = setInterval(fetchUnreadCount, 30000);

        // Listen for read events
        const handleRead = () => fetchUnreadCount();
        window.addEventListener('noticeRead', handleRead);

        return () => {
            clearInterval(interval);
            window.removeEventListener('noticeRead', handleRead);
        };
    }, []);

    const studentItems = [
        { path: '/student-dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/attendance', label: 'Attendance', icon: Calendar },
        { path: '/notices', label: 'Hostel Updates', icon: FileText, badge: counts.unreadNotices > 0 ? counts.unreadNotices : null },
        { path: '/leave-application', label: 'Leave Application', icon: FileText },
        { path: '/profile', label: 'My Profile', icon: User },
        { path: '/student-gallery', label: 'Gallery', icon: Image },
    ];

    const monitorItems = [
        { path: '/monitor-dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/monitor-students', label: 'Students', icon: Users },
        { path: '/monitor/attendance', label: 'Attendance', icon: Calendar },
        { path: '/monitor-messages', label: 'Messages', icon: MessageSquare, badge: counts.unreadNotices > 0 ? counts.unreadNotices : null },
        { path: '/monitor-notices', label: 'Hostel Updates', icon: FileText },
        { path: '/monitor-leaves', label: 'Leave Applications', icon: FileText, badge: counts.pendingLeaves > 0 ? counts.pendingLeaves : null },
        { path: '/monitor/profile', label: 'My Profile', icon: User },
    ];

    const managerItems = [
        { path: '/manager-dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/manager-students', label: 'Students', icon: Users },
        { path: '/manager-monitor', label: 'Monitor', icon: UserCog },
        { path: '/manager-admissions', label: 'Admissions', icon: FileText, badge: counts.pendingAdmissions > 0 ? counts.pendingAdmissions : null },
        { path: '/manager-messages', label: 'Messages', icon: MessageSquare, badge: counts.unreadNotices > 0 ? counts.unreadNotices : null },
        { path: '/manager-profile', label: 'My Profile', icon: User },
    ];

    const isManager = user?.role === 'hostelManager';
    const isMonitor = user?.role?.toLowerCase() === 'monitor';
    const isInactiveStudent = user?.role === 'student' && user?.studentStatus === 'inactive';

    let navItems = isManager ? managerItems : isMonitor ? monitorItems : studentItems;

    if (isInactiveStudent) {
        navItems = studentItems.filter(item => item.path === '/profile' || item.path === '/student-gallery');
    }
    const portalLabel = isManager ? 'Manager Portal' : isMonitor ? 'Monitor Portal' : 'Student Portal';

    // Sidebar theme based on role
    const sidebarBg = isManager ? 'bg-[#004D40]' : 'bg-white';
    const textColor = isManager ? 'text-teal-100' : 'text-gray-600';
    const activeBg = isManager ? 'bg-[#00695C] text-white' : 'bg-blue-50 text-blue-600';
    const hoverBg = isManager ? 'hover:bg-[#00695C] hover:text-white' : 'hover:bg-gray-50 hover:text-gray-900';
    const borderColor = isManager ? 'border-teal-800' : 'border-gray-200';
    const logoIconBg = isManager ? 'bg-[#00695C]' : 'bg-blue-600';

    return (
        <div className={`w-64 h-screen ${sidebarBg} border-r ${borderColor} flex flex-col fixed left-0 top-0 z-50 transition-colors duration-300`}>
            {/* Logo */}
            <div className={`p-6 border-b ${isManager ? 'border-teal-800' : 'border-gray-100'} flex items-center gap-3`}>
                <div className={`${logoIconBg} p-2 rounded-lg`}>
                    <LayoutDashboard className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className={`text-xl font-bold ${isManager ? 'text-white' : 'text-gray-900'} leading-none`}>Vijay Vila</h1>
                    <span className={`text-[10px] uppercase tracking-wider font-bold ${isManager ? 'text-teal-400' : 'text-gray-500'}`}>{portalLabel}</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive
                                ? activeBg
                                : `${textColor} ${hoverBg}`
                            }`
                        }
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5 opacity-80" />
                            {item.label}
                        </div>
                        {item.badge && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {item.badge}
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className={`p-4 border-t ${isManager ? 'border-teal-800' : 'border-gray-100'}`}>
                <button
                    onClick={logout}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${isManager
                        ? 'text-teal-100 hover:bg-red-900/20 hover:text-red-300'
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                        }`}
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
