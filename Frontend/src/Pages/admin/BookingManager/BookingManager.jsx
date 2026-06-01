import React, { useState, useMemo } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';

const BOOKING_DATA = [
    {
        id: 1001,
        bookingCode: "BK-20260412-001",
        customerName: "Nguyễn Thị Lan",
        email: "lan.nguyen@gmail.com",
        phone: "0912 345 678",
        avatar: "https://i.pravatar.cc/150?u=lan",
        tourName: "Vịnh Hạ Long 3N2Đ",
        tourCode: "HL-20260415",
        bookingDate: "10/04/2026",
        departureDate: "15/04/2026",
        passengers: 3,
        totalAmount: "14.550.000đ",
        status: "Đã xác nhận",
        statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
        paymentStatus: "Đã thanh toán"
    },
    {
        id: 1002,
        bookingCode: "BK-20260412-009",
        customerName: "Trần Minh Quân",
        email: "quan.tran@yahoo.com",
        phone: "0987 654 321",
        avatar: "https://i.pravatar.cc/150?u=quan",
        tourName: "Phú Quốc Beach Resort 4N3Đ",
        tourCode: "PQ-20260520",
        bookingDate: "11/04/2026",
        departureDate: "20/05/2026",
        passengers: 2,
        totalAmount: "12.900.000đ",
        status: "Chờ xác nhận",
        statusColor: "bg-amber-100 text-amber-700 border-amber-200",
        paymentStatus: "Chưa thanh toán"
    },
    {
        id: 1003,
        bookingCode: "BK-20260409-006",
        customerName: "Lê Hoàng Nam",
        email: "nam.le@hotmail.com",
        phone: "0934 567 890",
        avatar: "https://i.pravatar.cc/150?u=nam",
        tourName: "Fansipan Sapa 2N1Đ",
        tourCode: "SP-20260418",
        bookingDate: "09/04/2026",
        departureDate: "18/04/2026",
        passengers: 1,
        totalAmount: "2.790.000đ",
        status: "Đã huỷ",
        statusColor: "bg-red-100 text-red-700 border-red-200",
        paymentStatus: "Đã hoàn tiền"
    },
    {
        id: 1004,
        bookingCode: "BK-20260412-005",
        customerName: "Phạm Thu Hà",
        email: "hapham@gmail.com",
        phone: "0978 123 456",
        avatar: "https://i.pravatar.cc/150?u=ha",
        tourName: "Đà Lạt mùa hoa 3N2Đ",
        tourCode: "DL-20260422",
        bookingDate: "12/04/2026",
        departureDate: "22/04/2026",
        passengers: 4,
        totalAmount: "11.200.000đ",
        status: "Đã xác nhận",
        statusColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
        paymentStatus: "Đã thanh toán"
    },
];

export default function BookingManager() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Lọc dữ liệu
    const filteredData = useMemo(() => {
        let data = BOOKING_DATA;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            data = data.filter(item =>
                item.customerName.toLowerCase().includes(term) ||
                item.bookingCode.toLowerCase().includes(term) ||
                item.tourName.toLowerCase().includes(term)
            );
        }

        if (statusFilter !== 'all') {
            data = data.filter(item => item.status === statusFilter);
        }

        return data;
    }, [searchTerm, statusFilter]);

    const handleEdit = (row) => {
        console.log('Edit booking:', row);
    };

    const handleView = (row) => {
        console.log('View booking:', row);
    };

    const handleDelete = (row) => {
        console.log('Delete booking:', row);
    };

    const columns = useMemo(() => [
        {
            name: 'Mã đặt tour',
            sortable: true,
            selector: row => row.bookingCode,
            cell: (row) => (
                <span className="font-mono text-sm font-medium text-slate-600">{row.bookingCode}</span>
            ),
        },
        {
            name: 'Khách hàng',
            sortable: true,
            selector: row => row.customerName,
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <img
                        src={row.avatar}
                        alt={row.customerName}
                        className="w-10 h-10 rounded-full border border-slate-200"
                    />
                    <div>
                        <p className="font-semibold text-slate-900 text-sm">{row.customerName}</p>
                        <p className="text-xs text-slate-500">{row.email}</p>
                    </div>
                </div>
            ),
        },
        {
            name: 'Tour',
            selector: row => row.tourName,
            cell: (row) => (
                <div>
                    <p className="font-medium text-slate-800">{row.tourName}</p>
                    <p className="text-xs text-slate-400">{row.tourCode}</p>
                </div>
            ),
        },
        {
            name: 'Trạng thái',
            cell: (row) => (
                <span className={`inline-block px-4 py-1.5 text-xs font-bold rounded-2xl border ${row.statusColor}`}>
                    {row.status}
                </span>
            ),
        },
        {
            name: 'Thao tác',
            width: '150px',
            cell: (row) => (
                <RowActionsButton
                    selectableRows
                    selectableRowsHighlight
                    row={row}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ),
        },
    ], []);

    return (
        <div className="space-y-6 p-4">
            {/* Toolbar chung */}
            <ManagerToolbar
                searchPlaceholder="Tìm mã đặt tour hoặc khách hàng..."
                onSearchChange={setSearchTerm}
                addButtonText="Tạo đặt tour mới"
                showCategoryFilter={false}
            />
            <CustomDataTable
                columns={columns}
                data={filteredData}
                paginationPerPage={10}
                highlightOnHover
                pointerOnHover
                noDataComponent={
                    <div className="py-12 text-center text-slate-400">
                        Không tìm thấy đặt tour nào theo bộ lọc
                    </div>
                }
            />
        </div>
    );
}