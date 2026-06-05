import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import DestinationsCard from '~/components/Destinations/DestinationsCard';
import HeroSection from '~/components/Hero/HeroSection';
import FeaturedCarousel from '~/components/Common/FeaturedCarousel';
import TourCard from '~/components/Tours/TourCard';
import SectionTitle from '~/components/Common/SectionTitle';
import { destinations, bestTours, hotDeals } from '~/constants/Home.constants';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-white">
            <HeroSection
                title="Khám phá hành trình phù hợp với bạn"
                subtitle="Xem tour, điểm đến hoặc khách sạn bạn thích. Hệ thống sẽ ghi nhận hành vi để gợi ý phù hợp hơn."
                background="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
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
        </div>
    );
}