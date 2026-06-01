import React, { useEffect, useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';

import TourCard from '~/components/Tours/TourCard';
import SectionHeader from '~/components/Common/SectionHeader';
import Pagination from '~/components/Common/Pagination';
import FeaturedCarousel from '~/components/Common/FeaturedCarousel';
import SectionTitle from '~/components/Common/SectionTitle';
import Loading from '~/components/Common/Loading';
import EmptyState from '~/components/Common/EmptyState';
import TourFilter from './TourFilter';
import { mockTours, PAGE_SIZE } from '~/constants/Tours.constants';

export default function Tours() {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('Tất cả');
    const [sort, setSort] = useState('featured');
    const [page, setPage] = useState(1);
    const [maxPrice, setMaxPrice] = useState(50000000);
    const [ratings, setRatings] = useState([]);
    const [dayFilters, setDayFilters] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTours(mockTours);
            setLoading(false);
        }, 700);

        return () => clearTimeout(timer);
    }, []);

    const featuredTours = useMemo(() => {
        return tours.filter((tour) => tour.featured);
    }, [tours]);

    const filtered = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        const result = tours.filter((tour) => {
            const name = tour.name?.toLowerCase() || '';
            const destination = tour.destination?.toLowerCase() || '';

            const matchSearch =
                !keyword ||
                name.includes(keyword) ||
                destination.includes(keyword);

            const matchCategory =
                category === 'Tất cả' || tour.category === category;

            const matchPrice = tour.price <= maxPrice;

            const matchRating =
                ratings.length === 0 ||
                ratings.some((rating) => tour.rating >= rating);

            const days = parseInt(tour.duration);

            const matchDays =
                dayFilters.length === 0 ||
                dayFilters.some((filter) => {
                    if (filter === '2-3') return days >= 2 && days <= 3;
                    if (filter === '4-7') return days >= 4 && days <= 7;
                    if (filter === '7+') return days > 7;
                    return false;
                });

            return matchSearch && matchCategory && matchPrice && matchRating && matchDays;
        });

        return [...result].sort((a, b) => {
            if (sort === 'price_asc') return a.price - b.price;
            if (sort === 'price_desc') return b.price - a.price;
            if (sort === 'rating') return b.rating - a.rating;
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        });
    }, [tours, search, category, maxPrice, ratings, dayFilters, sort]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

    const paginated = useMemo(() => {
        return filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    }, [filtered, page]);

    const resetFilters = () => {
        setSearch('');
        setCategory('Tất cả');
        setSort('featured');
        setMaxPrice(50000000);
        setRatings([]);
        setDayFilters([]);
        setPage(1);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-white">
            {featuredTours.length > 0 && (
                <section className="mt-30">
                    <div className="mx-auto max-w-[1440px] px-4 md:px-8">
                        <SectionTitle
                            eyebrow="Được yêu thích"
                            title="Tour nổi bật"
                            description="Những hành trình được nhiều du khách quan tâm, có lịch trình tối ưu và trải nghiệm đáng giá."
                        />
                        <FeaturedCarousel
                            items={featuredTours}
                            renderItem={(tour) => <TourCard {...tour} />}
                            itemsPerPage={5}
                            gap={30}
                            autoPlayMs={4000}
                        />
                    </div>
                </section>
            )}

            <section id="all-tours">
                <div className="mx-auto max-w-[1440px] px-4 md:px-8 mt-5 mb-10">
                    <SectionHeader title="Tất cả các chuyến đi" />

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
                                        'Thử từ khóa khác',
                                        'Xóa bớt bộ lọc',
                                        'Chọn danh mục hoặc thời gian khác',
                                    ]}
                                    buttonText="Xóa bộ lọc"
                                    onReset={resetFilters}
                                />
                            ) : (
                                <>
                                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-sm text-slate-500">
                                            Tìm thấy <b>{filtered.length}</b> tours
                                        </p>
                                        <p className="flex items-center gap-1.5 text-sm text-slate-400">
                                            <MapPin size={15} />
                                            Chọn tour để xem lịch trình và đặt chỗ
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                        {paginated.map((tour) => (
                                            <TourCard key={tour.id} {...tour} />
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