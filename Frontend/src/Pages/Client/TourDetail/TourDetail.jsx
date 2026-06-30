import { useEffect, useState } from "react";
import { Heart, MapPin, Clock } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import TourCard from "~/components/Tours/TourCard";
import SectionTitle from "~/components/Common/SectionTitle";
import FeaturedCarousel from "~/components/Common/FeaturedCarousel";
import AuthModal from "~/components/Auth/AuthModal";

import { SchedulePicker } from "~/components/TourDetail/ScherdulePicker";
import { ImageGallery } from "~/components/TourDetail/ImageGallery";
import { Itinerary } from "~/components/TourDetail/Itinerary";
import { BookingCard } from "~/components/TourDetail/BookingCard";
import { HotelInfo } from "~/components/TourDetail/HotelInfo";
import { Notes } from "~/components/TourDetail/Notes";
import { Reviews } from "~/components/TourDetail/Reviews";

import { getTourBySlugApi } from "~/Services/TourService";
import Breadcrumb from "~/components/UI/Breadcrumbs/Breadcrumbs";
import useAuth from "~/Hooks/useAuth";

export default function TourDetail() {
    const { slug } = useParams();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDeparture, setSelectedDeparture] = useState(null);

    const { user } = useAuth();
    const isLoggedIn = !!user;

    useEffect(() => {
        if (!slug || slug === "undefined") {
            setLoading(false);
            return;
        }

        const fetchTour = async () => {
            try {
                setLoading(true);
                const res = await getTourBySlugApi(slug);

                setTour(res);

                // Chọn chuyến khởi hành đầu tiên (còn chỗ)
                if (res?.chuyenKhoiHanhs?.length > 0) {
                    const validDeparture = res.chuyenKhoiHanhs.find(
                        (d) =>
                            (d.chuyenKhoiHanh.soChoToiDa || 0) - (d.chuyenKhoiHanh.soChoDaDat || 0) > 0
                    ) || res.chuyenKhoiHanhs[0];

                    setSelectedDeparture(validDeparture);
                }
            } catch (err) {
                console.error(err);
                setTour(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTour();
    }, [slug]);

    if (loading) return <div className="p-10 text-center text-slate-500 font-medium animate-pulse">Đang tải thông tin tour...</div>;
    if (!tour) return <div className="p-10 text-center text-slate-500 font-medium">Không tìm thấy tour này.</div>;

    const { tourInfo, images = [], lichTrinh = [], chuyenKhoiHanhs = [] } = tour;

    const breadcrumbItems = [
        { label: "Trang chủ", href: "/" },
        { label: "Các Chuyến đi", href: "/Cac-chuyen-di" },
        { label: tourInfo?.tenTour || "Chi tiết Tour" },
    ];

    // Thu thập khách sạn từ lịch trình (mỗi ngày có KS riêng)
    // Thu thập khách sạn từ lịch trình (unique tự động trong component)
    const hotelsFromItinerary = lichTrinh
        .filter((day) => day.maKhachSan && day.tenKhachSan)
        .map((day) => ({
            maKhachSan: day.maKhachSan,
            tenKhachSan: day.tenKhachSan,
            slug: day.slugKhachSan,
            soSao: day.soSaoKhachSan || 3,
            diaChi: day.diaChiKhachSan || "Không có thông tin địa chỉ",
        }));
    return (
        <div className="min-h-screen bg-slate-50/30">
            <div className="mx-auto mt-20 max-w-[1440px] px-4 py-8 md:px-8">
                <div className="mb-2 px-4 py-3 w-fit">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                        <h1 className="text-3xl font-extrabold leading-tight text-slate-800 md:text-4xl">
                            {tourInfo?.tenTour}
                        </h1>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm">
                                <MapPin size={16} className="text-rose-500" />
                                {selectedDeparture?.chuyenKhoiHanh?.diemDen || "Chưa xác định"}
                            </span>

                            <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm">
                                <Clock size={16} className="text-amber-500" />
                                {tourInfo?.ngay} ngày {tourInfo?.dem} đêm
                            </span>

                            {/* <span className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm">
                                Khởi hành từ {selectedDeparture?.chuyenKhoiHanh?.diemKhoiHanh}
                            </span> */}
                        </div>
                    </div>

                    {/* <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500 transition-all">
                        <Heart size={18} />
                        Yêu thích
                    </button> */}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
                    <div className="flex flex-col gap-10">
                        <ImageGallery images={images} />

                        <SchedulePicker
                            schedules={chuyenKhoiHanhs}
                            selectedDeparture={selectedDeparture}
                            onSelectDeparture={setSelectedDeparture}
                        />

                        <Itinerary itinerary={lichTrinh} />

                        {/* Hiển thị khách sạn theo ngày từ lịch trình */}
                        <HotelInfo
                            hotels={hotelsFromItinerary}
                            tourSlug={slug}
                            tourName={tourInfo?.tenTour}
                        />

                        <Notes />
                        <Reviews reviews={[]} reviewCount={0} />
                    </div>

                    <aside className="sticky top-28 self-start z-20">
                        <BookingCard
                            tour={tourInfo}
                            departure={selectedDeparture}
                            onOpenAuthModal={() => setIsAuthOpen(true)}
                        />
                    </aside>
                </div>

                <AuthModal open={isAuthOpen} onClose={() => setIsAuthOpen(false)} redirectAfterLogin={window.location.pathname + window.location.search}/>
            </div>
        </div>
    );
}