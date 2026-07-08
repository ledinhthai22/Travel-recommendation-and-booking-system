import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { parseISO } from "date-fns";
import { Search, MapPin, Home,Calendar } from "lucide-react";

import TourCard from "~/components/Tours/TourCard";
import TourFilterBar from "./TourFilterBar";
import Pagination from "~/components/Common/Pagination";
import Breadcrumb from "~/components/UI/Breadcrumbs/Breadcrumbs";
import DatePicker from "~/components/UI/Form/DatePicker";
import { searchToursApi } from "~/Services/SearchService";

const PAGE_SIZE = 12;
const MIN_PRICE = 1000000;
const MAX_PRICE = 50000000;
const IMAGE_BASE_URL = "https://localhost:7016"; // đồng bộ với Tours.jsx / TourDetail.jsx

const DAY_RANGE_MAP = {
    "2-3": { ngayTu: 2, ngayDen: 3 },
    "4-7": { ngayTu: 4, ngayDen: 7 },
    "7+": { ngayTu: 8, ngayDen: undefined },
};

// Đọc toàn bộ filter từ URL 1 lần lúc mount
function readFiltersFromParams(params) {
    const dayFilterParam = params.get("thoiGian");
    return {
        diemDen: params.get("diemDen") || "",
        ngayDi: params.get("ngayDi") || "",
        ngayVe: params.get("ngayVe") || "",
        keyword: params.get("keyword") || "",
        category: params.get("loaiTour") || "",
        minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : MIN_PRICE,
        maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : MAX_PRICE,
        dayFilters: dayFilterParam ? [dayFilterParam] : [],
    };
}

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialFilters = useRef(readFiltersFromParams(searchParams)).current;

    const [searchDiemDen, setSearchDiemDen] = useState(initialFilters.diemDen);
    const [searchNgayDi, setSearchNgayDi] = useState(initialFilters.ngayDi);
    const [searchNgayVe, setSearchNgayVe] = useState(initialFilters.ngayVe);

    const [searchKeyword, setSearchKeyword] = useState(initialFilters.keyword);
    const [category, setCategory] = useState(initialFilters.category);
    const [minPrice, setMinPrice] = useState(initialFilters.minPrice);
    const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice);
    const [dayFilters, setDayFilters] = useState(initialFilters.dayFilters);
    const [page, setPage] = useState(1);

    const [tours, setTours] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [initialLoading, setInitialLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    const hasFetchedOnce = useRef(false);
    const filterSignatureRef = useRef("");

    // Bảo vệ khỏi race-condition: chỉ áp dụng kết quả của request MỚI NHẤT được gửi đi,
    // bỏ qua kết quả của các request cũ trả về muộn hơn.
    const requestIdRef = useRef(0);

    const fetchSearchResults = useCallback(async (pageToFetch) => {
        const currentRequestId = ++requestIdRef.current;

        if (!hasFetchedOnce.current) {
            setInitialLoading(true);
        } else {
            setIsFetching(true);
        }

        try {
            const range = DAY_RANGE_MAP[dayFilters[0]] || {};

            const res = await searchToursApi({
                keyword: searchKeyword.trim() || undefined,
                diemDen: searchDiemDen.trim() || undefined,
                ngayDi: searchNgayDi || undefined,
                ngayVe: searchNgayVe || undefined,
                maLoaiTour: category || undefined,
                minPrice: minPrice !== MIN_PRICE ? minPrice : undefined,
                maxPrice: maxPrice !== MAX_PRICE ? maxPrice : undefined,
                ngayTu: range.ngayTu,
                ngayDen: range.ngayDen,
                pageNumber: pageToFetch,
                pageSize: PAGE_SIZE
            });

            // Có request mới hơn đã được gửi trong lúc chờ -> bỏ kết quả này, không ghi đè state
            if (currentRequestId !== requestIdRef.current) return;

            setTours(res?.items || []);
            setTotalItems(res?.totalItems || 0);
            setTotalPages(Math.max(1, Math.ceil((res?.totalItems || 0) / PAGE_SIZE)));
        } catch (error) {
            if (currentRequestId !== requestIdRef.current) return;
            console.error("Lỗi fetch dữ liệu tìm kiếm:", error);
            setTours([]);
            setTotalItems(0);
            setTotalPages(1);
        } finally {
            if (currentRequestId === requestIdRef.current) {
                hasFetchedOnce.current = true;
                setInitialLoading(false);
                setIsFetching(false);
            }
        }
    }, [searchKeyword, searchDiemDen, searchNgayDi, searchNgayVe, category, minPrice, maxPrice, dayFilters]);

    // Đồng bộ TOÀN BỘ filter vào URL (debounce chung với fetch, dùng replace để không phá lịch sử back/forward)
    const syncFiltersToUrl = useCallback(() => {
        const params = {};
        if (searchDiemDen.trim()) params.diemDen = searchDiemDen.trim();
        if (searchNgayDi) params.ngayDi = searchNgayDi;
        if (searchNgayVe) params.ngayVe = searchNgayVe;
        if (searchKeyword.trim()) params.keyword = searchKeyword.trim();
        if (category) params.loaiTour = category;
        if (minPrice !== MIN_PRICE) params.minPrice = minPrice;
        if (maxPrice !== MAX_PRICE) params.maxPrice = maxPrice;
        if (dayFilters[0]) params.thoiGian = dayFilters[0];

        setSearchParams(params, { replace: true });
    }, [searchDiemDen, searchNgayDi, searchNgayVe, searchKeyword, category, minPrice, maxPrice, dayFilters, setSearchParams]);

    const debounceRef = useRef(null);
    useEffect(() => {
        const signature = JSON.stringify({
            searchKeyword, searchDiemDen, searchNgayDi, searchNgayVe,
            category, minPrice, maxPrice, dayFilters
        });

        const filterChanged = signature !== filterSignatureRef.current;
        filterSignatureRef.current = signature;

        const pageToFetch = filterChanged ? 1 : page;
        if (filterChanged && page !== 1) {
            setPage(1);
        }

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchSearchResults(pageToFetch);
            syncFiltersToUrl();
        }, 350);

        return () => clearTimeout(debounceRef.current);

    }, [searchKeyword, searchDiemDen, searchNgayDi, searchNgayVe, category, minPrice, maxPrice, dayFilters]);

    const isFirstPageEffect = useRef(true);
    useEffect(() => {
        if (isFirstPageEffect.current) {
            isFirstPageEffect.current = false;
            return;
        }
        fetchSearchResults(page);

    }, [page]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Form submit không cần làm gì thêm: state đã đồng bộ 2 chiều qua debounce ở trên.
        // Giữ handler để Enter trong input không reload trang.
    };

    const breadcrumbItems = [
        { label: "Trang chủ", href: "/", icon: <Home size={14} /> },
        searchDiemDen.trim()
            ? { label: "Tìm kiếm tour", href: "/Tim-kiem" }
            : { label: "Tìm kiếm tour" },
        ...(searchDiemDen.trim() ? [{ label: `Kết quả cho "${searchDiemDen.trim()}"` }] : []),
    ];

    const resetAllFilters = () => {
        setSearchDiemDen("");
        setSearchNgayDi("");
        setSearchNgayVe("");
        setSearchKeyword("");
        setCategory("");
        setMinPrice(MIN_PRICE);
        setMaxPrice(MAX_PRICE);
        setDayFilters([]);
        setPage(1);
        setSearchParams({}, { replace: true });
    };

    // Thông báo rỗng chung chung, không gắn cứng vào 1 field cụ thể
    const hasAnyFilter =
        searchDiemDen.trim() || searchNgayDi || searchNgayVe || searchKeyword.trim() ||
        category || minPrice !== MIN_PRICE || maxPrice !== MAX_PRICE || dayFilters.length > 0;

    const emptyMessage = hasAnyFilter
        ? "Không tìm thấy hành trình nào khớp với bộ lọc hiện tại của bạn."
        : "Chưa có hành trình nào để hiển thị.";

    return (
        <div className="min-h-screen bg-slate-50/60 pt-24 pb-16">
            <div className="mx-auto max-w-[1440px] px-4 md:px-8">

                {/* ── BREADCRUMB ── */}
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* ── THANH TÌM KIẾM TRÊN CÙNG TRANG KẾT QUẢ ── */}
                {/* ── THANH TÌM KIẾM TRÊN CÙNG TRANG KẾT QUẢ (đồng bộ style với HeroSection) ── */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="mx-auto mb-12 bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 text-black max-w-5xl"
                >
                    {/* Điểm đến */}
                    <div className="group flex items-center gap-3 flex-[1.5] hover:bg-gray-50 rounded-xl px-4 py-3 transition-all">
                        <MapPin className="text-[#0EA5E5] group-hover:scale-110 transition-transform shrink-0" size={22} />
                        <div className="flex flex-col items-start w-full">
                            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Điểm đến</span>
                            <input
                                type="text"
                                value={searchDiemDen}
                                onChange={(e) => setSearchDiemDen(e.target.value)}
                                placeholder="Bạn muốn đi đâu?"
                                className="bg-transparent outline-none w-full text-sm font-medium placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="hidden md:block w-px bg-gray-200 my-2" />

                    {/* Ngày đi */}
                    <div className="group flex items-center gap-3 flex-1 hover:bg-gray-50 rounded-xl px-2 py-1 transition-all">
                        <div className="w-full text-left custom-search-datepicker">
                            <DatePicker
                                label="Ngày đi"
                                value={searchNgayDi}
                                onChange={(dateStr) => {
                                    setSearchNgayDi(dateStr);
                                    if (searchNgayVe && dateStr && searchNgayVe < dateStr) {
                                        setSearchNgayVe("");
                                    }
                                }}
                                placeholderText="Chọn ngày đi"
                                minDate={new Date()}
                                Icon={Calendar}
                            />
                        </div>
                    </div>

                    {/* <div className="hidden md:block w-px bg-gray-200 my-2" /> */}

                    {/* Ngày về
                    <div className="group flex items-center gap-3 flex-1 hover:bg-gray-50 rounded-xl px-2 py-1 transition-all">
                        <div className="w-full text-left custom-search-datepicker">
                            <DatePicker
                                label="Ngày về"
                                value={searchNgayVe}
                                onChange={setSearchNgayVe}
                                placeholderText="Chọn ngày về"
                                minDate={searchNgayDi ? parseISO(searchNgayDi) : new Date()}
                                disabled={!searchNgayDi}
                                Icon={Calendar}
                            />
                        </div>
                    </div> */}

                    {/* Nút Tìm ngay */}
                    {/* <button
                        type="submit"
                        className="bg-[#0EA5E5] hover:bg-[#0284c7] text-white px-8 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-95 group self-stretch md:self-auto"
                    >
                        <Search size={15} className="group-hover:rotate-12 transition-transform" />
                        <span>Tìm ngay</span>
                    </button> */}

                    <style>{`
                        .custom-search-datepicker border { border: none !important; }
                        .custom-search-datepicker .relative.flex { gap: 0px !important; }
                        .custom-search-datepicker input {
                            border: none !important;
                            background: transparent !important;
                            padding-top: 0px !important;
                            padding-bottom: 0px !important;
                            padding-left: 24px !important;
                        }
                        .custom-search-datepicker span.absolute { left: 0px !important; }
                    `}</style>
                </form>

                {/* ── BỘ LỌC DẠNG THANH NGANG, NẰM DƯỚI Ô SEARCH ── */}
                <TourFilterBar
                    minPrice={minPrice} maxPrice={maxPrice}
                    setMinPrice={setMinPrice} setMaxPrice={setMaxPrice}
                    dayFilters={dayFilters} setDayFilters={setDayFilters}
                    category={category} setCategory={setCategory}
                    province={searchDiemDen} setProvince={setSearchDiemDen}
                    onReset={resetAllFilters}
                />

                {/* ── KẾT QUẢ TÌM KIẾM (FULL WIDTH, KHÔNG CÒN SIDEBAR) ── */}
                <main className="min-w-0 relative">
                    {initialLoading ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-80 animate-pulse rounded-3xl bg-slate-200/70" />)}
                        </div>
                    ) : tours.length === 0 ? (
                        <div className="text-center py-12 text-slate-500 bg-white rounded-3xl p-8 border border-slate-100">
                            {emptyMessage}
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 text-sm text-slate-500 flex items-center gap-2">
                                Tìm thấy <span className="font-bold text-[#0EA5E5]">{totalItems}</span> kết quả phù hợp.
                                {isFetching && (
                                    <span className="h-3 w-3 rounded-full border-2 border-[#0EA5E5] border-t-transparent animate-spin" />
                                )}
                            </div>

                            <div
                                className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-opacity duration-200 ${isFetching ? "opacity-60 pointer-events-none" : "opacity-100"
                                    }`}
                            >
                                {tours.map((tour) => (
                                    <TourCard
                                        key={tour.maTour}
                                        id={tour.maTour}
                                        name={tour.tenTour}
                                        slug={tour.slug}
                                        price={tour.giaTu}
                                        duration={`${tour.ngay} ngày ${tour.dem} đêm`}
                                        image={tour.duongDanAnh ? `${IMAGE_BASE_URL}${tour.duongDanAnh}` : undefined}
                                        destination={tour.diemDen}
                                        tourType={tour.loaiHinhTour}
                                    />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="mt-10">
                                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}