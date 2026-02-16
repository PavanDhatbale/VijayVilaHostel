import React, { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import { PieChart, Plus, CheckCircle, Clock, Wallet, QrCode, Eye, MoreVertical, Search, Filter, History as HistoryIcon } from 'lucide-react';

const MonitorContributions = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const stats = [
        { label: 'Total Collected', value: '₹2,280', icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-500' },
        { label: 'Completed Requests', value: '08', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-500' },
        { label: 'Active Requests', value: '01', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-500' },
    ];

    const activeRequest = {
        title: 'Cleaning Supplies (Phenyl & Acid)',
        description: 'Monthly contribution for hostel cleaning items for Feb 2026.',
        amount: '50',
        paidCount: 12,
        totalCount: 14,
        dueDate: '10 Feb 2026',
        totalGoal: '700'
    };

    const students = [
        { id: 1, name: 'Rahul Sharma', room: '2A', status: 'Paid', date: '2026-02-02' },
        { id: 2, name: 'Amit Verma', room: '1B', status: 'Paid', date: '2026-02-03' },
        { id: 3, name: 'Sagar Patil', room: '3C', status: 'Pending', date: '-' },
        { id: 4, name: 'Kunal Patil', room: '2B', status: 'Paid', date: '2026-02-01' },
        { id: 5, name: 'Omkar Gade', room: '1A', status: 'Pending', date: '-' },
        { id: 6, name: 'Pratik Joshi', room: '4A', status: 'Paid', date: '2026-02-02' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Header title="Student Contributions" />

                <main className="p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* Page Header */}
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">Student Contributions</h1>
                                <p className="text-gray-500">Manage hostel item contributions and track payments</p>
                            </div>
                            <button className="flex items-center gap-3 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
                                <Plus size={20} />
                                Create New Request
                            </button>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className={`bg-white p-8 rounded-3xl border-l-[6px] border border-gray-100 shadow-sm flex items-center gap-6 ${stat.border}`}>
                                    <div className={`${stat.bg} ${stat.color} h-16 w-16 rounded-2xl flex items-center justify-center shadow-inner`}>
                                        <stat.icon size={28} />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 font-bold text-sm mb-1">{stat.label}</p>
                                        <p className="text-3xl font-black text-gray-900 leading-none">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Active Requests Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                Active Requests
                            </h2>
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-2xl relative overflow-hidden group">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-4">
                                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Active</span>
                                            <h3 className="text-2xl font-black text-gray-900 pr-20">{activeRequest.title}</h3>
                                            <p className="text-gray-500 text-sm">{activeRequest.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-4xl font-black text-blue-600">₹{activeRequest.amount}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">per student</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end font-bold text-sm">
                                            <span className="text-gray-500">Collection Progress</span>
                                            <span className="text-gray-900">{activeRequest.paidCount}/{activeRequest.totalCount} Students Paid</span>
                                        </div>
                                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                                                style={{ width: `${(activeRequest.paidCount / activeRequest.totalCount) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Due Date</p>
                                            <p className="font-bold text-gray-900">{activeRequest.dueDate}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Total Goal</p>
                                            <p className="font-bold text-gray-900">₹{activeRequest.totalGoal}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-2">
                                        <button className="flex-1 bg-white border border-gray-200 text-gray-900 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
                                            <QrCode size={18} />
                                            Share QR
                                        </button>
                                        <button className="flex-1 bg-gray-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg">
                                            <Eye size={18} />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Student Payment Status Table */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Student Payment Status</h2>
                                    <p className="text-sm text-gray-400 font-medium">Track individual student payments for current active request</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search student..."
                                            className="bg-gray-50 border-none rounded-xl py-2.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        />
                                    </div>
                                    <button className="p-2.5 text-gray-400 hover:text-gray-600 transition-colors">
                                        <Filter size={20} />
                                    </button>
                                </div>
                            </div>
                            <table className="w-full">
                                <thead className="bg-gray-50/50 text-left">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Name</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Room</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Date</th>
                                        <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {students.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-4 whitespace-nowrap">
                                                <span className="font-bold text-gray-900">{student.name}</span>
                                            </td>
                                            <td className="px-8 py-4 whitespace-nowrap">
                                                <span className="font-bold text-gray-400">{student.room}</span>
                                            </td>
                                            <td className="px-8 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold ${student.status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                                    }`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-400">{student.date}</span>
                                            </td>
                                            <td className="px-8 py-4 whitespace-nowrap text-center">
                                                <button className="text-gray-400 hover:text-gray-900">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Contribution History */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <HistoryIcon className="h-5 w-5 text-gray-400" />
                                Contribution History
                            </h2>
                            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between hover:border-blue-100 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-5">
                                    <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">New Plastic Buckets (4 nos)</h4>
                                        <p className="text-xs text-gray-400 font-medium">Collected on January 2026</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-12 text-center">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Total</p>
                                        <p className="font-black text-gray-900">₹1680</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Students</p>
                                        <p className="font-black text-gray-900 text-lg">14/14</p>
                                    </div>
                                    <div className="text-gray-300 group-hover:text-blue-600 transition-colors">
                                        <Eye size={20} />
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

export default MonitorContributions;
