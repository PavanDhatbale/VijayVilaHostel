import React, { useState, useEffect } from 'react';
import { MapPin, Save, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const HostelLocationForm = () => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        hostelName: '',
        address: '',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '',
        landmark: '',
        latitude: '',
        longitude: '',
        mapEmbedUrl: ''
    });

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        fetchLocation();
    }, []);

    const fetchLocation = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/hostel-location`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                if (data && data.hostelName) {
                    setFormData({
                        hostelName: data.hostelName || '',
                        address: data.address || '',
                        city: data.city || 'Pune',
                        state: data.state || 'Maharashtra',
                        pincode: data.pincode || '',
                        landmark: data.landmark || '',
                        latitude: data.latitude || '',
                        longitude: data.longitude || '',
                        mapEmbedUrl: data.mapEmbedUrl || ''
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching location:', error);
            toast.error('Failed to load location data');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        if (!formData.mapEmbedUrl.includes('google.com/maps/embed')) {
            toast.error('Please enter a valid Google Maps Embed URL');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/hostel-location`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Hostel location updated successfully!');
            } else {
                toast.error(data.message || 'Failed to update location');
            }
        } catch (error) {
            console.error('Error updating location:', error);
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="p-8 text-center text-gray-500">Loading location details...</div>;
    }

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Hostel Location Settings</h2>
                        <p className="text-sm text-gray-500">Manage hostel address and map location</p>
                    </div>
                </div>
            </div>

            <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Hostel Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Hostel Name</label>
                            <input
                                type="text"
                                name="hostelName"
                                value={formData.hostelName}
                                onChange={handleChange}
                                placeholder="e.g. Vijay Vila Hostel"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-medium"
                                required
                            />
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Street address, building name, etc."
                                rows="3"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-medium resize-none"
                                required
                            ></textarea>
                        </div>

                        {/* City & State */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-medium"
                            />
                        </div>

                        {/* Pincode & Landmark */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Pincode</label>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="e.g. 411030"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-medium"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Landmark</label>
                            <input
                                type="text"
                                name="landmark"
                                value={formData.landmark}
                                onChange={handleChange}
                                placeholder="e.g. Near SP College"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-medium"
                            />
                        </div>

                        {/* Lat & Long */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Latitude</label>
                            <input
                                type="number"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                                step="any"
                                placeholder="e.g. 18.5204"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-medium"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Longitude</label>
                            <input
                                type="number"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleChange}
                                step="any"
                                placeholder="e.g. 73.8567"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-medium"
                                required
                            />
                        </div>

                        {/* Map Embed URL */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Google Maps Embed URL (SRC only)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Globe className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="mapEmbedUrl"
                                    value={formData.mapEmbedUrl}
                                    onChange={handleChange}
                                    placeholder="https://www.google.com/maps/embed?pb=..."
                                    className="w-full pl-10 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-medium"
                                    required
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                                Go to Google Maps {'>'} Share {'>'} Embed a map {'>'} Copy HTML {'>'} Extract the URL inside src="..."
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">Saving...</span>
                            ) : (
                                <>
                                    <Save size={18} /> Save Location Details
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HostelLocationForm;
