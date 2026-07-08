// src/components/Common/AdminIndexPage.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '~/Context/AuthContext';
import { DashBoard } from '~/Pages/admin';

export default function DefaultAdminRedirect() {
    const { user } = useContext(AuthContext);
    const role = String(user?.maVaiTro ?? user?.MaVaiTro ?? '');

    if (role === '1') {
        return <DashBoard />;
    }

    return <Navigate to="/Quan-ly/Don-dat-cac-chuyen-di" replace />;
}