import React, { useState, useRef, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import useAuth from "~/Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "~/Context/AuthContext";
import NotificationPanel from "~/components/UI/Notification/NotificationPanel";
export default function Header() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const { user } = useAuth();
    const { forceLogout  } = React.useContext(AuthContext);
    const navigate = useNavigate();

    const profileRef = useRef(null);

    // Click outside để đóng profile dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await forceLogout();
        navigate("/");
    };

    const avatarUrl = user?.duongDanAnh
        ? `https://localhost:7016${user.duongDanAnh}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.hoTen || "Staff")}&background=1e40af&color=fff`;

    const roleName = user?.tenVaiTro || (user?.maVaiTro === 1 ? 'Admin' : 'Nhân viên');

    return (
        <header className="fixed top-0 right-0 left-80 h-15 bg-white border-b border-slate-200 z-40">
            <div className="flex justify-between items-center h-full px-6">
                <div className="flex items-center ml-auto gap-3">

                    {/* Notification Panel - Đã tách riêng */}
                    <NotificationPanel role="admin" />

                    {/* Profile Dropdown */}
                    <div className="relative pl-4 border-l border-slate-200" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(prev => !prev)}
                            className="flex items-center gap-3 p-2 pr-1 rounded-2xl hover:bg-slate-50 transition-all active:scale-[0.97]"
                        >
                            <div className="text-right">
                                <p className={`text-[13px] font-semibold ${isProfileOpen ? 'text-[#0EA5E5]' : 'text-slate-900'}`}>
                                    {user?.hoTen || "Chưa có tên"}
                                </p>
                                <p className={`text-[11px] ${isProfileOpen ? 'text-[#0EA5E5]' : 'text-slate-500'}`}>
                                    {roleName}
                                </p>
                            </div>

                            <img
                                alt="Avatar"
                                src={avatarUrl}
                                onError={(e) => {
                                    e.target.src = "https://ui-avatars.com/api/?name=Staff&background=1e40af&color=fff";
                                }}
                                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-white shadow"
                            />
                        </button>

                        {/* Profile Menu */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-200 shadow-2xl rounded-2xl py-2 z-50">
                                <div className="px-5 py-4 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={avatarUrl}
                                            alt="Avatar"
                                            className="w-11 h-11 rounded-2xl object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold">{user?.hoTen || "Chưa có tên"}</p>
                                            <p className="text-sm text-slate-500">{user?.email || "Chưa cập nhật email"}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full px-5 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 rounded-b-2xl transition"
                                >
                                    <LogOut size={16} />
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}