import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import Logo from '~/assets/svg/Icon.svg';
import {
    LayoutDashboard,
    BarChart3,
    Map,
    User,
    Newspaper,
    Star,
    MessageCircleCheck,
    Settings,
    Building2,
    Calendar,
    Plane,
    Contact,
    UsersRound,
    IdCardLanyard,
    Users
} from 'lucide-react';

export default function Sidebar() {
    const [openMenu, setOpenMenu] = useState({
        tour: false,
        user: false,
    });

    const baseLinkClass = "flex items-center gap-3 px-4 py-3 text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900 rounded-2xl transition-all duration-200 group text-[13px]";

    const activeLinkClass = "flex items-center gap-3 px-4 py-3 text-blue-600 font-bold bg-blue-100 rounded-2xl transition-all duration-200 text-[13px]";

    const submenuLinkClass = "flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-all pl-12 text-[13px]";

    const activeSubmenuLinkClass = "flex items-center gap-3 px-4 py-2.5 text-blue-600 font-bold bg-blue-100 rounded-xl transition-all pl-12 text-[13px]";

    const toggleMenu = (menu) => {
        setOpenMenu(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    return (
        <aside className="h-full w-85 flex flex-col fixed left-0 top-0 bg-slate-50 border-r border-slate-200 z-[100] overflow-y-auto antialiased">
            <div className="flex flex-col min-h-full p-6">

                <div className="mb-10 px-1 flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-2xl shrink-0 bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm">
                        <img
                            src={Logo}
                            alt="Company Logo"
                            className="w-full h-full object-contain p-1"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-[13px] font-black tracking-[-0.015em] text-slate-800 leading-none mb-1">
                            LỐI RIÊNG TRAVEL
                        </h1>
                        <p className="text-[8px] uppercase tracking-[0.12em] text-slate-500 font-bold">
                            Admin Dashboard
                        </p>
                    </div>
                </div>

                <nav className="flex-1 space-y-1">

                    <NavLink to="/admin" end className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <LayoutDashboard size={20} />
                        <span className="font-manrope tracking-tight">Dashboard</span>
                    </NavLink>

                    <NavLink to="/admin/report" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <BarChart3 size={20} />
                        <span className="font-manrope tracking-tight">Doanh thu theo tour</span>
                    </NavLink>
                    <div>
                        <button
                            onClick={() => toggleMenu('tour')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900 rounded-2xl transition-all duration-200 ${openMenu.tour ? 'bg-slate-100' : ''} text-[13.8px]`}
                        >
                            <Map size={20} />
                            <span className="font-manrope tracking-tight flex-1 text-left">Quản lý tour & dịch vụ</span>
                            <span className={`material-symbols-outlined transition-transform duration-300 ${openMenu.tour ? 'rotate-180' : ''}`}>
                                expand_more
                            </span>
                        </button>

                        {openMenu.tour && (
                            <div className="mt-1 space-y-0.5">
                                <NavLink to="/admin/locations" className={({ isActive }) => isActive ? activeSubmenuLinkClass : submenuLinkClass}>
                                    <Map size={18} />
                                    Quản lý địa điểm
                                </NavLink>
                                <NavLink to="/admin/tours" className={({ isActive }) => isActive ? activeSubmenuLinkClass : submenuLinkClass}>
                                    <Plane size={18} />
                                    Quản lý tour
                                </NavLink>
                                <NavLink to="/admin/hotels" className={({ isActive }) => isActive ? activeSubmenuLinkClass : submenuLinkClass}>
                                    <Building2 size={18} />
                                    Quản lý khách sạn
                                </NavLink>
                                <NavLink to="/admin/booking" className={({ isActive }) => isActive ? activeSubmenuLinkClass : submenuLinkClass}>
                                    <Calendar size={18} />
                                    Quản lý đặt tour
                                </NavLink>
                                <NavLink to="/admin/tourists" className={({ isActive }) => isActive ? activeSubmenuLinkClass : submenuLinkClass}>
                                    <UsersRound size={18} />
                                    Quản lý khách du lịch
                                </NavLink>
                            </div>
                        )}
                    </div>
                    <div>
                        <button
                            onClick={() => toggleMenu('user')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900 rounded-2xl transition-all duration-200 ${openMenu.user ? 'bg-slate-100' : ''} text-[13.8px]`}
                        >
                            <Users size={20} />
                            <span className="font-manrope tracking-tight flex-1 text-left">Quản lý người dùng</span>
                            <span className={`material-symbols-outlined transition-transform duration-300 ${openMenu.user ? 'rotate-180' : ''}`}>
                                expand_more
                            </span>
                        </button>

                        {openMenu.user && (
                            <div className="mt-1 space-y-0.5">

                                <NavLink to="/admin/staff" className={({ isActive }) => isActive ? activeSubmenuLinkClass : submenuLinkClass}>
                                    <IdCardLanyard size={18} />
                                    Quản lý nhân sự
                                </NavLink>
                                <NavLink to="/admin/users" className={({ isActive }) => isActive ? activeSubmenuLinkClass : submenuLinkClass}>
                                    <User size={18} />
                                    Quản lý tài khoản
                                </NavLink>
                            </div>
                        )}
                    </div>
                    <NavLink to="/admin/blog" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <Newspaper size={20} />
                        <span className="font-manrope tracking-tight">Quản lý bài viết</span>
                    </NavLink>

                    <NavLink to="/admin/review" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <Star size={20} />
                        <span className="font-manrope tracking-tight">Quản lý đánh giá</span>
                    </NavLink>
                    
                    {/* <NavLink to="/admin/chat" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <MessageCircleCheck size={20} />
                        <span className="font-manrope tracking-tight">Quản lý tin nhắn</span>
                    </NavLink> */}

                    <NavLink to="/admin/contact" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <Contact size={20} />
                        <span className="font-manrope tracking-tight">Quản lý liên hệ</span>
                    </NavLink>

                    <NavLink to="/admin/webinfo" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <Settings size={20} />
                        <span className="font-manrope tracking-tight">Quản lý thông tin trang</span>
                    </NavLink>
                </nav>
            </div>
        </aside>
    );
}