import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const baseURL =
    import.meta.env.VITE_ENVIRONMENT === "local"
        ? `${import.meta.env.VITE_API_URL}:${import.meta.env.VITE_API_PORT}`
        : `${import.meta.env.VITE_API_URL}`;

const API = axios.create({ baseURL });

API.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
});

export default API;