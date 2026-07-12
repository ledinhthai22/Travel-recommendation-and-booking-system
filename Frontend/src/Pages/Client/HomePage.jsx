import { Link } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import DestinationsCard from '~/components/Destinations/DestinationsCard';
import HeroSection from '~/components/Hero/HeroSection';
import FeaturedCarousel from '~/components/Common/FeaturedCarousel';
import TourCard from '~/components/Tours/TourCard';
import SectionTitle from '~/components/Common/SectionTitle';
import useBanner from '~/Hooks/useBanner';
import useAuth from '~/Hooks/useAuth';
import { useReviews } from '~/Hooks/useReview';
import { getMyWishlistIdsApi } from '~/Services/TourService';
import { getFeaturedToursApi, getNewlyUpdatedToursApi } from "~/Services/HomeService"
import { getFeaturedDestinationsApi } from '~/Services/LocationService';
import {
    getJustForYouApi,
    getRecommendedToursApi,
    getDestinationsForYouApi,
} from '~/Services/TourRecommendationService';
import { useState, useEffect, useCallback } from 'react';


export default function HomePage() {
    const { reviews, reviewsLoading, refetch: refetchReviews } = useReviews();
    const { user, isAuthenticated } = useAuth();
    const { banners } = useBanner();
    const activeBanner = banners;
    const isLoggedIn = !!user;
    const [wishlistIds, setWishlistIds] = useState([]);


    const [location, setLocation] = useState([]);
    const [locationLoading, setLocationLoading] = useState(true);

    const fetchLocations = useCallback(async () => {
        setLocationLoading(true);
        try {
            const data = isAuthenticated
                ? await getDestinationsForYouApi(12)
                : await getFeaturedDestinationsApi(12);
            setLocation(data || []);
        } catch (err) {
            console.error('fetchLocations error:', err);
        } finally {
            setLocationLoading(false);
        }
    }, [isAuthenticated]);


    const [bestTours, setBestTours] = useState([]);
    const [bestToursLoading, setBestToursLoading] = useState(true);

    const fetchBestTours = useCallback(async () => {
        setBestToursLoading(true);
        try {
            const data = isAuthenticated
                ? await getJustForYouApi(12)
                : await getFeaturedToursApi(12);
            setBestTours(data || []);
        } catch (err) {
            console.error('fetchBestTours error:', err);
        } finally {
            setBestToursLoading(false);
        }
    }, [isAuthenticated]);

    const [latestTours, setLatestTours] = useState([]);
    const [latestToursLoading, setLatestToursLoading] = useState(true);

    const fetchLatestTours = useCallback(async () => {
        setLatestToursLoading(true);
        try {
            const data = isAuthenticated
                ? await getRecommendedToursApi(12)
                : await getNewlyUpdatedToursApi(12);
            setLatestTours(data || []);
        } catch (err) {
            console.error('fetchLatestTours error:', err);
        } finally {
            setLatestToursLoading(false);
        }
    }, [isAuthenticated]);


    const fetchWishlist = useCallback(() => {
        if (isAuthenticated) {
            getMyWishlistIdsApi().then(ids => setWishlistIds(ids));
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    useEffect(() => {
        fetchBestTours();
    }, [fetchBestTours]);

    useEffect(() => {
        fetchLatestTours();
    }, [fetchLatestTours]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

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
                        title={isLoggedIn ? "Điểm đến dành cho bạn" : "Điểm đến nổi bật"}
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
                    ) : location && location.length > 0 ? (
                        <FeaturedCarousel
                            items={location}
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
                        title={isLoggedIn ? "Tour dành riêng cho bạn" : "Tour du lịch nổi bật"}
                        description={
                            isLoggedIn
                                ? "Những hành trình được đề xuất dựa trên sở thích và điểm đến bạn quan tâm."
                                : "Những hành trình được nhiều du khách lựa chọn với lịch trình hấp dẫn và dịch vụ chất lượng."
                        }
                        action={
                            <Link
                                to="/Cac-Chuyen-Di?view=personalized"
                                className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:border-[#0EA5E5] hover:bg-[#0EA5E5] hover:text-white"
                            >
                                Xem thêm
                                <ChevronRight size={17} />
                            </Link>
                        }
                    />
                    {bestToursLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[30px]">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-72 w-full animate-pulse rounded-3xl bg-slate-200" />
                            ))}
                        </div>
                    ) : bestTours && bestTours.length > 0 ? (
                        <FeaturedCarousel
                            items={bestTours.slice(0, 6)}
                            renderItem={(tour) => (
                                <TourCard
                                    id={tour.maTour}
                                    slug={tour.slug || tour.maTour}
                                    name={tour.tenTour}
                                    image={tour.hinhAnhChinh ? `https://localhost:7016${tour.hinhAnhChinh}` : null}
                                    duration={tour.dem > 0 ? `${tour.ngay} Ngày ${tour.dem} Đêm` : `${tour.ngay} Ngày`}
                                    destination={tour.diemDens?.[0] || "Đang cập nhật"}
                                    price={tour.giaTu}
                                    rating={tour.diemDanhGia}
                                    reviewCount={tour.soDanhGia}
                                    initialWishlist={wishlistIds.includes(tour.maTour)}
                                    tourType={tour.tenLoaiTour}
                                />
                            )}
                            itemsPerPage={4}
                            gap={30}
                            autoPlayMs={5000}
                        />
                    ) : (
                        <p className="text-center text-slate-400 py-6">Không tìm thấy tour nào.</p>
                    )}
                </div>
            </section>

            <section className="py-16 md:py-20">
                <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                    <SectionTitle
                        title={isLoggedIn ? "Có thể bạn quan tâm" : "Tour mới cập nhật"}
                        description={
                            isLoggedIn
                                ? "Khám phá những hành trình mới và các điểm đến đang được nhiều du khách lựa chọn."
                                : "Khám phá các tour mới nhất với lịch khởi hành đa dạng và nhiều ưu đãi hấp dẫn."
                        }
                        action={
                            <Link
                                to="/Cac-Chuyen-Di?view=recommended"
                                className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:border-[#0EA5E5] hover:bg-[#0EA5E5] hover:text-white"
                            >
                                Xem thêm
                                <ChevronRight size={17} />
                            </Link>
                        }
                    />

                    {latestToursLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[30px]">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-72 w-full animate-pulse rounded-3xl bg-slate-200" />
                            ))}
                        </div>
                    ) : latestTours && latestTours.length > 0 ? (
                        <FeaturedCarousel
                            items={latestTours.slice(0, 6)}
                            renderItem={(tour) => (
                                <TourCard
                                    id={tour.maTour}
                                    slug={tour.slug || tour.maTour}
                                    name={tour.tenTour}
                                    image={tour.hinhAnhChinh ? `https://localhost:7016${tour.hinhAnhChinh}` : null}
                                    duration={tour.dem > 0 ? `${tour.ngay} Ngày ${tour.dem} Đêm` : `${tour.ngay} Ngày`}
                                    destination={tour.diemDens?.[0] || "Đang cập nhật"}
                                    price={tour.giaTu}
                                    rating={tour.diemDanhGia}
                                    reviewCount={tour.soDanhGia}
                                    initialWishlist={wishlistIds.includes(tour.maTour)}
                                    tourType={tour.tenLoaiTour}
                                />
                            )}
                            itemsPerPage={4}
                            gap={30}
                            autoPlayMs={5000}
                        />
                    ) : (
                        <p className="text-center text-slate-400 py-6">Không tìm thấy tour nào.</p>
                    )}
                </div>
            </section>


            <section className="border-t border-slate-100 py-20">
                <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="text-4xl font-bold text-slate-900">Khách hàng nói gì về chúng tôi</h2>
                        <p className="mt-3 text-slate-500">Những đánh giá chân thực từ khách hàng đã trải nghiệm dịch vụ</p>
                    </div>
                    {reviewsLoading ? (
                        <div className="text-center">Đang tải đánh giá...</div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                            {reviews.map((review, index) => {
                                const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.tenNguoiDung || 'U')}&background=0EA5E5&color=fff`;

                                return (
                                    <div key={index} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                        <div className="mb-4 flex items-center gap-4">
                                            <img
                                                src={review.duongDanAnh ? `https://localhost:7016${review.duongDanAnh}` : avatarFallback}
                                                alt={review.tenNguoiDung}
                                                className="h-14 w-14 rounded-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null; // tránh lặp vô hạn nếu fallback cũng lỗi
                                                    e.currentTarget.src = avatarFallback;
                                                }}
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
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}