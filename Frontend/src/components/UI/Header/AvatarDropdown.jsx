import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, User, LogOut } from "lucide-react";
export default function AvatarDropdown({ user, onLogout }) {
    const [open, setOpen] = useState(false);
    const avatarUrl =
        user?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.hoTen || "User"
        )}&background=0EA5E5&color=fff`;

    return (
        <div className="relative">
            {/* Trigger */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-2xl transition hover:bg-slate-50"
            >
                <div className="hidden text-right md:block">
                    <p
                        className={`text-[11px] font-semibold ${open ? "text-[#0EA5E5]" : "text-slate-900"
                            }`}
                    >
                        {user?.hoTen}
                    </p>

                    <p
                        className={`text-[10px] ${open ? "text-[#0EA5E5]" : "text-slate-500"
                            }`}
                    >
                        {user?.email}
                    </p>
                </div>

                <img
                    src={avatarUrl}
                    alt={user?.hoTen}
                    className="h-10 w-10 rounded-xl object-cover ring-2 ring-white shadow"
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl z-50">

                    {/* User Info */}
                    <div className="border-b border-slate-100 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={avatarUrl}
                                alt={user?.hoTen}
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

                    {/* Menu */}
                    <div className="py-2">
                        <Link
                            to="/Danh-Sach-Yeu-Thich"
                            className="flex items-center gap-2 px-5 py-2.5 text-sm hover:bg-slate-50 hover:text-[#0EA5E5]"
                        >
                            <Heart size={14} />
                            Danh sách yêu thích
                        </Link>

                        <Link
                            to="/Thong-Tin-Ca-Nhan"
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