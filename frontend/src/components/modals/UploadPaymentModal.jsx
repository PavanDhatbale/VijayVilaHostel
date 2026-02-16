import React, { useState } from 'react';
import { X, Upload, IndianRupee } from 'lucide-react';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const UploadPaymentModal = ({ isOpen, onClose, request, onUploaded }) => {
    const [screenshot, setScreenshot] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setScreenshot(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!screenshot) {
            toast.error('Please upload payment screenshot');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('requestId', request._id);
        formData.append('screenshot', screenshot);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contributions/payments/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Payment submitted for verification');
                onUploaded();
                onClose();
                setScreenshot(null);
                setPreviewUrl(null);
            } else {
                toast.error(data.message || 'Failed to submit payment');
            }
        } catch (error) {
            console.error('Error uploading payment:', error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !request) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Upload Payment Proof</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-blue-600 font-medium">Amount to Pay</span>
                            <span className="text-xl font-bold text-blue-800 flex items-center">
                                <IndianRupee size={18} /> {request.amountPerStudent}
                            </span>
                        </div>
                        <p className="text-xs text-blue-500">Scan the QR code on the dashboard to pay.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Screenshot *</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-400 transition-colors bg-gray-50">
                                <div className="space-y-1 text-center">
                                    {previewUrl ? (
                                        <div className="relative">
                                            <img src={previewUrl} alt="Preview" className="mx-auto h-48 object-contain" />
                                            <button
                                                type="button"
                                                onClick={() => { setScreenshot(null); setPreviewUrl(null); }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600 justify-center">
                                                <label htmlFor="screenshot-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                    <span>Upload Screenshot</span>
                                                    <input id="screenshot-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                                </label>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">Screenshots from UPI apps (GPay, PhonePe, etc)</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading || !screenshot}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-lg shadow-blue-200 transition-all font-bold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Submitting...
                                </span>
                            ) : (
                                'Submit Payment'
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadPaymentModal;
