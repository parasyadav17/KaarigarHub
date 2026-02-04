import React, { useEffect, useState } from 'react';
import { getAdminStats, deleteUser, deleteMessage } from '../../services/admin';
import toast from 'react-hot-toast';
import { Users, Briefcase, UserCheck, Activity, Trash2, MessageSquare } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("users");

    const fetchStats = async () => {
        try {
            const response = await getAdminStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            toast.error("Failed to load admin stats");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(id);
                toast.success("User deleted successfully");
                fetchStats();
            } catch (error) {
                toast.error("Failed to delete user");
            }
        }
    };

    const handleDeleteMessage = async (id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                await deleteMessage(id);
                toast.success("Message deleted successfully");
                fetchStats();
            } catch (error) {
                toast.error("Failed to delete message");
            }
        }
    };

    if (loading) return <div className="text-center py-20 text-xl font-bold text-gray-500">Loading Dashboard...</div>;

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-4xl font-black mb-2 tracking-tight">Admin Control Center</h1>
                    <p className="text-violet-100 text-lg font-medium opacity-90">Overview of system performance and user metrics.</p>
                </div>
                <div className="absolute right-0 top-0 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 animate-blob"></div>
                <div className="absolute left-0 bottom-0 w-64 h-64 bg-fuchsia-500 opacity-20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 animate-blob animation-delay-2000"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Users", val: stats?.totalUsers || 0, icon: <Users size={24} />, color: "bg-blue-500" },
                    { label: "Workers", val: stats?.totalWorkers || 0, icon: <UserCheck size={24} />, color: "bg-emerald-500" },
                    { label: "Contractors", val: stats?.totalContractors || 0, icon: <Briefcase size={24} />, color: "bg-violet-500" },
                    { label: "Active Enquiries", val: stats?.allMessages?.length || 0, icon: <MessageSquare size={24} />, color: "bg-pink-500" },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all border border-gray-100 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <span className={`text-2xl font-black ${stat.color.replace('bg-', 'text-')}`}>{stat.val}</span>
                        </div>
                        <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wider">{stat.label}</h3>
                    </div>
                ))}
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-4 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === "users" ? "bg-violet-600 text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"}`}
                    >
                        User Directory
                    </button>
                    <button
                        onClick={() => setActiveTab("jobs")}
                        className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === "jobs" ? "bg-violet-600 text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"}`}
                    >
                        Jobs Directory
                    </button>
                    <button
                        onClick={() => setActiveTab("enquiries")}
                        className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === "enquiries" ? "bg-violet-600 text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"}`}
                    >
                        Enquiries <span className="ml-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">{stats?.allMessages?.length || 0}</span>
                    </button>
                    <div className="ml-auto flex items-center">
                        <button onClick={fetchStats} className="text-violet-600 font-bold hover:bg-violet-50 px-4 py-2 rounded-lg transition-colors text-sm">Refresh Data</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {activeTab === "users" && (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-6 py-5">Name & Email</th>
                                    <th className="px-6 py-5">Role</th>
                                    <th className="px-6 py-5">Contact & Location</th>
                                    <th className="px-6 py-5">Details</th>
                                    <th className="px-6 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats?.allUsers?.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-gray-800">{user.firstName} {user.lastName}</div>
                                            <div className="text-gray-500 text-sm">{user.email}</div>
                                            <div className="text-gray-400 text-xs mt-1">Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.accountType === 'Worker' ? 'bg-emerald-100 text-emerald-700' :
                                                user.accountType === 'Contractor' ? 'bg-violet-100 text-violet-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {user.accountType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm">
                                            <div className="text-gray-700 font-medium">{user.contactNumber}</div>
                                            <div className="text-gray-500">{user.location}</div>
                                        </td>
                                        <td className="px-6 py-5 text-sm">
                                            {user.accountType === 'Contractor' && user.companyName && (
                                                <div><span className="font-semibold text-gray-600">Company:</span> {user.companyName}</div>
                                            )}
                                            {user.accountType === 'Worker' && user.skills?.length > 0 && (
                                                <div className="max-w-[150px] truncate" title={user.skills.join(", ")}>
                                                    <span className="font-semibold text-gray-600">Skills:</span> {user.skills.join(", ")}
                                                </div>
                                            )}
                                            {user.additionalDetails?.about && (
                                                <div className="text-gray-400 text-xs italic mt-1 max-w-[150px] truncate">{user.additionalDetails.about}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {(!stats?.allUsers || stats.allUsers.length === 0) && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-gray-400">No users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {activeTab === "jobs" && (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-8 py-5">Job Title</th>
                                    <th className="px-8 py-5">Location</th>
                                    <th className="px-8 py-5">Salary</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5">Posted On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats?.allJobs?.map((job) => (
                                    <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-5 font-bold text-gray-800">
                                            {job.jobName}
                                        </td>
                                        <td className="px-8 py-5 text-gray-500">{job.location}</td>
                                        <td className="px-8 py-5 text-gray-700 font-medium">₹{job.rate}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${job.status === 'Open' ? 'bg-emerald-100 text-emerald-700' :
                                                job.status === 'Assigned' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                {job.status || 'Open'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-gray-400 text-sm">
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {(!stats?.allJobs || stats.allJobs.length === 0) && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-gray-400">No jobs found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {activeTab === "enquiries" && (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-8 py-5">Sender Details</th>
                                    <th className="px-8 py-5">Message</th>
                                    <th className="px-8 py-5">Received</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats?.allMessages?.map((msg) => (
                                    <tr key={msg._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-gray-800">{msg.firstName} {msg.lastName !== "null" ? msg.lastName : ""}</div>
                                            <div className="text-gray-500 text-sm">{msg.email}</div>
                                            <div className="text-gray-400 text-xs">{msg.contactNumber !== "null" ? msg.contactNumber : ""}</div>
                                        </td>
                                        <td className="px-8 py-5 text-gray-600 max-w-md">
                                            <div className="line-clamp-2" title={msg.message}>{msg.message}</div>
                                        </td>
                                        <td className="px-8 py-5 text-gray-400 text-sm">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                            <div className="text-xs">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => handleDeleteMessage(msg._id)}
                                                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                title="Delete Message"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {(!stats?.allMessages || stats.allMessages.length === 0) && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-10 text-gray-400">No enquiries found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
