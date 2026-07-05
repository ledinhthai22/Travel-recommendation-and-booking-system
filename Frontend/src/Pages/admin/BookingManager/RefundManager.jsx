import React, { useState, useEffect, useCallback } from 'react';
// Thêm icon ArrowLeft từ lucide-react
import { Wallet, User, Phone, MessageSquareText, ArrowLeft } from 'lucide-react'; 
// Import useNavigate từ react-router-dom
import { useNavigate } from 'react-router-dom'; 
import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import { getPendingRefundsApi, confirmRefundApi } from '~/Services/UserProfile';
import { toastSuccess, toastError } from '~/utils/Toast';
import { formatCurrency } from '~/Helper/FormatCurrency';
import RefundDetailModal from './RefundDetailModal';

export default function RefundManager() {
    const navigate = useNavigate(); // Khởi tạo hook điều hướng
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
            setRefunds(res.items ?? []);
            setTotalRows(res.totalItems ?? 0);
        } catch (err) {
            console.error('Fetch pending refunds error:', err);
            toastError('Không thể tải danh sách chờ hoàn tiền');
        } finally {
            setLoading(false);
        }
    }, [page, perPage]);

    useEffect(() => { fetchRefunds(); }, [fetchRefunds]);
    useEffect(() => { setPage(1); }, [searchTerm]);

    const filteredRefunds = searchTerm
        ? refunds.filter(r =>
            r.maDatCho?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.hoTenKhachHang?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : refunds;

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
                <span className="font-semibold text-sm text-slate-700 leading-snug">{r.tenTour}</span>
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
                </div>
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
                    {new Date(r.ngayThanhToan).toLocaleDateString('vi-VN')}
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

    return (
        <div className="space-y-3 p-4">
            {/* Thẻ div rỗng ban đầu đã được thêm nút quay lại */}
            <div>
                <button
                    onClick={() => navigate('/Quan-ly/Don-dat-cac-chuyen-di')}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors border border-slate-200 shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại đơn đặt chuyến đi
                </button>
            </div>
            
            <div>
                <ManagerToolbar
                    searchPlaceholder="Tìm mã đặt chỗ hoặc tên khách hàng..."
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
                            <p className="text-sm font-medium">Không có yêu cầu hoàn tiền nào đang chờ xử lý</p>
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