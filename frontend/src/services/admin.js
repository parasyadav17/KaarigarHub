import api from "./api";

export const getAdminStats = async () => {
    try {
        const response = await api.get("/admin/stats");
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getAllUsers = async () => {
    try {
        const response = await api.get("/admin/users");
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await api.delete("/admin/deleteUser", { data: { id } });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const deleteMessage = async (id) => {
    try {
        const response = await api.delete("/admin/deleteMessage", { data: { id } });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
