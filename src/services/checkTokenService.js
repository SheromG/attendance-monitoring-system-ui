import { jwtDecode } from "jwt-decode";
import useAuthStore from "../store/useAuthStore";

export const checkTokenExpiry = () => {
    const token = useAuthStore.getState().token;

    if (!token) return;

    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
        useAuthStore.getState().logout();
    }
};