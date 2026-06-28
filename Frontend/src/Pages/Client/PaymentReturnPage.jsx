import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { formatCurrency } from "~/Helper/FormatCurrency";

export default function PaymentReturnPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading"); 

    const code     = searchParams.get("code");
    const txnRef   = searchParams.get("txn");
    const amount   = searchParams.get("amount");
    const transNo  = searchParams.get("transNo");
    const valid    = searchParams.get("valid");

    const maGiuChoMatch = txnRef?.match(/^GC(\d+)_/);
    const maGiuCho = maGiuChoMatch ? maGiuChoMatch[1] : null;

    const tongTien = amount ? parseInt(amount) / 100 : 0;

    useEffect(() => {
        if (!code) return;
        if (code === "00" && valid === "1") {
            setStatus("success");
        } else {
            setStatus("failed");
        }
        sessionStorage.removeItem("bookingData");
    }, [code, valid]);

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-sky-500" />
                    <p className="text-slate-500">Đang xác nhận kết quả thanh toán...</p>
                </div>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
                <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-lg text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 size={42} className="text-green-500" />
                    </div>
                    <h2 className="mt-6 text-2xl font-bold text-slate-900">Thanh toán thành công!</h2>
                    <p className="mt-2 text-slate-500 text-sm">Đơn đặt tour của bạn đã được xác nhận.</p>

                    <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-left space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Mã giao dịch VNPay</span>
                            <span className="font-semibold">{transNo}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Mã đặt chỗ</span>
                            <span className="font-semibold">{txnRef}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-3">
                            <span className="text-slate-500">Tổng tiền</span>
                            <span className="font-bold text-sky-600 text-base">{formatCurrency(tongTien)}</span>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3">
                        <Link
                            to="/tai-khoan/don-dat-tour"
                            className="rounded-2xl bg-sky-500 py-3 font-semibold text-white hover:bg-sky-600 transition block"
                        >
                            Xem đơn đặt tour
                        </Link>
                        <Link
                            to="/"
                            className="rounded-2xl border border-slate-200 py-3 font-medium text-slate-600 hover:bg-slate-50 transition block"
                        >
                            Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-lg text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                    <XCircle size={42} className="text-red-500" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-slate-900">Thanh toán thất bại</h2>
                <p className="mt-2 text-slate-500 text-sm">
                    {code === "24"
                        ? "Bạn đã hủy giao dịch."
                        : `Giao dịch không thành công (Mã lỗi: ${code}).`}
                </p>

                <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-left space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Mã tham chiếu</span>
                        <span className="font-semibold">{txnRef || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Số tiền</span>
                        <span className="font-semibold">{formatCurrency(tongTien)}</span>
                    </div>
                </div>

                <p className="mt-4 text-xs text-slate-400">
                    Chỗ giữ của bạn vẫn còn hiệu lực. Bạn có thể thử thanh toán lại.
                </p>

                <div className="mt-8 flex flex-col gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-2xl bg-sky-500 py-3 font-semibold text-white hover:bg-sky-600 transition"
                    >
                        Thử lại
                    </button>
                    <Link
                        to="/"
                        className="rounded-2xl border border-slate-200 py-3 font-medium text-slate-600 hover:bg-slate-50 transition block"
                    >
                        Hủy và về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}