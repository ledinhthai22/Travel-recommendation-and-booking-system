import React, { useState, useMemo, useEffect } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';

import { getBannerApi, softDeleteBannerApi} from '~/Services/BannerService'; 
import CreateBannerModal from './CreateBannerModal';
import UpdateBannerModal from './UpdateBannerModal';
import { toastError, toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';

export default function BannerManager() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const [banners, setBanners] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    //thêm mới
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    //cập nhật
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState(null);
    //xóa mềm
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({
        title: '',
        message: '',
        type: 'danger',
        confirmText: 'Xác nhận',
        action: null
    });

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await getBannerApi(currentPage, perPage, searchTerm);
            
            setBanners(response.items || []);
            setTotalRows(response.totalItems || 0);

        } catch (error) {
            toastError('Thao tác thất bại', getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
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
        setConfirmConfig({
            title: "Xóa Banner",
            message: `Bạn có chắc chắn muốn xóa banner "${row.tieuDe}" không?`,
            type: "danger",
            confirmText: "Xóa",
            action: async () => {
                setLoading(true);
                await softDeleteBannerApi(row.maBanner); 
                toastSuccess("Xóa banner thành công!");
                fetchBanners(); 
            }
        });
        setConfirmOpen(true);
    };
    
    const handleEdit = (row) => {
        setSelectedBanner(row);
        setIsUpdateModalOpen(true);
    };


    const columns = useMemo(() => [
        {
            name: 'Hình ảnh',
            width: '120px',
            selector: row => row.duongDanAnh,
            cell: row => (
                <div className="p-2">
                    <img 
                        src={`https://localhost:7016${row.duongDanAnh}`} 
                        alt={row.tieuDe} 
                        className="h-12 w-20 object-cover rounded shadow-sm border border-slate-200"
                        onError={(e) => { e.target.src = 'https://placehold.co/100x60?text=No+Image' }} 
                    />
                </div>
            ),
        },
        {
            name: 'Tiêu đề',
            sortable: true,
            selector: row => row.tieuDe || '',
            cell: row => (
                <div>
                    <p className="font-semibold text-slate-900 line-clamp-1">{row.tieuDe}</p>
                    {row.linkLienKet && (
                        <a href={row.linkLienKet} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline line-clamp-1">
                            {row.linkLienKet}
                        </a>
                    )}
                </div>
            ),
        },
        {
            name: 'Ngày tạo',
            width: '160px',
            sortable: true,
            selector: row => row.ngayTao || '',
            cell: row => (
                <div>
                    <p className="text-sm text-slate-700">
                        {row.ngayTao ? new Date(row.ngayTao).toLocaleDateString('vi-VN') : '--'}
                    </p>
                    <p className="text-xs text-slate-400">
                        {row.ngayTao ? new Date(row.ngayTao).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '--'}
                    </p>
                </div>
            ),
        },
        {
            name: 'Trạng thái',
            width: '150px',
            cell: row => (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-2xl border ${
                    row.trangThai
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                }`}>
                    {!row.trangThai && <span className="bg-red-500 rounded-full w-2 h-2" />}
                    {row.trangThai ? 'Hiển thị' : 'Đang ẩn'}
                </span>
            ),
        },
        {
            name: 'Thao tác',
            width: '140px',
            cell: row => (
                <RowActionsButton
                    row={row}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ),
        },
    ], []);

    return (
        <div className="space-y-6 p-4">
            <ManagerToolbar
                searchPlaceholder="Tìm kiếm tiêu đề banner..."
                onSearchChange={(value) => {
                    setSearchTerm(value);
                    setCurrentPage(1);
                }}
                showCategoryFilter={false} 
                showAddButton={true} 
                onAddClick={() => setIsCreateModalOpen(true)}
                showExcel={false}
            />

            <CustomDataTable
                columns={columns}
                data={banners}
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
                        <p className="text-slate-400 text-sm">Không có dữ liệu banner</p>
                    </div>
                }
            />

            <CreateBannerModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    setCurrentPage(1);
                    fetchBanners();
                }}
            />
            <UpdateBannerModal
                isOpen={isUpdateModalOpen}
                onClose={() => {
                    setIsUpdateModalOpen(false);
                    setSelectedBanner(null);
                }}
                onSuccess={() => {
                    fetchBanners();
                }}
                bannerData={selectedBanner}
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