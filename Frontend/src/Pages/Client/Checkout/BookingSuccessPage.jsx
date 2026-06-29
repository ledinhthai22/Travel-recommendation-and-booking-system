import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, ArrowRight, Home, CalendarDays, Phone, CreditCard } from "lucide-react";

export default function BookingSuccessPage() {
    const [visible, setVisible] = useState(false);
    const location = useLocation();
    const method = location.state?.method ?? "cash";
    const isVnpay = method === "vnpay";

    useEffect(() => {
        setTimeout(() => setVisible(true), 60);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-12 mt-10">
            <div
                className="w-full max-w-lg transition-all duration-500"
                style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)" }}
            >
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/70 overflow-hidden">

                    <div className="px-8 pt-12 pb-8 text-center bg-gradient-to-b from-emerald-50 to-white">
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md shadow-emerald-200">
                            <CheckCircle2 size={44} className="text-white" strokeWidth={2} />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Đặt tour thành công!
                        </h1>
                        <p className="mt-2.5 text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                            {isVnpay
                                ? "Thanh toán VNPay đã được xác nhận. Đơn đặt tour của bạn đã hoàn tất."
                                : "Đơn đặt tour đã được ghi nhận. Nhân viên sẽ liên hệ xác nhận trong thời gian sớm nhất."}
                        </p>
                        <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            {isVnpay ? "Đã thanh toán" : "Đang chờ xác nhận"}
                        </div>
                    </div>

                    <div className="px-8 py-6 space-y-3">
                        {isVnpay ? (
                            <div className="rounded-2xl bg-sky-50 border border-sky-100 px-5 py-4 flex gap-3">
                                <CreditCard size={18} className="text-sky-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-sky-700 leading-relaxed">
                                    Giao dịch VNPay đã được xử lý thành công. Chúng tôi sẽ gửi email xác nhận và thông tin chi tiết chuyến đi đến bạn.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="rounded-2xl bg-amber-50 border border-amber-100 px-5 py-4 flex gap-3">
                                    <CalendarDays size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-700 leading-relaxed">
                                        Vui lòng thanh toán tại văn phòng trước ngày khởi hành. Đơn sẽ bị huỷ nếu không thanh toán đúng hạn.
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-sky-50 border border-sky-100 px-5 py-4 flex gap-3">
                                    <Phone size={18} className="text-sky-500 shrink-0 mt-0.5" />
                                    <p className="text-xs text-sky-700 leading-relaxed">
                                        Nếu cần hỗ trợ, vui lòng liên hệ hotline <strong>1900 xxxx</strong> trong giờ hành chính.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="px-8 pb-10 flex flex-col gap-3">
                        <Link
                            to="/tai-khoan/don-dat-tour"
                            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 py-4 font-semibold text-white shadow-sm shadow-sky-200 hover:from-sky-600 hover:to-sky-700 transition-all text-sm"
                        >
                            Xem đơn đặt tour <ArrowRight size={16} />
                        </Link>
                        <Link
                            to="/"
                            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-4 font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all text-sm"
                        >
                            <Home size={15} /> Về trang chủ
                        </Link>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-400 mt-6">
                    {isVnpay
                        ? "Cảm ơn bạn đã thanh toán. Chúc bạn có chuyến đi vui vẻ!"
                        : "Chúng tôi sẽ gửi email xác nhận đến địa chỉ bạn đã đăng ký."}
                </p>
            </div>
        </div>
    );
}