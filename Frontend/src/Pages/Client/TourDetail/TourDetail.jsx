import { useState } from 'react';
import {
    MapPin, Clock, Star, ChevronRight, Phone, Heart,
    CheckCircle, Info
} from 'lucide-react';
import TourCard from '~/components/Tours/TourCard';
import { mockTours } from '~/constants/Tours.constants';
import { useParams, Link } from 'react-router-dom';
import SectionTitle from '~/components/Common/SectionTitle';
import FeaturedCarousel from '~/components/Common/FeaturedCarousel';
import { SchedulePicker } from './ScherdulePicker';
import { ImageGallery } from './ImageGallery';
import { Itinerary } from './Itinerary';
import { BookingCard } from './BookingCard'
import { HotelInfo } from './HotelInfo';
import { Notes } from './Notes';
import { Reviews } from './Reviews';
const MOCK_TOUR = {
    id: 1,
    name: 'Khám Phá Vũng Tàu 2 Ngày 1 Đêm',
    destination: 'Vũng Tàu',
    category: 'Biển đảo',
    duration: '2',
    price: 1599000,
    originalPrice: 2100000,
    rating: 4.8,
    reviewCount: 124,
    groupSize: '10-20 người',
    featured: true,
    images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
        'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&q=80',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=80',
    ],
    schedules: [
        { date: '30/07/2026', label: 'Thứ 5' },
        { date: '31/07/2026', label: 'Thứ 6' },
        { date: '01/08/2026', label: 'Thứ 7' },
        { date: '02/08/2026', label: 'Chủ nhật' },
        { date: '03/08/2026', label: 'Thứ 2' },
        { date: '08/08/2026', label: 'Thứ 7' },
        { date: '09/08/2026', label: 'Chủ nhật' },
        { date: '15/08/2026', label: 'Thứ 7' },
    ],
    pricing: {
        adult: 1599000,
        child: 1060000,
        infant: 0,
        singleSupplement: 0,
    },
    itinerary: [
        {
            day: 1,
            title: 'LÀNG DÂU PHƯỚC HẢI',
            details: [
                'Đón khách tại TP.HCM, khởi hành đi Vũng Tàu',
                'Tham quan Làng Dâu Phước Hải',
                'Nhận phòng khách sạn, nghỉ ngơi',
                'Tự do khám phá bãi biển buổi chiều',
                'Ăn tối hải sản tươi sống tại nhà hàng địa phương',
            ],
        },
        {
            day: 2,
            title: 'BÌNH GIÃ – NÚI DINH – CHÙA HÒA',
            details: [
                'Ăn sáng tại khách sạn',
                'Tham quan Chùa Hòa, Núi Dinh',
                'Ghé thăm Bình Giã và các địa điểm lịch sử',
                'Ăn trưa, mua sắm đặc sản',
                'Trả phòng, khởi hành về TP.HCM',
            ],
        },
    ],
    notes: [
        {
            title: 'Bao gồm dịch vụ',
            content: 'Tour đã bao gồm bữa ăn theo chương trình.'
        },
        {
            title: 'Chính sách trẻ em',
            content: 'Trẻ em dưới 5 tuổi được miễn phí, ngủ chung với bố mẹ.'
        }
    ],
    hotelInfo: {
        name: 'thesong',
        address: 'không biết',
        level: 3
    },
    reviews: [
        { name: 'Nguyễn Thị Lan', rating: 5, date: '15/06/2026', content: 'Tour rất tuyệt, hướng dẫn viên nhiệt tình, lịch trình hợp lý. Sẽ đi lần sau!' },
        { name: 'Trần Văn Minh', rating: 5, date: '02/06/2026', content: 'Chuyến đi thực sự đáng tiền, khách sạn sạch sẽ, đồ ăn ngon.' },
        { name: 'Phạm Thu Hương', rating: 4, date: '20/05/2026', content: 'Nhìn chung ổn, chỉ tiếc thời gian tự do hơi ít.' },
    ],
};

export default function TourDetail() {
    const tour = MOCK_TOUR; // replace with useParams + API call
    const related = mockTours.filter((t) => t.id !== tour.id).slice(0, 4);
    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 mt-20">

                {/* Breadcrumb */}
                <nav className="mb-5 flex items-center gap-1.5 text-xs text-slate-400">
                    <Link to="/" className="hover:text-[#0EA5E5]">Trang chủ</Link>
                    <ChevronRight size={12} />
                    <Link to="/tours" className="hover:text-[#0EA5E5]">Chuyến đi</Link>
                    <ChevronRight size={12} />
                    <span className="text-slate-600">{tour.name}</span>
                </nav>

                {/* Title row */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-Bold leading-tight text-slate-900 md:text-3xl uppercase">
                            {tour.name}
                        </h1>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <MapPin size={14} style={{ color: '#0EA5E5' }} />
                                {tour.destination}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={14} style={{ color: '#0EA5E5' }} />
                                {tour.duration} ngày 1 đêm
                            </span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex shrink-0 gap-2">
                        {/* <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 transition hover:border-slate-300 hover:bg-slate-50">
                            <Share2 size={15} />
                            Chia sẻ
                        </button> */}
                        <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500">
                            <Heart size={15} />
                            Lưu
                        </button>
                    </div>
                </div>

                {/* Main grid */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">

                    {/* Left column */}
                    <div className="flex flex-col gap-8">
                        <ImageGallery images={tour.images} />

                        <div>
                            <SchedulePicker schedules={tour.schedules} />
                        </div>

                        <div>
                            <Itinerary itinerary={tour.itinerary} />
                        </div>

                        <div>
                            <HotelInfo
                                hotelInfo={tour.hotelInfo}
                            />
                        </div>

                        <div>
                            <Notes notes={tour.notes} />
                        </div>

                        <div>
                            <Reviews
                                reviews={tour.reviews}
                                rating={tour.rating}
                                reviewCount={tour.reviewCount}
                            />
                        </div>
                    </div>

                    {/* Right column – booking card */}
                    <aside className="self-start sticky top-24">
                        <BookingCard
                            price={tour.price}
                            originalPrice={tour.originalPrice}
                            rating={tour.rating}
                            reviewCount={tour.reviewCount}
                        />
                    </aside>
                </div>

                {/* Related tours */}
                {related.length > 0 && (
                    <section className="py-16 md:py-20">
                        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                            <SectionTitle
                                title="Các tour liên quan phù hợp với bạn"
                                description="Các tour có mức giá tốt, lịch trình dễ chọn và phù hợp với nhiều nhóm khách."
                                action={
                                    <Link
                                        to="/tours"
                                        className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:border-[#0EA5E5] hover:bg-[#0EA5E5] hover:text-white"
                                    >
                                        Xem thêm
                                        <ChevronRight size={17} />
                                    </Link>
                                }
                            />
                            <FeaturedCarousel
                                items={related.slice(0, 6)}
                                renderItem={(tour) => <TourCard {...tour} />}
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