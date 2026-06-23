import { useState } from "react";
import { formatCurrency } from "~/Helper/FormatCurrency";
import ConfirmModal from "~/components/UI/Modal/ConfirmModal";
import { cancelBookingApi } from "~/Services/UserProfile";
import { toastError, toastSuccess } from "~/utils/Toast";

export default function BookingDetailModal({ isOpen, onClose, booking, onSuccess }) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const canCancel = booking?.trangThai === 1 || booking?.trangThai === 2;

    const handleConfirmCancel = async () => {
        setIsLoading(true);
        try {
            await cancelBookingApi(booking.maDonDatTour);
            setIsConfirmOpen(false);
            onClose();
            toastSuccess("Đã hủy tour thành công!");
            if (onSuccess) onSuccess(); 
        } catch (error) {
            const message = error.response?.data?.message || "Hủy tour thất bại, vui lòng thử lại!";
            toastError(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !booking) return null;

    const getStatusText = (status) => {
        switch(status) {
            case 1: return "Chờ xác nhận";
            case 2: return "Đã duyệt";
            case 3: return "Hoàn tất";
            case 4: return "Đã hủy";
            default: return "Không xác định";
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h2 className="text-2xl font-bold">Chi tiết đơn hàng #{booking?.maDatCho}</h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="font-bold text-sky-600">Thông tin hành trình</h4>
                            <p><strong>Tour:</strong> {booking?.tenTour}</p>
                            <p><strong>Khởi hành:</strong> {booking?.ngayKhoiHanh} - {booking?.ngayKetThuc}</p>
                            <p><strong>Điểm đến:</strong> {booking?.diaDiem}</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-sky-600">Chi tiết thanh toán</h4>
                            <p><strong>Số lượng:</strong> {booking?.soLuongNguoiLon} người lớn, {booking?.soLuongTreEm} trẻ em</p>
                            <p><strong>Tổng tiền:</strong> {formatCurrency(booking?.tongTien)}</p>
                            <p><strong>Phương thức:</strong> {booking?.phuongThucThanhToan || "Chưa cập nhật"}</p>
                            <p><strong>Trạng thái:</strong> {getStatusText(booking?.trangThai)}</p>
                        </div>
                    </div>

                    {canCancel && (
                        <div className="mt-8 border-t pt-4">
                            <button 
                                onClick={() => setIsConfirmOpen(true)}
                                disabled={isLoading}
                                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                            >
                                {isLoading ? "Đang xử lý..." : "Hủy đặt tour"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                title="Xác nhận hủy tour"
                message="Sếp có chắc chắn muốn hủy tour này không? Hành động này không thể hoàn tác."
                onConfirm={handleConfirmCancel}
                onClose={() => setIsConfirmOpen(false)}
            />
        </>
    );
}