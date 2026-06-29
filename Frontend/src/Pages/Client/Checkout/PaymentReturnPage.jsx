import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
    CheckCircle2, XCircle, Hash, Receipt,
    Banknote, ArrowRight, Home, RotateCcw, Copy, Check
} from "lucide-react";
import { formatCurrency } from "~/Helper/FormatCurrency";

function useCopy(text) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(text ?? "").then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        });
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
    const [status, setStatus] = useState("loading");
    const [visible, setVisible] = useState(false);

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
        sessionStorage.removeItem("bookingData");

        setTimeout(() => setVisible(true), 60);

        const sendMessage = () => {
            if (window.opener && !window.opener.closed) {
                window.opener.postMessage(
                    { type: "VNPAY_RETURN", success, code },
                    window.location.origin
                );
            }
        };

        sendMessage();
        const retry = setTimeout(sendMessage, 300);
        return () => clearTimeout(retry);
    }, [code, valid]);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl transition-all duration-500" style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)" }}>
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/70 overflow-hidden">
                    <div className={`px-8 sm:px-12 pt-12 pb-10 text-center ${isSuccess ? "bg-gradient-to-b from-emerald-50 to-white" : "bg-gradient-to-b from-red-50 to-white"}`}>
                        <div className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full shadow-md ${isSuccess ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-200" : "bg-gradient-to-br from-red-400 to-rose-500 shadow-red-200"}`}>
                            {isSuccess ? <CheckCircle2 size={44} className="text-white" strokeWidth={2} /> : <XCircle size={44} className="text-white" strokeWidth={2} />}
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                            {isSuccess ? "Thanh toán thành công" : "Thanh toán thất bại"}
                        </h1>
                        <p className="mt-2.5 text-sm sm:text-base text-slate-500 max-w-md mx-auto">
                            {isSuccess
                                ? "Đơn đặt tour của bạn đã được xác nhận và đang được xử lý."
                                : code === "24"
                                    ? "Bạn đã huỷ giao dịch. Chỗ giữ vẫn còn hiệu lực."
                                    : `Giao dịch không thành công (mã lỗi: ${code}).`}
                        </p>

                        <div className={`inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold ${isSuccess ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                            <span className={`w-2 h-2 rounded-full ${isSuccess ? "bg-emerald-500" : "bg-amber-500"}`} />
                            {isSuccess ? "Đã xác nhận" : "Chưa hoàn tất"}
                        </div>
                    </div>

                    <div className="px-8 sm:px-12 pb-4">
                        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-6 divide-y divide-slate-100">
                            {isSuccess ? (
                                <>
                                    <InfoRow icon={Hash} label="Mã giao dịch VNPay" value={transNo} copyable />
                                    <InfoRow icon={Receipt} label="Mã tham chiếu" value={txnRef} copyable />
                                    <InfoRow icon={Banknote} label="Tổng thanh toán" value={formatCurrency(tongTien)} highlight />
                                </>
                            ) : (
                                <>
                                    <InfoRow icon={Receipt} label="Mã tham chiếu" value={txnRef || "—"} copyable />
                                    <InfoRow icon={Banknote} label="Số tiền" value={formatCurrency(tongTien)} />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="px-8 sm:px-12 pt-6 pb-10 flex flex-col sm:flex-row gap-4">
                        {isSuccess ? (
                            <>
                                <Link to="/tai-khoan/don-dat-tour" className="flex items-center justify-center gap-2 flex-1 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 py-4 font-semibold text-white shadow-sm shadow-sky-200 hover:from-sky-600 hover:to-sky-700 transition-all text-sm sm:text-base">
                                    Xem đơn đặt tour <ArrowRight size={16} />
                                </Link>
                                <Link to="/" className="flex items-center justify-center gap-2 flex-1 rounded-2xl border border-slate-200 py-4 font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all text-sm sm:text-base">
                                    <Home size={15} /> Về trang chủ
                                </Link>
                            </>
                        ) : (
                            <>
                                <button onClick={() => window.history.back()} className="flex items-center justify-center gap-2 flex-1 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 py-4 font-semibold text-white shadow-sm shadow-sky-200 hover:from-sky-600 hover:to-sky-700 transition-all text-sm sm:text-base">
                                    <RotateCcw size={15} /> Thử lại
                                </button>
                                <Link to="/" className="flex items-center justify-center gap-2 flex-1 rounded-2xl border border-slate-200 py-4 font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all text-sm sm:text-base">
                                    <Home size={15} /> Huỷ và về trang chủ
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <p className="text-center text-xs sm:text-sm text-slate-400 mt-6">
                    {isSuccess
                        ? "Chúng tôi sẽ gửi email xác nhận đến địa chỉ bạn đã đăng ký."
                        : "Nếu bị trừ tiền nhưng giao dịch thất bại, vui lòng liên hệ hỗ trợ trong 24 giờ."}
                </p>
            </div>
        </div>
    );
}