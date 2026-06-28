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
    ContactRound,
    Ticket,
    BadgePercent,
    Images,
    HousePlus,
    Tags,
    MessageSquare,
    Layers, // 1. Thêm icon Layers cho Loại tour
    FileLock
} from 'lucide-react';

export default function Sidebar() {
    const { webInfo } = useWebInfo();
    const url = "https://localhost:7016";

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.maVaiTro;

    const baseLinkClass =
        "flex items-center gap-3 px-4 py-3 text-slate-600 font-medium hover:bg-[#0EA5E5]/10 hover:text-[#0EA5E5] rounded-2xl transition-all duration-200 group text-[13px]";

    const activeLinkClass =
        "flex items-center gap-3 px-4 py-3 text-[#0EA5E5] font-medium bg-[#0EA5E5]/5 rounded-2xl transition-all duration-200 text-[13px]";

    const MenuHeading = ({ title }) => (
        <p className="px-4 pt-4 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {title}
        </p>
    );

    const menuGroups = [
        {
            heading: null,
            items: [
                { title: "Dashboard", path: "/Quan-ly", icon: LayoutDashboard, end: true }
            ]
        },
        {
            heading: "Vận hành Tour",
            items: [
                { title: "Quản lý tour", path: "/Quan-ly/Cac-chuyen-di", icon: Luggage },
                { title: "Loại tour", path: "/Quan-ly/Loai-Tour", icon: Layers },
                { title: "Đơn đặt tour", path: "/Quan-ly/Don-dat-cac-chuyen-di", icon: Ticket }
            ]
        },
        {
            heading: "Địa điểm & Khách sạn",
            items: [
                { title: "Quản lý địa điểm", path: "/Quan-ly/Dia-diem", icon: MapPin },
                { title: "Loại địa điểm", path: "/Quan-ly/Loai-Dia-Diem", icon: Tags },
                { title: "Quản lý khách sạn", path: "/Quan-ly/Khach-san", icon: Building2 },
                { title: "Tiện ích khách sạn", path: "/Quan-ly/Tien-Ich", icon: HousePlus }
            ]
        },
        {
            heading: "Khách hàng & Ưu đãi",
            role: [1],
            items: [
                { title: "Tài khoản khách hàng", path: "/Quan-ly/Tai-khoan", icon: User },
                { title: "Ưu đãi & Mã giảm giá", path: "/Quan-ly/Uu-Dai", icon: BadgePercent },
                { title: "Liên hệ & Hỗ trợ", path: "/Quan-ly/Lien-he", icon: Mailbox }
            ]
        },
        {
            heading: "Nhân sự",
            role: [1],
            items: [
                { title: "Quản lý nhân sự", path: "/Quan-ly/Nhan-vien", icon: ContactRound }
            ]
        },
        {
            heading: "Marketing & Nội dung",
            role: [1],
            items: [
                { title: "Banner", path: "/Quan-ly/Banner", icon: Images },
                { title: "Newsletters", path: "/Quan-ly/Newletter", icon: UserPlus2 },
                { title: "Thông tin trang", path: "/Quan-ly/Thong-tin-trang", icon: Columns3Cog }
            ]
        },
        {
            heading: "Hệ thống",
            role: [1],
            items: [
                { title: "Nhật ký hoạt động", path: "/Quan-ly/Hoat-dong-he-thong", icon: FileLock }
            ]
        }
    ];

    return (
        <aside className="h-full w-85 flex flex-col fixed left-0 top-0 bg-slate-50 border-r border-slate-200 z-[100] antialiased">

            {/* Logo - cố định, không cuộn */}
            <div className="px-6 pt-6 pb-4 flex items-center gap-3 shrink-0 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl shrink-0 bg-white border border-sky-100 overflow-hidden flex items-center justify-center shadow-sm">
                    <img
                        src={`${url}${webInfo.logo_url}`}
                        alt={webInfo.ten_trang}
                        className="w-full h-full object-fill"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="text-[13px] font-black tracking-[-0.015em] text-slate-800 leading-none uppercase">
                        {webInfo.ten_trang}
                    </h1>
                </div>
            </div>

            {/* Nav - scroll riêng */}
            <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
                {menuGroups.map((group, index) => {
                    if (group.role && !group.role.includes(role)) return null;

                    return (
                        <div key={index}>
                            {group.heading && <MenuHeading title={group.heading} />}
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.end}
                                        className={({ isActive }) =>
                                            isActive ? activeLinkClass : baseLinkClass
                                        }
                                    >
                                        <Icon size={16} />
                                        <span className="font-manrope tracking-tight">{item.title}</span>
                                    </NavLink>
                                );
                            })}
                        </div>
                    );
                })}
            </nav>

        </aside>
    );
}