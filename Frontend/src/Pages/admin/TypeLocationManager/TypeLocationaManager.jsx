import React, { useState, useEffect } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import { getTypeLocationListApi, deleteTypeLocationApi } from '~/Services/TypeLocationService';
import { toastError, toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';
import AddTypeLocationModal from './AddTypeLocationModal';
import UpdateTypeLocationModal from './UpdateTypeLocationModal';

export default function TypeLocationManager() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [typeLocations, setTypeLocations] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [updateConfig, setUpdateConfig] = useState({ isOpen: false, data: null });

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({
        title: '', message: '', type: 'danger', confirmText: 'Xác nhận', action: null
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getTypeLocationListApi(currentPage, perPage, searchTerm);
            setTypeLocations(response.items || []);
            setTotalRows(response.totalItems || 0);
        } catch (error) {
            toastError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, perPage, searchTerm]);

    const handleDelete = (row) => {
        setConfirmConfig({
            title: "Xóa loại địa điểm",
            message: `Bạn có chắc chắn muốn xóa "${row.tenLoaiDD}" không?`,
            type: "danger",
            confirmText: "Xóa",
            action: async () => {
                try {
                    await deleteTypeLocationApi(row.maLoaiDD);
                    toastSuccess("Xóa thành công!");
                    fetchData();
                } catch (error) {
                    toastError(getErrorMessage(error));
                }
            }
        });
        setConfirmOpen(true);
    };

    const columns = [
        {
            name: "STT",
            width: "200px",
            cell: (_, index) => index + 1
        },
        {
            name: "Tên loại địa điểm",
            selector: (row) => row.tenLoaiDD,
            sortable: true
        },
        {
            name: "Thao tác",
            width: "150px",
            center: 'true',
            cell: (row) => (
                <RowActionsButton
                    onEdit={() => setUpdateConfig({ isOpen: true, data: row })}
                    onDelete={() => handleDelete(row)}
                />
            )
        }
    ];

    return (
        <div className="space-y-6 p-4">
            <ManagerToolbar
                searchPlaceholder="Tìm kiếm..."
                showExcel={false}
                addButtonText='Thêm mới loại địa điểm'
                onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
                onAddClick={() => setIsCreateModalOpen(true)}
            />

            <CustomDataTable
                columns={columns}
                data={typeLocations}
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangePage={setCurrentPage}
                onChangeRowsPerPage={(per) => { setPerPage(per); setCurrentPage(1); }}
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

            <AddTypeLocationModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => { setIsCreateModalOpen(false); fetchData(); }}
            />

            <UpdateTypeLocationModal
                isOpen={updateConfig.isOpen}
                initialData={updateConfig.data}
                onClose={() => setUpdateConfig({ isOpen: false, data: null })}
                onSuccess={() => { setUpdateConfig({ isOpen: false, data: null }); fetchData(); }}
                setConfirmConfig={setConfirmConfig}
                setConfirmOpen={setConfirmOpen}
            />

            <ConfirmModal
                isOpen={confirmOpen}
                {...confirmConfig}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={async () => {
                    try {
                        await confirmConfig.action();
                    } catch (error) {
                        console.error("Lỗi thực thi hành động:", error);
                    } finally {
                        setConfirmOpen(false);
                    }
                }}
            />
        </div>
    );
}