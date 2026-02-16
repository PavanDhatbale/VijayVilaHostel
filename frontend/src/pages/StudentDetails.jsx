import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    GraduationCap,
    Calendar,
    Award,
    Briefcase,
    Home,
    Search,
    User,
    Instagram,
    Facebook,
    Phone,
    Image as ImageIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const StudentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activePhoto, setActivePhoto] = useState(0);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/public/students/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setStudent(data);
                } else {
                    toast.error(data.message || 'Student not found');
                    navigate('/students');
                }
            } catch (error) {
                toast.error('Error fetching student details');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetails();
        window.scrollTo(0, 0);
    }, [id, API_BASE_URL, navigate]);

    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const openImageModal = (image) => {
        setSelectedImage(image);
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
        setSelectedImage(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Profile...</p>
                </div>
            </div>
        );
    }

    if (!student) return null;

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-inter relative">
            <div className="fixed inset-0 bg-gray-50 -z-20"></div>
            <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-b-[4rem] -z-10 shadow-2xl"></div>

            <div className="max-w-5xl mx-auto">
                {/* Fixed Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-blue-600 bg-white font-bold text-sm mb-8 hover:bg-blue-50 transition-all gap-2 group shadow-lg shadow-blue-500/20 px-6 py-3 rounded-full w-fit hover:-translate-y-1"
                >
                    <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                    Back to Students
                </button>

                {/* Main Profile Card */}
                <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up border border-white">

                    {/* Hero Header Section */}
                    <div className="p-10 md:p-14 flex flex-col md:flex-row items-center md:items-start gap-10 bg-gradient-to-b from-blue-50/50 to-white">
                        {/* Profile Image */}
                        <div className="relative group perspective">
                            <div
                                className="w-52 h-52 rounded-[2rem] overflow-hidden ring-8 ring-white shadow-2xl transform transition-transform duration-700 group-hover:scale-105 cursor-pointer"
                                onClick={() => openImageModal(student.profileImage?.url)}
                            >
                                <img
                                    src={student.profileImage?.url}
                                    alt={student.name}
                                    crossOrigin="anonymous"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Since</span>
                                <span className="text-xl font-black text-blue-600">{student.stayFrom}</span>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left pt-2">
                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">{student.name}</h1>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
                                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-500/30">
                                    {student.status || 'Student'}
                                </span>
                                <span className="bg-white text-gray-900 border-2 border-gray-100 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">
                                    Target: {student.exam || 'UPSC'}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-center md:justify-start gap-3 text-gray-600 font-medium bg-gray-50/80 p-3 rounded-xl w-fit mx-auto md:mx-0">
                                    <MapPin size={20} className="text-red-500" />
                                    <span>{student.location}</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-3 text-gray-600 font-medium bg-gray-50/80 p-3 rounded-xl w-fit mx-auto md:mx-0">
                                    <GraduationCap size={20} className="text-blue-500" />
                                    <span>{student.qualification || student.course}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Achievements & Career */}
                    <div className="p-10 md:p-14 space-y-10">
                        <div className="space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-green-100 rounded-2xl text-green-600">
                                    <Award size={28} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900">Achievements</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2 bg-gradient-to-br from-green-50 to-emerald-50/30 p-6 rounded-3xl border border-green-100">
                                    <p className="text-xs font-black text-green-600 uppercase tracking-widest mb-2">Exams Cleared</p>
                                    <p className="text-2xl font-black text-gray-900">
                                        {student.examCleared || 'In Progress'}
                                    </p>
                                </div>
                                <div className="space-y-2 bg-gradient-to-br from-blue-50 to-indigo-50/30 p-6 rounded-3xl border border-blue-100">
                                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Current Position</p>
                                    <div className="flex items-center gap-3">
                                        <Briefcase size={24} className="text-blue-600 shrink-0" />
                                        <p className="text-2xl font-black text-gray-900">
                                            {student.currentPosition || 'Aspiring Professional'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {student.keyAchievements && student.keyAchievements.length > 0 && (
                                <div className="space-y-4 pt-4">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest pl-2">Key Milestones</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {student.keyAchievements.map((achievement, index) => (
                                            <div key={index} className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors bg-white shadow-sm">
                                                <div className="bg-blue-600 w-2 h-2 rounded-full mt-2 shrink-0 shadow-lg shadow-blue-500/50"></div>
                                                <span className="text-gray-700 font-bold leading-relaxed">{achievement}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 mx-10"></div>

                    {/* Hostel Experience */}
                    <div className="p-10 md:p-14 space-y-10 bg-gray-50/30">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
                                <Home size={28} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900">Hostel Journey</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                            {/* Testimony Box */}
                            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 relative h-full flex flex-col shadow-sm">
                                <div className="text-6xl font-serif text-purple-200 leading-none mb-4">"</div>
                                <p className="text-gray-700 text-lg font-medium leading-relaxed italic z-10 px-2 flex-1">
                                    {student.testimony || student.achievement || "My journey at Vijay Vila Hostel was transformative. The environment provided me with the discipline and focus I needed to succeed in my professional goals."}
                                </p>
                                <div className="mt-6 flex items-center gap-3 border-t border-gray-50 pt-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                                        {student.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900 uppercase">{student.name}</p>
                                        <p className="text-[10px] font-bold text-gray-400">Resident {student.stayFrom}-{student.stayTo}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Video Section */}
                            <div>
                                {student.experienceVideo?.url ? (
                                    <div className="rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl bg-gray-900 h-full min-h-[300px] relative group">
                                        <video
                                            src={student.experienceVideo.url}
                                            controls
                                            playsInline
                                            crossOrigin="anonymous"
                                            className="w-full h-full object-cover"
                                        ></video>
                                    </div>
                                ) : (
                                    <div className="rounded-[2rem] overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 h-full min-h-[300px] flex flex-col items-center justify-center gap-4 text-center p-8">
                                        <div className="p-5 rounded-full bg-white shadow-sm text-gray-300">
                                            <ImageIcon size={48} />
                                        </div>
                                        <div>
                                            <p className="text-gray-900 font-bold">No Video Available</p>
                                            <p className="text-gray-400 text-sm mt-1">Video moments coming soon</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Photo Gallery Section */}
                    <div className="p-10 md:p-14 space-y-10">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                                <ImageIcon size={28} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900">Life at Vijay Vila</h2>
                        </div>

                        {student.hostelGallery && student.hostelGallery.length > 0 ? (
                            <div className="space-y-6">
                                {/* Main View */}
                                <div
                                    className="aspect-video w-full rounded-[2.5rem] overflow-hidden ring-8 ring-gray-50 shadow-inner relative bg-gray-100 cursor-pointer group"
                                    onClick={() => openImageModal(student.hostelGallery[activePhoto].url)}
                                >
                                    <img
                                        src={student.hostelGallery[activePhoto].url}
                                        alt="Hostel Life"
                                        crossOrigin="anonymous"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="w-full h-full object-cover animate-fade-in group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <span className="bg-white/90 backdrop-blur text-gray-900 px-4 py-2 rounded-xl text-xs font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">
                                            View Full Screen
                                        </span>
                                    </div>
                                    <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full text-gray-900 text-xs font-black shadow-lg">
                                        {activePhoto + 1} <span className="text-gray-400 mx-1">/</span> {student.hostelGallery.length}
                                    </div>
                                </div>
                                {/* Thumbnails */}
                                <div className="flex flex-wrap gap-4">
                                    {student.hostelGallery.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActivePhoto(idx)}
                                            className={`w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all duration-300 ${activePhoto === idx ? 'border-blue-600 scale-110 shadow-lg' : 'border-transparent hover:border-blue-200 grayscale hover:grayscale-0'}`}
                                        >
                                            <img
                                                src={img.url}
                                                alt="Thumbnail"
                                                crossOrigin="anonymous"
                                                referrerPolicy="no-referrer-when-downgrade"
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-100">
                                <p className="text-gray-400 font-bold">Gallery images will appear here.</p>
                            </div>
                        )}
                    </div>

                    {/* Connect Section */}
                    <div className="p-10 md:p-14 border-t border-indigo-50 bg-indigo-50/20 space-y-8">
                        <h2 className="text-xl font-black text-indigo-900">Connect with {student.name.split(' ')[0]}</h2>
                        <div className="flex flex-wrap gap-4">
                            {/* Instagram */}
                            {(student.socials?.instagram || student.socialLinks?.instagram) && (
                                <a
                                    href={student.socials?.instagram || student.socialLinks?.instagram}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 bg-white text-gray-700 hover:text-pink-600 px-8 py-4 rounded-2xl font-bold shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100"
                                >
                                    <Instagram size={24} />
                                    <span>Instagram</span>
                                </a>
                            )}

                            {/* Facebook */}
                            {(student.socials?.facebook || student.socialLinks?.facebook) && (
                                <a
                                    href={student.socials?.facebook || student.socialLinks?.facebook}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 bg-white text-gray-700 hover:text-blue-600 px-8 py-4 rounded-2xl font-bold shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100"
                                >
                                    <Facebook size={24} />
                                    <span>Facebook</span>
                                </a>
                            )}

                            {/* Contact */}
                            {(student.socials?.phone || student.contactNumber) && (
                                <div className="flex items-center gap-3 bg-white text-gray-700 hover:text-green-600 px-8 py-4 rounded-2xl font-bold shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100 cursor-copy" onClick={() => toast.success('Number copied!')}>
                                    <Phone size={24} />
                                    <span>{student.socials?.phone || student.contactNumber}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Screen Image Modal */}
            {isImageModalOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
                    onClick={closeImageModal}
                >
                    <button
                        onClick={closeImageModal}
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <div
                        className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage}
                            alt="Full Screen View"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                .font-inter { font-family: 'Inter', sans-serif; }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}} />
        </div>
    );
};

export default StudentDetails;
