import React, {
    useState,
    useEffect,
    useCallback,
    useMemo
} from 'react';

import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import CreateStaffModal from './CreateStaffModal';
import StaffDetailModal from './StaffDetailModal';
import ResetPasswordModal from './ResetPasswordModal';
import StaffUpdateModal from './StaffUpdateModal';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';

import { getStaffApi, deleteStaffApi } from '~/Services/StaffService';
import { toastError, toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';

export default function StaffManager() {

    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState('');
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openView, setOpenView] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [openCreate, setOpenCreate] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openResetPass, setOpenResetPass] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({
        title: '',
        message: '',
        type: 'danger',
        confirmText: 'Xác nhận',
        action: null
    });

    const statusLabels = {
        2: "Đang làm việc",
        3: "Nghỉ phép",
        4: "Nghỉ việc"
    };

    const statusColors = {
        2: "bg-green-100 text-green-700",
        3: "bg-yellow-100 text-yellow-700",
        4: "bg-red-100 text-red-700"
    };

    const fetchStaffs = useCallback(async (
        hoTen = '',
        email = '',
        soDienThoai = '',
        trangThai = null
    ) => {
        try {
            setLoading(true);

            const res = await getStaffApi(
                1, 10,
                hoTen, email, soDienThoai, trangThai
            );

            setStaffs(res?.items || []);
        } catch (error) {
            toastError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStaffs(searchTerm, "", "", status || null);
        }, 100);

        return () => clearTimeout(timer);
    }, [searchTerm, status, fetchStaffs]);

    const handleConfirm = async () => {
        try {
            await confirmConfig.action?.();
        } catch (error) {
            toastError(getErrorMessage(error));
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
        setOpenUpdate(true);
    }, []);

    const handleResetPass = useCallback((row) => {
        setSelectedItem(row);
        setOpenResetPass(true);
    }, []);

    const handleDelete = useCallback((row) => {
        setConfirmConfig({
            title: "Xóa nhân viên",
            message: `Bạn có chắc muốn xóa "${row.hoTen}" không?`,
            type: "danger",
            confirmText: "Xóa",
            action: async () => {
                await deleteStaffApi(row.maNguoiDung);
                toastSuccess("Xóa thành công nhân viên", row.hoTen);
                fetchStaffs();
            }
        });
        setConfirmOpen(true);
    }, [fetchStaffs]);

    const columns = useMemo(() => [
        {
            name: 'STT',
            width: '80px',
            center: true,
            cell: (row, index) => (
                <span className="font-medium">{index + 1}</span>
            )
        },
        {
            name: 'Nhân viên',
            selector: row => row.hoTen,
            sortable: true,
            grow: 2,
            cell: (row) => (
                <div className="flex items-center gap-4 py-2">
                    <img
                        src={
                            row.duongDanAnh
                                ? `https://localhost:7016${row.duongDanAnh}`
                                : "/default-avatar.png"
                        }
                        alt={row.hoTen}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <h4 className="font-semibold text-sm text-slate-900">
                            {row.hoTen}
                        </h4>
                        <p className="text-xs text-slate-500">
                            {row.email}
                        </p>
                    </div>
                </div>
            )
        },
        {
            name: 'Chức Danh',
            selector: row => row.maVaiTro,
            cell: row => (
                <span className="text-sm text-slate-600">
                    {row.tenVaiTro}
                </span>
            )
        },
        {
            name: 'Số điện thoại',
            selector: row => row.soDienThoai,
            cell: row => (
                <span className="text-sm text-slate-600">
                    {row.soDienThoai}
                </span>
            )
        },
        {
            name: 'Giới tính',
            selector: row => row.gioiTinh,
            center: true,
            cell: row => (
                <span>{row.gioiTinh ? 'Nam' : 'Nữ'}</span>
            )
        },
        {
            name: 'Ngày sinh',
            selector: row => row.ngaySinh,
            cell: row => (
                <span className="text-sm text-slate-600">
                    {row.ngaySinh
                        ? new Date(row.ngaySinh).toLocaleDateString('vi-VN')
                        : '--'}
                </span>
            )
        },
        {
            name: 'Trạng thái',
            selector: row => row.trangThai,
            center: true,
            cell: row => (
                <span className={`px-4 py-1 rounded-full text-xs font-bold ${statusColors[row.trangThai] || "bg-slate-100 text-slate-700"}`}>
                    {statusLabels[row.trangThai] || "Không xác định"}
                </span>
            )
        },
        {
            name: 'Thao tác',
            width: '150px',
            cell: (row) => (
                <RowActionsButton
                    row={row}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onResetPass={handleResetPass}
                />
            )
        }
    ], [handleView, handleEdit, handleDelete, handleResetPass, statusLabels, statusColors]);

    return (
        <div className="space-y-6 p-4">

            <ManagerToolbar
                searchPlaceholder="Tìm kiếm thông tin..."
                onSearchChange={setSearchTerm}
                showAddButton={true}
                addButtonText='Thêm nhân viên'
                showExcel={false}
                filters={[
                    {
                        placeholder: "Trạng thái",
                        value: status,
                        onChange: setStatus,
                        options: [
                            { value: "", label: "Tất cả" },
                            { value: "2", label: "Đang làm việc" },
                            { value: "3", label: "Nghỉ phép" },
                            { value: "4", label: "Nghỉ việc" }
                        ],
                    }
                ]}
                onAddClick={() => setOpenCreate(true)}
            />

            <CustomDataTable
                columns={columns}
                data={staffs}
                progressPending={loading}
                pagination
                paginationPerPage={10}
                paginationComponentOptions={{
                    rowsPerPageText: 'Số dòng:',
                    rangeSeparatorText: 'trên',
                    noRowsPerPage: false,
                    selectAllRowsItem: true,
                    selectAllRowsItemText: 'Tất cả',
                }}
                highlightOnHover
                pointerOnHover
                noDataComponent={
                    <div className="py-8 text-center">
                        <p className="text-slate-400 text-sm">Không có dữ liệu</p>
                    </div>
                }
            />

            <StaffDetailModal
                isOpen={openView}
                onClose={() => {
                    setOpenView(false);
                    setSelectedItem(null);
                }}
                staffId={selectedItem?.maNguoiDung}
            />

            <CreateStaffModal
                isOpen={openCreate}
                onClose={() => setOpenCreate(false)}
                onSuccess={() => fetchStaffs()}
            />

            <StaffUpdateModal
                isOpen={openUpdate}
                staffId={selectedItem?.maNguoiDung}
                onClose={() => {
                    setOpenUpdate(false);
                    setSelectedItem(null);
                }}
                onSuccess={() => fetchStaffs()}
            />

            <ResetPasswordModal
                isOpen={openResetPass}
                onClose={() => {
                    setOpenResetPass(false);
                    setSelectedItem(null);
                }}
                staff={selectedItem}
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