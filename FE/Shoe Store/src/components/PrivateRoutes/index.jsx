import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../../services/localStorageService";

function PrivateRoutes() {
    const accessToken = getToken();

    if (accessToken === null || accessToken === undefined) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default PrivateRoutes;