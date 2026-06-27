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
    Tags,
    MessageSquare,
    Layers 
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
                {
                    title: "Dashboard",
                    path: "/Quan-ly",
                    icon: LayoutDashboard,
                    end: true
                }
            ]
        },

        {
            heading: "Chuyến đi & Địa điểm",
            items: [
                {
                    title: "Quản lý tour",
                    path: "/Quan-ly/Cac-chuyen-di",
                    icon: Luggage
                },
                {
                    title: "Quản lý loại tour",
                    path: "/Quan-ly/Loai-Tour",
                    icon: Layers
                },
                {
                    title: "Quản lý địa điểm",
                    path: "/Quan-ly/Dia-diem",
                    icon: MapPin
                },
                {
                    title: "Quản lý loại địa điểm",
                    path: "/Quan-ly/Loai-Dia-Diem",
                    icon: Tags
                },
                {
                    title: "Quản lý đơn đặt",
                    path: "/Quan-ly/Don-dat-cac-chuyen-di",
                    icon: Ticket
                },
                {
                    title: "Quản lý khách du lịch",
                    path: "/Quan-ly/Khach-du-lich",
                    icon: UserPen
                }
            ]
        },

        {
            heading: "Khách sạn & Tiện ích",
            items: [
                {
                    title: "Quản lý khách sạn",
                    path: "/Quan-ly/Khach-san",
                    icon: Building2
                },
                {
                    title: "Quản lý tiện ích",
                    path: "/Quan-ly/Tien-Ich",
                    icon: HousePlus
                }
            ]
        },

        {
            role: [1],
            heading: "Người dùng",
            items: [
                {
                    title: "Quản lý nhân sự",
                    path: "/Quan-ly/Nhan-vien",
                    icon: ContactRound
                },
                {
                    title: "Quản lý tài khoản",
                    path: "/Quan-ly/Tai-khoan",
                    icon: User
                }
            ]
        },

        {
            heading: "Hệ thống & Giao tiếp",
            items: [
                {
                    title: "Quản lý liên hệ",
                    path: "/Quan-ly/Lien-he",
                    icon: Mailbox
                }
            ]
        },

        {
            heading: null,
            role: [1],
            items: [
                {
                    title: "Quản lý newletters",
                    path: "/Quan-ly/Newletter",
                    icon: UserPlus2
                },
                {
                    title: "Quản lý banner",
                    path: "/Quan-ly/Banner",
                    icon: Images
                },
                {
                    title: "Quản lý bình luận",
                    path: "/Quan-ly/Binh-Luan",
                    icon: MessageSquare
                },
                {
                    title: "Quản lý ưu đãi",
                    path: "/Quan-ly/Uu-Dai",
                    icon: BadgePercent
                },
                {
                    title: "Quản lý thông tin trang",
                    path: "/Quan-ly/Thong-tin-trang",
                    icon: Columns3Cog
                }
            ]
        }
    ];

    return (
        <aside className="h-full w-85 flex flex-col fixed left-0 top-0 bg-slate-50 border-r border-slate-200 z-[100] overflow-y-auto antialiased">
            <div className="flex flex-col min-h-full p-6">

                <div className="mb-5 px-1 flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-xl shrink-0 bg-white border border-sky-100 overflow-hidden flex items-center justify-center shadow-sm">
                        <img
                            src={`${url}${webInfo.logo_url}`}
                            alt={webInfo.ten_trang}
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
                    {menuGroups.map((group, index) => {

                        if (group.role && !group.role.includes(role)) {
                            return null;
                        }

                        return (
                            <div key={index}>
                                {group.heading && (
                                    <MenuHeading title={group.heading} />
                                )}

                                {group.items.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            end={item.end}
                                            className={({ isActive }) =>
                                                isActive
                                                    ? activeLinkClass
                                                    : baseLinkClass
                                            }
                                        >
                                            <Icon size={16} />
                                            <span className="font-manrope tracking-tight">
                                                {item.title}
                                            </span>
                                        </NavLink>
                                    );
                                })}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}