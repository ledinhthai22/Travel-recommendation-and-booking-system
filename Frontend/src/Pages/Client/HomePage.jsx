import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import DestinationsCard from '~/components/Destinations/DestinationsCard';
import HeroSection from '~/components/Hero/HeroSection';
import FeaturedCarousel from '~/components/Common/FeaturedCarousel';
import TourCard from '~/components/Tours/TourCard';
import SectionTitle from '~/components/Common/SectionTitle';
import { destinations, bestTours, hotDeals } from '~/constants/Home.constants';
import useBanner from '~/Hooks/useBanner';
import { useReviews } from '~/Hooks/useReview';
import { useState } from 'react';
export default function HomePage() {
    const { banners, loading } = useBanner();
    const {reviews,reviewsloading} = useReviews();

    const activeBanner = banners
    return (
        <div className="min-h-screen bg-white">
            <HeroSection
                title={
                    activeBanner?.tieuDe ||
                    "Khám phá hành trình phù hợp với bạn"
                }
                subtitle="Xem tour, điểm đến hoặc khách sạn bạn thích. Hệ thống sẽ ghi nhận hành vi để gợi ý phù hợp hơn."
                background={
                    activeBanner?.duongDanAnh
                        ? `https://localhost:7016${activeBanner.duongDanAnh}`
                        : "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                }
                link={activeBanner?.linkLienKet}
                badge="Có thể dùng ngay, không cần đăng nhập"
                showSearchBar={true}
            />

            <section className="py-16 md:py-20">
                <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                    <SectionTitle
                        title="Bạn muốn đi đâu ?"
                        description="Khám phá các điểm đến được nhiều du khách yêu thích nhất."
                    />
                    <FeaturedCarousel
                        items={destinations.slice(0, 4)}
                        itemsPerPage={4}
                        gap={30}
                        autoPlayMs={4500}
                        renderItem={(dest) => (
                            <DestinationsCard
                                id={dest.id || dest.slug}
                                image={dest.image || dest.img}
                                name={dest.name}
                                country={dest.country}
                                description={dest.description || dest.desc || 'Khám phá điểm đến nổi bật với nhiều tour hấp dẫn.'}
                                toursCount={dest.toursCount || dest.tours || 0}
                                rating={dest.rating || '0.0'}
                            />
                        )}
                    />
                </div>
            </section>

            <section className="py-16 md:py-20">
                <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                    <SectionTitle
                        title="Ưu đãi nổi bật cho người mới"
                        description="Các tour có mức giá tốt, lịch trình dễ chọn và phù hợp với nhiều nhóm khách."
                        action={
                            <Link
                                to="/Cac-Chuyen-Di"
                                className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:border-[#0EA5E5] hover:bg-[#0EA5E5] hover:text-white"
                            >
                                Xem thêm
                                <ChevronRight size={17} />
                            </Link>
                        }
                    />
                    <FeaturedCarousel
                        items={bestTours.slice(0, 6)}
                        renderItem={(tour) => <TourCard {...tour} />}
                        itemsPerPage={4}
                        gap={30}
                        autoPlayMs={5000}
                    />
                </div>
            </section>
            <section className="py-16 md:py-20">
                <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                    <SectionTitle
                        title="Hot deals"
                        description="Các tour có mức giá tốt, lịch trình dễ chọn và phù hợp với nhiều nhóm khách."
                        action={
                            <Link
                                to="/Cac-Chuyen-Di"
                                className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:border-[#0EA5E5] hover:bg-[#0EA5E5] hover:text-white"
                            >
                                Xem thêm
                                <ChevronRight size={17} />
                            </Link>
                        }
                    />
                    <FeaturedCarousel
                        items={hotDeals.slice(0, 6)}
                        renderItem={(tour) => <TourCard {...tour} />}
                        itemsPerPage={4}
                        gap={30}
                        autoPlayMs={5000}
                    />
                </div>
            </section>
            <section className="border-t border-slate-100 py-20">
            <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-bold text-slate-900">Khách hàng nói gì về chúng tôi</h2>
                    <p className="mt-3 text-slate-500">Những đánh giá chân thực từ khách hàng đã trải nghiệm dịch vụ</p>
                </div>

                {loading ? (
                    <div className="text-center">Đang tải đánh giá...</div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                        {reviews.map((review, index) => (
                            <div key={index} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                <div className="mb-4 flex items-center gap-4">
                                    <img
                                        // Dùng ảnh mặc định nếu chưa có avatar từ DB
                                        src={`https://localhost:7016${review.duongDanAnh}`} 
                                        alt={review.tenNguoiDung}
                                        className="h-14 w-14 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{review.tenNguoiDung}</h3>
                                        <div className="flex items-center gap-1">
                                            {[...Array(review.diemDanhGia || 5)].map((_, i) => (
                                                <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="leading-7 text-slate-600">"{review.noiDung}"</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
        </div>
    );
}