import React, { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';

const HostelLocationView = () => {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        fetchLocation();
    }, []);

    const fetchLocation = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/hostel-location`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data && data.hostelName) {
                    setLocation(data);
                }
            }
        } catch (error) {
            console.error('Error fetching location:', error);
            // Don't show toast error on simple view to avoid annoyance if not set
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500 italic">Loading location details...</div>;
    }

    if (!location) {
        return (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <MapPin size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Location Not Set</h3>
                <p className="text-gray-500">Hostel location details have not been updated yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Hostel Location</h2>
                        <p className="text-sm text-gray-500">Find us here</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Address Details */}
                <div className="p-8 lg:border-r border-gray-100 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{location.hostelName}</h3>

                    <div className="space-y-4 mb-8">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Address</p>
                            <p className="text-gray-700 font-medium leading-relaxed">{location.address}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">City</p>
                                <p className="text-gray-900 font-semibold">{location.city}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pincode</p>
                                <p className="text-gray-900 font-semibold">{location.pincode}</p>
                            </div>
                        </div>

                        {location.landmark && (
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Landmark</p>
                                <p className="text-blue-600 font-medium">{location.landmark}</p>
                            </div>
                        )}
                    </div>

                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                    >
                        <Navigation size={18} /> Open in Google Maps
                    </a>
                </div>

                {/* Map Embed */}
                <div className="lg:col-span-2 h-[400px] lg:h-auto bg-gray-100 relative">
                    <iframe
                        src={location.mapEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="absolute inset-0"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default HostelLocationView;
