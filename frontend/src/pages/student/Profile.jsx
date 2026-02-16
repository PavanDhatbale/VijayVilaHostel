import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import { User, Phone, Mail, Home, CheckCircle2, AlertCircle, Camera, Shield, Edit, Save, X, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const Profile = () => {
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

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.admission?.personalDetails?.contact || '',
                email: user.email || '',
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
            phone: user?.admission?.personalDetails?.contact || '',
            email: user?.email || '',
            image: user?.image || ''
        });
        setIsEditing(false);
    };

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
                                <User size={120} />
                            </div>
                            <div className="h-32 w-32 rounded-full border-4 border-white/30 overflow-hidden bg-white/20 shadow-2xl relative z-10 group">
                                <img
                                    src={formData.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"}
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
                                    <Home size={16} />
                                    Room {user?.roomNumber || 'N/A'} • Bed {user?.bedNumber || 'N/A'}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Personal Details Form */}
                            <div className="lg:col-span-2 space-y-8">
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
                                                    Student
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

                                {/* Information Footer Note */}
                                {!isEditing && (
                                    <div className="bg-yellow-50 border border-yellow-100 rounded-3xl p-8 flex gap-4">
                                        <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-yellow-800 font-bold mb-1 uppercase text-xs tracking-widest">Update Policy</h4>
                                            <p className="text-yellow-700 text-sm leading-relaxed font-medium">
                                                Ensure your contact details are always current so the hostel management can reach you in case of emergencies or important announcements.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Left Column: Hostel Info (Visible only in non-edit) */}
                            {!isEditing && (
                                <div className="space-y-8">
                                    <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 shadow-sm">
                                        <div className="flex items-center gap-2 mb-8 text-blue-900 font-bold uppercase text-xs tracking-widest">
                                            <Home className="h-4 w-4 text-blue-600" />
                                            <h3>Hostel Information</h3>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[10px] text-blue-600 font-bold mb-1 uppercase tracking-widest">Room Number</p>
                                                <p className="text-2xl font-black text-blue-900">{user?.roomNumber || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-blue-600 font-bold mb-1 uppercase tracking-widest">Bed Number</p>
                                                <p className="text-2xl font-black text-blue-900">{user?.bedNumber || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-blue-600 font-bold mb-1 uppercase tracking-widest">Admission Status</p>
                                                <div className="flex items-center gap-2 text-green-600 font-black text-xl uppercase">
                                                    <CheckCircle2 size={24} />
                                                    {user?.admissionStatus || 'PENDING'}
                                                </div>
                                            </div>
                                            <div className="pt-6 border-t border-blue-100/50">
                                                <p className="text-[10px] text-blue-500 italic leading-relaxed font-bold">
                                                    Note: Assignment changes require specific administrative approval.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mt-8">
                                        <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold uppercase text-xs tracking-widest">
                                            <FileText className="h-4 w-4 text-blue-600" />
                                            <h3>My Documents</h3>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <StudentDocumentLink label="10th Marksheet" path={user?.admission?.documents?.tenthMarksheet} />
                                            <StudentDocumentLink label="12th Marksheet" path={user?.admission?.documents?.twelfthMarksheet} />
                                            <StudentDocumentLink label="Income Certificate" path={user?.admission?.documents?.incomeCertificate} />
                                            <StudentDocumentLink label="Aadhaar Card" path={user?.admission?.documents?.aadhaarCard} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

const StudentDocumentLink = ({ label, path }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    if (!path) return (
        <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl opacity-60">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
            <p className="text-gray-400 text-sm italic">Not available</p>
        </div>
    );

    let docUrl = null;
    let isCloudinary = false;

    // Handle Object Structure (Cloudinary)
    if (typeof path === 'object') {
        if (path.url) {
            docUrl = path.url;
            isCloudinary = true;
        } else {
            // Fallback
            return (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{label}</p>
                    <p className="text-red-500 text-sm italic">Invalid Format</p>
                </div>
            );
        }
    }
    // Handle String Structure (Legacy or direct URL)
    else if (typeof path === 'string') {
        if (path === '[object Object]') {
            return (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{label}</p>
                    <p className="text-red-500 text-sm italic">File Error</p>
                </div>
            );
        }
        docUrl = path;
        if (docUrl.startsWith('http')) {
            isCloudinary = true;
        }
    }

    if (!docUrl) return null;

    // Determine the full URL
    let fullUrl;
    if (isCloudinary) {
        fullUrl = docUrl;
    } else {
        // It's a local path, prepend base URL (stripping /api if needed)
        const FILE_BASE_URL = API_BASE_URL.replace('/api', '');
        fullUrl = `${FILE_BASE_URL}/${docUrl}`;
    }

    return (
        <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all group block shadow-sm hover:shadow-md"
        >
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500">{label}</p>
            <div className="flex items-center gap-2 mt-1">
                <FileText size={16} className="text-blue-600" />
                <span className="text-blue-600 font-bold text-sm">View Document</span>
            </div>
        </a>
    );
};

export default Profile;
