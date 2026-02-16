import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const RequestDetailsModal = ({ isOpen, onClose, request }) => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
    const [selectedPayment, setSelectedPayment] = useState(null); // For image preview

    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contributions/${request._id}/payments`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setPayments(data.data);
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast.error('Failed to load payments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && request) {
            fetchPayments();
        }
    }, [isOpen, request]);

    const handleUpdateStatus = async (paymentId, status) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contributions/payments/${paymentId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                toast.success(`Payment marked as ${status}`);
                fetchPayments(); // Refresh list
                if (selectedPayment) setSelectedPayment(null); // Close preview
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Something went wrong');
        }
    };

    if (!isOpen || !request) return null;

    const filteredPayments = payments.filter(payment => {
        if (filter === 'all') return true;
        return payment.status === filter;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">Approved</span>;
            case 'rejected': return <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">Rejected</span>;
            default: return <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">Pending</span>;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{request.title}</h2>
                        <p className="text-sm text-gray-500">Total Payments: {payments.length}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex gap-2 overflow-x-auto">
                    {['all', 'pending', 'approved', 'rejected'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : filteredPayments.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No payments found with this filter.
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredPayments.map((payment) => (
                                <div key={payment._id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border border-gray-200"
                                            onClick={() => setSelectedPayment(payment)}
                                        >
                                            <img src={payment.screenshot.url} alt="Proof" className="h-full w-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">
                                                {payment.student?.firstName} {payment.student?.lastName}
                                            </h3>
                                            <p className="text-sm text-gray-500">Room: {payment.student?.roomNumber || 'N/A'}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(payment.submittedAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="flex flex-col items-end gap-2">
                                            {getStatusBadge(payment.status)}
                                            {payment.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStatus(payment._id, 'approved')}
                                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(payment._id, 'rejected')}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={20} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Image Preview Overlay */}
            {selectedPayment && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4" onClick={() => setSelectedPayment(null)}>
                    <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
                        <img
                            src={selectedPayment.screenshot.url}
                            alt="Payment Screenshot"
                            className="max-h-[80vh] w-auto object-contain rounded-lg"
                        />
                        <div className="mt-4 flex gap-4" onClick={(e) => e.stopPropagation()}>
                            {selectedPayment.status === 'pending' && (
                                <>
                                    <Button
                                        onClick={() => handleUpdateStatus(selectedPayment._id, 'approved')}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold"
                                    >
                                        Approve Payment
                                    </Button>
                                    <Button
                                        onClick={() => handleUpdateStatus(selectedPayment._id, 'rejected')}
                                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold"
                                    >
                                        Reject Payment
                                    </Button>
                                </>
                            )}
                            <button
                                onClick={() => setSelectedPayment(null)}
                                className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-bold backdrop-blur-sm transition-colors"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestDetailsModal;
