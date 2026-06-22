import React, { useState, useMemo, useEffect } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';

// Đổi tên hàm import đúng theo Service mới
import { getTypeTourApi, deleteTypeTourApi } from '~/Services/TypeTourService';
import AddTypeTourModal from './AddTypeTourModal';
import UpdateTypeTourModal from './UpdateTypeTourModal';
import { toastError, toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';

export default function TypeTourManager() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(8); // Đồng bộ 8 dòng theo mặc định service

    const [typeTours, setTypeTours] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedTypeTour, setSelectedTypeTour] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({
        title: '', message: '', type: 'danger', confirmText: 'Xác nhận', action: null
    });

    const fetchTypeTours = async () => {
        try {
            setLoading(true);
            // Gọi đúng hàm getTypeTourApi
            const response = await getTypeTourApi(currentPage, perPage, searchTerm);
            setTypeTours(response.items || []);
            setTotalRows(response.totalItems || 0);
        } catch (error) {
            toastError('Tải danh sách loại tour thất bại', getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTypeTours();
    }, [currentPage, perPage, searchTerm]);

    const handleConfirm = async () => {
        try {
            await confirmConfig.action?.();
        } catch (error) {
            toastError("Thao tác thất bại", getErrorMessage(error));
        } finally {
            setConfirmOpen(false);
        }
    };

    const handleDelete = (row) => {
        if (row.trangThai === true) {
            toastError("Không thể xóa", "Vui lòng chuyển trạng thái loại tour thành 'Khóa' trước khi tiến hành xóa!");
            return;
        }

        setConfirmConfig({
            title: "Xóa Loại Hình Tour",
            message: `Bạn có chắc chắn muốn xóa loại tour "${row.tenLoaiTour}" không?`,
            type: "danger",
            confirmText: "Xóa",
            action: async () => {
                await deleteTypeTourApi(row.maLoaiTour);
                toastSuccess("Xóa loại hình tour thành công!");
                fetchTypeTours();
            }
        });
        setConfirmOpen(true);
    };

    const handleEdit = (row) => {
        setSelectedTypeTour(row);
        setIsUpdateModalOpen(true);
    };

    const columns = useMemo(() => [
        {
            name: 'STT',
            width: '80px',
            center: true,
            cell: (row, index) => (
                <span className="font-medium">{(currentPage - 1) * perPage + index + 1}</span>
            )
        },
        {
            name: 'Tên loại hình tour',
            sortable: true,
            selector: row => row.tenLoaiTour || '',
            cell: row => <span className="font-medium text-slate-900">{row.tenLoaiTour}</span>,
        },
        {
            name: 'Trạng thái',
            width: '160px',
            center: true,
            cell: row => (
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    row.trangThai ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                    {row.trangThai ? 'Đang hoạt động' : 'Tạm khóa'}
                </span>
            ),
        },
        {
            name: 'Thao tác',
            width: '140px',
            center: true,
            cell: row => (
                <RowActionsButton row={row} onEdit={handleEdit} onDelete={handleDelete} />
            ),
        },
    ], [currentPage, perPage]);

    return (
        <div className="space-y-6 p-4">
            <ManagerToolbar
                searchPlaceholder="Tìm kiếm tên loại hình tour..."
                onSearchChange={(value) => {
                    setSearchTerm(value);
                    setCurrentPage(1);
                }}
                showCategoryFilter={false}
                showAddButton={true}
                addButtonText='Thêm mới loại tour'
                onAddClick={() => setIsCreateModalOpen(true)}
                showExcel={false}
            />

            <CustomDataTable
                columns={columns}
                data={typeTours}
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangePage={(page) => setCurrentPage(page)}
                onChangeRowsPerPage={(newPerPage, page) => {
                    setPerPage(newPerPage);
                    setCurrentPage(page);
                }}
                highlightOnHover
                pointerOnHover
                paginationComponentOptions={{
                    rowsPerPageText: 'Số dòng:',
                    rangeSeparatorText: 'trên',
                    noRowsPerPage: false,
                    selectAllRowsItem: false,
                }}
                noDataComponent={
                    <div className="py-8 text-center">
                        <p className="text-slate-400 text-sm">Không có dữ liệu loại hình tour</p>
                    </div>
                }
            />

            <AddTypeTourModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    setCurrentPage(1);
                    fetchTypeTours();
                }}
            />
      
            <UpdateTypeTourModal
                isOpen={isUpdateModalOpen}
                onClose={() => {
                    setIsUpdateModalOpen(false);
                    setSelectedTypeTour(null);
                }}
                onSuccess={() => {
                    fetchTypeTours();
                }}
                initialData={selectedTypeTour}
            />

            <ConfirmModal
                isOpen={confirmOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                confirmText={confirmConfig.confirmText}
                type={confirmConfig.type}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleConfirm}
            />
        </div>
    );
}