import React, { useState, useMemo } from 'react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';

const BOOKING_DATA = [
    {
        maDonDatTour: 1001,
        maNguoiDung: 201,
        maChuyen: 301,
        maKhachSan: 101,
        maUuDai: 1,

        soNguoiLon: 2,
        soTreEm: 1,
        soEmBe: 0,

        ngayDat: "2026-04-10T09:30:00",
        tongTien: 14550000,

        trangThaiThanhToan: true,
        trangThaiDon: 2,

        ngayCapNhat: "2026-04-10T10:00:00",

        // Thông tin hiển thị
        tenKhachHang: "Nguyễn Thị Lan",
        email: "lan.nguyen@gmail.com",
        soDienThoai: "0912345678",
        avatar: "https://i.pravatar.cc/150?u=lan",

        // Tour
        tour: {
            maTour: 1,
            tenTour: "Vịnh Hạ Long 3N2Đ",
            thoiGianTour: "3 Ngày 2 Đêm",
            diemKhoiHanh: "Hà Nội",
            trangThai: true
        },

        // Chuyến khởi hành
        chuyen: {
            maChuyen: 301,
            maChuyenCode: "HL-20260415",
            tenChuyen: "Hạ Long tháng 4",
            diemDen: "Quảng Ninh",
            ngayKhoiHanh: "2026-04-15",
            ngayKetThuc: "2026-04-17",
            soLuongCho: 40
        }
    },

    {
        maDonDatTour: 1002,
        maNguoiDung: 202,
        maChuyen: 302,
        maKhachSan: null,
        maUuDai: null,

        soNguoiLon: 2,
        soTreEm: 0,
        soEmBe: 0,

        ngayDat: "2026-04-11T13:00:00",
        tongTien: 12900000,

        trangThaiThanhToan: false,
        trangThaiDon: 1,

        ngayCapNhat: "2026-04-11T13:00:00",

        tenKhachHang: "Trần Minh Quân",
        email: "quan.tran@yahoo.com",
        soDienThoai: "0987654321",
        avatar: "https://i.pravatar.cc/150?u=quan",

        tour: {
            maTour: 2,
            tenTour: "Phú Quốc Beach Resort 4N3Đ",
            thoiGianTour: "4 Ngày 3 Đêm",
            diemKhoiHanh: "TP.HCM",
            trangThai: true
        },

        chuyen: {
            maChuyen: 302,
            maChuyenCode: "PQ-20260520",
            tenChuyen: "Phú Quốc mùa hè",
            diemDen: "Kiên Giang",
            ngayKhoiHanh: "2026-05-20",
            ngayKetThuc: "2026-05-23",
            soLuongCho: 30
        }
    },

    {
        maDonDatTour: 1003,
        maNguoiDung: 203,
        maChuyen: 303,
        maKhachSan: null,
        maUuDai: 2,

        soNguoiLon: 1,
        soTreEm: 0,
        soEmBe: 0,

        ngayDat: "2026-04-09T08:15:00",
        tongTien: 2790000,

        trangThaiThanhToan: true,
        trangThaiDon: 4,

        ngayCapNhat: "2026-04-12T09:00:00",

        tenKhachHang: "Lê Hoàng Nam",
        email: "nam.le@hotmail.com",
        soDienThoai: "0934567890",
        avatar: "https://i.pravatar.cc/150?u=nam",

        tour: {
            maTour: 3,
            tenTour: "Fansipan Sapa 2N1Đ",
            thoiGianTour: "2 Ngày 1 Đêm",
            diemKhoiHanh: "Hà Nội",
            trangThai: true
        },

        chuyen: {
            maChuyen: 303,
            maChuyenCode: "SP-20260418",
            tenChuyen: "Fansipan cuối tuần",
            diemDen: "Lào Cai",
            ngayKhoiHanh: "2026-04-18",
            ngayKetThuc: "2026-04-19",
            soLuongCho: 25
        }
    },

    {
        maDonDatTour: 1004,
        maNguoiDung: 204,
        maChuyen: 304,
        maKhachSan: 102,
        maUuDai: null,

        soNguoiLon: 2,
        soTreEm: 2,
        soEmBe: 0,

        ngayDat: "2026-04-12T15:00:00",
        tongTien: 11200000,

        trangThaiThanhToan: true,
        trangThaiDon: 3,

        ngayCapNhat: "2026-04-25T18:00:00",

        tenKhachHang: "Phạm Thu Hà",
        email: "hapham@gmail.com",
        soDienThoai: "0978123456",
        avatar: "https://i.pravatar.cc/150?u=ha",

        tour: {
            maTour: 4,
            tenTour: "Đà Lạt mùa hoa 3N2Đ",
            thoiGianTour: "3 Ngày 2 Đêm",
            diemKhoiHanh: "TP.HCM",
            trangThai: true
        },

        chuyen: {
            maChuyen: 304,
            maChuyenCode: "DL-20260422",
            tenChuyen: "Đà Lạt tháng 4",
            diemDen: "Lâm Đồng",
            ngayKhoiHanh: "2026-04-22",
            ngayKetThuc: "2026-04-24",
            soLuongCho: 35
        }
    }
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
                item.tenKhachHang.toLowerCase().includes(term) ||
                item.maDonDatTour.toString().includes(term) ||
                item.tour.tenTour.toLowerCase().includes(term)
            );
        }

        if (statusFilter !== 'all') {
            data = data.filter(
                item => item.trangThaiDon === Number(statusFilter)
            );
        }

        return data;
    }, [searchTerm, statusFilter]);
    const getOrderStatus = (status) => {
        switch (status) {
            case 1:
                return {
                    text: 'Chờ xác nhận',
                    color: 'bg-amber-100 text-amber-700 border-amber-200'
                };
            case 2:
                return {
                    text: 'Đã duyệt',
                    color: 'bg-blue-100 text-blue-700 border-blue-200'
                };
            case 3:
                return {
                    text: 'Hoàn tất',
                    color: 'bg-emerald-100 text-emerald-700 border-emerald-200'
                };
            case 4:
                return {
                    text: 'Đã hủy',
                    color: 'bg-red-100 text-red-700 border-red-200'
                };
            default:
                return {
                    text: 'Không xác định',
                    color: 'bg-slate-100 text-slate-700 border-slate-200'
                };
        }
    };
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
            name: 'Mã đơn',
            sortable: true,
            selector: row => row.maDonDatTour,
            cell: row => (
                <span className="font-mono font-semibold text-slate-700">
                    {row.maDonDatTour}
                </span>
            )
        },

        {
            name: 'Khách hàng',
            sortable: true,
            selector: row => row.tenKhachHang,
            cell: row => (
                <div className="flex items-center gap-3">
                    <img
                        src={row.avatar}
                        alt={row.tenKhachHang}
                        className="w-10 h-10 rounded-full border"
                    />

                    <div>
                        <p className="font-semibold text-sm">
                            {row.tenKhachHang}
                        </p>

                        <p className="text-xs text-slate-500">
                            {row.email}
                        </p>
                    </div>
                </div>
            )
        },

        {
            name: 'Tour',
            sortable: true,
            selector: row => row.tour.tenTour,
            cell: row => (
                <div>
                    <p className="font-medium">
                        {row.tour.tenTour}
                    </p>

                    <p className="text-xs text-slate-400">
                        {row.chuyen.maChuyenCode}
                    </p>
                </div>
            )
        },

        {
            name: 'Khởi hành',
            sortable: true,
            selector: row => row.chuyen.ngayKhoiHanh,
            cell: row => (
                <div>
                    <p className="font-medium">
                        {row.chuyen.ngayKhoiHanh}
                    </p>

                    <p className="text-xs text-slate-400">
                        {row.tour.diemKhoiHanh}
                    </p>
                </div>
            )
        },

        {
            name: 'Số khách',
            center: true,
            cell: row => (
                row.soNguoiLon +
                row.soTreEm +
                row.soEmBe
            )
        },

        {
            name: 'Tổng tiền',
            sortable: true,
            selector: row => row.tongTien,
            cell: row => (
                <span className="font-semibold ">
                    {row.tongTien.toLocaleString('vi-VN')}đ
                </span>
            )
        },

        {
            name: 'Thanh toán',
            center: true,
            cell: row => (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-bold
                ${row.trangThaiThanhToan
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                >
                    {row.trangThaiThanhToan
                        ? 'Đã thanh toán'
                        : 'Chưa thanh toán'}
                </span>
            )
        },

        {
            name: 'Trạng thái',
            center: true,
            cell: row => {
                const status = getOrderStatus(row.trangThaiDon);

                return (
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}
                    >
                        {status.text}
                    </span>
                );
            }
        },

        {
            name: 'Thao tác',
            width: '150px',
            cell: row => (
                <RowActionsButton
                    row={row}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )
        }
    ], []);

    return (
        <div className="space-y-6 p-4">
            {/* Toolbar chung */}
            <ManagerToolbar
                searchPlaceholder="Tìm mã đặt tour hoặc khách hàng..."
                onSearchChange={setSearchTerm}
                addButtonText="Tạo đặt tour mới"
                showCategoryFilter={false}
                showImportExcel = {false}
            />
            <CustomDataTable
                columns={columns}
                data={filteredData}
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