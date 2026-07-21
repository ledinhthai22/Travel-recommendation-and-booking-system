import { X, User, Phone, Ticket, Wallet, MessageSquareText, Calendar, CreditCard, AlertCircle, CheckCircle, Clock, Ban, Send } from "lucide-react";
import { formatCurrency } from "~/Helper/FormatCurrency";

// Trạng thái đơn mới (chỉ 6 trạng thái)
const ORDER_STATUS = {
    1: { text: 'Chờ thanh toán', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
    2: { text: 'Chờ duyệt', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
    3: { text: 'Đã duyệt', color: 'bg-sky-50 text-sky-700 border-sky-200', icon: CheckCircle },
    4: { text: 'Đang diễn ra', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Clock },
    5: { text: 'Hoàn tất', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle },
    6: { text: 'Đã hủy', color: 'bg-red-50 text-red-700 border-red-200', icon: Ban },
};

// Trạng thái tài chính mới
const FINANCIAL_STATUS = {
    0: { text: 'Chưa thanh toán', color: 'bg-slate-100 text-slate-600 border-slate-200' },
    1: { text: 'Đã đặt cọc', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    2: { text: 'Đã thanh toán đủ', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    3: { text: 'Đang hoàn tiền', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    4: { text: 'Đã hoàn tiền', color: 'bg-green-50 text-green-700 border-green-200' },
    5: { text: 'Mất cọc', color: 'bg-red-50 text-red-700 border-red-200' },
};

const PAYMENT_METHODS = {
    1: { text: 'VNPay', icon: '💳' },
    2: { text: 'Tiền mặt', icon: '💵' },
    3: { text: 'Chuyển khoản', icon: '🏦' },
};

// Helper functions
const getOrderStatusText = (status) => ORDER_STATUS[status]?.text || 'Không xác định';
const getOrderStatusColor = (status) => ORDER_STATUS[status]?.color || 'bg-slate-100 text-slate-500 border-slate-200';
const getFinancialStatusText = (status) => FINANCIAL_STATUS[status]?.text || 'Không xác định';
const getFinancialStatusColor = (status) => FINANCIAL_STATUS[status]?.color || 'bg-slate-100 text-slate-500 border-slate-200';
const getPaymentMethodText = (method) => PAYMENT_METHODS[method]?.text || 'Không xác định';
const getPaymentMethodIcon = (method) => PAYMENT_METHODS[method]?.icon || '💳';

// Helper để format ngày
const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('vi-VN');
};

const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('vi-VN');
};

// Component hiển thị badge
const StatusBadge = ({ status, type }) => {
    const getConfig = () => {
        if (type === 'order') {
            const config = ORDER_STATUS[status];
            return { text: config?.text || 'Không xác định', color: config?.color || 'bg-slate-100 text-slate-500 border-slate-200' };
        }
        if (type === 'financial') {
            const config = FINANCIAL_STATUS[status];
            return { text: config?.text || 'Không xác định', color: config?.color || 'bg-slate-100 text-slate-500 border-slate-200' };
        }
        return { text: 'Không xác định', color: 'bg-slate-100 text-slate-500 border-slate-200' };
    };

    const config = getConfig();
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.color}`}>
            {config.text}
        </span>
    );
};

// Component Info Row
const InfoRow = ({ icon: Icon, label, value, valueClassName = '' }) => (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100/80 hover:bg-slate-50 transition-colors">
        {Icon && <Icon size={16} className="text-sky-500 mt-0.5 shrink-0" />}
        <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
            <p className={`text-sm font-medium text-slate-800 truncate ${valueClassName}`}>{value || '—'}</p>
        </div>
    </div>
);

// Component Amount Card
const AmountCard = ({ label, amount, highlight = false, subText = null }) => (
    <div className={`flex-1 min-w-[100px] p-3 rounded-xl ${highlight ? 'bg-amber-50/70 border border-amber-100' : 'bg-slate-50/70 border border-slate-100/80'}`}>
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
        <p className={`text-base font-bold ${highlight ? 'text-amber-600' : 'text-slate-700'}`}>
            {formatCurrency(amount)}
        </p>
        {subText && <p className="text-[10px] text-slate-400 mt-0.5">{subText}</p>}
    </div>
);

export default function RefundDetailModal({ isOpen, onClose, refund, onConfirm, isLoading }) {
    if (!isOpen || !refund) return null;

    // Kiểm tra trạng thái tài chính
    const isDangHoanTien = refund.trangThaiTaiChinh === 3;
    const isDaHoanTien = refund.trangThaiTaiChinh === 4;
    const isMatCoc = refund.trangThaiTaiChinh === 5;
    const isChuaThanhToan = refund.trangThaiTaiChinh === 0;
    const isDaDatCoc = refund.trangThaiTaiChinh === 1;
    const isDaThanhToanDu = refund.trangThaiTaiChinh === 2;
    
    // Kiểm tra trạng thái đơn
    const isCancelled = refund.trangThaiDon === 6;
    
    // Kiểm tra có thể xác nhận hoàn tiền không
    const canConfirm = !isDaHoanTien && !isMatCoc && !isChuaThanhToan && isCancelled;

    // Xác định trạng thái hoàn tiền
    const getRefundStatus = () => {
        if (isDangHoanTien) return { text: 'Đang xử lý hoàn tiền', color: 'text-purple-700 bg-purple-50/70 border-purple-100', icon: Clock };
        if (isDaHoanTien) return { text: 'Đã hoàn tiền thành công', color: 'text-green-700 bg-green-50/70 border-green-100', icon: CheckCircle };
        if (isMatCoc) return { text: 'Mất cọc', color: 'text-red-700 bg-red-50/70 border-red-100', icon: Ban };
        if (isChuaThanhToan) return { text: 'Chưa thanh toán', color: 'text-gray-700 bg-gray-50/70 border-gray-100', icon: Ban };
        if (isDaDatCoc) return { text: 'Đã đặt cọc', color: 'text-amber-700 bg-amber-50/70 border-amber-100', icon: Clock };
        if (isDaThanhToanDu) return { text: 'Đã thanh toán đủ', color: 'text-emerald-700 bg-emerald-50/70 border-emerald-100', icon: CheckCircle };
        return null;
    };

    const refundStatus = getRefundStatus();

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 shrink-0 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-amber-50 border border-amber-100">
                            <Wallet size={18} className="text-amber-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Chi tiết yêu cầu hoàn tiền</h2>
                            <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mt-0.5">
                                Mã booking: <span className="font-mono text-slate-600">{refund.maDatCho}</span>
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20">
                    {/* Trạng thái tổng quan */}
                    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                                <AlertCircle size={16} className="text-slate-400" />
                                <span className="text-xs font-medium text-slate-500">Trạng thái đơn:</span>
                            </div>
                            <StatusBadge status={refund.trangThaiDon} type="order" />
                            
                            {refund.trangThaiTaiChinh !== undefined && (
                                <>
                                    <span className="text-slate-300">|</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-slate-500">Tài chính:</span>
                                        <StatusBadge status={refund.trangThaiTaiChinh} type="financial" />
                                    </div>
                                </>
                            )}
                            
                            {refundStatus && (
                                <>
                                    <span className="text-slate-300">|</span>
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${refundStatus.color}`}>
                                        <refundStatus.icon size={14} />
                                        {refundStatus.text}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Grid thông tin chính */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <InfoRow icon={Ticket} label="Tour" value={refund.tenTour} />
                        <InfoRow icon={User} label="Khách hàng" value={refund.hoTenKhachHang} />
                        <InfoRow icon={Phone} label="Số điện thoại" value={refund.soDienThoai || "Chưa cập nhật"} />
                        {refund.email && <InfoRow icon={User} label="Email" value={refund.email} />}
                        {refund.ngayKhoiHanh && (
                            <InfoRow icon={Calendar} label="Ngày khởi hành" value={formatDate(refund.ngayKhoiHanh)} />
                        )}
                    </div>

                    {/* Lý do hủy */}
                    {(refund.lyDoHuy || refund.adminNote) && (
                        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
                            {refund.lyDoHuy && (
                                <div className="flex items-start gap-3">
                                    <MessageSquareText size={16} className="text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Lý do hủy</p>
                                        <p className="text-sm text-slate-700 mt-0.5">{refund.lyDoHuy}</p>
                                    </div>
                                </div>
                            )}
                            {refund.adminNote && (
                                <div className="flex items-start gap-3 mt-3 pt-3 border-t border-slate-100">
                                    <MessageSquareText size={16} className="text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Ghi chú từ admin</p>
                                        <p className="text-sm text-slate-700 mt-0.5">{refund.adminNote}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Thông tin tài chính */}
                    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-3">Thông tin tài chính</p>
                        <div className="flex flex-wrap gap-3">
                            <AmountCard label="Đã thanh toán" amount={refund.tongTienThanhToan} />
                            <AmountCard label="Cần hoàn" amount={refund.soTienHoan} highlight />
                            {refund.tongTien && (
                                <AmountCard label="Tổng giá trị" amount={refund.tongTien} />
                            )}
                        </div>
                    </div>

                    {/* Thông báo trạng thái */}
                    {refundStatus && (
                        <div className={`flex items-start gap-3 p-3 rounded-xl border ${refundStatus.color}`}>
                            <refundStatus.icon size={18} className="shrink-0 mt-0.5" />
                            <p className="text-sm font-medium">{refundStatus.text}</p>
                        </div>
                    )}

                    {/* Hướng dẫn */}
                    {canConfirm && (
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-sky-50/60 border border-sky-100">
                            <AlertCircle size={16} className="text-sky-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-medium text-sky-700">Hướng dẫn xử lý</p>
                                <p className="text-xs text-sky-600 mt-0.5">
                                    Vui lòng chuyển khoản hoàn tiền cho khách hàng theo thông tin trên, 
                                    sau đó bấm "Xác nhận đã hoàn tiền" để hoàn tất quy trình.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-white shrink-0">
                    {canConfirm && (
                        <button
                            onClick={() => onConfirm(refund.maThanhToan)}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white text-xs font-bold tracking-wide rounded-xl hover:bg-emerald-600 transition-all shadow-sm shadow-emerald-500/10 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Xác nhận đã hoàn tiền
                                </>
                            )}
                        </button>
                    )}

                    {!canConfirm && (
                        <button
                            disabled
                            className="px-6 py-2.5 bg-slate-300 text-slate-500 text-xs font-bold tracking-wide rounded-xl cursor-not-allowed"
                        >
                            {isDaHoanTien ? 'Đã hoàn tiền' : isMatCoc ? 'Mất cọc' : isChuaThanhToan ? 'Chưa thanh toán' : 'Đang xử lý'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}