import { Star, MapPin, ChevronRight } from "lucide-react";
import {
    Wifi,
    Waves,
    UtensilsCrossed,
    Car,
    Snowflake,
    Sparkles
} from "lucide-react";
import { Link, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getHotelBySlugApi } from "~/Services/HotelService";
import SectionTitle from "~/components/Common/SectionTitle";
import FeaturedCarousel from "~/components/Common/FeaturedCarousel";
import TourCard from "~/components/Tours/TourCard";
import useAuth from "~/Hooks/useAuth";
import { getRelatedToursByHotelApi } from "~/Services/TourService";
export default function HotelDetail() {
    const [selectedImage, setSelectedImage] = useState(0);
    const { slug } = useParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [relatedTours, setRelatedTours] = useState([]);
    const tourSlug = location.state?.tourSlug;
    const tourName = location.state?.tourName;
    const { user } = useAuth();
    const isLoggedIn = !!user;

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const res = await getHotelBySlugApi(slug);

                setHotel(res);

                if (res?.maKhachSan) {
                    const tours =
                        await getRelatedToursByHotelApi(
                            res.maKhachSan
                        );

                    setRelatedTours(tours);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotel();
    }, [slug]);

    if (loading) return (
        <div className="mt-32 flex flex-col items-center gap-3 text-slate-400">
            <div className="h-8 w-8 rounded-full border-4 border-slate-200 border-t-sky-500 animate-spin" />
            <span className="text-sm">Đang tải...</span>
        </div>
    );

    if (!hotel) return (
        <div className="mt-32 text-center text-slate-500">Không tìm thấy khách sạn</div>
    );

    const BASE_URL = "https://localhost:7016";
    const hotelImages = hotel.hinhAnh?.map((x) => `${BASE_URL}${x.duongDanAnh}`) || [];

    const related = [];
    const amenityIconMap = {
        "Wifi": Wifi,
        "Wifi miễn phí": Wifi,
        "Hồ bơi": Waves,
        "Nhà hàng": UtensilsCrossed,
        "Bãi đỗ xe": Car,
        "Điều hòa": Snowflake,
        "Spa": Sparkles,
    };
    return (
        <div className="mx-auto mt-20 max-w-[1440px] px-6 py-6">

            <nav className="mb-8">
                <div className="flex flex-wrap items-center gap-2 text-sm">

                    <Link
                        to="/"
                        className="text-slate-500 hover:text-sky-600 transition-colors"
                    >
                        Trang chủ
                    </Link>

                    <ChevronRight
                        size={14}
                        className="text-slate-300"
                    />

                    <Link
                        to="/Cac-Chuyen-Di"
                        className="text-slate-500 hover:text-sky-600 transition-colors"
                    >
                        Các chuyến đi
                    </Link>

                    {tourSlug && (
                        <>
                            <ChevronRight
                                size={14}
                                className="text-slate-300"
                            />

                            <Link
                                to={`/Cac-Chuyen-Di/${tourSlug}`}
                                className="text-slate-500 hover:text-sky-600 transition-colors max-w-[250px] truncate"
                            >
                                {tourName}
                            </Link>
                        </>
                    )}

                    <ChevronRight
                        size={14}
                        className="text-slate-300"
                    />

                    <span className="font-semibold text-slate-800 max-w-[320px] truncate">
                        {hotel.tenKhachSan}
                    </span>

                </div>
            </nav>

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900">{hotel.tenKhachSan}</h1>
                <div className="mt-2.5 flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-0.5">
                        {Array.from({ length: hotel.soSao }).map((_, index) => (
                            <Star key={index} size={17} className="fill-yellow-400 text-yellow-400" />
                        ))}
                        {/* <span className="ml-1.5 text-sm text-slate-400">{hotel.soSao} sao</span> */}
                    </div>
                    <span className="flex items-center gap-1.5 text-sm text-slate-500">
                        <MapPin size={14} className="text-sky-500 flex-shrink-0" />
                        {hotel.diaChi}
                    </span>
                </div>
            </div>

            <div className="mb-8 grid grid-cols-12 gap-3">
                <div className="col-span-10">
                    {hotelImages.length > 0 ? (
                        <img
                            src={hotelImages[selectedImage]}
                            alt={hotel.tenKhachSan}
                            className="h-[600px] w-full rounded-2xl object-cover transition-opacity duration-300"
                        />
                    ) : (
                        <div className="h-[600px] w-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
                            Không có ảnh
                        </div>
                    )}
                </div>
                <div className="col-span-2 flex flex-col gap-3 max-h-[600px] overflow-y-auto">
                    {hotelImages.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt=""
                            onClick={() => setSelectedImage(index)}
                            className={`h-[140px] w-full flex-shrink-0 cursor-pointer rounded-xl object-cover border-2 transition-all duration-200 ${selectedImage === index
                                ? "border-sky-500 opacity-100 scale-[0.97]"
                                : "border-transparent opacity-100 hover:opacity-50"
                                }`}
                        />
                    ))}
                </div>
            </div>

            <div className="mb-8 grid grid-cols-12 gap-5">
                <div className="col-span-8 rounded-2xl border border-slate-200 p-5">
                    <h2 className="mb-4 text-[15px] font-bold tracking-wide ">Giới thiệu</h2>
                    <p className="leading-8 text-slate-600">{hotel.moTa}</p>
                    {/* <div className="mt-5  border-slate-100 flex items-start gap-1.5 text-sm text-slate-500">
                        <MapPin size={13} className="text-sky-500 mt-0.5 flex-shrink-0" />
                        <span>{hotel.diaChi}</span>
                    </div> */}
                </div>
                <div className="col-span-4 rounded-2xl border border-slate-200 p-5">
                    <h2 className="mb-4 text-[15px] font-medium  tracking-wide ">
                        {isLoggedIn
                            ? "Tiện ích khách sạn nổi bật dành cho chuyến đi của bạn"
                            : "Tiện ích khách sạn"}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                        {hotel.tienIch?.map((item, index) => {
                            const Icon = amenityIconMap[item.tenTienIch];

                            return (
                                <div
                                    key={item.maTienIch}
                                    className="flex items-center gap-1.5"
                                >
                                    {Icon ? (
                                        <Icon size={15} className="text-sky-500" />
                                    ) : (
                                        <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                                    )}

                                    <span>{item.tenTienIch}</span>
                                </div>
                            );
                        })}

                        {(!hotel.tienIch || hotel.tienIch.length === 0) && (
                            <p className="text-sm text-slate-400">Chưa có thông tin.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Quy định — cấu trúc giữ nguyên */}
            <div className="mb-8 rounded-2xl border border-slate-200 p-6">
                <h2 className="mb-8 text-2xl font-bold text-slate-900">Quy định chỗ nghỉ</h2>

                <div className="mb-8 grid grid-cols-12 gap-6  p-2 border-slate-100">
                    <div className="col-span-2">
                        <h3 className="font-bold text-slate-900">Trẻ em và giường phụ</h3>
                    </div>
                    <div className="col-span-10">
                        <ul className="mb-6 list-disc space-y-2 pl-4 text-sm text-slate-600 leading-7">
                            <li>Giường phụ tùy thuộc vào loại phòng bạn chọn, xin vui lòng kiểm tra thông tin phòng để biết thêm chi tiết.</li>
                            <li>Tất cả trẻ em đều được chào đón.</li>
                        </ul>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="overflow-hidden rounded-2xl border border-sky-200">
                                <div className="bg-sky-50 px-5 py-3.5">
                                    <h4 className="font-semibold text-sky-800 text-sm">Trẻ em: Từ 0 – 10 tuổi</h4>
                                </div>
                                <div className="p-5">
                                    <ul className="list-disc space-y-2 pl-4 text-sm text-slate-600 leading-7">
                                        <li>Ở miễn phí nếu sử dụng giường có sẵn</li>
                                        <li>Nếu cần một giường phụ thì sẽ phụ thu thêm.</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="overflow-hidden rounded-2xl border border-sky-200">
                                <div className="bg-sky-50 px-5 py-3.5">
                                    <h4 className="font-semibold text-sky-800 text-sm">Người lớn: Từ 11 tuổi trở lên</h4>
                                </div>
                                <div className="p-5">
                                    <ul className="list-disc space-y-2 pl-4 text-sm text-slate-600 leading-7">
                                        <li>Cần đặt thêm một giường phụ và sẽ phụ thu thêm.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8 grid grid-cols-12 gap-6 pb-8 border-b border-slate-100">
                    <div className="col-span-2">
                        <h3 className="font-bold text-slate-900">Quy định hủy phòng</h3>
                    </div>
                    <div className="col-span-10">
                        <div className="rounded-xl bg-rose-50 border border-rose-100 px-5 py-4 text-sm text-slate-700 leading-8">
                            Đơn đặt phòng này <strong className="text-rose-600">không hoàn tiền</strong> và không thể thay đổi hoặc chỉnh sửa được.
                            Không đến khách sạn hoặc chỗ nghỉ sẽ được giải quyết như là Vắng Mặt và sẽ phải trả
                            <strong className="text-rose-600"> 100% giá trị đặt phòng</strong> (Quy định của khách sạn).
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-2">
                        <h3 className="font-bold text-slate-900">Quy định khác</h3>
                    </div>
                    <div className="col-span-10">
                        <ul className="list-disc space-y-3 pl-4 text-sm text-slate-600 leading-7">
                            <li>Đối với đặt phòng trả tiền tại khách sạn, khách cần liên hệ chỗ nghỉ trước để xác nhận thời gian nhận phòng.</li>
                            <li>Khi đặt trên 5 phòng, chính sách và điều khoản bổ sung có thể được áp dụng.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {related.length > 0 && (
                <section className="py-16 md:py-20">
                    <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                        <SectionTitle
                            title={
                                isLoggedIn
                                    ? "Các tour có thể bạn sẽ thích"
                                    : "Các tour liên quan"
                            }
                            description={
                                isLoggedIn
                                    ? "Những hành trình được gợi ý dựa trên khách sạn và điểm đến bạn đang xem."
                                    : "Các tour có mức giá tốt, lịch trình dễ chọn và phù hợp với nhiều nhóm khách."
                            }
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
                                <TourCard
                                    id={tour.maTour}
                                    slug={tour.slug}
                                    name={tour.tenTour}
                                    image={`https://localhost:7016${tour.hinhAnhChinh}`}
                                    duration={`${tour.ngay} Ngày ${tour.dem} Đêm`}
                                    destination={tour.diemDens?.[0]}
                                    price={tour.giaTu}
                                    rating={tour.diemDanhGia}
                                    reviewCount={tour.soDanhGia}
                                    tourType={tour.tenLoaiTour}
                                />
                            )}
                            itemsPerPage={4}
                            gap={30}
                            autoPlayMs={5000}
                        />
                    </div>
                </section>
            )}
        </div>
    );
}