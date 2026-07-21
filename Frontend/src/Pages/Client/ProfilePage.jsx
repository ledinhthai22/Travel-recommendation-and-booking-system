import { useEffect, useState, useCallback, useMemo } from "react";
import {
    BookOpen,
    User,
    Clock3,
    ChevronRight,
    Search,
    Calendar,
    MapPin,
    CreditCard,
    Star,
    Shield,
    X,
    ChevronDown,
    AlertCircle,
    MessageSquare,
    Eye
} from "lucide-react";
import {
    getUserProfileApi,
    getAccountOverviewApi,
    getBookingHistoryApi,
    getBookingDetailApi,
    getUserReviewsApi,
} from "~/Services/UserProfile";
import { getReviewDetailApi } from "~/Services/ReviewService";
import UpdateUserProfileModal from "../admin/UserProfileManager/UpdateUserProfileModal";
import ChangePasswordModal from "../admin/UserProfileManager/ChangePasswordModal";
import { formatCurrency } from "~/Helper/FormatCurrency";
import Pagination from "~/components/Common/Pagination";
import BookingDetailModal from "../admin/UserProfileManager/BookingDetailModal";
import ReviewFormModal from "../admin/UserProfileManager/ReviewFormModal";
import SelectField from "~/components/UI/Form/SelectField";
import { useSearchParams, useLocation } from "react-router-dom";
import { toastError, toastSuccess } from "~/utils/Toast";

const ORDER_STATUS = {
    CHO_THANH_TOAN: 1,
    CHO_DUYET: 2,
    DA_DUYET: 3,
    DANG_DIEN_RA: 4,
    HOAN_TAT: 5,
    DA_HUY: 6
};

const FINANCIAL_STATUS = {
    CHUA_THANH_TOAN: 0,
    DA_DAT_COC: 1,
    DA_THANH_TOAN_DU: 2,
    DANG_HOAN_TIEN: 3,
    DA_HOAN_TIEN: 4,
    MAT_COC: 5
};

const isOrderCancelled = (status) => status === ORDER_STATUS.DA_HUY;

