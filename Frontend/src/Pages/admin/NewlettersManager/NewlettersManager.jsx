import React, { useMemo, useState, useEffect } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import { getNewslettersApi } from '~/Services/NewletterSevice';
import { toastError } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
export default function NewsletterManager() {
    const [searchTerm, setSearchTerm] = useState('');
    const [newsletters, setNewsletters] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchNewsletters = async () => {
        try {
            setLoading(true);

            const response = await getNewslettersApi(1,100
            );

            setNewsletters(response.items || []);
        } catch (error) {
            toastError('Thao tác thất bại', getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNewsletters();
    }, []);

    const filteredData = useMemo(() => {
        let data = newsletters;

        if (searchTerm.trim()) {
            data = data.filter(item =>
                item.email
                    ?.toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    )
            );
        }

        return data;
    }, [newsletters, searchTerm]);

    const handleDelete = (row) => {
        console.log('Delete newsletter:', row);
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
                data={filteredData}
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
                        <p className="text-slate-400 text-sm">
                            Không có dữ liệu
                        </p>
                    </div>
                }
            />
        </div>
    );
}