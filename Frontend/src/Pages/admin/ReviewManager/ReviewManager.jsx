import React, { useState, useMemo, useEffect } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import { toastError, toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';
import ReviewDetailModal from './ReviewDetailModal';
import * as signalR from '@microsoft/signalr';

import { Star, Eye } from 'lucide-react';
import { getReviewApi, updateReviewStatusApi, batchUpdateReviewStatusApi } from '~/Services/ReviewService';

export default function ReviewManager() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState("");
    const [starFilter, setStarFilter] = useState("");
    const [reviews, setReviews] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);

    const [isInitialLoaded, setIsInitialLoaded] = useState(false);

    const [selectedRows, setSelectedRows] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({ title: '', message: '', action: null });

    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            let statusParam = statusFilter === "" ? null : (statusFilter === 'true');
            let starParam = starFilter === "" ? null : parseInt(starFilter);

            const response = await getReviewApi(currentPage, perPage, searchTerm, starParam, statusParam);
            setReviews(response.items || []);
            setTotalRows(response.totalItems || 0);

            // Đánh dấu đã tải xong dữ liệu lần đầu thành công
            if (!isInitialLoaded) setIsInitialLoaded(true);
        } catch (error) {
            toastError('Tải dữ liệu thất bại', getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [currentPage, perPage, searchTerm, starFilter, statusFilter]);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7016/TravelRecommendationHub")
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => {
                connection.on("ReviewStatusUpdated", (updatedData) => {
                    setReviews(prevReviews => prevReviews.map(review => {
                        const match = updatedData.find(u => u.maDanhGia === review.maDanhGia);
                        if (match) {
                            return {
                                ...review,
                                trangThai: match.trangThai,
                                isProcessedByAI: match.isProcessedByAI,
                                ghiChuKiemDuyet: match.ghiChuKiemDuyet
                            };
                        }
                        return review;
                    }));
                });
            })
            .catch(err => console.error("SignalR Connection Error: ", err));

        return () => {
            connection.stop();
        };
    }, []);

    const handleToggleStatus = (row) => {
        const newStatus = !row.trangThai;
        setConfirmConfig({
            title: newStatus ? "Hiện bình luận" : "Ẩn bình luận",
            message: `Bạn có chắc muốn ${newStatus ? 'hiển thị' : 'ẩn'} bình luận của "${row.tenNguoiDung}" không?`,
            action: async () => {
                try {
                    await updateReviewStatusApi(row.maDanhGia, newStatus);
                    toastSuccess("Cập nhật trạng thái thành công!");
                    fetchReviews();
                } catch (error) {
                    toastError("Thao tác thất bại", getErrorMessage(error));
                }
            }
        });
        setConfirmOpen(true);
    };

    const handleBatchUpdateStatus = (trangThaiMoi) => {
        if (selectedRows.length === 0) {
            toastError("Thông báo", "Vui lòng chọn ít nhất một bình luận để xử lý!");
            return;
        }

        const ids = selectedRows.map(r => r.maDanhGia);

        setConfirmConfig({
            title: trangThaiMoi ? "Hiển thị hàng loạt" : "Ẩn hàng loạt",
            message: `Bạn có chắc chắn muốn ${trangThaiMoi ? 'HIỂN THỊ' : 'ẨN'} ${ids.length} bình luận đã chọn không?`,
            action: async () => {
                try {
                    await batchUpdateReviewStatusApi(ids, trangThaiMoi);
                    toastSuccess(`Đã cập nhật trạng thái thành công cho ${ids.length} bình luận!`);
                    setSelectedRows([]);
                    fetchReviews();
                } catch (error) {
                    toastError("Thao tác hàng loạt thất bại", getErrorMessage(error));
                }
            }
        });
        setConfirmOpen(true);
    };

    const handleRowSelected = (state) => {
        setSelectedRows(state.selectedRows);
    };

    const handleViewDetail = (row) => {
        setSelectedReviewId(row.maDanhGia);
        setDetailModalOpen(true);
    };

    const columns = useMemo(() => [
        { name: 'STT', width: '70px', center: true, cell: (row, index) => (currentPage - 1) * perPage + index + 1 }, // TỐI ƯU STT chuẩn theo phân trang
        {
            name: 'Người dùng', sortable: true, selector: row => row.tenNguoiDung,
            cell: row => <span className="font-semibold">{row.tenNguoiDung}</span>
        },
        {
            name: 'Tour', sortable: true, selector: row => row.tenTour,
            cell: row => <span className="text-slate-600 italic">{row.tenTour}</span>
        },
        {
            name: 'Đánh giá', width: '110px', sortable: true, selector: row => row.diemDanhGia,
            cell: row => (
                <div className="flex items-center gap-1 text-amber-300 font-bold">
                    <span>{row.diemDanhGia}</span>
                    <Star size={14} fill="currentColor" />
                </div>
            )
        },
        {
            name: 'Nội dung',
            sortable: true,
            width: '300px',
            cell: row => (
                <p className="whitespace-normal break-words py-2 text-sm leading-relaxed" title={row.noiDung}>
                    {row.noiDung}
                </p>
            )
        },
        {
            name: 'Trạng thái', width: '220px',
            cell: row => (
                <div className="flex flex-col gap-1 py-1.5 justify-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-bold rounded-2xl border w-fit ${row.trangThai
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                        }`}>
                        {!row.trangThai && <span className="bg-red-500 rounded-full w-2 h-2" />}
                        {row.trangThai ? 'Hiển thị' : 'Đã ẩn'}
                    </span>
                    {row.ghiChuKiemDuyet && (
                        <span className="text-[11px] text-slate-500 italic max-w-[200px] truncate" title={row.ghiChuKiemDuyet}>
                            {row.isProcessedByAI && !row.ghiChuKiemDuyet.includes("Admin")}
                            {row.ghiChuKiemDuyet}
                        </span>
                    )}
                </div>
            ),
        },
        {
            name: 'Thao tác', width: '120px',
            cell: row => (
                <RowActionsButton
                    row={row}
                    onView={() => handleViewDetail(row)}
                    onToggleStatus={() => handleToggleStatus(row)}
                    showToggle={true}
                    showView={true}
                    showEdit={false}
                    showDelete={false}
                    showLock={false}
                    showUnlock={false}
                    showResetPass={false}
                />
            ),
        },
    ], [currentPage, perPage]); // Thêm dependency để STT cập nhật chính xác khi sang trang mới

    return (
        <div className="space-y-6 p-4 relative">
            {/* TỐI ƯU TRÁNH GIẬT TRANG: Overlay mờ báo hiệu đang load ngầm khi qua trang (không làm mất bảng cũ) */}
            {loading && isInitialLoaded && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 pointer-events-none transition-all animate-pulse" />
            )}

            <ManagerToolbar
                searchPlaceholder="Tìm kiếm nội dung, người dùng..."
                showExcel={false}
                showAddButton={false}
                onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
                filters={[
                    {
                        placeholder: "Trạng thái",
                        value: statusFilter,
                        onChange: (val) => { setStatusFilter(val); setCurrentPage(1); },
                        options: [
                            { value: "", label: "Tất cả trạng thái" },
                            { value: "true", label: "Hiển thị" },
                            { value: "false", label: "Đã ẩn" }
                        ]
                    },
                    {
                        placeholder: "Số sao",
                        value: starFilter,
                        onChange: (val) => { setStarFilter(val); setCurrentPage(1); },
                        options: [
                            { value: "", label: "Tất cả số sao" },
                            { value: "5", label: "5 Sao" },
                            { value: "4", label: "4 Sao" },
                            { value: "3", label: "3 Sao" },
                            { value: "2", label: "2 Sao" },
                            { value: "1", label: "1 Sao" }
                        ]
                    }
                ]}
            />

            {selectedRows.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center justify-between animate-fadeIn">
                    <span className="text-sm font-medium text-slate-600">
                        Đang chọn <b>{selectedRows.length}</b> bình luận
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleBatchUpdateStatus(true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded transition"
                        >
                            Hiển thị các mục chọn
                        </button>
                        <button
                            onClick={() => handleBatchUpdateStatus(false)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded transition"
                        >
                            Ẩn các mục chọn
                        </button>
                    </div>
                </div>
            )}

            <CustomDataTable
                columns={columns}
                selectableRows
                data={reviews}
                keyField="maDanhGia"

                progressPending={loading && !isInitialLoaded}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangePage={(page) => setCurrentPage(page)}
                onChangeRowsPerPage={(newPerPage, page) => {
                    setPerPage(newPerPage);
                    setCurrentPage(page);
                }}
                onSelectedRowsChange={handleRowSelected}
                clearSelectedRows={false}
            />

            <ConfirmModal
                isOpen={confirmOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                onConfirm={async () => { await confirmConfig.action(); setConfirmOpen(false); }}
                onCancel={() => setConfirmOpen(false)}
            />

            <ReviewDetailModal
                isOpen={detailModalOpen}
                maDanhGia={selectedReviewId}
                onClose={() => setDetailModalOpen(false)}
            />
        </div>
    );
}