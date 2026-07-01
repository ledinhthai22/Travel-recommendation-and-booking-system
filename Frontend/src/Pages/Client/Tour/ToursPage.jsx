import React, { useEffect, useMemo, useState, useCallback } from "react";
import { MapPin } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import TourCard from "~/components/Tours/TourCard";
import SectionHeader from "~/components/Common/SectionHeader";
import Pagination from "~/components/Common/Pagination";
import FeaturedCarousel from "~/components/Common/FeaturedCarousel";
import SectionTitle from "~/components/Common/SectionTitle";
import Loading from "~/components/Common/Loading";
import EmptyState from "~/components/Common/EmptyState";
import useAuth from "~/Hooks/useAuth";
import TourFilter from "./TourFilter";
import { useBestTours } from "~/Hooks/useBestTours";
import { getMyWishlistIdsApi } from '~/Services/TourService';
import { mapApiTourToCard } from "~/utils/mapTourCard";
import { getToursByLocationSlugApi } from "~/Services/TourService";
import { getTourDesignJustForYouApi, getRecommendedToursApi, searchToursApi, getLatestToursApi } from "~/Services/HomeService";

export default function Tours() {
    const PAGE_SIZE = 99999
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Tất cả");
    const [sort, setSort] = useState("featured");
    const [page, setPage] = useState(1);

    const [maxPrice, setMaxPrice] = useState(50000000);
    const [ratings, setRatings] = useState([]);
    const [dayFilters, setDayFilters] = useState([]);

    const [searchParams] = useSearchParams();
    const [locationName, setLocationName] = useState("");
    const diaDiemSlug = searchParams.get("diaDiem");
    const [tenDiaDiem, setTenDiaDiem] = useState("");
    const { user, isAuthenticated } = useAuth();
    const isLoggedIn = !!user;
    const { tours: bestTours, loading: bestToursLoading } = useBestTours(12, "next-trip");
    const [wishlistIds, setWishlistIds] = useState([]);
    const [filterParams, setFilterParams] = useState({
        keyword: "",
        category: "Tất cả",
        maxPrice: 50000000,
        ratings: [],
        dayFilters: [],
        sort: "featured",
        pageNumber: 1,
        pageSize: 12
    });

    const [toursData, setToursData] = useState({ items: [], totalItems: 0 });

    const fetchTours = async () => {
        setLoading(true);
        try {
            const response = await searchToursApi(filterParams);
            setToursData(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTours();
    }, [filterParams]);

    useEffect(() => {
        if (isAuthenticated) {
            getMyWishlistIdsApi().then(ids => setWishlistIds(ids));
        }
    }, [isAuthenticated]);


    const loadTours = useCallback(async () => {
        try {
            setLoading(true);

            if (isLoggedIn && searchParams.get("view") === "personalized") {
                const data = await getTourDesignJustForYouApi(20);
                setTours((data || []).map(mapApiTourToCard));
                setTenDiaDiem("Tour dành riêng cho bạn");
            }
            else if (isLoggedIn && searchParams.get("view") === "recommended") {
                const data = await getRecommendedToursApi(20);
                setTours((data || []).map(mapApiTourToCard));
                setTenDiaDiem("Có thể bạn quan tâm");
            }
            else if (diaDiemSlug) {
                const response = await getToursByLocationSlugApi(diaDiemSlug);
                setTenDiaDiem(response?.tenDiaDiem || "");
                setTours((response?.tours || []).map(mapApiTourToCard));
            }
            else {
                const response = await getLatestToursApi();
                setTours((response || []).map(mapApiTourToCard));
            }
        } catch (error) {
            console.error("Lỗi loadTours:", error);
            setTours([]);
        } finally {
            setLoading(false);
        }
    }, [diaDiemSlug, isLoggedIn, searchParams]); // bỏ mapApiTourToCard khỏi deps vì giờ nó là import ổn định, không phải useCallback nội bộ nữa

    useEffect(() => {
        loadTours();
    }, [loadTours]);

    useEffect(() => {
        setPage(1);
    }, [diaDiemSlug]);

    const featuredTours = useMemo(() => {
        return tours.filter((tour) => tour.featured);
    }, [tours]);

    const filtered = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        const result = tours.filter((tour) => {
            const name = tour.name?.toLowerCase() || "";
            const destination =
                tour.destination?.toLowerCase() || "";

            const matchSearch =
                !keyword ||
                name.includes(keyword) ||
                destination.includes(keyword);

            const matchCategory =
                category === "Tất cả" ||
                tour.category === category;

            const matchPrice =
                Number(tour.price || 0) <= maxPrice;

            const matchRating =
                ratings.length === 0 ||
                ratings.some(
                    (rating) =>
                        Number(tour.rating || 0) >= rating
                );

            const days =
                parseInt(tour.ngay) ||
                parseInt(tour.duration) ||
                0;

            const matchDays =
                dayFilters.length === 0 ||
                dayFilters.some((filter) => {
                    if (filter === "2-3")
                        return days >= 2 && days <= 3;

                    if (filter === "4-7")
                        return days >= 4 && days <= 7;

                    if (filter === "7+")
                        return days > 7;

                    return false;
                });

            return (
                matchSearch &&
                matchCategory &&
                matchPrice &&
                matchRating &&
                matchDays
            );
        });

        return [...result].sort((a, b) => {
            if (sort === "price_asc")
                return (a.price || 0) - (b.price || 0);

            if (sort === "price_desc")
                return (b.price || 0) - (a.price || 0);

            if (sort === "rating")
                return (b.rating || 0) - (a.rating || 0);

            return (
                (b.featured ? 1 : 0) -
                (a.featured ? 1 : 0)
            );
        });
    }, [
        tours,
        search,
        category,
        maxPrice,
        ratings,
        dayFilters,
        sort
    ]);

    const totalPages = Math.ceil(
        filtered.length / PAGE_SIZE
    );

    const paginated = useMemo(() => {
        return filtered.slice(
            (page - 1) * PAGE_SIZE,
            page * PAGE_SIZE
        );
    }, [filtered, page]);

    const resetFilters = () => {
        setSearch("");
        setCategory("Tất cả");
        setSort("featured");
        setMaxPrice(50000000);
        setRatings([]);
        setDayFilters([]);
        setPage(1);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="mt-20">
            {!diaDiemSlug &&
                featuredTours.length > 0 && (
                    <section className="mt-30">
                        <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                            <SectionTitle
                                eyebrow={
                                    isLoggedIn
                                        ? " Các tour phù hợp dành cho bạn"
                                        : "Được yêu thích"
                                }
                                title={
                                    isLoggedIn
                                        ? "Gợi ý cho chuyến đi tiếp theo"
                                        : "Tour nổi bật"
                                }
                                description={
                                    isLoggedIn
                                        ? "Khám phá những hành trình phù hợp với sở thích và các điểm đến bạn quan tâm."
                                        : "Những hành trình được nhiều du khách quan tâm, có lịch trình tối ưu và trải nghiệm đáng giá."
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
                                    items={bestTours.map(mapApiTourToCard)}
                                    renderItem={(tour) => (
                                        <TourCard
                                            id={tour.id}
                                            slug={tour.slug || tour.id}
                                            name={tour.name}
                                            image={tour.image}              // đã là full URL sẵn, không ghép domain nữa
                                            duration={tour.duration}         // util đã build sẵn chuỗi "X ngày Y đêm"
                                            destination={tour.destination}
                                            price={tour.price}
                                            rating={tour.rating}
                                            reviewCount={tour.reviewCount}
                                            tourType={tour.tourType}
                                            initialWishlist={wishlistIds.includes(tour.id)}
                                        />
                                    )}
                                    itemsPerPage={5}
                                    gap={30}
                                    autoPlayMs={4000}
                                />
                            ) : (
                                <p className="text-center text-slate-400 py-6">Không tìm thấy tour nào.</p>
                            )}
                        </div>
                    </section>
                )}

            <section id="all-tours">
                <div className="mx-auto max-w-[1440px] px-4 md:px-8 mt-5 mb-10">

                    <SectionHeader
                        title={
                            tenDiaDiem
                                ? `Các tour tại ${tenDiaDiem}`
                                : isLoggedIn
                                    ? "Khám phá những hành trình phù hợp với bạn"
                                    : "Tất cả các chuyến đi"
                        }
                    />
                    {tenDiaDiem && (
                        <div className="mb-6 rounded-2xl bg-sky-50 px-4 py-3">
                            <p className="text-sm text-sky-700">
                                Đang xem các tour thuộc địa điểm:
                                <span className="ml-2 font-semibold capitalize">
                                    {tenDiaDiem}
                                </span>
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">

                        <aside className="lg:sticky lg:top-24 lg:self-start">
                            <TourFilter
                                maxPrice={maxPrice}
                                setMaxPrice={setMaxPrice}
                                ratings={ratings}
                                setRatings={setRatings}
                                dayFilters={dayFilters}
                                setDayFilters={setDayFilters}
                                category={category}
                                setCategory={setCategory}
                            />
                        </aside>

                        <main className="min-w-0">

                            {filtered.length === 0 ? (
                                <EmptyState
                                    title="Không tìm thấy tour"
                                    keyword={search}
                                    keywordLabel="từ khóa"
                                    emptyMessage="Không có tour phù hợp với bộ lọc hiện tại."
                                    suggestions={[
                                        "Thử từ khóa khác",
                                        "Xóa bớt bộ lọc",
                                        "Chọn danh mục hoặc thời gian khác"
                                    ]}
                                    buttonText="Xóa bộ lọc"
                                    onReset={resetFilters}
                                />
                            ) : (
                                <>
                                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-sm text-slate-500">
                                            {isLoggedIn
                                                ? `Có ${filtered.length} tour phù hợp với bạn`
                                                : `Tìm thấy ${filtered.length} tour`}
                                        </p>

                                        <p className="flex items-center gap-1.5 text-sm text-slate-400">
                                            <MapPin size={15} />
                                            Chọn tour để xem lịch trình và đặt chỗ
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                                        {paginated.map(
                                            (tour) => (
                                                <TourCard
                                                    key={tour.id}
                                                    {...tour}
                                                    initialWishlist={wishlistIds.includes(tour.id)}
                                                    showWishlist={true}
                                                    disableLink={true}
                                                    tourType={tour.tourType}
                                                />
                                            )
                                        )}
                                        {console.log("paginated =", paginated)}
                                    </div>

                                    {totalPages > 1 && (
                                        <Pagination
                                            currentPage={page}
                                            totalPages={
                                                totalPages
                                            }
                                            onPageChange={
                                                setPage
                                            }
                                        />
                                    )}
                                </>
                            )}

                        </main>
                    </div>
                </div>
            </section>
        </div>
    );
}
