import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

// Create an Axios instance with the base URL
export const api = axios.create({
    baseURL: API_BASE_URL,
});

// Attach token if its available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;