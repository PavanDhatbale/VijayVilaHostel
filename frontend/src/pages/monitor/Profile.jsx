import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import { User, Phone, Mail, Shield, Edit, Plus, CheckCircle, Send, Bell, ListChecks, Info, Camera, X, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const MonitorProfile = () => {
    const { user, refreshProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef(null);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.admission?.personalDetails?.contact || '',
        email: user?.email || '',
        image: user?.image || ''
    });
    const [profileStats, setProfileStats] = useState({
        attendanceCount: 0,
        messagesCount: 0,
        updatesCount: 0
    });
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.admission?.personalDetails?.contact || '',
                email: user.email || '',
                image: user.image || ''
            });
        }

        const fetchProfileStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                const response = await fetch(`${API_BASE_URL}/monitor/profile-stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setProfileStats(data);
                }
            } catch (error) {
                console.error('Error fetching profile stats:', error);
            } finally {
                setStatsLoading(false);
            }
        };

        fetchProfileStats();
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

            const response = await fetch(`${API_BASE_URL}/media/profile-image`, {
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

            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
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
            phone: user?.admission?.personalDetails?.contact || '',
            email: user?.email || '',
            image: user?.image || ''
        });
        setIsEditing(false);
    };

    const stats = [
        { label: 'Attendance Marked', value: statsLoading ? '...' : profileStats.attendanceCount.toString(), icon: ListChecks, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Messages Sent', value: statsLoading ? '...' : profileStats.messagesCount.toString(), icon: Send, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Updates Posted', value: statsLoading ? '...' : profileStats.updatesCount.toString(), icon: Bell, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    const responsibilities = [
        'Mark daily attendance for all students',
        'Manage student records and contact information',
        'Post hostel notices and updates',
        'Communicate with students and core team',
        'Maintain discipline and smooth operations'
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Header title="My Profile" />

                <main className="p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* Page Header */}
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">My Profile</h1>
                                <p className="text-gray-500">Manage your account information</p>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
                                >
                                    <Edit size={18} />
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {/* Profile Header Banner */}
                        <div className="bg-blue-600 rounded-3xl p-10 text-white flex items-center gap-8 shadow-xl shadow-blue-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-10">
                                <Shield size={120} />
                            </div>
                            <div className="h-32 w-32 rounded-full border-4 border-white/30 overflow-hidden bg-white/20 shadow-2xl relative z-10 group">
                                <img
                                    src={formData.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"}
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
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
                                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-wait"
                                        >
                                            <div className="bg-white p-2 rounded-full text-blue-600 shadow-xl border-2 border-white">
                                                {uploading ? (
                                                    <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                                                ) : (
                                                    <Camera size={20} />
                                                )}
                                            </div>
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="relative z-10">
                                <h2 className="text-4xl font-black mb-2">{formData.name}</h2>
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold border border-white/20">
                                    <Shield size={16} />
                                    Monitor
                                </div>
                            </div>
                        </div>

                        {/* Personal Information Section */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 space-y-10">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
                                <User className="text-blue-600" size={20} />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-700 block ml-1">Full Name</label>
                                    <div className="relative group">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                            />
                                        ) : (
                                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold text-gray-700">
                                                {formData.name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-700 block ml-1">Mobile Number</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                                            <Phone size={18} />
                                        </div>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 pl-12 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                            />
                                        ) : (
                                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 pl-12 font-bold text-gray-700">
                                                {formData.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-700 block ml-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                                            <Mail size={18} />
                                        </div>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 pl-12 font-bold text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                            />
                                        ) : (
                                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 pl-12 font-bold text-gray-700">
                                                {formData.email}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-700 block ml-1">Assigned Role</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                            <Shield size={18} />
                                        </div>
                                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 pl-12 font-bold text-gray-400 cursor-not-allowed">
                                            Monitor
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider ml-1 mt-1">Role is managed by hostel administration</p>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex gap-4 pt-6 border-t border-gray-50">
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Save size={20} />
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <X size={20} />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {!isEditing && (
                            <>
                                {/* Account Statistics */}
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
                                    <h3 className="text-lg font-bold text-gray-900 mb-8">Account Statistics</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {stats.map((stat, index) => (
                                            <div key={index} className={`${stat.bg} p-8 rounded-3xl text-center border border-transparent hover:border-blue-100 transition-all group`}>
                                                <p className="text-4xl font-black text-blue-600 mb-2 group-hover:scale-110 transition-transform">{stat.value}</p>
                                                <p className={`${stat.color} font-bold text-sm uppercase tracking-wider`}>{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Monitor Responsibilities */}
                                <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-10">
                                    <h3 className="text-lg font-bold text-blue-900 flex items-center gap-3 mb-6">
                                        <Shield className="text-blue-600" size={20} />
                                        Monitor Responsibilities
                                    </h3>
                                    <ul className="space-y-4">
                                        {responsibilities.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3 text-blue-800 font-medium">
                                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2.5 flex-shrink-0"></div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Support Note */}
                                <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 text-gray-500 text-sm leading-relaxed">
                                    <span className="font-bold text-gray-700">Note:</span> If you need to update your assigned role or require additional permissions, please contact the Hostel Manager or Core Team. Monitors have limited permissions and cannot manage other staff members or approve admissions.
                                </div>
                            </>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
};

export default MonitorProfile;
