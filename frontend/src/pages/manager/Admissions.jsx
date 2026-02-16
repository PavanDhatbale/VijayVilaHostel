import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import {
    Search,
    Filter,
    Check,
    X,
    Clock,
    CreditCard,
    Calendar,
    GraduationCap,
    FileText,
    UserCheck,
    Users,
    ChevronDown,
    Eye,
    MapPin,
    Briefcase,
    Heart,
    Trash
} from 'lucide-react';
import toast from 'react-hot-toast';

const Admissions = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        fetchAdmissions();
    }, []);

    // ... (fetchAdmissions, handleApprove, handleReject remain the same)

    const fetchAdmissions = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/admission`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setAdmissions(data);
            } else {
                toast.error(data.message || 'Failed to fetch admissions');
            }
        } catch (error) {
            toast.error('Error connecting to server');
        } finally {
            setLoading(false);
        }
    };

    const [actionModal, setActionModal] = useState({ isOpen: false, type: null, appId: null });
    const [managerMessage, setManagerMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ... (fetchAdmissions remains the same)

    const openActionModal = (type, appId) => {
        setActionModal({ isOpen: true, type, appId });
        setManagerMessage('');
    };

    const closeActionModal = () => {
        setActionModal({ isOpen: false, type: null, appId: null });
        setManagerMessage('');
        setIsSubmitting(false);
    };

    const handleActionSubmit = async () => {
        if (!managerMessage.trim()) {
            toast.error('Please enter a message for the student');
            return;
        }

        const { type, appId } = actionModal;
        const endpoint = type === 'approve' ? 'approve' : 'reject';
        const body = type === 'approve'
            ? { managerMessage }
            : { rejectionReason: managerMessage, managerMessage }; // Using same message for reason if rejecting

        try {
            setIsSubmitting(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/admission/${appId}/${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            const data = await response.json();

            if (response.ok) {
                toast.success(`Admission ${type}d successfully`);
                // Optimistic update
                setAdmissions(prev => prev.map(app =>
                    app._id === appId ? {
                        ...app,
                        status: type === 'approve' ? 'approved' : 'rejected',
                        managerMessage: managerMessage,
                        isAcceptedByStudent: false
                    } : app
                ));
                if (selectedApp?._id === appId) setSelectedApp(null);
                closeActionModal();
            } else {
                toast.error(data.message || 'Action failed');
            }
        } catch (error) {
            toast.error('Server error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAdmission = async (appId) => {
        if (!window.confirm('Are you sure you want to delete this admission? This action cannot be undone.')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/admission/${appId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (response.ok) {
                toast.success('Admission deleted successfully');
                setAdmissions(prev => prev.filter(app => app._id !== appId));
                if (selectedApp?._id === appId) setSelectedApp(null);
            } else {
                toast.error(data.message || 'Failed to delete admission');
            }
        } catch (error) {
            toast.error('Server error');
        }
    };

    const filteredAdmissions = admissions.filter(app => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;

        const matchesSearch = (
            (app.personalDetails?.fullName?.toLowerCase() || '').includes(query) ||
            (app.personalDetails?.email?.toLowerCase() || '').includes(query) ||
            (app.personalDetails?.contact || '').includes(query) ||
            (app.user?.name?.toLowerCase() || '').includes(query) ||
            (app.user?.email?.toLowerCase() || '').includes(query)
        );

        const matchesFilter = statusFilter === 'All Status' || (app.status?.toLowerCase() || '') === statusFilter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    const stats = [
        { label: 'Pending Applications', value: admissions.filter(a => a.status === 'pending').length, color: 'text-orange-600', border: 'border-orange-100' },
        { label: 'Approved', value: admissions.filter(a => a.status === 'approved').length, color: 'text-green-600', border: 'border-green-100' },
        { label: 'Rejected', value: admissions.filter(a => a.status === 'rejected').length, color: 'text-red-600', border: 'border-red-100' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Header title="Admissions Management" />

                <main className="p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">

                        <div>
                            <h1 className="text-3xl font-semibold text-[#111827] mb-1">Admissions Management</h1>
                            <p className="text-gray-500 font-medium font-inter">Review and approve student applications</p>
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-700 shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="relative md:w-48 group">
                                <select
                                    className="w-full pl-4 pr-10 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-700 shadow-sm appearance-none cursor-pointer"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option>All Status</option>
                                    <option>Pending</option>
                                    <option>Approved</option>
                                    <option>Rejected</option>
                                </select>
                                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors" />
                            </div>
                        </div>

                        {/* Summary Stats cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className={`bg-white p-8 rounded-3xl border ${stat.border} shadow-sm hover:shadow-md transition-all duration-300`}>
                                    <p className="text-gray-400 font-semibold text-sm mb-3 uppercase tracking-wider">{stat.label}</p>
                                    <h3 className={`text-5xl font-semibold ${stat.color} tracking-tighter`}>{stat.value}</h3>
                                </div>
                            ))}
                        </div>

                        {/* Application Cards List */}
                        <div className="space-y-6 pb-8">
                            {loading ? (
                                <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100">
                                    <p className="text-gray-500 font-medium">Loading applications...</p>
                                </div>
                            ) : filteredAdmissions.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100">
                                    <p className="text-gray-500 font-medium">No applications found matching your criteria.</p>
                                </div>
                            ) : filteredAdmissions.map((app) => (
                                <div key={app._id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                                    <div className="p-8">
                                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                                            {/* Profile Section */}
                                            <div className="flex gap-6 items-center lg:w-[350px]">
                                                <div className="h-24 w-24 rounded-2xl overflow-hidden shadow-sm border-4 border-gray-50 flex-shrink-0 bg-blue-50 flex items-center justify-center">
                                                    {app.image ? (
                                                        <img src={app.image} alt={app.personalDetails.fullName} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <FileText size={32} className="text-blue-200" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-semibold text-gray-900 leading-tight mb-1">{app.personalDetails.fullName}</h4>
                                                    <div className="space-y-1 text-gray-400 font-semibold text-xs uppercase tracking-tight">
                                                        <p>Age: {app.personalDetails.age}</p>
                                                        <p>{app.personalDetails.contact}</p>
                                                        <p className="lowercase normal-case">{app.personalDetails.email}</p>
                                                    </div>
                                                    <div className="mt-2 text-wrap">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${app.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                            app.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' :
                                                                'bg-red-50 text-red-600 border-red-100'
                                                            }`}>
                                                            {app.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Details Section */}
                                            <div className="flex-1 grid grid-cols-2 gap-y-6 gap-x-12">
                                                <div>
                                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                        <GraduationCap size={12} /> EXAM PREPARING FOR
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-700">{app.educationDetails.examFocus}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">COURSE</p>
                                                    <p className="text-sm font-semibold text-gray-700">{app.educationDetails.course}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5" title="Annual Income">
                                                        <CreditCard size={12} /> FAMILY INCOME
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-700">{app.familyDetails.annualIncome}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                        <FileText size={12} /> ACADEMICS
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-700">10th: {app.educationDetails.tenthScore} | 12th: {app.educationDetails.twelfthScore}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                        <Calendar size={12} /> APPLIED DATE
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-700">{new Date(app.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                        <UserCheck size={12} /> STATUS INFO
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-700">
                                                        {app.status === 'pending' ? 'Awaiting review' :
                                                            app.status === 'approved' ? `Approved on ${new Date(app.reviewedAt).toLocaleDateString()}` :
                                                                `Rejected: ${app.rejectionReason}`}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Actions Section */}
                                            <div className="flex flex-col gap-3 lg:w-48 w-full">
                                                <button
                                                    onClick={() => setSelectedApp(app)}
                                                    className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-3 px-6 rounded-2xl font-bold border border-blue-100 hover:bg-blue-100 transition-colors group"
                                                >
                                                    <Eye size={20} className="group-hover:scale-110 transition-transform" />
                                                    View
                                                </button>
                                                {app.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => openActionModal('approve', app._id)}
                                                            className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-2xl font-bold shadow-lg shadow-green-100 hover:scale-[1.02] transition-transform active:scale-95 group"
                                                        >
                                                            <Check size={20} className="group-hover:scale-110 transition-transform" />
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => openActionModal('reject', app._id)}
                                                            className="flex items-center justify-center gap-2 bg-white text-red-600 border-2 border-red-50 py-3 px-6 rounded-2xl font-bold hover:bg-red-50 transition-colors group"
                                                        >
                                                            <X size={20} className="group-hover:rotate-90 transition-transform" />
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {app.status === 'rejected' && (
                                                    <button
                                                        onClick={() => handleDeleteAdmission(app._id)}
                                                        className="flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 px-6 rounded-2xl font-bold hover:bg-red-100 transition-colors group"
                                                    >
                                                        <Trash size={20} className="group-hover:scale-110 transition-transform" />
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </main>
            </div>

            {/* Application Details Modal */}
            {selectedApp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                                    <FileText size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">Application Details</h2>
                                    <p className="text-gray-500 font-medium tracking-tight">Viewing full application for {selectedApp.personalDetails.fullName}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="h-12 w-12 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center shdaow-sm"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Left Column: Personal & Family */}
                                <div className="space-y-10">
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                                <Users size={18} />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider text-sm">Personal Info</h3>
                                        </div>
                                        <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
                                            <DetailItem label="Full Name" value={selectedApp.personalDetails.fullName} />
                                            <DetailItem label="Email Address" value={selectedApp.personalDetails.email} />
                                            <DetailItem label="Contact Number" value={selectedApp.personalDetails.contact} />
                                            <DetailItem label="Age" value={selectedApp.personalDetails.age} />
                                            <DetailItem label="Full Address" value={selectedApp.personalDetails.address} />
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                                <Heart size={18} />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider text-sm">Family Details</h3>
                                        </div>
                                        <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
                                            <DetailItem label="Father's Occupation" value={selectedApp.familyDetails?.fatherOccupation} />
                                            <DetailItem label="Annual Income" value={selectedApp.familyDetails?.annualIncome} />
                                            <DetailItem label="Financial Need" value={selectedApp.familyDetails?.financialNeed} />
                                        </div>
                                    </section>
                                </div>

                                {/* Right Column: Education & Docs */}
                                <div className="space-y-10">
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                                <GraduationCap size={18} />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider text-sm">Academic Profile</h3>
                                        </div>
                                        <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
                                            <DetailItem label="Exam Focus" value={selectedApp.educationDetails.examFocus} />
                                            <DetailItem label="College/Course" value={selectedApp.educationDetails.course} />
                                            <DetailItem label="10th Percentage" value={`${selectedApp.educationDetails.tenthScore}%`} />
                                            <DetailItem label="12th Percentage" value={`${selectedApp.educationDetails.twelfthScore}%`} />
                                        </div>
                                    </section>

                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                                                <FileText size={18} />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider text-sm">Application Status</h3>
                                        </div>
                                        <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
                                            <DetailItem label="Current Status" value={selectedApp.status.toUpperCase()} />
                                            <DetailItem label="Applied On" value={new Date(selectedApp.createdAt).toLocaleDateString()} />
                                            {selectedApp.status === 'rejected' && (
                                                <DetailItem label="Rejection Reason" value={selectedApp.rejectionReason} />
                                            )}
                                        </div>
                                    </section>
                                    <section>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                                                <FileText size={18} />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider text-sm">Documents</h3>

                                        </div>
                                        <div className="bg-gray-50 rounded-3xl p-6 grid grid-cols-2 gap-4">
                                            <DocumentLink label="10th Marksheet" path={selectedApp.documents?.tenthMarksheet} />
                                            <DocumentLink label="12th Marksheet" path={selectedApp.documents?.twelfthMarksheet} />
                                            <DocumentLink label="Income Cert." path={selectedApp.documents?.incomeCertificate} />
                                            <DocumentLink label="Aadhaar Card" path={selectedApp.documents?.aadhaarCard} />
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        {selectedApp.status === 'pending' && (
                            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-4">
                                <button
                                    onClick={() => openActionModal('reject', selectedApp._id)}
                                    className="px-8 py-3 rounded-2xl font-bold bg-white text-red-600 border-2 border-red-50 hover:bg-red-50 transition-all flex items-center gap-2"
                                >
                                    <X size={20} /> Reject
                                </button>
                                <button
                                    onClick={() => openActionModal('approve', selectedApp._id)}
                                    className="px-8 py-3 rounded-2xl font-bold bg-green-600 text-white shadow-lg shadow-green-100 hover:scale-[1.02] transition-all flex items-center gap-2"
                                >
                                    <Check size={20} /> Approve Admission
                                </button>
                            </div>
                        )}
                        {selectedApp.status === 'rejected' && (
                            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex items-center justify-end gap-4">
                                <button
                                    onClick={() => handleDeleteAdmission(selectedApp._id)}
                                    className="px-8 py-3 rounded-2xl font-bold bg-white text-red-600 border-2 border-red-50 hover:bg-red-50 transition-all flex items-center gap-2"
                                >
                                    <Trash size={20} /> Delete Admission
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Action Confirmation Modal */}
            {actionModal.isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className={`p-6 border-b ${actionModal.type === 'approve' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'} flex items-center gap-4`}>
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${actionModal.type === 'approve' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {actionModal.type === 'approve' ? <Check size={24} /> : <X size={24} />}
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold ${actionModal.type === 'approve' ? 'text-green-800' : 'text-red-800'}`}>
                                    {actionModal.type === 'approve' ? 'Approve Admission' : 'Reject Admission'}
                                </h3>
                                <p className="text-gray-500 text-sm font-medium">Send a message to the student</p>
                            </div>
                        </div>

                        <div className="p-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Manager's Message <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={managerMessage}
                                onChange={(e) => setManagerMessage(e.target.value)}
                                placeholder={actionModal.type === 'approve'
                                    ? "e.g., Congratulations! Your admission is confirmed. Please proceed to payment."
                                    : "e.g., We regret to inform you that all seats are currently full."}
                                className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-700 resize-none"
                                autoFocus
                            ></textarea>
                            <p className="text-xs text-gray-400 mt-2 font-medium">
                                This message will be displayed on the student's dashboard status card.
                            </p>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={closeActionModal}
                                className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleActionSubmit}
                                disabled={isSubmitting}
                                className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center gap-2 ${actionModal.type === 'approve'
                                    ? 'bg-green-600 hover:bg-green-700 shadow-green-200'
                                    : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        {actionModal.type === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailItem = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-gray-900 font-semibold">{value || 'Not provided'}</p>
    </div>
);

const DocumentLink = ({ label, path }) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    if (!path) return (
        <div className="p-3 bg-white border border-gray-100 rounded-xl opacity-50">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
            <p className="text-gray-400 text-xs italic">Not uploaded</p>
        </div>
    );

    let docUrl = null;
    let isCloudinary = false;

    // Handle Object Structure (Cloudinary)
    if (typeof path === 'object') {
        if (path.url) {
            docUrl = path.url;
            isCloudinary = true;
        } else {
            // Fallback
            return (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{label}</p>
                    <p className="text-red-500 text-xs italic">Invalid Format</p>
                </div>
            );
        }
    }
    // Handle String Structure (Legacy or direct URL)
    else if (typeof path === 'string') {
        if (path === '[object Object]') {
            return (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{label}</p>
                    <p className="text-red-500 text-xs italic">File Error</p>
                </div>
            );
        }
        docUrl = path;
        if (docUrl.startsWith('http')) {
            isCloudinary = true;
        }
    }

    if (!docUrl) return null;

    // Determine the full URL
    let fullUrl;
    if (isCloudinary) {
        fullUrl = docUrl;
    } else {
        // It's a local path, prepend base URL (stripping /api if needed)
        const FILE_BASE_URL = API_BASE_URL.replace('/api', '');
        fullUrl = `${FILE_BASE_URL}/${docUrl}`;
    }

    return (
        <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all group block"
        >
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500">{label}</p>
            <div className="flex items-center gap-1.5 mt-1">
                <FileText size={14} className="text-blue-600" />
                <span className="text-blue-600 text-xs font-bold">View Document</span>
            </div>
        </a>
    );
};

export default Admissions;
