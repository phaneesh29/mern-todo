import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const isValidToken = async (token) => {
    if (!token) {
        return false;
    }
    try {
        const response = await axios.get(`${API_BASE_URL}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return true;
    } catch (error) {
        return false;
    }
};
