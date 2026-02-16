import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronRight,
    Image as ImageIcon,
    Video,
    FileText,
    Play,
    Calendar,
    Plus,
    X,
    Upload,
    Eye,
    Trash2,
    Maximize2,
    Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { toast } from 'react-hot-toast';

const AddMediaModal = ({ isOpen, onClose, type, onMediaAdded }) => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [mediaData, setMediaData] = useState({
        title: '',
        description: ''
    });

    const isVideo = type === 'video';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            return toast.error('Please select a file');
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

            const formData = new FormData();
            formData.append('media', file);
            formData.append('mediaType', type);
            formData.append('title', mediaData.title);
            formData.append('description', mediaData.description);

            const response = await fetch(`${API_BASE_URL}/api/public/gallery`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`);
                onMediaAdded();
                handleClose();
            } else {
                const data = await response.json();
                toast.error(data.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload Error:', error);
            toast.error('Server error');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        setFile(null);
        setMediaData({
            title: '',
            description: ''
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isVideo ? 'Upload Video' : 'Upload Photo'}
                    </h2>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-6 w-6 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">
                            {isVideo ? 'Choose Video *' : 'Choose Photo *'}
                        </label>
                        <input
                            type="file"
                            accept={isVideo ? "video/*" : "image/*"}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            required
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Title</label>
                        <input
                            type="text"
                            placeholder="Enter title"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                            value={mediaData.title}
                            onChange={(e) => setMediaData({ ...mediaData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Description</label>
                        <textarea
                            placeholder={`Brief description of the ${isVideo ? 'video' : 'photo'}`}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none h-24 resize-none"
                            value={mediaData.description}
                            onChange={(e) => setMediaData({ ...mediaData, description: e.target.value })}
                        ></textarea>
                    </div>


                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 py-3 px-6 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-6 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                        >
                            {loading ? (
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
    );
};

const Gallery = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('all');
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'photo' });
    const [selectedMedia, setSelectedMedia] = useState(null);

    const [photos, setPhotos] = useState([]);
    const [videos, setVideos] = useState([]);
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const isManager = user?.role === 'hostelManager';
    const isMonitor = user?.role === 'monitor';
    const isActiveStudent = user?.role === 'student' && user?.studentStatus === 'active';
    const canDownload = isManager || isMonitor || isActiveStudent;

    const openModal = (type) => setModalConfig({ isOpen: true, type });
    const closeModal = () => setModalConfig({ ...modalConfig, isOpen: false });

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

    const fetchGalleryItems = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const photoRes = await fetch(`${API_BASE_URL}/api/public/gallery?mediaType=photo`);
            const videoRes = await fetch(`${API_BASE_URL}/api/public/gallery?mediaType=video`);
            const newsRes = await fetch(`${API_BASE_URL}/api/public/gallery?mediaType=news`);

            if (photoRes.ok) setPhotos(await photoRes.json());
            if (videoRes.ok) setVideos(await videoRes.json());
            if (newsRes.ok) setNewsItems(await newsRes.json());
        } catch (error) {
            console.error('Error fetching gallery:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            const token = localStorage.getItem('token');
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const res = await fetch(`${API_BASE_URL}/api/public/gallery/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Deleted successfully');
                fetchGalleryItems();
            }
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    useEffect(() => {
        fetchGalleryItems();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pt-4 pb-20">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative mb-8">
                <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-2 transition-colors self-start ml-4">
                    <ChevronRight className="h-4 w-4 rotate-180 mr-1" /> Back to Home
                </Link>

                <h1 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">Gallery</h1>
                <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto font-medium text-center">Explore moments of learning, celebration, and growth at Vijay Vila Hostel</p>

                {isManager && (
                    <div className="absolute top-0 right-4 sm:right-8 flex gap-3">
                        <button
                            onClick={() => openModal('photo')}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 font-bold shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95 text-sm"
                        >
                            <Plus size={18} />
                            <span>Add Photo</span>
                        </button>
                        <button
                            onClick={() => openModal('video')}
                            className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl px-5 py-2.5 font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95 text-sm"
                        >
                            <Plus size={18} />
                            <span>Add Video</span>
                        </button>
                        <button
                            onClick={() => openModal('news')}
                            className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 rounded-xl px-5 py-2.5 font-bold shadow-sm flex items-center gap-2 transition-all active:scale-95 text-sm"
                        >
                            <Plus size={18} />
                            <span>Add News</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AddMediaModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                type={modalConfig.type}
                onMediaAdded={fetchGalleryItems}
            />

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'all'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        <ImageIcon className="h-4 w-4 mr-2" /> All
                    </button>
                    <button
                        onClick={() => setActiveTab('photos')}
                        className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'photos'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        <ImageIcon className="h-4 w-4 mr-2" /> Photos
                    </button>
                    <button
                        onClick={() => setActiveTab('videos')}
                        className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'videos'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        <Video className="h-4 w-4 mr-2" /> Videos
                    </button>
                    <button
                        onClick={() => setActiveTab('news')}
                        className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'news'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        <FileText className="h-4 w-4 mr-2" /> News & Updates
                    </button>
                </div>
            </div>

            {/* Photo Gallery Section */}
            {(activeTab === 'all' || activeTab === 'photos') && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                    <div className="flex items-center mb-8">
                        <ImageIcon className="h-6 w-6 text-blue-600 mr-2" />
                        <h2 className="text-2xl font-bold text-gray-900">Photo Gallery</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {loading ? (
                            [1, 2, 3, 4].map(n => (
                                <div key={n} className="aspect-square bg-gray-100 animate-pulse rounded-3xl" />
                            ))
                        ) : photos.length === 0 ? (
                            <div className="col-span-full py-10 text-center text-gray-500 font-bold">No photos found.</div>
                        ) : photos.map((photo) => (
                            <div key={photo._id} className="group relative aspect-square rounded-[32px] overflow-hidden bg-gray-100 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
                                <img
                                    src={photo.mediaUrl}
                                    alt={photo.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    crossOrigin="anonymous"
                                />

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                                        <button
                                            onClick={() => setSelectedMedia({ ...photo, mediaType: 'photo' })}
                                            className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-blue-600 transition-all hover:scale-110 active:scale-95 shadow-lg"
                                        >
                                            <Eye size={20} />
                                        </button>
                                        {isManager && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(photo._id);
                                                }}
                                                className="h-10 w-10 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all hover:scale-110 active:scale-95 shadow-lg"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <h3 className="text-white font-bold text-lg line-clamp-1 mb-1">{photo.title}</h3>
                                        <p className="text-white/70 text-xs font-medium">{photo.description || 'No description'}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Video Gallery Section */}
            {(activeTab === 'all' || activeTab === 'videos') && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                    <div className="flex items-center mb-8">
                        <Video className="h-6 w-6 text-blue-600 mr-2" />
                        <h2 className="text-2xl font-bold text-gray-900">Video Gallery</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            [1, 2, 3].map(n => (
                                <div key={n} className="h-72 bg-gray-100 animate-pulse rounded-3xl" />
                            ))
                        ) : videos.length === 0 ? (
                            <div className="col-span-full py-10 text-center text-gray-500 font-bold">No videos found.</div>
                        ) : videos.map((video) => (
                            <div key={video._id} className="group relative h-72 rounded-[32px] overflow-hidden bg-black shadow-lg hover:shadow-2xl transition-all duration-500">
                                <video
                                    src={video.mediaUrl}
                                    className="w-full h-full object-cover opacity-80"
                                    crossOrigin="anonymous"
                                    playsInline
                                />

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col items-center justify-center group-hover:bg-black/40 transition-all duration-500">
                                    <button
                                        onClick={() => setSelectedMedia({ ...video, mediaType: 'video' })}
                                        className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 transition-all hover:scale-110 active:scale-95 shadow-2xl group/play"
                                    >
                                        <Play size={32} className="fill-current ml-1 group-hover/play:scale-110 transition-transform" />
                                    </button>

                                    <div className="absolute top-4 right-4">
                                        {isManager && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(video._id);
                                                }}
                                                className="h-10 w-10 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all hover:scale-110 active:scale-95 shadow-lg"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="absolute bottom-8 left-8 right-8 text-center text-white">
                                        <h3 className="font-bold text-xl mb-2">{video.title}</h3>
                                        <p className="text-white/70 text-sm line-clamp-1">{video.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* News & Updates Section */}
            {(activeTab === 'all' || activeTab === 'news') && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center mb-8">
                        <FileText className="h-6 w-6 text-blue-600 mr-2" />
                        <h2 className="text-2xl font-bold text-gray-900">News & Updates</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            [1, 2, 3].map(n => (
                                <div key={n} className="h-96 bg-gray-100 animate-pulse rounded-3xl" />
                            ))
                        ) : newsItems.length === 0 ? (
                            <div className="col-span-full py-10 text-center text-gray-500 font-bold">No news items found.</div>
                        ) : newsItems.map((item) => (
                            <div key={item._id} className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group">
                                <div className="h-56 overflow-hidden relative">
                                    <img
                                        src={item.mediaUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        crossOrigin="anonymous"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={() => setSelectedMedia({ ...item, mediaType: 'photo' })}
                                            className="h-12 w-12 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95"
                                        >
                                            <Maximize2 size={20} />
                                        </button>
                                    </div>
                                    {isManager && (
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="absolute top-4 right-4 bg-red-50 text-red-600 h-10 w-10 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-lg active:scale-90"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    {item.date && (
                                        <div className="flex items-center text-gray-500 text-xs font-bold mb-4 bg-gray-50 px-3 py-1.5 rounded-full w-fit">
                                            <Calendar className="h-3 w-3 mr-2 text-blue-600" />
                                            {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    )}
                                    <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow font-medium">
                                        {item.description}
                                    </p>
                                    <button
                                        onClick={() => setSelectedMedia({ ...item, mediaType: 'photo' })}
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-gray-50 text-blue-600 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all active:scale-95"
                                    >
                                        View Full Post
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Lightbox */}
            {selectedMedia && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-10 animate-fade-in">
                    <button
                        onClick={() => setSelectedMedia(null)}
                        className="absolute top-6 right-6 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-red-500 transition-all flex items-center justify-center shadow-2xl z-[210] active:scale-90"
                    >
                        <X size={24} />
                    </button>

                    <div className="w-full max-w-5xl h-full flex flex-col items-center justify-center relative">
                        <div className="relative w-full h-[70vh] flex items-center justify-center mb-6">
                            {selectedMedia.mediaType === 'photo' ? (
                                <img
                                    src={selectedMedia.mediaUrl}
                                    alt={selectedMedia.title}
                                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-scale-in"
                                    crossOrigin="anonymous"
                                />
                            ) : (
                                <video
                                    src={selectedMedia.mediaUrl}
                                    controls
                                    autoPlay
                                    playsInline
                                    crossOrigin="anonymous"
                                    className="max-w-full max-h-full rounded-2xl shadow-2xl animate-scale-in"
                                />
                            )}
                        </div>

                        <div className="text-white text-center max-w-2xl px-4 animate-slide-up">
                            <h2 className="text-3xl font-black mb-2 tracking-tight uppercase">{selectedMedia.title}</h2>
                            <p className="text-gray-400 text-lg font-medium leading-relaxed">{selectedMedia.description}</p>

                            <div className="flex gap-4 mt-8 justify-center">
                                {canDownload && (
                                    <button
                                        onClick={() => handleDownload(selectedMedia.mediaUrl, selectedMedia.title)}
                                        className="flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-2xl font-bold hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-lg"
                                    >
                                        <Download size={20} />
                                        Download Memory
                                    </button>
                                )}
                                {isManager && (
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
                </div>
            )}
        </div>
    );
};

export default Gallery;
