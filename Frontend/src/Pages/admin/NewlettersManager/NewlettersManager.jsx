import React, { useMemo, useState } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';

const NEWSLETTER_DATA = [
    {
        maNewsletter: 1,
        email: 'nguyenvanan@gmail.com',
        ngayGui: '2026-04-14 09:45:00'
    },
    {
        maNewsletter: 2,
        email: 'tranthimai@yahoo.com',
        ngayGui: '2026-04-13 14:20:00'
    },
    {
        maNewsletter: 3,
        email: 'lehoangnam@hotmail.com',
        ngayGui: '2026-04-12 16:10:00'
    },
    {
        maNewsletter: 4,
        email: 'phamthuha@gmail.com',
        ngayGui: '2026-04-11 11:30:00'
    },
    {
        maNewsletter: 5,
        email: 'support@company.vn',
        ngayGui: '2026-04-10 08:15:00'
    }
];
export default function NewsletterManager() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return NEWSLETTER_DATA;

        return NEWSLETTER_DATA.filter(item =>
            item.email
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const handleView = (row) => {
        console.log('View newsletter:', row);
    };

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
                const date = new Date(row.ngayGui);

                return (
                    <div>
                        <p className="text-sm text-slate-700">
                            {date.toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-xs text-slate-400">
                            {date.toLocaleTimeString('vi-VN')}
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
                    onView={handleView}
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
                showImportExcel = {false}
            />

            <CustomDataTable
                columns={columns}
                data={filteredData}
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