import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            toast.success(data.message);
            // TODO: Store user/token in context
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || "Login failed");
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Creative Background */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-violet-600 to-indigo-800 relative justify-center items-center overflow-hidden">
                <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl -top-10 -left-10 animate-pulse"></div>
                <div className="absolute w-96 h-96 bg-fuchsia-400 opacity-20 rounded-full blur-3xl bottom-10 right-10 animate-blob"></div>
                <div className="text-center z-10 px-10">
                    <h1 className="text-5xl font-black text-white mb-6 drop-shadow-lg">Welcome Back!</h1>
                    <p className="text-violet-100 text-xl leading-relaxed font-medium">
                        Sign in to continue connecting with the best Kaarigars and Contractors in your area.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative">
                {/* Back to Home Button */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-violet-600 font-bold transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Home
                </button>

                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-10">
                        <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl mb-6 shadow-xl transform rotate-3">K</div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Sign in</h2>
                        <p className="mt-2 text-sm text-gray-500 font-medium">
                            Or <span className="font-bold text-violet-600 hover:text-violet-500 cursor-pointer" onClick={() => navigate('/signup')}>create a new account</span>
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-violet-100 focus:border-violet-500 transition font-medium bg-gray-50 focus:bg-white"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-violet-100 focus:border-violet-500 transition font-medium bg-gray-50 focus:bg-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-xl text-lg font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transform hover:-translate-y-1 transition duration-200"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
