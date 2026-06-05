import React, { useMemo, useState } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
const ACTIVITY_LOG_DATA = [
    {
        maLog: 1001,
        tenNguoiDung: 'Nguyễn Văn An',
        hanhDong: 'Thêm',
        bangTacDong: 'Tour',
        maDoiTuong: 15,
        moTa: 'Tạo mới tour Hạ Long 3N2Đ',
        diaChiIP: '192.168.1.10',
        trinhDuyet: 'Chrome 138',
        ngayTao: '2026-06-05 10:20:15'
    },
    {
        maLog: 1002,
        tenNguoiDung: 'Trần Minh Quân',
        hanhDong: 'Cập nhật',
        bangTacDong: 'Khách sạn',
        maDoiTuong: 8,
        moTa: 'Cập nhật số sao khách sạn',
        diaChiIP: '192.168.1.11',
        trinhDuyet: 'Edge 138',
        ngayTao: '2026-06-05 11:45:30'
    },
    {
        maLog: 1003,
        tenNguoiDung: 'Lê Hoàng Nam',
        hanhDong: 'Xóa',
        bangTacDong: 'Địa điểm',
        maDoiTuong: 3,
        moTa: 'Xóa địa điểm Hội An',
        diaChiIP: '192.168.1.15',
        trinhDuyet: 'Chrome 138',
        ngayTao: '2026-06-05 14:10:20'
    }
];
export default function ActivityLogManager() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return ACTIVITY_LOG_DATA;

        const keyword = searchTerm.toLowerCase();

        return ACTIVITY_LOG_DATA.filter(item =>
            item.tenNguoiDung.toLowerCase().includes(keyword) ||
            item.hanhDong.toLowerCase().includes(keyword) ||
            item.bangTacDong.toLowerCase().includes(keyword) ||
            item.moTa.toLowerCase().includes(keyword)
        );
    }, [searchTerm]);

    const handleView = (row) => {
        console.log('View log:', row);
    };

    const columns = useMemo(() => [
        {
            name: 'Người thực hiện',
            sortable: true,
            selector: row => row.tenNguoiDung,
            cell: row => (
                <p className="font-medium text-slate-800">
                    {row.tenNguoiDung}
                </p>
            )
        },

        {
            name: 'Hành động',
            sortable: true,
            selector: row => row.hanhDong,
            cell: row => {
                const colorMap = {
                    'Thêm': 'bg-emerald-100 text-emerald-700',
                    'Cập nhật': 'bg-amber-100 text-amber-700',
                    'Xóa': 'bg-red-100 text-red-700',
                    'Đăng nhập': 'bg-blue-100 text-blue-700'
                };

                return (
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${colorMap[row.hanhDong] ||
                            'bg-slate-100 text-slate-700'
                            }`}
                    >
                        {row.hanhDong}
                    </span>
                );
            }
        },

        {
            name: 'Module',
            sortable: true,
            selector: row => row.bangTacDong,
            cell: row => (
                <span className="font-medium text-slate-700">
                    {row.bangTacDong}
                </span>
            )
        },

        {
            name: 'Mô tả',
            grow: 2,
            selector: row => row.moTa,
            cell: row => (
                <p className="text-slate-700 line-clamp-2">
                    {row.moTa}
                </p>
            )
        },

        {
            name: 'IP',
            selector: row => row.diaChiIP,
            cell: row => (
                <span className="font-mono text-xs">
                    {row.diaChiIP}
                </span>
            )
        },

        {
            name: 'Thời gian',
            sortable: true,
            selector: row => row.ngayTao,
            cell: row => {
                const date = new Date(row.ngayTao);

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
                    showEdit={false}
                    showDelete={false}
                />
            )
        }
    ], []);

    return (
        <div className="space-y-6 p-4">
            <ManagerToolbar
                searchPlaceholder="Tìm người dùng, hành động, module..."
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