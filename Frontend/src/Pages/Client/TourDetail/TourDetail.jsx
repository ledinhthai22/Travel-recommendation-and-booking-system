import { useEffect, useState } from "react";
import { Heart, MapPin, Clock } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import TourCard from "~/components/Tours/TourCard";
import SectionTitle from "~/components/Common/SectionTitle";
import FeaturedCarousel from "~/components/Common/FeaturedCarousel";

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

    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDeparture, setSelectedDeparture] = useState(null);
    const { user } = useAuth();
    const isLoggedIn = !!user;
    useEffect(() => {
        const fetchTour = async () => {
            try {
                setLoading(true);
                const res = await getTourBySlugApi(slug);
                setTour(res);

                // Đồng bộ API: Chọn chuyến khởi hành đầu tiên mặc định
                if (res?.chuyenKhoiHanhs && res.chuyenKhoiHanhs.length > 0) {
                    setSelectedDeparture(res.chuyenKhoiHanhs[0]);
                } else {
                    setSelectedDeparture(null);
                }

            } catch (err) {
                console.error(err);
                setTour(null);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchTour();
    }, [slug]);

    if (loading) return <div className="p-10 text-center text-slate-500 font-medium animate-pulse">Đang tải thông tin tour...</div>;
    if (!tour) return <div className="p-10 text-center text-slate-500 font-medium">Không tìm thấy dữ liệu tour yêu cầu.</div>;

    const { tourInfo, images, lichTrinh, chuyenKhoiHanhs } = tour;
    const galleryImages = images || [];
    const related = [];
    const reviews = [];


    const breadcrumbItems = [
        { label: "Trang chủ", href: "/" },
        { label: " Các Chuyến đi", href: "/Cac-chuyen-di" },
        { label: tourInfo?.tenTour || "Chi tiết Tour" }
    ];

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

                        <div className="mt-4 flex flex-wrap items-center">
                            <span className="flex items-center gap-2 rounded-full  px-4 py-2 text-sm font-bold">
                                <MapPin size={10} />
                                {selectedDeparture?.chuyenKhoiHanh?.diemDen || "Chưa xác định"}
                            </span>

                            <span className="flex items-center gap-2 rounded-full  px-4 py-2 text-sm font-bold" >
                                <Clock size={10} />
                                {tourInfo?.ngay} ngày {tourInfo?.dem} đêm
                            </span>

                            <span className="rounded-full px-4 py-2 text-sm font-bold">
                                Khởi hành từ {selectedDeparture?.chuyenKhoiHanh?.diemKhoiHanh}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className="
                            flex items-center gap-2
                            rounded-xl border border-slate-200
                            bg-white px-4 py-3
                            text-sm font-semibold text-slate-600
                            shadow-sm transition-all
                            hover:border-rose-200
                            hover:bg-rose-50
                            hover:text-rose-500
                        "
                        >
                            <Heart size={18} />
                            Yêu thích
                        </button>
                    </div>
                </div>


                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
                    <div className="flex flex-col gap-8">
                        <ImageGallery images={galleryImages} />

                        <SchedulePicker
                            schedules={chuyenKhoiHanhs}
                            selectedDeparture={selectedDeparture}
                            onSelectDeparture={setSelectedDeparture}
                        />

                        <Itinerary itinerary={lichTrinh} />
                        <HotelInfo
                            hotels={tour.khachSans}
                            tourSlug={slug}
                            tourName={tourInfo?.tenTour}
                        />
                        <Notes />
                        <Reviews reviews={reviews} reviewCount={0} />
                    </div>

                    <aside className="sticky top-28 self-start z-20">
                        <BookingCard
                            tour={tourInfo}
                            departure={selectedDeparture}
                        />
                    </aside>
                </div>

                {related.length > 0 && (
                    <section className="py-16">
                        <SectionTitle
                            title={
                                isLoggedIn
                                    ? "Có thể bạn cũng thích"
                                    : "Tour liên quan"
                            }
                            description={
                                isLoggedIn
                                    ? "Những hành trình được gợi ý dựa trên tour bạn đang quan tâm."
                                    : "Khám phá thêm những hành trình tương tự."
                            }
                        />
                        <FeaturedCarousel
                            items={related}
                            renderItem={(t) => <TourCard {...t} />}
                            itemsPerPage={4}
                        />
                    </section>
                )}
            </div>
        </div>
    );
}