import React, { useState } from 'react';
import {
    LogOut,
    User,
    Search,
    Bell
} from 'lucide-react';
export default function Header() {
    const [isNotifyOpen, setIsNotifyOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="fixed top-0 right-0 left-85 h-20 bg-white border-b border-slate-200 z-40">
            <div className="flex justify-between items-center h-full px-6">
                <div className="flex-1 max-w-xl mx-[250px]">
                    <div className="flex items-center bg-slate-100 rounded-full px-5 py-2.5 group focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300">
                        <Search size={20} />
                        <input
                            className="bg-transparent border-none focus:ring-0 text-sm w-full  outline-none ml-3 placeholder:text-slate-400"
                            placeholder="Tìm kiếm hành trình, khách hàng, tour..."
                            type="text"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 ml-auto">
                    <div className="relative">
                        <button
                            onClick={() => {
                                setIsNotifyOpen(!isNotifyOpen);
                                setIsProfileOpen(false);
                            }}
                            className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all hover:bg-slate-100 active:scale-95 ${isNotifyOpen ? 'bg-blue-100 text-blue-600' : 'text-slate-500'}`}
                        >
                            <Bell size={20}  />
                        </button>
                        {isNotifyOpen && (
                            <div className="absolute right-0 mt-3 w-90 bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden z-50">
                                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-semibold text-slate-900">Thông báo</h3>
                                    <button className=" text-[10px] text-blue-600 bg-blue-50/70 border border-blue-100 rounded-xl px-2.5 py-0.5">Đánh dấu đã đọc tất cả</button>
                                </div>
                                <div className="max-h-[340px] overflow-y-auto">
                                    <div className="p-4 hover:bg-slate-50 border-b border-slate-50">
                                        <p className="text-sm text-slate-700">
                                            <span className="font-semibold">Hệ thống:</span> Lịch trình Tour Đà Lạt đã được cập nhật.
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">2 phút trước</p>
                                    </div>
                                </div>
                                <button className="w-full py-4 text-sm font-medium text-slate-500 hover:bg-slate-50 border-t border-slate-100">
                                    Xem tất cả thông báo
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="relative pl-4 border-l border-slate-200">
                        <button
                            onClick={() => {
                                setIsProfileOpen(!isProfileOpen);
                                setIsNotifyOpen(false);
                            }}
                            className={`flex items-center gap-3 p-3 pr-2 rounded-2xl transition-all hover:bg-slate-100 active:scale-[0.97] ${isProfileOpen ? 'bg-slate-100' : ''}`}
                        >
                            <div className="text-right">
                                <p className="text-sm font-semibold text-slate-900">Quản trị viên</p>
                                <p className="text-[10px] text-slate-500 -mt-0.5 up">Admin</p>
                            </div>
                            <img
                                alt="Admin Avatar"
                                className="w-9 h-9 rounded-2xl object-cover ring-2 ring-white shadow"
                                src="https://ui-avatars.com/api/?name=Quản+trị+viên&background=1e40af&color=fff"
                            />

                        </button>
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-200 shadow-2xl rounded-3xl py-2 z-50">
                                <div className="px-5 py-4 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <img
                                            alt="Admin"
                                            className="w-11 h-11 rounded-2xl object-cover"
                                            src="https://ui-avatars.com/api/?name=Quản+trị+viên&background=1e40af&color=fff"
                                        />
                                        <div>
                                            <p className="font-semibold text-slate-900">Quản trị viên</p>
                                            <p className="text-sm text-slate-500">admin@loiriengtravel.com</p>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full px-5 py-3.5 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors">
                                    <User size={20} /> Thông tin cá nhân
                                </button>

                                <div className="border-t border-slate-100 my-1 mx-2"></div>

                                <button
                                    onClick={() => {
                                        console.log("Đăng xuất");
                                        setIsProfileOpen(false);
                                    }}
                                    className="w-full px-5 py-3.5 text-left flex items-center gap-3 hover:bg-red-50 text-red-600 transition-colors rounded-b-2xl"
                                >
                                    <LogOut size={20} /> Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}