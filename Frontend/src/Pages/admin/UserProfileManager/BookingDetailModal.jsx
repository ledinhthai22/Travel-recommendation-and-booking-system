import { useState, useCallback, useRef, useEffect } from "react";
import { formatCurrency } from "~/Helper/FormatCurrency";
import CancelReasonModal from "./CancelReasonModal";
import { cancelBookingUserApi } from "~/Services/UserProfile";
import { toastError, toastSuccess } from "~/utils/Toast";
import { CreditCard, X, CheckCircle, Clock } from "lucide-react";
import { createRemainingPaymentApi } from "~/Services/PaymentService";

// Trạng thái đơn mới (chỉ 6 trạng thái)
const ORDER_STATUS = {
    CHO_THANH_TOAN: 1,
    CHO_DUYET: 2,
    DA_DUYET: 3,
    DANG_DIEN_RA: 4,
    HOAN_TAT: 5,
    DA_HUY: 6
};

// Trạng thái tài chính mới
const FINANCIAL_STATUS = {
    CHUA_THANH_TOAN: 0,
    DA_DAT_COC: 1,
    DA_THANH_TOAN_DU: 2,
    DANG_HOAN_TIEN: 3,
    DA_HOAN_TIEN: 4,
    MAT_COC: 5
};

const PAYMENT_STATUS = {
    CHO_XU_LY: 0,
    THANH_CONG: 1,
    THAT_BAI: 2,
    DA_HUY: 3
};

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 10 * 60 * 1000;

