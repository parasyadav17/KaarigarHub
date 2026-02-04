import React, { useState } from 'react';
import { signup, sendOtp } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        accountType: 'Worker',
        contactNumber: '',
        location: '',
    });
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await sendOtp(formData.email);
            setOtpSent(true);
            toast.success("OTP Sent Successfully");
        } catch (error) {
            toast.error(error.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords do not match");
                setLoading(false);
                return;
            }
            await signup({ ...formData, otp });
            toast.success("Signup Successful");
            navigate('/login');
        } catch (error) {
            toast.error(error.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Creative Background */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-violet-600 to-indigo-800 relative justify-center items-center overflow-hidden">
                <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full blur-3xl top-10 right-10 animate-pulse"></div>
                <div className="absolute w-96 h-96 bg-fuchsia-400 opacity-20 rounded-full blur-3xl bottom-10 left-10 animate-blob"></div>
                <div className="text-center z-10 px-10">
                    <h1 className="text-5xl font-black text-white mb-6 drop-shadow-lg">Join the Community</h1>
                    <p className="text-violet-100 text-xl leading-relaxed font-medium">
                        Create an account to start finding work or hiring the best professionals in the industry.
                    </p>
                </div>
            </div>

            {/* Right Side - Scrollable Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white relative overflow-y-auto max-h-screen">
                {/* Back to Home Button */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-violet-600 font-bold transition-colors z-20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Home
                </button>

                <div className="mx-auto w-full max-w-md mt-10">
                    <div className="mb-10">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Create Account</h2>
                        <p className="mt-2 text-sm text-gray-500 font-medium">
                            Already have an account? <span className="font-bold text-violet-600 hover:text-violet-500 cursor-pointer" onClick={() => navigate('/login')}>Sign in</span>
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">First Name</label>
                                <input name="firstName" required value={formData.firstName} onChange={handleChange} className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition bg-gray-50 focus:bg-white font-medium" placeholder="John" />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">Last Name</label>
                                <input name="lastName" required value={formData.lastName} onChange={handleChange} className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition bg-gray-50 focus:bg-white font-medium" placeholder="Doe" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">Email Address</label>
                            <div className="flex gap-2">
                                <input name="email" type="email" required value={formData.email} onChange={handleChange} className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition bg-gray-50 focus:bg-white font-medium" placeholder="john@example.com" />
                                {!otpSent && (
                                    <button type="button" onClick={handleSendOtp} disabled={loading || !formData.email} className="px-6 py-3 border border-transparent rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none transition shrink-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                        {loading ? "..." : "Get OTP"}
                                    </button>
                                )}
                            </div>
                        </div>

                        {otpSent && (
                            <div className="bg-violet-50 p-4 rounded-xl border border-violet-100 animate-fade-in">
                                <label className="block text-sm font-bold text-violet-900 mb-1 uppercase tracking-wide">Enter OTP</label>
                                <input name="otp" required value={otp} onChange={(e) => setOtp(e.target.value)} className="block w-full px-4 py-3 border border-violet-200 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition bg-white font-bold tracking-widest text-center text-lg" placeholder="123456" />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">Phone Number</label>
                            <input name="contactNumber" required value={formData.contactNumber} onChange={handleChange} className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition bg-gray-50 focus:bg-white font-medium" placeholder="+91 98765 43210" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">Location</label>
                            <input name="location" required value={formData.location} onChange={handleChange} className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition bg-gray-50 focus:bg-white font-medium" placeholder="City, State" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">I am a...</label>
                            <select name="accountType" value={formData.accountType} onChange={handleChange} className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition bg-white font-medium">
                                <option value="Worker">Worker (Looking for jobs)</option>
                                <option value="Contractor">Contractor (Hiring workers)</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">Password</label>
                                <input name="password" type="password" required value={formData.password} onChange={handleChange} className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition bg-gray-50 focus:bg-white font-medium" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">Confirm Password</label>
                                <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition bg-gray-50 focus:bg-white font-medium" placeholder="••••••••" />
                            </div>
                        </div>

                        {otpSent && (
                            <div className="pt-2">
                                <button type="submit" disabled={loading} className="w-full justify-center py-4 px-4 border border-transparent rounded-xl shadow-xl text-lg font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 focus:outline-none transform hover:-translate-y-1 transition duration-300 flex items-center gap-2">
                                    {loading ? "Creating Account..." : "Create Account"}
                                </button>
                            </div>
                        )}

                        {!otpSent && (
                            <p className="text-sm text-gray-500 text-center font-medium">
                                Please verify your email with OTP to proceed with signup.
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
