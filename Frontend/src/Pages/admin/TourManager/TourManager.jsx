import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import ManagerCard from "~/components/UI/Card/ManagerCard";
import ManagerToolbar from "~/components/UI/ToolBar/ToolBar";
import ConfirmModal from "~/components/UI/Modal/ConfirmModal";
import SelectField from "~/components/UI/Form/SelectField";

import { getPagedToursApi, deleteTourApi, changeTourStatusApi } from "~/Services/TourService";
import { toastSuccess, toastWarning, toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";

const STATUS_OPTIONS = [
    { value: "1", label: "Mở bán" },
    { value: "2", label: "Tạm ngưng" },
    { value: "3", label: "Ngừng kinh doanh" }
];

const PER_PAGE_OPTIONS = [8, 16, 24, 32];

export default function TourManager() {
    const navigate = useNavigate();

    const [keyword, setKeyword] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(8);

    const [tours, setTours] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({
        title: '', message: '', type: 'warning', confirmText: 'Xác nhận', action: null
    });

    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedStatusTour, setSelectedStatusTour] = useState(null);
    // Luôn lưu dạng string để khớp với STATUS_OPTIONS.value (string)
    const [nextStatus, setNextStatus] = useState("1");
    const [statusSubmitting, setStatusSubmitting] = useState(false);

    const totalPages = useMemo(() => Math.ceil(totalRows / perPage), [totalRows, perPage]);

    const fetchTours = useCallback(async () => {
        try {
            const isInitialOrFilterChange = currentPage === 1 || searchTerm || statusFilter;
            if (isInitialOrFilterChange) {
                setLoading(true);
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
                tenLoaiTour: x.tourInfo.tenLoaiTour,
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
        }
    }, [currentPage, perPage, searchTerm, statusFilter]);

    useEffect(() => {
        fetchTours();
    }, [currentPage, perPage, searchTerm, statusFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(keyword);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [keyword]);

    const generatePaginationPages = useCallback((current, total) => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

        const pages = [];
        const showFirst = 2;
        const showLast = 2;
        const showAround = 2;

        for (let i = 1; i <= Math.min(showFirst, total); i++) pages.push(i);

        const start = Math.max(showFirst + 1, current - showAround);
        const end = Math.min(total - showLast, current + showAround);

        if (start > showFirst + 1) pages.push('...');
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < total - showLast) pages.push('...');

        for (let i = Math.max(total - showLast + 1, end + 1); i <= total; i++) pages.push(i);

        return [...new Set(pages)];
    }, []);

    const paginationPages = useMemo(
        () => generatePaginationPages(currentPage, totalPages),
        [currentPage, totalPages, generatePaginationPages]
    );

    const handleAddTour = () => navigate("Them-Tour");
    const handleViewTour = (tour) => navigate(`Xem-chi-tiet/${tour.maTour}`);
    const handleEditTour = (tour) => navigate(`Cap-nhat/${tour.maTour}`);

    const handleDelete = (item) => {
        if (item.trangThai === 1) {
            toastWarning("Không thể xóa tour đang hoạt động mở bán.");
            return;
        }
        setConfirmConfig({
            title: "Xác nhận xóa tour",
            message: `Bạn có chắc chắn muốn xóa tour "${item.tenTour}" không? Dữ liệu liên quan sẽ bị xóa mềm.`,
            type: "danger",
            confirmText: "Xóa",
            action: async () => {
                try {
                    setLoading(true);
                    await deleteTourApi(item.maTour);
                    toastSuccess("Xóa tour thành công!");
                    if (tours.length === 1 && currentPage > 1) {
                        setCurrentPage(prev => prev - 1);
                    } else {
                        fetchTours();
                    }
                } catch (error) {
                    toastError(getErrorMessage(error));
                } finally {
                    setLoading(false);
                }
            }
        });
        setConfirmOpen(true);
    };

    const handleChangeStatus = (tour) => {
        setSelectedStatusTour(tour);
        const current = Number(tour.trangThai);
        // luôn set dạng string để khớp value trong STATUS_OPTIONS
        setNextStatus(String(current === 1 ? 2 : 1));
        setStatusModalOpen(true);
    };

    const executeChangeStatus = async () => {
        if (!selectedStatusTour) return;
        try {
            setStatusSubmitting(true);
            await changeTourStatusApi(selectedStatusTour.maTour, Number(nextStatus));
            toastSuccess("Cập nhật trạng thái thành công!");
            setStatusModalOpen(false);
            fetchTours();
        } catch (error) {
            toastError(getErrorMessage(error));
        } finally {
            setStatusSubmitting(false);
        }
    };

    const statusLabel = useCallback((status) => {
        const s = Number(status);
        if (s === 1) return "Mở bán";
        if (s === 2) return "Tạm ngưng";
        if (s === 3) return "Ngừng kinh doanh";
        return "Không xác định";
    }, []);

    const getNextStatusOptions = useCallback(() => {
        if (!selectedStatusTour) return [];
        const currentStatus = String(Number(selectedStatusTour.trangThai));
        return STATUS_OPTIONS.filter(opt => opt.value !== currentStatus);
    }, [selectedStatusTour]);

    const handlePageChange = useCallback((newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentPage, totalPages]);

    const handlePerPageChange = useCallback((e) => {
        const newPerPage = Number(e.target.value);
        setPerPage(newPerPage);
        setCurrentPage(1);
    }, []);

    const handleStatusFilterChange = useCallback((value) => {
        setStatusFilter(value);
        setCurrentPage(1);
    }, []);

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
                        placeholder: 'Trạng thái',
                        value: statusFilter,
                        onChange: handleStatusFilterChange,
                        options: [
                            { value: "", label: "Tất cả" },
                            ...STATUS_OPTIONS
                        ]
                    }
                ]}
            />

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
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
                            onEdit={tour.trangThai !== 3 ? () => handleEditTour(tour) : null}
                            onDelete={tour.trangThai !== 1 ? () => handleDelete(tour) : null}
                            onChangeStatus={() => handleChangeStatus(tour)}
                        />
                    ))}
                </div>
            )}

            {totalRows > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-2 pt-6 border-t border-slate-100 gap-4 mt-6">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">Số lượng:</span>
                            <select
                                value={perPage}
                                onChange={handlePerPageChange}
                                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-1.5 outline-none cursor-pointer"
                            >
                                {PER_PAGE_OPTIONS.map((n) => (
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
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-sky-600 disabled:opacity-40 transition-all"
                            aria-label="Trang trước"
                        >
                            <span className="material-symbols-outlined text-xl">chevron_left</span>
                        </button>

                        {paginationPages.map((page, index) => (
                            page === '...' ? (
                                <span key={`ellipsis-${index}`} className="w-9 h-9 flex items-center justify-center text-slate-400">...</span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                                        currentPage === page
                                            ? "bg-sky-500 text-white"
                                            : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                                    aria-label={`Trang ${page}`}
                                >
                                    {page}
                                </button>
                            )
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-sky-600 disabled:opacity-40 transition-all"
                            aria-label="Trang sau"
                        >
                            <span className="material-symbols-outlined text-xl">chevron_right</span>
                        </button>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={statusModalOpen}
                title="Thay đổi trạng thái kinh doanh Tour"
                message={
                    selectedStatusTour ? (
                        <div className="space-y-4 text-left">
                            <p className="text-slate-600 text-[12px]">
                                Trạng thái hiện tại của tour <strong>"{selectedStatusTour.tenTour}"</strong> là:{" "}
                                <span className="px-2 py-1 rounded bg-slate-100 text-slate-800 font-semibold text-sm">
                                    {statusLabel(selectedStatusTour.trangThai)}
                                </span>
                            </p>

                            <div className="mt-4">
                                <SelectField
                                    label="Chọn trạng thái mới"
                                    value={nextStatus}
                                    onChange={(val) => setNextStatus(String(val))}
                                    options={getNextStatusOptions()}
                                    valueKey="value"
                                    labelKey="label"
                                    placeholder="Chọn trạng thái..."
                                />
                            </div>

                            <p className="text-[13px] text-amber-600 italic bg-amber-50 p-2 rounded-lg mt-2">
                                * Lưu ý: Khi chuyển sang "Ngừng kinh doanh", hệ thống sẽ kiểm tra nghiêm ngặt các chuyến đi đang diễn ra trước khi phê duyệt.
                            </p>
                        </div>
                    ) : ""
                }
                type="warning"
                confirmText={statusSubmitting ? "Đang cập nhật..." : "Cập nhật ngay"}
                onCancel={() => setStatusModalOpen(false)}
                onConfirm={executeChangeStatus}
                confirmDisabled={statusSubmitting}
            />

            <ConfirmModal
                isOpen={confirmOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
                confirmText={confirmConfig.confirmText}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={async () => {
                    if (confirmConfig.action) await confirmConfig.action();
                    setConfirmOpen(false);
                }}
            />
        </div>
    );
}