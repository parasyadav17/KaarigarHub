import React, { useState, useEffect } from 'react';
import { getAllJobs, applyForJob } from '../../services/jobService';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const FindJobs = ({ onJobApplied }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    // In a real app, track applied jobs status for this user separately or in data

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getAllJobs();
                if (data.success) {
                    setJobs(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch jobs");
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleApply = async (jobId) => {
        try {
            await applyForJob(jobId);
            toast.success("Applied successfully!");
            if (onJobApplied) onJobApplied();

            // Update local state to reflect change immediately
            setJobs(prevJobs => prevJobs.map(job =>
                job._id === jobId
                    ? { ...job, applicants: [...(job.applicants || []), user._id] }
                    : job
            ));
        } catch (error) {
            toast.error(error.message || "Failed to apply");
        }
    };

    if (loading) return <div>Loading jobs...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Find Work</h2>
            {jobs.length === 0 ? <p>No jobs available.</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map(job => (
                        <div key={job._id} className="bg-white shadow rounded-lg overflow-hidden flex flex-col">
                            <img src={job.thumbnail} alt={job.jobName} className="w-full h-48 object-cover" />
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="text-xl font-semibold mb-2">{job.jobName}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{job.jobDescription}</p>
                                <div className="mt-auto">
                                    <div className="flex justify-between items-center text-sm font-medium text-gray-900 mb-4">
                                        <span>₹{job.rate}</span>
                                        <span>{job.location}</span>
                                    </div>

                                    {/* Application Status Logic */}
                                    {job.workersEnrolled?.includes(user?._id) ? (
                                        <div className="space-y-2">
                                            <button disabled className="w-full bg-green-500 text-white py-2 px-4 rounded-md cursor-default">
                                                Application Accepted
                                            </button>
                                            <div className="bg-green-50 p-3 rounded border border-green-200 text-sm">
                                                <p className="font-bold text-green-900 mb-1">Contact Contractor:</p>
                                                <p className="text-gray-800"><span className="font-semibold">Name:</span> {job.contractor?.firstName} {job.contractor?.lastName}</p>
                                                <p className="text-gray-800"><span className="font-semibold">Ph:</span> {job.contractor?.contactNumber}</p>
                                                <p className="text-gray-800"><span className="font-semibold">Email:</span> {job.contractor?.email}</p>
                                            </div>
                                        </div>
                                    ) : job.rejectedApplicants?.includes(user?._id) ? (
                                        <button disabled className="w-full bg-red-500 text-white py-2 px-4 rounded-md cursor-default">
                                            Application Rejected
                                        </button>
                                    ) : job.applicants?.includes(user?._id) ? (
                                        <button disabled className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md cursor-default">
                                            Applied (Pending)
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleApply(job._id)}
                                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                                        >
                                            Apply Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FindJobs;
