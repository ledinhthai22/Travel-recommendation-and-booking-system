import React, { useState, useMemo, useEffect } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';

import { getAmenitiesPageApi, deleteAmenityApi } from '~/Services/Amenities';
import AddAmenityModal from './AddAmenityModal';
import UpdateAmenityModal from './UpdateAmenityModal';
import { toastError, toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';

export default function AmenitiesManager() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const [amenities, setAmenities] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedAmenity, setSelectedAmenity] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({
        title: '', message: '', type: 'danger', confirmText: 'Xác nhận', action: null
    });

    const fetchAmenities = async () => {
        try {
            setLoading(true);
            const response = await getAmenitiesPageApi(currentPage, perPage, searchTerm);
            
            // Map JSON trả về từ PageDTO (C# mapping thường giữ nguyên PascalCase hoặc CamelCase tùy cấu hình)
            // Đảm bảo lấy đúng mảng items và totalItems từ PageDTO
            setAmenities(response.items || response.Items || []);
            setTotalRows(response.totalItems || response.TotalItems || 0);
        } catch (error) {
            toastError('Tải danh sách tiện nghi thất bại', getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAmenities();
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
        // Lấy đúng mã và tên theo DTO Backend (Hỗ trợ cả trường hợp config tự biến đổi camelCase)
        const currentId = row.maTienIch ?? row.MaTienIch;
        const currentName = row.tenTienIch ?? row.TenTienIch;

        setConfirmConfig({
            title: "Xóa Tiện Nghi",
            message: `Bạn có chắc chắn muốn xóa tiện nghi "${currentName}" không?`,
            type: "danger",
            confirmText: "Xóa",
            action: async () => {
                await deleteAmenityApi(currentId);
                toastSuccess("Xóa tiện nghi thành công!");
                fetchAmenities();
            }
        });
        setConfirmOpen(true);
    };

    const handleEdit = (row) => {
        setSelectedAmenity(row);
        setIsUpdateModalOpen(true);
    };

    const columns = useMemo(() => [
        {
            name: 'STT',
            width: '80px',
            center: true,
            cell: (row, index) => (
                <span className="font-medium">
                    {(currentPage - 1) * perPage + index + 1}
                </span>
            )
        },
        {
            name: 'Tên tiện nghi',
            sortable: true,
            selector: row => row.tenTienIch ?? row.TenTienIch ?? '',
            cell: row => (
                <span className="font-medium text-slate-900">
                    {row.tenTienIch ?? row.TenTienIch}
                </span>
            ),
        },
        {
            name: 'Thao tác',
            width: '140px',
            center: true,
            cell: row => (
                <RowActionsButton
                    row={row}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ),
        },
    ], [currentPage, perPage]);

    return (
        <div className="space-y-6 p-4">
            <ManagerToolbar
                searchPlaceholder="Tìm kiếm tên tiện nghi..."
                onSearchChange={(value) => {
                    setSearchTerm(value);
                    setCurrentPage(1);
                }}
                showCategoryFilter={false}
                showAddButton={true}
                addButtonText='Thêm mới tiện ích'
                onAddClick={() => setIsCreateModalOpen(true)}
                showExcel={false}
            />

            <CustomDataTable
                columns={columns}
                data={amenities}
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
                        <p className="text-slate-400 text-sm">Không có dữ liệu tiện nghi</p>
                    </div>
                }
            />

            <AddAmenityModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    setCurrentPage(1);
                    fetchAmenities();
                }}
            />

            <UpdateAmenityModal
                isOpen={isUpdateModalOpen}
                onClose={() => {
                    setIsUpdateModalOpen(false);
                    setSelectedAmenity(null);
                }}
                onSuccess={() => {
                    fetchAmenities();
                }}
                initialData={selectedAmenity}
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