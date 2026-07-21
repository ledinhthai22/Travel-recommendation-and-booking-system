import React, { useState, useEffect, useCallback } from 'react';
import { Wallet, User, Phone, MessageSquareText, ArrowLeft, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import { getPendingRefundsApi, confirmRefundApi } from '~/Services/refundService';
import { toastSuccess, toastError } from '~/utils/Toast';
import { formatCurrency } from '~/Helper/FormatCurrency';
import RefundDetailModal from './RefundDetailModal';

// Trạng thái đơn mới (chỉ 6 trạng thái)
const ORDER_STATUS = {
    1: { text: 'Chờ thanh toán', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    2: { text: 'Chờ duyệt', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    3: { text: 'Đã duyệt', color: 'bg-sky-50 text-sky-700 border-sky-200' },
    4: { text: 'Đang diễn ra', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    5: { text: 'Hoàn tất', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    6: { text: 'Đã hủy', color: 'bg-red-50 text-red-700 border-red-200' },
};

// Trạng thái tài chính mới
const FINANCIAL_STATUS = {
    0: { text: 'Chưa thanh toán', color: 'bg-slate-100 text-slate-600 border-slate-200' },
    1: { text: 'Đã đặt cọc', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    2: { text: 'Đã thanh toán đủ', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    3: { text: 'Đang hoàn tiền', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    4: { text: 'Đã hoàn tiền', color: 'bg-green-50 text-green-700 border-green-200' },
    5: { text: 'Mất cọc', color: 'bg-red-50 text-red-700 border-red-200' },
};

// Helper lấy màu badge theo mã trạng thái
const getOrderStatusColor = (status) => {
    return ORDER_STATUS[status]?.color || 'bg-slate-100 text-slate-500 border-slate-200';
};

const getFinancialStatusColor = (status) => {
    return FINANCIAL_STATUS[status]?.color || 'bg-slate-100 text-slate-500 border-slate-200';
};

export default function RefundManager() {
    const navigate = useNavigate();
    const [refunds, setRefunds] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const [selectedRefund, setSelectedRefund] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const fetchRefunds = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getPendingRefundsApi(page, perPage);
            const body = res?.data ?? res ?? {};
            const items = Array.isArray(body.data) ? body.data : (Array.isArray(body) ? body : []);
            setRefunds(items);
            setTotalRows(body.totalItems ?? items.length ?? 0);
        } catch (err) {
            console.error('Fetch pending refunds error:', err);
            toastError('Không thể tải danh sách chờ hoàn tiền');
            setRefunds([]);
            setTotalRows(0);
        } finally {
            setLoading(false);
        }
    }, [page, perPage]);

    useEffect(() => { fetchRefunds(); }, [fetchRefunds]);
    useEffect(() => { setPage(1); }, [searchTerm]);

    const refundList = Array.isArray(refunds) ? refunds : [];

    const filteredRefunds = searchTerm
        ? refundList.filter(r =>
            r.maDatCho?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.hoTenKhachHang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.tenTour?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : refundList;

    const handleViewDetail = (row) => {
        setSelectedRefund(row);
        setIsDetailOpen(true);
    };

    const handleConfirmRefund = async (maThanhToan) => {
        setConfirming(true);
        try {
            await confirmRefundApi(maThanhToan);
            toastSuccess('Xác nhận hoàn tiền thành công');
            setIsDetailOpen(false);
            setSelectedRefund(null);
            fetchRefunds();
        } catch (err) {
            console.error('Confirm refund error:', err);
            toastError(err.response?.data?.message || 'Xác nhận hoàn tiền thất bại');
        } finally {
            setConfirming(false);
        }
    };

    // Badge component cho trạng thái
    const StatusBadge = ({ status, label, type }) => {
        let color;
        if (type === 'order') {
            color = getOrderStatusColor(status);
        } else if (type === 'financial') {
            color = getFinancialStatusColor(status);
        } else {
            return null;
        }
        return (
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${color}`}>
                {label || 'Không xác định'}
            </span>
        );
    };

    const columns = [
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
            minWidth: '160px',
            maxWidth: '200px',
            selector: r => r.maDatCho,
            cell: r => (
                <span className="font-mono text-[11px] font-semibold text-slate-600 break-all leading-tight">
                    {r.maDatCho}
                </span>
            ),
        },
        {
            name: 'Tour',
            minWidth: '180px',
            selector: r => r.tenTour,
            cell: r => (
                <div>
                    <span className="font-semibold text-sm text-slate-700 leading-snug">{r.tenTour}</span>
                    <div className="mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <StatusBadge status={r.trangThaiDon} label={r.tenTrangThaiDon} type="order" />
                        <StatusBadge status={r.trangThaiTaiChinh} label={r.tenTrangThaiTaiChinh} type="financial" />
                    </div>
                </div>
            ),
        },
        {
            name: 'Khách hàng',
            minWidth: '150px',
            maxWidth: '200px',
            selector: r => r.hoTenKhachHang,
            cell: r => (
                <div className="py-1">
                    <p className="font-semibold text-sm text-slate-700 leading-snug">{r.hoTenKhachHang}</p>
                    <p className="text-[11px] text-slate-400">{r.soDienThoai || 'Chưa cập nhật'}</p>
                    {r.email && <p className="text-[10px] text-slate-400 truncate">{r.email}</p>}
                </div>
            ),
        },
        {
            name: 'Ngày khởi hành',
            minWidth: '130px',
            center: true,
            selector: r => r.ngayKhoiHanh,
            cell: r => (
                <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-400" />
                    <span className="text-[13px] text-slate-600 tabular-nums whitespace-nowrap">
                        {r.ngayKhoiHanh ? new Date(r.ngayKhoiHanh).toLocaleDateString('vi-VN') : '—'}
                    </span>
                </div>
            ),
        },
        {
            name: 'Phương thức TT',
            minWidth: '120px',
            center: true,
            selector: r => r.phuongThucThanhToan,
            cell: r => (
                <span className="text-[12px] text-slate-600">
                    {r.phuongThucThanhToan || 'Không xác định'}
                </span>
            ),
        },
        {
            name: 'Đã thanh toán',
            minWidth: '130px',
            right: true,
            selector: r => r.tongTienThanhToan,
            cell: r => (
                <span className="text-sm text-slate-500 tabular-nums whitespace-nowrap">
                    {formatCurrency(r.tongTienThanhToan)}
                </span>
            ),
        },
        {
            name: 'Cần hoàn',
            minWidth: '130px',
            right: true,
            selector: r => r.soTienHoan,
            cell: r => (
                <span className="text-sm font-bold text-amber-600 tabular-nums whitespace-nowrap">
                    {formatCurrency(r.soTienHoan)}
                </span>
            ),
        },
        {
            name: 'Ngày thanh toán',
            minWidth: '140px',
            center: true,
            selector: r => r.ngayThanhToan,
            cell: r => (
                <span className="text-[13px] text-slate-600 tabular-nums whitespace-nowrap">
                    {r.ngayThanhToan ? new Date(r.ngayThanhToan).toLocaleDateString('vi-VN') : '—'}
                </span>
            ),
        },
        {
            name: 'Thao tác',
            width: '120px',
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
    ];

    // Thống kê số lượng
    const totalRefunds = filteredRefunds.length;
    const totalAmount = filteredRefunds.reduce((sum, r) => sum + (r.soTienHoan || 0), 0);

    return (
        <div className="space-y-3 p-4">
            {/* Header với nút quay lại và thống kê */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                    onClick={() => navigate('/Quan-ly/Don-dat-cac-chuyen-di')}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors border border-slate-200 shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại đơn đặt chuyến đi
                </button>

                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <Wallet size={16} className="text-amber-500" />
                        <span className="text-slate-500">Tổng số:</span>
                        <span className="font-bold text-slate-700">{totalRefunds} yêu cầu</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <CreditCard size={16} className="text-amber-500" />
                        <span className="text-slate-500">Tổng tiền hoàn:</span>
                        <span className="font-bold text-amber-600">{formatCurrency(totalAmount)}</span>
                    </div>
                </div>
            </div>

            <div>
                <ManagerToolbar
                    searchPlaceholder="Tìm mã đặt chỗ, tên khách hàng hoặc tên tour..."
                    onSearchChange={setSearchTerm}
                    showAddButton={false}
                    showExcel={false}
                />
            </div>

            <div>
                <CustomDataTable
                    columns={columns}
                    data={filteredRefunds}
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
                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                                <Wallet size={28} className="text-slate-300" />
                            </div>
                            <p className="text-sm font-medium text-slate-500">Không có yêu cầu hoàn tiền nào đang chờ xử lý</p>
                            <p className="text-xs text-slate-400 mt-1">Tất cả các yêu cầu hoàn tiền đã được xử lý</p>
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

            <RefundDetailModal
                isOpen={isDetailOpen}
                onClose={() => { setIsDetailOpen(false); setSelectedRefund(null); }}
                refund={selectedRefund}
                onConfirm={handleConfirmRefund}
                isLoading={confirming}
            />
        </div>
    );
}