import { NavLink } from 'react-router-dom';
import { useWebInfo } from '~/Hooks/useWebInfo';
import {
    LayoutDashboard,
    User,
    Building2,
    Mailbox,
    UserPlus2,
    Columns3Cog,
    MapPin,
    Luggage,
    UserPen,
    Ticket,
    ContactRound,
    BadgePercent,
    Images,
    HousePlus,
    Tags
} from 'lucide-react';

export default function Sidebar() {
    const { webInfo } = useWebInfo();
    const url = "https://localhost:7016";

    const baseLinkClass =
        "flex items-center gap-3 px-4 py-3 text-slate-600 font-medium hover:bg-[#0EA5E5]/10 hover:text-[#0EA5E5] rounded-2xl transition-all duration-200 group text-[13px]";

    const activeLinkClass =
        "flex items-center gap-3 px-4 py-3 text-[#0EA5E5] font-medium bg-[#0EA5E5]/5 rounded-2xl transition-all duration-200 text-[13px]";

    const MenuHeading = ({ title }) => (
        <p className="px-4 pt-4 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {title}
        </p>
    );

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
                    </div>
                </div>

                <nav className="flex-1 space-y-1">

                    <NavLink to="/Quan-ly" end className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <LayoutDashboard size={16} />
                        <span className="font-manrope tracking-tight">Dashboard</span>
                    </NavLink>
                    <MenuHeading title="Chuyến đi & Địa điểm" />
                    <NavLink to="/Quan-ly/Cac-chuyen-di" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <Luggage size={16} />
                        <span className="font-manrope tracking-tight">Quản lý các chuyến đi</span>
                    </NavLink>
                    <NavLink to="/Quan-ly/Dia-diem" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <MapPin size={16} />
                        <span className="font-manrope tracking-tight">Quản lý địa điểm</span>
                    </NavLink>
                    <NavLink to="/Quan-ly/Loai-Dia-Diem" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <Tags size={16} />
                        <span className="font-manrope tracking-tight">Quản lý loại địa điểm</span>
                    </NavLink>
                    <NavLink to="/Quan-ly/Don-dat-cac-chuyen-di" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <Ticket size={16} />
                        <span className="font-manrope tracking-tight">Quản lý đơn đặt</span>
                    </NavLink>
                    <NavLink to="/Quan-ly/Khach-du-lich" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <UserPen size={16} />
                        <span className="font-manrope tracking-tight">Quản lý khách du lịch</span>
                    </NavLink>
                    <MenuHeading title="Khách sạn & Tiện ích" />
                    <NavLink to="/Quan-ly/Khach-san" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <Building2 size={16} />
                        <span className="font-manrope tracking-tight">Quản lý khách sạn</span>
                    </NavLink>
                    <NavLink to="/Quan-ly/Tien-Ich" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <HousePlus size={16} />
                        <span className="font-manrope tracking-tight">Quản lý tiện ích</span>
                    </NavLink>
                    <MenuHeading title="Người dùng" />
                    <NavLink to="/Quan-ly/Nhan-vien" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <ContactRound size={16} />
                        <span className="font-manrope tracking-tight">Quản lý nhân sự</span>
                    </NavLink>
                    <NavLink to="/Quan-ly/Tai-khoan" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <User size={16} />
                        <span className="font-manrope tracking-tight">Quản lý tài khoản</span>
                    </NavLink>

                    <MenuHeading title="Hệ thống & Giao tiếp" />

                    <NavLink to="/Quan-ly/Lien-he" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <Mailbox size={16} />
                        <span className="font-manrope tracking-tight">Quản lý liên hệ</span>
                    </NavLink>
                    <NavLink to="/Quan-ly/Newletter" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <UserPlus2 size={16} />
                        <span className="font-manrope tracking-tight">Quản lý newletters</span>
                    </NavLink>
                    <NavLink to="/Quan-ly/Banner" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <Images size={16} />
                        <span className="font-manrope tracking-tight">Quản lý banner</span>
                    </NavLink>
                    <NavLink to="/Quan-ly/Uu-Dai" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <BadgePercent size={16} />
                        <span className="font-manrope tracking-tight">Quản lý ưu đãi</span>
                    </NavLink>
                    <NavLink to="/Quan-ly/Thong-tin-trang" className={({ isActive }) => isActive ? activeLinkClass : baseLinkClass}>
                        <Columns3Cog size={16} />
                        <span className="font-manrope tracking-tight">Quản lý thông tin trang</span>
                    </NavLink>
                </nav>
            </div>
        </aside>
    );
}