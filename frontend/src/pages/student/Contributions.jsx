import React from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import { Wallet, CheckCircle, ExternalLink, ShieldCheck, History, AlertCircle, ScanLine } from 'lucide-react';
import Button from '../../components/ui/Button';

const Contributions = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Header title="Contributions" />

                <main className="p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">

                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Hostel Contributions</h1>
                            <p className="text-gray-500">Contribute towards small hostel expenses managed by the monitor</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                            {/* Main Active Request Card */}
                            <div className="lg:col-span-2 space-y-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                    <h2 className="text-lg font-bold text-gray-900">Active Request</h2>
                                </div>

                                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-blue-50 relative overflow-hidden">
                                    {/* Background Decor */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full translate-x-1/3 -translate-y-1/3 opacity-50"></div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">
                                                    Payment Due
                                                </span>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Cleaning Supplies (Phenyl & Acid)</h3>
                                                <div className="flex gap-6 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <History className="h-4 w-4" /> Due: 10 Feb 2026
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <ShieldCheck className="h-4 w-4" /> By Monitor: Amit Deshmukh
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="bg-blue-50 px-6 py-4 rounded-2xl text-center">
                                                <p className="text-sm font-bold text-blue-600 mb-1">Amount Due</p>
                                                <p className="text-3xl font-extrabold text-blue-700">₹50</p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-6 mb-8">
                                            <p className="text-gray-600 leading-relaxed text-sm">
                                                Monthly contribution for hostel cleaning items for Feb 2026. This covers floor cleaners, toilet cleaners, and disinfectant sprays for all common areas.
                                            </p>
                                        </div>

                                        <div className="flex gap-4">
                                            <Button className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                                                <Wallet className="h-5 w-5" /> Pay Now
                                            </Button>
                                            <Button variant="outline" className="flex-1 py-3 border-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50 text-gray-700 font-bold rounded-xl flex items-center justify-center gap-2">
                                                <ScanLine className="h-5 w-5" /> Scan & Pay
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security & Trust Sidebar */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Security & Trust</h2>
                                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                            <ShieldCheck className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">Verified Monitor Only</h4>
                                            <p className="text-xs text-gray-500 mt-1">Only the designated hostel monitor can request contributions for hostel maintenance.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                                            <ExternalLink className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">Razorpay Secure</h4>
                                            <p className="text-xs text-gray-500 mt-1">All payments are processed securely via Razorpay gateway with transaction logging.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                                            <History className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">Full Transparency</h4>
                                            <p className="text-xs text-gray-500 mt-1">Every student can see the payment status, ensuring complete fairness in contributions.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Disclaimer Note */}
                                <div className="mt-6 bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3">
                                    <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                                    <div>
                                        <h5 className="text-xs font-bold text-orange-700 uppercase mb-1">Note</h5>
                                        <p className="text-xs text-orange-600 leading-relaxed">
                                            Contributions are voluntary and used strictly for hostel-related supplies not covered by standard funds.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Past Contributions */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <History className="h-5 w-5 text-gray-400" />
                                <h2 className="text-lg font-bold text-gray-900">Past Contributions</h2>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                {/* Item 1 */}
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">New Plastic Buckets (4 nos)</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">Transaction ID: TXN_9827345</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 font-bold uppercase mb-0.5">Date</p>
                                            <p className="text-sm font-medium text-gray-900">20 Jan 2026</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 font-bold uppercase mb-0.5">Amount</p>
                                            <p className="text-sm font-bold text-blue-600">₹120</p>
                                        </div>
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Paid</span>
                                    </div>
                                </div>

                                {/* Item 2 */}
                                <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Drinking Water Filter Repair</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">Transaction ID: TXN_9812644</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 font-bold uppercase mb-0.5">Date</p>
                                            <p className="text-sm font-medium text-gray-900">5 Jan 2026</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 font-bold uppercase mb-0.5">Amount</p>
                                            <p className="text-sm font-bold text-blue-600">₹30</p>
                                        </div>
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Paid</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default Contributions;
