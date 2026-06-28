import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
    Calendar, RefreshCw,
    Banknote, SlidersHorizontal,
    CreditCard, ArrowRightLeft,
} from 'lucide-react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import SelectField from '~/components/UI/Form/SelectField';
import DatePicker from '~/components/UI/Form/DatePicker';
import { getPagedTourBookingAdminApi, getTourBookingDetailAdminApi } from '~/Services/TourBookingService';
import BookingDetailModal from './BookingDetailModal';
import CreateBookingAdminModal from './CreateBookingAdminModal';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import { getDate } from 'date-fns';

export const ORDER_STATUS = {
    1: { text: 'Chờ duyệt', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
    2: { text: 'Đã duyệt',  color: 'bg-blue-100 text-blue-700 border-blue-200',    dot: 'bg-blue-400' },
    3: { text: 'Hoàn tất',  color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
    4: { text: 'Đã hủy',   color: 'bg-red-100 text-red-700 border-red-200',        dot: 'bg-red-400' },
};

export const PAYMENT_STATUS = {
    0: { text: 'Chờ thanh toán', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    1: { text: 'Thành công',     color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    2: { text: 'Thất bại',       color: 'bg-red-50 text-red-700 border-red-200' },
    3: { text: 'Hoàn tiền',      color: 'bg-purple-50 text-purple-700 border-purple-200' },
};

export const PAYMENT_METHOD = {
    VNPay:        { text: 'VNPay',      color: 'bg-blue-50 text-blue-700 border-blue-200',     icon: <CreditCard size={11} /> },
    "Tiền mặt":   { text: 'Tiền mặt',  color: 'bg-slate-100 text-slate-700 border-slate-200', icon: <Banknote size={11} /> },
    "Chuyển khoản":{ text: 'Chuyển khoản', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: <ArrowRightLeft size={11} /> },
};

const STATUS_OPTIONS = [
    { id: '',  name: 'Trạng thái đơn' },
    { id: '1', name: 'Chờ duyệt' },
    { id: '2', name: 'Đã duyệt' },
    { id: '3', name: 'Hoàn tất' },
    { id: '4', name: 'Đã hủy' },
];

const PAYMENT_OPTIONS = [
    { value: '',  label: 'Trạng thái thanh toán' },
    { value: '0', label: 'Chờ thanh toán' },
    { value: '1', label: 'Thành công' },
    { value: '2', label: 'Thất bại' },
    { value: '3', label: 'Hoàn tiền' },
];

export default function BookingManager() {
    const [bookings, setBookings]     = useState([]);
    const [totalRows, setTotalRows]   = useState(0);
    const [loading, setLoading]       = useState(false);

    const [searchTerm, setSearchTerm]     = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('');
    const [dateFilter, setDateFilter]     = useState('');

    const [page, setPage]       = useState(1);
    const [perPage, setPerPage] = useState(10);

    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isDetailOpen, setIsDetailOpen]       = useState(false);
    const [detailLoading, setDetailLoading]     = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getPagedTourBookingAdminApi({
                keyword:       searchTerm  || undefined,
                bookingStatus: statusFilter  !== '' ? Number(statusFilter)  : undefined,
                paymentStatus: paymentFilter !== '' ? Number(paymentFilter) : undefined,
                bookingDate:   dateFilter   || undefined,
                page,
                size: perPage,
            });
            setBookings(res.data.items      ?? []);
            setTotalRows(res.data.totalItems ?? 0);
        } catch (err) {
            console.error('Fetch bookings error:', err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, statusFilter, paymentFilter, dateFilter, page, perPage]);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);
    useEffect(() => { setPage(1); }, [searchTerm, statusFilter, paymentFilter, dateFilter]);

    const handleViewDetail = async (row) => {
        setDetailLoading(true);
        setIsDetailOpen(true);
        try {
            const res = await getTourBookingDetailAdminApi(row.maDonDatTour);
            setSelectedBooking(res.data);
        } catch (err) {
            console.error('Detail error:', err);
            setIsDetailOpen(false);
        } finally {
            setDetailLoading(false);
        }
    };

    const hasActiveFilter = statusFilter || paymentFilter || dateFilter;

    const columns = useMemo(() => [
        {
            name: 'STT',
            width: '56px',
            center: true,
            cell: (r, index) => (
                <span className="text-xs font-semibold text-slate-400">
                    {(page - 1) * perPage + index + 1}
                </span>
            ),
        },
        {
            name: 'Mã đặt chỗ',
            minWidth: '180px',
            maxWidth: '200px',
            selector: r => r.maDatCho,
            cell: r => (
                <span className="font-mono text-[11px] font-semibold text-slate-600 break-all leading-tight">
                    {r.maDatCho}
                </span>
            ),
        },
        {
            name: 'Khách hàng',
            minWidth: '150px',
            maxWidth: '200px',
            selector: r => r.tenKhachHang,
            cell: r => (
                <div className="py-1">
                    <p className="font-semibold text-sm text-slate-700 leading-snug">{r.tenKhachHang}</p>
                    {r.soDienThoai && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{r.soDienThoai}</p>
                    )}
                </div>
            ),
        },
        {
            name: 'Mã Chuyến',
            minWidth: '150px',
            maxWidth: '200px',
            selector: r => r.maCodeChuyen,
            cell: r => (
                <span className="font-mono text-[11px] font-semibold text-slate-600 break-all leading-tight">
                    {r.maCodeChuyen}
                </span>
            ),
        },
        {
            name: 'Ngày khởi hành',
            sortable: true,
            minWidth: '150px',
            maxWidth: '130px',
            center: true,
            selector: r => r.ngayKhoiHanh,
            cell: r => (
                <span className="text-[13px] text-slate-600 tabular-nums whitespace-nowrap">
                    {new Date(r.ngayKhoiHanh).toLocaleDateString('vi-VN')}
                </span>
            ),
        },
        {
            name: 'Tổng tiền',
            sortable: true,
            minWidth: '120px',
            maxWidth: '140px',
            right: true,
            selector: r => r.tongTien,
            cell: r => (
                <span className="text-sm font-bold text-slate-800 tabular-nums pr-1 whitespace-nowrap">
                    {r.tongTien.toLocaleString('vi-VN')}
                </span>
            ),
        },
        {
            name: 'Phương thức',
            minWidth: '130px',
            maxWidth: '150px',
            center: true,
            selector: r => r.phuongThucThanhToan,
            cell: r => {
                const method = PAYMENT_METHOD[r.phuongThucThanhToan];
                if (!method) return <span className="text-[11px] text-slate-400 italic">Chưa có</span>;
                return (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${method.color}`}>
                        {method.icon}{method.text}
                    </span>
                );
            },
        },
        {
            name: 'TT Thanh toán',
            minWidth: '160px',
            maxWidth: '160px',
            center: true,
            selector: r => r.trangThaiThanhToan,
            cell: r => {
                const p = PAYMENT_STATUS[r.trangThaiThanhToan ?? 0];
                return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border whitespace-nowrap ${p.color}`}>
                        {p.text}
                    </span>
                );
            },
        },
        {
            name: 'Trạng thái đơn',
            minWidth: '140px',
            maxWidth: '150px',
            center: true,
            selector: r => r.trangThaiDon,
            cell: r => {
                const os = ORDER_STATUS[r.trangThaiDon] ?? {
                    text: '?',
                    color: 'bg-slate-100 text-slate-500 border-slate-200',
                    dot: 'bg-slate-300',
                };
                return (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border whitespace-nowrap ${os.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${os.dot}`} />
                        {os.text}
                    </span>
                );
            },
        },
        {
            name: 'Thao tác',
            width: '160px',
            center: true,
            cell: r => (
                <RowActionsButton
                    row={r}
                    onView={(row) => handleViewDetail(row)}
                    showEdit={false}
                    showDelete={false}
                    showLock={false}
                    showUnlock={false}
                    showResetPass={false}
                />
            ),
        },
    ], [page, perPage]);

    return (
        <div className="space-y-3 p-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">

                <div className="px-5 pt-5 pb-4">
                    <ManagerToolbar
                        searchPlaceholder="Tìm tên khách hàng hoặc mã đặt chỗ..."
                        onSearchChange={setSearchTerm}
                        showCategoryFilter={false}
                        showExcel={false}
                        addButtonText="Thêm đơn đặt tour"
                        onAddClick={() => setIsCreateModalOpen(true)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2 px-5 pb-4 border-t border-slate-50 pt-3">
                    <SlidersHorizontal size={13} className="text-slate-400 shrink-0" />

                    <div className="w-50">
                        <SelectField
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={STATUS_OPTIONS}
                            valueKey="id"
                            labelKey="name"
                            searchable={false}
                            placeholder="Trạng thái đơn"
                        />
                    </div>

                    <div className="w-50">
                        <SelectField
                            value={paymentFilter}
                            onChange={setPaymentFilter}
                            options={PAYMENT_OPTIONS}
                            valueKey="value"
                            labelKey="label"
                            searchable={false}
                            placeholder="Trạng thái TT"
                        />
                    </div>

                    <div className="w-100">
                        <DatePicker
                            value={dateFilter}
                            onChange={setDateFilter}
                            placeholderText="Ngày đặt..."
                            maxDate={new Date()}
                        />
                    </div>

                    {hasActiveFilter && (
                        <button
                            onClick={() => { setStatusFilter(''); setPaymentFilter(''); setDateFilter(''); }}
                            className="flex items-center gap-1 px-3 py-3 rounded-lg border border-slate-200 text-slate-400 text-xs font-bold hover:text-slate-600 hover:bg-slate-50 transition"
                        >
                            <RefreshCw size={11} />
                            Xóa lọc
                        </button>
                    )}
                </div>
            </div>


            <div>
                <CustomDataTable
                    columns={columns}
                    data={bookings}
                    progressPending={loading}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    highlightOnHover
                    pointerOnHover
                    selectableRows  
                    onChangePage={(p) => setPage(p)}
                    onChangeRowsPerPage={(newPP, p) => { setPerPage(newPP); setPage(p); }}
                    noDataComponent={
                        <div className="flex flex-col items-center py-16 text-slate-400">
                            <p className="text-sm font-medium">Không có dữ liệu</p>
                        </div>
                    }
                    paginationComponentOptions={{
                        rowsPerPageText: 'Số dòng:',
                        rangeSeparatorText: 'trên',
                        noRowsPerPage: false,
                        selectAllRowsItem: false,
                    }}
                />
            </div>


            {isDetailOpen && (
                detailLoading ? (
                    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[999] flex items-center justify-center">
                        <div className="bg-white rounded-2xl px-8 py-6 flex items-center gap-3 shadow-xl">
                            <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm text-slate-600 font-medium">Đang tải chi tiết...</span>
                        </div>
                    </div>
                ) : selectedBooking && (
                    <BookingDetailModal
                        booking={selectedBooking}
                        onClose={() => { setIsDetailOpen(false); setSelectedBooking(null); }}
                        onRefresh={fetchBookings}
                    />
                )
            )}


            {isCreateModalOpen && (
                <CreateBookingAdminModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={fetchBookings}
                />
            )}
        </div>
    );
}