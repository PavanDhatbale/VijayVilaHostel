import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Heart, Target, Users, Bed, BookOpen, Sparkles, Award, CheckCircle, ChevronLeft, ChevronRight, Phone, MapPin, Mail, Quote, Edit, Settings } from 'lucide-react';
import Button from '../components/ui/Button';
import UpdateHostelConfigModal from '../components/modals/UpdateHostelConfigModal';
import UpdateLocationModal from '../components/modals/UpdateLocationModal';

const Home = () => {
    const { user } = useAuth();
    // Gallery Image State
    const [currentImage, setCurrentImage] = useState(0);
    const galleryImages = [
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop", // Bunk beds
        "https://images.unsplash.com/photo-1595521624992-48a59aef95e3?q=80&w=1920&auto=format&fit=crop", // Room
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop", // Interior
    ];

    const nextImage = () => {
        setCurrentImage((prev) => (prev + 1) % galleryImages.length);
    };

    const prevImage = () => {
        setCurrentImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

    const [hostelConfig, setHostelConfig] = useState(null);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

    // Location State
    const [locationData, setLocationData] = useState(null);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchHostelConfig = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/public/config`);
            if (response.ok) {
                const data = await response.json();
                setHostelConfig(data);
            }
        } catch (error) {
            console.error('Failed to fetch hostel config:', error);
        }
    };

    const fetchLocation = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/hostel-location`);
            if (response.ok) {
                const data = await response.json();
                setLocationData(data);
            }
        } catch (error) {
            console.error('Failed to fetch location:', error);
        }
    };

    useEffect(() => {
        fetchHostelConfig();
        fetchLocation();
    }, []);

    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.substring(1));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100); // Small delay to ensure render
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [location]);

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Hero Section */}
            <div id="home" className="relative bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/60 z-0"></div>
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 z-0 transition-all duration-700"
                    style={{ backgroundImage: `url(${hostelConfig?.heroImage?.url || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"})` }}
                ></div>

                {/* Manager Edit Hero Button */}
                {user?.role === 'hostelManager' && (
                    <button
                        onClick={() => setIsConfigModalOpen(true)}
                        className="absolute top-4 right-4 md:right-8 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 rounded-full shadow-lg border border-white/20 transition-all"
                        title="Change Hero Image"
                    >
                        <Settings size={20} />
                    </button>
                )}

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-60 lg:pt-24 lg:pb-80 flex flex-col items-center text-center">
                    {/* ... (rest of hero content) ... */}
                    <div className="mb-6 inline-flex items-center px-4 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm">
                        <Sparkles className="h-4 w-4 text-yellow-400 mr-2" />
                        <span className="text-yellow-200 text-sm font-medium">A Social Initiative by Dr. Atul Vadagavkar</span>
                    </div>

                    <h1 className="text-5xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                        घरकुल ज्ञानार्जनाचे
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> वाट स्वप्नपूर्तीचे</span>
                    </h1>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        {(!user || user.role === 'student') ? (
                            <Link to="/admission">
                                <Button variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full flex items-center shadow-lg hover:shadow-xl transition-all">
                                    Apply for Admission <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        ) : user.role === 'hostelManager' ? (
                            <Link to="/manager-dashboard">
                                <Button variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full flex items-center shadow-lg hover:shadow-xl transition-all">
                                    Manage Admissions <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        ) : (
                            <Link to="/monitor-dashboard">
                                <Button variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full flex items-center shadow-lg hover:shadow-xl transition-all">
                                    Monitor Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        )}

                    </div>

                    {/* Stats Strip */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl border-t border-white/10 pt-8">
                        <div>
                            <p className="text-4xl font-bold text-white">14</p>
                            <p className="text-gray-400">Beds Available</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-white">100%</p>
                            <p className="text-gray-400">Free of Cost</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-white">4</p>
                            <p className="text-gray-400">Well-kept Rooms</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section */}
            <div id="about" className="py-10 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-start gap-12">
                        {/* Owner Card */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                                <div className="h-32 bg-blue-600 relative"></div>
                                <div className="px-6 pb-8 text-center relative">
                                    <div className="relative -mt-16 mb-6 inline-block">
                                        <img
                                            src={hostelConfig?.ownerImage?.url || "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=2070&auto=format&fit=crop"}
                                            alt={hostelConfig?.ownerName || "Owner"}
                                            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover mx-auto bg-white"
                                        />
                                        {/* Manager Edit Button Positioned near image */}
                                        {user?.role === 'hostelManager' && (
                                            <button
                                                onClick={() => setIsConfigModalOpen(true)}
                                                className="absolute bottom-0 right-0 p-2 bg-white text-blue-600 rounded-full shadow-md hover:bg-blue-50 transition-colors border border-gray-100"
                                                title="Edit Owner Details"
                                            >
                                                <Edit size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{hostelConfig?.ownerName || "Dr. Atul Vadagavkar"}</h3>
                                    <p className="text-blue-600 font-bold text-sm tracking-wide uppercase mb-6">{hostelConfig?.ownerRole || "FOUNDER & MANAGING TRUSTEE"}</p>

                                    <div className="relative">
                                        <Quote className="h-6 w-6 text-gray-300 absolute -top-4 -left-2 transform -scale-x-100" />
                                        <p className="text-gray-600 italic text-sm leading-relaxed px-4">
                                            "{hostelConfig?.ownerBio || "Dr. Atul Vadagavkar (MD Medicine) is a dedicated philanthropist and medical professional committed to empowering students from economically weaker sections. His vision is to ensure that talent meets opportunity, regardless of financial barriers."}"
                                        </p>
                                        <Quote className="h-6 w-6 text-gray-300 absolute -bottom-4 -right-2" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Content */}
                        <div className="w-full lg:w-2/3 pt-4 text-center">
                            <div className="mb-4">
                                <span className="inline-block px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">Our Mission</span>
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">About Vijay Vila Hostel</h2>
                            <div className="prose prose-lg text-gray-600 leading-relaxed space-y-6 mx-auto">
                                <p>
                                    Vijay Vila Hostel is a beacon of hope for financially disadvantaged students who dream of higher education and competitive exam success. We provide completely <span className="text-blue-600 font-bold">free accommodation</span> to deserving students who cannot afford living expenses in city areas while preparing for MPSC and UPSC examinations.
                                </p>
                                <p>
                                    Founded and selflessly managed by <span className="font-bold text-gray-900">Dr. Atul Vadagavkar (MD Medicine)</span>, our hostel is more than just a place to stay — it's a nurturing environment that fosters discipline, dedication, and academic excellence.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mission Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-red-500 hover:shadow-xl transition-shadow text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                                <Heart className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Social Service Mission</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Supporting students from poor families who deserve a chance at success.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-green-500 hover:shadow-xl transition-shadow text-center">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                                <Target className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Focus on Excellence</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Creating an environment conducive to serious study and preparation.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-purple-500 hover:shadow-xl transition-shadow text-center">
                            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-500">
                                <Users className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Community & Discipline</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Building character through structured living and shared values.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Facilities Section */}
            <div id="facilities" className="py-10 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mb-4">What We Offer</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Hostel Facilities</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Everything you need to focus on your studies and achieve your dreams. We provide a complete support system for your success.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {/* Facility 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Bed className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Free Accommodation</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                14 beds across 4 well-maintained rooms for deserving students.
                            </p>
                        </div>

                        {/* Facility 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <BookOpen className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Study Environment</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Quiet and peaceful atmosphere perfect for exam preparation.
                            </p>
                        </div>

                        {/* Facility 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <Sparkles className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Clean & Disciplined</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Well-maintained hostel with strict cleanliness standards.
                            </p>
                        </div>

                        {/* Facility 4 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                            <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                <Award className="h-7 w-7" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">MPSC & UPSC Focus</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Specialized support and guidance for competitive exam aspirants.
                            </p>
                        </div>
                    </div>

                    {/* Bottom Blue Banner */}
                    <div className="bg-blue-600 rounded-2xl p-10 text-center text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-10 -translate-y-10"></div>
                        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-10 translate-y-10"></div>
                        <h2 className="text-3xl font-bold mb-4 relative z-10">All Facilities Are Completely Free</h2>
                        <p className="text-blue-100 max-w-3xl mx-auto text-lg relative z-10">
                            We believe that financial constraints should never be a barrier to education. Every facility at Vijay Vila Hostel is provided at absolutely no cost to deserving students.
                        </p>
                    </div>
                </div>
            </div>

            {/* Rules Section */}
            <div id="rules" className="py-10 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">Code of Conduct</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Rules & Regulations</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Discipline and dedication are the keys to success. Our rules ensure a conducive environment for all students.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {[
                            {
                                title: "Discipline is Mandatory",
                                desc: "All students must maintain strict discipline and follow hostel timings.",
                                icon: <CheckCircle className="h-6 w-6 text-green-500" />
                            },
                            {
                                title: "Cleanliness is Compulsory",
                                desc: "Keep your room, common areas, and the entire hostel premises clean.",
                                icon: <CheckCircle className="h-6 w-6 text-green-500" />
                            },
                            {
                                title: "Regular Attendance Required",
                                desc: "Students must maintain regular attendance in their study routines.",
                                icon: <CheckCircle className="h-6 w-6 text-green-500" />
                            },
                            {
                                title: "Focus on Studies",
                                desc: "The hostel is for serious students dedicated to exam preparation.",
                                icon: <CheckCircle className="h-6 w-6 text-green-500" />
                            },
                            {
                                title: "Respect Hostel Authorities",
                                desc: "Show respect and gratitude to hostel management and follow all guidelines.",
                                icon: <CheckCircle className="h-6 w-6 text-green-500" />
                            },
                            {
                                title: "No Disturbances",
                                desc: "Maintain a peaceful environment - no loud music, parties, or disturbances.",
                                icon: <CheckCircle className="h-6 w-6 text-green-500" />
                            }
                        ].map((rule, idx) => (
                            <div key={idx} className="flex items-start bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-shadow">
                                <div className="bg-green-50 p-3 rounded-full mr-4 flex-shrink-0">
                                    {rule.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{rule.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{rule.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Quote Banner */}
                    <div className="bg-blue-600 rounded-2xl p-12 text-center text-white shadow-xl relative overflow-hidden max-w-4xl mx-auto">
                        <Quote className="absolute top-4 left-1/2 -translate-x-1/2 text-white/10 h-32 w-32" />
                        <div className="relative z-10">
                            <p className="text-xl md:text-2xl font-bold mb-6 leading-relaxed">
                                "These rules are designed to help you succeed. By maintaining discipline and focus, you honor the opportunity given to you and pave the way for your bright future."
                            </p>
                            <p className="text-blue-200 font-bold tracking-wide uppercase text-sm">
                                — {hostelConfig?.ownerName || "Dr. Atul Vadagavkar"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Section */}
            <div id="gallery" className="py-8 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 relative">
                        <span className="inline-block px-4 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4">Visual Tour</span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Photo Gallery</h2>
                        <p className="text-xl text-gray-600">Life at Vijay Vila Hostel</p>

                        {/* Manager Edit Gallery Button */}
                        {user?.role === 'hostelManager' && (
                            <button
                                onClick={() => setIsConfigModalOpen(true)}
                                className="absolute right-0 top-0 inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors"
                            >
                                <Edit size={16} /> Edit Gallery
                            </button>
                        )}
                    </div>

                    <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl aspect-[16/9] group bg-gray-100">
                        {hostelConfig?.landingGallery && hostelConfig.landingGallery.length > 0 ? (
                            <>
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-in-out"
                                    style={{ backgroundImage: `url(${hostelConfig.landingGallery[currentImage]?.url})` }}
                                ></div>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

                                <button
                                    onClick={() => setCurrentImage((prev) => (prev - 1 + hostelConfig.landingGallery.length) % hostelConfig.landingGallery.length)}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={() => setCurrentImage((prev) => (prev + 1) % hostelConfig.landingGallery.length)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>

                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                                    {hostelConfig.landingGallery.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImage(idx)}
                                            className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentImage ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <p>No gallery images uploaded yet.</p>
                                {user?.role === 'hostelManager' && (
                                    <button
                                        onClick={() => setIsConfigModalOpen(true)}
                                        className="mt-4 text-blue-600 underline"
                                    >
                                        Upload Images
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Hostel Video Tour Section */}
            {hostelConfig?.hostelVideo && (
                <div id="video-tour" className="py-16 bg-gray-50 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12 relative">
                            <span className="inline-block px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-4">Virtual Experience</span>
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Hostel Video Tour</h2>
                            <p className="text-xl text-gray-600">Explore our facilities in motion</p>

                            {/* Manager Edit Video Button */}
                            {user?.role === 'hostelManager' && (
                                <button
                                    onClick={() => setIsConfigModalOpen(true)}
                                    className="absolute right-0 top-0 inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                                >
                                    <Edit size={16} /> Edit Video
                                </button>
                            )}
                        </div>

                        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl aspect-video bg-black relative group">
                            <video
                                src={hostelConfig.hostelVideo}
                                className="w-full h-full object-cover"
                                controls
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
            )}

            {/* Promise / CTA Section */}
            <div className="py-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-center text-white relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-y-1/3 translate-x-1/3"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4">
                    <div className="inline-flex items-center space-x-2 text-blue-200 mb-4 border border-blue-400/30 rounded-full px-4 py-1 bg-blue-900/20 backdrop-blur-sm">
                        <Heart className="h-4 w-4" strokeWidth={2.5} />
                        <span className="font-medium text-xs">Our Promise</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                        "Education should never stop <br /> because of poverty"
                    </h2>
                    <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
                        If you are a deserving student from a financially weak background and are serious about preparing for MPSC or UPSC exams, we are here to support you.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {(!user || user.role === 'student') ? (
                            <Link to="/signup">
                                <Button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 text-base rounded-xl shadow-lg hover:shadow-green-500/30 transition-all font-bold flex items-center justify-center w-full sm:w-auto">
                                    <Users className="mr-2 h-4 w-4" /> Apply for Admission
                                </Button>
                            </Link>
                        ) : (
                            <Link to={user.role === 'hostelManager' ? "/manager-dashboard" : "/monitor-dashboard"}>
                                <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-base rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all font-bold flex items-center justify-center w-full sm:w-auto">
                                    <ArrowRight className="mr-2 h-4 w-4" /> Go to Dashboard
                                </Button>
                            </Link>
                        )}
                        <Button
                            variant="white"
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-6 py-3 text-base rounded-xl shadow-lg transition-all font-bold flex items-center justify-center w-full sm:w-auto"
                        >
                            <Phone className="mr-2 h-4 w-4" /> Contact Hostel Management
                        </Button>
                    </div>

                    <div className="mt-8 text-blue-200 flex items-center justify-center space-x-2 text-xs">
                        <Sparkles className="h-3 w-3 text-yellow-300" />
                        <span>Your dreams matter. Let us help you achieve them.</span>
                        <Sparkles className="h-3 w-3 text-yellow-300" />
                    </div>
                </div>
            </div>

            {/* Location Section */}
            <div className="py-10 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-6 shadow-sm">
                            <MapPin className="h-6 w-6" />
                        </span>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Hostel Location</h2>
                        <p className="text-xl text-gray-600">Find us easily and plan your visit</p>

                        {/* Manager Edit Button */}
                        {user?.role === 'hostelManager' && (
                            <button
                                onClick={() => setIsLocationModalOpen(true)}
                                className="mt-4 inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-200"
                            >
                                <Settings className="h-4 w-4" /> Update Location Settings
                            </button>
                        )}
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
                        {/* Map Side */}
                        <div className="lg:w-2/3 h-[400px] lg:h-auto bg-gray-200 relative">
                            {locationData?.mapEmbedUrl ? (
                                <iframe
                                    src={locationData.mapEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="absolute inset-0"
                                ></iframe>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                                    <p>Map not available</p>
                                </div>
                            )}
                        </div>

                        {/* Details Side */}
                        <div className="lg:w-1/3 p-10 flex flex-col justify-center bg-gradient-to-br from-white to-gray-50">
                            <div className="flex items-start mb-8">
                                <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 mr-4 flex-shrink-0 mt-1">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">Our Address</h3>
                                    <p className="text-blue-600 font-bold mb-3 text-lg">{locationData?.hostelName || "Vijay Vila Hostel"}</p>
                                    <p className="text-gray-600 leading-relaxed font-medium">
                                        {locationData?.address || "Address details not updated yet."}
                                    </p>
                                    {(locationData?.city || locationData?.pincode) && (
                                        <p className="text-gray-600 leading-relaxed font-medium mt-1">
                                            {locationData?.city} {locationData?.pincode && `- ${locationData.pincode}`}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4">
                                <a
                                    href={locationData?.latitude && locationData?.longitude
                                        ? `https://www.google.com/maps/search/?api=1&query=${locationData.latitude},${locationData.longitude}`
                                        : "https://maps.google.com"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full"
                                >
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center font-bold text-lg group">
                                        <MapPin className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> Get Directions
                                    </Button>
                                </a>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <p className="text-xs font-semibold text-blue-700 bg-blue-50 p-4 rounded-xl text-center leading-relaxed">
                                    Nearby: {locationData?.landmark || "MPSC/UPSC Coaching Centers, Libraries"} • Well connected by public transport
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Config Modal */}
            <UpdateHostelConfigModal
                isOpen={isConfigModalOpen}
                onClose={() => setIsConfigModalOpen(false)}
                onConfigUpdated={(newConfig) => setHostelConfig(newConfig)}
                initialConfig={hostelConfig}
            />
            {/* Location Update Modal */}
            <UpdateLocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onUpdate={fetchLocation}
            />
            {/* CSS for Animations */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                .animation-delay-100 { animation-delay: 0.1s; }
                .animation-delay-200 { animation-delay: 0.2s; }
                .animation-delay-300 { animation-delay: 0.3s; }
                .animation-delay-400 { animation-delay: 0.4s; }
                
                .hover-card-effect {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .hover-card-effect:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }
            `}</style>
        </div>
    );
};

export default Home;
