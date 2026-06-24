import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import DestinationsCard from '~/components/Destinations/DestinationsCard';
import HeroSection from '~/components/Hero/HeroSection';
import FeaturedCarousel from '~/components/Common/FeaturedCarousel';
import TourCard from '~/components/Tours/TourCard';
import SectionTitle from '~/components/Common/SectionTitle';
import { bestTours, hotDeals } from '~/constants/Home.constants';
import useBanner from '~/Hooks/useBanner';
import useHomeLocationsCard from '~/Hooks/useHomeLocationsCard';
import useAuth from '~/Hooks/useAuth';

export default function HomePage() {
    const { user } = useAuth();

    const { banners } = useBanner();
    const { destinations, loading: locationLoading } = useHomeLocationsCard(12);

    const activeBanner = banners;

    const isLoggedIn = !!user

    return (
        <div className="min-h-screen bg-white">
            <HeroSection
                title={
                    activeBanner?.tieuDe ||
                    (isLoggedIn
                        ? `Xin chào ${user.hoTen}, bạn muốn đi đâu hôm nay?`
                        : "Bạn muốn đi đâu hôm nay?")
                }
                subtitle={
                    isLoggedIn
                        ? "Khám phá những tour được đề xuất riêng cho bạn và bắt đầu hành trình mới."
                        : "Khám phá hàng trăm tour du lịch hấp dẫn, đặt tour nhanh chóng và thanh toán an toàn."
                }
                background={
                    activeBanner?.duongDanAnh
                        ? `https://localhost:7016${activeBanner.duongDanAnh}`
                        : "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                }
                link={activeBanner?.linkLienKet}
                badge={
                    isLoggedIn
                        ? "Gợi ý dành riêng cho bạn"
                        : "Đặt tour trực tuyến"
                }
                showSearchBar={true}
            />

            <section className="py-16 md:py-20">
                <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                    <SectionTitle
                        title={
                            isLoggedIn
                                ? "Điểm đến dành cho bạn"
                                : "Điểm đến nổi bật"
                        }
                        description={
                            isLoggedIn
                                ? "Dựa trên sở thích và hoạt động của bạn, đây là những điểm đến có thể bạn sẽ yêu thích."
                                : "Khám phá những địa điểm du lịch được yêu thích với nhiều trải nghiệm hấp dẫn trên khắp Việt Nam."
                        }
                    />

                    {locationLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[30px]">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-72 w-full animate-pulse rounded-3xl bg-slate-200" />
                            ))}
                        </div>
                    ) : destinations && destinations.length > 0 ? (

                        <FeaturedCarousel
                            items={destinations}
                            itemsPerPage={12}
                            gap={30}
                            autoPlayMs={4500}
                            renderItem={(dest) => (
                                <DestinationsCard
                                    key={dest.maDiaDiem}
                                    slug={dest.slug}
                                    image={
                                        dest.duongDanAnh
                                            ? `https://localhost:7016${dest.duongDanAnh}`
                                            : "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
                                    }
                                    name={dest.tenDiaDiem}
                                    country="Việt Nam"
                                    description={dest.moTa || 'Khám phá điểm đến nổi bật với nhiều tour hấp dẫn.'}
                                    toursCount={dest.soLuongTour}
                                    province={dest.tinhThanh}
                                    rating={'5.0'}
                                />
                            )}
                        />
                    ) : (
                        <p className="text-center text-slate-400 py-6">Không tìm thấy địa điểm nào.</p>
                    )}
                </div>
            </section>

            <section className="py-16 md:py-20">
                <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                    <SectionTitle
                        title={
                            isLoggedIn
                                ? "Tour dành riêng cho bạn"
                                : "Tour du lịch nổi bật"
                        }
                        description={
                            isLoggedIn
                                ? "Những hành trình được đề xuất dựa trên sở thích và điểm đến bạn quan tâm."
                                : "Những hành trình được nhiều du khách lựa chọn với lịch trình hấp dẫn và dịch vụ chất lượng."
                        }
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
                        title={
                            isLoggedIn
                                ? "Có thể bạn quan tâm"
                                : "Tour mới cập nhật"
                        }
                        description={
                            isLoggedIn
                                ? "Khám phá những hành trình mới và các điểm đến đang được nhiều du khách lựa chọn."
                                : "Khám phá các tour mới nhất với lịch khởi hành đa dạng và nhiều ưu đãi hấp dẫn."
                        }
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

            {/* --- SECTION ĐÁNH GIÁ KHÁCH HÀNG --- */}
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
                                review: 'Tour được tổ chức rất chuyên nghiệp. Hướng dẫn viên nhiệt tình và lịch trình hợp lý.',
                            },
                            {
                                id: 2,
                                name: 'Trần Thị B',
                                avatar: 'https://i.pravatar.cc/150?img=24',
                                review: 'Đặt tour nhanh chóng, hỗ trợ khách hàng tốt. Chắc chắn sẽ quay lại sử dụng dịch vụ.',
                            },
                            {
                                id: 3,
                                name: 'Lê Minh C',
                                avatar: 'https://i.pravatar.cc/150?img=33',
                                review: 'Khách sạn đẹp, xe đưa đón đúng giờ. Trải nghiệm vượt ngoài mong đợi.',
                            },
                        ].map((review) => (
                            <div
                                key={review.id}
                                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
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