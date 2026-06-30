import React from "react";
import { Bus, CreditCard, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "~/Helper/FormatCurrency";

const formatDate = (dateStr) => {
    if (!dateStr) return "";

    return new Date(dateStr).toLocaleDateString("vi-VN");
};

export default function TourSummaryCard({
    bookingData,
    passengers,
    singleRoomCount,
    onSubmit,
    step,
    setShowPaymentModal
}) {
    const adultPrice =
        bookingData?.gia?.giaNguoiLon || 0;

    const childPrice =
        bookingData?.gia?.giaTreEm || 0;

    const toddlerPrice =
        bookingData?.gia?.giaEmBe || 0;

    const singleRoomPrice =
        bookingData?.gia?.phuThuPhongDon || 0;
    const [showTransport, setShowTransport] = useState(true);
    

    return (
        <div className="sticky top-24 mb-10">

            {/* CARD THÔNG TIN */}
            <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">

                <h3 className="mb-5 text-2xl font-bold">
                    Tóm tắt đơn đặt tour
                </h3>

                {/* TOUR */}
                <div className="flex gap-4">
                    <img
                        src={
                            bookingData?.hinhAnh?.[0]
                                ?.duongDanAnh
                        }
                        alt={bookingData?.tenTour}
                        className="h-15 w-15 rounded-2xl object-cover"
                    />

                    <div className="flex-1">
                        <h4 className="text-[16px] font-semibold leading-7">
                            {bookingData?.tenTour}
                        </h4>

                        <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
                            <CreditCard size={14} />
                            {bookingData?.maChuyenCode}
                        </p>
                    </div>
                </div>

                <div className="mt-5 border-t border-slate-200 pt-4 text-[13px]">

                    <button
                        type="button"
                        onClick={() => setShowTransport(!showTransport)}
                        className="mb-4 flex w-full items-center justify-between"
                    >
                        <h4 className="font-semibold uppercase text-sky-500">
                            Thông tin chuyến
                        </h4>

                        {showTransport ? (
                            <ChevronUp
                                size={18}
                                className="text-slate-500"
                            />
                        ) : (
                            <ChevronDown
                                size={18}
                                className="text-slate-500"
                            />
                        )}
                    </button>

                    {showTransport && (
                        <>
                            {/* NGÀY ĐI */}
                            <div className="mb-5">

                                <div className="mb-2 flex items-center justify-between">
                                    <span className="font-semibold text-slate-700">
                                        Ngày đi:
                                        {" "}
                                        {formatDate(
                                            bookingData?.ngayKhoiHanh
                                        )}
                                    </span>

                                    <span className="flex items-center gap-1 text-orange-500">
                                        <Bus size={14} />
                                        Xe khách
                                    </span>
                                </div>

                                <div className="flex justify-between text-[12px] text-slate-600">
                                    <span>6:00</span>
                                    <span>8:00</span>
                                </div>

                                <div className="relative my-2">
                                    <div className="absolute left-0 top-[-3px] h-2 w-2 rounded-full bg-slate-500"></div>
                                    <div className="border-t border-dashed border-slate-400"></div>
                                    <div className="absolute right-0 top-[-3px] h-2 w-2 rounded-full bg-slate-500"></div>
                                </div>

                                <div className="flex justify-between text-[13px] text-slate-600">
                                    <span>{bookingData?.diemKhoiHanh}</span>
                                    <span>{bookingData?.diemDen}</span>
                                </div>
                            </div>

                            {/* NGÀY VỀ */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="font-semibold text-slate-700">
                                        Ngày về:
                                        {" "}
                                        {formatDate(
                                            bookingData?.ngayKetThuc
                                        )}
                                    </span>

                                    <span className="flex items-center gap-1 text-orange-500">
                                        <Bus size={14} />
                                        Xe khách
                                    </span>
                                </div>

                                <div className="flex justify-between text-[12px] text-slate-600">
                                    <span>17:30</span>
                                    <span>19:00</span>
                                </div>

                                <div className="relative my-2">
                                    <div className="absolute left-0 top-[-3px] h-2 w-2 rounded-full bg-slate-500"></div>
                                    <div className="border-t border-dashed border-slate-400"></div>
                                    <div className="absolute right-0 top-[-3px] h-2 w-2 rounded-full bg-slate-500"></div>
                                </div>

                                <div className="flex justify-between text-[13px] text-slate-600">
                                    <span>{bookingData?.diemDen}</span>
                                    <span>{bookingData?.diemKhoiHanh}</span>
                                </div>
                            </div>
                        </>
                    )}

                </div>

                {/* CHI PHÍ */}
                <div className="mt-5 border-t border-slate-200 pt-4">

                    <h4 className="mb-4 font-semibold text-sky-500 uppercase text-[13px]">
                        Chi phí chi tiết
                    </h4>

                    <div className="space-y-3">

                        <div className="grid grid-cols-3 text-[12px]">
                            <span >Người lớn</span>

                            <span className="text-center">
                                {passengers.adults} x
                            </span>

                            <span className="text-right">
                                {formatCurrency(adultPrice)}
                            </span>
                        </div>

                        {passengers.children > 0 && (
                            <div className="grid grid-cols-3 text-[12px]">
                                <span >Trẻ em</span>

                                <span className="text-center">
                                    {passengers.children} x
                                </span>

                                <span className="text-right">
                                    {formatCurrency(childPrice)}
                                </span>
                            </div>
                        )}

                        {passengers.toddlers > 0 && (
                            <div className="grid grid-cols-3 text-[12px]">
                                <span >Em bé</span>

                                <span className="text-center">
                                    {passengers.toddlers} x
                                </span>

                                <span className="text-right">
                                    {formatCurrency(toddlerPrice)}
                                </span>
                            </div>
                        )}

                        <div className="grid grid-cols-3 text-[12px]">
                            <span >Phụ thu phòng</span>

                            <span className="text-center">
                                {singleRoomCount} x
                            </span>

                            <span className="text-right">
                                {formatCurrency(singleRoomPrice)}
                            </span>
                        </div>

                    </div>
                </div>
            </div>

            {/* CARD TỔNG TIỀN */}
            <div className="mt-5   rounded-2xl border border-slate-300 bg-white p-5 shadow-sm">

                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <span className="text-[16px] font-bold">
                        Tổng tiền :
                    </span>

                    <span className="text-[16px] font-bold text-red-500">
                        {formatCurrency(
                            bookingData?.totalPrice
                        )}
                    </span>
                </div>

                <button
                    onClick={() => {
                        if (step === 1) {
                            onSubmit();
                        } else {
                            setShowPaymentModal(true);
                        }
                    }}
                    className="
                        mx-auto
                        mt-4
                        block
                        rounded-full
                        bg-sky-500
                        px-10
                        py-2
                        text-lg
                        font-bold
                        text-white
                        shadow-md
                        transition
                        hover:bg-sky-600
                    "
                >
                    {step === 1
                        ? "Tiếp tục"
                        : "Thanh Toán"}
                </button>
            </div>

        </div>
    );
}

