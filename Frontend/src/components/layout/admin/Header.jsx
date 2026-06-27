import React, { useState, useContext, useEffect, useRef } from 'react';
import { LogOut, User, Bell } from 'lucide-react';
import useAuth from "~/Hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "~/Context/AuthContext";

export default function Header() {
    const [isNotifyOpen, setIsNotifyOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const { user } = useAuth();
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const notifyRef = useRef(null);
    const profileRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifyRef.current && !notifyRef.current.contains(e.target)) {
                setIsNotifyOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const avatarUrl = user?.duongDanAnh
        ? `https://localhost:7016${user.duongDanAnh}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.hoTen || "Staff")}&background=1e40af&color=fff`;

    const roleName = user?.tenVaiTro || (user?.maVaiTro === 1 ? 'Admin' : 'Nhân viên');

    return (
        <header className="fixed top-0 right-0 left-85 h-15 bg-white border border-slate-200 z-40">
            <div className="flex justify-between items-center h-full px-6">
                <div className="flex items-center ml-auto rounded-2xl">

                    {/* Notification */}
                    <div className="relative" ref={notifyRef}>
                        <button
                            onClick={() => {
                                setIsNotifyOpen((prev) => !prev);
                                setIsProfileOpen(false);
                            }}
                            className={`w-11 h-11 flex items-center justify-center transition-all active:scale-95 ${isNotifyOpen ? 'text-[#0EA5E5]' : 'text-slate-500'}`}
                        >
                            <Bell size={16} />
                        </button>

                        {isNotifyOpen && (
                            <div className="absolute right-0 mt-[15px] w-90 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden z-50">
                                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-semibold text-slate-900">Thông báo</h3>
                                    <button className="text-[10px] text-[#0EA5E5] bg-blue-50/70 border border-blue-100 rounded-xl px-2.5 py-0.5">
                                        Đánh dấu đã đọc tất cả
                                    </button>
                                </div>

                                <div className="max-h-[340px] overflow-y-auto">
                                    <div className="p-4 hover:bg-slate-50 border-b border-slate-50">
                                        <p className="text-sm text-slate-700">
                                            <span className="font-semibold">Hệ thống:</span> Lịch trình Tour Đà Lạt đã được cập nhật.
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">2 phút trước</p>
                                    </div>
                                </div>

                                <button className="w-full py-4 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-[#0EA5E5] border-t border-slate-100">
                                    Xem tất cả thông báo
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Profile */}
                    <div className="relative pl-4 border-l border-slate-200" ref={profileRef}>
                        <button
                            onClick={() => {
                                setIsProfileOpen((prev) => !prev);
                                setIsNotifyOpen(false);
                            }}
                            className="flex items-center gap-3 p-3 pr-2 transition-all active:scale-[0.97]"
                        >
                            <div className="text-right">
                                <p className={`text-[12px] font-semibold ${isProfileOpen ? 'text-[#0EA5E5]' : 'text-slate-900'}`}>
                                    {user?.hoTen || "Chưa có tên"}
                                </p>
                                <p className={`text-[10px] ${isProfileOpen ? 'text-[#0EA5E5]' : 'text-slate-500'}`}>
                                    {roleName}
                                </p>
                            </div>

                            <img
                                alt={user?.hoTen || "Staff Avatar"}
                                className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow"
                                src={avatarUrl}
                                onError={(e) => {
                                    e.target.src = "https://ui-avatars.com/api/?name=Staff&background=1e40af&color=fff";
                                }}
                            />
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-[5px] w-72 bg-white border border-slate-200 shadow-2xl rounded-2xl py-2 z-50">
                                <div className="px-5 py-4 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <img
                                            alt={user?.hoTen || "Staff"}
                                            className="w-11 rounded-2xl object-cover"
                                            src={avatarUrl}
                                        />
                                        <div>
                                            <p className="font-semibold text-slate-900">{user?.hoTen || "Chưa có tên"}</p>
                                            <p className="text-sm text-slate-500">{user?.email || "Chưa cập nhật email"}</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        navigate("/admin/profile");
                                        setIsProfileOpen(false);
                                    }}
                                    className="w-full px-5 py-2 text-left text-[12px] flex items-center gap-3 hover:bg-slate-50 transition-colors"
                                >
                                    <User size={16} />
                                    Thông tin cá nhân
                                </button>

                                <div className="border-t border-slate-100 my-1 mx-2" />

                                <button
                                    onClick={handleLogout}
                                    className="w-full px-5 py-3 text-[12px] text-left flex items-center gap-3 hover:bg-red-50 text-red-600 transition-colors rounded-b-2xl"
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