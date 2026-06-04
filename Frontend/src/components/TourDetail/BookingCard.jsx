import { Phone, Calendar, MapPin, Clock, Users, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("vi-VN");
}

// Hàm bổ sung để định dạng hiển thị tiền tệ (VND) cho đẹp mắt
function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
}

export function BookingCard({
    tour,
    departure
}) {
    const navigate = useNavigate();

    if (!tour || !departure) {
        return null;
    }

    const handleBooking = () => {
        const bookingData = {
            maTour: tour.maTour,
            tenTour: tour.tenTour,

            hinhAnh: tour.hinhAnh,

            thoiGianTour: tour.thoiGianTour,

            maChuyen: departure.maChuyen,

            maChuyenCode: departure.maChuyenCode,

            ngayKhoiHanh: departure.ngayKhoiHanh,

            ngayKetThuc: departure.ngayKetThuc,

            diemKhoiHanh: departure.diemKhoiHanh,

            diemDen: departure.diemDen,

            soLuongCho: departure.soLuongCho,

            gia: {
                giaNguoiLon:
                    departure.gia.giaNguoiLon,

                giaTreEm:
                    departure.gia.giaTreEm,

                giaEmBe:
                    departure.gia.giaEmBe,

                phuThuPhongDon:
                    departure.gia.phuThuPhongDon,
            },
        };

        sessionStorage.setItem(
            "bookingData",
            JSON.stringify(bookingData)
        );

        navigate("/Thanh-Toan");
    };

    return (
        <div className="sticky top-20 rounded-[20px] border border-slate-300 p-5 shadow-sm bg-white">

            {/* 1. Phần tiêu đề và mã chuyến */}
            <div className="mb-4">
                <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-md font-medium mb-2">
                    Mã: {departure.maChuyenCode}
                </span>
                <h3 className="font-bold text-lg text-slate-800 line-clamp-2">
                    {tour.tenTour}
                </h3>
            </div>

            <hr className="border-slate-100 my-3" />

            {/* 2. Giá tiền nổi bật */}
            <div className="mb-4 space-y-1.5">
                <div className="flex justify-between items-baseline">
                    <span className="text-sm text-slate-500">Giá người lớn:</span>
                    <span className="text-xl font-bold text-orange-500">
                        {formatPrice(departure.gia.giaNguoiLon)}
                    </span>
                </div>
                {departure.gia.giaTreEm && (
                    <div className="flex justify-between items-baseline">
                        <span className="text-sm text-slate-500">Giá trẻ em:</span>
                        <span className="text-md font-semibold text-slate-700">
                            {formatPrice(departure.gia.giaTreEm)}
                        </span>
                    </div>
                )}
            </div>

            <hr className="border-slate-100 my-3" />

            {/* 3. Thông tin chi tiết lịch trình */}
            <div className="space-y-3 my-4 text-sm text-slate-600">
                <div className="flex items-center gap-2.5">
                    <Clock size={16} className="text-slate-400 shrink-0" />
                    <span>Thời gian: <strong className="text-slate-800">{tour.thoiGianTour}</strong></span>
                </div>

                <div className="flex items-center gap-2.5">
                    <Calendar size={16} className="text-slate-400 shrink-0" />
                    <span>Khởi hành: <strong className="text-slate-800">{formatDate(departure.ngayKhoiHanh)}</strong></span>
                </div>

                <div className="flex items-center gap-2.5">
                    <MapPin size={16} className="text-slate-400 shrink-0" />
                    <span className="line-clamp-1">
                        Lộ trình: <strong className="text-slate-800">{departure.diemKhoiHanh} → {departure.diemDen}</strong>
                    </span>
                </div>

                <div className="flex items-center gap-2.5">
                    <Users size={16} className="text-slate-400 shrink-0" />
                    <span>
                        Số chỗ còn nhận:{" "}
                        <strong className={departure.soLuongCho < 5 ? "text-red-500" : "text-emerald-600"}>
                            {departure.soLuongCho} chỗ
                        </strong>
                    </span>
                </div>
            </div>

            {/* 4. Nhóm nút hành động */}
            <div className="mt-5 flex gap-2">
                <a
                    href="tel:1900xxxx" // Thay bằng số hotline thật của bạn
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors shrink-0"
                    title="Gọi tư vấn"
                >
                    <Phone size={18} />
                </a>

                <button
                    onClick={handleBooking}
                    disabled={departure.soLuongCho === 0}
                    className={`flex-1 rounded-full py-2.5 font-semibold text-white transition-colors text-center ${departure.soLuongCho === 0
                            ? "bg-slate-300 cursor-not-allowed"
                            : "bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-100"
                        }`}
                >
                    {departure.soLuongCho === 0 ? "Hết chỗ" : "Đặt ngay"}
                </button>
            </div>
        </div>
    );
}