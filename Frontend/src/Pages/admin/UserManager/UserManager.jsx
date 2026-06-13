import React, { useState, useEffect, useMemo } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import CreateUserModal from './CreateUserModal';
import { getUserApi,unlockUserApi,lockUserApi,getUserDetailApi } from '~/Services/UserService'; 
import { toastError,toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';
import UpdateUserModal from './UpdateUserModal';
import DetailUserModal from './DetalUserModal';

const getStatusConfig = (trangThai) => {
    switch (trangThai) {
        case 0:
            return { 
                text: 'Đã khóa', 
                style: 'text-red-500 bg-red-50 border-red-200', 
                isLocked: true 
            };
        case 1:
            return { 
                text: 'Đang hoạt động', 
                style: 'text-green-600 bg-green-50 border-green-200', 
                isLocked: false 
            };
        default:
            return { 
                text: 'Không xác định', 
                style: 'text-slate-500 bg-slate-50 border-slate-200', 
                isLocked: false 
            };
    }
};
export default function UserManager() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    
    // State phân trang và tìm kiếm
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    // thêm tài khoản
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    // cập nhật 
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    //xem chi tiết
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedDetailUser, setSelectedDetailUser] = useState(null);
    // form xác nhận 
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({
        title: '',
        message: '',
        type: 'danger',
        confirmText: 'Xác nhận',
        action: null
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getUserApi(currentPage, perPage, searchTerm);
            setUsers(response.items || []);
            setTotalRows(response.totalItems || 0);
        } catch (error) {
            toastError("Lỗi tải danh sách người dùng", getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, perPage, searchTerm]);


    const executeConfirmAction = async () => {
        try {
            await confirmConfig.action?.();
        } catch (error) {
            toastError("Thao tác thất bại", getErrorMessage(error));
        } finally {
            setConfirmOpen(false);
        }
    };

  const handleEdit = (row) => {
    setSelectedUser(row);
    setIsUpdateModalOpen(true);
};

    const handleView = async (row) => {
    try {
        setLoading(true);
        const res = await getUserDetailApi(row.maNguoiDung); 
        console.log("Dữ liệu nhận được:", res);
        setSelectedDetailUser(res);
        setIsDetailModalOpen(true);
    } catch (error) {
        toastError("Không thể tải chi tiết người dùng!");
    } finally {
        setLoading(false);
    }
};

   const handleLock = (row) => {
        setConfirmConfig({
            title: "Khóa tài khoản",
            message: `Bạn có chắc chắn muốn khóa tài khoản của "${row.hoTen}" không?`,
            type: "danger",
            confirmText: "Khóa tài khoản",
            action: async () => {
                setLoading(true);
                await lockUserApi(row.maNguoiDung);
                toastSuccess(`Đã khóa tài khoản ${row.hoTen}`);
                fetchUsers();
            }
        });
        setConfirmOpen(true);
    };

    const handleUnlock = (row) => {
        setConfirmConfig({
            title: "Mở khóa tài khoản",
            message: `Bạn có chắc chắn muốn mở khóa cho người dùng "${row.hoTen}" không?`,
            type: "info",
            confirmText: "Mở khóa",
            action: async () => {
                setLoading(true);
                await unlockUserApi(row.maNguoiDung);
                toastSuccess(`Đã mở khóa tài khoản ${row.hoTen}`);
                fetchUsers();
            }
        });
        setConfirmOpen(true);
    };

    const columns = useMemo(() => [
        {
            name: 'Người dùng',
            sortable: true,
            minWidth: '250px',
            selector: row => row.hoTen,
            cell: (row) => {
                const statusConfig = getStatusConfig(row.trangThai);
                return (
                    <div className="flex items-center gap-4 py-2">
                        <img
                            src={row.duongDanAnh ? `https://localhost:7016${row.duongDanAnh}` : 'https://placehold.co/150x150?text=No+Avt'}
                            alt={row.hoTen}
                            onError={(e) => { e.target.src = 'https://placehold.co/150x150?text=Error' }}
                            className={`w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0 
                                ${statusConfig.isLocked ? 'opacity-50 grayscale' : ''}`}
                        />
                        <div className="min-w-0">
                            <h4 className={`font-bold text-sm truncate ${statusConfig.isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                                {row.hoTen}
                            </h4>
                            <p className="text-xs text-slate-500 truncate">{row.email}</p>
                        </div>
                    </div>
                );
            },
        },
        {
            name: 'Vai trò',
            sortable: true,
            selector: row => row.tenVaiTro,
            cell: (row) => {
                const statusConfig = getStatusConfig(row.trangThai);
                return (
                    <p className={`text-sm font-semibold ${statusConfig.isLocked ? 'text-slate-400' : 'text-slate-700'}`}>
                        {row.tenVaiTro || 'Chưa phân quyền'}
                    </p>
                );
            },
        },
        {
            name: 'Trạng thái',
            cell: (row) => {
                const statusConfig = getStatusConfig(row.trangThai);
                return (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusConfig.style}`}>
                        {statusConfig.text}
                    </span>
                );
            },
        },
        {
            name: 'Ngày tham gia',
            sortable: true,
            selector: row => row.ngayTao,
            cell: (row) => (
                <span className="text-sm text-slate-500 font-medium">
                    {row.ngayTao ? new Date(row.ngayTao).toLocaleDateString('vi-VN') : '--'}
                </span>
            ),
        },
        {
            name: 'Thao tác',
            width: '150px',
            cell: (row) => (
                <RowActionsButton
                    row={row}
                    onEdit={handleEdit}
                    showLock={row.trangThai === 1} 
                    onLock={handleLock}
                    showUnlock={row.trangThai === 0} 
                    onUnlock={handleUnlock}
                    onView={handleView}
                />
            ),
        },
    ], []);

    return (
        <div className="space-y-6 p-4">
            <ManagerToolbar
                searchPlaceholder="Tìm kiếm tên, email..."
                onSearchChange={(value) => {
                    setSearchTerm(value);
                    setCurrentPage(1);
                }}
                addButtonText="Thêm người dùng"
                showCategoryFilter={false}
               onAddClick={() => setIsCreateModalOpen(true)}
            />

            <CustomDataTable
                selectableRows
                selectableRowsHighlight
                columns={columns}
                data={users}
                progressPending={loading}
                
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangePage={(page) => setCurrentPage(page)}
                onChangeRowsPerPage={(newPerPage, page) => {
                    setPerPage(newPerPage);
                    setCurrentPage(page);
                }}

                paginationComponentOptions={{
                    rowsPerPageText: 'Số dòng:',
                    rangeSeparatorText: 'trên',
                    noRowsPerPage: false,
                    selectAllRowsItem: false, 
                }}
                highlightOnHover
                pointerOnHover
                noDataComponent={
                    <div className="py-8 text-center">
                        <p className="text-slate-400 text-sm">
                            Không tìm thấy dữ liệu người dùng
                        </p>
                    </div>
                }       
            />
            
            <CreateUserModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onSuccess={() => {
                    setIsCreateModalOpen(false);
                    fetchUsers();
                }} 
            />
            <UpdateUserModal
                isOpen={isUpdateModalOpen}
                onClose={() => {
                    setIsUpdateModalOpen(false);
                    setSelectedUser(null);
                }}
                onSuccess={() => {
                    setIsUpdateModalOpen(false);
                    setSelectedUser(null);
                    fetchUsers();
                }}
                userData={selectedUser}
            />
            <DetailUserModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedDetailUser(null);
                }}
                userData={selectedDetailUser}
            />
            <ConfirmModal
                isOpen={confirmOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                confirmText={confirmConfig.confirmText}
                type={confirmConfig.type}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={executeConfirmAction}
            />
        </div>
    );
}