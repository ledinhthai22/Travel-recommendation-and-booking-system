import { useEffect, useState } from "react";
import {
    BookOpen,
    User,
    Clock3,
    Star,
    ChevronRight,
    Camera
} from "lucide-react";

import { getUserProfileApi,getOverviewApi,getHistoryApi,getHistoryDetailApi } from "~/Services/UserProfile";
import UpdateUserProfileModal from "../admin/UserProfileManager/UpdateUserProfileModal";
import InputField from "~/components/UI/Form/InputField";
import ChangePasswordModal from "../admin/UserProfileManager/ChangePasswordModal";
import { formatCurrency } from "~/Helper/FormatCurrency";
import Pagination from "~/components/Common/Pagination";
import BookingDetailModal from "../admin/UserProfileManager/BookingDetailModal";
export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("overview");
    const [proFileData, setProFileData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    //overview
    const [overviewData, setOverviewData] = useState(null);
    const [isLoadingOverview, setIsLoadingOverview] = useState(true);
    //history
    const [historyData, setHistoryData] = useState({ items: [], pageNumber: 1, totalItems: 0, pageSize: 5 });
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    const fetchProfile = async () => {
        try {
            const data = await getUserProfileApi();
            setProFileData(data);
        } catch (error) {
            console.error("lỗi lấy dữ liệu người dùng", error);
        }
    };

    const fetchOverview = async () => {
        setIsLoadingOverview(true);
        try {
            const data = await getOverviewApi();
            setOverviewData(data);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu tổng quan", error);
        } finally {
            setIsLoadingOverview(false);
        }
    };

    const fetchHistory = async (page = 1, search = "") => {
        setIsLoadingHistory(true);
        try {
            const data = await getHistoryApi(page, 5, search);
            setHistoryData(data);
        } catch (error) {
            console.error("Lỗi lấy lịch sử đặt tour", error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
const [selectedBooking, setSelectedBooking] = useState(null);

const handleViewDetail = async (maDonDatTour) => {
    try {
        const data = await getHistoryDetailApi(maDonDatTour); 
        setSelectedBooking(data);
        setIsDetailModalOpen(true);
    } catch (error) {
        toastError("Không thể tải chi tiết đơn hàng!");
    }
};

    useEffect(() => {
        fetchProfile();
        fetchOverview();
    }, []);

    useEffect(() => {
        if (activeTab === "history") {
            fetchHistory(1, searchTerm);
        }
    }, [activeTab]);

    const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
        fetchHistory(1, searchTerm);
    }
};

    const user = {
        name: proFileData?.hoTen || "Người dùng",
        avatar: proFileData?.duongDanAnh ? `https://localhost:7016${proFileData.duongDanAnh}` : "https://i.pravatar.cc/200?img=32",
    };

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
    ];

    if (!proFileData) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const getStatusBadge = (status) => {
    switch (status) {
        case 1:
            return <span className="inline-flex rounded-full bg-yellow-50 px-4 py-2 text-sm text-yellow-600 border border-yellow-100">Chờ xác nhận</span>;
        case 2:
            return <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-600 border border-blue-100">Đã duyệt</span>;
        case 3:
            return <span className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-600 border border-emerald-100">Hoàn tất</span>;
        case 4:
            return <span className="inline-flex rounded-full bg-red-50 px-4 py-2 text-sm text-red-600 border border-red-100">Đã hủy</span>;
        default:
            return <span className="inline-flex rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-600 border border-slate-100">Không xác định</span>;
        }
    };

    const totalPages = Math.ceil((historyData.totalItems || 0) / (historyData.pageSize || 5)) || 1;

    return (
        <div className="min-h-[calc(100vh-120px)] mt-30">
            <div className="mx-auto max-w-[1400px] bg-white">

                {/* Layout */}
                <div className="grid lg:grid-cols-[300px_1fr] border rounded-2xl border-slate-200">

                    {/* SIDEBAR */}
                    <aside className="border-r border-slate-200 p-4">

                        <div className="mb-6 flex items-center gap-3">
                            {(!proFileData?.duongDanAnh || proFileData.duongDanAnh === "undefined" || proFileData.duongDanAnh === "null") ? (
                                // Nếu không có ảnh -> Hiện khung tròn chữ
                                <div className="h-14 w-14 flex items-center justify-center rounded-full bg-sky-500 text-white font-bold text-xl border border-slate-200 box-border shrink-0">
                                    {(proFileData?.hoTen || "UN").substring(0, 2).toUpperCase()}
                                </div>
                            ) : (
                                // Nếu có ảnh -> Hiện ảnh tròn
                                <img
                                    src={`https://localhost:7016${proFileData.duongDanAnh}`}
                                    alt="Avatar"
                                    className="h-14 w-14 rounded-full object-cover border border-slate-200 box-border shrink-0"
                                />
                            )}
                            <h2 className="font-semibold">{user.name}</h2>
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
                                            {Number(overviewData?.tongTour || 0)}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 p-4">
                                        <p className="text-sm text-slate-500">
                                            Đánh giá
                                        </p>

                                        <p className="mt-2 text-3xl font-bold">
                                            {Number(overviewData?.tongDanhGia || 0)}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-slate-200 p-4">
                                        <p className="text-sm text-slate-500">
                                            Tổng tiền đã chi
                                        </p>

                                        <p className="mt-2 text-3xl font-bold title={formatCurrency(overviewData?.tongTien)}">
                                            {formatCurrency(overviewData?.tongTien)}
                                        </p>
                                    </div>
                                </div>

                                {/* RECENT TOUR */}
                                <div>
                                    <div className="mb-5 flex items-center justify-between">
                                        <h3 className="font-semibold">
                                            Các tour đã đi gần đây
                                        </h3>

                                        <button className="text-sm text-sky-500 hover:text-sky-600"
                                        onClick={() => setActiveTab("history")}
                                        >
                                            Xem thêm
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {overviewData?.tours && overviewData.tours.length > 0 ? (
                                        overviewData.tours.map((tour,index) => (
                                            <div
                                                key={tour.maDonDaTour || index}
                                                className="grid items-center gap-4 md:grid-cols-[80px_1fr_120px_100px]"
                                            >
                                                <img
                                                    src={`https://localhost:7016${tour.duongDanAnh}`}
                                                    alt={tour.tenTour}
                                                    className="h-16 w-20 rounded-lg object-cover"
                                                />

                                                <div>
                                                    <h4 className="font-medium">
                                                        {tour.tenTour}
                                                    </h4>

                                                    <p className="text-sm text-slate-500">
                                                        {tour.ngayBatDau}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        {tour.diaDiem}
                                                    </p>
                                                </div>

                                                <div>
                                                    {getStatusBadge(tour.trangThai)}
                                                </div>

                                                <button className="text-sm text-sky-500 hover:text-sky-600"
                                                onClick={() => handleViewDetail(tour.maDonDatTour)}
                                                >
                                                    Xem chi tiết
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500 italic py-4">Bạn chưa có lịch sử đặt tour nào gần đây.</p>
                                    )}
                                    </div>
                                </div>
                                <BookingDetailModal
                                    isOpen={isDetailModalOpen}
                                    onClose={() => setIsDetailModalOpen(false)}
                                    booking={selectedBooking}
                                />
                            </>
                        )}
                        {activeTab === "profile" && (
                            <>
                                <h2 className="mb-6 text-xl font-bold">
                                    Thông tin cá nhân
                                </h2>

                                <div >
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                                        <InputField
                                            label="Họ và tên"
                                            value={proFileData?.hoTen || ""}
                                            readOnly
                                        />

                                        <InputField
                                            label="Email"
                                            value={proFileData?.email || ""}
                                            readOnly
                                        />

                                        <InputField
                                            label="Số điện thoại"
                                            value={proFileData?.soDienThoai || ""}
                                            readOnly
                                        />

                                        <InputField
                                            label="Ngày sinh"
                                            value={
                                                proFileData?.ngaySinh
                                                    ? new Date(proFileData.ngaySinh).toLocaleDateString("vi-VN")
                                                    : "Chưa cập nhật"
                                            }
                                            readOnly
                                        />

                                        <InputField
                                            label="Giới tính"
                                            value={
                                                proFileData
                                                    ? proFileData.gioiTinh
                                                        ? "Nam"
                                                        : "Nữ"
                                                    : ""
                                            }
                                            readOnly
                                        />

                                        <InputField
                                            label="Địa chỉ"
                                            value={proFileData?.diaChi || "Chưa cập nhật"}
                                            readOnly
                                        />
                                    </div>

                                    <div className="mt-8 border-t border-slate-200 pt-6">
                                        <h3 className="mb-4 text-lg font-bold text-slate-900">Bảo mật</h3>
                                        <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                                            <div>
                                                <p className="font-medium text-slate-900">Mật khẩu</p>
                                                <p className="text-sm text-slate-500">Cập nhật mật khẩu để bảo vệ tài khoản</p>
                                            </div>
                                            <button
                                                onClick={() => setIsPasswordModalOpen(true)}
                                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                            >
                                                Đổi mật khẩu
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-6 border-t border-slate-200 pt-4 text-right">
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="rounded-lg bg-sky-500 px-4 py-2 text-white transition hover:bg-sky-600"
                                        >
                                            Cập nhật
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                        {activeTab === "history" && (
                            <>
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-xl font-bold">Lịch sử đặt tour</h2>
                                    <div className="flex gap-2">
                                        <select 
                                            value={filterStatus}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setFilterStatus(val);
                                                fetchHistory(1, searchTerm, val ? parseInt(val) : null);
                                            }}
                                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                                        >
                                            <option value="">Tất cả trạng thái</option>
                                            <option value="1">Chờ xác nhận</option>
                                            <option value="2">Đã duyệt</option>
                                            <option value="3">Hoàn tất</option>
                                            <option value="4">Đã hủy</option>
                                        </select>
                                        <input
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && fetchHistory(1, searchTerm, filterStatus ? parseInt(filterStatus) : null)}
                                            placeholder="Tìm tour..."
                                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                                        />
                                        <button 
                                            onClick={() => fetchHistory(1, searchTerm, filterStatus ? parseInt(filterStatus) : null)}
                                            className="rounded-lg bg-sky-500 px-4 py-2 text-sm text-white hover:bg-sky-600 transition"
                                        >
                                            Tìm
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {isLoadingHistory ? (
                                        <p className="text-center text-slate-500 py-8">Đang tải dữ liệu...</p>
                                    ) : historyData.items && historyData.items.length > 0 ? (
                                        historyData.items.map((tour, index) => (
                                            <div
                                                key={tour.maDonDatTour || index}
                                                className="grid items-center gap-4 rounded-xl border border-slate-200 p-4 md:grid-cols-[100px_1fr_150px_120px] hover:shadow-md transition-shadow"
                                            >
                                                <img
                                                    src={tour.duongDanAnh ? `https://localhost:7016${tour.duongDanAnh}` : "https://placehold.co/150x100?text=No+Image"}
                                                    alt={tour.tenTour}
                                                    className="h-20 w-full rounded-lg object-cover"
                                                />
                                                <div>
                                                    <h3 className="font-semibold text-slate-900 line-clamp-1">{tour.tenTour}</h3>
                                                    <p className="text-sm text-slate-500 mt-1">Mã booking: {tour.maDatCho}</p>
                                                    <p className="text-sm text-slate-500">Ngày khởi hành: {tour.ngayBatDau}</p>
                                                </div>
                                                <div>
                                                    {getStatusBadge(tour.trangThai)}
                                                </div>
                                                <button className="text-sky-500 font-medium hover:text-sky-600 transition"
                                                onClick={() => handleViewDetail(tour.maDonDatTour)}
                                                >
                                                    Chi tiết
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center">
                                            <p className="text-slate-500">Không tìm thấy lịch sử đặt tour nào.</p>
                                        </div>
                                    )}
                                </div>

                                {totalPages && (
                                    <div className="mt-8">
                                       <Pagination
                                            currentPage={historyData.pageNumber}
                                            totalPages={totalPages}
                                            onPageChange={(newPage) => fetchHistory(newPage, searchTerm, filterStatus ? parseInt(filterStatus) : null)}
                                        />
                                    </div>
                                )}
                                <BookingDetailModal
                                    isOpen={isDetailModalOpen}
                                    onClose={() => setIsDetailModalOpen(false)}
                                    booking={selectedBooking}
                                />
                            </>
                        )}
                    </main>
                </div>
            </div>
            <UpdateUserProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                profileData={proFileData}
                onUpdateSuccess={fetchProfile}
            />
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
}