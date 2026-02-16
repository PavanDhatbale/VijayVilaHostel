import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    MapPin,
    GraduationCap,
    Calendar,
    Award,
    ChevronRight,
    Plus,
    X,
    User,
    Mail,
    Phone,
    Instagram,
    Facebook,
    Globe,
    Upload,
    Video,
    Briefcase,
    ArrowLeft,
    Search,
    MessageSquare,
    CheckCircle2,
    Edit
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { toast } from 'react-hot-toast';

const AddStudentModal = ({ isOpen, onClose, onStudentAdded, studentToEdit }) => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    // New state for handling existing images
    const [existingProfileImage, setExistingProfileImage] = useState(null);
    const [existingGallery, setExistingGallery] = useState([]);
    const [deleteProfileImage, setDeleteProfileImage] = useState(false);
    const [deletedGalleryImages, setDeletedGalleryImages] = useState([]); // Array of publicIds to delete (actually IDs of the objects in DB)

    const [studentData, setStudentData] = useState({
        name: '',
        location: '',
        qualification: '',
        exam: 'UPSC',
        status: 'Current',
        stayFrom: '',
        stayTo: 'Present',
        examCleared: '',
        currentPosition: '',
        keyAchievements: '',
        testimony: '',
        socials: {
            instagram: '',
            facebook: '',
            phone: ''
        }
    });

    React.useEffect(() => {
        if (studentToEdit) {
            setStudentData({
                name: studentToEdit.name || '',
                location: studentToEdit.location || '',
                qualification: studentToEdit.qualification || '',
                exam: studentToEdit.exam || 'UPSC',
                status: studentToEdit.status || 'Current',
                stayFrom: studentToEdit.stayFrom || '',
                stayTo: studentToEdit.stayTo || 'Present',
                examCleared: studentToEdit.examCleared || '',
                currentPosition: studentToEdit.currentPosition || '',
                keyAchievements: Array.isArray(studentToEdit.keyAchievements)
                    ? studentToEdit.keyAchievements.join(', ')
                    : studentToEdit.keyAchievements || '',
                testimony: studentToEdit.testimony || '',
                socials: studentToEdit.socials || { instagram: '', facebook: '', phone: '' }
            });
            // Initialize existing images
            setExistingProfileImage(studentToEdit.profileImage);
            setExistingGallery(studentToEdit.hostelGallery || []);
            setDeleteProfileImage(false);
            setDeletedGalleryImages([]);
        }
    }, [studentToEdit, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file && !studentToEdit) {
            return toast.error('Please select a profile photo');
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

            const formData = new FormData();
            if (file) {
                formData.append('image', file);
            }
            if (videoFile) {
                formData.append('experienceVideo', videoFile);
            }

            // Add each gallery photo explicitly to the same field name
            // Backend middleware upload.fields([{ name: 'hostelGallery', maxCount: 5 }])
            // will collect these into an array
            if (galleryFiles && galleryFiles.length > 0) {
                galleryFiles.forEach((file) => {
                    formData.append('hostelGallery', file);
                });
            }

            formData.append('name', studentData.name);
            formData.append('location', studentData.location);
            formData.append('qualification', studentData.qualification);
            formData.append('exam', studentData.exam);
            formData.append('status', studentData.status);
            formData.append('stayFrom', studentData.stayFrom);
            formData.append('stayTo', studentData.stayTo);
            formData.append('examCleared', studentData.examCleared);
            formData.append('currentPosition', studentData.currentPosition);
            formData.append('keyAchievements', studentData.keyAchievements);
            formData.append('testimony', studentData.testimony);
            formData.append('socials', JSON.stringify(studentData.socials));

            // Append deletion flags
            if (studentToEdit) {
                formData.append('deleteProfileImage', deleteProfileImage);
                if (deletedGalleryImages.length > 0) {
                    formData.append('deletedGalleryImages', JSON.stringify(deletedGalleryImages));
                }
            }

            let response;
            if (studentToEdit) {
                response = await fetch(`${API_BASE_URL}/public/students/${studentToEdit._id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
            } else {
                response = await fetch(`${API_BASE_URL}/public/students`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
            }

            if (response.ok) {
                toast.success(studentToEdit ? 'Student updated successfully!' : 'Professional student added successfully!');
                onStudentAdded();
                handleClose();
            } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to add student');
            }
        } catch (error) {
            console.error('Add Featured Student Error:', error);
            toast.error('Server error');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        setFile(null);
        setVideoFile(null);
        setGalleryFiles([]);
        setStudentData({
            name: '',
            location: '',
            qualification: '',
            exam: 'UPSC',
            status: 'Current',
            stayFrom: '',
            stayTo: 'Present',
            examCleared: '',
            currentPosition: '',
            keyAchievements: '',
            testimony: '',
            socials: { instagram: '', facebook: '', phone: '' }
        });
        setExistingProfileImage(null);
        setExistingGallery([]);
        setDeleteProfileImage(false);
        setDeletedGalleryImages([]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col my-8">
                <div className="sticky top-0 bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 leading-tight">{studentToEdit ? 'Edit Student' : 'Add Student'}</h2>
                        <p className="text-gray-400 text-xs font-medium">{studentToEdit ? 'Update student details' : 'Create a premium professional profile'}</p>
                    </div>
                    <button onClick={handleClose} className="p-2.5 hover:bg-gray-100 rounded-2xl transition-colors">
                        <X className="h-6 w-6 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-10 overflow-y-auto custom-scrollbar-v2">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest border-b border-blue-50 pb-2 flex items-center gap-2">
                            <User size={12} /> Basic Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">Full Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Priya Shinde"
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-700"
                                    required
                                    value={studentData.name}
                                    onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">Location *</label>
                                <input
                                    type="text"
                                    placeholder="City, State"
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-700"
                                    required
                                    value={studentData.location}
                                    onChange={(e) => setStudentData({ ...studentData, location: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">Qualification *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. M.A. History"
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-700"
                                    required
                                    value={studentData.qualification}
                                    onChange={(e) => setStudentData({ ...studentData, qualification: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">Target Exam *</label>
                                <select
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-700"
                                    value={studentData.exam}
                                    onChange={(e) => setStudentData({ ...studentData, exam: e.target.value })}
                                >
                                    <option value="UPSC">UPSC</option>
                                    <option value="MPSC">MPSC</option>
                                    <option value="Banking">Banking</option>
                                    <option value="NEET">NEET</option>
                                    <option value="JEE">JEE</option>
                                    <option value="GATE">GATE</option>
                                    <option value="POLICE BHARATI">POLICE BHARATI</option>
                                    <option value="CMA & CA">CMA & CA</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">Stay From (Year) *</label>
                                <input
                                    type="text"
                                    placeholder="2020"
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-700"
                                    required
                                    value={studentData.stayFrom}
                                    onChange={(e) => setStudentData({ ...studentData, stayFrom: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">Stay To (Year/Present) *</label>
                                <input
                                    type="text"
                                    placeholder="2023 or Present"
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-gray-700"
                                    required
                                    value={studentData.stayTo}
                                    onChange={(e) => setStudentData({ ...studentData, stayTo: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Info */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-bold text-orange-600 uppercase tracking-widest border-b border-orange-50 pb-2 flex items-center gap-2">
                            <Award size={12} /> Career Achievements
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">Exam Cleared</label>
                                <input
                                    type="text"
                                    placeholder="e.g. MPSC State Service 2023"
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-orange-500 transition-all outline-none font-bold text-gray-700"
                                    value={studentData.examCleared}
                                    onChange={(e) => setStudentData({ ...studentData, examCleared: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">Current Position</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Deputy Collector"
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-orange-500 transition-all outline-none font-bold text-gray-700"
                                    value={studentData.currentPosition}
                                    onChange={(e) => setStudentData({ ...studentData, currentPosition: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">Key Achievements (Comma separated)</label>
                                <textarea
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-orange-500 transition-all outline-none font-medium text-gray-700 h-24 resize-none"
                                    placeholder="Achievement 1, Achievement 2..."
                                    value={studentData.keyAchievements}
                                    onChange={(e) => setStudentData({ ...studentData, keyAchievements: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Hostel Experience */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-bold text-purple-600 uppercase tracking-widest border-b border-purple-50 pb-2 flex items-center gap-2">
                            <MessageSquare size={12} /> Hostel Experience
                        </h4>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">Testimonial / Experience *</label>
                                <textarea
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-purple-500 transition-all outline-none font-medium text-gray-700 h-32 resize-none"
                                    required
                                    placeholder="Describe your journey at the hostel..."
                                    value={studentData.testimony}
                                    onChange={(e) => setStudentData({ ...studentData, testimony: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 ml-1">Experience Video (Optional)</label>
                                    <input type="file" accept="video/*" className="hidden" id="studentVid" onChange={(e) => setVideoFile(e.target.files[0])} />
                                    <label htmlFor="studentVid" className="flex items-center gap-3 px-5 py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl hover:bg-white hover:border-purple-400 cursor-pointer transition-all">
                                        <Video size={20} className="text-purple-600" />
                                        <span className="text-xs font-bold text-gray-500 truncate">{videoFile ? videoFile.name : 'Upload Experience Video'}</span>
                                    </label>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 ml-1">Status *</label>
                                    <select
                                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-purple-500 transition-all outline-none font-bold text-gray-700"
                                        value={studentData.status}
                                        onChange={(e) => setStudentData({ ...studentData, status: e.target.value })}
                                    >
                                        <option value="Current">Current Student</option>
                                        <option value="Alumni">Alumni / Success Story</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media & Gallery */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2 flex items-center gap-2">
                            <Upload size={12} /> Media & Photos
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">Profile Photo (Professional) {studentToEdit ? '(Leave empty to keep existing)' : '*'}</label>

                                {/* Existing Profile Image Display */}
                                {existingProfileImage && !deleteProfileImage && !file && (
                                    <div className="relative mb-3 w-24 h-24 group">
                                        <img
                                            src={existingProfileImage.url}
                                            alt="Current Profile"
                                            className="w-full h-full object-cover rounded-xl border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setDeleteProfileImage(true)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                            title="Delete current image"
                                        >
                                            <X size={12} />
                                        </button>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] text-center py-1 rounded-b-xl">
                                            Current
                                        </div>
                                    </div>
                                )}

                                <input type="file" accept="image/*" className="hidden" id="studentImg" onChange={(e) => {
                                    setFile(e.target.files[0]);
                                    if (e.target.files[0]) setDeleteProfileImage(false); // If new file selected, we are replacing not just deleting
                                }} />
                                <label htmlFor="studentImg" className="flex items-center gap-3 px-5 py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl hover:bg-white hover:border-blue-400 cursor-pointer transition-all">
                                    <Upload size={20} className="text-blue-600" />
                                    <span className="text-xs font-bold text-gray-500 truncate">{file ? file.name : (deleteProfileImage ? 'Select New Image' : 'Change Profile Image')}</span>
                                </label>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1">Hostel Life Gallery (Hold Ctrl to select up to 5)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple={true}
                                    name="hostelGallery"
                                    className="hidden"
                                    id="galleryPhotos"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            const newFiles = Array.from(e.target.files);
                                            console.log('Selected files:', newFiles);

                                            // Calculate the new total count for the toast
                                            // We need to use the current galleryFiles state here
                                            const currentCount = galleryFiles.length;
                                            const totalCount = Math.min(currentCount + newFiles.length, 5);
                                            toast.success(`${totalCount} photos ready for gallery`);

                                            setGalleryFiles(prev => {
                                                const combined = [...prev, ...newFiles].slice(0, 5);
                                                return combined;
                                            });
                                            // Reset input so its change event fires even if same file re-selected
                                            e.target.value = '';
                                        }
                                    }}
                                />
                                <label htmlFor="galleryPhotos" className="flex items-center gap-3 px-5 py-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl hover:bg-white hover:border-orange-400 cursor-pointer transition-all">
                                    <Plus size={20} className="text-orange-600" />
                                    <span className="text-xs font-bold text-gray-500 truncate">
                                        {galleryFiles.length > 0 ? `${galleryFiles.length} photos selected` : 'Select Gallery Photos'}
                                    </span>
                                </label>
                                {galleryFiles.length > 0 && (
                                    <div className="flex flex-col gap-2 mt-2">
                                        <div className="flex flex-wrap gap-2">
                                            {galleryFiles.map((f, i) => (
                                                <div key={i} className="flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-bold">
                                                    <CheckCircle2 size={10} />
                                                    <span>{f.name.substring(0, 10)}...</span>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setGalleryFiles([]);
                                                toast.success('Gallery selection cleared');
                                            }}
                                            className="text-[10px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1 w-fit ml-1"
                                        >
                                            <X size={10} /> Clear Gallery Selection
                                        </button>
                                    </div>
                                )}

                                {/* Existing Gallery Images Display */}
                                {existingGallery.length > 0 && (
                                    <div className="mt-4">
                                        <label className="text-xs font-bold text-gray-500 ml-1 mb-2 block">Current Gallery Images</label>
                                        <div className="flex flex-wrap gap-3">
                                            {existingGallery.map((img) => {
                                                // Check if this image provided in mapped existingGallery is marked for deletion
                                                // img._id is the identifier
                                                if (deletedGalleryImages.includes(img._id)) return null;

                                                return (
                                                    <div key={img._id} className="relative w-20 h-20 group">
                                                        <img
                                                            src={img.url}
                                                            alt="Gallery Item"
                                                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setDeletedGalleryImages(prev => [...prev, img._id])}
                                                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                            title="Delete this image"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {deletedGalleryImages.length > 0 && (
                                            <p className="text-[10px] text-red-500 mt-1 font-semibold">
                                                * {deletedGalleryImages.length} image(s) marked for deletion
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Social Connection */}
                    <div className="space-y-6 pb-4">
                        <h4 className="text-[10px] font-bold text-green-600 uppercase tracking-widest border-b border-green-50 pb-2 flex items-center gap-2">
                            <Globe size={12} /> Social Media & Contact
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1 flex items-center gap-1">
                                    <Instagram size={14} className="text-pink-500" /> Instagram URL
                                </label>
                                <input
                                    type="text"
                                    placeholder="https://instagram.com/..."
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-pink-500 transition-all outline-none font-bold text-gray-700"
                                    value={studentData.socials.instagram}
                                    onChange={(e) => setStudentData({ ...studentData, socials: { ...studentData.socials, instagram: e.target.value } })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1 flex items-center gap-1">
                                    <Facebook size={14} className="text-blue-600" /> Facebook URL
                                </label>
                                <input
                                    type="text"
                                    placeholder="https://facebook.com/..."
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-600 transition-all outline-none font-bold text-gray-700"
                                    value={studentData.socials.facebook}
                                    onChange={(e) => setStudentData({ ...studentData, socials: { ...studentData.socials, facebook: e.target.value } })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 ml-1 flex items-center gap-1">
                                    <Phone size={14} className="text-green-500" /> Contact Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="+91..."
                                    className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-green-500 transition-all outline-none font-bold text-gray-700"
                                    value={studentData.socials.phone}
                                    onChange={(e) => setStudentData({ ...studentData, socials: { ...studentData.socials, phone: e.target.value } })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                        <Button type="button" variant="secondary" onClick={handleClose} className="flex-1 py-5 rounded-3xl font-bold bg-gray-100 hover:bg-gray-200">Discard</Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-[2] py-5 rounded-3xl font-bold bg-[#1e1b4b] hover:bg-black shadow-2xl transition-all"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : (studentToEdit ? 'Update Student' : 'Publish Student')}
                        </Button>
                    </div>
                </form>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar-v2::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar-v2::-webkit-scrollbar-track { background: #f8fafc; }
                .custom-scrollbar-v2::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 2px solid #f8fafc; }
                .custom-scrollbar-v2::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}} />
        </div>
    );
};

const Students = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentToEdit, setStudentToEdit] = useState(null);
    const isManager = user?.role === 'hostelManager';

    const fetchStudents = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/public/students`);
            const data = await response.json();
            if (response.ok) {
                setStudents(data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student => {
        const matchesFilter = filter === 'all' || student.status?.toLowerCase() === filter;
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-20 font-inter">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-3">
                            <GraduationCap size={16} />
                            <span>Vijay Vila Hostel</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Our <span className="text-blue-600">Hostel Students</span></h1>
                        <p className="text-lg text-gray-500 font-medium max-w-2xl">Celebrating the hard work and success of our residents. From cracking competitive exams to leading in corporate roles.</p>
                    </div>

                    {isManager && (
                        <button
                            onClick={() => {
                                setStudentToEdit(null);
                                setIsModalOpen(true);
                            }}
                            className="bg-[#1e1b4b] hover:bg-black text-white rounded-2xl px-8 py-4 font-bold shadow-xl transition-all active:scale-95 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            <span>Add Student</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 w-full relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="w-full pl-14 pr-4 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl w-full md:w-auto">
                        {['all', 'current', 'alumni'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-xs font-black transition-all ${filter === tab
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Students Grid - Enhanced UI */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Records</p>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="bg-white rounded-[3rem] py-24 px-8 text-center border-2 border-dashed border-gray-100">
                        <User size={64} className="mx-auto text-gray-100 mb-6" />
                        <h3 className="text-2xl font-black text-gray-900 mb-2">No Students Found</h3>
                        <p className="text-gray-400 font-medium max-w-xs mx-auto text-sm">We couldn't find any students matching your current search or filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredStudents.map((student, index) => (
                            <div
                                key={student._id}
                                className="bg-white rounded-[2rem] p-5 shadow-lg shadow-blue-500/5 border border-white hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500 group flex flex-col relative overflow-hidden animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Decorative Gradient Blob */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-bl-[4rem] -z-10 transition-all group-hover:scale-150 duration-700"></div>

                                {/* Status Badge */}
                                <div className={`absolute top-5 right-5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest z-10 border shadow-sm transition-transform group-hover:scale-105 ${student.status === 'Alumni'
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent'
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent'
                                    }`}>
                                    {student.status}
                                </div>

                                {/* Profile Section */}
                                <div className="flex flex-col items-center mb-6 mt-2">
                                    <div className="relative">
                                        <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white shadow-xl mb-4 group-hover:scale-105 transition-transform duration-500 relative z-10">
                                            <img
                                                src={student.profileImage?.url}
                                                alt={student.name}
                                                crossOrigin="anonymous"
                                                referrerPolicy="no-referrer-when-downgrade"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {/* Glowing ring behind image */}
                                        <div className="absolute inset-0 rounded-full bg-blue-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                                    </div>

                                    <h3 className="text-xl font-black text-gray-900 text-center tracking-tight mb-1 group-hover:text-blue-600 transition-colors">{student.name}</h3>

                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full mt-1">
                                        <MapPin size={12} className="text-blue-500" />
                                        <span>{student.location}</span>
                                    </div>
                                </div>

                                {/* Highlights */}
                                <div className="space-y-3 mb-6 flex-1">
                                    <div className="bg-gradient-to-r from-orange-50 to-orange-50/30 rounded-2xl p-4 border border-orange-100/50 group-hover:border-orange-200 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-xl shadow-sm text-orange-500">
                                                <Award size={18} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[10px] font-black text-orange-400 uppercase tracking-tighter mb-0.5">Cleared</p>
                                                <p className="text-sm font-black text-gray-800 truncate leading-tight">
                                                    {student.examCleared || student.exam}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {student.currentPosition && (
                                        <div className="bg-gradient-to-r from-indigo-50 to-indigo-50/30 rounded-2xl p-4 border border-indigo-100/50 group-hover:border-indigo-200 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600">
                                                    <Briefcase size={18} />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter mb-0.5">Position</p>
                                                    <p className="text-sm font-black text-indigo-900 truncate leading-tight italic">
                                                        {student.currentPosition}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Stats Bar */}
                                <div className="grid grid-cols-2 gap-4 py-4 border-t border-dashed border-gray-200 mb-5">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Education</p>
                                        <p className="text-xs font-bold text-gray-700 truncate">{student.qualification}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mb-1">Stay Period</p>
                                        <p className="text-xs font-bold text-gray-700">{student.stayFrom} - {student.stayTo}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-auto">
                                    <Link to={`/students/${student._id}`} className="flex-1">
                                        <button className="w-full bg-gray-900 hover:bg-black text-white rounded-xl py-3.5 text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 group-hover:gap-3 group-hover:shadow-lg group-hover:shadow-gray-900/20">
                                            View Profile
                                            <ChevronRight size={14} />
                                        </button>
                                    </Link>
                                    {isManager && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setStudentToEdit(student);
                                                    setIsModalOpen(true);
                                                }}
                                                className="p-3.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-blue-500/30"
                                            >
                                                <Edit size={16} strokeWidth={3} />
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm('Remove this student profile?')) {
                                                        try {
                                                            const token = localStorage.getItem('token');
                                                            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
                                                            const res = await fetch(`${API_BASE_URL}/public/students/${student._id}`, {
                                                                method: 'DELETE',
                                                                headers: { 'Authorization': `Bearer ${token}` }
                                                            });
                                                            if (res.ok) {
                                                                toast.success('Removed successfully');
                                                                fetchStudents();
                                                            }
                                                        } catch (error) {
                                                            toast.error('Failed to remove');
                                                        }
                                                    }
                                                }}
                                                className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:shadow-red-500/30"
                                            >
                                                <span>Delete</span>
                                                <X size={16} strokeWidth={3} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <AddStudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onStudentAdded={fetchStudents}
                studentToEdit={studentToEdit}
            />

            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                .font-inter { font-family: 'Inter', sans-serif; }
                .custom-scrollbar-v2::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar-v2::-webkit-scrollbar-track { background: #f8fafc; }
                .custom-scrollbar-v2::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 2px solid #f8fafc; }
                .custom-scrollbar-v2::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out forwards;
                    opacity: 0; 
                }
            `}} />
        </div>
    );
};

export default Students;
