import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import ManagerCard from "~/components/UI/Card/ManagerCard";
import ManagerToolbar from "~/components/UI/ToolBar/ToolBar";
import ConfirmModal from "~/components/UI/Modal/ConfirmModal";

import { getPagedToursApi, deleteTourApi, changeTourStatusApi } from "~/Services/TourService";
import { toastSuccess, toastWarning, toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";

export default function TourManager() {
    const navigate = useNavigate();

    // ── Filter / Paging ───────────────────────────────────────────────────
    const [keyword, setKeyword] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(8);

    // ── Data ──────────────────────────────────────────────────────────────
    const [tours, setTours] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    // ── Modal ─────────────────────────────────────────────────────────────
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedTour, setSelectedTour] = useState(null);

    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedStatusTour, setSelectedStatusTour] = useState(null);

    // ── Fetch data ────────────────────────────────────────────────────────
    const fetchTours = useCallback(async () => {
        const isInitialOrFilterChange = currentPage === 1 || searchTerm || statusFilter;

        try {
            if (isInitialOrFilterChange) {
                setLoading(true);
            } else {
                setIsFetching(true);
            }

            const data = await getPagedToursApi(
                currentPage,
                perPage,
                searchTerm,
                statusFilter === "" ? null : Number(statusFilter)
            );

            const mappedTours = (data.items || []).map((x) => ({
                ...x.tourInfo,
                tenKhachSans: x.tenKhachSans,
                lichTrinh: x.lichTrinh,
                chuyenKhoiHanhs: x.chuyenKhoiHanhs,
                images: x.images || [],
                hinhAnhTour:
                    x.images?.find((img) => img.anhChinh)?.duongDanAnh ||
                    x.images?.[0]?.duongDanAnh ||
                    null,
            }));

            setTours(mappedTours);
            setTotalRows(data.totalItems || data.totalRecords || 0);
        } catch (error) {
            toastError(getErrorMessage(error));
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    }, [currentPage, perPage, searchTerm, statusFilter]);

    useEffect(() => {
        fetchTours();
    }, [fetchTours]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(keyword);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [keyword]);

    // ── Pagination helper ─────────────────────────────────────────────────
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

    // ── Handlers ──────────────────────────────────────────────────────────
    const handleAddTour = () => navigate("Them-Tour");
    const handleViewTour = (tour) => navigate(`Xem-chi-tiet/${tour.maTour}`);
    const handleEditTour = (tour) => navigate(`Cap-nhat/${tour.maTour}`);

    const handleDelete = (tour) => {
        if (tour.trangThai) {
            toastWarning("Không thể xóa tour đang hoạt động.");
            return;
        }
        setSelectedTour(tour);
        setConfirmOpen(true);
    };

    const executeDelete = async () => {
        try {
            await deleteTourApi(selectedTour.maTour);
            toastSuccess("Xóa tour thành công!");
            setConfirmOpen(false);
            fetchTours();
        } catch (error) {
            toastError(getErrorMessage(error));
        }
    };

    const handleChangeStatus = (tour) => {
        setSelectedStatusTour(tour);
        setStatusModalOpen(true);
    };

    const executeChangeStatus = async () => {
        try {
            const current = Number(selectedStatusTour.trangThai);
            const newStatus = current === 1 ? 2 : 1;

            await changeTourStatusApi(selectedStatusTour.maTour, newStatus);
            toastSuccess("Cập nhật trạng thái thành công!");
            setStatusModalOpen(false);
            fetchTours();
        } catch (error) {
            toastError(getErrorMessage(error));
        }
    };

    const statusLabel = (status) => {
        const s = Number(status);
        if (s === 1) return "Mở bán";
        if (s === 2) return "Tạm ngưng";
        if (s === 3) return "Ngừng kinh doanh";
        return "";
    };

    const nextStatusLabel = (status) => (Number(status) === 1 ? "Tạm ngưng" : "Mở bán lại");

    return (
        <div className="p-4 space-y-6">
            <ManagerToolbar
                searchPlaceholder="Tìm kiếm tour..."
                onSearchChange={(value) => setKeyword(value)}
                addButtonText="Thêm tour"
                onAddClick={handleAddTour}
                showExcel={false}
                filters={[
                    {
                        placeholder: "Trạng thái",
                        value: statusFilter,
                        onChange: (value) => { setStatusFilter(value); setCurrentPage(1); },
                        options: [
                            { value: "", label: "Tất cả" },
                            { value: "1", label: "Mở bán" },
                            { value: "2", label: "Tạm ngưng" },
                            { value: "3", label: "Ngừng kinh doanh" },
                        ],
                    },
                ]}
            />

            {/* Overlay khi chuyển trang */}
            {isFetching && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
                        <div className="w-6 h-6 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-slate-600 font-medium">Đang tải...</span>
                    </div>
                </div>
            )}

            {/* Danh sách */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: perPage }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
                            <div className="h-48 bg-slate-200" />
                            <div className="p-4 space-y-3">
                                <div className="h-5 bg-slate-200 rounded w-3/4" />
                                <div className="h-4 bg-slate-200 rounded w-1/2" />
                                <div className="h-4 bg-slate-200 rounded w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : tours.length === 0 ? (
                <div className="text-center py-20 text-slate-500 font-medium bg-white rounded-2xl border border-dashed border-slate-300">
                    Không tìm thấy tour nào!
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tours.map((tour) => (
                        <ManagerCard
                            key={tour.maTour}
                            item={tour}
                            type="tour"
                            onView={() => handleViewTour(tour)}
                            onEdit={() => handleEditTour(tour)}
                            onDelete={!tour.trangThai ? () => handleDelete(tour) : null}
                            onChangeStatus={() => handleChangeStatus(tour)}
                        />
                    ))}
                </div>
            )}

            {/* Pagination - Thông minh */}
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
                                {[8, 16, 24, 32].map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                        <span className="text-sm text-slate-400 font-medium">
                            Hiển thị {(currentPage - 1) * perPage + 1} –{" "}
                            {Math.min(currentPage * perPage, totalRows)} / {totalRows}
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

            {/* Modals */}
            <ConfirmModal
                isOpen={statusModalOpen}
                title="Xác nhận thay đổi trạng thái"
                message={
                    selectedStatusTour
                        ? `Bạn có muốn chuyển tour "${selectedStatusTour.tenTour}" từ "${statusLabel(selectedStatusTour.trangThai)}" sang "${nextStatusLabel(selectedStatusTour.trangThai)}" không?`
                        : ""
                }
                type="warning"
                confirmText="Xác nhận"
                onCancel={() => setStatusModalOpen(false)}
                onConfirm={executeChangeStatus}
            />

            <ConfirmModal
                isOpen={confirmOpen}
                title="Xác nhận xóa tour"
                message={`Bạn có chắc chắn muốn xóa tour "${selectedTour?.tenTour}" không?`}
                type="danger"
                confirmText="Xóa"
                onCancel={() => setConfirmOpen(false)}
                onConfirm={executeDelete}
            />
        </div>
    );
}