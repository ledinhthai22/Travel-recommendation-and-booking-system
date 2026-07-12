import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, RefreshCw,
    Banknote, SlidersHorizontal,
    CreditCard, ArrowRightLeft,
    Printer, Wallet
} from 'lucide-react';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import SelectField from '~/components/UI/Form/SelectField';
import DatePicker from '~/components/UI/Form/DatePicker';
import { getPagedTourBookingAdminApi, getTourBookingDetailAdminApi } from '~/Services/TourBookingService';
import BookingDetailModal from './BookingDetailModal';
import CreateBookingAdminModal from './CreateBookingAdminModal';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import { connection } from '~/Services/signalRService';
import { toastSuccess, toastError } from '~/utils/Toast';
import { printContractsByIdsApi } from '~/Services/TourBookingService';
import Checkbox from '~/components/UI/Table/Checkbox';
import { formatCurrency } from '~/Helper/FormatCurrency';

export const ORDER_STATUS = {
    1: { text: 'Chờ duyệt', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
    2: { text: 'Đã duyệt', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
    3: { text: 'Hoàn tất', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
    4: { text: 'Đã hủy', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-400' },
};

export const PAYMENT_STATUS = {
    0: { text: 'Chờ thanh toán', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    1: { text: 'Thành công', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    2: { text: 'Thất bại', color: 'bg-red-50 text-red-700 border-red-200' },
    3: { text: 'Đã hoàn tiền', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    4: { text: 'Chờ hoàn tiền', color: 'bg-orange-50 text-orange-700 border-orange-200' },
};

export const PAYMENT_METHOD = {
    VNPay: { text: 'VNPay', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: <CreditCard size={11} /> },
    "Tiền mặt": { text: 'Tiền mặt', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: <Banknote size={11} /> },
    "Chuyển khoản": { text: 'Chuyển khoản', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: <ArrowRightLeft size={11} /> },
};

const STATUS_OPTIONS = [
    { id: '', name: 'Trạng thái đơn' },
    { id: '1', name: 'Chờ duyệt' },
    { id: '2', name: 'Đã duyệt' },
    { id: '3', name: 'Hoàn tất' },
    { id: '4', name: 'Đã hủy' },
];

const PAYMENT_OPTIONS = [
    { value: '', label: 'Trạng thái thanh toán' },
    { value: '0', label: 'Chờ thanh toán' },
    { value: '1', label: 'Thành công' },
    { value: '2', label: 'Thất bại' },
    { value: '3', label: 'Đã hoàn tiền' },
    { value: '4', label: 'Chờ hoàn tiền' },
];

const canPrintContract = (row) => row.trangThaiDon === 2 && row.trangThaiThanhToan === 1;

export default function BookingManager() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [selectedMap, setSelectedMap] = useState({});
    const [printing, setPrinting] = useState(false);

    const selectedRows = useMemo(() => Object.values(selectedMap), [selectedMap]);

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getPagedTourBookingAdminApi({
                keyword: searchTerm || undefined,
                bookingStatus: statusFilter !== '' ? Number(statusFilter) : undefined,
                paymentStatus: paymentFilter !== '' ? Number(paymentFilter) : undefined,
                bookingDate: dateFilter || undefined,
                page,
                size: perPage,
            });
            setBookings(res.data.items ?? []);
            setTotalRows(res.data.totalItems ?? 0);
        } catch (err) {
            console.error('Fetch bookings error:', err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, statusFilter, paymentFilter, dateFilter, page, perPage]);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);
    useEffect(() => { setPage(1); }, [searchTerm, statusFilter, paymentFilter, dateFilter]);
    useEffect(() => {
        const startSignalR = async () => {
            try {
                if (connection.state === "Disconnected") {
                    await connection.start();
                    console.log("SignalR Connected");
                }

                connection.off("BookingCreated");

                connection.on("BookingCreated", (booking) => {

                    toastSuccess(
                        "Có đơn đặt tour mới",
                        `Mã đặt chỗ: ${booking.maDatCho} — Tổng tiền: ${booking.tongTien?.toLocaleString('vi-VN')}₫`
                    );

                    fetchBookings();
                });

            } catch (error) {
                console.error("SignalR Error:", error);
            }
        };

        startSignalR();

        return () => {
            connection.off("BookingCreated");
        };
    }, [fetchBookings]);

    // Bật/tắt chọn 1 dòng — cộng dồn đúng qua mọi trang vì state này độc lập với trang hiện tại.
    const toggleRow = useCallback((row) => {
        if (!canPrintContract(row)) return;
        setSelectedMap(prev => {
            const next = { ...prev };
            if (next[row.maDonDatTour]) {
                delete next[row.maDonDatTour];
            } else {
                next[row.maDonDatTour] = row;
            }
            return next;
        });
    }, []);

    // Chọn/bỏ chọn tất cả các dòng HỢP LỆ trong trang hiện tại.
    const selectablePageRows = useMemo(() => bookings.filter(canPrintContract), [bookings]);
    const isAllOnPageSelected =
        selectablePageRows.length > 0 &&
        selectablePageRows.every(row => !!selectedMap[row.maDonDatTour]);

    const toggleSelectAllOnPage = useCallback(() => {
        setSelectedMap(prev => {
            const next = { ...prev };
            const allSelected = selectablePageRows.every(row => !!next[row.maDonDatTour]);
            selectablePageRows.forEach(row => {
                if (allSelected) {
                    delete next[row.maDonDatTour];
                } else {
                    next[row.maDonDatTour] = row;
                }
            });
            return next;
        });
    }, [selectablePageRows]);

    const clearAllSelections = () => {
        setSelectedMap({});
    };

    // Tải file về máy với đúng tên file.
    // Chỉ mở thêm tab preview khi file là PDF — trình duyệt không xem trước được .zip,
    // nên với zip chỉ cần tải về là đủ.
    const downloadFileBlob = (blob, fileName) => {
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        if (blob.type === 'application/pdf') {
            window.open(url, '_blank');
        }

        // Dọn dẹp object URL sau khi dùng xong
        setTimeout(() => URL.revokeObjectURL(url), 60000);
    };

    // Đọc tên file thật từ header Content-Disposition mà backend trả về.
    // Backend phải có Access-Control-Expose-Headers: Content-Disposition
    // (xem AdminTourBookingsController.PrintContractsByIds) thì JS mới đọc được.
    const extractFileName = (response, fallback) => {
        const disposition = response.headers?.['content-disposition'];
        if (disposition) {
            const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
            if (match?.[1]) {
                try {
                    return decodeURIComponent(match[1]);
                } catch {
                    return match[1];
                }
            }
        }
        return fallback;
    };

    const handlePrintContract = async () => {
        if (selectedRows.length === 0) {
            toastError('Vui lòng chọn ít nhất 1 đơn để in hợp đồng');
            return;
        }
        try {
            setPrinting(true);
            const ids = selectedRows.map(r => r.maDonDatTour);
            const res = await printContractsByIdsApi(ids);

            // Backend trả PDF nếu các đơn cùng 1 chuyến, hoặc ZIP nếu gộp từ nhiều chuyến khác nhau
            const contentType = res.headers?.['content-type'] || 'application/pdf';
            const fallbackExt = contentType.includes('zip') ? 'zip' : 'pdf';
            const fileName = extractFileName(res, `HopDong-${Date.now()}.${fallbackExt}`);

            downloadFileBlob(new Blob([res.data], { type: contentType }), fileName);
            clearAllSelections();
        } catch (err) {
            console.error(err);
            if (err.response?.data instanceof Blob) {
                const text = await err.response.data.text();
                toastError(text || 'In hợp đồng thất bại');
            } else {
                toastError('In hợp đồng thất bại');
            }
        } finally {
            setPrinting(false);
        }
    };

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
            name: (
                <Checkbox
                    checked={isAllOnPageSelected}
                    onChange={toggleSelectAllOnPage}
                    disabled={selectablePageRows.length === 0}
                    title="Chọn tất cả đơn hợp lệ trong trang này"
                />
            ),
            width: '48px',
            center: true,
            cell: (r) => {
                const allowed = canPrintContract(r);
                return (
                    <Checkbox
                        checked={!!selectedMap[r.maDonDatTour]}
                        disabled={!allowed}
                        onChange={() => toggleRow(r)}
                        title={allowed ? '' : 'Chỉ chọn được đơn đã duyệt và đã thanh toán thành công'}
                    />
                );
            },
        },
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
            name: 'Khách hàng',
            minWidth: '150px',
            maxWidth: '200px',
            selector: r => r.tenKhachHang,
            cell: r => (
                <div className="py-1">
                    <p className="font-semibold text-sm text-slate-700 leading-snug">{r.tenKhachHang}</p>
                </div>
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
                    {formatCurrency(r.tongTien)}
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
                const p = PAYMENT_STATUS[r.trangThaiThanhToan] ?? {
                    text: 'Không xác định',
                    color: 'bg-slate-100 text-slate-500 border-slate-200',
                };
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
    ], [page, perPage, selectedMap, isAllOnPageSelected, selectablePageRows, toggleRow, toggleSelectAllOnPage]);

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
                        showExtraButton={true}
                        extraButtonText="Xử lý đơn hoàn tiền"
                        extraButtonIcon={Wallet}
                        onExtraClick={() => navigate('/Quan-ly/Xu-Ly-Hoan-Tien')}
                    />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 px-5 pb-4 border-t border-slate-50 pt-3 w-full">

                    <div className="flex flex-wrap items-center gap-2">
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

                    {selectedRows.length > 0 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={clearAllSelections}
                                className="text-xs font-semibold text-slate-400 hover:text-slate-600 border border-slate-400 py-[12px] rounded-2xl px-4"
                            >
                                Bỏ chọn tất cả
                            </button>
                            <button
                                onClick={handlePrintContract}
                                disabled={printing}
                                className="
                                    flex items-center gap-2
                                    px-4 py-2.5
                                    border border-emerald-500
                                    text-emerald-500
                                    bg-white
                                    rounded-xl
                                    font-semibold
                                    hover:bg-emerald-50
                                    transition
                                    disabled:opacity-50
                                "
                            >
                                {printing ? (
                                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Printer size={18} />
                                )}
                                In hợp đồng ({selectedRows.length})
                            </button>
                        </div>
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