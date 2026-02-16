import React from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import {
    User,
    Mail,
    Phone,
    Shield,
    Activity,
    Camera,
    CheckCircle2,
    Calendar,
    ArrowLeft,
    LayoutDashboard,
    MessageSquare,
    FileText,
    LogOut,
    Plus,
    X,
    Save,
    Edit
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';

const ManagerProfile = () => {
    const { user, refreshProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef(null);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        mobile: user?.mobile || '+91 98765 00000',
        image: user?.image || ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                mobile: user.mobile || '+91 98765 00000',
                image: user.image || ''
            });
        }
    }, [user]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

            const response = await fetch(`${API_BASE_URL}/api/media/profile-image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                setFormData(prev => ({ ...prev, image: data.url }));
                toast.success('Image uploaded successfully');
            } else {
                toast.error(data.message || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

            const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                await refreshProfile();
                setIsEditing(false);
                toast.success('Profile updated successfully!');
            } else {
                toast.error(data.message || 'Failed to update profile');
            }
        } catch (error) {
            toast.error('Server error');
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            mobile: user?.mobile || '+91 98765 00000',
            image: user?.image || ''
        });
        setIsEditing(false);
    };

    const authorityItems = [
        'Complete access to all student, monitor, and core team management',
        'Final approval authority for admissions and disciplinary actions',
        'Full oversight of attendance records and contributions',
        'Broadcasting messages to all hostel members',
        'Generate and access all administrative reports'
    ];

    const [stats, setStats] = useState([
        { label: 'Total Actions This Month', value: '0', icon: Activity },
        { label: 'Messages Sent', value: '0', icon: MessageSquare },
        { label: 'Reports Generated', value: '0', icon: FileText },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                const response = await fetch(`${API_BASE_URL}/api/manager/profile-stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setStats([
                        { label: 'Total Actions This Month', value: data.totalActionsMonth.toString(), icon: Activity },
                        { label: 'Messages Sent', value: data.messagesSent.toString(), icon: MessageSquare },
                        { label: 'Reports Generated', value: data.reportsGenerated.toString(), icon: FileText },
                    ]);
                }
            } catch (error) {
                console.error('Error fetching manager stats:', error);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Header title="My Profile" />

                <main className="p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">

                        <div>
                            <h1 className="text-3xl font-semibold text-[#111827] mb-1 font-inter">My Profile</h1>
                            <p className="text-gray-500 font-medium tracking-tight">Manage your personal information</p>
                        </div>

                        {/* Profile Header Card */}
                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="h-40 bg-gradient-to-r from-[#064e3b] to-[#065f46]"></div>
                            <div className="px-10 pb-10">
                                <div className="flex flex-col md:flex-row gap-8 items-end -mt-20">
                                    <div className="relative group">
                                        <div className="h-40 w-40 rounded-full border-4 border-white shadow-xl overflow-hidden ring-4 ring-gray-100/50 bg-blue-100 flex items-center justify-center">
                                            {formData.image ? (
                                                <img src={formData.image} alt={formData.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-5xl font-bold text-blue-600">{user?.name?.charAt(0)}</span>
                                            )}
                                        </div>
                                        {isEditing && (
                                            <>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    accept="image/*"
                                                />
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={uploading}
                                                    className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-lg border-4 border-white hover:scale-110 active:scale-90 transition-all disabled:opacity-50 disabled:cursor-wait"
                                                >
                                                    {uploading ? (
                                                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                                    ) : (
                                                        <Camera size={20} />
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex-1 pb-2">
                                        <div className="flex items-center justify-between flex-wrap gap-4">
                                            <div>
                                                <h2 className="text-3xl font-semibold text-gray-900 mb-1">{formData.name}</h2>
                                                <p className="text-teal-600 font-semibold tracking-wide uppercase text-xs">{user?.role === 'hostelManager' ? 'Hostel Manager' : user?.role}</p>
                                            </div>
                                            {!isEditing ? (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all transform hover:-translate-y-1"
                                                >
                                                    Edit Profile
                                                </button>
                                            ) : (
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={handleSave}
                                                        className="bg-green-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all flex items-center gap-2"
                                                    >
                                                        <Save size={18} /> Save
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        className="bg-gray-100 text-gray-600 px-8 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
                                                    >
                                                        <X size={18} /> Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                            <User size={12} /> FULL NAME
                                        </p>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        ) : (
                                            <p className="text-lg font-semibold text-gray-800">{user?.name}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                            <Mail size={12} /> EMAIL ADDRESS
                                        </p>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        ) : (
                                            <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                            <Phone size={12} /> MOBILE NUMBER
                                        </p>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={formData.mobile}
                                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                            />
                                        ) : (
                                            <p className="text-lg font-semibold text-gray-800">{formData.mobile}</p>
                                        )}
                                    </div>
                                </div>
                                pieces of info here and below ...
                            </div>
                        </div>

                        {/* Authority Section */}
                        <div className="bg-[#f0f9f6] rounded-[32px] border border-teal-100 p-8 flex gap-6">
                            <div className="h-14 w-14 rounded-2xl bg-[#059669] text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-100">
                                <Shield size={28} />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-[#064e3b] mb-4">Hostel Manager Authority</h3>
                                <p className="text-teal-800 font-medium mb-4 leading-relaxed">
                                    You have the highest level of authority in the Vijay Vila Hostel management system with full control over:
                                </p>
                                <ul className="space-y-3">
                                    {authorityItems.map((item, index) => (
                                        <li key={index} className="flex items-start gap-3 text-[#065f46] font-semibold text-sm">
                                            <CheckCircle2 size={18} className="text-[#059669] mt-0.5 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Activity Summary Stats */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-gray-900 px-2 font-inter">Activity Summary</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {stats.map((stat, index) => (
                                    <div key={index} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:translate-y-[-4px] transition-all">
                                        <p className="text-gray-400 font-semibold text-xs uppercase tracking-widest mb-4">{stat.label}</p>
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-2xl font-semibold text-gray-900 tracking-tight">{stat.value}</h4>
                                            <div className="p-3 bg-gray-50 rounded-xl text-gray-400">
                                                <stat.icon size={20} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Security Footer */}
                        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                            <p className="text-center text-blue-700 font-semibold text-sm">
                                <span className="font-semibold">Security Note:</span> Your role and access permissions are managed by the system administrator. If you need to change your role or require additional access, please contact the technical support team.
                            </p>
                        </div>
                        pieces of info here and below ...

                    </div>
                </main>
            </div>
        </div>
    );
};

export default ManagerProfile;
