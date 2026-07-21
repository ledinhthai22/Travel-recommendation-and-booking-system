import { useEffect, useRef, useState } from "react";
import { Heart, MapPin, Clock, Info, ChevronDown, ChevronUp } from "lucide-react";
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

import {
    getTourBySlugApi
} from "~/Services/TourService";

import { trackDeepInterestApi, trackViewTourApi } from "~/Services/TourRecommendationService"
import Breadcrumb from "~/components/UI/Breadcrumbs/Breadcrumbs";
import useAuth from "~/Hooks/useAuth";
import { getRelatedToursApi } from "~/Services/TourService";

const DEEP_INTEREST_DELAY_MS = 30000;

export default function TourDetail() {
    const { slug } = useParams();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDeparture, setSelectedDeparture] = useState(null);
    const [relatedTours, setRelatedTours] = useState([]);
    const [loadingRelated, setLoadingRelated] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const { user } = useAuth();
    const isLoggedIn = !!user;

    const deepInterestTimerRef = useRef(null);
    const trackedTourIdRef = useRef(null);

    useEffect(() => {
        if (!tour?.tourInfo?.maTour) return;

        const loadRelatedTours = async () => {
            try {
                setLoadingRelated(true);
                const data = await getRelatedToursApi(tour.tourInfo.maTour);
                setRelatedTours(data || []);
            }
            catch (error) {
                console.error("Lỗi load related tours:", error);
            }
            finally {
                setLoadingRelated(false);
            }
        };

        loadRelatedTours();
    }, [tour?.tourInfo?.maTour]);

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

                if (res?.chuyenKhoiHanhs?.length > 0) {
                    const validDeparture = res.chuyenKhoiHanhs.find(
                        (d) =>
                            (d.chuyenKhoiHanh.soChoToiDa || 0) - (d.chuyenKhoiHanh.soChoDaDat || 0) > 0
                    ) || res.chuyenKhoiHanhs[0];

                    setSelectedDeparture(validDeparture);
                }

                const tourId = res?.tourInfo?.maTour;
                if (isLoggedIn && tourId && trackedTourIdRef.current !== tourId) {
                    trackedTourIdRef.current = tourId;

                    trackViewTourApi(tourId).catch((err) =>
                        console.error("Track view failed:", err)
                    );

                    deepInterestTimerRef.current = setTimeout(() => {
                        trackDeepInterestApi(tourId).catch((err) =>
                            console.error("Track deep interest failed:", err)
                        );
                    }, DEEP_INTEREST_DELAY_MS);
                }
            } catch (err) {
                console.error(err);
                setTour(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTour();

        return () => {
            if (deepInterestTimerRef.current) {
                clearTimeout(deepInterestTimerRef.current);
                deepInterestTimerRef.current = null;
            }
        };
    }, [slug, isLoggedIn]);

    if (loading) return <div className="p-10 text-center text-slate-500 font-medium animate-pulse">Đang tải thông tin tour...</div>;
    if (!tour) return <div className="p-10 text-center text-slate-500 font-medium">Không tìm thấy tour này.</div>;

    const { tourInfo, images = [], lichTrinh = [], chuyenKhoiHanhs = [] } = tour;

    const breadcrumbItems = [
        { label: "Trang chủ", href: "/" },
        { label: "Các Chuyến đi", href: "/Cac-chuyen-di" },
        { label: tourInfo?.tenTour || "Chi tiết Tour" },
    ];

    const hotelsFromItinerary = lichTrinh
        .filter((day) => day.maKhachSan && day.tenKhachSan)
        .map((day) => ({
            maKhachSan: day.maKhachSan,
            tenKhachSan: day.tenKhachSan,
            slug: day.slugKhachSan,
            soSao: day.soSaoKhachSan || 3,
            diaChi: day.diaChiKhachSan || "Không có thông tin địa chỉ",
        }));

    // Hàm xử lý mô tả (cắt ngắn nếu dài)
    const truncateDescription = (text, maxLength = 200) => {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

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
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
                    <div className="flex flex-col gap-10">
                        <ImageGallery images={images} />

                        {/* Phần mô tả tour */}
                        {tourInfo?.moTa && (
                            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <Info size={15} className="text-sky-500" />
                                    <h2 className="text-lg font-bold text-slate-800">Giới thiệu tour</h2>
                                </div>
                                <div className="prose prose-slate max-w-none">
                                    <p className={`text-sm text-slate-600 leading-relaxed ${!showFullDescription ? 'line-clamp-4' : ''}`}>
                                        {tourInfo.moTa}
                                    </p>
                                </div>
                                {tourInfo.moTa.length > 200 && (
                                    <button
                                        onClick={() => setShowFullDescription(!showFullDescription)}
                                        className="mt-3 text-sm font-medium text-sky-500 hover:text-sky-600 transition flex items-center gap-1"
                                    >
                                        {showFullDescription ? (
                                            <>
                                                Thu gọn <ChevronUp size={16} />
                                            </>
                                        ) : (
                                            <>
                                                Xem thêm <ChevronDown size={16} />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        )}

                        <SchedulePicker
                            schedules={chuyenKhoiHanhs}
                            selectedDeparture={selectedDeparture}
                            onSelectDeparture={setSelectedDeparture}
                        />

                        <Itinerary itinerary={lichTrinh} />

                        <HotelInfo
                            hotels={hotelsFromItinerary}
                            tourSlug={slug}
                            tourName={tourInfo?.tenTour}
                        />

                        <Notes />
                        <Reviews
                            reviews={tour?.danhGia || []}
                            reviewCount={tour?.danhGia?.length || 0}
                        />
                    </div>

                    <aside className="sticky top-28 self-start z-20">
                        <BookingCard
                            tour={tourInfo}
                            departure={selectedDeparture}
                            onOpenAuthModal={() => setIsAuthOpen(true)}
                        />
                    </aside>
                </div>

                <section className="py-16 md:py-20">
                    <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                        <SectionTitle
                            title="Các tour liên quan"
                            description="Những hành trình tương tự mà bạn có thể quan tâm."
                        />

                        {loadingRelated ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[30px]">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-72 w-full animate-pulse rounded-3xl bg-slate-200"
                                    />
                                ))}
                            </div>
                        ) : relatedTours.length > 0 ? (
                            <FeaturedCarousel
                                items={relatedTours}
                                renderItem={(tour) => (
                                    <TourCard
                                        id={tour.maTour}
                                        slug={tour.slug}
                                        name={tour.tenTour}
                                        image={`https://localhost:7016${tour.duongDanAnh}`}
                                        duration={
                                            tour.dem > 0
                                                ? `${tour.ngay} Ngày ${tour.dem} Đêm`
                                                : `${tour.ngay} Ngày`
                                        }
                                        destination={
                                            Array.isArray(tour.diemDen)
                                                ? tour.diemDen[0]
                                                : tour.diemDen
                                        }
                                        price={tour.giaChuyen}
                                        rating={tour.diemDanhGia}
                                        reviewCount={tour.soLuongDanhGia}
                                        tourType={tour.tenLoaiTour}
                                    />
                                )}
                                itemsPerPage={4}
                                gap={30}
                                autoPlayMs={5000}
                            />
                        ) : (
                            <p className="text-center text-slate-400 py-6">
                                Không có tour liên quan.
                            </p>
                        )}
                    </div>
                </section>

                <AuthModal 
                    open={isAuthOpen} 
                    onClose={() => setIsAuthOpen(false)} 
                    redirectAfterLogin={window.location.pathname + window.location.search} 
                />
            </div>
        </div>
    );
}