import { Outlet } from 'react-router-dom';
import Sidebar from './admin/Sidebar';
import Header from './admin/Header';

export default function AdminLayout() {
    return (
        <div className="text-on-surface font-body selection:bg-primary-fixed min-h-screen">
            <Sidebar />
            <Header />
            <main className="ml-80 pt-20 pb-12 px-10 min-h-screen space-y-8">
                <Outlet />
            </main>
        </div>
    );
}