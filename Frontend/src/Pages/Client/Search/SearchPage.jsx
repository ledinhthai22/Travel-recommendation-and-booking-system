import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, Calendar, Home } from "lucide-react";

import TourCard from "~/components/Tours/TourCard";
import TourFilterBar from "./TourFilterBar";
import Pagination from "~/components/Common/Pagination";
import Breadcrumb from "~/components/UI/Breadcrumbs/Breadcrumbs";
import { searchToursApi } from "~/Services/SearchService";

const PAGE_SIZE = 12;
const MIN_PRICE = 1000000;
const MAX_PRICE = 50000000;


const DAY_RANGE_MAP = {
    "2-3": { ngayTu: 2, ngayDen: 3 },
    "4-7": { ngayTu: 4, ngayDen: 7 },
    "7+": { ngayTu: 8, ngayDen: undefined },
};

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();

  
    const [searchDiemDen, setSearchDiemDen] = useState(searchParams.get("diemDen") || "");
    const [searchNgayDi, setSearchNgayDi] = useState(searchParams.get("ngayDi") || "");
    const [searchNgayVe, setSearchNgayVe] = useState(searchParams.get("ngayVe") || "");


    const [searchKeyword, setSearchKeyword] = useState("");
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState(MIN_PRICE);
    const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
    const [dayFilters, setDayFilters] = useState([]); 
    const [page, setPage] = useState(1);

 
    const [tours, setTours] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

  
    const [initialLoading, setInitialLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    const hasFetchedOnce = useRef(false);
  
    const filterSignatureRef = useRef("");

  
    useEffect(() => {
        setSearchDiemDen(searchParams.get("diemDen") || "");
        setSearchNgayDi(searchParams.get("ngayDi") || "");
        setSearchNgayVe(searchParams.get("ngayVe") || "");
    }, [searchParams]);

  
    const fetchSearchResults = useCallback(async (pageToFetch) => {
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

            setTours(res?.items || []);
            setTotalItems(res?.totalItems || 0);
            setTotalPages(Math.max(1, Math.ceil((res?.totalItems || 0) / PAGE_SIZE)));
        } catch (error) {
            console.error("Lỗi fetch dữ liệu tìm kiếm:", error);
            setTours([]);
            setTotalItems(0);
            setTotalPages(1);
        } finally {
            hasFetchedOnce.current = true;
            setInitialLoading(false);
            setIsFetching(false);
        }
    }, [searchKeyword, searchDiemDen, searchNgayDi, searchNgayVe, category, minPrice, maxPrice, dayFilters]);

 
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
        const params = {};
        if (searchDiemDen.trim()) params.diemDen = searchDiemDen.trim();
        if (searchNgayDi) params.ngayDi = searchNgayDi;
        if (searchNgayVe) params.ngayVe = searchNgayVe;
        setSearchParams(params);
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
        setSearchParams({});
    };

    return (
        <div className="min-h-screen bg-slate-50/60 pt-24 pb-16">
            <div className="mx-auto max-w-[1440px] px-4 md:px-8">

                {/* ── BREADCRUMB ── */}
                <div className="mb-4">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                {/* ── THANH TÌM KIẾM TRÊN CÙNG TRANG KẾT QUẢ ── */}
                <form onSubmit={handleSearchSubmit} className="mx-auto mb-12 flex flex-col md:flex-row items-center bg-white rounded-3xl md:rounded-full p-2 shadow-xl border border-slate-100 max-w-5xl">
                    <div className="flex flex-1 items-center gap-3 px-4 py-2 w-full border-b md:border-b-0 md:border-r border-slate-100">
                        <MapPin className="text-[#0EA5E5]" size={22} />
                        <div className="flex flex-col w-full">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Điểm đến</span>
                            <input type="text" value={searchDiemDen} onChange={(e) => setSearchDiemDen(e.target.value)} placeholder="Bạn muốn đi đâu?" className="bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400" />
                        </div>
                    </div>

                    <div className="flex flex-1 items-center gap-3 px-4 py-2 w-full border-b md:border-b-0 md:border-r border-slate-100">
                        <Calendar className="text-[#0EA5E5]" size={22} />
                        <div className="flex flex-col w-full">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ngày đi</span>
                            <input type="date" value={searchNgayDi} onChange={(e) => setSearchNgayDi(e.target.value)} className="bg-transparent text-sm font-medium text-slate-700 outline-none" />
                        </div>
                    </div>

                    <div className="flex flex-1 items-center gap-3 px-4 py-2 w-full md:mr-2">
                        <Calendar className="text-[#0EA5E5]" size={22} />
                        <div className="flex flex-col w-full">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Ngày về</span>
                            <input type="date" value={searchNgayVe} onChange={(e) => setSearchNgayVe(e.target.value)} className="bg-transparent text-sm font-medium text-slate-700 outline-none" />
                        </div>
                    </div>
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
                            Không tìm thấy hành trình nào khớp với bộ lọc dữ liệu điểm đến "{searchDiemDen}" của bạn.
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 text-sm text-slate-500 flex items-center gap-2">
                                Tìm thấy <span className="font-bold text-[#0EA5E5]">{totalItems}</span> kết quả phù hợp.
                                {isFetching && (
                                    <span className="h-3 w-3 rounded-full border-2 border-[#0EA5E5] border-t-transparent animate-spin" />
                                )}
                            </div>

                            {/* Giữ nguyên grid kết quả cũ, chỉ làm mờ nhẹ khi đang fetch lại
                                (không unmount/skeleton) -> không còn giật layout/scroll */}
                            <div
                                className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-opacity duration-200 ${
                                    isFetching ? "opacity-60 pointer-events-none" : "opacity-100"
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
                                        image={tour.duongDanAnh}
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