export default function BookingDetailModal({ isOpen, onClose, booking, onSuccess }) {
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRemainingPaymentModalOpen, setIsRemainingPaymentModalOpen] = useState(false);
    const [isProcessingRemaining, setIsProcessingRemaining] = useState(false);
    const [remainingAmount, setRemainingAmount] = useState(0);

    const [vnpayUrl, setVnpayUrl] = useState(null);
    const [txnRef, setTxnRef] = useState(null);
    const popupRef = useRef(null);
    const pollRef = useRef(null);
    const timeoutRef = useRef(null);
    const calledRef = useRef(false);

    if (!isOpen || !booking) return null;

    const data = booking;
    const trangThaiDon = data.trangThai || data.trangThaiDon || 0;
    const trangThaiTaiChinh = data.trangThaiTaiChinh ?? data.trangThaiCoc ?? 0;
    const soTienDaThanhToan = data.soTienDaThanhToan || 0;
    const tongTien = data.tongTien || 0;
    const tienCoc = data.tienCoc || 0;
    const remaining = tongTien - soTienDaThanhToan;

    const isCancelled = trangThaiDon === ORDER_STATUS.DA_HUY;
    const isProcessingCancel = trangThaiDon === ORDER_STATUS.CHO_XU_LY_HUY; // Giữ lại để tương thích, nhưng không còn dùng
    const isFullyPaid = trangThaiTaiChinh === FINANCIAL_STATUS.DA_THANH_TOAN_DU;
    const isDeposited = trangThaiTaiChinh === FINANCIAL_STATUS.DA_DAT_COC;
    const isCompleted = trangThaiDon === ORDER_STATUS.HOAN_TAT;
    const isDangHoanTien = trangThaiTaiChinh === FINANCIAL_STATUS.DANG_HOAN_TIEN;
    const isDaHoanTien = trangThaiTaiChinh === FINANCIAL_STATUS.DA_HOAN_TIEN;
    const isMatCoc = trangThaiTaiChinh === FINANCIAL_STATUS.MAT_COC;

    // ============================================
    // HÀM PARSE NGÀY THÁNG ĐỊNH DẠNG dd/MM/yyyy
    // ============================================
    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        if (typeof dateStr === 'string' && dateStr.includes('/')) {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
                const day = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1;
                const year = parseInt(parts[2]);
                return new Date(year, month, day);
            }
        }
        try {
            const d = new Date(dateStr);
            if (!isNaN(d.getTime())) return d;
        } catch {}
        return null;
    };

    const formatDateDisplay = (dateStr) => {
        if (!dateStr) return "N/A";
        if (typeof dateStr === 'string' && dateStr.includes('/')) {
            return dateStr;
        }
        try {
            const d = new Date(dateStr);
            if (!isNaN(d.getTime())) {
                return d.toLocaleDateString("vi-VN");
            }
        } catch {}
        return dateStr;
    };

    const formatDateTimeDisplay = (dateStr) => {
        if (!dateStr) return "N/A";
        if (typeof dateStr === 'string' && dateStr.includes('/') && dateStr.includes(':')) {
            return dateStr;
        }
        try {
            const d = new Date(dateStr);
            if (!isNaN(d.getTime())) {
                return d.toLocaleString("vi-VN");
            }
        } catch {}
        return dateStr;
    };

    let departureDate = null;
    const ngayKhoiHanhStr = data.ngayKhoiHanh || data.chuyen?.ngayKhoiHanh || "";
    if (ngayKhoiHanhStr) {
        departureDate = parseDate(ngayKhoiHanhStr);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = departureDate
        ? Math.ceil((departureDate - today) / (1000 * 60 * 60 * 24))
        : 0;

    const canCancel =
        (trangThaiDon === ORDER_STATUS.CHO_THANH_TOAN ||
            trangThaiDon === ORDER_STATUS.CHO_DUYET ||
            trangThaiDon === ORDER_STATUS.DA_DUYET) &&
        (trangThaiTaiChinh === FINANCIAL_STATUS.CHUA_THANH_TOAN ||
            trangThaiTaiChinh === FINANCIAL_STATUS.DA_DAT_COC) &&
        departureDate &&
        today < departureDate &&
        diffDays >= 3 &&
        !isCancelled;

    const canPayRemaining =
        !isCancelled &&
        trangThaiDon !== ORDER_STATUS.HOAN_TAT &&
        trangThaiTaiChinh === FINANCIAL_STATUS.DA_DAT_COC &&
        soTienDaThanhToan < tongTien &&
        soTienDaThanhToan > 0;

    const getStatusBadge = (status) => {
        const configs = {
            1: { color: "bg-amber-50 text-amber-700 border-amber-200", label: "Chờ thanh toán" },
            2: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "Chờ duyệt" },
            3: { color: "bg-sky-50 text-sky-700 border-sky-200", label: "Đã duyệt" },
            4: { color: "bg-indigo-50 text-indigo-700 border-indigo-200", label: "Đang diễn ra" },
            5: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Hoàn tất" },
            6: { color: "bg-red-50 text-red-700 border-red-200", label: "Đã hủy" }
        };
        const cfg = configs[status] || { color: "bg-slate-50 text-slate-700 border-slate-200", label: "Không xác định" };
        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium border ${cfg.color}`}>
                {cfg.label}
            </span>
        );
    };

    const getFinancialBadge = (status) => {
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
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${cfg.color}`}>
                {cfg.label}
            </span>
        );
    };

    const getPaymentStatusBadge = (status) => {
        const configs = {
            0: { color: "bg-amber-50 text-amber-700 border-amber-200", label: "Chờ xử lý" },
            1: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Thành công" },
            2: { color: "bg-red-50 text-red-700 border-red-200", label: "Thất bại" },
            3: { color: "bg-gray-50 text-gray-700 border-gray-200", label: "Đã hủy" }
        };
        const cfg = configs[status] || { color: "bg-slate-100 text-slate-500 border-slate-200", label: "Không xác định" };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${cfg.color}`}>
                {cfg.label}
            </span>
        );
    };

    const getPaymentStatusForUser = () => {
        if (isCancelled) {
            if (isDaHoanTien) return { text: "Đã hoàn tiền", color: "text-green-600 bg-green-50 border-green-200", icon: <CheckCircle size={16} className="text-green-500" /> };
            if (isMatCoc) return { text: "Mất cọc", color: "text-red-600 bg-red-50 border-red-200", icon: null };
            if (isDangHoanTien) return { text: "Đang xử lý hoàn tiền", color: "text-purple-600 bg-purple-50 border-purple-200", icon: null };
            return { text: "Đã hủy", color: "text-orange-600 bg-orange-50 border-orange-200", icon: null };
        }
        if (isFullyPaid || isCompleted) {
            return { text: "Đã thanh toán đầy đủ", color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: <CheckCircle size={16} className="text-emerald-500" /> };
        }
        if (isDeposited) {
            return { text: "Đã đặt cọc", color: "text-amber-600 bg-amber-50 border-amber-200", icon: <Clock size={16} className="text-amber-500" /> };
        }
        if (soTienDaThanhToan > 0) {
            return { text: "Đã thanh toán một phần", color: "text-amber-600 bg-amber-50 border-amber-200", icon: <Clock size={16} className="text-amber-500" /> };
        }
        return { text: "Chưa thanh toán", color: "text-slate-500 bg-slate-50 border-slate-200", icon: null };
    };

    const getDiemDen = () => {
        const diemDen = data?.diemDen || data?.chuyen?.diemDen || data?.diaDiem || "";
        if (diemDen && diemDen !== "N/A") return diemDen;
        const tenTour = data?.tenTour || data?.tour?.tenTour || "";
        if (tenTour && tenTour !== "N/A") {
            const match = tenTour.match(/(?:-|\s)([A-Za-zÀ-ỹ\s]+)$/);
            if (match) return match[1].trim();
        }
        return "Chưa cập nhật";
    };

    const stopPolling = useCallback(() => {
        if (pollRef.current) clearInterval(pollRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, []);

    const closePopup = useCallback(() => {
        if (popupRef.current && !popupRef.current.closed) popupRef.current.close();
    }, []);

    const handlePaymentSuccess = useCallback(() => {
        setVnpayUrl(null);
        setTxnRef(null);
        setIsRemainingPaymentModalOpen(false);
        setIsProcessingRemaining(false);
        toastSuccess("Thanh toán phần còn lại thành công!");
        onClose();
        if (onSuccess) onSuccess();
    }, [onClose, onSuccess]);

    const handlePaymentFailed = useCallback(() => {
        setVnpayUrl(null);
        setTxnRef(null);
        setIsProcessingRemaining(false);
        toastError("Thanh toán thất bại hoặc bị hủy!");
    }, []);

    const checkPopupClosed = useCallback(() => {
        if (popupRef.current && popupRef.current.closed) {
            stopPolling();
        }
    }, [stopPolling]);

    const startPolling = useCallback(() => {
        stopPolling();
        pollRef.current = setInterval(async () => {
            if (calledRef.current) return;
            try {
                const res = await fetch(`https://localhost:7016/api/client/payment/status/${txnRef}`);
                const data = await res.json();
                if (data.status === "SUCCESS") {
                    calledRef.current = true;
                    stopPolling();
                    closePopup();
                    handlePaymentSuccess();
                } else if (data.status === "FAILED") {
                    calledRef.current = true;
                    stopPolling();
                    closePopup();
                    handlePaymentFailed();
                }
            } catch { }
        }, POLL_INTERVAL_MS);
        timeoutRef.current = setTimeout(() => {
            if (calledRef.current) return;
            stopPolling();
            closePopup();
            handlePaymentFailed();
        }, POLL_TIMEOUT_MS);
    }, [txnRef, stopPolling, closePopup, handlePaymentSuccess, handlePaymentFailed]);

    const openPopup = useCallback((url) => {
        if (popupRef.current && !popupRef.current.closed) {
            popupRef.current.focus();
            return;
        }
        const w = 820,
            h = 680;
        const left = Math.round(window.screenX + (window.outerWidth - w) / 2);
        const top = Math.round(window.screenY + (window.outerHeight - h) / 2);
        popupRef.current = window.open(
            url,
            "vnpay_payment",
            `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes,toolbar=no,menubar=no`
        );
    }, []);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== window.location.origin) return;
            if (event.data?.type === "VNPAY_RETURN" && event.data.success) {
                if (calledRef.current) return;
                calledRef.current = true;
                stopPolling();
                closePopup();
                handlePaymentSuccess();
            }
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [handlePaymentSuccess, stopPolling, closePopup]);

    useEffect(() => {
        const interval = setInterval(checkPopupClosed, 1000);
        return () => clearInterval(interval);
    }, [checkPopupClosed]);

    useEffect(() => {
        return () => {
            stopPolling();
            if (popupRef.current && !popupRef.current.closed) {
                popupRef.current.close();
            }
        };
    }, [stopPolling]);

    const handleConfirmCancel = async (lyDoHuy) => {
        setIsLoading(true);
        try {
            await cancelBookingUserApi(data.maDonDatTour, lyDoHuy);
            setIsCancelModalOpen(false);
            onClose();
            toastSuccess("Hủy tour thành công!");
            if (onSuccess) onSuccess();
        } catch (error) {
            toastError(error.response?.data?.message || "Hủy tour thất bại!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenRemainingPayment = () => {
        setRemainingAmount(remaining);
        setIsRemainingPaymentModalOpen(true);
    };

    const handlePayRemainingViaVNPay = async () => {
        setIsProcessingRemaining(true);
        try {
            const response = await createRemainingPaymentApi(data.maDonDatTour);
            if (response.paymentUrl && response.txnRef) {
                setTxnRef(response.txnRef);
                setVnpayUrl(response.paymentUrl);
                setIsRemainingPaymentModalOpen(false);
                openPopup(response.paymentUrl);
                startPolling();
            } else {
                toastError("Không thể tạo thanh toán!");
                setIsProcessingRemaining(false);
            }
        } catch (error) {
            toastError(error.response?.data?.message || "Không thể tạo thanh toán!");
            setIsProcessingRemaining(false);
        }
    };

    const paymentStatus = getPaymentStatusForUser();

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
                <div className="w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col">
                    <div className="flex justify-between items-center px-6 py-5 pb-4 border-b border-slate-100 shrink-0">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Chi tiết đơn hàng</h2>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <p className="text-xs font-semibold text-slate-400">Mã booking:</p>
                                <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                    {data?.maDatCho || "N/A"}
                                </span>
                            </div>
                        </div>
                        <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition shrink-0 text-2xl leading-none">
                            &times;
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

                        <div className="rounded-xl border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
                                <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Thông tin tour & chuyến đi</h4>
                            </div>
                            <div className="px-4 divide-y divide-slate-100">
                                <div className="flex items-center border-b border-slate-100 py-3 last:border-0">
                                    <div className="w-40 shrink-0">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tên Tour</span>
                                    </div>
                                    <div className="flex-1 text-sm font-medium text-slate-800">
                                        {data?.tenTour || data?.tour?.tenTour || "N/A"}
                                    </div>
                                </div>
                                <div className="flex items-center border-b border-slate-100 py-3 last:border-0">
                                    <div className="w-40 shrink-0">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Mã chuyến đi</span>
                                    </div>
                                    <div className="flex-1 text-sm font-medium text-slate-800">
                                        {data?.maChuyenCode || data?.chuyen?.maChuyenCode || "N/A"}
                                    </div>
                                </div>
                                <div className="flex items-center border-b border-slate-100 py-3 last:border-0">
                                    <div className="w-40 shrink-0">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Điểm khởi hành</span>
                                    </div>
                                    <div className="flex-1 text-sm font-medium text-slate-800">
                                        {data?.diemKhoiHanh || data?.chuyen?.diemKhoiHanh || "N/A"}
                                    </div>
                                </div>
                                <div className="flex items-center border-b border-slate-100 py-3 last:border-0">
                                    <div className="w-40 shrink-0">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Điểm đến</span>
                                    </div>
                                    <div className="flex-1 text-sm font-medium text-slate-800">
                                        {getDiemDen()}
                                    </div>
                                </div>
                                <div className="flex items-center border-b border-slate-100 py-3 last:border-0">
                                    <div className="w-40 shrink-0">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Ngày khởi hành</span>
                                    </div>
                                    <div className="flex-1 text-sm font-medium text-slate-800">
                                        {formatDateDisplay(data?.ngayKhoiHanh || data?.chuyen?.ngayKhoiHanh || "N/A")}
                                    </div>
                                </div>
                                <div className="flex items-center border-b border-slate-100 py-3 last:border-0">
                                    <div className="w-40 shrink-0">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Ngày kết thúc</span>
                                    </div>
                                    <div className="flex-1 text-sm font-medium text-slate-800">
                                        {formatDateDisplay(data?.ngayKetThuc || data?.chuyen?.ngayKetThuc || "N/A")}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
                                <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Chi tiết thanh toán</h4>
                            </div>
                            <div className="px-4 divide-y divide-slate-100">
                                <div className="flex items-center border-b border-slate-100 py-3 last:border-0">
                                    <div className="w-40 shrink-0">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Phương thức</span>
                                    </div>
                                    <div className="flex-1 text-sm font-medium text-slate-800">
                                        {data?.phuongThucThanhToan || "Chưa cập nhật"}
                                    </div>
                                </div>
                                <div className="flex items-center border-b border-slate-100 py-3 last:border-0">
                                    <div className="w-40 shrink-0">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tổng tiền</span>
                                    </div>
                                    <div className="flex-1 text-sm font-bold text-slate-800">{formatCurrency(tongTien)}</div>
                                </div>
                                <div className="flex items-center border-b border-slate-100 py-3 last:border-0">
                                    <div className="w-40 shrink-0">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Đã thanh toán</span>
                                    </div>
                                    <div className="flex-1 text-sm font-bold text-emerald-600">{formatCurrency(soTienDaThanhToan)}</div>
                                </div>
                                <div className="flex items-center border-b border-slate-100 py-3 last:border-0">
                                    <div className="w-40 shrink-0">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Còn lại</span>
                                    </div>
                                    <div className="flex-1 text-sm font-bold text-amber-600">{formatCurrency(remaining)}</div>
                                </div>
                                <div className="flex items-center border-b border-slate-100 py-3 last:border-0">
                                    <div className="w-40 shrink-0">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Trạng thái tài chính</span>
                                    </div>
                                    <div className="flex-1">
                                        {getFinancialBadge(trangThaiTaiChinh)}
                                    </div>
                                </div>
                                <div className="flex items-center border-b border-slate-100 py-3 last:border-0">
                                    <div className="w-40 shrink-0">
                                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tình trạng</span>
                                    </div>
                                    <div className="flex-1">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium border ${paymentStatus.color}`}>
                                            {/* {paymentStatus.icon} */}
                                            {paymentStatus.text}
                                        </span>
                                    </div>
                                </div>
                                {data?.tenUuDai && (
                                    <div className="flex items-center border-b border-slate-100 py-3 last:border-0">
                                        <div className="w-40 shrink-0">
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Khuyến mại</span>
                                        </div>
                                        <div className="flex-1 text-sm font-medium text-slate-700">
                                            {data.tenUuDai}
                                            {data?.maCode && <span className="text-xs text-slate-400 ml-1">({data.maCode})</span>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {data?.lichSuThanhToan && data.lichSuThanhToan.length > 0 && (
                            <div>
                                <h4 className="font-bold text-slate-700 text-sm mb-3">Lịch sử thanh toán</h4>
                                <div className="overflow-x-auto rounded-xl border border-slate-200">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Ngày</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Loại</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Phương thức</th>
                                                <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500">Số tiền</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {data.lichSuThanhToan.map((payment, index) => {
                                                const isDeposit = payment.loaiThanhToan === 1;
                                                const isRemaining = payment.loaiThanhToan === 2;
                                                const isFull = payment.loaiThanhToan === 3;
                                                const isRefund = payment.loaiThanhToan === 4;

                                                let paymentTypeLabel = "Thanh toán";
                                                if (isDeposit) paymentTypeLabel = "Đặt cọc";
                                                else if (isRemaining) paymentTypeLabel = "Thanh toán phần còn lại";
                                                else if (isFull) paymentTypeLabel = "Thanh toán toàn bộ";
                                                else if (isRefund) paymentTypeLabel = "Hoàn tiền";

                                                const isRefundStatus = payment.trangThaiThanhToan === 4 || payment.trangThaiThanhToan === 5;

                                                return (
                                                    <tr key={payment.maThanhToan || index} className="hover:bg-slate-50/50 transition">
                                                        <td className="px-4 py-2.5 text-[12px] text-slate-600">
                                                            {formatDateTimeDisplay(payment.ngayThanhToan || "N/A")}
                                                        </td>
                                                        <td className="px-4 py-2.5">
                                                            <span className={`text-[12px] font-medium ${isRefundStatus ? 'text-amber-600' : 'text-slate-700'}`}>
                                                                {paymentTypeLabel}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2.5">
                                                            <span className="text-[12px] text-slate-600">
                                                                {payment.tenPhuongThuc || payment.phuongThucThanhToan || "N/A"}
                                                            </span>
                                                        </td>
                                                        <td className={`px-4 py-2.5 text-right font-semibold text-[12px] ${isRefundStatus ? 'text-amber-600' : 'text-slate-700'}`}>
                                                            {isRefundStatus ? '-' : ''}{formatCurrency(payment.tongTienThanhToan || 0)}
                                                        </td>
                                                        <td className="px-4 py-2.5">
                                                            {getPaymentStatusBadge(payment.trangThaiThanhToan)}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {data?.danhSachHanhKhach && data.danhSachHanhKhach.length > 0 && (
                            <div>
                                <h4 className="font-bold text-slate-700 text-sm mb-3">Danh sách hành khách ({data.danhSachHanhKhach.length})</h4>
                                <div className="overflow-x-auto rounded-xl border border-slate-200">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 w-16">STT</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Họ tên</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">SĐT</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Loại khách</th>
                                                <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Phòng đơn</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {data.danhSachHanhKhach.map((khach, index) => (
                                                <tr key={khach.maKhachHang || index} className="hover:bg-slate-50/50 transition">
                                                    <td className="px-4 py-2.5 text-[12px] text-slate-500 font-medium">
                                                        {String(index + 1).padStart(2, '0')}
                                                    </td>
                                                    <td className="px-4 py-2.5">
                                                        <span className="text-sm font-semibold text-slate-800">{khach.hoTen || "N/A"}</span>
                                                    </td>
                                                    <td className="px-4 py-2.5 text-[12px] text-slate-600">{khach.soDienThoai || "—"}</td>
                                                    <td className="px-4 py-2.5">
                                                        <span className="text-[12px] font-medium px-2 py-0.5 rounded-full inline-block">
                                                            {khach.loaiKhach === 1 ? "Người lớn" : khach.loaiKhach === 2 ? "Trẻ em" : "Em bé"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2.5">
                                                        {khach.phongDon ? (
                                                            <span className="text-[12px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Có đăng ký</span>
                                                        ) : (
                                                            <span className="text-slate-400 text-[12px]">Không</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* {data?.ghiChu && (
                            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                                <p className="text-xs text-amber-700"><strong>Ghi chú:</strong> {data.ghiChu}</p>
                            </div>
                        )} */}

                        {data?.lyDoHuy && isCancelled && (
                            <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                                <p className="text-xs text-red-700"><strong>Lý do hủy:</strong> {data.lyDoHuy}</p>
                            </div>
                        )}

                        {canPayRemaining && (
                            <div className="border-t border-slate-100 pt-4">
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                                    <p className="text-sm font-medium text-amber-700">
                                        Đơn đặt tour đã thanh toán một phần. <br />
                                        Số tiền còn lại: <span className="font-bold text-amber-600">{formatCurrency(remaining)}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={handleOpenRemainingPayment}
                                    className="w-full bg-sky-500 text-white py-2.5 text-xs font-bold tracking-wide rounded-xl hover:bg-sky-600 transition-all shadow-sm shadow-sky-500/10"
                                >
                                    Thanh toán phần còn lại
                                </button>
                            </div>
                        )}

                        {canCancel && (
                            <div className="border-t border-slate-100 pt-4">
                                <button
                                    onClick={() => setIsCancelModalOpen(true)}
                                    disabled={isLoading}
                                    className="w-full bg-rose-500 text-white py-2.5 text-xs font-bold tracking-wide rounded-xl hover:bg-rose-600 transition-all shadow-sm shadow-rose-500/10 disabled:opacity-50"
                                >
                                    {isLoading ? "Hệ thống đang xử lý..." : "Yêu cầu hủy đặt tour"}
                                </button>
                            </div>
                        )}

                        
                    </div>
                </div>
            </div>

            <CancelReasonModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
                isLoading={isLoading}
            />

            {isRemainingPaymentModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Thanh toán phần còn lại</h3>
                                <p className="text-xs text-slate-400">{data?.tenTour || data?.tour?.tenTour || "N/A"}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsRemainingPaymentModalOpen(false);
                                    setIsProcessingRemaining(false);
                                }}
                                className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="px-6 py-6 space-y-4">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <p className="text-sm text-slate-600">Số tiền còn lại cần thanh toán:</p>
                                <p className="text-2xl font-bold text-amber-600 mt-1">{formatCurrency(remainingAmount)}</p>
                                <p className="text-xs text-slate-400 mt-1">Mã booking: {data?.maDatCho || "N/A"}</p>
                                <div className="mt-2 flex justify-between text-xs">
                                    <span className="text-slate-500">Đã thanh toán:</span>
                                    <span className="font-medium text-emerald-600">{formatCurrency(soTienDaThanhToan)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">Tổng tiền:</span>
                                    <span className="font-medium text-slate-700">{formatCurrency(tongTien)}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={handlePayRemainingViaVNPay}
                                    disabled={isProcessingRemaining}
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 text-white py-3 rounded-xl font-semibold hover:from-sky-600 hover:to-sky-700 transition disabled:opacity-50"
                                >
                                    {isProcessingRemaining ? "Đang xử lý..." : "Thanh toán qua VNPay"}
                                </button>
                                <p className="text-xs text-slate-400 text-center">* Bạn sẽ được chuyển đến cổng thanh toán VNPay để hoàn tất giao dịch</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {vnpayUrl && txnRef && (
                <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center">
                                    <CreditCard size={16} className="text-sky-500" />
                                </div>
                                <span className="font-bold text-slate-800">Thanh toán qua VNPay</span>
                            </div>
                            <button
                                onClick={() => {
                                    stopPolling();
                                    closePopup();
                                    setVnpayUrl(null);
                                    setTxnRef(null);
                                    setIsProcessingRemaining(false);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="px-6 py-8 text-center space-y-5">
                            <div className="relative mx-auto w-20 h-20">
                                <div className="absolute inset-0 rounded-full bg-sky-50" />
                                <div className="absolute inset-0 rounded-full border-4 border-sky-100" />
                                <div className="absolute inset-0 rounded-full border-4 border-sky-500 border-t-transparent animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <CreditCard size={22} className="text-sky-400" />
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-lg">Đang chờ thanh toán...</p>
                                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
                                    Cửa sổ VNPay đã được mở.<br />Vui lòng hoàn tất thanh toán trong cửa sổ đó.
                                </p>
                            </div>
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 text-xs text-amber-700 text-left flex gap-2">
                                <span className="shrink-0 mt-0.5">⚠️</span>
                                <span>Không đóng trang này trong khi thanh toán. Đơn hàng sẽ tự động cập nhật sau khi giao dịch hoàn tất.</span>
                            </div>
                            <button
                                onClick={() => openPopup(vnpayUrl)}
                                className="inline-flex items-center gap-1.5 text-sm text-sky-500 hover:text-sky-600 hover:underline transition"
                            >
                                Cửa sổ bị đóng? <span className="font-semibold">Mở lại tại đây →</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}