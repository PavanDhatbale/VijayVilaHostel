import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, IndianRupee, Calendar } from 'lucide-react';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const CreateContributionModal = ({ isOpen, onClose, onCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [qrCode, setQrCode] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    // Logs for debugging
    React.useEffect(() => {
        console.log('CreateContributionModal: isOpen changed to', isOpen);
    }, [isOpen]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setQrCode(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !amount || !dueDate || !qrCode) {
            toast.error('Please fill all required fields and upload QR code');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('amountPerStudent', amount);
        formData.append('dueDate', dueDate);
        formData.append('qrCode', qrCode);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contributions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Contribution request created successfully');
                onCreated();
                onClose();
                // Reset form
                setTitle('');
                setDescription('');
                setAmount('');
                setDueDate('');
                setQrCode(null);
                setPreviewUrl(null);
            } else {
                toast.error(data.message || 'Failed to create request');
            }
        } catch (error) {
            console.error('Error creating request:', error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-left">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative z-[10000]">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="text-xl font-bold text-gray-900">Create Contribution Request</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <p className="text-sm text-gray-500">A notification will be sent to all students' dashboards.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Purpose of Contribution *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                            placeholder="e.g. Bathroom Cleaning Supplies"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Amount per Student *</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                    placeholder="50"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Due Date *</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none h-24 placeholder:text-gray-400 bg-gray-50/50"
                            placeholder="Briefly explain why this contribution is needed..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Upload QR Code *</label>
                        <p className="text-xs text-gray-500 mb-2">Students will scan this QR to pay.</p>
                        <div className="flex flex-col items-center justify-center px-6 py-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-400 transition-colors bg-gray-50/50">
                            {previewUrl ? (
                                <div className="relative text-center w-full">
                                    <img src={previewUrl} alt="QR Preview" className="mx-auto h-40 object-contain rounded-lg shadow-sm" />
                                    <button
                                        type="button"
                                        onClick={() => { setQrCode(null); setPreviewUrl(null); }}
                                        className="mt-3 text-sm text-red-500 font-medium hover:text-red-700 underline"
                                    >
                                        Remove & Upload Different
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-blue-50 p-3 rounded-full mb-3">
                                        <Upload className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">Click to upload QR Code</div>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        title="Upload QR Code"
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-lg shadow-blue-200 transition-all font-bold flex items-center justify-center disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating...
                                </span>
                            ) : (
                                'Create Request'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default CreateContributionModal;
