import React, { useState, useEffect } from 'react';
import Header from '../../components/dashboard/Header';
import { IndianRupee, Calendar, CheckCircle, Clock, AlertCircle, Upload } from 'lucide-react';
import Button from '../../components/ui/Button';
import UploadPaymentModal from '../../components/modals/UploadPaymentModal';
import toast from 'react-hot-toast';

const StudentContributions = () => {
    const [activeRequests, setActiveRequests] = useState([]);
    const [myStatus, setMyStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadModalRequest, setUploadModalRequest] = useState(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

            const [requestsRes, statusRes] = await Promise.all([
                fetch(`${API_BASE_URL}/contributions/active`, { headers }),
                fetch(`${API_BASE_URL}/contributions/payments/my-status`, { headers })
            ]);

            const requestsData = await requestsRes.json();
            const statusData = await statusRes.json();

            if (requestsRes.ok && statusRes.ok) {
                setActiveRequests(requestsData.data);
                setMyStatus(statusData.data);
            }
        } catch (error) {
            console.error('Error fetching contribution data:', error);
            toast.error('Failed to load contributions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getPaymentStatus = (requestId) => {
        const statusRecord = myStatus.find(s => s.contributionRequest._id === requestId || s.contributionRequest === requestId);
        return statusRecord ? statusRecord.status : null;
    };

    const isPaid = (requestId) => {
        const record = myStatus.find(s => s.contributionRequest._id === requestId || s.contributionRequest === requestId);
        return record && (record.status === 'pending' || record.status === 'approved');
    };

    const getRejectionRemark = (requestId) => {
        const record = myStatus.find(s => s.contributionRequest._id === requestId || s.contributionRequest === requestId);
        return record?.status === 'rejected' ? record.remarks : null;
    };

    const renderStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"><CheckCircle size={14} className="mr-1.5" /> Paid & Verified</span>;
            case 'pending':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"><Clock size={14} className="mr-1.5" /> Verification Pending</span>;
            case 'rejected':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"><AlertCircle size={14} className="mr-1.5" /> Rejected - Re-upload</span>;
            default:
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">Unpaid</span>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header title="My Contributions" />

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto space-y-8">

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : activeRequests.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                                <div className="mx-auto h-16 w-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-4">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">All Caught Up!</h3>
                                <p className="text-gray-500 mt-2">There are no active contribution requests at the moment.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {activeRequests.map(request => {
                                    const status = getPaymentStatus(request._id);
                                    const rejectionRemark = getRejectionRemark(request._id);

                                    return (
                                        <div key={request._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                                            <div className="p-6 sm:p-8">
                                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{request.title}</h3>
                                                        <p className="text-gray-600 text-sm leading-relaxed">{request.description}</p>
                                                    </div>
                                                    {renderStatusBadge(status)}
                                                </div>

                                                {/* Details Grid */}
                                                <div className="grid md:grid-cols-2 gap-8 items-start">
                                                    <div className="space-y-4">
                                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                                            <div className="text-sm text-blue-600 font-medium mb-1">Amount Due</div>
                                                            <div className="text-2xl font-bold text-blue-800 flex items-center">
                                                                <IndianRupee size={20} /> {request.amountPerStudent}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Calendar size={18} className="mr-2 text-gray-400" />
                                                            Due by: <span className="font-medium text-gray-900 ml-1">{new Date(request.dueDate).toLocaleDateString()}</span>
                                                        </div>

                                                        {status === 'rejected' && (
                                                            <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-sm text-red-700">
                                                                <span className="font-bold">Rejection Reason:</span> {rejectionRemark}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* QR Code Section */}
                                                    <div className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Scan to Pay</p>
                                                        <div className="bg-white p-2 rounded-lg shadow-sm mb-3">
                                                            <img src={request.qrCodeImage.url} alt="QR Code" className="h-32 w-32 object-contain" />
                                                        </div>

                                                        {(!status || status === 'rejected') ? (
                                                            <Button
                                                                onClick={() => setUploadModalRequest(request)}
                                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold shadow-md shadow-blue-200"
                                                            >
                                                                <Upload size={16} className="mr-2 inline" />
                                                                {status === 'rejected' ? 'Re-upload Proof' : 'Upload Payment Proof'}
                                                            </Button>
                                                        ) : (
                                                            <p className="text-sm font-medium text-gray-400 flex items-center">
                                                                <CheckCircle size={16} className="mr-1.5" /> Payment Submitted
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <UploadPaymentModal
                isOpen={!!uploadModalRequest}
                onClose={() => setUploadModalRequest(null)}
                request={uploadModalRequest}
                onUploaded={fetchData}
            />
        </div>
    );
};

export default StudentContributions;
