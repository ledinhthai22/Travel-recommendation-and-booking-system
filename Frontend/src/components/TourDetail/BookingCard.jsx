import { useNavigate } from "react-router-dom";
import { formatCurrency } from "~/Helper/FormatCurrency";
import { formatDate } from "~/Helper/FormatDate";
import { Clock, Calendar, MapPin, Users, Phone, Ticket } from "lucide-react";
import useAuth from "~/Hooks/useAuth";
import ContactModal from "~/components/UI/Modal/ContactModal";
import { useState } from "react";
export function BookingCard({ tour, departure, hotel, onOpenAuthModal }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    if (!tour || !departure) return null;
    const [showContactModal, setShowContactModal] = useState(false);
    const ckh = departure.chuyenKhoiHanh;
    const giaHienTai = departure.danhSachGia?.[0] || {};

    const soChoToiDa = ckh?.soChoToiDa ?? 0;
    const soChoDaDat = ckh?.soChoDaDat ?? 0;
    const soLuongCho = soChoToiDa - soChoDaDat;

    const handleBooking = () => {
        if (!user) {
            if (typeof onOpenAuthModal === "function") {
                onOpenAuthModal({
                    redirectAfterLogin: window.location.pathname + window.location.search,
                });
            }
            return;
        }
        const bookingData = {
            maNguoiDung: user.maNguoiDung,
            maTour: tour.maTour,
            tenTour: tour.tenTour,
            hinhAnh: tour.hinhAnh,
            thoiGianTour: tour.thoiGianTour,
            slug: tour.slug,
            maChuyen: ckh?.maChuyen,
            maChuyenCode: ckh?.maChuyenCode,
            ngayKhoiHanh: ckh?.ngayKhoiHanh,
            ngayKetThuc: ckh?.ngayKetThuc,
            diemKhoiHanh: ckh?.diemKhoiHanh,
            diemDen: ckh?.diemDen,
            soLuongCho,

            gia: {
                hangKhachSan: giaHienTai.hangKhachSan ?? 0,
                giaNguoiLon: giaHienTai.giaNguoiLon ?? 0,
                giaTreEm: giaHienTai.giaTreEm ?? 0,
                giaEmBe: giaHienTai.giaEmBe ?? 0,
                phuThuPhongDon: giaHienTai.phuThuPhongDon ?? 0,
            },
        };

        sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
        navigate("/Thanh-Toan");
    };

    return (
        <div className="sticky top-20 rounded-[20px] border border-slate-300 p-5 shadow-sm bg-white">
            {/* 1. Tiêu đề và mã chuyến */}
            <div className="mb-4">
                <h3 className="font-bold text-lg text-slate-800 line-clamp-2">
                    {tour.tenTour}
                </h3>
                <span className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded-lg font-medium mt-2">
                    <Ticket size={14} className="text-sky-500" />
                    <span>Mã chuyến: {ckh?.maChuyenCode}</span>
                </span>

            </div>

            <hr className="border-slate-100 my-3" />

            <div className="mb-4 space-y-1.5">
                <div className="flex justify-between items-baseline">
                    <span className="text-sm text-slate-500">Giá người lớn:</span>
                    <span className="text-xl font-bold text-orange-500">
                        {formatCurrency(giaHienTai.giaNguoiLon ?? 0)}
                    </span>
                </div>
                {giaHienTai.giaTreEm != null && (
                    <div className="flex justify-between items-baseline">
                        <span className="text-sm text-slate-500">Giá trẻ em:</span>
                        <span className="text-md font-semibold text-slate-700">
                            {formatCurrency(giaHienTai.giaTreEm)}
                        </span>
                    </div>
                )}
                {giaHienTai.giaEmBe != null && (
                    <div className="flex justify-between items-baseline">
                        <span className="text-sm text-slate-500">Giá em bé:</span>
                        <span className="text-md font-semibold text-slate-700">
                            {formatCurrency(giaHienTai.giaEmBe)}
                        </span>
                    </div>
                )}
                {giaHienTai.phuThuPhongDon != null && (
                    <div className="flex justify-between items-baseline">
                        <span className="text-sm text-slate-500">Phụ thu phòng đơn:</span>
                        <span className="text-md font-semibold text-slate-700">
                            {formatCurrency(giaHienTai.phuThuPhongDon)}
                        </span>
                    </div>
                )}
            </div>

            <hr className="border-slate-100 my-3" />
            <div className="space-y-3 my-4 text-sm text-slate-600">
                <div className="flex items-center gap-2.5">
                    <Clock size={16} className="text-slate-400 shrink-0" />
                    <span>Thời gian: <strong className="text-slate-800">{`${tour.ngay} Ngày ${tour.dem} Đêm`}</strong></span>
                </div>

                <div className="flex items-center gap-2.5">
                    <Calendar size={16} className="text-slate-400 shrink-0" />
                    <span>Khởi hành: <strong className="text-slate-800">{formatDate(ckh?.ngayKhoiHanh)}</strong></span>
                </div>

                <div className="flex items-center gap-2.5">
                    <Calendar size={16} className="text-slate-400 shrink-0" />
                    <span>Kết thúc: <strong className="text-slate-800">{formatDate(ckh?.ngayKetThuc)}</strong></span>
                </div>

                <div className="flex items-center gap-2.5">
                    <MapPin size={16} className="text-slate-400 shrink-0" />
                    <span className="line-clamp-1">
                        Điểm khởi hành: <strong className="text-slate-800">
                            {ckh?.diemKhoiHanh}
                        </strong>
                    </span>
                </div>
                <div className="flex items-center gap-2.5">
                    <MapPin size={16} className="text-slate-400 shrink-0" />
                    <span className="line-clamp-1">
                        Điểm đến: <strong className="text-slate-800">
                            {ckh?.diemDen}
                        </strong>
                    </span>
                </div>
                <div className="flex items-center gap-2.5">
                    <Users size={16} className="text-slate-400 shrink-0" />
                    <span>
                        Số chỗ còn nhận:{" "}
                        <strong className={soLuongCho < 5 ? "text-red-500" : "text-emerald-600"}>
                            {soLuongCho} chỗ
                        </strong>
                    </span>
                </div>
            </div>

            <div className="mt-5 flex gap-2">
                <button
                    onClick={() => setShowContactModal(true)}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors shrink-0"
                    title="Liên hệ tư vấn"
                >
                    <Phone size={18} />
                </button>

                <button
                    onClick={handleBooking}
                    disabled={soLuongCho === 0}
                    className={`flex-1 rounded-full py-2.5 font-semibold text-white transition-colors text-center ${soLuongCho === 0
                        ? "bg-slate-300 cursor-not-allowed"
                        : "bg-sky-500 hover:bg-sky-600 shadow-md shadow-sky-100 cursor-pointer"
                        }`}
                >
                    {soLuongCho === 0 ? "Hết chỗ" : "Đặt ngay"}
                </button>
            </div>
            <ContactModal
                open={showContactModal}
                onClose={() => setShowContactModal(false)}
                tourName={tour.tenTour}
            />
        </div>
    );
}