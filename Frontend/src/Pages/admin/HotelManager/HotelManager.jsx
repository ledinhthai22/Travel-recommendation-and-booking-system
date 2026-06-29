import React, { useState, useEffect, useCallback } from 'react';
import ManagerCard from '~/components/UI/Card/ManagerCard';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import HotelFormModal from './HotelFormModal';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';

import { getHotelApi, deleteHotelApi, getHotelByIdApi } from '~/Services/HotelService';
import { toastError, toastSuccess, toastWarning } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';

export default function HotelManager() {
    // ── Filter / Paging ───────────────────────────────────────────────────
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [starFilter, setStarFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(8);

    // ── Data ──────────────────────────────────────────────────────────────
    const [hotels, setHotels] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(true);        // loading ban đầu
    const [isFetching, setIsFetching] = useState(false); // loading khi chuyển trang

    // ── Modal state ───────────────────────────────────────────────────────
    const [modalOpen, setModalOpen] = useState(false);
    const [formMode, setFormMode] = useState('add');
    const [selectedData, setSelectedData] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    // ── Confirm delete ────────────────────────────────────────────────────
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({});

    // ── Fetch list ────────────────────────────────────────────────────────
    const fetchHotels = useCallback(async () => {
        const isInitialOrFilterChange = currentPage === 1 || searchTerm || statusFilter || starFilter;

        try {
            if (isInitialOrFilterChange) {
                setLoading(true);
            } else {
                setIsFetching(true);
            }

            const res = await getHotelApi(
                currentPage,
                perPage,
                searchTerm,
                '',
                '',
                starFilter ? Number(starFilter) : null,
                statusFilter ? statusFilter === 'true' : null,
            );

            setHotels(res.items || []);
            setTotalRows(res.totalItems || 0);
        } catch (err) {
            toastError('Lỗi tải danh sách khách sạn!', getErrorMessage(err));
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    }, [currentPage, perPage, searchTerm, statusFilter, starFilter]);

    useEffect(() => {
        fetchHotels();
    }, [fetchHotels]);

    // ── Modal handlers ───────────────────────────────────────────────────
    const handleOpenModal = async (mode, hotel = null) => {
        setFormMode(mode);
        if (mode === 'add') {
            setSelectedData(null);
            setSelectedId(null);
            setModalOpen(true);
            return;
        }

        try {
            setModalLoading(true);
            const data = await getHotelByIdApi(hotel.maKhachSan);
            setSelectedData({
                tenKhachSan: data.tenKhachSan,
                soDienThoai: data.soDienThoai,
                diaChi: data.diaChi,
                soSao: data.soSao,
                moTa: data.moTa,
                trangThai: data.trangThai,
                hinhAnh: data.hinhAnh || [],
                tienIch: data.tienIch || [],
            });
            setSelectedId(hotel.maKhachSan);
            setModalOpen(true);
        } catch (err) {
            toastError('Không thể tải thông tin khách sạn!', getErrorMessage(err));
        } finally {
            setModalLoading(false);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedData(null);
        setSelectedId(null);
    };

    const handleSaveSuccess = () => {
        handleCloseModal();
        fetchHotels();
    };

    const handleDelete = (hotel) => {
        if (hotel.trangThai === true) {
            toastWarning('Không thể xóa khách sạn đang hoạt động!');
            return;
        }
        setConfirmConfig({
            title: 'Xác nhận xóa',
            message: `Bạn có chắc chắn muốn xóa khách sạn "${hotel.tenKhachSan}"?`,
            type: 'danger',
            confirmText: 'Xóa',
            action: async () => {
                try {
                    await deleteHotelApi(hotel.maKhachSan);
                    toastSuccess('Đã xóa thành công!');
                    fetchHotels();
                } catch (err) {
                    toastError(getErrorMessage(err));
                }
            },
        });
        setConfirmOpen(true);
    };

    // ── Pagination ───────────────────────────────────────────────────────
    const totalPages = Math.ceil(totalRows / perPage);

    const generatePaginationPages = (current, total) => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

        const pages = [];
        const showFirst = 2, showLast = 2, showAround = 2;

        for (let i = 1; i <= Math.min(showFirst, total); i++) pages.push(i);

        const start = Math.max(showFirst + 1, current - showAround);
        const end = Math.min(total - showLast, current + showAround);

        if (start > showFirst + 1) pages.push('...');
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < total - showLast) pages.push('...');

        for (let i = Math.max(total - showLast + 1, end + 1); i <= total; i++) pages.push(i);

        return [...new Set(pages)];
    };

    return (
        <div className="p-4 space-y-6">
            <ManagerToolbar
                searchPlaceholder="Tìm kiếm khách sạn..."
                onSearchChange={(v) => { setSearchTerm(v); setCurrentPage(1); }}
                addButtonText="Thêm khách sạn"
                onAddClick={() => handleOpenModal('add')}
                showExcel={false}
                filters={[
                    {
                        placeholder: 'Trạng thái',
                        value: statusFilter,
                        onChange: (v) => { setStatusFilter(v); setCurrentPage(1); },
                        options: [
                            { value: '', label: 'Tất cả' },
                            { value: 'true', label: 'Đang hợp tác' },
                            { value: 'false', label: 'Ngưng hoạt động' }
                        ]
                    },
                    {
                        placeholder: 'Số sao',
                        value: starFilter,
                        onChange: (v) => { setStarFilter(v); setCurrentPage(1); },
                        options: [
                            { value: '', label: 'Tất cả sao' },
                            ...[1, 2, 3, 4, 5].map(n => ({ value: n.toString(), label: `${n} sao` }))
                        ]
                    }
                ]}
            />

            {/* Overlay loading khi chuyển trang */}
            {isFetching && (
                <div className="fixed inset-0 bg-black/0 flex items-center justify-center z-50">
                    <div className="bg-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
                        <div className="w-6 h-6 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-slate-600 font-medium">Đang tải dữ liệu...</span>
                    </div>
                </div>
            )}

            {/* Danh sách */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: perPage }).map((_, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse"
                        >
                            <div className="h-48 bg-slate-200" />
                            <div className="p-4 space-y-3">
                                <div className="h-5 bg-slate-200 rounded w-3/4" />
                                <div className="h-4 bg-slate-200 rounded w-1/2" />
                                <div className="h-4 bg-slate-200 rounded w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : hotels.length === 0 ? (
                <div className="text-center py-20 text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
                    Không tìm thấy khách sạn nào!
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {hotels.map((hotel) => (
                        <ManagerCard
                            key={hotel.maKhachSan}
                            item={hotel}
                            type="hotel"
                            onView={() => handleOpenModal('view', hotel)}
                            onEdit={() => handleOpenModal('edit', hotel)}
                            onDelete={hotel.trangThai === false ? () => handleDelete(hotel) : null}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalRows > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-2 pt-6 border-t border-slate-100 gap-4 mt-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">Số lượng:</span>
                            <select
                                value={perPage}
                                onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-1.5 outline-none cursor-pointer"
                            >
                                {[8, 16, 24, 32].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                        <span className="text-sm text-slate-400 font-medium">
                            Hiển thị {(currentPage - 1) * perPage + 1} – {Math.min(currentPage * perPage, totalRows)} / {totalRows}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-sky-600 disabled:opacity-40 transition-all"
                        >
                            <span className="material-symbols-outlined text-xl">chevron_left</span>
                        </button>

                        {generatePaginationPages(currentPage, totalPages).map((page, index) => (
                            page === '...' ? (
                                <span key={`ellipsis-${index}`} className="w-9 h-9 flex items-center justify-center text-slate-400">...</span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${currentPage === page
                                        ? "bg-sky-500 text-white"
                                        : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    {page}
                                </button>
                            )
                        ))}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-sky-600 disabled:opacity-40 transition-all"
                        >
                            <span className="material-symbols-outlined text-xl">chevron_right</span>
                        </button>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
                confirmText={confirmConfig.confirmText}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={async () => { await confirmConfig.action?.(); setConfirmOpen(false); }}
            />

            <HotelFormModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                mode={formMode}
                initialData={selectedData}
                hotelId={selectedId}
                onSave={handleSaveSuccess}
            />
        </div>
    );
}