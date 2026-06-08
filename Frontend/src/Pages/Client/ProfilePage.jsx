import { useState } from "react";
import {
    BookOpen,
    User,
    Clock3,
    Star,
    ChevronRight,
    Camera
} from "lucide-react";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("overview");

    const user = {
        name: "User demo",
        avatar: "https://i.pravatar.cc/200?img=32",
        totalTours: 8,
        totalReviews: 8,
        totalSpent: 8,
    };

    const tours = [
        {
            id: 1,
            name: "Tên tour 1",
            startDate: "Ngày khởi hành",
            location: "Địa điểm khởi hành",
            image:
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500",
        },
        {
            id: 2,
            name: "Tên tour 1",
            startDate: "Ngày khởi hành",
            location: "Địa điểm khởi hành",
            image:
                "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500",
        },
        {
            id: 3,
            name: "Tên tour 1",
            startDate: "Ngày khởi hành",
            location: "Địa điểm khởi hành",
            image:
                "https://images.unsplash.com/photo-1511497584788-876760111969?w=500",
        },
        {
            id: 4,
            name: "Tên tour 1",
            startDate: "Ngày khởi hành",
            location: "Địa điểm khởi hành",
            image:
                "https://images.unsplash.com/photo-1494526585095-c41746248156?w=500",
        },
        {
            id: 5,
            name: "Tên tour 1",
            startDate: "Ngày khởi hành",
            location: "Địa điểm khởi hành",
            image:
                "https://images.unsplash.com/photo-1494526585095-c41746248156?w=500",
        },
    ];

    const menus = [
        {
            id: "overview",
            label: "Tổng quan",
            icon: BookOpen,
        },
        {
            id: "profile",
            label: "Thông tin cá nhân",
            icon: User,
        },
        {
            id: "history",
            label: "Lịch sử đặt tour",
            icon: Clock3,
        },
        {
            id: "review",
            label: "Đánh giá",
            icon: Star,
        },
    ];

    return (
        <div className="min-h-[70vh] mt-30">
            <div className="mx-auto max-w-[1400px] bg-white">

                {/* Layout */}
                <div className="grid lg:grid-cols-[300px_1fr] border rounded-2xl border-slate-200">

                    {/* SIDEBAR */}
                    <aside className="border-r border-slate-200 p-4">

                        <div className="mb-6 flex items-center gap-3">
                            <div className="relative">
                                <img
                                    src={user.avatar}
                                    alt=""
                                    className="h-14 w-14 rounded-full object-cover"
                                />

                                <button className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow">
                                    <Camera size={10} />
                                </button>
                            </div>

                            <h2 className="font-semibold">
                                {user.name}
                            </h2>
                        </div>

                        <div className="space-y-2">
                            {menus.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() =>
                                            setActiveTab(item.id)
                                        }
                                        className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm transition
                                            ${activeTab === item.id
                                                ? "bg-sky-500 text-white"
                                                : "text-slate-600 hover:bg-slate-100"
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            <Icon size={15} />
                                            {item.label}
                                        </span>

                                        {activeTab === item.id && (
                                            <ChevronRight size={16} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    {/* CONTENT */}
                    <main className="p-10 ml-2 ">

                        {activeTab === "overview" && (
                            <>
                                <h2 className="mb-6 text-xl font-bold">
                                    Tổng quan tài khoản
                                </h2>

                                {/* STATS */}
                                <div className="mb-10 grid gap-4 md:grid-cols-3">
                                    <div className="rounded-xl border border-slate-200 p-4">
                                        <p className="text-sm text-slate-500">
                                            Số tour đã đặt
                                        </p>

                                        <p className="mt-2 text-3xl font-bold">
                                            {user.totalTours}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 p-4">
                                        <p className="text-sm text-slate-500">
                                            Đánh giá
                                        </p>

                                        <p className="mt-2 text-3xl font-bold">
                                            {user.totalReviews}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 p-4">
                                        <p className="text-sm text-slate-500">
                                            Tổng tiền đã chi
                                        </p>

                                        <p className="mt-2 text-3xl font-bold">
                                            {user.totalSpent}
                                        </p>
                                    </div>
                                </div>

                                {/* RECENT TOUR */}
                                <div>
                                    <div className="mb-5 flex items-center justify-between">
                                        <h3 className="font-semibold">
                                            Các tour đã đi gần đây
                                        </h3>

                                        <button className="text-sm text-sky-500 hover:text-sky-600">
                                            Xem thêm
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {tours.map((tour) => (
                                            <div
                                                key={tour.id}
                                                className="grid items-center gap-4 md:grid-cols-[80px_1fr_120px_100px]"
                                            >
                                                <img
                                                    src={tour.image}
                                                    alt=""
                                                    className="h-16 w-20 rounded-lg object-cover"
                                                />

                                                <div>
                                                    <h4 className="font-medium">
                                                        {tour.name}
                                                    </h4>

                                                    <p className="text-sm text-slate-500">
                                                        {tour.startDate}
                                                    </p>

                                                    <p className="text-sm text-slate-500">
                                                        {tour.location}
                                                    </p>
                                                </div>

                                                <div>
                                                    <span className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-600">
                                                        Trạng thái
                                                    </span>
                                                </div>

                                                <button className="text-sm text-sky-500 hover:text-sky-600">
                                                    Xem chi tiết
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                        {activeTab === "profile" && (
                            <>
                                <h2 className="mb-6 text-xl font-bold">
                                    Thông tin cá nhân
                                </h2>

                                <div className="rounded-xl border border-slate-200">
                                    <div className="grid md:grid-cols-2">
                                        <div className="border-b border-r border-slate-200 p-4">
                                            <p className="text-sm text-slate-500">
                                                Họ và tên
                                            </p>

                                            <p className="mt-1 font-medium">
                                                Nguyễn Văn A
                                            </p>
                                        </div>

                                        <div className="border-b border-slate-200 p-4">
                                            <p className="text-sm text-slate-500">
                                                Email
                                            </p>

                                            <p className="mt-1 font-medium">
                                                nguyenvana@gmail.com
                                            </p>
                                        </div>

                                        <div className="border-r border-slate-200 p-4">
                                            <p className="text-sm text-slate-500">
                                                Số điện thoại
                                            </p>

                                            <p className="mt-1 font-medium">
                                                0901234567
                                            </p>
                                        </div>

                                        <div className="p-4">
                                            <p className="text-sm text-slate-500">
                                                Địa chỉ
                                            </p>

                                            <p className="mt-1 font-medium">
                                                TP.HCM
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-200 p-4 text-right">
                                        <button className="rounded-lg bg-sky-500 px-4 py-2 text-white">
                                            Cập nhật
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                        {activeTab === "history" && (
                            <>
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-xl font-bold">
                                        Lịch sử đặt tour
                                    </h2>

                                    <input
                                        placeholder="Tìm tour..."
                                        className="rounded-lg border px-3 py-2"
                                    />
                                </div>

                                <div className="space-y-4">
                                    {tours.map((tour) => (
                                        <div
                                            key={tour.id}
                                            className="grid items-center gap-4 rounded-xl border border-slate-200 p-4 md:grid-cols-[100px_1fr_150px_120px]"
                                        >
                                            <img
                                                src={tour.image}
                                                alt=""
                                                className="h-20 w-full rounded-lg object-cover"
                                            />

                                            <div>
                                                <h3 className="font-semibold">
                                                    {tour.name}
                                                </h3>

                                                <p className="text-sm text-slate-500">
                                                    Mã booking: BK0001
                                                </p>

                                                <p className="text-sm text-slate-500">
                                                    Ngày khởi hành: 12/06/2026
                                                </p>
                                            </div>

                                            <div>
                                                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-600">
                                                    Đã thanh toán
                                                </span>
                                            </div>

                                            <button className="text-sky-500">
                                                Chi tiết
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {activeTab === "review" && (
                            <>
                                <h2 className="mb-6 text-xl font-bold">
                                    Đánh giá của tôi
                                </h2>

                                <div className="space-y-4">
                                    {[1, 2, 3].map((item) => (
                                        <div
                                            key={item}
                                            className="rounded-xl border border-slate-200 p-4"
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <h3 className="font-semibold">
                                                    Tour Đà Lạt 3N2Đ
                                                </h3>

                                                <span className="text-yellow-500">
                                                    ★★★★★
                                                </span>
                                            </div>

                                            <p className="text-sm text-slate-600">
                                                Tour rất tốt, hướng dẫn viên nhiệt tình,
                                                khách sạn sạch sẽ.
                                            </p>

                                            <div className="mt-3 flex gap-3">
                                                <button className="text-sky-500">
                                                    Chỉnh sửa
                                                </button>

                                                <button className="text-red-500">
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}