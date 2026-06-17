import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import DestinationsCard from '~/components/Destinations/DestinationsCard';
import HeroSection from '~/components/Hero/HeroSection';
import FeaturedCarousel from '~/components/Common/FeaturedCarousel';
import TourCard from '~/components/Tours/TourCard';
import SectionTitle from '~/components/Common/SectionTitle';
import { destinations, bestTours, hotDeals } from '~/constants/Home.constants';
import useBanner from '~/Hooks/useBanner';

export default function HomePage() {
    const { banners, loading } = useBanner();

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
                        <h2 className="text-4xl font-bold text-slate-900">
                            Khách hàng nói gì về chúng tôi
                        </h2>

                        <p className="mt-3 text-slate-500">
                            Những đánh giá chân thực từ khách hàng đã trải nghiệm dịch vụ
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

                        {[
                            {
                                id: 1,
                                name: 'Nguyễn Văn A',
                                avatar: 'https://i.pravatar.cc/150?img=12',
                                review:
                                    'Tour được tổ chức rất chuyên nghiệp. Hướng dẫn viên nhiệt tình và lịch trình hợp lý.',
                            },
                            {
                                id: 2,
                                name: 'Trần Thị B',
                                avatar: 'https://i.pravatar.cc/150?img=24',
                                review:
                                    'Đặt tour nhanh chóng, hỗ trợ khách hàng tốt. Chắc chắn sẽ quay lại sử dụng dịch vụ.',
                            },
                            {
                                id: 3,
                                name: 'Lê Minh C',
                                avatar: 'https://i.pravatar.cc/150?img=33',
                                review:
                                    'Khách sạn đẹp, xe đưa đón đúng giờ. Trải nghiệm vượt ngoài mong đợi.',
                            },
                        ].map((review) => (
                            <div
                                key={review.id}
                                className="
                        rounded-3xl border border-slate-200
                        bg-white p-6 shadow-sm
                        transition-all duration-300
                        hover:-translate-y-1 hover:shadow-lg
                    "
                            >
                                <div className="mb-4 flex items-center gap-4">

                                    <img
                                        src={review.avatar}
                                        alt={review.name}
                                        className="h-14 w-14 rounded-full object-cover"
                                    />

                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            {review.name}
                                        </h3>

                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, index) => (
                                                <Star
                                                    key={index}
                                                    size={12}
                                                    className="fill-amber-400 text-amber-400"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <p className="leading-7 text-slate-600">
                                    "{review.review}"
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}