const getDisplayFinancialStatus = (tour) => {
    if (isOrderCancelled(tour.trangThai)) {
        return tour.trangThaiTaiChinh ?? FINANCIAL_STATUS.CHUA_THANH_TOAN;
    }
    const daThanhToan = tour.soTienDaThanhToan || 0;
    const tongTien = tour.tongTien || 0;
    if (tongTien > 0 && daThanhToan >= tongTien) return FINANCIAL_STATUS.DA_THANH_TOAN_DU;
    if (daThanhToan > 0) return FINANCIAL_STATUS.DA_DAT_COC;
    return FINANCIAL_STATUS.CHUA_THANH_TOAN;
};

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("overview");
    const [profileData, setProfileData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [overviewData, setOverviewData] = useState(null);
    const [isLoadingOverview, setIsLoadingOverview] = useState(true);
    const [selectedYear, setSelectedYear] = useState("");
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
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [reviewData, setReviewData] = useState({
        items: [],
        pageNumber: 1,
        totalItems: 0,
        pageSize: 5
    });
    const [reviewSearchTerm, setReviewSearchTerm] = useState("");
    const [filterRating, setFilterRating] = useState("");
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [isReviewDetailOpen, setIsReviewDetailOpen] = useState(false);
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
    const [reviewBooking, setReviewBooking] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const [isLoadingReviewDetail, setIsLoadingReviewDetail] = useState(false);

    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const options = [{ value: "", label: "Tất cả các năm" }];
        for (let i = 0; i < 5; i++) {
            const y = (currentYear - i).toString();
            options.push({ value: y, label: `Năm ${y}` });
        }
        return options;
    }, []);

    const fetchProfile = useCallback(async () => {
        try {
            const data = await getUserProfileApi();
            setProfileData(data);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu người dùng", error);
        }
    }, []);

    const fetchOverview = useCallback(async (year = "") => {
        setIsLoadingOverview(true);
        try {
            const yearParam = year && year !== '' ? parseInt(year) : null;
            const data = await getAccountOverviewApi(yearParam);
            setOverviewData(data);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu tổng quan:", error);
            setOverviewData({ tongTour: 0, tongDanhGia: 0, tongTien: 0, tours: [] });
            toastError("Không thể tải dữ liệu tổng quan");
        } finally {
            setIsLoadingOverview(false);
        }
    }, []);

    const fetchHistory = useCallback(async (page = 1, search = "", status = null) => {
        setIsLoadingHistory(true);
        try {
            const data = await getBookingHistoryApi(page, 5, search, status);
            setHistoryData(data);
        } catch (error) {
            console.error("Lỗi lấy lịch sử đặt tour", error);
        } finally {
            setIsLoadingHistory(false);
        }
    }, []);

    const fetchReviews = useCallback(async (page = 1, search = "", rating = null) => {
        setIsLoadingReviews(true);
        try {
            const data = await getUserReviewsApi(page, 5, search, rating);
            setReviewData(data);
        } catch (error) {
            console.error("Lỗi lấy lịch sử đánh giá", error);
        } finally {
            setIsLoadingReviews(false);
        }
    }, []);

    const fetchReviewDetail = useCallback(async (maDanhGia) => {
        setIsLoadingReviewDetail(true);
        try {
            const data = await getReviewDetailApi(maDanhGia);
            return data;
        } catch (error) {
            console.error("Lỗi lấy chi tiết đánh giá:", error);
            toastError("Không thể tải chi tiết đánh giá");
            return null;
        } finally {
            setIsLoadingReviewDetail(false);
        }
    }, []);

    const refreshAllData = useCallback(() => {
        fetchHistory(historyData.pageNumber, searchTerm, filterStatus ? parseInt(filterStatus) : null);
        fetchOverview(selectedYear);
        fetchReviews(reviewData.pageNumber, reviewSearchTerm, filterRating ? parseInt(filterRating) : null);
    }, [
        fetchHistory, historyData.pageNumber, searchTerm, filterStatus,
        fetchOverview, selectedYear,
        fetchReviews, reviewData.pageNumber, reviewSearchTerm, filterRating
    ]);

    const handleViewDetail = useCallback(async (maDonDatTour) => {
        try {
            const data = await getBookingDetailApi(maDonDatTour);
            if (data) {
                setSelectedBooking(data);
                setIsDetailModalOpen(true);
            } else {
                toastError("Không thể tải chi tiết đơn hàng!");
            }
        } catch (error) {
            console.error("Không thể tải chi tiết đơn hàng!", error);
            toastError(error.response?.data?.message || "Không thể tải chi tiết đơn hàng!");
        }
    }, []);

    const handleViewReview = useCallback(async (review) => {
        if (review && review.maDanhGia) {
            if (!review.noiDung && !review.chiTietDanhGia) {
                const detailData = await fetchReviewDetail(review.maDanhGia);
                if (detailData) {
                    setSelectedReview(detailData);
                    setIsReviewDetailOpen(true);
                }
            } else {
                setSelectedReview(review);
                setIsReviewDetailOpen(true);
            }
        }
    }, [fetchReviewDetail]);

    const handleOpenReviewForm = useCallback((tour) => {
        setReviewBooking(tour);
        setIsReviewFormOpen(true);
    }, []);

    const handleCloseReviewForm = useCallback(() => {
        setIsReviewFormOpen(false);
        setReviewBooking(null);
    }, []);

    const handleCloseDetailModal = useCallback(() => {
        setIsDetailModalOpen(false);
        setSelectedBooking(null);
    }, []);

    const handleCloseReviewDetail = useCallback(() => {
        setIsReviewDetailOpen(false);
        setSelectedReview(null);
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
            window.history.replaceState({}, document.title);
        }
        const openId = searchParams.get("open");
        if (openId) {
            setActiveTab("history");
            handleViewDetail(Number(openId));
            const next = new URLSearchParams(searchParams);
            next.delete("open");
            setSearchParams(next, { replace: true });
        }
    }, [location.state, searchParams, handleViewDetail, setSearchParams]);

    useEffect(() => {
        if (activeTab === "overview") {
            fetchOverview(selectedYear);
        }
        if (activeTab === "history") {
            fetchHistory(1, searchTerm, filterStatus ? parseInt(filterStatus) : null);
        }
        if (activeTab === "reviews") {
            fetchReviews(1, reviewSearchTerm, filterRating ? parseInt(filterRating) : null);
        }
    }, [activeTab, selectedYear, fetchOverview, fetchHistory, fetchReviews, searchTerm, filterStatus, reviewSearchTerm, filterRating]);

    const getStatusBadge = useCallback((status) => {
        const configs = {
            1: { color: "bg-amber-50 text-amber-700 border-amber-200", label: "Chờ thanh toán", dot: "bg-amber-400" },
            2: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "Chờ duyệt", dot: "bg-blue-400" },
            3: { color: "bg-sky-50 text-sky-700 border-sky-200", label: "Đã duyệt", dot: "bg-sky-400" },
            4: { color: "bg-indigo-50 text-indigo-700 border-indigo-200", label: "Đang diễn ra", dot: "bg-indigo-400" },
            5: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Hoàn tất", dot: "bg-emerald-400" },
            6: { color: "bg-red-50 text-red-700 border-red-200", label: "Đã hủy", dot: "bg-red-400" }
        };
        const cfg = configs[status] || { color: "bg-slate-50 text-slate-700 border-slate-200", label: "Không xác định", dot: "bg-slate-300" };
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${cfg.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
            </span>
        );
    }, []);

    const getFinancialBadge = useCallback((status) => {
        const configs = {
            0: { color: "bg-slate-100 text-slate-600 border-slate-200", label: "Chưa thanh toán" },
            1: { color: "bg-amber-50 text-amber-700 border-amber-200", label: "Đã đặt cọc" },
            2: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Đã thanh toán đủ" },
            3: { color: "bg-purple-50 text-purple-700 border-purple-200", label: "Đang hoàn tiền" },
            4: { color: "bg-green-50 text-green-700 border-green-200", label: "Đã hoàn tiền" },
            5: { color: "bg-red-50 text-red-700 border-red-200", label: "Mất cọc" }
        };
        const cfg = configs[status] || { color: "bg-slate-100 text-slate-500 border-slate-200", label: "Không xác định" };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-medium border ${cfg.color}`}>
                {cfg.label}
            </span>
        );
    }, []);

    const renderStars = useCallback((rating) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={14}
                        className={star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}
                    />
                ))}
            </div>
        );
    }, []);

    const user = useMemo(() => ({
        name: profileData?.hoTen || "Người dùng",
        email: profileData?.email || "",
        phone: profileData?.soDienThoai || "",
        avatar: profileData?.duongDanAnh,
    }), [profileData]);

    const stats = useMemo(() => [
        { label: "Tour đã đặt", value: Number(overviewData?.tongTour || 0), icon: Calendar, color: "text-sky-500", bgColor: "bg-sky-50" },
        { label: "Đánh giá đã gửi", value: Number(overviewData?.tongDanhGia || 0), icon: Star, color: "text-amber-500", bgColor: "bg-amber-50" },
        { label: "Tổng chi tiêu", value: formatCurrency(overviewData?.tongTien), icon: CreditCard, color: "text-emerald-500", bgColor: "bg-emerald-50" },
    ], [overviewData]);

    const menus = useMemo(() => [
        { id: "overview", label: "Tổng quan", icon: BookOpen },
        { id: "profile", label: "Thông tin cá nhân", icon: User },
        { id: "history", label: "Lịch sử đặt tour", icon: Clock3 },
        { id: "reviews", label: "Đánh giá của tôi", icon: MessageSquare },
    ], []);

    const totalPages = Math.ceil((historyData.totalItems || 0) / (historyData.pageSize || 5)) || 1;
    const totalReviewPages = Math.ceil((reviewData.totalItems || 0) / (reviewData.pageSize || 5)) || 1;

    if (!profileData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/50">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-sky-200 border-t-sky-500 animate-spin" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 mt-30">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="w-full flex items-center justify-between bg-white rounded-2xl border border-slate-200 px-4 py-3 shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-sm">
                                {(profileData?.hoTen || "U").substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-semibold text-slate-800">{user.name}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showMobileMenu ? 'rotate-180' : ''}`} />
                    </button>
                    {showMobileMenu && (
                        <div className="mt-2 bg-white rounded-2xl border border-slate-200 shadow-lg p-2 overflow-hidden">
                            {menus.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => { setActiveTab(item.id); setShowMobileMenu(false); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                                            ${isActive ? 'bg-sky-50 text-sky-600' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <Icon size={18} className={isActive ? 'text-sky-500' : 'text-slate-400'} />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">
                    <aside className="hidden lg:block bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm sticky top-24">
                        <div className="text-center mb-6 pb-6 border-b border-slate-100">
                            <div className="relative inline-block">
                                {(!user.avatar || user.avatar === "undefined" || user.avatar === "null") ? (
                                    <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-sky-500/20">
                                        {(profileData?.hoTen || "U").substring(0, 2).toUpperCase()}
                                    </div>
                                ) : (
                                    <img
                                        src={`https://localhost:7016${user.avatar}`}
                                        alt="Avatar"
                                        className="w-24 h-24 mx-auto rounded-2xl object-cover ring-4 ring-sky-500/10 shadow-lg"
                                    />
                                )}
                            </div>
                            <h3 className="mt-3 font-bold text-slate-800 text-lg">{user.name}</h3>
                            <p className="text-xs text-slate-400">{user.email}</p>
                            {user.phone && <p className="text-xs text-slate-400 mt-0.5">{user.phone}</p>}
                        </div>
                        <nav className="space-y-1">
                            {menus.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                                            ${isActive ? "bg-sky-500 text-white shadow-md shadow-sky-500/15" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
                                    >
                                        <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                                        {item.label}
                                        {isActive && <ChevronRight size={14} className="ml-auto opacity-80" />}
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    <main className="space-y-6">
                        {activeTab === "overview" && (
                            <div className="animate-fadeIn space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800">Tổng quan tài khoản</h2>
                                        <p className="text-xs text-slate-400">Theo dõi số liệu thống kê và lịch trình du lịch của bạn</p>
                                    </div>
                                    <div className="w-full sm:w-56 shrink-0">
                                        <SelectField
                                            value={selectedYear}
                                            onChange={(value) => setSelectedYear(value)}
                                            options={yearOptions}
                                            valueKey="value"
                                            labelKey="label"
                                            placeholder="Chọn năm thống kê"
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                {isLoadingOverview ? (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="bg-white rounded-2xl border border-slate-200/60 p-5 animate-pulse flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
                                                    <div className="space-y-2 flex-1">
                                                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                                                        <div className="h-5 bg-slate-100 rounded w-3/4" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-white h-48 rounded-3xl border border-slate-200/60 animate-pulse" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            {stats.map((stat, index) => (
                                                <div key={index} className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 group">
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                                        <p className="mt-1 text-xl sm:text-2xl font-medium text-slate-800 tracking-tight">{stat.value}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                                            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                                                <div>
                                                    <h3 className="font-bold text-slate-800 text-base">Hành trình gần đây</h3>
                                                    <p className="text-xs text-slate-400">Những chuyến đi mới nhất được cập nhật tự động</p>
                                                </div>
                                                <button
                                                    onClick={() => setActiveTab("history")}
                                                    className="text-xs font-bold text-sky-500 hover:text-sky-600 bg-sky-50 hover:bg-sky-100/80 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
                                                >
                                                    Xem tất cả <ChevronRight size={14} />
                                                </button>
                                            </div>

                                            <div className="divide-y divide-slate-50">
                                                {overviewData?.tours && overviewData.tours.length > 0 ? (
                                                    overviewData.tours.map((tour, index) => {
                                                        const financialStatus = getDisplayFinancialStatus(tour);
                                                        return (
                                                            <div key={tour.maDonDatTour || index} className="px-6 py-4 hover:bg-slate-50/60 transition group">
                                                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                                    <div className="flex items-center gap-4 flex-1">
                                                                        <img
                                                                            src={tour.duongDanAnh ? `https://localhost:7016${tour.duongDanAnh}` : "https://placehold.co/100x100?text=No+Image"}
                                                                            alt={tour.tenTour}
                                                                            className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0 shadow-sm"
                                                                            onError={(e) => e.target.src = "https://placehold.co/100x100?text=No+Image"}
                                                                        />
                                                                        <div className="min-w-0">
                                                                            <h4 className="font-bold text-slate-800 text-sm group-hover:text-sky-600 transition-colors line-clamp-1">{tour.tenTour}</h4>
                                                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                                                                                <span className="flex items-center gap-1 font-medium">
                                                                                    <Calendar size={13} className="text-slate-400" /> {tour.ngayBatDau}
                                                                                </span>
                                                                                <span className="flex items-center gap-1 font-medium">
                                                                                    <MapPin size={13} className="text-slate-400" /> {tour.diaDiem}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                                                                        {getStatusBadge(tour.trangThai)}
                                                                        {tour.trangThaiTaiChinh !== undefined && getFinancialBadge(financialStatus)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="px-6 py-14 text-center">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                                                <Calendar size={28} />
                                                            </div>
                                                            <div className="space-y-0.5">
                                                                <p className="text-sm font-semibold text-slate-600">Chưa có chuyến đi nào</p>
                                                                <p className="text-xs text-slate-400">Không tìm thấy dữ liệu hành trình trong khoảng thời gian đã chọn</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === "profile" && (
                            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100">
                                    <h2 className="text-lg font-bold text-slate-800">Thông tin cá nhân</h2>
                                    <p className="text-xs text-slate-400">Quản lý và cập nhật thông tin tài khoản của bạn</p>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Họ và tên</label>
                                            <p className="text-sm font-medium text-slate-800 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                                                {profileData?.hoTen || "Chưa cập nhật"}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</label>
                                            <p className="text-sm font-medium text-slate-800 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                                                {profileData?.email || "Chưa cập nhật"}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Số điện thoại</label>
                                            <p className="text-sm font-medium text-slate-800 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                                                {profileData?.soDienThoai || "Chưa cập nhật"}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Giới tính</label>
                                            <p className="text-sm font-medium text-slate-800 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                                                {profileData?.gioiTinh !== undefined ? (profileData.gioiTinh ? "Nam" : "Nữ") : "Chưa cập nhật"}
                                            </p>
                                        </div>
                                        <div className="space-y-1 md:col-span-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày sinh</label>
                                            <p className="text-sm font-medium text-slate-800 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                                                {profileData?.ngaySinh ? new Date(profileData.ngaySinh).toLocaleDateString("vi-VN") : "Chưa cập nhật"}
                                            </p>
                                        </div>
                                        <div className="space-y-1 md:col-span-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Địa chỉ</label>
                                            <p className="text-sm font-medium text-slate-800 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                                                {profileData?.diaChi || "Chưa cập nhật"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
                                                <Shield size={18} className="text-amber-500" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 text-sm">Bảo mật tài khoản</p>
                                                <p className="text-xs text-slate-400">Cập nhật mật khẩu định kỳ để bảo vệ tài khoản</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsPasswordModalOpen(true)}
                                            className="px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                                        >
                                            Đổi mật khẩu
                                        </button>
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="px-6 py-2.5 text-sm font-bold text-white bg-sky-500 rounded-xl hover:bg-sky-600 shadow-md shadow-sky-500/15 transition"
                                        >
                                            Cập nhật hồ sơ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "history" && (
                            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800">Lịch sử đặt tour</h2>
                                            <p className="text-xs text-slate-400">Danh sách toàn bộ các chuyến đi của bạn</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="flex-1 relative">
                                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        fetchHistory(1, searchTerm, filterStatus ? parseInt(filterStatus) : null);
                                                    }
                                                }}
                                                placeholder="Tìm kiếm theo tên tour hoặc mã đặt chỗ..."
                                                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <SelectField
                                                value={filterStatus}
                                                onChange={(value) => {
                                                    setFilterStatus(value);
                                                    fetchHistory(1, searchTerm, value ? parseInt(value) : null);
                                                }}
                                                options={[
                                                    { value: "", label: "Tất cả" },
                                                    { value: "1", label: "Chờ thanh toán" },
                                                    { value: "2", label: "Chờ duyệt" },
                                                    { value: "3", label: "Đã duyệt" },
                                                    { value: "4", label: "Đang diễn ra" },
                                                    { value: "5", label: "Hoàn tất" },
                                                    { value: "6", label: "Đã hủy" }
                                                ]}
                                                valueKey="value"
                                                labelKey="label"
                                                placeholder="Trạng thái"
                                                className="w-40"
                                            />
                                            <button
                                                onClick={() => fetchHistory(1, searchTerm, filterStatus ? parseInt(filterStatus) : null)}
                                                className="px-6 py-2 text-sm font-semibold text-white bg-sky-500 rounded-xl hover:bg-sky-600 transition shadow-sm shadow-sky-500/10"
                                            >
                                                Tìm
                                            </button>
                                            {(searchTerm || filterStatus) && (
                                                <button
                                                    onClick={() => {
                                                        setSearchTerm("");
                                                        setFilterStatus("");
                                                        fetchHistory(1, "", null);
                                                    }}
                                                    className="px-4 py-2.5 text-sm font-medium text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="divide-y divide-slate-50">
                                    {isLoadingHistory ? (
                                        <div className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-8 h-8 border-2 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
                                                <p className="text-sm text-slate-500">Đang tải dữ liệu...</p>
                                            </div>
                                        </div>
                                    ) : historyData.items && historyData.items.length > 0 ? (
                                        historyData.items.map((tour, index) => {
                                            const isHoanTat = tour.trangThai === ORDER_STATUS.HOAN_TAT;
                                            const daDanhGia = tour.daDanhGia === true;
                                            const canReview = isHoanTat && !daDanhGia;
                                            const isCancelled = isOrderCancelled(tour.trangThai);
                                            const financialStatus = tour.trangThaiTaiChinh ?? FINANCIAL_STATUS.CHUA_THANH_TOAN;

                                            return (
                                                <div key={tour.maDonDatTour || index} className="px-6 py-4 hover:bg-slate-50/50 transition">
                                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                                        <img
                                                            src={tour.duongDanAnh ? `https://localhost:7016${tour.duongDanAnh}` : "https://placehold.co/100x100?text=No+Image"}
                                                            alt={tour.tenTour}
                                                            className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0"
                                                            onError={(e) => e.target.src = "https://placehold.co/100x100?text=No+Image"}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                                <h3 className="font-bold text-slate-800 text-sm truncate">{tour.tenTour}</h3>
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    {getStatusBadge(tour.trangThai)}
                                                                    {tour.trangThaiTaiChinh !== undefined && getFinancialBadge(financialStatus)}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mt-1.5">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar size={12} /> {tour.ngayBatDau} → {tour.ngayKetThuc}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin size={12} /> {tour.diemDen}
                                                                </span>
                                                                {isCancelled && tour.lyDoHuy && (
                                                                    <span className="flex items-center gap-1 text-red-500">
                                                                        <AlertCircle size={12} />
                                                                        <span className="text-xs font-medium">Lý do: {tour.lyDoHuy}</span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-2 w-full md:w-32 shrink-0">
                                                            <button
                                                                onClick={() => handleViewDetail(tour.maDonDatTour)}
                                                                className="w-full px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition whitespace-nowrap text-center"
                                                            >
                                                                Chi tiết
                                                            </button>

                                                            {canReview && (
                                                                <button
                                                                    onClick={() => handleOpenReviewForm(tour)}
                                                                    className="w-full px-3 py-2 text-sm font-medium text-white bg-sky-500 rounded-xl hover:bg-sky-600 transition whitespace-nowrap flex items-center justify-center gap-1 shadow-sm shadow-sky-100"
                                                                >
                                                                    Đánh giá
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                                    <Calendar size={32} />
                                                </div>
                                                <p className="text-sm font-medium text-slate-500">Không có lịch sử đặt tour</p>
                                                <p className="text-xs text-slate-400">Bạn chưa đặt bất kỳ chuyến đi nào</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {totalPages > 1 && (
                                    <div className="px-6 py-4 border-t border-slate-100">
                                        <Pagination
                                            currentPage={historyData.pageNumber}
                                            totalPages={totalPages}
                                            onPageChange={(newPage) => fetchHistory(newPage, searchTerm, filterStatus ? parseInt(filterStatus) : null)}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800">Lịch sử đánh giá</h2>
                                            <p className="text-xs text-slate-400">Các đánh giá bạn đã gửi cho các chuyến đi</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="flex-1 relative">
                                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={reviewSearchTerm}
                                                onChange={(e) => setReviewSearchTerm(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        fetchReviews(1, reviewSearchTerm, filterRating ? parseInt(filterRating) : null);
                                                    }
                                                }}
                                                placeholder="Tìm kiếm theo tên tour..."
                                                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <SelectField
                                                value={filterRating}
                                                onChange={(value) => {
                                                    setFilterRating(value);
                                                    fetchReviews(1, reviewSearchTerm, value ? parseInt(value) : null);
                                                }}
                                                options={[
                                                    { value: "", label: "Tất cả" },
                                                    { value: "5", label: "5 sao" },
                                                    { value: "4", label: "4 sao" },
                                                    { value: "3", label: "3 sao" },
                                                    { value: "2", label: "2 sao" },
                                                    { value: "1", label: "1 sao" },
                                                ]}
                                                valueKey="value"
                                                labelKey="label"
                                                placeholder="Số sao"
                                                className="w-60"
                                            />
                                            <button
                                                onClick={() => fetchReviews(1, reviewSearchTerm, filterRating ? parseInt(filterRating) : null)}
                                                className="px-6 py-2 text-sm font-semibold text-white bg-sky-500 rounded-xl hover:bg-sky-600 transition shadow-sm shadow-sky-500/10"
                                            >
                                                Tìm
                                            </button>
                                            {(reviewSearchTerm || filterRating) && (
                                                <button
                                                    onClick={() => {
                                                        setReviewSearchTerm("");
                                                        setFilterRating("");
                                                        fetchReviews(1, "", null);
                                                    }}
                                                    className="px-4 py-2.5 text-sm font-medium text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="divide-y divide-slate-50">
                                    {isLoadingReviews ? (
                                        <div className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-8 h-8 border-2 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
                                                <p className="text-sm text-slate-500">Đang tải dữ liệu...</p>
                                            </div>
                                        </div>
                                    ) : reviewData.items && reviewData.items.length > 0 ? (
                                        reviewData.items.map((review, index) => {
                                            const getStatusText = () => {
                                                if (!review.isProcessed) {
                                                    return { text: "Chờ xử lý", color: "bg-amber-50 text-amber-700 border-amber-200" };
                                                }
                                                if (review.trangThai === true) {
                                                    return { text: "Đã duyệt", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
                                                }
                                                return { text: "Từ chối", color: "bg-red-50 text-red-700 border-red-200" };
                                            };

                                            const status = getStatusText();

                                            return (
                                                <div key={review.maDanhGia || index} className="px-6 py-5 hover:bg-slate-50/50 transition">
                                                    <div className="flex flex-col md:flex-row gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-start gap-4">
                                                                <img
                                                                    src={review.duongDanAnh ? `https://localhost:7016${review.duongDanAnh}` : "https://placehold.co/80x80?text=No+Image"}
                                                                    alt={review.tenTour}
                                                                    className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0"
                                                                    onError={(e) => e.target.src = "https://placehold.co/100x100?text=No+Image"}
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-semibold text-slate-800 text-sm">{review.tenTour}</h4>
                                                                    <div className="flex items-center gap-3 mt-1">
                                                                        {renderStars(review.diemDanhGia)}
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mt-1.5">
                                                                        <span className="flex items-center gap-1">
                                                                            <Calendar size={12} /> {review.ngayDanhGia}
                                                                        </span>
                                                                        <span className="flex items-center gap-1">
                                                                            <MapPin size={12} /> {review.diaDiem || "N/A"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 md:self-center">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${status.color}`}>
                                                                {status.text}
                                                            </span>
                                                            <button
                                                                onClick={() => handleViewReview(review)}
                                                                className="px-4 py-2 text-sm font-medium text-sky-600 bg-slate-50 border border-slate-400 rounded-xl hover:bg-slate-100 transition flex items-center gap-1.5"
                                                            >
                                                                Xem chi tiết
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                                    <MessageSquare size={32} />
                                                </div>
                                                <p className="text-sm font-medium text-slate-500">Chưa có đánh giá nào</p>
                                                <p className="text-xs text-slate-400">Bạn chưa đánh giá bất kỳ chuyến đi nào</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {totalReviewPages > 1 && (
                                    <div className="px-6 py-4 border-t border-slate-100">
                                        <Pagination
                                            currentPage={reviewData.pageNumber}
                                            totalPages={totalReviewPages}
                                            onPageChange={(newPage) => fetchReviews(newPage, reviewSearchTerm, filterRating ? parseInt(filterRating) : null)}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <UpdateUserProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                profileData={profileData}
                onUpdateSuccess={fetchProfile}
            />

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />

            {isDetailModalOpen && selectedBooking && (
                <BookingDetailModal
                    isOpen={isDetailModalOpen}
                    booking={selectedBooking}
                    onClose={handleCloseDetailModal}
                    onSuccess={refreshAllData}
                />
            )}

            <ReviewFormModal
                isOpen={isReviewFormOpen}
                onClose={handleCloseReviewForm}
                booking={reviewBooking}
                onSuccess={refreshAllData}
            />

            {isReviewDetailOpen && selectedReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 shrink-0">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Chi tiết đánh giá</h3>
                            </div>
                            <button
                                onClick={handleCloseReviewDetail}
                                className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {isLoadingReviewDetail ? (
                            <div className="flex-1 flex items-center justify-center p-8">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 border-2 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
                                    <p className="text-sm text-slate-500">Đang tải chi tiết...</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                                <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                                    <div className="flex items-center gap-1">
                                        {renderStars(selectedReview.diemDanhGia)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-slate-50 rounded-xl p-3">
                                        <p className="text-xs text-slate-400 font-medium">Tour</p>
                                        <p className="text-sm font-semibold text-slate-700 mt-1 truncate">
                                            {selectedReview.tenTour}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 rounded-xl p-3">
                                        <p className="text-xs text-slate-400 font-medium">Ngày đánh giá</p>
                                        <p className="text-sm font-semibold text-slate-700 mt-1">
                                            {selectedReview.ngayDanhGia}
                                        </p>
                                    </div>
                                </div>

                                {selectedReview.noiDung ? (
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <div className="flex items-start gap-2">
                                            <MessageSquare size={16} className="text-slate-400 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-xs text-slate-400 font-medium mb-2">Nội dung đánh giá</p>
                                                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                                    {selectedReview.noiDung}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                                        <p className="text-sm text-slate-400">Không có nội dung đánh giá</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="px-6 py-4 border-t border-slate-100 shrink-0 flex justify-end gap-3">
                            {selectedReview.maDonDatTour && (
                                <button
                                    onClick={() => {
                                        handleCloseReviewDetail();
                                        handleViewDetail(selectedReview.maDonDatTour);
                                    }}
                                    className="px-6 py-2.5 text-sm font-medium text-white bg-sky-500 rounded-xl hover:bg-sky-600 transition shadow-sm shadow-sky-500/10 flex items-center gap-1.5"
                                >
                                    <Eye size={16} />
                                    Xem booking
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}