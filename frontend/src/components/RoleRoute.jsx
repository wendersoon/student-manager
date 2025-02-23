import { Navigate, Outlet } from "react-router-dom";
import { AuthService } from "../services/auth/auth";

export function RoleRoute({ allowedRoles }) {
    const userRole = AuthService.getUserRole();
    const isAuthenticated = AuthService.isAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}

