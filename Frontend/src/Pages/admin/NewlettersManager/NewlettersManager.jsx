import React, { useMemo, useState, useEffect } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import { getNewslettersApi,SoftDetailNewsletterApi } from '~/Services/NewletterSevice';
import { toastError,toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';
export default function NewsletterManager() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage,setCurrentPage] = useState(1);
    const [perPage,setPerPage] = useState(10);
    const [newsletters, setNewsletters] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({
      title: '',
      message: '',
      type: 'danger',
      confirmText: 'Xác nhận',
      action: null
  });

    //gọi api lấy dữ liệu
    const fetchNewsletters = async () => {
        try {

            setLoading(true);
            const response = await getNewslettersApi(searchTerm,currentPage,perPage);
            setNewsletters(response.items || []);
            setTotalRows(response.totalItems || 0);
        } catch (error) {
            toastError('Thao tác thất bại', getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    // lắng nghe sự thay đổi của dữ liệu
    useEffect(() => {
        fetchNewsletters();
    }, [searchTerm,currentPage,perPage]);

    const handleConfirm = async () => {
        try {
            await confirmConfig.action?.();
        } catch (error) {
            toastError("Thao tác thất bại", getErrorMessage(error));
        } finally {
            setConfirmOpen(false);
        }
    };
    // Nút Xóa mở Confirm Modal
    const handleDelete = (row) => {
        setConfirmConfig({
            title: "Xóa Email Đăng Ký",
            message: `Bạn có chắc chắn muốn xóa email "${row.email}" không?`,
            type: "danger",
            confirmText: "Xóa",
            action: async () => {
                setLoading(true);
                await SoftDetailNewsletterApi(row.maNewsletter); 
                
                toastSuccess("Xóa email thành công!");
                fetchNewsletters(); 
            }
        });
        setConfirmOpen(true);
    };

    const columns = useMemo(() => [
        {
            name: 'Email đăng ký',
            sortable: true,
            selector: row => row.email,
            cell: row => (
                <div>
                    <p className="font-medium text-slate-800">
                        {row.email}
                    </p>
                </div>
            )
        },

        {
            name: 'Ngày đăng ký',
            sortable: true,
            selector: row => row.ngayGui,
            cell: row => {
                const date = new Date(
                    row.ngayGui
                );

                return (
                    <div>
                        <p className="text-sm text-slate-700">
                            {date.toLocaleDateString(
                                'vi-VN'
                            )}
                        </p>
                        <p className="text-xs text-slate-400">
                            {date.toLocaleTimeString(
                                'vi-VN',
                                {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }
                            )}
                        </p>
                    </div>
                );
            }
        },

        {
            name: 'Thao tác',
            width: '140px',
            cell: row => (
                <RowActionsButton
                    row={row}
                    onDelete={handleDelete}
                />
            )
        }
    ], []);

    return (
        <div className="space-y-6 p-4">
            <ManagerToolbar
                searchPlaceholder="Tìm kiếm email..."
                onSearchChange={setSearchTerm}
                showAddButton={false}
                showCategoryFilter={false}
                showImportExcel={false}
            />

            <CustomDataTable
                columns={columns}
                data={newsletters}
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
                        <p className="text-slate-400 text-sm">
                            Không có dữ liệu
                        </p>
                    </div>
                }
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