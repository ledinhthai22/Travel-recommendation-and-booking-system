import { useEffect, useState } from "react";
import {
    BookOpen,
    User,
    Clock3,
    ChevronRight,
    Search,
    Calendar,
    MapPin
} from "lucide-react";

import { getUserProfileApi, getOverviewApi, getHistoryApi, getHistoryDetailApi } from "~/Services/UserProfile";
import UpdateUserProfileModal from "../admin/UserProfileManager/UpdateUserProfileModal";
import InputField from "~/components/UI/Form/InputField";
import ChangePasswordModal from "../admin/UserProfileManager/ChangePasswordModal";
import { formatCurrency } from "~/Helper/FormatCurrency";
import Pagination from "~/components/Common/Pagination";
import BookingDetailModal from "../admin/UserProfileManager/BookingDetailModal";
import SelectField from "~/components/UI/Form/SelectField";
import { useSearchParams, useLocation } from "react-router-dom";

export default function ProfilePage() {
    // State
    const [activeTab, setActiveTab] = useState("overview");
    const [proFileData, setProFileData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // Overview
    const [overviewData, setOverviewData] = useState(null);
    const [isLoadingOverview, setIsLoadingOverview] = useState(true);

    // History
    const [historyData, setHistoryData] = useState({ 
        items: [], 
        pageNumber: 1, 
        totalItems: 0, 
        pageSize: 5 
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    // Xử lý chuyển tab từ Checkout hoặc các trang khác
    useEffect(() => {
        // Kiểm tra state từ navigate
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
            // Xóa state để không bị lặp lại
            window.history.replaceState({}, document.title);
        }

        // Xử lý từ query param (mở chi tiết booking)
        const openId = searchParams.get("open");
        if (openId) {
            setActiveTab("history");           
            handleViewDetail(Number(openId));  
            const next = new URLSearchParams(searchParams);
            next.delete("open");
            setSearchParams(next, { replace: true });
        }
    }, [location.state, searchParams]);

    // API Calls
    const fetchProfile = async () => {
        try {
            const data = await getUserProfileApi();
            setProFileData(data);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu người dùng", error);
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

    const fetchHistory = async (page = 1, search = "", status = null) => {
        setIsLoadingHistory(true);
        try {
            const data = await getHistoryApi(page, 5, search, status);
            setHistoryData(data);
        } catch (error) {
            console.error("Lỗi lấy lịch sử đặt tour", error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const handleViewDetail = async (maDonDatTour) => {
        try {
            const data = await getHistoryDetailApi(maDonDatTour);
            setSelectedBooking(data);
            setIsDetailModalOpen(true);
        } catch (error) {
            console.error("Không thể tải chi tiết đơn hàng!");
        }
    };

    // Effects
    useEffect(() => {
        fetchProfile();
        fetchOverview();
    }, []);

    useEffect(() => {
        if (activeTab === "history") {
            fetchHistory(1, searchTerm, filterStatus ? parseInt(filterStatus) : null);
        }
    }, [activeTab]);

    // Helpers
    const user = {
        name: proFileData?.hoTen || "Người dùng",
    };

    const menus = [
        { id: "overview", label: "Tổng quan tài khoản", icon: BookOpen },
        { id: "profile", label: "Thông tin cá nhân", icon: User },
        { id: "history", label: "Lịch sử đặt tour", icon: Clock3 },
    ];

    const getStatusBadge = (status) => {
        const configs = {
            1: "bg-amber-50 text-amber-700 border-amber-100/80 rounded-lg px-3 py-1.5 text-xs font-medium border",
            2: "bg-blue-50 text-blue-700 border-blue-100/80 rounded-lg px-3 py-1.5 text-xs font-medium border",
            3: "bg-emerald-50 text-emerald-700 border-emerald-100/80 rounded-lg px-3 py-1.5 text-xs font-medium border",
            4: "bg-rose-50 text-rose-700 border-rose-100/80 rounded-lg px-3 py-1.5 text-xs font-medium border"
        };
        const texts = { 1: "Chờ xác nhận", 2: "Đã duyệt", 3: "Hoàn tất", 4: "Đã hủy" };

        return (
            <span className={configs[status] || "bg-slate-50 text-slate-700 border-slate-100 rounded-lg px-3 py-1.5 text-xs font-medium border"}>
                {texts[status] || "Không xác định"}
            </span>
        );
    };

    const totalPages = Math.ceil((historyData.totalItems || 0) / (historyData.pageSize || 5)) || 1;

    // Loading state
    if (!proFileData) {
        return (
            <div className="flex h-[70vh] items-center justify-center bg-slate-50/50">
                <div className="relative flex h-12 w-12 items-center justify-center">
                    <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></div>
                    <div className="relative inline-flex rounded-full h-8 w-8 bg-sky-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/60 pb-16 mt-25">
            <div className="mx-auto max-w-[1340px] px-4 lg:px-6">
                <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
                    
                    {/* SIDEBAR */}
                    <aside className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm sticky top-24">
                        <div className="mb-6 flex items-center gap-3.5 pb-5 border-b border-slate-100">
                            {(!proFileData?.duongDanAnh || proFileData.duongDanAnh === "undefined" || proFileData.duongDanAnh === "null") ? (
                                <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white font-bold text-lg shadow-sm shrink-0">
                                    {(proFileData?.hoTen || "UN").substring(0, 2).toUpperCase()}
                                </div>
                            ) : (
                                <img
                                    src={`https://localhost:7016${proFileData.duongDanAnh}`}
                                    alt="Avatar"
                                    className="h-12 w-12 rounded-xl object-cover ring-2 ring-sky-500/10 shrink-0"
                                />
                            )}
                            <div className="overflow-hidden">
                                <p className="text-xs text-slate-400 font-medium">Xin chào,</p>
                                <h2 className="font-semibold text-slate-800 truncate text-base">{user.name}</h2>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            {menus.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                                            ${isActive
                                                ? "bg-sky-500 text-white shadow-md shadow-sky-500/15 translate-x-1"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                            }`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <Icon size={17} className={isActive ? "text-white" : "text-slate-400"} />
                                            {item.label}
                                        </span>
                                        {isActive && <ChevronRight size={15} className="opacity-80" />}
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* MAIN CONTENT */}
                    <main className="bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 shadow-sm min-h-[600px]">

                        {/* TAB: OVERVIEW */}
                        {activeTab === "overview" && (
                            <div className="animate-fadeIn">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-slate-800">Tổng quan tài khoản</h2>
                                    <p className="text-xs text-slate-400 mt-1">Theo dõi hoạt động và các chỉ số đặt tài khoản của bạn</p>
                                </div>

                                <div className="mb-8 grid gap-4 sm:grid-cols-3">
                                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:bg-white hover:border-sky-100 hover:shadow-sm">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Số tour đã đặt</p>
                                        <p className="mt-2 text-3xl font-bold text-slate-800">{Number(overviewData?.tongTour || 0)}</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:bg-white hover:border-sky-100 hover:shadow-sm">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tổng số đánh giá</p>
                                        <p className="mt-2 text-3xl font-bold text-slate-800">{Number(overviewData?.tongDanhGia || 0)}</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 transition-all hover:bg-white hover:border-sky-100 hover:shadow-sm">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tổng tiền đã chi</p>
                                        <p className="mt-2 text-2xl font-bold text-sky-600 truncate">{formatCurrency(overviewData?.tongTien)}</p>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
                                        <h3 className="font-bold text-slate-800 text-base">Hành trình gần đây</h3>
                                        <button onClick={() => setActiveTab("history")} className="text-xs font-semibold text-sky-500 hover:text-sky-600 transition">
                                            Xem tất cả
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {overviewData?.tours && overviewData.tours.length > 0 ? (
                                            overviewData.tours.map((tour, index) => (
                                                <div key={tour.maDonDatTour || index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 gap-4 hover:border-slate-200/80 hover:shadow-xs transition-all bg-white">
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            src={`https://localhost:7016${tour.duongDanAnh}`}
                                                            alt={tour.tenTour}
                                                            className="h-16 w-20 rounded-lg object-cover bg-slate-100 shrink-0"
                                                        />
                                                        <div>
                                                            <h4 className="font-semibold text-slate-800 line-clamp-1 text-sm sm:text-base">{tour.tenTour}</h4>
                                                            <div className="flex gap-4 text-xs text-slate-400 mt-2 flex-wrap items-center">
                                                                <span className="flex items-center gap-1.5">
                                                                    <Calendar size={13} className="text-slate-400 shrink-0" />
                                                                    Khởi hành: {tour.ngayBatDau}
                                                                </span>
                                                                <span className="flex items-center gap-1.5">
                                                                    <MapPin size={13} className="text-slate-400 shrink-0" />
                                                                    {tour.diaDiem}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-0 pt-3 sm:pt-0">
                                                        {getStatusBadge(tour.trangThai)}
                                                        <button
                                                            onClick={() => handleViewDetail(tour.maDonDatTour)}
                                                            className="text-xs font-semibold text-sky-500 hover:bg-sky-50 px-3 py-1.5 rounded-lg transition"
                                                        >
                                                            Chi tiết
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/40">
                                                <p className="text-xs sm:text-sm text-slate-400 font-medium italic">
                                                    Bạn chưa có lịch sử đặt tour nào gần đây.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <BookingDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} booking={selectedBooking} onSuccess={fetchOverview} />
                            </div>
                        )}

                        {/* TAB: PROFILE */}
                        {activeTab === "profile" && (
                            <div className="animate-fadeIn">
                                <div className="mb-6">
                                    <h2 className="text-xl font-bold text-slate-800">Thông tin cá nhân</h2>
                                    <p className="text-xs text-slate-400 mt-1 font-medium">Quản lý và cập nhật thông tin tài khoản của bạn</p>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2 bg-slate-50/40 p-5 rounded-xl border border-slate-100">
                                    <InputField label="Họ và tên" value={proFileData?.hoTen || ""} readOnly className="bg-white" />
                                    <InputField label="Email" value={proFileData?.email || ""} readOnly className="bg-white" />
                                    <InputField label="Số điện thoại" value={proFileData?.soDienThoai || ""} readOnly className="bg-white" />
                                    <InputField label="Ngày sinh" value={proFileData?.ngaySinh ? new Date(proFileData.ngaySinh).toLocaleDateString("vi-VN") : "Chưa cập nhật"} readOnly className="bg-white" />
                                    <InputField label="Giới tính" value={proFileData ? (proFileData.gioiTinh ? "Nam" : "Nữ") : ""} readOnly className="bg-white" />
                                    <InputField label="Địa chỉ" value={proFileData?.diaChi || "Chưa cập nhật"} readOnly className="bg-white" />
                                </div>

                                <div className="mt-8 border-t border-slate-100 pt-6">
                                    <h3 className="mb-3 text-base font-bold text-slate-800">Bảo mật hệ thống</h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-100 p-4 gap-4">
                                        <div>
                                            <p className="font-semibold text-slate-800 text-sm">Mật khẩu đăng nhập</p>
                                            <p className="text-xs text-slate-400 mt-0.5">Bạn nên cập nhật mật khẩu định kỳ để bảo vệ tài khoản tốt nhất</p>
                                        </div>
                                        <button onClick={() => setIsPasswordModalOpen(true)} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 tracking-wide shrink-0">
                                            Đổi mật khẩu
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-6 text-right">
                                    <button onClick={() => setIsModalOpen(true)} className="rounded-xl bg-sky-500 px-6 py-2.5 text-xs font-bold text-white tracking-wide shadow-md shadow-sky-500/10 hover:bg-sky-600 transition">
                                        Cập nhật hồ sơ
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* TAB: HISTORY */}
                        {activeTab === "history" && (
                            <div className="animate-fadeIn">
                                <div className="mb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-100 pb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800">Lịch sử đặt tour</h2>
                                        <p className="text-xs text-slate-400 mt-1 font-medium">Danh sách toàn bộ các chuyến đi của bạn</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 w-full lg:w-auto">
                                        <div className="w-full sm:w-48 shrink-0">
                                            <SelectField
                                                value={filterStatus}
                                                onChange={(value) => {
                                                    setFilterStatus(value);
                                                    fetchHistory(1, searchTerm, value ? parseInt(value) : null);
                                                }}
                                                options={[
                                                    { value: "", label: "Tất cả trạng thái" },
                                                    { value: "1", label: "Chờ xác nhận" },
                                                    { value: "2", label: "Đã duyệt" },
                                                    { value: "3", label: "Hoàn tất" },
                                                    { value: "4", label: "Đã hủy" },
                                                ]}
                                                valueKey="value"
                                                labelKey="label"
                                                placeholder="Tất cả trạng thái"
                                                className="w-full"
                                            />
                                        </div>

                                        <div className="flex items-end gap-2 flex-1 sm:flex-none">
                                            <div className="relative flex-1 sm:flex-none">
                                                <InputField
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            fetchHistory(1, searchTerm, filterStatus ? parseInt(filterStatus) : null);
                                                        }
                                                    }}
                                                    placeholder="Tìm tên tour..."
                                                    className="rounded-xl border border-slate-200 pl-8 pr-3 py-3 text-sm text-slate-600 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition w-full sm:w-56"
                                                />
                                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            </div>

                                            <button
                                                onClick={() => fetchHistory(1, searchTerm, filterStatus ? parseInt(filterStatus) : null)}
                                                className="rounded-xl bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-600 shadow-sm shadow-sky-500/10 transition whitespace-nowrap h-[42px] flex items-center justify-center"
                                            >
                                                Tìm kiếm
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {isLoadingHistory ? (
                                        <p className="text-center text-slate-400 text-xs py-12 italic font-medium">
                                            Đang đồng bộ dữ liệu lịch sử...
                                        </p>
                                    ) : historyData.items && historyData.items.length > 0 ? (
                                        historyData.items.map((tour, index) => (
                                            <div
                                                key={tour.maDonDatTour || index}
                                                className="grid items-center gap-4 rounded-xl border border-slate-100 p-4 md:grid-cols-[90px_1fr_130px_90px] hover:border-slate-200 hover:shadow-sm transition-all duration-200 bg-white"
                                            >
                                                <img
                                                    src={tour.duongDanAnh ? `https://localhost:7016${tour.duongDanAnh}` : "https://placehold.co/150x100?text=No+Image"}
                                                    alt={tour.tenTour}
                                                    className="h-16 w-full rounded-lg object-cover bg-slate-100"
                                                />
                                                <div>
                                                    <h3 className="font-bold text-slate-800 line-clamp-1 text-sm sm:text-base">{tour.tenTour}</h3>
                                                    <p className="text-xs text-slate-400 mt-1 font-medium">
                                                        Mã Booking: <span className="text-slate-600 font-semibold">{tour.maDatCho}</span>
                                                    </p>
                                                    <p className="text-xs text-slate-400 font-medium">
                                                        Khởi hành: <span className="text-slate-500 font-medium">{tour.ngayBatDau}</span>
                                                    </p>
                                                </div>
                                                <div className="flex md:justify-center">
                                                    {getStatusBadge(tour.trangThai)}
                                                </div>
                                                <div className="text-right border-t md:border-0 pt-3 md:pt-0 mt-2 md:mt-0">
                                                    <button
                                                        onClick={() => handleViewDetail(tour.maDonDatTour)}
                                                        className="text-xs font-bold text-sky-500 hover:bg-sky-50 px-3 py-1.5 rounded-lg transition w-full md:w-auto text-center"
                                                    >
                                                        Chi tiết
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center bg-slate-50/20">
                                            <p className="text-slate-400 text-xs italic font-medium">
                                                Không tìm thấy lịch sử đặt chuyến đi nào phù hợp.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {totalPages > 1 && (
                                    <div className="mt-6 flex justify-center">
                                        <Pagination
                                            currentPage={historyData.pageNumber}
                                            totalPages={totalPages}
                                            onPageChange={(newPage) => fetchHistory(newPage, searchTerm, filterStatus ? parseInt(filterStatus) : null)}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Modals */}
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
            <BookingDetailModal 
                isOpen={isDetailModalOpen} 
                onClose={() => setIsDetailModalOpen(false)} 
                booking={selectedBooking} 
                onSuccess={() =>
                    fetchHistory(
                        historyData.pageNumber,
                        searchTerm,
                        filterStatus ? parseInt(filterStatus) : null
                    )
                }
            />
        </div>
    );
}