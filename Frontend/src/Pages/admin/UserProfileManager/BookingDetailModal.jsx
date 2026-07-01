import { useState } from "react";
import { formatCurrency } from "~/Helper/FormatCurrency";
import ConfirmModal from "~/components/UI/Modal/ConfirmModal";
import { cancelBookingApi } from "~/Services/UserProfile";
import { toastError, toastSuccess } from "~/utils/Toast";
import { createReviewApi } from "~/Services/ReviewService";
import { Star, X, Calendar, CreditCard, Users, MapPin } from "lucide-react";

export default function BookingDetailModal({ isOpen, onClose, booking, onSuccess }) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    const parseVNDate = (dateString) => {
        if (!dateString) return null;

        const [day, month, year] = dateString.split("/").map(Number);
        return new Date(year, month - 1, day);
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const departureDate = parseVNDate(booking?.ngayKhoiHanh);
    const endDate = parseVNDate(booking?.ngayKetThuc);


    const diffDays = departureDate
        ? Math.ceil((departureDate - today) / (1000 * 60 * 60 * 24))
        : 0;


    const isCompleted =
        booking?.trangThai === 3 ||
        (
            booking?.trangThai === 2 &&
            endDate &&
            today > endDate
        );


    const canCancel =
        (booking?.trangThai === 1 || booking?.trangThai === 2) &&
        departureDate &&
        today < departureDate &&
        diffDays >= 3;

    const canReview = isCompleted;
    const getStatusText = () => {
        if (isCompleted) return "Hoàn tất";

        switch (booking?.trangThai) {
            case 1:
                return "Chờ xác nhận";
            case 2:
                return "Đã duyệt";
            case 3:
                return "Hoàn tất";
            case 4:
                return "Đã hủy";
            default:
                return "Không xác định";
        }
    };
    const handleConfirmCancel = async () => {
        setIsLoading(true);
        try {
            await cancelBookingApi(booking.maDonDatTour);
            setIsConfirmOpen(false);
            onClose();
            toastSuccess("Đã hủy tour thành công!");
            if (onSuccess) onSuccess();
        } catch (error) {
            toastError(error.response?.data?.message || "Hủy tour thất bại!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReviewSubmit = async () => {
        setIsSubmitting(true);
        try {
            await createReviewApi({
                maNguoiDung: booking.maNguoiDung,
                maTour: booking.maTour,
                diemDanhGia: parseInt(rating),
                noiDung: comment
            });
            toastSuccess("Gửi đánh giá thành công!");
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            toastError(error.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá!");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !booking) return null;


    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20  p-4 ">
                <div className="w-full max-w-2xl rounded-2xl bg-white p-6 md:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">

                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Chi tiết đơn hàng</h2>
                            <p className="text-xs font-semibold text-slate-400 mt-0.5">Mã booking: #{booking?.maDatCho}</p>
                        </div>
                        <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5 mb-6">
                        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100/80 space-y-3">
                            <h4 className="font-bold text-sky-600 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <MapPin size={13} /> Thông tin hành trình
                            </h4>
                            <div className="text-xs sm:text-sm space-y-2 text-slate-600">
                                <p><strong className="text-slate-800">Tour:</strong> {booking?.tenTour}</p>
                                <p className="flex items-center gap-1"><strong className="text-slate-800 shrink-0"> Lịch trình:</strong> {booking?.ngayKhoiHanh} - {booking?.ngayKetThuc}</p>
                                <p><strong className="text-slate-800">Điểm đến:</strong> {booking?.diaDiem}</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100/80 space-y-3">
                            <h4 className="font-bold text-sky-600 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <CreditCard size={13} /> Chi tiết thanh toán
                            </h4>
                            <div className="text-xs sm:text-sm space-y-2 text-slate-600">
                                <p><strong className="text-slate-800">Thành viên:</strong> {booking?.soLuongNguoiLon} Người lớn, {booking?.soLuongTreEm} Trẻ em</p>
                                <p><strong className="text-slate-800">Phương thức:</strong> {booking?.phuongThucThanhToan || "Chưa cập nhật"}</p>
                                <p><strong className="text-slate-800">Trạng thái đơn:</strong> {getStatusText()}</p>
                                <p className="text-sm font-semibold text-slate-800 border-t border-slate-200/60 pt-1.5 mt-1.5">
                                    Tổng tiền: <span className="text-base text-sky-600 font-bold">{formatCurrency(booking?.tongTien)}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {canCancel && (
                        <div className="mt-6 border-t border-slate-100 pt-4">
                            <button
                                onClick={() => setIsConfirmOpen(true)}
                                disabled={isLoading}
                                className="w-full bg-rose-500 text-white py-2.5 text-xs font-bold tracking-wide rounded-xl hover:bg-rose-600 transition-all shadow-sm shadow-rose-500/10 disabled:opacity-50"
                            >
                                {isLoading ? "Hệ thống đang xử lý..." : "Yêu cầu hủy đặt tour"}
                            </button>
                        </div>
                    )}
                    {canReview ? (
                        <div className="mt-6 border-t border-slate-100 pt-5">
                            <h4 className="font-bold text-slate-800 text-sm mb-3">Đánh giá trải nghiệm chuyến đi</h4>
                            <div className="flex items-center gap-1.5 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={22}
                                        className={`cursor-pointer transition-transform hover:scale-110 ${rating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                            <textarea
                                className="w-full border border-slate-200 text-xs sm:text-sm rounded-xl p-3 mb-4 focus:border-sky-500 focus:outline-none transition-colors"
                                rows="3"
                                placeholder="Sếp cảm thấy chất lượng dịch vụ, hướng dẫn viên và lịch trình thế nào?"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <button
                                onClick={handleReviewSubmit}
                                disabled={isSubmitting}
                                className="w-full bg-sky-500 text-white py-2.5 text-xs font-bold tracking-wide rounded-xl hover:bg-sky-600 shadow-sm shadow-sky-500/10 transition-all"
                            >
                                {isSubmitting ? "Đang gửi dữ liệu..." : "Gửi đánh giá chính thức"}
                            </button>
                        </div>
                    ) : (
                        <div className="mt-6 border-t border-slate-100 pt-5">
                            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center text-sm text-slate-500">
                                Chỉ có thể đánh giá sau khi chuyến đi đã kết thúc.
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                title="Xác nhận hủy đặt tour"
                message="Sếp có chắc chắn muốn thực hiện hủy đặt hành trình này? Hành động sau khi xác nhận không thể hoàn tác."
                onConfirm={handleConfirmCancel}
                onClose={() => setIsConfirmOpen(false)}
            />
        </>
    );
}