import React, { useState, useEffect } from 'react';
import { getAppliedJobs } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';

const AppliedJobs = ({ refreshTrigger }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const data = await getAppliedJobs();
                if (data.success) {
                    setJobs(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch applied jobs");
                // toast.error("Failed to load applied jobs"); // Optional: add toast if desired
            } finally {
                setLoading(false);
            }
        };
        fetchAppliedJobs();
    }, [refreshTrigger]);

    if (loading) return <div>Loading applied jobs...</div>;

    if (jobs.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                You haven't applied to any jobs yet.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Applied Jobs</h2>
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
                                ) : (
                                    <button disabled className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md cursor-default">
                                        Applied (Pending)
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AppliedJobs;
