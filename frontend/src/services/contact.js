import api from "./api";

export const contactUs = async (data) => {
    try {
        const response = await api.post("/contact/contactUs", data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
