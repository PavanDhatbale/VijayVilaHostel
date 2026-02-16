import React, { useState, useEffect } from 'react';
import {
    Image as ImageIcon,
    Video,
    Upload,
    X,
    Plus,
    Trash2,
    Film,
    Grid,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    Play,
    Eye,
    Maximize2,
    Download
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const PersonalGallery = ({ studentId, isOwner }) => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadType, setUploadType] = useState('photo'); // 'photo' or 'video'
    const [uploadData, setUploadData] = useState({
        file: null,
        caption: ''
    });
    const [uploading, setUploading] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);

    const { user } = useAuth();
    const isManager = user?.role === 'hostelManager';
    const isMonitor = user?.role === 'monitor';
    const isStudent = user?.role === 'student';
    const isActiveStudent = isStudent && user?.studentStatus === 'active';
    // Allow download for managers, monitors, and all students (active or inactive)
    const canDownload = isManager || isMonitor || isStudent;

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const handleDownload = async (url, filename) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            toast.success('Download started');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download');
        }
    };

    const fetchMedia = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/media/student/${studentId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setMedia(data);
            }
        } catch (error) {
            console.error('Error fetching media:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedia();
    }, [studentId]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadData.file) return toast.error('Please select a file');

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('media', uploadData.file);
            formData.append('caption', uploadData.caption);

            const response = await fetch(`${API_BASE_URL}/api/media/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                toast.success(`${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)} uploaded successfully!`);
                setIsUploadModalOpen(false);
                setUploadData({ file: null, caption: '' });
                fetchMedia();
            } else {
                const data = await response.json();
                toast.error(data.message || 'Upload failed');
            }
        } catch (error) {
            toast.error('Server error during upload');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (mediaId) => {
        if (!window.confirm('Are you sure you want to delete this media?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/media/${mediaId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                toast.success('Media deleted');
                setMedia(prev => prev.filter(m => m._id !== mediaId));
            } else {
                toast.error('Failed to delete');
            }
        } catch (error) {
            toast.error('Error deleting media');
        }
    };

    const filteredMedia = media.filter(m => {
        if (activeTab === 'all') return true;
        if (activeTab === 'photos') return m.mediaType === 'photo';
        if (activeTab === 'videos') return m.mediaType === 'video';
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 p-1 bg-gray-100/50 rounded-2xl w-fit">
                    {[
                        { id: 'all', label: 'All', icon: Grid },
                        { id: 'photos', label: 'Photos', icon: ImageIcon },
                        { id: 'videos', label: 'Videos', icon: Film }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {isOwner && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setUploadType('photo');
                                setIsUploadModalOpen(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95 text-xs sm:text-sm"
                        >
                            <Plus size={18} />
                            Add Photo
                        </button>
                        <button
                            onClick={() => {
                                setUploadType('video');
                                setIsUploadModalOpen(true);
                            }}
                            className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl px-5 py-2.5 font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95 text-xs sm:text-sm"
                        >
                            <Plus size={18} />
                            Add Video
                        </button>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="aspect-square bg-gray-100 animate-pulse rounded-3xl" />
                    ))}
                </div>
            ) : filteredMedia.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                    <div className="h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mb-4">
                        <ImageIcon size={32} />
                    </div>
                    <p className="text-gray-500 font-bold">No media found in this section</p>
                    {isOwner && (
                        <button
                            onClick={() => {
                                setUploadType('photo');
                                setIsUploadModalOpen(true);
                            }}
                            className="mt-4 text-blue-600 font-bold text-sm hover:underline"
                        >
                            Upload your first memory
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredMedia.map((item) => (
                        <div key={item._id} className="group relative aspect-square rounded-[32px] overflow-hidden bg-gray-100 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
                            {item.mediaType === 'photo' ? (
                                <img
                                    src={item.mediaUrl}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt={item.caption}
                                    crossOrigin="anonymous"
                                />
                            ) : (
                                <div className="relative w-full h-full">
                                    <video
                                        src={item.mediaUrl}
                                        className="w-full h-full object-cover"
                                        crossOrigin="anonymous"
                                        playsInline
                                    />
                                    <div
                                        onClick={() => setSelectedMedia(item)}
                                        className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors cursor-pointer"
                                    >
                                        <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center ring-1 ring-white/50 group-hover:scale-110 transition-all">
                                            <Play size={20} className="text-white fill-current ml-1" />
                                        </div>
                                    </div>
                                    <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1.5">
                                        <Film size={12} className="text-white" />
                                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Video</span>
                                    </div>
                                </div>
                            )}

                            {/* Caption Overlay */}
                            {item.caption && (
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <p className="text-white text-xs font-medium line-clamp-2">{item.caption}</p>
                                </div>
                            )}

                            {/* Actions Overlay - REPOSITIONS TO TOP RIGHT */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
                                <button
                                    onClick={() => setSelectedMedia(item)}
                                    className="h-9 w-9 bg-white/90 backdrop-blur-md text-blue-600 rounded-xl flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                                    title="View Full"
                                >
                                    <Eye size={16} />
                                </button>
                                {(isOwner || isManager) && (
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="h-9 w-9 bg-red-500/90 backdrop-blur-md text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox / Full-screen View */}
            {selectedMedia && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
                    <button
                        onClick={() => setSelectedMedia(null)}
                        className="absolute top-6 right-6 h-12 w-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all"
                    >
                        <X size={24} />
                    </button>

                    <div className="w-full max-w-5xl h-full max-h-[85vh] p-4 flex flex-col items-center justify-center gap-6">
                        <div className="relative w-full h-full flex items-center justify-center rounded-3xl overflow-hidden bg-black/40 shadow-2xl">
                            {selectedMedia.mediaType === 'photo' ? (
                                <img
                                    src={selectedMedia.mediaUrl}
                                    alt={selectedMedia.caption}
                                    className="max-w-full max-h-full object-contain"
                                    crossOrigin="anonymous"
                                />
                            ) : (
                                <video
                                    src={selectedMedia.mediaUrl}
                                    controls
                                    autoPlay
                                    playsInline
                                    crossOrigin="anonymous"
                                    className="max-w-full max-h-full"
                                />
                            )}
                        </div>

                        {selectedMedia.caption && (
                            <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10 max-w-2xl text-center">
                                <p className="text-white text-lg font-medium">{selectedMedia.caption}</p>
                            </div>
                        )}

                        <div className="flex gap-4 justify-center">
                            {canDownload && (
                                <button
                                    onClick={() => handleDownload(selectedMedia.mediaUrl, 'memory')}
                                    className="flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-2xl font-bold hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-lg"
                                >
                                    <Download size={20} />
                                    Download Memory
                                </button>
                            )}
                            {(isOwner || isManager) && (
                                <button
                                    onClick={() => {
                                        handleDelete(selectedMedia._id);
                                        setSelectedMedia(null);
                                    }}
                                    className="flex items-center gap-2 bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-500 px-6 py-3 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-lg"
                                >
                                    <Trash2 size={20} />
                                    Delete Memory
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-900">
                                {uploadType === 'video' ? 'Upload Video' : 'Upload Photo'}
                            </h2>
                            <button
                                onClick={() => setIsUploadModalOpen(false)}
                                className="h-10 w-10 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-all flex items-center justify-center"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">
                                    {uploadType === 'video' ? 'Select Video *' : 'Select Photo *'}
                                </label>
                                <input
                                    type="file"
                                    accept={uploadType === 'video' ? "video/*" : "image/*"}
                                    required
                                    onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Caption (Optional)</label>
                                <textarea
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-gray-700 h-24 resize-none transition-all"
                                    placeholder="Write a memory..."
                                    value={uploadData.caption}
                                    onChange={(e) => setUploadData({ ...uploadData, caption: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-1 py-3 px-6 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                                >
                                    {uploading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Uploading...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload size={18} />
                                            <span>Upload</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalGallery;
