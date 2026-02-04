import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300 supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg group-hover:scale-110 transition-transform">
                                K
                            </div>
                            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-violet-800 to-gray-900 tracking-tight">
                                KaarigarHub
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-10">
                        <a href="#about" className="text-gray-500 hover:text-violet-600 font-semibold transition-colors text-sm uppercase tracking-wide">About</a>
                        <a href="#contact" className="text-gray-500 hover:text-violet-600 font-semibold transition-colors text-sm uppercase tracking-wide">Contact</a>
                        {!user ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg font-bold transition-colors">Log in</Link>
                                <Link to="/signup" className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-transparent">Sign up</Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <span className="text-gray-600 font-bold bg-violet-50 px-4 py-2 rounded-lg text-sm border border-violet-100 text-violet-700">Hi, {user.firstName}</span>
                                <Link to="/dashboard" className="text-gray-600 hover:text-violet-600 font-bold">Dashboard</Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        navigate('/');
                                    }}
                                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors text-sm border border-red-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
