import React, { useState } from "react";
import {
    Star,
    MapPin,
    Wifi,
    ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

import { MOCK_TOUR } from "~/constants/TourDetail.constants";
import { mockTours } from "~/constants/Tours.constants";

import SectionTitle from "~/components/Common/SectionTitle";
import FeaturedCarousel from "~/components/Common/FeaturedCarousel";
import TourCard from "~/components/Tours/TourCard";

export default function HotelDetail() {
    const [selectedImage, setSelectedImage] = useState(0);

    const tour = MOCK_TOUR;
    const hotel = tour.khachSan;

    const hotelImages = tour.hinhAnh.map(
        (img) => img.duongDanAnh
    );

    const related = mockTours
        .filter((t) => t.id !== tour.maTour)
        .slice(0, 4);

    return (
        <div className="mx-auto mt-20 max-w-[1440px] px-6 py-6">

            {/* Breadcrumb */}
            <nav className="mb-5 flex items-center gap-1.5 text-[13px] text-slate-400">
                <Link
                    to="/"
                    className="hover:text-[#0EA5E5]"
                >
                    Trang chủ
                </Link>

                <ChevronRight size={12} />

                <Link
                    to="/Cac-Chuyen-Di"
                    className="hover:text-[#0EA5E5]"
                >
                    Chuyến đi
                </Link>

                <ChevronRight size={12} />

                <Link
                    to={`/Cac-Chuyen-Di/${tour.maTour}`}
                    className="hover:text-[#0EA5E5]"
                >
                    {tour.tenTour}
                </Link>

                <ChevronRight size={12} />

                <span className="text-slate-600">
                    Khách sạn
                </span>
            </nav>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    {hotel.tenKhachSan}
                </h1>

                <div className="mt-2 flex items-center gap-3">

                    <div className="flex">
                        {Array.from({
                            length: hotel.soSao,
                        }).map((_, index) => (
                            <Star
                                key={index}
                                size={18}
                                className="fill-yellow-400 text-yellow-400"
                            />
                        ))}
                    </div>

                    <span className="flex items-center gap-1 text-slate-600">
                        <MapPin size={16} />
                        {hotel.diaChi}
                    </span>

                </div>
            </div>

            {/* Gallery */}
            <div className="mb-8 grid grid-cols-12 gap-3">

                <div className="col-span-10">
                    <img
                        src={hotelImages[selectedImage]}
                        alt={hotel.tenKhachSan}
                        className="h-[600px] w-full rounded-2xl object-cover"
                    />
                </div>

                <div className="col-span-2 flex flex-col gap-3">

                    {hotelImages.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt=""
                            onClick={() =>
                                setSelectedImage(index)
                            }
                            className={`h-[140px] cursor-pointer rounded-2xl object-cover border-2 transition ${selectedImage === index
                                ? "border-sky-500"
                                : "border-transparent"
                                }`}
                        />
                    ))}

                </div>

            </div>

            {/* Info */}
            <div className="mb-8 grid grid-cols-12 gap-5">

                <div className="col-span-8 rounded-2xl border border-slate-200 p-5">

                    <h2 className="mb-4 text-[18px] font-bold uppercase">
                        Giới thiệu
                    </h2>

                    <p className="leading-8 text-slate-600">
                        {hotel.moTa}
                    </p>

                    <div className="mt-5">
                        <p>
                            <strong>Địa chỉ:</strong>{" "}
                            {hotel.diaChi}
                        </p>
                    </div>

                </div>

                <div className="col-span-4 rounded-2xl border border-slate-200 p-5">

                    <h2 className="mb-4 text-[16px] font-bold uppercase">
                        Tiện nghi
                    </h2>

                    <div className="space-y-3">

                        {hotel.tienNghi.map(
                            (item) => (
                                <div
                                    key={item.maTienNghi}
                                    className="flex items-center gap-2"
                                >
                                    <Wifi size={18} />
                                    {item.tenTienNghi}
                                </div>
                            )
                        )}

                    </div>

                </div>

            </div>

            <div className="mb-8 rounded-2xl border border-slate-200 p-6">
                <h2 className="mb-8 text-2xl font-bold text-slate-900">
                    Quy định chỗ nghỉ
                </h2>

                {/* Trẻ em và giường phụ */}
                <div className="mb-8 grid grid-cols-12 gap-6">
                    <div className="col-span-2">
                        <h3 className="font-bold text-slate-900">
                            Trẻ em và giường phụ
                        </h3>
                    </div>

                    <div className="col-span-10">
                        <ul className="mb-6 list-disc space-y-2 pl-1 text-slate-700">
                            <li>
                                Giường phụ tùy thuộc vào loại phòng bạn chọn, xin vui
                                lòng kiểm tra thông tin phòng để biết thêm chi tiết.
                            </li>

                            <li>Tất cả trẻ em đều được chào đón.</li>
                        </ul>

                        <div className="grid grid-cols-2 gap-5">
                            {/* Card trẻ em */}
                            <div className="overflow-hidden rounded-3xl border border-sky-300">
                                <div className="bg-sky-100 px-6 py-4">
                                    <h4 className="font-bold text-slate-900">
                                        Trẻ em: Từ 0 - 10 tuổi
                                    </h4>
                                </div>

                                <div className="p-6">
                                    <ul className="list-disc space-y-2 pl-5 text-slate-700">
                                        <li>
                                            Ở miễn phí nếu sử dụng giường có sẵn
                                        </li>

                                        <li>
                                            Nếu cần một giường phụ thì sẽ phụ thu thêm.
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Card người lớn */}
                            <div className="overflow-hidden rounded-3xl border border-sky-300">
                                <div className="bg-sky-100 px-6 py-4">
                                    <h4 className="font-bold text-slate-900">
                                        Người lớn: Từ 11 tuổi trở lên
                                    </h4>
                                </div>

                                <div className="p-6">
                                    <ul className="list-disc space-y-2 pl-5 text-slate-700">
                                        <li>
                                            Cần đặt thêm một giường phụ và sẽ phụ thu thêm.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quy định hủy phòng */}
                <div className="mb-8 grid grid-cols-12 gap-6">
                    <div className="col-span-2">
                        <h3 className="font-bold text-slate-900">
                            Quy định hủy phòng
                        </h3>
                    </div>

                    <div className="col-span-10">
                        <p className="leading-8 text-slate-700">
                            Đơn đặt phòng này không hoàn tiền và không thể nào thay đổi
                            hoặc chỉnh sửa được. Không đến khách sạn hoặc chỗ nghỉ sẽ
                            được giải quyết như là Vắng Mặt và sẽ phải trả một khoản
                            tiền là 100% giá trị đặt phòng (Quy định của khách sạn).
                        </p>
                    </div>
                </div>

                {/* Quy định khác */}
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-2">
                        <h3 className="font-bold text-slate-900">
                            Quy định khác
                        </h3>
                    </div>

                    <div className="col-span-10">
                        <ul className="list-disc space-y-3 pl-1 text-slate-700">
                            <li>
                                Đối với đặt phòng trả tiền tại khách sạn, khách cần
                                liên hệ chỗ nghỉ trước để xác nhận thời gian nhận
                                phòng.
                            </li>

                            <li>
                                Khi đặt trên 5 phòng, chính sách và điều khoản bổ sung
                                có thể được áp dụng.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Related tours */}
            <section className="py-16 md:py-20">

                <div className="mx-auto max-w-[1440px] px-4 md:px-8">

                    <SectionTitle
                        title="Các tour liên quan phù hợp với bạn"
                        description="Các tour có mức giá tốt, lịch trình dễ chọn và phù hợp với nhiều nhóm khách."
                        action={
                            <Link
                                to="/tours"
                                className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-[#0EA5E5] hover:text-white"
                            >
                                Xem thêm
                                <ChevronRight size={17} />
                            </Link>
                        }
                    />

                    <FeaturedCarousel
                        items={related}
                        renderItem={(tour) => (
                            <TourCard {...tour} />
                        )}
                        itemsPerPage={4}
                        gap={30}
                        autoPlayMs={5000}
                    />

                </div>

            </section>

        </div>
    );
}
