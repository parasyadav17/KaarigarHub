import React, { useState, useEffect } from 'react';
import { getContractorJobs, acceptApplication, rejectApplication } from '../../services/jobService';
import toast from 'react-hot-toast';

const MyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getContractorJobs();
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

    const handleAccept = async (jobId, applicantId) => {
        try {
            await acceptApplication(jobId, applicantId);
            toast.success("Application Accepted");
            // Refresh jobs
            const data = await getContractorJobs();
            if (data.success) setJobs(data.data);
        } catch (error) {
            toast.error(error.message || "Failed to accept");
        }
    };

    const handleReject = async (jobId, applicantId) => {
        try {
            await rejectApplication(jobId, applicantId);
            toast.success("Application Rejected");
            // Refresh jobs
            const data = await getContractorJobs();
            if (data.success) setJobs(data.data);
        } catch (error) {
            toast.error(error.message || "Failed to reject");
        }
    };

    if (loading) return <div>Loading jobs...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">My Posted Jobs</h2>
            {jobs.length === 0 ? <p>No jobs posted yet.</p> : (
                jobs.map(job => (
                    <div key={job._id} className="bg-white hover:shadow-md transition-shadow rounded-xl p-6 flex flex-col md:flex-row gap-6 border border-gray-100">
                        <img src={job.thumbnail} alt={job.jobName} className="w-full md:w-32 h-32 object-cover rounded-lg" />
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold">{job.jobName}</h3>
                            <p className="text-gray-600 truncate">{job.jobDescription}</p>
                            <div className="mt-2 flex gap-4 text-sm text-gray-500">
                                <span>₹{job.rate}</span>
                                <span>{job.location}</span>
                                <span className={`px-2 py-0.5 rounded-full ${job.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{job.status}</span>
                            </div>
                            <div className="mt-4">
                                <h4 className="font-medium text-sm mb-2">Applicants ({job.applicants?.length || 0})</h4>
                                {job.applicants && job.applicants.length > 0 ? (
                                    <div className="space-y-2">
                                        {job.applicants.map((applicant) => (
                                            <div key={applicant._id} className="bg-gray-50 p-3 rounded border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm">
                                                <div>
                                                    <p className="font-semibold text-gray-800">{applicant.firstName} {applicant.lastName}</p>
                                                    <p className="text-gray-600">{applicant.email}</p>
                                                    <p className="text-gray-600">Ph: {applicant.contactNumber}</p>
                                                </div>
                                                <div className="mt-2 sm:mt-0 flex gap-2">
                                                    <button onClick={() => handleAccept(job._id, applicant._id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs">Accept</button>
                                                    <button onClick={() => handleReject(job._id, applicant._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs">Reject</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm italic">No active applicants.</p>
                                )}

                                {job.workersEnrolled && job.workersEnrolled.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <h4 className="font-medium text-sm mb-3 text-green-700 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Accepted Workers ({job.workersEnrolled.length})
                                        </h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            {job.workersEnrolled.map((worker) => (
                                                <div key={worker._id} className="bg-green-50 p-3 rounded-lg border border-green-100 flex items-center justify-between text-sm">
                                                    <div>
                                                        <p className="font-bold text-gray-900">{worker.firstName} {worker.lastName}</p>
                                                        <p className="text-gray-600 text-xs">{worker.email}</p>
                                                        <p className="text-gray-600 text-xs">Ph: {worker.contactNumber}</p>
                                                    </div>
                                                    {worker.image && <img src={worker.image} alt="Worker" className="w-8 h-8 rounded-full" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyJobs;
