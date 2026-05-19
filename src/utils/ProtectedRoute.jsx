import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const ProtectedRoute = ({ children, role: requiredRole }) => {
    const token = useAuthStore((state) => state.token);
    const role = useAuthStore((state) => state.role);

    if (!token) return <Navigate to="/" />;
    

    if (requiredRole && role !== requiredRole) return <Navigate to="/" />;

    return children;
};

export default ProtectedRoute;