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

    const [keyword, setKeyword] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(8);

    const [tours, setTours] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedTour, setSelectedTour] = useState(null);

    // Quản lý Modal thay đổi trạng thái linh hoạt
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedStatusTour, setSelectedStatusTour] = useState(null);
    const [nextStatus, setNextStatus] = useState(1); // Mặc định trạng thái đích cần đổi

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
            loading && setLoading(false);
            setIsFetching(false);
        }
    }, [currentPage, perPage, searchTerm, statusFilter]);

    useEffect(() => {
        fetchTours();
    }, [fetchTours]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(keyword);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [keyword]);

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

    const handleAddTour = () => navigate("Them-Tour");
    const handleViewTour = (tour) => navigate(`Xem-chi-tiet/${tour.maTour}`);
    const handleEditTour = (tour) => navigate(`Cap-nhat/${tour.maTour}`);

    const handleDelete = (tour) => {
        if (tour.trangThai === 1) {
            toastWarning("Không thể xóa tour đang hoạt động mở bán.");
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

    // Hàm mở Modal và gợi ý trạng thái tiếp theo mặc định dựa trên trạng thái hiện tại
    const handleChangeStatus = (tour) => {
        setSelectedStatusTour(tour);
        const current = Number(tour.trangThai);
        // Gợi ý: Nếu đang mở bán (1) -> Tạm ngưng (2). Nếu đang tạm ngưng (2) -> Mở bán (1).
        setNextStatus(current === 1 ? 2 : 1);
        setStatusModalOpen(true);
    };

    const executeChangeStatus = async () => {
        try {
            // Gọi API đổi trạng thái linh hoạt theo lựa chọn tiếp theo của người dùng
            await changeTourStatusApi(selectedStatusTour.maTour, nextStatus);
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
        return "Không xác định";
    };

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

            {isFetching && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3">
                        <div className="w-6 h-6 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-slate-600 font-medium">Đang tải...</span>
                    </div>
                </div>
            )}

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
                                App>
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

            {/* Custom Modal hỗ trợ lựa chọn trạng thái mới linh hoạt để bấm chọn được cả trạng thái 3 */}
            <ConfirmModal
                isOpen={statusModalOpen}
                title="Thay đổi trạng thái kinh doanh Tour"
                message={
                    selectedStatusTour ? (
                        <div className="space-y-4">
                            <p className="text-slate-600">
                                Trạng thái hiện tại của tour <strong>"{selectedStatusTour.tenTour}"</strong> là:{" "}
                                <span className="px-2 py-1 rounded bg-slate-100 text-slate-800 font-semibold text-sm">
                                    {statusLabel(selectedStatusTour.trangThai)}
                                </span>
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                                <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Chọn trạng thái mới:</label>
                                <select
                                    value={nextStatus}
                                    onChange={(e) => setNextStatus(Number(e.target.value))}
                                    className="w-full bg-white border border-slate-300 text-slate-800 text-sm rounded-xl p-2.5 font-medium outline-none focus:border-sky-500 shadow-sm"
                                >
                                    {/* Không render lại trạng thái hiện tại để tránh dư thừa */}
                                    {Number(selectedStatusTour.trangThai) !== 1 && <option value="1">Mở bán (Active)</option>}
                                    {Number(selectedStatusTour.trangThai) !== 2 && <option value="2">Tạm ngưng (Pause)</option>}
                                    {Number(selectedStatusTour.trangThai) !== 3 && <option value="3">Ngừng kinh doanh (Stop Operation)</option>}
                                </select>
                            </div>
                            <p className="text-xs text-amber-600 italic bg-amber-50 p-2 rounded-lg mt-2">
                                * Lưu ý: Khi chuyển sang "Ngừng kinh doanh", hệ thống sẽ kiểm tra nghiêm ngặt các chuyến đi đang diễn ra trước khi phê duyệt.
                            </p>
                        </div>
                    ) : ""
                }
                type="warning"
                confirmText="Cập nhật ngay"
                onCancel={() => setStatusModalOpen(false)}
                onConfirm={executeChangeStatus}
            />

            <ConfirmModal
                isOpen={confirmOpen}
                title="Xác nhận xóa tour"
                message={`Bạn có chắc chắn muốn xóa tour "${selectedTour?.tenTour}" không? Dữ liệu liên quan sẽ bị xóa mềm.`}
                type="danger"
                confirmText="Xóa"
                onCancel={() => setConfirmOpen(false)}
                onConfirm={executeDelete}
            />
        </div>
    );
}