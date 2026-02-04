import api from "./api";

export const login = async (email, password) => {
    try {
        const response = await api.post("/auth/login", { email, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const signup = async (userData) => {
    try {
        const response = await api.post("/auth/signup", userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const sendOtp = async (email) => {
    try {
        const response = await api.post("/auth/sendotp", { email });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
