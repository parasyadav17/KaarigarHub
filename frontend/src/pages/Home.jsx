
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Hammer, Users, Shield } from 'lucide-react';
import { contactUs } from '../services/contact';
import toast from 'react-hot-toast';

const Home = () => {
    const [contactData, setContactData] = useState({
        firstName: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleContactChange = (e) => {
        setContactData({ ...contactData, [e.target.name]: e.target.value });
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault(); // Note: Original button type was 'button', changed to 'submit' or handle onClick
        if (!contactData.firstName || !contactData.email || !contactData.message) {
            toast.error("Please fill all fields");
            return;
        }
        setLoading(true);
        try {
            await contactUs(contactData);
            toast.success("Message sent successfully!");
            setContactData({ firstName: '', email: '', message: '' });
        } catch (error) {
            toast.error(error.message || "Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 selection:bg-purple-500 selection:text-white">
            <Navbar />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-white pt-20 pb-32">
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
                    <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-20 left-1/2 w-[40rem] h-[40rem] bg-pink-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-sm font-semibold mb-6 tracking-wide uppercase">
                        🚀 The Future of Hiring
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight text-gray-900 mb-8 drop-shadow-sm leading-tight">
                        Find Expert <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 animate-gradient">Kaarigars</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-12 text-gray-500 max-w-3xl mx-auto leading-relaxed font-light">
                        The smartest way to hire verified professionals. <br /> From daily wagers to skilled contractors, we connect you with the best.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link to="/signup" className="group flex items-center justify-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                            Get Started Free
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/login" className="flex items-center justify-center gap-3 bg-white text-gray-700 border-2 border-gray-100 px-10 py-5 rounded-2xl font-bold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm hover:shadow-lg">
                            Login Now
                        </Link>
                    </div>

                    <div className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder Logos for Trust */}
                        <span className="text-xl font-bold flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-colors"><Shield className="w-6 h-6" /> Verified Partners</span>
                        <span className="text-xl font-bold flex items-center gap-2 text-gray-400 hover:text-purple-600 transition-colors"><Users className="w-6 h-6" /> 10k+ Active Users</span>
                        <span className="text-xl font-bold flex items-center gap-2 text-gray-400 hover:text-pink-600 transition-colors"><Hammer className="w-6 h-6" /> 50+ Categories</span>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="about" className="py-32 bg-gray-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">Why KaarigarHub?</h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                            We are revolutionizing the unorganized labor sector with technology, trust, and transparency.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { title: "Verified Identity", icon: <CheckCircle className="w-8 h-8 text-white" />, color: "bg-emerald-500", desc: "Every worker undergoes a strict 3-step verification process." },
                            { title: "Smart Matching", icon: <Users className="w-8 h-8 text-white" />, color: "bg-violet-500", desc: "AI-powered algorithms to find the perfect match for your job." },
                            { title: "Direct Hiring", icon: <Hammer className="w-8 h-8 text-white" />, color: "bg-orange-500", desc: "No middlemen. Connect directly and negotiate your own terms." }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group">
                                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-900 py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900 via-gray-900 to-gray-900 opacity-50"></div>
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
                    {[
                        { label: "Active Workers", val: "10k+", color: "text-emerald-400" },
                        { label: "Contractors", val: "500+", color: "text-violet-400" },
                        { label: "Daily Jobs", val: "2k+", color: "text-amber-400" },
                        { label: "Rating", val: "4.8", color: "text-pink-400" },
                    ].map((stat, idx) => (
                        <div key={idx}>
                            <div className={`text - 5xl md: text - 6xl font - black mb - 2 ${stat.color} tracking - tight`}>{stat.val}</div>
                            <div className="text-gray-400 font-medium uppercase tracking-widest text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Us Section */}
            <div id="contact" className="py-32 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Get in Touch</h2>
                        <p className="text-xl text-gray-500">We'd love to hear from you.</p>
                    </div>
                    <div className="bg-gray-50 rounded-3xl p-8 md:p-14 shadow-inner border border-gray-100">
                        <form className="space-y-6 text-left" onSubmit={handleContactSubmit}>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Name</label>
                                    <input name="firstName" value={contactData.firstName} onChange={handleContactChange} type="text" className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition font-medium text-gray-700" placeholder="John Doe" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email</label>
                                    <input name="email" value={contactData.email} onChange={handleContactChange} type="email" className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition font-medium text-gray-700" placeholder="john@example.com" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Message</label>
                                <textarea name="message" value={contactData.message} onChange={handleContactChange} rows="4" className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition font-medium text-gray-700" placeholder="How can we help you?" required></textarea>
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-black text-white px-8 py-5 rounded-xl font-bold text-lg hover:bg-gray-800 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex justify-center items-center">
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                        <div>
                            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-600">KaarigarHub</span>
                            <p className="mt-2 text-gray-500 font-medium">Empowering the workforce of tomorrow.</p>
                        </div>
                        <div className="flex gap-8 text-sm font-bold text-gray-600">
                            <a href="#" className="hover:text-violet-600 transition">Privacy</a>
                            <a href="#" className="hover:text-violet-600 transition">Terms</a>
                            <a href="#" className="hover:text-violet-600 transition">Support</a>
                        </div>
                    </div>
                    <div className="text-center border-t border-gray-100 pt-8 text-gray-400 text-sm font-medium">
                        &copy; 2026 KaarigarHub. All rights reserved.
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Home;

