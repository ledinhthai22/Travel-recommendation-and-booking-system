import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import Logo from '~/assets/svg/Icon.svg';
import { useWebInfo } from '~/Hooks/useWebInfo';
import {
    LayoutDashboard,
    BarChart3,
    User,
    Building2,
    Users,
    ChevronDown,
    Mailbox,
    UserPlus2,
    Columns3Cog,
    FileClock,
    MapPin,
    MapPinned,
    Luggage,
    UserPen,
    Ticket,
    ContactRound,
    BadgePercent,
    HousePlus
} from 'lucide-react';

export default function Sidebar() {
    const [openMenu, setOpenMenu] = useState({
        tour: false,
        user: false,
        hotel: false
    });
    const { webInfo } = useWebInfo()
    const url = "https://localhost:7016"
    const baseLinkClass =
        "flex items-center gap-3 px-4 py-3 text-slate-600 font-medium hover:bg-[#0EA5E5]/10 hover:text-[#0EA5E5] rounded-2xl transition-all duration-200 group text-[13px]";

    const activeLinkClass =
        "flex items-center gap-3 px-4 py-3 text-[#0EA5E5] font-medium  rounded-2xl transition-all duration-200 text-[13px]";

    const activeSubmenuLinkClass =
        "flex items-center gap-3 px-4 py-2.5 text-[#0EA5E5] font-medium  rounded-xl transition-all pl-12 text-[12px]";

    const submenuLinkClass =
        "flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-[#0EA5E5]/10 hover:text-[#0EA5E5] rounded-xl transition-all pl-8 text-[12px]";



    const toggleMenu = (menu) => {
        setOpenMenu(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    return (
        <aside className="h-full w-85 flex flex-col fixed left-0 top-0 bg-slate-50 border-r border-slate-200 z-[100] overflow-y-auto antialiased">
            <div className="flex flex-col min-h-full p-6">

                <div className="mb-5 px-1 flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-xl shrink-0 bg-white border border-sky-100 overflow-hidden flex items-center justify-center shadow-sm">
                        <img
                            src={`${url}${webInfo.logo_url}`}
                            alt={`${webInfo.ten_trang}`}
                            className="w-full h-full object-fill"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-[13px] font-black tracking-[-0.015em] text-slate-800 leading-none mb-1 uppercase">
                            {webInfo.ten_trang}
                        </h1>
                        {/* <p className="text-[10px] tracking-[0.12em] text-slate-500 font-semibold">
                            Admin Dashboard
                        </p> */}
                    </div>
                </div>

                <nav className="flex-1 space-y-1">

                    <NavLink to="/Quan-ly" end className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <LayoutDashboard size={16} />
                        <span className="font-manrope tracking-tight">Dashboard</span>
                    </NavLink>

                    {/* <NavLink to="/Quan-ly/Thong-doanh-thu-theo-cac-chuyen-di" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <BarChart3 size={16} />
                        <span className="font-manrope tracking-tight">Doanh thu theo tour</span>
                    </NavLink> */}
                    <div>
                        <button
                            onClick={() => toggleMenu('tour')}
                            className={`w-full flex items-center gap-2 px-4 py-3 text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900 rounded-2xl transition-all duration-200${openMenu.tour ? '' : ''} text-[13.8px]`}
                        >
                            <MapPinned size={16} />
                            <span className="font-manrope tracking-tight flex-1 text-left">Quản lý chuyến đi & địa điểm</span>
                            <span className={` transition-transform duration-300 ${openMenu.tour ? 'rotate-180' : ''}`}>
                                <ChevronDown size={14} />
                            </span>
                        </button>

                        {openMenu.tour && (
                            <div className="mt-1 space-y-1">
                                <NavLink to="/Quan-ly/Dia-diem" className={({ isActive }) => isActive ? activeSubmenuLinkClass : submenuLinkClass}>
                                    <MapPin size={16} />
                                    Quản lý địa điểm
                                </NavLink>
                                <NavLink to="/Quan-ly/Khach-san" className={({ isActive }) => isActive ? activeSubmenuLinkClass : submenuLinkClass}>
                                    <Building2 size={16} />
                                    Quản lý khách sạn
                                </NavLink>
                                <NavLink to="/Quan-ly/Cac-chuyen-di" className={({ isActive }) => isActive ? activeSubmenuLinkClass : submenuLinkClass}>
                                    <Luggage size={16} />
                                    Quản lý các chuyến đi
                                </NavLink>
                                <NavLink to="/Quan-ly/Don-dat-cac-chuyen-di" className={({ isActive }) => isActive ? activeSubmenuLinkClass : submenuLinkClass}>
                                    <Ticket size={16} />
                                    Quản lý đơn đặt các chuyến đi
                                </NavLink>
                                <NavLink to="/Quan-ly/Khach-du-lich" className={({ isActive }) => isActive ? activeSubmenuLinkClass : submenuLinkClass}>
                                    <UserPen size={16} />
                                    Quản lý khách du lịch
                                </NavLink>

                            </div>
                        )}
                    </div>
                    <div>
                        <button
                            onClick={() => toggleMenu('user')}
                            className={`w-full flex items-center gap-2 px-4 py-3 text-slate-600 font-medium hover:bg-slate-100 hover:text-slate-900 rounded-2xl transition-all duration-200${openMenu.tour ? '' : ''} text-[13.8px]}`}
                        >
                            <Users size={16} />
                            <span className="font-manrope tracking-tight flex-1 text-left">Quản lý người dùng</span>
                            <span className={`material-symbols-outlined transition-transform duration-300 ${openMenu.user ? 'rotate-180' : ''}`}>
                                <ChevronDown size={14} />
                            </span>
                        </button>

                        {openMenu.user && (
                            <div className="mt-1 space-y-1">

                                <NavLink to="/Quan-ly/Nhan-vien" className={({ isActive }) => isActive ? activeSubmenuLinkClass : submenuLinkClass}>
                                    <ContactRound size={16} />
                                    Quản lý nhân sự
                                </NavLink>
                                <NavLink to="/Quan-ly/Tai-khoan" className={({ isActive }) => isActive ? activeSubmenuLinkClass : submenuLinkClass}>
                                    <User size={16} />
                                    Quản lý tài khoản
                                </NavLink>
                            </div>
                        )}
                    </div>
                    <NavLink to="/Quan-ly/Lien-he" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <Mailbox size={16} />
                        <span className="font-manrope tracking-tight">Quản lý liên hệ</span>
                    </NavLink>
                    <NavLink to="/Quan-ly/Newletter" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <UserPlus2 size={16} />
                        <span className="font-manrope tracking-tight">Quản lý newletters</span>
                    </NavLink>
                    <NavLink to="/Quan-ly/Uu-Dai" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <BadgePercent size={16} />
                        <span className="font-manrope tracking-tight">Quản lý ưu đãi</span>
                    </NavLink>
                    <NavLink to="/Quan-ly/Thong-tin-trang" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <Columns3Cog size={16} />
                        <span className="font-manrope tracking-tight">Quản lý thông tin trang</span>
                    </NavLink>
                    {/* <NavLink to="/Quan-ly/Hoat-dong-he-thong" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <FileClock size={16} />
                        <span className="font-manrope tracking-tight">Nhật ký hoạt động</span>
                    </NavLink> */}

                </nav>
            </div>
        </aside>
    );
}