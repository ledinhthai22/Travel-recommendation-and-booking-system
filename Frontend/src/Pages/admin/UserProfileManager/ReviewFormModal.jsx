import { useState } from "react";
import { createReviewApi } from "~/Services/ReviewService";
import { toastError, toastSuccess } from "~/utils/Toast";
import useAuth from "~/Hooks/useAuth";

export default function ReviewFormModal({ isOpen, onClose, booking, onSuccess }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();

    if (!isOpen || !booking) return null;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await createReviewApi({
                maNguoiDung: user.maNguoiDung,
                hoTen: user.hoTen,
                maTour: booking.maTour,
                diemDanhGia: parseInt(rating),
                noiDung: comment
            });
            toastSuccess("Gửi đánh giá thành công!");
            setRating(5);
            setComment("");
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            toastError(error.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 shrink-0">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Đánh giá chuyến đi</h3>
                        <p className="text-xs text-slate-400">{booking?.tenTour}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <p className="text-sm font-semibold text-slate-700 mb-2">Chất lượng chuyến đi</p>
                    <div className="flex items-center gap-1.5 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`text-2xl transition-transform hover:scale-110 focus:outline-none ${
                                    rating >= star ? "text-amber-400" : "text-slate-200"
                                }`}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    <textarea
                        className="w-full border border-slate-200 text-sm rounded-xl p-3 focus:border-sky-500 focus:outline-none transition-colors"
                        rows="4"
                        placeholder="Bạn cảm thấy chất lượng dịch vụ, hướng dẫn viên và lịch trình thế nào?"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 shrink-0 flex justify-end gap-2">

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 text-sm font-bold text-white bg-sky-500 rounded-xl hover:bg-sky-600 shadow-sm shadow-sky-500/15 transition disabled:opacity-50"
                    >
                        {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                    </button>
                </div>
            </div>
        </div>
    );
}