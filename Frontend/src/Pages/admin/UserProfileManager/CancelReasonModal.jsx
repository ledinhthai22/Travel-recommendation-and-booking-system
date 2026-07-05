import { useState } from "react";
import { X } from "lucide-react";

const CANCEL_REASONS = [
    "Tôi thay đổi lịch trình cá nhân",
    "Tôi tìm được tour khác phù hợp hơn",
    "Vấn đề tài chính",
    "Đặt nhầm hoặc đặt trùng",
    "Khác",
];

export default function CancelReasonModal({ isOpen, onClose, onConfirm, isLoading, warningMessage = null }) {
    const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);
    const [otherReason, setOtherReason] = useState("");
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const isOther = selectedReason === "Khác";

    const handleClose = () => {
        setSelectedReason(CANCEL_REASONS[0]);
        setOtherReason("");
        setError("");
        onClose();
    };

    const handleSubmit = () => {
        const finalReason = isOther ? otherReason.trim() : selectedReason;

        if (isOther && !finalReason) {
            setError("Vui lòng nhập lý do hủy.");
            return;
        }

        setError("");
        onConfirm(finalReason);
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg font-bold text-slate-800">Lý do hủy đặt tour</h3>
                    <button
                        onClick={handleClose}
                        className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                {warningMessage && (
                    <div className="mb-4 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
                        <span className="font-bold shrink-0">⚠</span>
                        <span>{warningMessage}</span>
                    </div>
                )}

                <p className="text-xs text-slate-500 mb-4">
                    Vui lòng cho biết lý do hủy đơn này.
                </p>

                <div className="space-y-2.5 mb-4">
                    {CANCEL_REASONS.map((reason) => {
                        const isChecked = selectedReason === reason;
                        return (
                            <label
                                key={reason}
                                className={`flex items-center gap-3 rounded-xl border p-3.5 text-sm cursor-pointer transition-all duration-150 ${
                                    isChecked
                                        ? "border-sky-500 bg-sky-50/40 text-slate-800 font-medium"
                                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                {/* 1. Thẻ input gốc được ẩn đi bằng sr-only */}
                                <input
                                    type="radio"
                                    name="cancel-reason"
                                    value={reason}
                                    checked={isChecked}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                    className="sr-only"
                                />

                                {/* 2. Vòng tròn Radio giả lập tự tạo hoàn toàn bằng Tailwind */}
                                <div
                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-150 ${
                                        isChecked
                                            ? "border-sky-500 bg-white"
                                            : "border-slate-300 bg-white"
                                    }`}
                                >
                                    {/* Chấm xanh ở giữa xuất hiện khi checked */}
                                    <div
                                        className={`w-2 h-2 rounded-full bg-sky-500 transition-all duration-150 ${
                                            isChecked ? "scale-100 opacity-100" : "scale-0 opacity-0"
                                        }`}
                                    />
                                </div>

                                <span className="select-none">{reason}</span>
                            </label>
                        );
                    })}
                </div>

                {isOther && (
                    <div className="mb-4">
                        <textarea
                            className="w-full border border-slate-200 text-sm rounded-xl p-3 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 focus:outline-none transition-all"
                            rows="3"
                            placeholder="Nhập lý do hủy của bạn..."
                            value={otherReason}
                            onChange={(e) => setOtherReason(e.target.value)}
                            maxLength={500}
                        />
                        {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
                    </div>
                )}

                <div className="flex gap-3 mt-5">
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex-1 border border-slate-200 text-slate-600 py-2.5 text-xs font-bold tracking-wide rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1 bg-rose-500 text-white py-2.5 text-xs font-bold tracking-wide rounded-xl hover:bg-rose-600 transition-all shadow-sm shadow-rose-500/10 disabled:opacity-50"
                    >
                        {isLoading ? "Đang xử lý..." : "Xác nhận hủy tour"}
                    </button>
                </div>
            </div>
        </div>
    );
}