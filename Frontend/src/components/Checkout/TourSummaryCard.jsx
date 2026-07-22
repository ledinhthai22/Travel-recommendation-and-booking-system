import React, { useState } from "react";
import { Bus, ChevronDown, ChevronUp, Plane, Train, Ship, Car } from "lucide-react";
import { formatCurrency } from "~/Helper/FormatCurrency";

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN");
};

const formatTime = (dateStr) => {
    if (!dateStr) return "--:--";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false });
};

// Map icon theo loại phương tiện
const iconMap = { Plane, Bus, Train, Ship, Car };

export default function TourSummaryCard({
    bookingData,
    passengers,
    singleRoomCount,
    onProceed,
    step
}) {
    const [showTransport, setShowTransport] = useState(true);

    // Lấy giá từ bookingData
    const adultPrice = bookingData?.gia?.giaNguoiLon || 0;
    const childPrice = bookingData?.gia?.giaTreEm || 0;
    const toddlerPrice = bookingData?.gia?.giaEmBe || 0;
    const singleRoomPrice = bookingData?.gia?.phuThuPhongDon || 0;
    const totalPrice = bookingData?.totalPrice || 0;

    // Lấy icon từ bookingData hoặc mặc định là Bus
    const VehicleIcon = iconMap[bookingData?.icon] || Bus;

    return (
        <div className="sticky top-24 mb-10">
            {/* CARD THÔNG TIN TOUR */}
            <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
                <h3 className="mb-5 text-2xl font-bold text-center text-slate-800">
                    Tóm tắt đơn đặt tour
                </h3>

                {/* TOUR INFO */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <p className="mt-2 flex items-center gap-1 text-[14px] text-slate-500 leading-7">
                            Tên Tour: <span className="font-bold text-slate-800"> {bookingData?.tenTour || "Không có tên tour"} </span>
                        </p>
                        <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
                            Mã chuyến: <span className="font-bold text-slate-800">{bookingData?.maChuyenCode || "---"}</span>
                        </p>
                    </div>
                </div>

                {/* THÔNG TIN CHUYẾN ĐI */}
                <div className="mt-5 border-t border-slate-200 pt-4 text-[13px]">
                    <button
                        type="button"
                        onClick={() => setShowTransport(!showTransport)}
                        className="mb-4 flex w-full items-center justify-between hover:opacity-80 transition"
                    >
                        <h4 className="font-semibold uppercase text-sky-500 text-[13px]">
                            Thông tin chuyến
                        </h4>
                        {showTransport ? (
                            <ChevronUp size={18} className="text-slate-500" />
                        ) : (
                            <ChevronDown size={18} className="text-slate-500" />
                        )}
                    </button>

                    {showTransport && (
                        <>
                            {/* NGÀY ĐI */}
                            <div className="mb-5">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="font-semibold text-slate-700">
                                        Ngày đi: {formatDate(bookingData?.ngayKhoiHanh)}
                                    </span>
                                    <span className="flex items-center gap-1 text-orange-500 text-sm font-medium">
                                        <VehicleIcon size={14} /> 
                                        {bookingData?.tenPhuongTien || "Xe khách"}
                                    </span>
                                </div>

                                <div className="flex justify-between text-[12px] text-slate-600">
                                    <span>{formatTime(bookingData?.ngayKhoiHanh)}</span>
                                    <span>{formatTime(bookingData?.gioDenNoiDi)}</span>
                                </div>

                                <div className="relative my-2">
                                    <div className="absolute left-0 top-[-3px] h-2 w-2 rounded-full bg-slate-500"></div>
                                    <div className="border-t border-dashed border-slate-400"></div>
                                    <div className="absolute right-0 top-[-3px] h-2 w-2 rounded-full bg-slate-500"></div>
                                </div>

                                <div className="flex justify-between text-[13px] text-slate-600">
                                    <span className="font-medium">{bookingData?.diemKhoiHanh || "---"}</span>
                                    <span className="font-medium">{bookingData?.diemDen || "---"}</span>
                                </div>
                            </div>

                            {/* NGÀY VỀ */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="font-semibold text-slate-700">
                                        Ngày về: {formatDate(bookingData?.ngayKetThuc)}
                                    </span>
                                    <span className="flex items-center gap-1 text-sm text-orange-500 font-medium">
                                        <VehicleIcon size={14} /> 
                                        {bookingData?.phuongTien || "Xe khách"}
                                    </span>
                                </div>

                                <div className="flex justify-between text-[12px] text-slate-600">
                                    <span>{formatTime(bookingData?.ngayKetThuc)}</span>
                                    <span>{formatTime(bookingData?.gioDenNoiVe)}</span>
                                </div>

                                <div className="relative my-2">
                                    <div className="absolute left-0 top-[-3px] h-2 w-2 rounded-full bg-slate-500"></div>
                                    <div className="border-t border-dashed border-slate-400"></div>
                                    <div className="absolute right-0 top-[-3px] h-2 w-2 rounded-full bg-slate-500"></div>
                                </div>

                                <div className="flex justify-between text-[13px] text-slate-600">
                                    <span className="font-medium">{bookingData?.diemDen || "---"}</span>
                                    <span className="font-medium">{bookingData?.diemKhoiHanh || "---"}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* CHI PHÍ CHI TIẾT */}
                <div className="mt-5 border-t border-slate-200 pt-4">
                    <h4 className="mb-4 font-semibold text-sky-500 uppercase text-[13px]">
                        Chi phí chi tiết
                    </h4>

                    <div className="space-y-3">
                        {/* Người lớn */}
                        <div className="grid grid-cols-3 text-[13px]">
                            <span className="text-slate-600">Người lớn</span>
                            <span className="text-center text-slate-600">{passengers.adults} x</span>
                            <span className="text-right font-medium text-slate-800">{formatCurrency(adultPrice)}</span>
                        </div>

                        {/* Trẻ em */}
                        {passengers.children > 0 && (
                            <div className="grid grid-cols-3 text-[13px]">
                                <span className="text-slate-600">Trẻ em</span>
                                <span className="text-center text-slate-600">{passengers.children} x</span>
                                <span className="text-right font-medium text-slate-800">{formatCurrency(childPrice)}</span>
                            </div>
                        )}

                        {/* Em bé */}
                        {passengers.toddlers > 0 && (
                            <div className="grid grid-cols-3 text-[13px]">
                                <span className="text-slate-600">Em bé</span>
                                <span className="text-center text-slate-600">{passengers.toddlers} x</span>
                                <span className="text-right font-medium text-slate-800">{formatCurrency(toddlerPrice)}</span>
                            </div>
                        )}

                        {/* Phụ thu phòng đơn */}
                        {singleRoomCount > 0 && (
                            <div className="grid grid-cols-3 text-[13px]">
                                <span className="text-slate-600">Phụ thu phòng</span>
                                <span className="text-center text-slate-600">{singleRoomCount} x</span>
                                <span className="text-right font-medium text-slate-800">{formatCurrency(singleRoomPrice)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CARD TỔNG TIỀN */}
            <div className="mt-5 rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <span className="text-[16px] font-bold text-slate-800">
                        Tổng tiền:
                    </span>
                    <span className="text-[18px] font-bold text-red-500">
                        {formatCurrency(totalPrice)}
                    </span>
                </div>

                <button
                    onClick={onProceed}
                    className="
                        mx-auto
                        mt-4
                        block
                        w-full
                        rounded-full
                        bg-sky-500
                        px-10
                        py-3
                        text-base
                        font-bold
                        text-white
                        shadow-md
                        shadow-sky-500/20
                        transition-all
                        hover:bg-sky-600
                        hover:shadow-sky-500/30
                        active:scale-[0.98]
                    "
                >
                    {step === 1 ? "Tiếp tục" : "Thanh Toán"}
                </button>

                {/* Ghi chú nhỏ */}
                <p className="mt-3 text-center text-[11px] text-slate-400">
                    {step === 1
                        ? "Vui lòng kiểm tra thông tin trước khi tiếp tục"
                        : "Nhấn thanh toán để hoàn tất đặt tour"}
                </p>
            </div>
        </div>
    );
}