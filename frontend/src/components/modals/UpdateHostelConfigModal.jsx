import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import Button from '../ui/Button';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const UpdateHostelConfigModal = ({ isOpen, onClose, onConfigUpdated, initialConfig }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('owner');
    const [heroFile, setHeroFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [existingGallery, setExistingGallery] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        ownerName: '',
        ownerRole: '',
        ownerBio: ''
    });

    useEffect(() => {
        if (initialConfig) {
            setFormData({
                ownerName: initialConfig.ownerName || '',
                ownerRole: initialConfig.ownerRole || '',
                ownerBio: initialConfig.ownerBio || ''
            });
            setExistingGallery(initialConfig.landingGallery || []);
        }
    }, [initialConfig, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGalleryDelete = async (imageId) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/api/public/config/gallery/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const updatedConfig = await response.json();
                toast.success('Image deleted from gallery');
                onConfigUpdated(updatedConfig);
                setExistingGallery(updatedConfig.landingGallery);
            } else {
                toast.error('Failed to delete image');
            }
        } catch (error) {
            console.error('Delete gallery image error:', error);
            toast.error('Error deleting image');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const data = new FormData();

            // Owner Data
            data.append('ownerName', formData.ownerName);
            data.append('ownerRole', formData.ownerRole);
            data.append('ownerBio', formData.ownerBio);
            if (file) {
                data.append('ownerImage', file);
            }

            // Hero Image
            if (heroFile) {
                data.append('heroImage', heroFile);
            }

            // Gallery Images
            if (galleryFiles.length > 0) {
                Array.from(galleryFiles).forEach(file => {
                    data.append('landingGallery', file);
                });
            }

            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/public/config`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            if (response.ok) {
                toast.success('Configuration updated successfully!');
                const updatedConfig = await response.json();
                onConfigUpdated(updatedConfig);
                // Reset files
                setFile(null);
                setHeroFile(null);
                setGalleryFiles([]);
                onClose();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to update config');
            }
        } catch (error) {
            console.error('Error updating config:', error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-2xl font-black text-gray-900">Hostel Configuration</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('owner')}
                        className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${activeTab === 'owner' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Owner Details
                    </button>
                    <button
                        onClick={() => setActiveTab('hero')}
                        className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${activeTab === 'hero' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Hero Section
                    </button>
                    <button
                        onClick={() => setActiveTab('gallery')}
                        className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${activeTab === 'gallery' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Photo Gallery
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Owner Tab */}
                        {activeTab === 'owner' && (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Owner Photo</label>
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0">
                                            {file ? (
                                                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                                            ) : initialConfig?.ownerImage?.url ? (
                                                <img src={initialConfig.ownerImage.url} alt="Current" className="w-full h-full object-cover" />
                                            ) : (
                                                <Upload className="text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                id="ownerImage"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => setFile(e.target.files[0])}
                                            />
                                            <label
                                                htmlFor="ownerImage"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 cursor-pointer font-bold transition-colors"
                                            >
                                                <Upload size={18} />
                                                {file ? 'Change Photo' : 'Upload New Photo'}
                                            </label>
                                            <p className="text-xs text-gray-400 mt-2">Recommended: Square image, high resolution.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                                        <input
                                            type="text"
                                            name="ownerName"
                                            value={formData.ownerName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-medium"
                                            placeholder="e.g. Dr. Atul Vadagavkar"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Role/Title</label>
                                        <input
                                            type="text"
                                            name="ownerRole"
                                            value={formData.ownerRole}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-medium"
                                            placeholder="e.g. Founder"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Bio / Description</label>
                                    <textarea
                                        name="ownerBio"
                                        value={formData.ownerBio}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-medium resize-none"
                                        placeholder="Short description about the owner..."
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {/* Hero Tab */}
                        {activeTab === 'hero' && (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Hero Background Image</label>
                                    <div className="rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 relative aspect-video group">
                                        {heroFile ? (
                                            <img src={URL.createObjectURL(heroFile)} alt="Preview" className="w-full h-full object-cover" />
                                        ) : initialConfig?.heroImage?.url ? (
                                            <img src={initialConfig.heroImage.url} alt="Current Hero" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                                <Upload size={48} className="mb-2" />
                                                <span className="text-sm font-medium">No Image Set</span>
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <label
                                                htmlFor="heroImage"
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full hover:bg-gray-100 cursor-pointer font-bold transition-transform transform hover:scale-105 shadow-lg"
                                            >
                                                <Upload size={20} />
                                                {heroFile ? 'Change Image' : 'Upload Hero Image'}
                                            </label>
                                        </div>
                                        <input
                                            type="file"
                                            id="heroImage"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => setHeroFile(e.target.files[0])}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Recommended: Landscape orientation, 1920x1080px or higher.</p>
                                </div>
                            </div>
                        )}

                        {/* Gallery Tab */}
                        {activeTab === 'gallery' && (
                            <div className="space-y-6 animate-fade-in">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="block text-sm font-bold text-gray-700">Gallery Images</label>
                                        <label
                                            htmlFor="galleryImages"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 cursor-pointer font-bold text-sm transition-colors"
                                        >
                                            <Upload size={16} />
                                            Add Images
                                        </label>
                                        <input
                                            type="file"
                                            id="galleryImages"
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => setGalleryFiles(prev => [...prev, ...Array.from(e.target.files)])}
                                        />
                                    </div>

                                    {/* New Uploads Preview */}
                                    {galleryFiles.length > 0 && (
                                        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                            <h4 className="text-sm font-bold text-blue-800 mb-3">Ready to Upload ({galleryFiles.length})</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {Array.from(galleryFiles).map((file, idx) => (
                                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm group">
                                                        <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setGalleryFiles(prev => prev.filter((_, i) => i !== idx))}
                                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Existing Images */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {existingGallery.map((img, idx) => (
                                            <div key={img._id || idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group shadow-sm border border-gray-100">
                                                <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-start justify-end p-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleGalleryDelete(img._id)}
                                                        className="bg-white/90 text-red-600 p-2 rounded-lg shadow-sm hover:bg-white hover:text-red-700 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                                                        title="Delete Image"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {existingGallery.length === 0 && galleryFiles.length === 0 && (
                                            <div className="col-span-full py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                                <p>No images in gallery</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                            <Button type="button" variant="secondary" onClick={onClose} className="px-6 py-3 rounded-xl font-bold">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateHostelConfigModal;
