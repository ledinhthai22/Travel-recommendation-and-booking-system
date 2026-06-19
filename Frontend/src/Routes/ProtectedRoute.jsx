import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({
    allowedRoles = [],
}) {
    try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(
            localStorage.getItem("user") || "{}"
        );

        if (!token) {
            return <Navigate to="/" replace />;
        }

        if (
            allowedRoles.length > 0 &&
            !allowedRoles.includes(String(user.maVaiTro))
        ) {
            return <Navigate to="/" replace />;
        }

        return <Outlet />;
    } catch {
        return <Navigate to="/" replace />;
    }
}