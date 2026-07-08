import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { MapPin, Search, X, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import TourCard from "~/components/Tours/TourCard";
import SectionHeader from "~/components/Common/SectionHeader";
import SectionTitle from "~/components/Common/SectionTitle";
import Pagination from "~/components/Common/Pagination";
import FeaturedCarousel from "~/components/Common/FeaturedCarousel";
import Loading from "~/components/Common/Loading";
import EmptyState from "~/components/Common/EmptyState";
import useAuth from "~/Hooks/useAuth";
import TourFilter from "./TourFilter";
import { mapApiTourToCard } from "~/utils/mapTourCard";
import {
    getMyWishlistIdsApi,
    filterTourApi

} from "~/Services/TourService";
import { getNextTripSuggestionsApi } from "~/Services/TourRecommendationService"
import { getMostBookedToursApi } from "~/Services/HomeService"
const PAGE_SIZE = 12;
const MIN_PRICE = 1000000;
const MAX_PRICE = 50000000;


const DAY_RANGE_MAP = {
    "2-3": { ngayTu: 2, ngayDen: 3 },
    "4-7": { ngayTu: 4, ngayDen: 7 },
    "7+": { ngayTu: 8, ngayDen: undefined },
};

export default function Tours() {
    const [searchParams] = useSearchParams();
    const diaDiemSlug = searchParams.get("diaDiem");

    const { user, isAuthenticated } = useAuth();
    const isLoggedIn = !!user;

   
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [province, setProvince] = useState(diaDiemSlug || "");
    const [minPrice, setMinPrice] = useState(MIN_PRICE);
    const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
    const [dayFilters, setDayFilters] = useState([]);
    const [page, setPage] = useState(1);

   
    const [tours, setTours] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [wishlistIds, setWishlistIds] = useState([]);


    const [initialLoading, setInitialLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const hasFetchedOnce = useRef(false);
 
    const filterSignatureRef = useRef("");

   
    const [bestTours, setBestTours] = useState([]);
    const [bestToursLoading, setBestToursLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            getMyWishlistIdsApi().then(setWishlistIds).catch(() => { });
        }
    }, [isAuthenticated]);

   
    useEffect(() => {
        const fetchBestTours = async () => {
            setBestToursLoading(true);
            try {
                if (isLoggedIn) {
                    const data = await getNextTripSuggestionsApi(8);
                    setBestTours(Array.isArray(data) ? data : (data?.data || []));
                } else {
                    const data = await getMostBookedToursApi(8);
                    setBestTours(Array.isArray(data) ? data : (data?.data || []));
                }
            } catch (error) {
                console.error("Lỗi khi tải gợi ý chuyến tiếp theo:", error);
                setBestTours([]);
            } finally {
                setBestToursLoading(false);
            }
        };

        fetchBestTours();
    }, [isLoggedIn]);

    const fetchTours = useCallback(async (pageToFetch) => {
        if (!hasFetchedOnce.current) {
            setInitialLoading(true);
        } else {
            setIsFetching(true);
        }

        try {
            const range = DAY_RANGE_MAP[dayFilters[0]] || {};

            const res = await filterTourApi({
                keyword: search.trim() || undefined,
                maLoaiTour: category || undefined,
                minPrice,
                maxPrice,
                ngayTu: range.ngayTu,
                ngayDen: range.ngayDen,
                diemDen: province || undefined,
                pageNumber: pageToFetch,
                pageSize: PAGE_SIZE,
            });

            const items = (res?.items ?? res?.data ?? []).map(mapApiTourToCard);
            setTours(items);
            setTotalItems(res?.totalItems ?? items.length);
            setTotalPages(Math.max(1, Math.ceil((res?.totalItems ?? items.length) / PAGE_SIZE)));
        } catch (error) {
            console.error("Lỗi khi tải danh sách tour:", error);
            setTours([]);
            setTotalItems(0);
            setTotalPages(1);
        } finally {
            hasFetchedOnce.current = true;
            setInitialLoading(false);
            setIsFetching(false);
        }
    }, [search, category, province, minPrice, maxPrice, dayFilters]);


    const debounceRef = useRef(null);
    useEffect(() => {
        const signature = JSON.stringify({ search, category, province, minPrice, maxPrice, dayFilters });
        const filterChanged = signature !== filterSignatureRef.current;
        filterSignatureRef.current = signature;

        const pageToFetch = filterChanged ? 1 : page;
        if (filterChanged && page !== 1) {
            setPage(1); 
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchTours(pageToFetch);
        }, 400);

        return () => clearTimeout(debounceRef.current);
       
    }, [search, category, province, minPrice, maxPrice, dayFilters]);

   
    const isFirstPageEffect = useRef(true);
    useEffect(() => {
        if (isFirstPageEffect.current) {
            isFirstPageEffect.current = false;
            return;
        }
        fetchTours(page);
       
    }, [page]);

    const resetFilters = () => {
        setSearch("");
        setCategory("");
        setProvince("");
        setMinPrice(MIN_PRICE);
        setMaxPrice(MAX_PRICE);
        setDayFilters([]);
        setPage(1);
    };

    return (
        <div className="mt-20">
           
            <section className="py-16 md:py-20">
                <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                    <SectionTitle
                        title={isLoggedIn ? "Gợi ý tour tiếp theo dành cho bạn" : "Tour du lịch nổi bật"}
                        description={
                            isLoggedIn
                                ? "Những hành trình dựa theo nơi bạn tiếp theo"
                                : "Những hành trình được nhiều du khách lựa chọn với lịch trình hấp dẫn và dịch vụ chất lượng."
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
                                    image={`https://localhost:7016${tour.hinhAnhChinh}`}
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

            <section id="all-tours">
                <div className="mx-auto max-w-[1440px] px-4 md:px-8 mt-5 mb-10">
                    <SectionHeader
                        title={
                            province
                                ? `Các tour tại ${province}`
                                : isLoggedIn
                                    ? "Khám phá những hành trình phù hợp với bạn"
                                    : "Tất cả các chuyến đi"
                        }
                    />

                    <div className="relative mx-auto mb-6 max-w-md">
                        <Search
                            size={18}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm theo tên tour..."
                            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm outline-none transition focus:border-[#0EA5E5] focus:ring-2 focus:ring-sky-100"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                aria-label="Xóa từ khóa"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
                        <aside className="lg:sticky lg:top-24 lg:self-start mt-10">
                            <TourFilter
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                setMinPrice={setMinPrice}
                                setMaxPrice={setMaxPrice}
                                dayFilters={dayFilters}
                                setDayFilters={setDayFilters}
                                category={category}
                                setCategory={setCategory}
                                province={province}
                                setProvince={setProvince}
                                onReset={resetFilters}
                            />
                        </aside>

                        <main className="min-w-0 relative">
                            {initialLoading ? (
                                <TourListSkeleton />
                            ) : tours.length === 0 ? (
                                <EmptyState
                                    title="Không tìm thấy tour"
                                    keyword={search}
                                    keywordLabel="từ khóa"
                                    emptyMessage="Không có tour phù hợp với bộ lọc hiện tại."
                                    suggestions={["Thử từ khóa khác", "Xóa bớt bộ lọc", "Chọn danh mục hoặc thời gian khác"]}
                                    buttonText="Xóa bộ lọc"
                                    onReset={resetFilters}
                                />
                            ) : (
                                <>
                                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="flex items-center gap-2 text-sm text-slate-500">
                                            {`Tìm thấy ${totalItems} tour`}
                                            {isFetching && (
                                                <span className="h-3 w-3 rounded-full border-2 border-[#0EA5E5] border-t-transparent animate-spin" />
                                            )}
                                        </p>
                                        <p className="flex items-center gap-1.5 text-sm text-slate-400">
                                            <MapPin size={15} />
                                            Chọn tour để xem lịch trình và đặt chỗ
                                        </p>
                                    </div>

                           
                                    <div
                                        className={`grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 transition-opacity duration-200 ${
                                            isFetching ? "opacity-60 pointer-events-none" : "opacity-100"
                                        }`}
                                    >
                                        {tours.map((tour) => (
                                            <TourCard
                                                key={tour.id}
                                                {...tour}
                                                initialWishlist={wishlistIds.includes(tour.id)}
                                                showWishlist={true}
                                                disableLink={true}
                                                tourType={tour.tourType}
                                            />
                                        ))}
                                    </div>

                                    {totalPages > 1 && (
                                        <Pagination
                                            currentPage={page}
                                            totalPages={totalPages}
                                            onPageChange={setPage}
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

function TourListSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-100" />
            ))}
        </div>
    );
}