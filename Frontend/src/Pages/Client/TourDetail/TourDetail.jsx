import { useState } from "react";
import { Heart, ChevronRight, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

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

import { MOCK_TOUR } from "~/constants/TourDetail.constants";
import { mockTours } from "~/constants/Tours.constants";

export default function TourDetail() {
    const tour = MOCK_TOUR;

    const [selectedDeparture, setSelectedDeparture] = useState(
        tour.chuyenKhoiHanh?.[0]
    );

    const related = mockTours.slice(0, 4);

    const galleryImages = tour.hinhAnh.map(
        (image) => image.duongDanAnh
    );


    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto mt-20 max-w-[1440px] px-4 py-8 md:px-8">

                <nav className="mb-5 flex items-center gap-1.5 text-[13px] text-slate-400">
                    <Link to="/" className="hover:text-[#0EA5E5]">
                        Trang chủ
                    </Link>

                    <ChevronRight size={12} />

                    <Link
                        to="/tours"
                        className="hover:text-[#0EA5E5]"
                    >
                        Chuyến đi
                    </Link>

                    <ChevronRight size={12} />

                    <span className="text-slate-600">
                        {tour.tenTour}
                    </span>
                </nav>

                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold uppercase leading-tight text-slate-900 md:text-3xl">
                            {tour.tenTour}
                        </h1>

                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <MapPin
                                    size={14}
                                    color="#0EA5E5"
                                />
                                {selectedDeparture?.diemDen}
                            </span>

                            <span className="flex items-center gap-1.5">
                                <Clock
                                    size={14}
                                    color="#0EA5E5"
                                />
                                {tour.thoiGianTour}
                            </span>
                        </div>
                    </div>

                    <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500">
                        <Heart size={15} />
                        Lưu
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">

                    <div className="flex flex-col gap-8">

                        <ImageGallery
                            images={galleryImages}
                        />

                        <SchedulePicker
                            schedules={tour.chuyenKhoiHanh}
                            selectedDeparture={selectedDeparture}
                            onSelectDeparture={setSelectedDeparture}
                        />

                        <Itinerary
                            itinerary={tour.lichTrinh}
                        />

                        <HotelInfo
                            hotelInfo={tour.khachSan}
                        />

                        <Notes />

                        <Reviews
                            reviews={tour.danhGia}
                            reviewCount={
                                tour.danhGia.length
                            }
                        />
                    </div>

                    <aside className="sticky top-24 self-start">

                        <BookingCard
                            tour={tour}
                            departure={selectedDeparture}
                        />
                    </aside>

                </div>

                {related.length > 0 && (
                    <section className="py-16 md:py-20">
                        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                            <SectionTitle
                                title="Các tour liên quan phù hợp với bạn"
                                description="Các tour có mức giá tốt, lịch trình dễ chọn và phù hợp với nhiều nhóm khách."
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
                )}
            </div>
        </div>
    );
}