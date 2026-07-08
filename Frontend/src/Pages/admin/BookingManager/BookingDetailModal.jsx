import { useState } from 'react';
import {
    Calendar, User, CreditCard, FileText,
    X, CheckCircle, AlertTriangle, Edit3,
    Check, Ticket, Banknote, Wifi, Clock,
    Hash, MessageSquare, BadgeCheck, MapPin,
    Phone, Users, Tag, StickyNote,
    ChevronRight, Shield, CheckCheck, DollarSign, ArrowRightLeft
} from 'lucide-react';
import InputField from '~/components/UI/Form/InputField';
import SelectField from '~/components/UI/Form/SelectField';
import DatePicker from '~/components/UI/Form/DatePicker';
import {
    approveBookingAdminApi,
    cancelBookingAdminApi,
    updatePaymentStatusAdminApi,
    completeBookingAdminApi,
    updatePassengerAdminApi,
} from '~/Services/TourBookingService';
import useAuth from '~/Hooks/useAuth';
import { toastSuccess, toastError } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';
import CancelReasonModal from '../UserProfileManager/CancelReasonModal';

const ORDER_STATUS = {
    1: { text: 'Chờ duyệt', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-400' },
    2: { text: 'Đã duyệt', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-400' },
    3: { text: 'Hoàn tất', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400' },
    4: { text: 'Đã hủy', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-400' },
};

const PAYMENT_METHODS = {
    1: { text: 'VNPay' },
    2: { text: 'Tiền Mặt' },
    3: { text: 'Chuyển Khoản' },
};

const PAYMENT_STATUS = {
    0: { text: 'Chưa thanh toán', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock size={13} className="text-amber-500" /> },
    1: { text: 'Đã thanh toán', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle size={13} className="text-emerald-500" /> },
    2: { text: 'Thanh toán thất bại', color: 'bg-red-50 text-red-700 border-red-200', icon: <AlertTriangle size={13} className="text-red-500" /> },
    3: { text: 'Đã hoàn tiền', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: <Banknote size={13} className="text-slate-500" /> },
    4: { text: 'Chờ hoàn tiền', color: 'bg-orange-50 text-orange-700 border-orange-200', icon: <Clock size={13} className="text-orange-500" /> },
};

const canApprove = (trangThaiDon) => trangThaiDon === 1;
const canCancel = (trangThaiDon) => trangThaiDon === 1 || trangThaiDon === 2;
const canComplete = (trangThaiDon, ngayKetThuc) =>
    trangThaiDon === 2 && ngayKetThuc && new Date(ngayKetThuc) <= new Date();

// Chỉ cho phép admin tự tay "Xác nhận thu tiền" khi:
// - Thanh toán chưa thành công (1), chưa hoàn tiền (3) và không đang chờ hoàn tiền (4)
// - Đơn chưa hoàn tất (3) và chưa hủy (4)
// - Phương thức là Tiền mặt (2) hoặc Chuyển khoản (3), hoặc chưa có giao dịch nào ghi nhận (null) —
//   trường hợp admin tạo đơn thủ công nhưng chưa thu ngay, không tạo ThanhToan.
const canTogglePayment = (trangThaiDon, trangThaiThanhToan, phuongThucThanhToan) =>
    trangThaiThanhToan !== 1 &&
    trangThaiThanhToan !== 3 &&
    trangThaiThanhToan !== 4 &&
    trangThaiDon !== 3 &&
    trangThaiDon !== 4 &&
    (phuongThucThanhToan == null || phuongThucThanhToan === 2 || phuongThucThanhToan === 3);

// Chỉ cho phép xác nhận "Đã hoàn tiền" khi đang ở trạng thái Chờ hoàn tiền
const canConfirmRefunded = (trangThaiThanhToan) => trangThaiThanhToan === 4;

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
    const [editId, setEditId] = useState(null);
    const [pForm, setPForm] = useState({});
    const [loadingAction, setLoadingAction] = useState(null);
    const [savingPassenger, setSavingPassenger] = useState(false);

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'warning',
        onConfirm: null,
    });
    const closeConfirm = () => setConfirmModal(p => ({ ...p, isOpen: false, onConfirm: null }));

    // Modal chọn lý do hủy (thay cho ConfirmModal khi hủy đơn)
    const [isCancelReasonOpen, setIsCancelReasonOpen] = useState(false);

    const handleApprove = () => {
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
                        trangThaiDon: 2,
                        ngayDuyet: new Date().toISOString(),
                        nhanVienDuyet: user?.hoTen || 'Quản Trị Viên',
                    }));
                    toastSuccess('Duyệt đơn thành công', `Đơn #${bk.maDatCho} đã được phê duyệt.`);
                    onRefresh?.();
                    onClose?.();
                } catch (e) {
                    toastError('Duyệt đơn thất bại', getErrorMessage(e));
                } finally {
                    setLoadingAction(null);
                }
            },
        });
    };

    // Bấm nút "Hủy đơn" -> mở modal chọn lý do (không mở ConfirmModal nữa)
    const handleCancel = () => {
        setIsCancelReasonOpen(true);
    };

    // Sau khi chọn lý do và bấm xác nhận trong CancelReasonModal
    const handleConfirmCancelWithReason = async (lyDoHuy) => {
        setIsCancelReasonOpen(false);
        setLoadingAction('cancel');
        try {
            await cancelBookingAdminApi(bk.maDonDatTour, lyDoHuy);
            setBk(p => ({ ...p, trangThaiDon: 4, lyDoHuy }));
            toastSuccess('Hủy đơn thành công', `Đơn #${bk.maDatCho} đã được hủy.`);
            onRefresh?.();
            onClose?.();
        } catch (e) {
            toastError('Hủy đơn thất bại', getErrorMessage(e));
        } finally {
            setLoadingAction(null);
        }
    };

    const handleComplete = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Hoàn thành tour',
            message: `Xác nhận đánh dấu đơn #${bk.maDatCho} là HOÀN THÀNH? Hành động này không thể hoàn tác.`,
            type: 'info',
            onConfirm: async () => {
                closeConfirm();
                setLoadingAction('complete');
                try {
                    await completeBookingAdminApi(bk.maDonDatTour);
                    setBk(p => ({ ...p, trangThaiDon: 3 }));
                    toastSuccess('Hoàn thành tour', `Đơn #${bk.maDatCho} đã được đánh dấu hoàn tất.`);
                    onRefresh?.();
                    onClose?.();
                } catch (e) {
                    toastError('Hoàn thành thất bại', getErrorMessage(e));
                } finally {
                    setLoadingAction(null);
                }
            },
        });
    };

    const handleTogglePayment = () => {
        const next = bk.trangThaiThanhToan === 0 ? 1 : 0;

        setConfirmModal({
            isOpen: true,
            title: next === 1 ? 'Xác nhận thu tiền' : 'Đánh dấu chưa thanh toán',
            message: next === 1
                ? `Xác nhận đơn #${bk.maDatCho} đã thu tiền?`
                : `Đánh dấu đơn #${bk.maDatCho} là chưa thanh toán?`,
            type: next === 1 ? 'info' : 'warning',
            onConfirm: async () => {
                closeConfirm();
                setLoadingAction('toggle');
                try {
                    // Truyền đủ 3 tham số: bookingId, isPaid, maNhanVien
                    await updatePaymentStatusAdminApi(
                        bk.maDonDatTour,
                        next,
                        user?.maNhanVien // Lấy từ useAuth
                    );
                    setBk(p => ({ ...p, trangThaiThanhToan: next }));
                    toastSuccess(
                        'Cập nhật thanh toán',
                        next === 1
                            ? `Đơn #${bk.maDatCho} đã xác nhận thu tiền.`
                            : `Đơn #${bk.maDatCho} đã đánh dấu chưa thanh toán.`
                    );
                    onRefresh?.();
                    onClose?.();
                } catch (e) {
                    toastError('Thất bại', getErrorMessage(e));
                } finally {
                    setLoadingAction(null);
                }
            },
        });
    };

    const handleConfirmRefunded = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Xác nhận đã hoàn tiền',
            message: `Xác nhận đã hoàn tiền cho khách hàng của đơn #${bk.maDatCho}? Hành động này không thể hoàn tác.`,
            type: 'info',
            onConfirm: async () => {
                closeConfirm();
                setLoadingAction('refund');
                try {
                    // Truyền đủ 3 tham số
                    await updatePaymentStatusAdminApi(
                        bk.maDonDatTour,
                        3,
                        user?.maNhanVien
                    );
                    setBk(p => ({ ...p, trangThaiThanhToan: 3 }));
                    toastSuccess('Đã cập nhật', `Đơn #${bk.maDatCho} đã xác nhận hoàn tiền.`);
                    onRefresh?.();
                    onClose?.();
                } catch (e) {
                    toastError('Thất bại', getErrorMessage(e));
                } finally {
                    setLoadingAction(null);
                }
            },
        });
    };
    const startEdit = (p) => {
        setEditId(p.maKhachHang);
        setPForm({ ...p });
    };

    const saveEdit = () => {
        if (!pForm.hoTen?.trim()) {
            toastError('Lỗi', 'Họ tên hành khách không được để trống!');
            return;
        }

        setConfirmModal({
            isOpen: true,
            title: 'Cập nhật hành khách',
            message: `Xác nhận cập nhật thông tin cho hành khách "${pForm.hoTen}"?`,
            type: 'info',
            onConfirm: async () => {
                closeConfirm();
                setSavingPassenger(true);
                try {
                    await updatePassengerAdminApi(editId, {
                        hoTen: pForm.hoTen,
                        soDienThoai: pForm.soDienThoai || null,
                        email: pForm.email || null,
                        ngaySinh: pForm.ngaySinh,
                        gioiTinh: pForm.gioiTinh,
                        loaiKhach: pForm.loaiKhach,
                        phongDon: pForm.phongDon,
                    });
                    setBk(prev => ({
                        ...prev,
                        danhSachHanhKhach: prev.danhSachHanhKhach.map(k =>
                            k.maKhachHang === editId ? { ...k, ...pForm } : k
                        ),
                    }));
                    setEditId(null);
                    toastSuccess('Thành công', 'Đã cập nhật thông tin hành khách.');
                } catch (err) {
                    toastError('Cập nhật thất bại', getErrorMessage(err));
                } finally {
                    setSavingPassenger(false);
                }
            },
        });
    };

    const orderStatus = ORDER_STATUS[bk.trangThaiDon] ?? {
        text: '?', color: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-300',
    };
    const payStatus = PAYMENT_STATUS[bk.trangThaiThanhToan] ?? PAYMENT_STATUS[0];
    const payMethod = PAYMENT_METHODS[bk.thongTinThanhToan?.phuongThucThanhToan];
    const hasTT = bk.thongTinThanhToan;
    const tongKhach = (bk.soNguoiLon || 0) + (bk.soTreEm || 0) + (bk.soEmBe || 0);
    const showComplete = canComplete(bk.trangThaiDon, bk.chuyen?.ngayKetThuc);
    const canToggle = canTogglePayment(
        bk.trangThaiDon,
        bk.trangThaiThanhToan,
        bk.thongTinThanhToan?.phuongThucThanhToan
    );
    const canRefund = canConfirmRefunded(bk.trangThaiThanhToan);
    const toggleLabel = bk.trangThaiThanhToan === 0 ? 'Xác nhận đã thu tiền' : 'Đánh dấu chưa thanh toán';
    const toggleStyle = bk.trangThaiThanhToan === 0
        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-200'
        : 'bg-white hover:bg-orange-50 border border-orange-200 text-orange-600';

    return (
        <>
            <div className="fixed inset-0 bg-slate-600/30 z-[999] flex justify-center items-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-100">
                    <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white shrink-0">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="inline-flex items-center gap-1.5 bg-sky-500 text-white px-3 py-1 rounded-lg text-sm font-bold tracking-wide">
                                    <Ticket size={13} />
                                    {bk.maDatCho}
                                </div>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${orderStatus.color}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${orderStatus.dot}`} />
                                    {orderStatus.text}
                                </span>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${payStatus.color}`}>
                                    {payStatus.icon}
                                    {payStatus.text}
                                </span>
                                {payMethod && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border bg-slate-50 text-slate-600 border-slate-200">
                                        {payMethod.icon}
                                        {payMethod.text}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-[13px] flex-wrap">
                                <span className="flex items-center gap-1"><User size={11} />{bk.tenNguoiDat}</span>
                                <span className="flex items-center gap-1"><Phone size={11} />{bk.soDienThoai}</span>
                                <span className="flex items-center gap-1"><Users size={11} />{tongKhach} khách</span>
                                <span className="flex items-center gap-1"><Calendar size={11} />{new Date(bk.ngayDat).toLocaleString('vi-VN')}</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition">
                            <X size={18} />
                        </button>
                    </div>
                    <div className="overflow-y-auto flex-1 bg-slate-50/40">
                        <div className="p-6 space-y-5">
                            <SectionCard title="Hành trình" icon={<MapPin size={14} className="text-sky-500" />}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <InfoCell label="Mã chuyến" value={bk.chuyen?.maChuyenCode} mono />
                                    <InfoCell label="Điểm khởi hành" value={bk.chuyen?.diemKhoiHanh} />
                                    <InfoCell label="Điểm đến" value={bk.chuyen?.diemDen} />
                                    <InfoCell label="Ngày khởi hành" value={bk.chuyen?.ngayKhoiHanh ? new Date(bk.chuyen.ngayKhoiHanh).toLocaleDateString('vi-VN') : '—'} />
                                    <InfoCell label="Ngày kết thúc" value={bk.chuyen?.ngayKetThuc ? new Date(bk.chuyen.ngayKetThuc).toLocaleDateString('vi-VN') : '—'} />
                                    <InfoCell label="Hướng dẫn viên" value={bk.chuyen?.tenHuongDanVien || '—'} />
                                </div>
                            </SectionCard>
                            <SectionCard title="Chi tiết đơn đặt tour" icon={<FileText size={14} className="text-sky-500" />}>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {bk.soNguoiLon > 0 && <PriceCell label="Người lớn" qty={bk.soNguoiLon} unitPrice={bk.giaNguoiLonTaiDat} />}
                                    {bk.soTreEm > 0 && <PriceCell label="Trẻ em" qty={bk.soTreEm} unitPrice={bk.giaTreEmTaiDat} />}
                                    {bk.soEmBe > 0 && <PriceCell label="Em bé" qty={bk.soEmBe} unitPrice={bk.giaEmBeTaiDat} />}
                                    {bk.soPhongDon > 0 && <PriceCell label="Phụ thu phòng đơn" qty={bk.soPhongDon} unitPrice={bk.phuThuPhongDonTaiDat} />}
                                </div>
                                {bk.ghiChu && (
                                    <div className="flex items-start gap-2 mt-5 bg-slate-50 border border-slate-100 rounded-xl p-3">
                                        <StickyNote size={13} className="text-slate-500 mt-0.5 shrink-0" />
                                        <p className="text-xs text-slate-700 italic">{bk.ghiChu}</p>
                                    </div>
                                )}
                                <div className="mt-3 flex items-center justify-end gap-6 border-t border-slate-100 pt-3">
                                    {bk.giaTriGiamTaiDat > 0 && (
                                        <div className="flex items-center gap-2">
                                            <Tag size={12} className="text-emerald-500" />
                                            <span className="text-xs text-slate-500">Giảm giá:</span>
                                            <span className="text-sm font-semibold text-emerald-600">-{bk.giaTriGiamTaiDat.toLocaleString('vi-VN')}₫</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">Tổng cộng :</span>
                                        <span className="text-lg font-extrabold text-slate-800">{bk.tongTien.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                </div>
                                {bk.tenUuDai && <InfoCell label="Ưu đãi" value={`${bk.tenUuDai}${bk.maCode ? ` (${bk.maCode})` : ''}`} />}
                                {bk.tenKhachSan && <InfoCell label="Khách sạn" value={bk.tenKhachSan} />}
                            </SectionCard>

                            <SectionCard title={`Hành khách (${bk.danhSachHanhKhach?.length || 0})`} icon={<Users size={14} className="text-sky-500" />}>
                                {bk.danhSachHanhKhach && bk.danhSachHanhKhach.length > 0 ? (
                                    <div className="rounded-xl border border-slate-200 overflow-x-auto overflow-y-visible">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                    <th className="px-3 py-2.5">Họ và tên</th>
                                                    <th className="px-3 py-2.5">Số điện thoại</th>
                                                    <th className="px-3 py-2.5">Ngày sinh</th>
                                                    <th className="px-3 py-2.5">Giới tính</th>
                                                    <th className="px-3 py-2.5">Loại khách</th>
                                                    <th className="px-3 py-2.5 text-center w-16">Sửa</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {bk.danhSachHanhKhach.map((p) => {
                                                    const isEditing = editId === p.maKhachHang;
                                                    return (
                                                        <tr key={p.maKhachHang} className={`transition-colors ${isEditing ? 'bg-sky-50/60' : 'hover:bg-slate-50/60'}`}>
                                                            <td className="px-3 py-2">
                                                                {isEditing
                                                                    ? <InputField value={pForm.hoTen || ''} onChange={e => setPForm({ ...pForm, hoTen: e.target.value })} className="!py-1" />
                                                                    : <span className="font-medium text-slate-700">{p.hoTen}</span>}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {isEditing
                                                                    ? <InputField value={pForm.soDienThoai || ''} onChange={e => setPForm({ ...pForm, soDienThoai: e.target.value })} className="!py-1" />
                                                                    : <span className="text-slate-500 text-xs">{p.soDienThoai || '—'}</span>}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {isEditing
                                                                    ? <DatePicker value={pForm.ngaySinh || null} onChange={v => setPForm({ ...pForm, ngaySinh: v })} maxDate={new Date()} placeholderText="Ngày sinh..." />
                                                                    : <span className="text-slate-500 text-xs">{p.ngaySinh ? new Date(p.ngaySinh).toLocaleDateString('vi-VN') : '—'}</span>}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {isEditing
                                                                    ? <SelectField value={pForm.gioiTinh} onChange={v => setPForm({ ...pForm, gioiTinh: v })} options={[{ v: true, l: 'Nam' }, { v: false, l: 'Nữ' }]} valueKey="v" labelKey="l" />
                                                                    : <GenderBadge value={p.gioiTinh} />}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {isEditing
                                                                    ? <SelectField value={pForm.loaiKhach || 1} onChange={v => setPForm({ ...pForm, loaiKhach: v })} options={[{ v: 1, l: 'Người lớn' }, { v: 2, l: 'Trẻ em' }, { v: 3, l: 'Em bé' }]} valueKey="v" labelKey="l" />
                                                                    : <PassengerTypeBadge type={p.loaiKhach} />}
                                                            </td>
                                                            <td className="px-3 py-2 text-center">
                                                                {isEditing ? (
                                                                    <div className="flex justify-center gap-1">
                                                                        <button
                                                                            onClick={saveEdit}
                                                                            disabled={savingPassenger}
                                                                            className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition disabled:opacity-70"
                                                                        >
                                                                            {savingPassenger
                                                                                ? <div className="w-3 h-3 border-2 border-white border-t-transparent animate-spin rounded-full" />
                                                                                : <Check size={12} />}
                                                                        </button>
                                                                        <button onClick={() => setEditId(null)} className="p-1.5 bg-slate-200 text-slate-500 rounded-lg hover:bg-slate-300 transition">
                                                                            <X size={12} />
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    bk.trangThaiDon < 3 && (
                                                                        <button onClick={() => startEdit(p)} className="p-1.5 text-slate-300 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition">
                                                                            <Edit3 size={13} />
                                                                        </button>
                                                                    )
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-center text-sm text-slate-400 py-4">Không có thông tin hành khách</p>
                                )}
                            </SectionCard>

                            <SectionCard title="Thanh toán" icon={<CreditCard size={14} className="text-sky-500" />}>
                                <PaymentSummaryCard
                                    trangThaiThanhToan={bk.trangThaiThanhToan}
                                    tongTien={bk.tongTien}
                                    thongTinThanhToan={hasTT}
                                />
                                {hasTT && (
                                    <div className="mt-3 rounded-xl border border-slate-200 overflow-hidden">
                                        <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
                                            {hasTT.phuongThucThanhToan === 1
                                                ? <Wifi size={13} className="text-blue-500" />
                                                : hasTT.phuongThucThanhToan === 2
                                                    ? <Banknote size={13} className="text-emerald-500" />
                                                    : hasTT.phuongThucThanhToan === 3
                                                        ? <ArrowRightLeft size={13} className="text-indigo-500" />
                                                        : <CreditCard size={13} className="text-slate-500" />}
                                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                                                Phương thức: {hasTT.tenPhuongThuc || 'Không xác định'}
                                            </span>
                                            <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                                <BadgeCheck size={10} />
                                                {hasTT.trangThaiThanhToan === 1 ? 'Thành công' : 'Đang xử lý'}
                                            </span>
                                        </div>
                                        <div className="divide-y divide-slate-50">
                                            {hasTT.maGiaoDich && (
                                                <GatewayRow icon={<Hash size={12} />} label="Mã giao dịch" value={<span className="font-mono text-xs text-slate-800">{hasTT.maGiaoDich}</span>} />
                                            )}
                                            <GatewayRow icon={<Calendar size={12} />} label="Thời gian" value={<span className="text-xs text-slate-600">{new Date(hasTT.ngayThanhToan).toLocaleString('vi-VN')}</span>} />
                                            {hasTT.noiDung && (
                                                <GatewayRow icon={<MessageSquare size={12} />} label="Nội dung" value={<span className="text-xs italic text-slate-500">"{hasTT.noiDung}"</span>} />
                                            )}
                                            <GatewayRow icon={<DollarSign size={12} />} label="Số tiền giao dịch" value={<span className="text-sm font-bold text-emerald-600">{hasTT.tongTienThanhToan.toLocaleString('vi-VN')}₫</span>} />
                                        </div>
                                    </div>
                                )}
                            </SectionCard>

                            {bk.trangThaiDon >= 2 && bk.nhanVienDuyet && (
                                <div className="flex items-center gap-2 text-xs text-slate-400 bg-blue-50/60 border border-blue-100 rounded-xl px-4 py-2.5">
                                    <Shield size={12} className="text-blue-400" />
                                    <span>Đã được duyệt bởi <strong className="text-blue-600">{bk.nhanVienDuyet}</strong>{bk.ngayDuyet ? ` lúc ${new Date(bk.ngayDuyet).toLocaleString('vi-VN')}` : ''}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-slate-100 bg-white px-6 py-4 flex flex-wrap justify-between items-center gap-3 shrink-0">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className={`w-2 h-2 rounded-full ${orderStatus.dot}`} />
                            {orderStatus.text}
                            <ChevronRight size={11} />
                            <span>{payStatus.text}</span>
                            {payMethod && (
                                <>
                                    <ChevronRight size={11} />
                                    <span className="flex items-center gap-1">{payMethod.icon} {payMethod.text}</span>
                                </>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {canToggle && (
                                <button
                                    onClick={handleTogglePayment}
                                    disabled={!!loadingAction}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50 ${toggleStyle}`}
                                >
                                    {loadingAction === 'toggle' ? 'Đang lưu...' : toggleLabel}
                                </button>
                            )}

                            {canRefund && (
                                <button
                                    onClick={handleConfirmRefunded}
                                    disabled={!!loadingAction}
                                    className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition disabled:opacity-50"
                                >
                                    {loadingAction === 'refund' ? 'Đang lưu...' : 'Xác nhận đã hoàn tiền'}
                                </button>
                            )}

                            {showComplete && (
                                <button
                                    onClick={handleComplete}
                                    disabled={!!loadingAction}
                                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center gap-2 shadow shadow-emerald-200 transition disabled:opacity-50"
                                >
                                    <CheckCheck size={16} />
                                    {loadingAction === 'complete' ? 'Đang xử lý...' : 'Hoàn thành Tour'}
                                </button>
                            )}

                            {canCancel(bk.trangThaiDon) && (
                                <button
                                    onClick={handleCancel}
                                    disabled={!!loadingAction}
                                    className="px-4 py-2 rounded-xl bg-white border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition disabled:opacity-50"
                                >
                                    {loadingAction === 'cancel' ? 'Đang hủy...' : 'Hủy đơn'}
                                </button>
                            )}

                            {/* {canApprove(bk.trangThaiDon) && (
                                <button
                                    onClick={handleApprove}
                                    disabled={!user || !!loadingAction}
                                    className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold shadow shadow-sky-200 flex items-center gap-1.5 transition disabled:opacity-50"
                                >
                                    <CheckCircle size={15} />
                                    {loadingAction === 'approve' ? 'Đang duyệt...' : 'Phê duyệt đơn'}
                                </button>
                            )} */}
                        </div>
                    </div>
                </div>
            </div>

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
        </>
    );
}

function SectionCard({ title, icon, children }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-visible">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-50">
                {icon}
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</span>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}

function InfoCell({ label, value, mono = false }) {
    return (
        <div className="space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
            <p className={`text-sm text-slate-700 font-medium ${mono ? 'font-mono' : ''}`}>{value || '—'}</p>
        </div>
    );
}

function PriceCell({ label, qty, unitPrice }) {
    if (!qty || qty === 0) return null;
    return (
        <div className="bg-slate-50 rounded-xl p-3 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-800">{label}</p>
            <p className="text-[12px] text-slate-500">{qty} × {unitPrice.toLocaleString('vi-VN')}₫</p>
            <p className="text-sm font-bold text-slate-700">{(qty * unitPrice).toLocaleString('vi-VN')}₫</p>
        </div>
    );
}

function PaymentSummaryCard({ trangThaiThanhToan, tongTien, thongTinThanhToan }) {
    const CONFIGS = {
        0: {
            cls: 'border-amber-200 bg-amber-50',
            Icon: <AlertTriangle size={18} className="text-amber-500 shrink-0" />,
            title: 'Chưa ghi nhận thanh toán',
            desc: 'Đơn chưa được xác nhận thanh toán.',
        },
        1: {
            cls: 'border-emerald-200 bg-emerald-50',
            Icon: <CheckCircle size={18} className="text-emerald-500 shrink-0" />,
            title: 'Đã thanh toán',
            desc: 'Đơn đã được xác nhận thanh toán.',
        },
        2: {
            cls: 'border-red-200 bg-red-50',
            Icon: <AlertTriangle size={18} className="text-red-500 shrink-0" />,
            title: 'Thanh toán thất bại',
            desc: 'Giao dịch thanh toán không thành công.',
        },
        3: {
            cls: 'border-slate-200 bg-slate-50',
            Icon: <Banknote size={18} className="text-slate-500 shrink-0" />,
            title: 'Đã hoàn tiền',
            desc: 'Đơn đã bị hủy và tiền đã được hoàn lại cho khách.',
        },
        4: {
            cls: 'border-orange-200 bg-orange-50',
            Icon: <Clock size={18} className="text-orange-500 shrink-0" />,
            title: 'Chờ hoàn tiền',
            desc: 'Đơn đã hủy, đang chờ hoàn tiền cho khách.',
        },
    };
    const config = CONFIGS[trangThaiThanhToan] || CONFIGS[0];

    return (
        <div className={`rounded-2xl border p-4 ${config.cls}`}>
            <div className="flex items-start gap-3">
                {config.Icon}
                <div>
                    <p className="font-semibold">{config.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{config.desc}</p>
                    {(trangThaiThanhToan === 1 || trangThaiThanhToan === 3 || trangThaiThanhToan === 4) && thongTinThanhToan && (
                        <p className="text-xs text-slate-500 mt-1">
                            Phương thức: <span className="font-medium">{thongTinThanhToan.tenPhuongThuc}</span>
                            {' • '}
                            Số tiền: <span className="font-bold text-emerald-600">{tongTien.toLocaleString('vi-VN')}₫</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function GatewayRow({ icon, label, value }) {
    return (
        <div className="flex items-center justify-between gap-4 px-4 py-2.5">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs shrink-0">{icon}<span>{label}</span></div>
            <div className="text-right">{value}</div>
        </div>
    );
}

function PassengerTypeBadge({ type }) {
    const MAP = {
        1: { label: 'Người lớn', cls: 'bg-slate-100 text-slate-600' },
        2: { label: 'Trẻ em', cls: 'bg-orange-50 text-orange-600' },
        3: { label: 'Em bé', cls: 'bg-pink-50 text-pink-600' },
    };
    const { label, cls } = MAP[type] ?? { label: '—', cls: 'bg-slate-50 text-slate-400' };
    return <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${cls}`}>{label}</span>;
}

function GenderBadge({ value }) {
    return value
        ? <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-sky-50 text-sky-600">Nam</span>
        : <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-pink-50 text-pink-600">Nữ</span>;
}