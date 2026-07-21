import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
    CheckCircle2, XCircle, Hash, Receipt,
    Banknote, ArrowRight, Home, RotateCcw, Copy, Check, AlertCircle
} from "lucide-react";
import { formatCurrency } from "~/Helper/FormatCurrency";
import { toastSuccess, toastError } from "~/utils/Toast";

function useCopy(text) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        }).catch(() => {});
    };
    return [copied, copy];
}

function InfoRow({ icon: Icon, label, value, copyable, highlight }) {
    const [copied, copy] = useCopy(value);
    return (
        <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0 group">
            <div className="flex items-center gap-3 text-slate-500 text-sm sm:text-base">
                <Icon size={16} className="shrink-0 text-slate-400" />
                <span>{label}</span>
            </div>
            <div className="flex items-center gap-3">
                <span className={`font-semibold ${highlight ? "text-sky-600 text-lg sm:text-xl" : "text-slate-800 text-sm sm:text-base"}`}>
                    {value ?? "—"}
                </span>
                {copyable && value && (
                    <button
                        onClick={copy}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                        title="Sao chép"
                    >
                        {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function PaymentReturnPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading");
    const [visible, setVisible] = useState(false);
    const [paymentType, setPaymentType] = useState("booking"); // "booking" hoặc "remaining"

    const code = searchParams.get("code");
    const txnRef = searchParams.get("txn");
    const amount = searchParams.get("amount");
    const transNo = searchParams.get("transNo");
    const valid = searchParams.get("valid");

    const tongTien = amount ? parseInt(amount) / 100 : 0;

    useEffect(() => {
        if (!code) return;

        const success = code === "00" && valid === "1";
        setStatus(success ? "success" : "failed");
        
        // Xác định loại thanh toán từ txnRef
        if (txnRef && txnRef.startsWith("REMAIN_")) {
            setPaymentType("remaining");
        }

        // Xóa dữ liệu booking nếu là thanh toán mới
        if (paymentType === "booking") {
            sessionStorage.removeItem("bookingData");
        }

        setTimeout(() => setVisible(true), 60);

        // Gửi message về cửa sổ cha (nếu có)
        const sendMessage = () => {
            if (window.opener && !window.opener.closed) {
                window.opener.postMessage(
                    { type: "VNPAY_RETURN", success, code, paymentType },
                    window.location.origin
                );
            }
        };

        sendMessage();
        const retry = setTimeout(sendMessage, 300);
        
        // Hiển thị toast thông báo
        if (success) {
            toastSuccess(paymentType === "remaining" 
                ? "Thanh toán phần còn lại thành công!" 
                : "Đặt tour thành công!"
            );
        } else if (code !== "24") {
            toastError(paymentType === "remaining"
                ? "Thanh toán phần còn lại thất bại!"
                : "Đặt tour thất bại!"
            );
        }

        return () => clearTimeout(retry);
    }, [code, valid, txnRef, paymentType]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center space-y-5">
                    <div className="relative mx-auto w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-sky-100" />
                        <div className="absolute inset-0 rounded-full border-4 border-sky-500 border-t-transparent animate-spin" />
                    </div>
                    <p className="text-slate-500 text-sm tracking-wide">Đang xác nhận giao dịch…</p>
                </div>
            </div>
        );
    }

    const isSuccess = status === "success";
    const isRemainingPayment = paymentType === "remaining";

    // Nội dung thông báo theo loại thanh toán
    const getTitle = () => {
        if (isSuccess) {
            return isRemainingPayment ? "Thanh toán phần còn lại thành công" : "Thanh toán thành công";
        }
        return "Thanh toán thất bại";
    };

    const getDescription = () => {
        if (isSuccess) {
            return isRemainingPayment 
                ? "Đơn đặt tour của bạn đã được thanh toán đầy đủ."
                : "Đơn đặt tour của bạn đã được xác nhận và đang được xử lý.";
        }
        if (code === "24") {
            return "Bạn đã huỷ giao dịch. Vui lòng thử lại khi sẵn sàng.";
        }
        return `Giao dịch không thành công (mã lỗi: ${code}). Vui lòng thử lại.`;
    };

    const getStatusBadge = () => {
        if (isSuccess) {
            return (
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-emerald-100 text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {isRemainingPayment ? "Đã thanh toán đủ" : "Đã xác nhận"}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-amber-100 text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Chưa hoàn tất
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl transition-all duration-500" style={{ 
                opacity: visible ? 1 : 0, 
                transform: visible ? "translateY(0)" : "translateY(16px)" 
            }}>
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/70 overflow-hidden">
                    {/* Header - Icon & Title */}
                    <div className={`px-8 sm:px-12 pt-12 pb-10 text-center ${
                        isSuccess 
                            ? "bg-gradient-to-b from-emerald-50 to-white" 
                            : "bg-gradient-to-b from-red-50 to-white"
                    }`}>
                        <div className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full shadow-md ${
                            isSuccess 
                                ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-200" 
                                : "bg-gradient-to-br from-red-400 to-rose-500 shadow-red-200"
                        }`}>
                            {isSuccess 
                                ? <CheckCircle2 size={44} className="text-white" strokeWidth={2} /> 
                                : <XCircle size={44} className="text-white" strokeWidth={2} />
                            }
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                            {getTitle()}
                        </h1>
                        <p className="mt-2.5 text-sm sm:text-base text-slate-500 max-w-md mx-auto">
                            {getDescription()}
                        </p>

                        <div className="mt-5">
                            {getStatusBadge()}
                        </div>

                        {isRemainingPayment && isSuccess && (
                            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                <span className="text-xs sm:text-sm font-medium text-emerald-700">
                                    Đơn hàng đã được thanh toán đầy đủ
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Thông tin giao dịch */}
                    <div className="px-8 sm:px-12 pb-4">
                        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-6 divide-y divide-slate-100">
                            {isSuccess ? (
                                <>
                                    <InfoRow icon={Hash} label="Mã giao dịch VNPay" value={transNo} copyable />
                                    <InfoRow icon={Receipt} label="Mã tham chiếu" value={txnRef} copyable />
                                    <InfoRow icon={Banknote} label="Tổng thanh toán" value={formatCurrency(tongTien)} highlight />
                                    {isRemainingPayment && (
                                        <InfoRow 
                                            icon={AlertCircle} 
                                            label="Loại thanh toán" 
                                            value="Thanh toán phần còn lại" 
                                        />
                                    )}
                                </>
                            ) : (
                                <>
                                    <InfoRow icon={Receipt} label="Mã tham chiếu" value={txnRef || "—"} copyable />
                                    <InfoRow icon={Banknote} label="Số tiền" value={formatCurrency(tongTien)} />
                                    {code && code !== "24" && (
                                        <InfoRow icon={AlertCircle} label="Mã lỗi" value={code} />
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-8 sm:px-12 pt-6 pb-10 flex flex-col sm:flex-row gap-4">
                        {isSuccess ? (
                            <>
                                <Link 
                                    to={isRemainingPayment ? "/tai-khoan/don-dat-tour" : "/tai-khoan/don-dat-tour"} 
                                    className="flex items-center justify-center gap-2 flex-1 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 py-4 font-semibold text-white shadow-sm shadow-sky-200 hover:from-sky-600 hover:to-sky-700 transition-all text-sm sm:text-base"
                                >
                                    Xem đơn đặt tour <ArrowRight size={16} />
                                </Link>
                                <Link 
                                    to="/" 
                                    className="flex items-center justify-center gap-2 flex-1 rounded-2xl border border-slate-200 py-4 font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all text-sm sm:text-base"
                                >
                                    <Home size={15} /> Về trang chủ
                                </Link>
                            </>
                        ) : (
                            <>
                                <button 
                                    onClick={() => window.history.back()} 
                                    className="flex items-center justify-center gap-2 flex-1 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 py-4 font-semibold text-white shadow-sm shadow-sky-200 hover:from-sky-600 hover:to-sky-700 transition-all text-sm sm:text-base"
                                >
                                    <RotateCcw size={15} /> Thử lại
                                </button>
                                <Link 
                                    to="/" 
                                    className="flex items-center justify-center gap-2 flex-1 rounded-2xl border border-slate-200 py-4 font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all text-sm sm:text-base"
                                >
                                    <Home size={15} /> Về trang chủ
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <p className="text-center text-xs sm:text-sm text-slate-400 mt-6">
                    {isSuccess
                        ? "Chúng tôi sẽ gửi email xác nhận đến địa chỉ bạn đã đăng ký."
                        : code === "24"
                            ? "Bạn có thể quay lại và thử lại thanh toán bất kỳ lúc nào."
                            : "Nếu bị trừ tiền nhưng giao dịch thất bại, vui lòng liên hệ hỗ trợ trong 24 giờ."}
                </p>
            </div>
        </div>
    );
}