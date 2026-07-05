import { X, User, Phone, Ticket, Wallet, MessageSquareText } from "lucide-react";
import { formatCurrency } from "~/Helper/FormatCurrency";

export default function RefundDetailModal({ isOpen, onClose, refund, onConfirm, isLoading }) {
    if (!isOpen || !refund) return null;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/20 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Chi tiết yêu cầu hoàn tiền</h2>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">Mã booking: #{refund.maDatCho}</p>
                    </div>
                    <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition">
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100/80">
                        <Ticket size={15} className="text-sky-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Tour</p>
                            <p className="text-slate-800 font-medium">{refund.tenTour}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100/80">
                        <User size={15} className="text-sky-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Khách hàng</p>
                            <p className="text-slate-800 font-medium">{refund.hoTenKhachHang}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100/80">
                        <Phone size={15} className="text-sky-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Số điện thoại</p>
                            <p className="text-slate-800 font-medium">{refund.soDienThoai || "Chưa cập nhật"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-100/80">
                        <MessageSquareText size={15} className="text-sky-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Lý do hủy</p>
                            <p className="text-slate-800 font-medium">{refund.lyDoHuy || "Không có"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                        <Wallet size={15} className="text-amber-600 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Số tiền đã thanh toán</p>
                            <p className="text-slate-600">{formatCurrency(refund.tongTienThanhToan)}</p>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mt-2">Số tiền cần hoàn</p>
                            <p className="text-lg font-bold text-amber-600">{formatCurrency(refund.soTienHoan)}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-5 rounded-xl bg-sky-50/60 border border-sky-100 p-3 text-xs text-slate-500">
                    Vui lòng chuyển khoản hoàn tiền cho khách trước khi bấm xác nhận bên dưới.
                </div>

                <div className="flex gap-3 mt-5">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 border border-slate-200 text-slate-600 py-2.5 text-xs font-bold tracking-wide rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={() => onConfirm(refund.maThanhToan)}
                        disabled={isLoading}
                        className="flex-1 bg-emerald-500 text-white py-2.5 text-xs font-bold tracking-wide rounded-xl hover:bg-emerald-600 transition-all shadow-sm shadow-emerald-500/10 disabled:opacity-50"
                    >
                        {isLoading ? "Đang xử lý..." : "Xác nhận đã hoàn tiền"}
                    </button>
                </div>
            </div>
        </div>
    );
}