import React from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import MyJobs from './contractor/MyJobs';
import PostJob from './contractor/PostJob';
import FindJobs from './worker/FindJobs';
import AdminDashboard from './admin/AdminDashboard';
import { Link, Route, Routes, Navigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {user.accountType === "Contractor" && (
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar */}
                        <div className="w-full md:w-64 flex-shrink-0">
                            <div className="bg-white shadow-lg rounded-2xl p-6 sticky top-24 border border-gray-100">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Menu</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link to="/dashboard" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all font-medium">
                                            My Jobs
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/dashboard/post-job" className="flex items-center gap-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-all font-medium">
                                            Post a Job
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-1">
                                <Routes>
                                    <Route path="/" element={<MyJobs />} />
                                    <Route path="/post-job" element={<PostJob />} />
                                </Routes>
                            </div>
                        </div>
                    </div>
                )}

                {user.accountType === "Worker" && (
                    <div className="flex flex-col gap-6">
                        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h1 className="text-3xl font-bold mb-2">Welcome Back, {user.firstName}!</h1>
                                <p className="text-violet-100">Browse the latest opportunities tailored for your skills.</p>
                            </div>
                            <div className="absolute right-0 top-0 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 animate-blob"></div>
                            <div className="absolute left-0 bottom-0 w-64 h-64 bg-fuchsia-500 opacity-20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 animate-blob animation-delay-2000"></div>
                        </div>
                        <div className="w-full">
                            <FindJobs />
                        </div>
                    </div>
                )}

                {user.accountType === "Admin" && (
                    <AdminDashboard />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
