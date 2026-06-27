import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import TourCard from '~/components/Tours/TourCard';
import Pagination from '~/components/Common/Pagination';

import { getWishlistApi, deleteWishlistApi } from '~/Services/TourService';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState([]);
    const [selectedTours, setSelectedTours] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const PAGE_SIZE = 10;

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({
        title: '',
        message: '',
        type: 'danger',
        confirmText: 'Xác nhận',
        action: null
    });

    const fetchRealData = async () => {
        setIsLoading(true);
        try {
            const response = await getWishlistApi(currentPage, PAGE_SIZE);            
            const data = response.data ? response.data : response;

            const formattedTours = data.items.map((t) => ({
                id: t.matour,
                name: t.tenTour,
                image: t.duongDanAnh? `https://localhost:7016${t.duongDanAnh}` : 'https://placehold.co/1200x800?text=No+Image',
                destination: t.diemDen,
                duration: t.thoiGianTour,
                availableSlots: t.soLuongToiDa,
                rating: t.diemDanhGia,
                reviewCount: t.reviewCount,
                price: t.giaTour,
            }));

            setWishlist(formattedTours);
            setTotalPages(Math.ceil(data.totalItems / PAGE_SIZE));
            
        } catch (error) {
            console.error("Lỗi khi lấy danh sách yêu thích:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRealData();
        setSelectedTours([]);
    }, [currentPage]);

    const executeConfirmAction = async () => {
        try {
            await confirmConfig.action?.();
        } catch (error) {
            console.error("Thao tác thất bại:", error);
            alert('Có lỗi xảy ra trong quá trình thực thi!');
        } finally {
            setConfirmOpen(false);
        }
    };

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

        setConfirmConfig({
            title: "Xác nhận xóa",
            message: `Bạn có chắc chắn muốn xóa ${selectedTours.length} tour đã chọn khỏi danh sách yêu thích không?`,
            type: "danger",
            confirmText: "Xóa khỏi yêu thích",
            action: async () => {
                await deleteWishlistApi(selectedTours);
                setSelectedTours([]);
                
                if (wishlist.length === selectedTours.length && currentPage > 1) {
                    setCurrentPage((prev) => prev - 1);
                } else {
                    fetchRealData();
                }
            }
        });
        
        setConfirmOpen(true);
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
                        {selectedTours.length === wishlist.length && wishlist.length > 0
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

            {isLoading ? (
                <div className="flex justify-center p-20">
                    <span className="text-lg text-slate-500 font-medium">Đang tải dữ liệu...</span>
                </div>
            ) : wishlist.length === 0 ? (
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
                        {wishlist.map((tour) => {
                            const selected = selectedTours.includes(tour.id);

                            return (
                                <div
                                    key={tour.id}
                                    onClick={() => handleSelectTour(tour.id)}
                                    className={`
                                        relative cursor-pointer rounded-2xl
                                        transition-all duration-300
                                        ${selected ? "-translate-y-2 scale-[1.01]" : "hover:-translate-y-1"}
                                    `}
                                >
                                    {selected && (
                                        <div className="absolute inset-0 z-20 rounded-2xl ring-2 ring-sky-500 pointer-events-none" />
                                    )}

                                    <TourCard {...tour} showWishlist={false}/>
                                </div>
                            );
                        })}
                    </div>

                    {totalPages && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            )}

            <ConfirmModal
                isOpen={confirmOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                confirmText={confirmConfig.confirmText}
                type={confirmConfig.type}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={executeConfirmAction}
            />
        </div>
    );
}