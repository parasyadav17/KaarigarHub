import api from "./api";

// Create Job
export const createJob = async (jobData) => {
    try {
        const formData = new FormData();
        for (const key in jobData) {
            formData.append(key, jobData[key]);
        }
        const response = await api.post("/job/createJob", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// Get Contractor Jobs
export const getContractorJobs = async () => {
    try {
        const response = await api.get("/job/getContractorJobs");
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

// Get All Jobs (for workers)
export const getAllJobs = async () => {
    try {
        const response = await api.get("/job/getAllJobs");
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

// Apply for Job
export const applyForJob = async (jobId) => {
    try {
        const response = await api.post("/job/applyForJob", { jobId });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

// Get Applied Jobs
export const getAppliedJobs = async () => {
    try {
        const response = await api.get("/job/getAppliedJobs", {
            headers: {
                "Cache-Control": "no-cache",
                "Pragma": "no-cache",
                "Expires": "0",
            }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

// Accept Application
export const acceptApplication = async (jobId, applicantId) => {
    try {
        const response = await api.post("/job/acceptApplication", { jobId, applicantId });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

// Reject Application
export const rejectApplication = async (jobId, applicantId) => {
    try {
        const response = await api.post("/job/rejectApplication", { jobId, applicantId });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}

// Get Categories (if needed)
export const getAllCategories = async () => {
    try {
        const response = await api.get("/job/showAllCategories"); // Check route for this
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
}
