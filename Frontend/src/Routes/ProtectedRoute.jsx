import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
        return <Navigate to="/" replace />;
    }

    const user = JSON.parse(storedUser);
    const role = String(user?.maVaiTro);

    // debug cực quan trọng
    console.log("ROLE:", role);
    console.log("ALLOWED:", allowedRoles);

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}