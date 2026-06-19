import { useMemo, useState } from 'react';
import { Trash2, Check } from 'lucide-react';
import TourCard from '~/components/Tours/TourCard';
import Pagination from '~/components/Common/Pagination';

export default function WishlistPage() {
    const [currentPage, setCurrentPage] = useState(1);


    const [wishlist, setWishlist] = useState([
        {
            id: 1,
            name: 'Khám phá Phú Quốc',
            image:
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
            destination: 'Phú Quốc',
            duration: '3 ngày 2 đêm',
            availableSlots: 12,
            rating: 4.9,
            reviewCount: 325,
            price: 3590000,
        },
        {
            id: 2,
            name: 'Du lịch Đà Lạt',
            image:
                'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200',
            destination: 'Đà Lạt',
            duration: '4 ngày 3 đêm',
            availableSlots: 8,
            rating: 4.8,
            reviewCount: 215,
            price: 2890000,
        },
        {
            id: 3,
            name: 'Nha Trang Biển Xanh',
            image:
                'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200',
            destination: 'Nha Trang',
            duration: '3 ngày 2 đêm',
            availableSlots: 15,
            rating: 4.9,
            reviewCount: 190,
            price: 3190000,
        },
        {
            id: 4,
            name: 'Sapa Mùa Mây',
            image:
                'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200',
            destination: 'Sapa',
            duration: '2 ngày 1 đêm',
            availableSlots: 20,
            rating: 4.7,
            reviewCount: 120,
            price: 2590000,
        },
        {
            id: 5,
            name: 'Đà Nẵng Hội An',
            image:
                'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1200',
            destination: 'Đà Nẵng',
            duration: '4 ngày 3 đêm',
            availableSlots: 10,
            rating: 4.8,
            reviewCount: 165,
            price: 4290000,
        },
        {
            id: 6,
            name: 'Miền Tây Sông Nước',
            image:
                'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200',
            destination: 'Cần Thơ',
            duration: '2 ngày 1 đêm',
            availableSlots: 18,
            rating: 4.6,
            reviewCount: 95,
            price: 1990000,
        },
        {
            id: 7,
            name: 'Huế Cố Đô',
            image:
                'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200',
            destination: 'Huế',
            duration: '3 ngày 2 đêm',
            availableSlots: 9,
            rating: 4.8,
            reviewCount: 145,
            price: 2790000,
        },
        {
            id: 8,
            name: 'Quy Nhơn Kỳ Co',
            image:
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200',
            destination: 'Quy Nhơn',
            duration: '3 ngày 2 đêm',
            availableSlots: 6,
            rating: 4.9,
            reviewCount: 180,
            price: 3390000,
        },
        {
            id: 9,
            name: 'Côn Đảo',
            image:
                'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1200',
            destination: 'Côn Đảo',
            duration: '3 ngày 2 đêm',
            availableSlots: 11,
            rating: 4.9,
            reviewCount: 210,
            price: 4590000,
        },
    ]);

    const [selectedTours, setSelectedTours] = useState([]);

    const PAGE_SIZE = 10;

    const paginatedTours = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;

        return wishlist.slice(start, start + PAGE_SIZE);
    }, [wishlist, currentPage]);

    const totalPages = Math.ceil(wishlist.length / PAGE_SIZE);

    const handleSelectTour = (tourId) => {
        setSelectedTours((prev) =>
            prev.includes(tourId)
                ? prev.filter((id) => id !== tourId)
                : [...prev, tourId]
        );
    };

    const handleSelectAll = () => {
        if (selectedTours.length === wishlist.length) {
            setSelectedTours([]);
            return;
        }

        setSelectedTours(wishlist.map((tour) => tour.id));
    };

    const handleDeleteSelected = () => {
        if (!selectedTours.length) return;

        const confirmed = window.confirm(
            `Xóa ${selectedTours.length} tour khỏi danh sách yêu thích?`
        );

        if (!confirmed) return;

        setWishlist((prev) =>
            prev.filter((tour) => !selectedTours.includes(tour.id))
        );

        setSelectedTours([]);
    };

    return (
        <div className="mx-auto max-w-[1400px] mt-25 mb-10 ">

            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Danh sách các chuyến đi yêu thích
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Đã chọn {selectedTours.length} tour
                    </p>
                </div>

                <div className="flex items-center gap-3">

                    <button
                        onClick={handleSelectAll}
                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium transition hover:bg-slate-50"
                    >
                        {selectedTours.length === wishlist.length
                            ? 'Bỏ chọn tất cả'
                            : 'Chọn tất cả'}
                    </button>

                    <button
                        onClick={handleDeleteSelected}
                        disabled={!selectedTours.length}
                        className="
                        inline-flex items-center gap-2
                        rounded-xl bg-sky-500 px-4 py-2
                        text-sm font-medium text-white
                        transition hover:bg-sky-600
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                    >
                        <Trash2 size={16} />
                        Xóa khỏi yêu thích
                    </button>
                </div>
            </div>

            {wishlist.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 p-20 text-center">
                    <h3 className="text-xl font-semibold text-slate-700">
                        Chưa có tour yêu thích
                    </h3>

                    <p className="mt-2 text-slate-500">
                        Hãy thêm các chuyến đi bạn quan tâm.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid gap-6 md:grid-cols-3 xl:grid-cols-5">
                        {paginatedTours.map((tour) => {
                            const selected = selectedTours.includes(tour.id);

                            return (
                                <div
                                    key={tour.id}
                                    onClick={() => handleSelectTour(tour.id)}
                                    className={`
                        relative cursor-pointer rounded-2xl
                        transition-all duration-300

                        ${selected
                                            ? "-translate-y-2 scale-[1.01]"
                                            : "hover:-translate-y-1"
                                        }
                    `}
                                >
                                    {/* Overlay viền xanh khi được chọn */}
                                    {selected && (
                                        <>
                                            <div className="absolute inset-0 z-20 rounded-2xl ring-2 ring-sky-500 pointer-events-none" />

                                         
                                        </>
                                    )}

                                    <TourCard {...tour} />
                                </div>
                            );
                        })}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );


}
