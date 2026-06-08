import React, { useMemo } from 'react';
import DataTableLib from 'react-data-table-component';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import { formatCurrency } from '~/Helper/FormatCurrency';
const TRIP_REVENUE_DATA = [
    {
        id: 1,
        maChuyen: 'CDL240601',
        tenChuyen: 'Đà Lạt Ngàn Hoa 3N2Đ',
        soChuyenKhoiHanh: 12,
        tongDon: 184,
        doanhThu: 1820000000,
    },
    {
        id: 2,
        maChuyen: 'CPQ240602',
        tenChuyen: 'Phú Quốc Resort 4N3Đ',
        soChuyenKhoiHanh: 8,
        tongDon: 156,
        doanhThu: 1450000000,
    },
    {
        id: 3,
        maChuyen: 'CSP240603',
        tenChuyen: 'Sapa Fansipan 3N2Đ',
        soChuyenKhoiHanh: 6,
        tongDon: 98,
        doanhThu: 890000000,
    },
    {
        id: 4,
        maChuyen: 'CNB240604',
        tenChuyen: 'Ninh Bình Tràng An',
        soChuyenKhoiHanh: 4,
        tongDon: 74,
        doanhThu: 620000000,
    },
    {
        id: 5,
        maChuyen: 'CDN240605',
        tenChuyen: 'Đà Nẵng Hội An',
        soChuyenKhoiHanh: 9,
        tongDon: 132,
        doanhThu: 1180000000,
    },
    {
        id: 6,
        maChuyen: 'CDL240601',
        tenChuyen: 'Đà Lạt Ngàn Hoa 3N2Đ',
        soChuyenKhoiHanh: 12,
        tongDon: 184,
        doanhThu: 1820000000,
    },
    {
        id: 7,
        maChuyen: 'CPQ240602',
        tenChuyen: 'Phú Quốc Resort 4N3Đ',
        soChuyenKhoiHanh: 8,
        tongDon: 156,
        doanhThu: 1450000000,
    },
    {
        id: 8,
        maChuyen: 'CSP240603',
        tenChuyen: 'Sapa Fansipan 3N2Đ',
        soChuyenKhoiHanh: 6,
        tongDon: 98,
        doanhThu: 890000000,
    },
    {
        id: 9,
        maChuyen: 'CNB240604',
        tenChuyen: 'Ninh Bình Tràng An',
        soChuyenKhoiHanh: 4,
        tongDon: 74,
        doanhThu: 620000000,
    },
    {
        id: 10,
        maChuyen: 'CDN240605',
        tenChuyen: 'Đà Nẵng Hội An',
        soChuyenKhoiHanh: 9,
        tongDon: 132,
        doanhThu: 1180000000,
    },
];


export default function RevenueByTour() {

    const totalRevenue = useMemo(() => TRIP_REVENUE_DATA.reduce((sum, t) => sum + t.revenue, 0), []);
    const totalBookings = useMemo(() => TRIP_REVENUE_DATA.reduce((sum, t) => sum + t.bookings, 0), []);
    const handleView = (row) => {
        console.log('Xem chi tiết liên hệ:', row);
        // Thêm logic mở modal xem chi tiết
    };
    const columns = [
        {
            name: 'Mã chuyến đi',
            selector: row => row.maChuyen,
            sortable: true,
            width: '160px',
            cell: row => (
                <span className="font-semibold ">
                    {row.maChuyen}
                </span>
            )
        },

        {
            name: 'Tên chuyến đi',
            selector: row => row.tenChuyen,
            sortable: true,
            cell: row => (
                <div className="py-2">
                    <p >
                        {row.tenChuyen}
                    </p>
                </div>
            )
        },

        {
            name: 'Số chuyến đã khởi hành',
            selector: row => row.soChuyenKhoiHanh,
            sortable: true,
            center: true,
            width: '160px',
            cell: row => (
                <span className="px-3 py-1">
                    {row.soChuyenKhoiHanh}
                </span>
            )
        },

        {
            name: 'Tổng đơn',
            selector: row => row.tongDon,
            sortable: true,
            center: true,
            cell: row => (
                <span >
                    {row.tongDon}
                </span>
            )
        },

        {
            name: 'Doanh thu',
            selector: row => row.doanhThu,
            sortable: true,
            cell: row => (
                <span className="font-bold ">
                    {formatCurrency(row.doanhThu)}
                </span>
            )
        },

        {
            name: 'Thao tác',
            width: '120px',
            center: true,
            cell: (row) => (
                <RowActionsButton
                    row={row}
                    onView={handleView}
                    showEdit={false}
                    showDelete={false}
                />
            )
        }
    ];

    return (
        <div className="space-y-6 p-2">

            <ManagerToolbar
                showAddButton={false}
                showExcel={false}
            />

            <CustomDataTable
                columns={columns}
                data={TRIP_REVENUE_DATA}
                defaultSortFieldId={2} // Mặc định sort theo cột doanh thu
                defaultSortAsc={false} // Giảm dần
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