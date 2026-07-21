import { useState, useCallback, useMemo, useEffect } from 'react';
import { X, Edit3, Check, User, Wallet, AlertTriangle, History, Calendar, Clock } from 'lucide-react';
import InputField from '~/components/UI/Form/InputField';
import SelectField from '~/components/UI/Form/SelectField';
import DatePicker from '~/components/UI/Form/DatePicker';
import {
    approveBookingAdminApi,
    cancelBookingAdminApi,
    completeBookingAdminApi,
    updatePassengerAdminApi,
} from '~/Services/TourBookingService';
import {
    updatePaymentStatusApi,
    refundDepositApi,
} from '~/Services/refundService';
import useAuth from '~/Hooks/useAuth';
import { toastSuccess, toastError } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';
import CancelReasonModal from '../UserProfileManager/CancelReasonModal';

const ORDER_STATUS = {
    1: { text: 'Chờ thanh toán', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    2: { text: 'Chờ duyệt', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    3: { text: 'Đã duyệt', color: 'bg-sky-50 text-sky-700 border-sky-200' },
    4: { text: 'Đang diễn ra', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    5: { text: 'Hoàn tất', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    6: { text: 'Đã hủy', color: 'bg-red-50 text-red-700 border-red-200' },
};

const PAYMENT_METHODS = {
    1: { text: 'VNPay' },
    2: { text: 'Tiền Mặt' },
    3: { text: 'Chuyển Khoản' },
};

const PAYMENT_STATUS = {
    0: { text: 'Chờ xử lý', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    1: { text: 'Thành công', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    2: { text: 'Thất bại', color: 'bg-red-50 text-red-700 border-red-200' },
    3: { text: 'Đã hủy', color: 'bg-gray-50 text-gray-700 border-gray-200' },
};

const FINANCIAL_STATUS = {
    0: { text: 'Chưa thanh toán', color: 'bg-slate-100 text-slate-600 border-slate-200' },
    1: { text: 'Đã đặt cọc', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    2: { text: 'Đã thanh toán đủ', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    3: { text: 'Đang hoàn tiền', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    4: { text: 'Đã hoàn tiền', color: 'bg-green-50 text-green-700 border-green-200' },
    5: { text: 'Mất cọc', color: 'bg-red-50 text-red-700 border-red-200' },
};

const isOrderCancelled = (status) => status === 6;
const isOrderCompleted = (status) => status === 5;
const isOrderOngoing = (status) => status === 4;

const canApprove = (trangThaiDon) => trangThaiDon === 2;
const canCancel = (trangThaiDon) => trangThaiDon === 1 || trangThaiDon === 2 || trangThaiDon === 3;

const canComplete = (trangThaiDon, ngayKetThuc) => {
    if (!ngayKetThuc) return false;
    const now = new Date();
    const endDate = new Date(ngayKetThuc);
    // Chỉ cho phép hoàn thành khi:
    // 1. Trạng thái là Đã duyệt (3) hoặc Đang diễn ra (4)
    // 2. Ngày kết thúc đã qua (<= ngày hiện tại)
    return (trangThaiDon === 3 || trangThaiDon === 4) && endDate <= now;
};

const getCompleteStatusMessage = (trangThaiDon, ngayKetThuc) => {
    if (!ngayKetThuc) {
        return { canComplete: false, message: 'Không có thông tin ngày kết thúc tour' };
    }
    const now = new Date();
    const endDate = new Date(ngayKetThuc);

    if (trangThaiDon !== 3 && trangThaiDon !== 4) {
        return {
            canComplete: false,
            message: `Đơn đang ở trạng thái "${ORDER_STATUS[trangThaiDon]?.text || 'không xác định'}" - chỉ có thể hoàn thành khi đơn đã được duyệt hoặc đang diễn ra`
        };
    }

    if (endDate > now) {
        return {
            canComplete: false,
            message: `Tour chưa kết thúc (dự kiến: ${endDate.toLocaleDateString('vi-VN')}). Chỉ có thể hoàn thành sau ngày ${endDate.toLocaleDateString('vi-VN')}`
        };
    }

    return { canComplete: true, message: 'Tour đã kết thúc, có thể hoàn thành' };
};

const canRecordPayment = (bk) =>
    !isOrderCancelled(bk.trangThaiDon) &&
    !isOrderCompleted(bk.trangThaiDon) &&
    !isOrderOngoing(bk.trangThaiDon) &&
    bk.trangThaiTaiChinh !== 2 &&
    (bk.soTienConLai ?? (bk.tongTien - (bk.soTienDaThanhToan || 0))) > 0 &&
    (bk.thongTinThanhToan?.phuongThucThanhToan == null ||
        bk.thongTinThanhToan?.phuongThucThanhToan === 2 ||
        bk.thongTinThanhToan?.phuongThucThanhToan === 3);

const hasUnresolvedDeposit = (bk) =>
    isOrderCancelled(bk.trangThaiDon) &&
    (bk.trangThaiTaiChinh === 1 || bk.trangThaiTaiChinh === 2);

const getCancelWarning = (trangThaiThanhToan, phuongThucThanhToan) => {
    if (trangThaiThanhToan === 1 && phuongThucThanhToan === 2)
        return 'Đơn đã thu tiền mặt. Nhớ hoàn tiền cho khách trước khi hủy!';
    if (trangThaiThanhToan === 1 && phuongThucThanhToan === 3)
        return 'Đơn đã thu tiền qua chuyển khoản. Nhớ hoàn tiền cho khách trước khi hủy!';
    if (trangThaiThanhToan === 1 && phuongThucThanhToan === 1)
        return 'Đơn đã thanh toán VNPay. Cần xử lý hoàn tiền qua VNPay!';
    return null;
};

export default function BookingDetailModal({ booking, onClose, onRefresh }) {
    const { user } = useAuth();
    const [bk, setBk] = useState(booking);
    const [loadingAction, setLoadingAction] = useState(null);
    const [savingPassenger, setSavingPassenger] = useState(false);
    const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [isCancelReasonOpen, setIsCancelReasonOpen] = useState(false);
    const [isDepositRefundReasonOpen, setIsDepositRefundReasonOpen] = useState(false);
    const [isEditPassengerModalOpen, setIsEditPassengerModalOpen] = useState(false);
    const [editingPassenger, setEditingPassenger] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'warning',
        onConfirm: null,
    });

    const closeConfirm = useCallback(() => setConfirmModal(p => ({ ...p, isOpen: false, onConfirm: null })), []);

    const tongKhach = useMemo(() =>
        (bk.soNguoiLon || 0) + (bk.soTreEm || 0) + (bk.soEmBe || 0),
        [bk.soNguoiLon, bk.soTreEm, bk.soEmBe]
    );

    const depositPercentage = useMemo(() =>
        bk.tienCoc > 0 && bk.tongTien > 0
            ? Math.round((bk.tienCoc / bk.tongTien) * 100)
            : 0,
        [bk.tienCoc, bk.tongTien]
    );

    const sortedPayments = useMemo(() =>
        bk.lichSuThanhToan && bk.lichSuThanhToan.length > 0
            ? [...bk.lichSuThanhToan].sort((a, b) => new Date(a.ngayThanhToan) - new Date(b.ngayThanhToan))
            : [],
        [bk.lichSuThanhToan]
    );

    const orderStatus = ORDER_STATUS[bk.trangThaiDon] ?? { text: 'Không rõ', color: 'bg-slate-100 text-slate-600 border-slate-200' };
    const payStatus = PAYMENT_STATUS[bk.trangThaiThanhToan] ?? PAYMENT_STATUS[0];
    const payMethod = PAYMENT_METHODS[bk.thongTinThanhToan?.phuongThucThanhToan];
    const financialStatus = FINANCIAL_STATUS[bk.trangThaiTaiChinh] ?? FINANCIAL_STATUS[0];

    const isCancelled = isOrderCancelled(bk.trangThaiDon);
    const isOngoing = isOrderOngoing(bk.trangThaiDon);
    const isFullyPaid = bk.trangThaiTaiChinh === 2;
    const isRefunding = bk.trangThaiTaiChinh === 3;
    const isRefunded = bk.trangThaiTaiChinh === 4;
    const isDepositLost = bk.trangThaiTaiChinh === 5;

    const showRecordPayment = canRecordPayment(bk);
    const showDepositResolution = hasUnresolvedDeposit(bk);

    // Kiểm tra điều kiện hoàn thành chi tiết
    const completeStatus = useMemo(() =>
        getCompleteStatusMessage(bk.trangThaiDon, bk.chuyen?.ngayKetThuc),
        [bk.trangThaiDon, bk.chuyen?.ngayKetThuc]
    );
    const showComplete = completeStatus.canComplete;

    const showOverdueWarning = !!bk.coCanhBaoCongNo && !isCancelled;

    const refreshOnly = useCallback(() => {
        if (onRefresh) onRefresh();
    }, [onRefresh]);

    const refreshAndClose = useCallback(() => {
        if (onRefresh) onRefresh();
        if (onClose) onClose();
    }, [onRefresh, onClose]);

    useEffect(() => {
        if (booking) {
            setBk(prev => ({
                ...prev,
                ...booking,
                soTienConLai: Math.max((booking.tongTien || 0) - (booking.soTienDaThanhToan || 0), 0)
            }));
        }
    }, [booking]);

    const handleApprove = useCallback(() => {
        setConfirmModal({
            isOpen: true,
            title: 'Phê duyệt đơn',
            message: `Xác nhận phê duyệt đơn #${bk.maDatCho}? Đơn sẽ chuyển sang trạng thái Đã duyệt.`,
            type: 'info',
            onConfirm: async () => {
                closeConfirm();
                setLoadingAction('approve');
                try {
                    await approveBookingAdminApi(bk.maDonDatTour, user?.maNhanVien);
                    setBk(p => ({
                        ...p,
                        trangThaiDon: 3,
                        ngayDuyet: new Date().toISOString(),
                        nhanVienDuyet: user?.hoTen || 'Quản Trị Viên',
                    }));
                    toastSuccess('Duyệt đơn thành công', `Đơn #${bk.maDatCho} đã được phê duyệt.`);
                    refreshAndClose();
                } catch (e) {
                    toastError('Duyệt đơn thất bại', getErrorMessage(e));
                } finally {
                    setLoadingAction(null);
                }
            },
        });
    }, [bk, user, closeConfirm, refreshAndClose]);

    const handleConfirmCancelWithReason = useCallback(async (lyDoHuy) => {
        setIsCancelReasonOpen(false);
        setLoadingAction('cancel');
        try {
            await cancelBookingAdminApi(bk.maDonDatTour, lyDoHuy);
            setBk(p => ({ ...p, trangThaiDon: 6, lyDoHuy }));
            toastSuccess('Hủy đơn thành công', `Đơn #${bk.maDatCho} đã được hủy.`);
            refreshAndClose();
        } catch (e) {
            toastError('Hủy đơn thất bại', getErrorMessage(e));
        } finally {
            setLoadingAction(null);
        }
    }, [bk.maDonDatTour, bk.maDatCho, refreshAndClose]);

    const handleComplete = useCallback(() => {
        // Kiểm tra lại điều kiện trước khi mở modal
        if (!completeStatus.canComplete) {
            toastError('Không thể hoàn thành', completeStatus.message);
            return;
        }

        setConfirmModal({
            isOpen: true,
            title: 'Hoàn thành tour',
            message: `Xác nhận đánh dấu đơn #${bk.maDatCho} là HOÀN THÀNH?\n\n${
                bk.chuyen?.ngayKetThuc
                    ? `Tour đã kết thúc vào: ${new Date(bk.chuyen.ngayKetThuc).toLocaleDateString('vi-VN')}`
                    : ''
            }\n\nHành động này không thể hoàn tác.`,
            type: 'info',
            onConfirm: async () => {
                closeConfirm();
                setLoadingAction('complete');
                try {
                    await completeBookingAdminApi(bk.maDonDatTour);
                    setBk(p => ({ ...p, trangThaiDon: 5 }));
                    toastSuccess('Hoàn thành tour', `Đơn #${bk.maDatCho} đã được đánh dấu hoàn tất.`);
                    refreshAndClose();
                } catch (e) {
                    toastError('Hoàn thành thất bại', getErrorMessage(e));
                } finally {
                    setLoadingAction(null);
                }
            },
        });
    }, [bk.maDonDatTour, bk.maDatCho, bk.chuyen?.ngayKetThuc, completeStatus, closeConfirm, refreshAndClose]);

    const handleCancel = useCallback(() => {
        setIsCancelReasonOpen(true);
    }, []);

    const openPaymentForm = useCallback(() => {
        const goiY = bk.soTienConLai ?? (bk.tongTien - (bk.soTienDaThanhToan || 0));
        setPaymentAmount(goiY > 0 ? String(goiY) : '');
        setIsPaymentFormOpen(true);
    }, [bk]);

    const closePaymentForm = useCallback(() => {
        setIsPaymentFormOpen(false);
        setPaymentAmount('');
    }, []);

    const handleConfirmPayment = useCallback(() => {
        const amount = Number(paymentAmount);
        const conLai = bk.soTienConLai ?? (bk.tongTien - (bk.soTienDaThanhToan || 0));

        if (!amount || amount <= 0) {
            toastError('Lỗi', 'Vui lòng nhập số tiền hợp lệ.');
            return;
        }
        if (amount > conLai) {
            toastError('Lỗi', `Số tiền không được vượt quá số tiền còn lại (${conLai.toLocaleString('vi-VN')}₫).`);
            return;
        }

        setConfirmModal({
            isOpen: true,
            title: 'Xác nhận thu tiền',
            message: `Xác nhận đã thu ${amount.toLocaleString('vi-VN')}₫ cho đơn #${bk.maDatCho}?`,
            type: 'info',
            onConfirm: async () => {
                closeConfirm();
                setIsPaymentFormOpen(false);
                setLoadingAction('payment');
                try {
                    await updatePaymentStatusApi(bk.maDonDatTour, 1, user?.maNhanVien, amount);
                    const soTienDaThanhToanMoi = (bk.soTienDaThanhToan || 0) + amount;
                    const daDuThanhToan = soTienDaThanhToanMoi >= (bk.tongTien || 0);
                    setBk(p => ({
                        ...p,
                        soTienDaThanhToan: soTienDaThanhToanMoi,
                        soTienConLai: Math.max((p.tongTien || 0) - soTienDaThanhToanMoi, 0),
                        trangThaiTaiChinh: daDuThanhToan ? 2 : p.trangThaiTaiChinh,
                        coCanhBaoCongNo: daDuThanhToan ? false : p.coCanhBaoCongNo,
                    }));
                    toastSuccess('Cập nhật thanh toán', `Đã ghi nhận ${amount.toLocaleString('vi-VN')}₫ cho đơn #${bk.maDatCho}.`);
                    refreshOnly();
                } catch (e) {
                    toastError('Thất bại', getErrorMessage(e));
                } finally {
                    setLoadingAction(null);
                    setPaymentAmount('');
                }
            },
        });
    }, [paymentAmount, bk, user, closeConfirm, refreshOnly]);

    const handleMarkDepositLost = useCallback(() => {
        setConfirmModal({
            isOpen: true,
            title: 'Đánh dấu mất cọc',
            message: `Xác nhận đơn #${bk.maDatCho} MẤT CỌC theo chính sách hủy tour? Số tiền cọc sẽ không được hoàn lại cho khách.`,
            type: 'warning',
            onConfirm: async () => {
                closeConfirm();
                setLoadingAction('depositLost');
                try {
                    await updatePaymentStatusApi(bk.maDonDatTour, 5, user?.maNhanVien);
                    setBk(p => ({ ...p, trangThaiTaiChinh: 5 }));
                    toastSuccess('Đã cập nhật', `Đơn #${bk.maDatCho} đã được đánh dấu mất cọc.`);
                    refreshOnly();
                } catch (e) {
                    toastError('Cập nhật thất bại', getErrorMessage(e));
                } finally {
                    setLoadingAction(null);
                }
            },
        });
    }, [bk, user, closeConfirm, refreshOnly]);

    const handleOpenRefundDeposit = useCallback(() => {
        setIsDepositRefundReasonOpen(true);
    }, []);

    const handleConfirmRefundDeposit = useCallback(async (lyDoHoan) => {
        setIsDepositRefundReasonOpen(false);
        setLoadingAction('refundDeposit');
        try {
            await refundDepositApi(bk.maDonDatTour, lyDoHoan);
            setBk(p => ({ ...p, trangThaiTaiChinh: 4 }));
            toastSuccess('Hoàn cọc thành công', `Đã ghi nhận hoàn cọc cho đơn #${bk.maDatCho}.`);
            refreshOnly();
        } catch (e) {
            toastError('Hoàn cọc thất bại', getErrorMessage(e));
        } finally {
            setLoadingAction(null);
        }
    }, [bk.maDonDatTour, bk.maDatCho, refreshOnly]);

    const openEditPassengerModal = useCallback((passenger) => {
        setEditingPassenger(passenger);
        setEditFormData({
            maKhachHang: passenger.maKhachHang,
            hoTen: passenger.hoTen || '',
            soDienThoai: passenger.soDienThoai || '',
            email: passenger.email || '',
            ngaySinh: passenger.ngaySinh || null,
            gioiTinh: passenger.gioiTinh ?? true,
            loaiKhach: passenger.loaiKhach || 1,
            phongDon: passenger.phongDon || false,
        });
        setIsEditPassengerModalOpen(true);
    }, []);

    const closeEditPassengerModal = useCallback(() => {
        setIsEditPassengerModalOpen(false);
        setEditingPassenger(null);
        setEditFormData({});
    }, []);

    const saveEditPassenger = useCallback(async () => {
        if (!editFormData.hoTen?.trim()) {
            toastError('Lỗi', 'Họ tên hành khách không được để trống!');
            return;
        }

        setSavingPassenger(true);
        try {
            await updatePassengerAdminApi(editFormData.maKhachHang, {
                hoTen: editFormData.hoTen,
                soDienThoai: editFormData.soDienThoai || null,
                email: editFormData.email || null,
                ngaySinh: editFormData.ngaySinh,
                gioiTinh: editFormData.gioiTinh,
                loaiKhach: editFormData.loaiKhach,
                phongDon: editFormData.phongDon,
            });

            setBk(prev => ({
                ...prev,
                danhSachHanhKhach: prev.danhSachHanhKhach.map(k =>
                    k.maKhachHang === editFormData.maKhachHang ? { ...k, ...editFormData } : k
                ),
            }));

            toastSuccess('Thành công', 'Đã cập nhật thông tin hành khách.');
            closeEditPassengerModal();
            refreshOnly();
        } catch (err) {
            toastError('Cập nhật thất bại', getErrorMessage(err));
        } finally {
            setSavingPassenger(false);
        }
    }, [editFormData, closeEditPassengerModal, refreshOnly]);

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-[999] flex justify-center items-center p-4">
                <div className="bg-white rounded-xl w-full max-w-6xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
                    <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 shrink-0">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-lg font-bold text-slate-900">Chi tiết đặt chỗ: {bk.maDatCho}</span>
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${orderStatus.color}`}>
                                    {orderStatus.text}
                                </span>
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${financialStatus.color}`}>
                                    {financialStatus.text}
                                </span>
                            </div>
                            <div className="flex items-center gap-x-5 gap-y-1 text-xs text-slate-500 flex-wrap">
                                <div>Khách đặt: <span className="font-semibold text-slate-700">{bk.tenNguoiDat}</span></div>
                                <div>SĐT: <span className="font-semibold text-slate-700">{bk.soDienThoai}</span></div>
                                <div>Số lượng: <span className="font-semibold text-slate-700">{tongKhach} khách</span></div>
                                <div>Ngày đặt: <span className="font-semibold text-slate-700">{new Date(bk.ngayDat).toLocaleString('vi-VN')}</span></div>
                            </div>
                        </div>
                        <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-1 bg-slate-50/50 p-6 space-y-6">
                        {showOverdueWarning && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-300 flex items-start gap-3">
                                <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-red-700">
                                        Đơn còn nợ và tour chuẩn bị khởi hành — cần liên hệ khách xử lý gấp!
                                    </p>
                                    {bk.ngayGanCoCanhBao && (
                                        <p className="text-xs text-red-600 mt-1">
                                            Hệ thống quét và cảnh báo: {new Date(bk.ngayGanCoCanhBao).toLocaleString('vi-VN')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Thông báo trạng thái hoàn thành tour */}
                        {bk.trangThaiDon >= 3 && !isCancelled && !isOrderCompleted(bk.trangThaiDon) && (
                            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                                completeStatus.canComplete
                                    ? 'bg-emerald-50 border-emerald-300'
                                    : 'bg-amber-50 border-amber-300'
                            }`}>
                                {completeStatus.canComplete ? (
                                    <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                ) : (
                                    <Clock size={18} className="text-amber-600 shrink-0 mt-0.5" />
                                )}
                                <div>
                                    <p className={`text-sm font-semibold ${
                                        completeStatus.canComplete ? 'text-emerald-700' : 'text-amber-700'
                                    }`}>
                                        {completeStatus.canComplete
                                            ? 'Tour đã kết thúc và sẵn sàng để hoàn thành'
                                            : 'Tour chưa thể hoàn thành'}
                                    </p>
                                    <p className="text-xs mt-1 text-slate-600">
                                        {completeStatus.message}
                                    </p>
                                    {bk.chuyen?.ngayKetThuc && (
                                        <p className="text-xs mt-1 text-slate-500 flex items-center gap-1">
                                            <Calendar size={12} />
                                            Ngày kết thúc dự kiến: {new Date(bk.chuyen.ngayKetThuc).toLocaleDateString('vi-VN')}
                                        </p>
                                    )}
                                    {!completeStatus.canComplete && bk.chuyen?.ngayKetThuc && (
                                        <p className="text-xs mt-1 text-amber-600">
                                             Còn {Math.ceil((new Date(bk.chuyen.ngayKetThuc) - new Date()) / (1000 * 60 * 60 * 24))} ngày nữa
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Thông tin tour & chuyến đi</h3>
                            <div className="mb-4 pb-4 border-b border-slate-100">
                                <span className="text-xs text-slate-400 block mb-1">Tên Tour</span>
                                <span className="text-base font-bold text-slate-800">{bk.tour?.tenTour || '—'}</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                                <div>
                                    <span className="text-[11px] text-slate-400 block mb-0.5">Mã chuyến đi</span>
                                    <span className="text-sm font-semibold font-mono text-slate-700">{bk.chuyen?.maChuyenCode || '—'}</span>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400 block mb-0.5">Điểm khởi hành</span>
                                    <span className="text-sm font-semibold text-slate-700">{bk.chuyen?.diemKhoiHanh || '—'}</span>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400 block mb-0.5">Điểm đến</span>
                                    <span className="text-sm font-semibold text-slate-700">{bk.chuyen?.diemDen || '—'}</span>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400 block mb-0.5">Hướng dẫn viên</span>
                                    <span className="text-sm font-semibold text-slate-700">{bk.chuyen?.tenHuongDanVien || '—'}</span>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400 block mb-0.5">Ngày khởi hành</span>
                                    <span className="text-sm font-semibold text-slate-700">
                                        {bk.chuyen?.ngayKhoiHanh ? new Date(bk.chuyen.ngayKhoiHanh).toLocaleDateString('vi-VN') : '—'}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400 block mb-0.5">Ngày kết thúc</span>
                                    <span className="text-sm font-semibold text-slate-700">
                                        {bk.chuyen?.ngayKetThuc ? new Date(bk.chuyen.ngayKetThuc).toLocaleDateString('vi-VN') : '—'}
                                    </span>
                                </div>
                                {bk.tenKhachSan && (
                                    <div className="col-span-2">
                                        <span className="text-[11px] text-slate-400 block mb-0.5">Khách sạn đặt trước</span>
                                        <span className="text-sm font-semibold text-slate-700">{bk.tenKhachSan}</span>
                                    </div>
                                )}
                            </div>
                            {isCancelled && bk.lyDoHuy && (
                                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
                                    <p className="text-sm font-medium text-red-700">Lý do hủy: {bk.lyDoHuy}</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Chi tiết thanh toán đơn hàng</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                                {bk.soNguoiLon > 0 && (
                                    <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                                        <div className="text-[10px] uppercase text-slate-400 font-bold">Người lớn</div>
                                        <div className="text-xs text-slate-500 mt-1">{bk.soNguoiLon} × {bk.giaNguoiLonTaiDat?.toLocaleString('vi-VN')}₫</div>
                                        <div className="text-sm font-bold text-slate-800 mt-0.5">{(bk.soNguoiLon * bk.giaNguoiLonTaiDat).toLocaleString('vi-VN')}₫</div>
                                    </div>
                                )}
                                {bk.soTreEm > 0 && (
                                    <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                                        <div className="text-[10px] uppercase text-slate-400 font-bold">Trẻ em</div>
                                        <div className="text-xs text-slate-500 mt-1">{bk.soTreEm} × {bk.giaTreEmTaiDat?.toLocaleString('vi-VN')}₫</div>
                                        <div className="text-sm font-bold text-slate-800 mt-0.5">{(bk.soTreEm * bk.giaTreEmTaiDat).toLocaleString('vi-VN')}₫</div>
                                    </div>
                                )}
                                {bk.soEmBe > 0 && (
                                    <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                                        <div className="text-[10px] uppercase text-slate-400 font-bold">Em bé</div>
                                        <div className="text-xs text-slate-500 mt-1">{bk.soEmBe} × {bk.giaEmBeTaiDat?.toLocaleString('vi-VN')}₫</div>
                                        <div className="text-sm font-bold text-slate-800 mt-0.5">{(bk.soEmBe * bk.giaEmBeTaiDat).toLocaleString('vi-VN')}₫</div>
                                    </div>
                                )}
                                {bk.soPhongDon > 0 && (
                                    <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                                        <div className="text-[10px] uppercase text-slate-400 font-bold">Phụ thu phòng đơn</div>
                                        <div className="text-xs text-slate-500 mt-1">{bk.soPhongDon} × {bk.phuThuPhongDonTaiDat?.toLocaleString('vi-VN')}₫</div>
                                        <div className="text-sm font-bold text-slate-800 mt-0.5">{(bk.soPhongDon * bk.phuThuPhongDonTaiDat).toLocaleString('vi-VN')}₫</div>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/40">
                                <div>
                                    <span className="text-[11px] text-slate-400 block mb-0.5">Tổng giá trị đơn</span>
                                    <span className="text-base font-bold text-slate-900">{bk.tongTien?.toLocaleString('vi-VN')}₫</span>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400 block mb-0.5">Mức cọc yêu cầu ({depositPercentage}%)</span>
                                    <span className={`text-base font-bold ${isFullyPaid ? 'text-slate-500' : 'text-amber-600'}`}>
                                        {bk.tienCoc?.toLocaleString('vi-VN')}₫
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400 block mb-0.5">Đã thanh toán</span>
                                    <span className="text-base font-bold text-emerald-600">{bk.soTienDaThanhToan?.toLocaleString('vi-VN')}₫</span>
                                </div>
                                <div>
                                    <span className="text-[11px] text-slate-400 block mb-0.5">Còn lại</span>
                                    <span className={`text-base font-bold ${bk.soTienConLai > 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                                        {bk.soTienConLai?.toLocaleString('vi-VN')}₫
                                    </span>
                                </div>
                            </div>

                            {showRecordPayment && (
                                <div className="mt-4">
                                    {!isPaymentFormOpen ? (
                                        <button
                                            onClick={openPaymentForm}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition"
                                        >
                                            <Wallet size={16} />
                                            Ghi nhận thanh toán
                                        </button>
                                    ) : (
                                        <div className="p-4 border border-emerald-200 bg-emerald-50/40 rounded-xl space-y-3">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Số tiền thu lần này (đ)
                                            </label>
                                            <InputField
                                                type="number"
                                                min="0"
                                                value={paymentAmount}
                                                onChange={e => setPaymentAmount(e.target.value)}
                                                placeholder="Nhập số tiền..."
                                                className="!py-2.5"
                                            />
                                            <p className="text-[11px] text-slate-500">
                                                Còn lại: {(bk.soTienConLai ?? (bk.tongTien - (bk.soTienDaThanhToan || 0)))?.toLocaleString('vi-VN')}₫
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleConfirmPayment}
                                                    disabled={loadingAction === 'payment'}
                                                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition disabled:opacity-50"
                                                >
                                                    {loadingAction === 'payment' ? 'Đang xử lý...' : 'Xác nhận'}
                                                </button>
                                                <button
                                                    onClick={closePaymentForm}
                                                    disabled={loadingAction === 'payment'}
                                                    className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition disabled:opacity-50"
                                                >
                                                    Hủy
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {showDepositResolution && (
                                <div className="mt-4 p-4 border border-amber-200 bg-amber-50/30 rounded-xl">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-3 flex items-center gap-1.5">
                                        <History size={14} />
                                        Xử lý tiền cọc
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={handleOpenRefundDeposit}
                                            disabled={!!loadingAction}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition disabled:opacity-50"
                                        >
                                            {loadingAction === 'refundDeposit' ? 'Đang xử lý...' : 'Hoàn cọc cho khách'}
                                        </button>
                                        <button
                                            onClick={handleMarkDepositLost}
                                            disabled={!!loadingAction}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50/50 transition disabled:opacity-50"
                                        >
                                            {loadingAction === 'depositLost' ? 'Đang xử lý...' : 'Đánh dấu mất cọc'}
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-amber-700 mt-2">
                                        Đơn đã hủy và còn khoản cọc {bk.tienCoc?.toLocaleString('vi-VN')}₫ chưa xử lý — chọn hoàn cọc cho khách hoặc đánh dấu mất cọc theo chính sách hủy tour.
                                    </p>
                                </div>
                            )}

                            {bk.tenUuDai && (
                                <div className="mt-3 text-xs text-slate-600 flex gap-1 items-center bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100 w-fit">
                                    <span>Áp dụng khuyến mại: <strong>{bk.tenUuDai}</strong></span>
                                    {bk.maCode && <span className="text-slate-400">({bk.maCode})</span>}
                                    {bk.giaTriGiamTaiDat > 0 && <span className="font-bold text-emerald-600 ml-1">-{bk.giaTriGiamTaiDat.toLocaleString('vi-VN')}₫</span>}
                                </div>
                            )}
                            {bk.ghiChu && (
                                <div className="mt-3 p-3 bg-amber-50/50 border border-amber-100 rounded-lg">
                                    <span className="text-[10px] font-bold text-amber-700 block uppercase mb-1">Ghi chú từ khách hàng:</span>
                                    <p className="text-xs text-slate-700 italic">{bk.ghiChu}</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Danh sách hành khách ({bk.danhSachHanhKhach?.length || 0})</h3>
                            {bk.danhSachHanhKhach && bk.danhSachHanhKhach.length > 0 ? (
                                <div className="border border-slate-200 rounded-lg overflow-x-auto">
                                    <table className="w-full text-left text-[12px] border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                                                <th className="px-4 py-3">Họ và tên</th>
                                                <th className="px-4 py-3">Số điện thoại</th>
                                                <th className="px-4 py-3">Email</th>
                                                <th className="px-4 py-3">Ngày sinh</th>
                                                <th className="px-4 py-3">Giới tính</th>
                                                <th className="px-4 py-3">Loại khách</th>
                                                {!isOrderCompleted(bk.trangThaiDon) && !isCancelled && !isOngoing && <th className="px-4 py-3 text-center w-16">Thao tác</th>}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {bk.danhSachHanhKhach.map((p) => (
                                                <tr key={p.maKhachHang} className="hover:bg-slate-50/30 transition-colors">
                                                    <td className="px-4 py-2 font-semibold text-slate-700">{p.hoTen}</td>
                                                    <td className="px-4 py-2 font-semibold text-slate-700">{p.soDienThoai || '—'}</td>
                                                    <td className="px-4 py-2 font-semibold text-slate-700">{p.email || '—'}</td>
                                                    <td className="px-4 py-2 font-semibold text-slate-700">
                                                        {p.ngaySinh ? new Date(p.ngaySinh).toLocaleDateString('vi-VN') : '—'}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {p.gioiTinh ? <span className="font-semibold">Nam</span> : <span className="font-semibold">Nữ</span>}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {(() => {
                                                            const MAP = { 1: 'Người lớn', 2: 'Trẻ em', 3: 'Em bé' };
                                                            return <span className="font-semibold text-slate-700">{MAP[p.loaiKhach] || '—'}</span>;
                                                        })()}
                                                    </td>
                                                    {!isOrderCompleted(bk.trangThaiDon) && !isCancelled && !isOngoing && (
                                                        <td className="px-4 py-2 text-center">
                                                            <button
                                                                onClick={() => openEditPassengerModal(p)}
                                                                className="p-1 text-slate-400 hover:text-sky-600 hover:bg-slate-100 rounded transition"
                                                            >
                                                                <Edit3 size={14} />
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center text-xs text-slate-400 py-4">Không có thông tin hành khách</p>
                            )}
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                <History size={14} />
                                Lịch sử thanh toán
                            </h3>
                            {sortedPayments.length > 0 ? (
                                <div className="space-y-3">
                                    {sortedPayments.map((payment, index) => {
                                        const isDeposit = payment.loaiThanhToan === 1;
                                        const isRemaining = payment.loaiThanhToan === 2;
                                        const isFull = payment.loaiThanhToan === 3;
                                        const isRefund = payment.loaiThanhToan === 4;
                                        let paymentTypeLabel = '';
                                        if (isDeposit) paymentTypeLabel = 'Đặt cọc';
                                        else if (isRemaining) paymentTypeLabel = 'Thanh toán còn lại';
                                        else if (isFull) paymentTypeLabel = 'Thanh toán toàn bộ';
                                        else if (isRefund) paymentTypeLabel = 'Hoàn tiền';
                                        return (
                                            <div
                                                key={payment.maThanhToan || index}
                                                className={`p-3 border rounded-lg flex flex-col md:flex-row justify-between gap-2 md:items-center
                                                    ${isRefund ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50/50 border-slate-100'}`}
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-semibold text-sm text-slate-800">{paymentTypeLabel}</span>
                                                        {payment.tenPhuongThuc && (
                                                            <span className="text-xs text-slate-500">• {payment.tenPhuongThuc}</span>
                                                        )}
                                                        {isRefund && (
                                                            <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700">
                                                                Đã hoàn
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-500 space-y-0.5">
                                                        <div>Thời gian: {payment.ngayThanhToan ? new Date(payment.ngayThanhToan).toLocaleString('vi-VN') : '—'}</div>
                                                        {payment.maGiaoDich && (
                                                            <div>Mã GD: <span className="font-mono text-slate-600">{payment.maGiaoDich}</span></div>
                                                        )}
                                                        {payment.noiDung && (
                                                            <div className="italic text-slate-400">"{payment.noiDung}"</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <div className={`font-bold text-base ${isRefund ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                        {isRefund ? '-' : ''}{payment.tongTienThanhToan?.toLocaleString('vi-VN')}₫
                                                    </div>
                                                    {payment.soTienHoan > 0 && (
                                                        <div className="text-[10px] text-amber-600">
                                                            Hoàn: {payment.soTienHoan?.toLocaleString('vi-VN')}₫
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center">
                                        <span className="text-sm font-semibold text-slate-700">Tổng đã thanh toán</span>
                                        <span className="text-base font-bold text-emerald-600">
                                            {bk.soTienDaThanhToan?.toLocaleString('vi-VN')}₫
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-xs text-slate-400 py-4">Chưa phát sinh giao dịch thanh toán nào</p>
                            )}
                        </div>

                        {!isCancelled && bk.trangThaiDon >= 3 && bk.nhanVienDuyet && (
                            <div className="text-xs text-slate-500 bg-slate-100/80 px-4 py-3 rounded-lg flex items-center justify-between">
                                <span>Nhân viên duyệt đơn: <strong className="text-slate-800">{bk.nhanVienDuyet}</strong></span>
                                {bk.ngayDuyet && <span>Thời gian: <strong className="text-slate-800">{new Date(bk.ngayDuyet).toLocaleString('vi-VN')}</strong></span>}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-slate-100 bg-white px-6 py-4 flex justify-end items-center shrink-0">
                        <div className="flex flex-wrap gap-2">
                            {canApprove(bk.trangThaiDon) && (
                                <button
                                    onClick={handleApprove}
                                    disabled={!!loadingAction}
                                    className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition disabled:opacity-50"
                                >
                                    {loadingAction === 'approve' ? 'Đang duyệt...' : 'Duyệt đơn'}
                                </button>
                            )}
                            {showComplete && (
                                <button
                                    onClick={handleComplete}
                                    disabled={!!loadingAction}
                                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition disabled:opacity-50"
                                    title="Tour đã kết thúc, có thể hoàn thành"
                                >
                                    {loadingAction === 'complete' ? 'Đang hoàn tất...' : 'Hoàn thành Tour'}
                                </button>
                            )}
                            {canCancel(bk.trangThaiDon) && !isCancelled && !isOngoing && (
                                <button
                                    onClick={handleCancel}
                                    disabled={!!loadingAction}
                                    className="px-4 py-2 rounded-lg bg-white border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50/50 transition disabled:opacity-50"
                                >
                                    {loadingAction === 'cancel' ? 'Đang hủy...' : 'Hủy đơn'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isEditPassengerModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[1000] flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <User size={20} className="text-sky-500" />
                                <h3 className="text-lg font-bold text-slate-800">Chỉnh sửa thông tin hành khách</h3>
                            </div>
                            <button onClick={closeEditPassengerModal} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                        Họ và tên <span className="text-red-500">*</span>
                                    </label>
                                    <InputField
                                        value={editFormData.hoTen || ''}
                                        onChange={e => setEditFormData({ ...editFormData, hoTen: e.target.value })}
                                        placeholder="Nhập họ tên..."
                                        className="!py-2.5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                        Số điện thoại
                                    </label>
                                    <InputField
                                        value={editFormData.soDienThoai || ''}
                                        onChange={e => setEditFormData({ ...editFormData, soDienThoai: e.target.value })}
                                        placeholder="Nhập số điện thoại..."
                                        className="!py-2.5"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                        Email
                                    </label>
                                    <InputField
                                        value={editFormData.email || ''}
                                        onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                                        placeholder="Nhập email..."
                                        className="!py-2.5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                        Ngày sinh
                                    </label>
                                    <DatePicker
                                        value={editFormData.ngaySinh || null}
                                        onChange={v => setEditFormData({ ...editFormData, ngaySinh: v })}
                                        maxDate={new Date()}
                                        placeholderText="Chọn ngày sinh..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                        Giới tính
                                    </label>
                                    <SelectField
                                        value={editFormData.gioiTinh}
                                        onChange={v => setEditFormData({ ...editFormData, gioiTinh: v })}
                                        options={[
                                            { v: true, l: 'Nam' },
                                            { v: false, l: 'Nữ' }
                                        ]}
                                        valueKey="v"
                                        labelKey="l"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                        Loại khách
                                    </label>
                                    <SelectField
                                        value={editFormData.loaiKhach || 1}
                                        onChange={v => setEditFormData({ ...editFormData, loaiKhach: v })}
                                        options={[
                                            { v: 1, l: 'Người lớn' },
                                            { v: 2, l: 'Trẻ em' },
                                            { v: 3, l: 'Em bé' }
                                        ]}
                                        valueKey="v"
                                        labelKey="l"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                        Phòng đơn
                                    </label>
                                    <SelectField
                                        value={editFormData.phongDon}
                                        onChange={v => setEditFormData({ ...editFormData, phongDon: v })}
                                        options={[
                                            { v: true, l: 'Có' },
                                            { v: false, l: 'Không' }
                                        ]}
                                        valueKey="v"
                                        labelKey="l"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                            <button
                                onClick={saveEditPassenger}
                                disabled={savingPassenger}
                                className="px-6 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold flex items-center gap-2 transition disabled:opacity-50"
                            >
                                {savingPassenger ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} />
                                        Lưu thay đổi
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                confirmText="Xác nhận"
                cancelText="Hủy"
                onConfirm={confirmModal.onConfirm}
                onCancel={closeConfirm}
            />

            <CancelReasonModal
                isOpen={isCancelReasonOpen}
                onClose={() => setIsCancelReasonOpen(false)}
                onConfirm={handleConfirmCancelWithReason}
                isLoading={loadingAction === 'cancel'}
                warningMessage={getCancelWarning(bk.trangThaiThanhToan, bk.thongTinThanhToan?.phuongThucThanhToan)}
            />

            <CancelReasonModal
                isOpen={isDepositRefundReasonOpen}
                onClose={() => setIsDepositRefundReasonOpen(false)}
                onConfirm={handleConfirmRefundDeposit}
                isLoading={loadingAction === 'refundDeposit'}
                warningMessage={`Xác nhận hoàn cọc ${(bk.tienCoc || 0).toLocaleString('vi-VN')}₫ cho đơn #${bk.maDatCho}. Vui lòng nhập lý do/ghi chú hoàn cọc.`}
            />
        </>
    );
}