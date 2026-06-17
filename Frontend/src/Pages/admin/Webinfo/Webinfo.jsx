import React, { useState, useEffect, useCallback, useMemo } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';

import {
    getWebInfoApi,
    clearWebInfoContentApi,
    updateWebInfoStatusApi
} from '~/Services/WebInfoService'

import { toastError, toastSuccess } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";

import WebInfoDetailModal from "./WebInfoDetailModal";
import WebInfoEditModal from "./WebInfoEditModal";
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';

export default function Webinfo() {

    const [searchTerm, setSearchTerm] = useState('');
    const [webInfo, setWebInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [openView, setOpenView] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({
        title: '',
        message: '',
        type: 'danger',
        confirmText: 'Xác nhận',
        action: null
    });
    const pageSize = 100000000;
    const fetchWebInfo = useCallback(async (key = '', statusValue = "") => {
        setLoading(true);

        const res = await getWebInfoApi(
            1,
            pageSize,
            key,
            statusValue === "" ? null : statusValue === "true"
        );

        setWebInfo(res?.items || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchWebInfo(searchTerm, status);
        }, 100);

        return () => clearTimeout(timer);
    }, [searchTerm, status, fetchWebInfo]);
    const handleConfirm = async () => {
        try {
            await confirmConfig.action?.();
        } catch (error) {
            toastError("Thao tác thất bại", getErrorMessage(error));
        } finally {
            setConfirmOpen(false);
        }
    };

    const handleView = useCallback((row) => {
        setSelectedItem(row);
        setOpenView(true);
    }, []);

    const handleEdit = useCallback((row) => {
        setSelectedItem(row);
        setOpenEdit(true);
    }, []);

    const handleToggleStatus = useCallback((row) => {
        setConfirmConfig({
            title: "Cập nhật trạng thái",
            message: `Bạn muốn thay đổi trạng thái "${row.key}"?`,
            type: "warning",
            confirmText: "Cập nhật",
            action: async () => {
                await updateWebInfoStatusApi(row.maTTTrang, !row.trangthai);
                toastSuccess("Cập nhật thành công");
                fetchWebInfo(searchTerm);
            }
        });

        setConfirmOpen(true);
    }, [fetchWebInfo, searchTerm]);

    const handleDelete = useCallback((row) => {
        setConfirmConfig({
            title: "Xóa thông tin",
            message: `Bạn có chắc muốn xóa "${row.key}" không?`,
            type: "danger",
            confirmText: "Xóa",
            action: async () => {
                await clearWebInfoContentApi(row.maTTTrang);
                toastSuccess("Xóa thành công", row.key);
                fetchWebInfo(searchTerm);
            }
        });

        setConfirmOpen(true);
    }, [fetchWebInfo, searchTerm]);

    const columns = useMemo(() => [
        {
            name: 'STT',
            width: '80px',
            center: 'true',
            selector: row => row.maTTTrang,
        },
        {
            name: 'Key',
            selector: row => row.key,
            cell: (row) => (
                <div className="font-mono text-sm font-semibold text-blue-600 px-3 py-1 rounded-lg">
                    {row.key}
                </div>
            ),
        },
        {
            name: 'Nội dung',
            selector: row => row.noidung,
            cell: (row) => {
                if (row.key === "logo_url") {
                    return (
                        <img
                            src={`https://localhost:7016${row.noidung}`}
                            alt="Logo"
                            className="h-12 object-contain"
                        />
                    );
                }

                return (
                    <div className="text-sm text-slate-700 max-w-xs truncate">
                        {row.noidung}
                    </div>
                );
            }
        },
        {
            name: 'Trạng thái',
            selector: row => row.trangthai,
            cell: (row) => (
                <span className={`px-4 py-1.5 rounded-4xl text-xs font-bold ${row.trangthai
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}>
                    {row.trangthai ? "Hiển thị" : "Ẩn"}
                </span>
            )
        },
        {
            name: 'Ngày cập nhật',
            selector: row => row.ngayCapNhat,
            cell: (row) => {
                const date = row.ngayCapNhat ? new Date(row.ngayCapNhat) : null;

                return (
                    <div>
                        <p className="text-sm text-slate-700">
                            {date ? date.toLocaleDateString('vi-VN') : '--'}
                        </p>
                        <p className="text-xs text-slate-400">
                            {date ? date.toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : '--'}
                        </p>
                    </div>
                );
            }
        },
        {
            name: 'Thao tác',
            width: '150px',
            cell: (row) => (
                <RowActionsButton
                    row={row}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={!row.trangthai ? handleDelete : undefined}
                />
            )
        }
    ], [handleView, handleEdit, handleDelete, handleToggleStatus]);

    return (
        <div className="space-y-6 p-4">

            <ManagerToolbar
                searchPlaceholder="Tìm kiếm thông tin..."
                onSearchChange={setSearchTerm}
                showAddButton={false}
                showExcel={false}
                filters={[
                    {
                        placeholder: "Trạng thái",
                        value: status,
                        onChange: setStatus,
                        options: [
                            { value: "", label: "Tất cả" },
                            { value: "true", label: "Hiển thị" },
                            { value: "false", label: "Ẩn" }
                        ],
                    }
                ]}
            />

            <CustomDataTable
                columns={columns}
                data={webInfo}
                paginationPerPage={10}
                highlightOnHover
                pointerOnHover
                paginationComponentOptions={{
                    rowsPerPageText: 'Số dòng:',
                    rangeSeparatorText: 'trên',
                    noRowsPerPage: false,
                    selectAllRowsItem: true,
                    selectAllRowsItemText: 'Tất cả',
                }}
                noDataComponent={
                    <div className="py-8 text-center">
                        <p className="text-slate-400 text-sm">
                            Không có dữ liệu
                        </p>
                    </div>
                }
            />

            <WebInfoDetailModal
                isOpen={openView}
                onClose={() => setOpenView(false)}
                data={selectedItem}
                onReload={() => fetchWebInfo(searchTerm)}
            />

            <WebInfoEditModal
                isOpen={openEdit}
                onClose={() => setOpenEdit(false)}
                data={selectedItem}
                onReload={() => fetchWebInfo(searchTerm)}
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