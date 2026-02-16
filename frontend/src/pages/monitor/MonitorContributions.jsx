import React, { useState, useEffect } from 'react';
import Header from '../../components/dashboard/Header';
import { Plus, Users, Calendar, IndianRupee, Eye } from 'lucide-react';
import Button from '../../components/ui/Button';
import CreateContributionModal from '../../components/modals/CreateContributionModal';
import RequestDetailsModal from '../../components/modals/RequestDetailsModal';
import toast from 'react-hot-toast';
import Sidebar from '../../components/dashboard/Sidebar';

const MonitorContributions = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/contributions/monitor`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setRequests(data.data);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error('Failed to load contributions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col h-screen">
                <Header title="Manage Contributions" />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Actions */}
                        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800">Contribution Requests</h2>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center shadow-md shadow-blue-200 transition-colors font-bold"
                            >
                                <Plus size={18} className="mr-2" /> New Request
                            </button>
                        </div>

                        {/* List */}
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : requests.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                                <div className="mx-auto h-12 w-12 text-gray-400 mb-3">
                                    <IndianRupee size={48} />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No requests created yet</h3>
                                <p className="mt-1 text-gray-500">Create a new contribution request to start collecting funds.</p>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {requests.map((request) => (
                                    <div key={request._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{request.title}</h3>
                                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${request.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {request.status}
                                                </span>
                                            </div>

                                            <div className="space-y-3 mb-6">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <IndianRupee size={16} className="mr-2 text-blue-500" />
                                                    <span className="font-semibold">₹{request.amountPerStudent}</span> per student
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Calendar size={16} className="mr-2 text-blue-500" />
                                                    Due: {new Date(request.dueDate).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                                <div className="h-10 w-10 bg-gray-50 rounded-lg p-1 overflow-hidden border border-gray-200">
                                                    <img src={request.qrCodeImage.url} alt="QR" className="h-full w-full object-contain" />
                                                </div>

                                                <Button
                                                    onClick={() => setSelectedRequest(request)}
                                                    className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm flex items-center"
                                                >
                                                    <Eye size={16} className="mr-2" /> View Payments
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <CreateContributionModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreated={fetchRequests}
            />

            {/* DEBUG: Inline test modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">TEST MODAL - IT WORKS!</h2>
                        <p className="mb-4">If you can see this, the state is updating correctly.</p>
                        <button
                            onClick={() => setIsCreateModalOpen(false)}
                            className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold"
                        >
                            Close Test Modal
                        </button>
                    </div>
                </div>
            )}

            <RequestDetailsModal
                isOpen={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                request={selectedRequest}
            />
        </div>
    );
};

export default MonitorContributions;
