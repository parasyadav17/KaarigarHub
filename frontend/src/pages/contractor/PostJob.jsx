import React, { useState, useEffect } from 'react';
import { createJob, getAllCategories } from '../../services/jobService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        jobName: '',
        jobDescription: '',
        whatYouWillDo: '',
        rate: '',
        location: '',
        categoryId: '',
        thumbnailImage: null
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                if (data.success) {
                    setCategories(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch categories");
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        if (e.target.name === 'thumbnailImage') {
            setFormData({ ...formData, thumbnailImage: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createJob(formData);
            toast.success("Job Posted Successfully");
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Post a New Job</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                        <input name="jobName" required value={formData.jobName} onChange={handleChange} placeholder="e.g. Need Electrician for Wiring" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                            <select name="categoryId" required value={formData.categoryId} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer">
                                <option value="">Select Category</option>
                                {categories && categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                            <input name="location" required value={formData.location} onChange={handleChange} placeholder="City, Area" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <textarea name="jobDescription" required value={formData.jobDescription} onChange={handleChange} rows="4" placeholder="Describe the job in detail..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">What will the worker do? (Key Tasks)</label>
                        <textarea name="whatYouWillDo" value={formData.whatYouWillDo} onChange={handleChange} rows="2" placeholder="List specific tasks..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 items-end">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Rate (₹)</label>
                            <input name="rate" type="number" required value={formData.rate} onChange={handleChange} placeholder="0.00" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Thumbnail Image</label>
                            <div className="relative">
                                <input name="thumbnailImage" type="file" accept="image/*" required onChange={handleChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                <div className="w-full px-4 py-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-center text-gray-500 hover:bg-gray-100 transition">
                                    {formData.thumbnailImage ? formData.thumbnailImage.name : "Click to Upload Image"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed">
                        {loading ? "Posting Job..." : "Post Job Now"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostJob;
