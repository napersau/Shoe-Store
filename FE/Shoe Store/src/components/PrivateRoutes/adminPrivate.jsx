import { jwtDecode } from "jwt-decode";
import { getToken } from "../../services/localStorageService";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoutesAdmin() {
    const token = getToken();
    let userRole = null;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            userRole = decoded.scope?.name || null;
        } catch (error) {
            console.error("Lỗi giải mã token:", error);
        }
    }

    if (userRole !== "ADMIN") {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}
