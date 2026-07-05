import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Heart, User, LogOut, LayoutDashboard } from "lucide-react";
import useAuth from "~/Hooks/useAuth";

export default function AvatarDropdown({ user, onLogout }) {
    const [open, setOpen] = useState(false);
    const { isStaff } = useAuth();
    const dropdownRef = useRef(null);
    
    const timestamp = new Date().getTime(); 
    const path = user?.duongDanAnh || user?.avatar;
    
    let avatarUrl;
    if (!path || path === "undefined" || path === "null") {
        avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.hoTen || "User")}&background=0EA5E5&color=fff`;
    } else {
        const baseUrl = path.startsWith("http") ? path : `https://localhost:7016${path.startsWith("/") ? path : "/" + path}`;
        avatarUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}t=${timestamp}`;
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (open && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [open]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-2xl transition hover:bg-slate-50 cursor-pointer"
            >
                <div className="hidden text-right md:block">
                    <p className={`text-[11px] font-semibold ${open ? "text-[#0EA5E5]" : "text-slate-900"}`}>
                        {user?.hoTen}
                    </p>
                </div>

                <img
                    src={avatarUrl}
                    alt={user?.hoTen}
                    onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.hoTen || "User")}&background=0EA5E5&color=fff`;
                    }}
                    className="h-10 w-10 rounded-xl object-cover"
                />
            </button>

            {open && (
                <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl z-50">
                    <div className="border-b border-slate-100 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={avatarUrl}
                                alt={user?.hoTen}
                                onError={(e) => {
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.hoTen || "User")}&background=0EA5E5&color=fff`;
                                }}
                                className="h-10 w-10 rounded-2xl object-cover"
                            />
                            <div>
                                <p className="font-semibold text-[11px] text-slate-900">
                                    {user?.hoTen}
                                </p>
                                <p className="text-[10px] text-slate-500">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="py-2">
                        {isStaff && (
                            <Link
                                to="/Quan-ly"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-amber-600 hover:bg-slate-50 hover:text-amber-700"
                            >
                                <LayoutDashboard size={14} />
                                Trang quản trị
                            </Link>
                        )}

                        {!isStaff && (
                            <Link
                                to="/Danh-Sach-Yeu-Thich"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm hover:bg-slate-50 hover:text-[#0EA5E5]"
                            >
                                <Heart size={14} />
                                Danh sách yêu thích
                            </Link>
                        )}

                        <Link
                            to={isStaff ? "/Quan-ly" : "/Thong-Tin-Ca-Nhan"}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-sm hover:bg-slate-50 hover:text-[#0EA5E5]"
                        >
                            <User size={14} />
                            Thông tin cá nhân
                        </Link>

                        <div className="mx-3 my-2 border-t border-slate-100" />

                        <button
                            onClick={() => {
                                onLogout?.();
                                setOpen(false);
                            }}
                            className="flex w-full items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50"
                        >
                            <LogOut size={16} />
                            Đăng xuất
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}   