import { useEffect, useState } from "react";
import { X } from "lucide-react"; // Giữ duy nhất icon đóng modal để thao tác
import { getReviewDetailApi } from "~/Services/ReviewService";
import { toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";

export default function ReviewDetailModal({ isOpen, onClose, maDanhGia }) {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imgError, setImgError] = useState(false);

    // Hàm format datetime tự động sang chuẩn: Giờ:Phút Ngày/Tháng/Năm
    const formatDateTime = (dateStr) => {
        if (!dateStr) return "";
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr; // Trả về chuỗi gốc nếu không parse được

            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();

            return `${hours}:${minutes} ${day}/${month}/${year}`;
        } catch {
            return dateStr;
        }
    };

    useEffect(() => {
        if (!isOpen || !maDanhGia) return;

        const fetchDetail = async () => {
            setLoading(true);
            setDetail(null);
            setImgError(false);
            try {
                const data = await getReviewDetailApi(maDanhGia);
                setDetail(data);
            } catch (error) {
                toastError("Tải chi tiết thất bại", getErrorMessage(error));
                onClose();
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [isOpen, maDanhGia]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/20  p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Chi tiết đánh giá</h2>
                    </div>
                    <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition">
                        <X size={18} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-6 overflow-y-auto flex-1">
                    {loading && (
                        <div className="py-12 text-center text-sm text-slate-400 flex flex-col items-center justify-center gap-2">
                            <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                            <span>Đang tải dữ liệu...</span>
                        </div>
                    )}

                    {!loading && detail && (
                        <div className="divide-y divide-slate-100 space-y-5">

                            {/* Dòng 1: Thông tin khách hàng */}
                            <div className="pb-5 flex items-start gap-4">
                                {!imgError && detail.duongDanAnh ? (
                                    <img
                                        src={detail.duongDanAnh}
                                        alt={detail.tenNguoiDung}
                                        className="w-12 h-12 rounded-full object-cover border border-slate-100 flex-shrink-0"
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-lg border border-sky-100 flex-shrink-0">
                                        {detail.tenNguoiDung ? detail.tenNguoiDung.charAt(0).toUpperCase() : "?"}
                                    </div>
                                )}

                                <div className="space-y-1 min-w-0">
                                    <p className="font-bold text-slate-800 text-base leading-tight truncate">
                                        {detail.tenNguoiDung || "Khách hàng ẩn danh"}
                                    </p>
                                    <div className="flex flex-col text-xs text-slate-500 gap-1 mt-1">
                                        {detail.email && <span className="truncate">Email: {detail.email}</span>}
                                        {detail.soDienThoai && <span>SĐT: {detail.soDienThoai}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Dòng 2: Tour được đánh giá */}
                            <div className="py-4 space-y-1">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Tour trải nghiệm
                                </span>
                                <p className="text-sm text-slate-700 font-semibold leading-snug">{detail.tenTour}</p>
                            </div>

                            {/* Dòng 3: Nội dung đánh giá */}
                            <div className="py-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Nội dung phản hồi
                                    </span>
                                    <div className="bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-lg text-xs font-bold border border-amber-100">
                                        {detail.diemDanhGia} sao
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                    {detail.noiDung || <span className="italic text-slate-400">Không có nội dung bình luận.</span>}
                                </p>
                            </div>

                            {/* Dòng 4: Kiểm duyệt trạng thái */}
                            <div className="py-4 space-y-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Trạng thái kiểm duyệt
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 text-[13px] font-bold rounded-full border ${detail.trangThai
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-rose-50 text-rose-700 border-rose-200'
                                        }`}>
                                        {detail.trangThai ? 'Hiển thị công khai' : 'Đang ẩn'}
                                    </span>
                                    {detail.isProcessedByAI && (
                                        <span className="text-[13px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded-2xl italic">Hệ thống tự động</span>
                                    )}
                                </div>

                                {detail.ghiChuKiemDuyet && (
                                    <p className="text-[13px] text-slate-500 italic mt-1 bg-slate-50 p-2.5 rounded-lg border-l-2 border-slate-300">
                                        Ghi chú: {detail.ghiChuKiemDuyet}
                                    </p>
                                )}
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}