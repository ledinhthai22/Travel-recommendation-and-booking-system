import { useState, useEffect, useMemo, useCallback } from 'react';
import InputField from '~/components/UI/Form/InputField';
import SelectField from '~/components/UI/Form/SelectField';
import DatePicker from '~/components/UI/Form/DatePicker';
import useAuth from '~/Hooks/useAuth';
import { createBookingAdminApi } from '~/Services/TourBookingService';
import { getUsersForBookingSelectApi } from '~/Services/UserService';
import { getToursForBookingSelectApi } from '~/Services/TourService';
import { getDeparturesForBookingApi } from '~/Services/DepartureService';
import { getPromotionsForBookingApi } from '~/Services/PromotionService';
import { toastSuccess, toastError } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
import CreateUserModal from '../UserManager/CreateUserModal';
import { X } from 'lucide-react';

// Constants - Đồng bộ với backend
const ORDER_STATUS = {
    1: 'Chờ thanh toán cọc',
    2: 'Chờ duyệt',
    3: 'Đã duyệt',
    4: 'Đang diễn ra',
    5: 'Hoàn tất',
    6: 'Chờ xử lý hủy',
    7: 'Đã hủy - Đang hoàn tiền',
    8: 'Đã hủy - Đã hoàn tiền',
    9: 'Đã hủy - Mất cọc',
    10: 'Hủy - Không hoàn tiền'
};

const DEPOSIT_STATUS = {
    0: 'Chưa thanh toán',
    1: 'Đã đặt cọc',
    2: 'Đã thanh toán đủ',
    3: 'Mất cọc',
    4: 'Đã hoàn tiền'
};

const PAYMENT_STATUS = {
    0: 'Chờ thanh toán',
    1: 'Thành công',
    2: 'Thất bại',
    3: 'Đã hủy',
    4: 'Đang xử lý hoàn tiền',
    5: 'Đã hoàn tiền'
};

function SectionCard({ title, children, accentColor = 'border-sky-500' }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
                <span className={`w-1 h-4 rounded-full ${accentColor} border-l-[3px]`} />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{title}</span>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

function FieldLabel({ children, required }) {
    return (
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            {children}{required && <span className="text-red-500 ml-0.5">*</span>}
        </p>
    );
}

const ToggleSwitch = ({ checked, onChange, label }) => (
    <label className="flex items-center justify-between gap-3 cursor-pointer select-none group">
        <span className="text-xs font-medium text-slate-600 group-hover:text-slate-800 transition">{label}</span>
        <button
            type="button" role="switch" aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative shrink-0 w-10 h-5.5 rounded-full transition-colors duration-200 focus:outline-none
                ${checked ? 'bg-sky-500' : 'bg-slate-200'}`}
        >
            <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform duration-200
                ${checked ? 'translate-x-4.5' : 'translate-x-0'}`} />
        </button>
    </label>
);

const LoaiBadge = ({ loai }) => {
    const cfg = {
        1: ['Người lớn', 'text-sky-700 bg-sky-50 border-sky-100'],
        2: ['Trẻ em', 'text-violet-700 bg-violet-50 border-violet-100'],
        3: ['Em bé', 'text-pink-700 bg-pink-50 border-pink-100'],
    }[loai] ?? ['?', 'text-slate-500 bg-slate-50 border-slate-100'];
    return (
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${cfg[1]}`}>
            {cfg[0]}
        </span>
    );
};

const formatCurrency = (amount) => {
    if (!amount) return '0₫';
    return amount.toLocaleString('vi-VN') + '₫';
};

export default function CreateBookingAdminModal({ onClose, onSuccess }) {
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [loadingDeps, setLoadingDeps] = useState(false);
    const [errors, setErrors] = useState({});

    const [users, setUsers] = useState([]);
    const [tours, setTours] = useState([]);
    const [chuyens, setChuyens] = useState([]);
    const [promotions, setPromotions] = useState([]);

    const [searchingUsers, setSearchingUsers] = useState(false);
    const [searchingTours, setSearchingTours] = useState(false);
    const [searchingPromos, setSearchingPromos] = useState(false);
    const [showCreateUser, setShowCreateUser] = useState(false);

    const [form, setForm] = useState({
        maNguoiDung: '',
        maTour: '',
        maChuyen: '',
        soNguoiLon: 1,
        soTreEm: 0,
        soEmBe: 0,
        danhSachHanhKhach: [],
        maUuDai: '',
        ghiChu: '',
        phuongThucThanhToan: 2,
        paymentType: 'full', // 'full' | 'deposit'
        tyLeCoc: 30,
    });

    useEffect(() => {
        if (!form.maTour) { setChuyens([]); return; }
        (async () => {
            try {
                setLoadingDeps(true);
                const res = await getDeparturesForBookingApi(form.maTour, '');
                setChuyens(res?.data || []);
                setForm(p => ({ ...p, maChuyen: '' }));
            } catch { console.error('Lỗi tải chuyến'); }
            finally { setLoadingDeps(false); }
        })();
    }, [form.maTour]);

    useEffect(() => {
        const total = form.soNguoiLon + form.soTreEm + form.soEmBe;
        let list = [...form.danhSachHanhKhach];
        if (list.length > total) list = list.slice(0, total);
        while (list.length < total)
            list.push({ hoTen: '', soDienThoai: '', email: '', ngaySinh: null, gioiTinh: 'true', loaiKhach: 1, phongDon: false });
        list = list.map((p, i) => ({
            ...p,
            loaiKhach: i < form.soNguoiLon ? 1 : i < form.soNguoiLon + form.soTreEm ? 2 : 3,
        }));
        setForm(p => ({ ...p, danhSachHanhKhach: list }));
    }, [form.soNguoiLon, form.soTreEm, form.soEmBe]);

    const handleSearchUsers = useCallback(async (kw) => {
        try { setSearchingUsers(true); const r = await getUsersForBookingSelectApi(kw, 1); setUsers(r?.data || []); }
        catch { console.error('Lỗi tìm user'); } finally { setSearchingUsers(false); }
    }, []);

    const handleSearchTours = useCallback(async (kw) => {
        try { setSearchingTours(true); const r = await getToursForBookingSelectApi(kw, 1); setTours(r?.data || []); }
        catch { console.error('Lỗi tìm tour'); } finally { setSearchingTours(false); }
    }, []);

    const handleSearchPromos = useCallback(async (kw) => {
        try { setSearchingPromos(true); const r = await getPromotionsForBookingApi(1, kw); setPromotions(r?.data || []); }
        catch { console.error('Lỗi tìm ưu đãi'); } finally { setSearchingPromos(false); }
    }, []);

    const userOptions = useMemo(() => users.map(u => ({
        id: u.maNguoiDung,
        name: u.hoTen + (u.email ? ` (${u.email})` : ''),
    })), [users]);

    const tourOptions = useMemo(() => tours.map(t => ({
        id: t.maTour,
        name: t.tenTour + (t.diemDen ? ` — ${t.diemDen}` : ''),
    })), [tours]);

    const chuyenOptions = useMemo(() => chuyens.map(c => ({
        id: c.maChuyen,
        name: `${c.maChuyenCode} · ${new Date(c.ngayKhoiHanh).toLocaleDateString('vi-VN')} · Còn ${c.soChoConLai ?? 0} chỗ · ${c.giaNguoiLon?.toLocaleString('vi-VN')}₫`,
    })), [chuyens]);

    const promoOptions = useMemo(() => [
        { id: '', name: 'Không áp dụng' },
        ...promotions.map(p => ({
            id: p.maUuDai,
            name: `${p.tenUuDai} ${p.loaiGiam === 1 ? `(${p.giaTriGiam}%)` : `(-${p.giaTriGiam?.toLocaleString('vi-VN')}₫)`}`,
        })),
    ], [promotions]);

    const gioiTinhOpts = [{ id: 'true', name: 'Nam' }, { id: 'false', name: 'Nữ' }];
    const paymentMethodOpts = [
        { id: '2', name: 'Tiền mặt' },
        { id: '3', name: 'Chuyển khoản' },
    ];
    const depositOptions = [
        { id: 30, name: '30%' },
        { id: 50, name: '50%' },
        { id: 100, name: '100% (Thanh toán toàn bộ)' },
    ];

    const selectedUser = users.find(u => u.maNguoiDung === form.maNguoiDung);
    const selectedTour = tours.find(t => t.maTour === form.maTour);
    const selectedChuyen = chuyens.find(c => c.maChuyen === form.maChuyen);
    const totalPax = form.soNguoiLon + form.soTreEm + form.soEmBe;

    const tongTien = useMemo(() => {
        if (!selectedChuyen) return 0;
        const giaNL = selectedChuyen.giaNguoiLon || 0;
        const giaTE = selectedChuyen.giaTreEm || 0;
        const giaEB = selectedChuyen.giaEmBe || 0;
        const phuThuPD = selectedChuyen.phuThuPhongDon || 0;
        const soPhongDon = form.danhSachHanhKhach.filter(k => k.phongDon && k.loaiKhach === 1).length;
        return form.soNguoiLon * giaNL + form.soTreEm * giaTE + form.soEmBe * giaEB + soPhongDon * phuThuPD;
    }, [selectedChuyen, form.soNguoiLon, form.soTreEm, form.soEmBe, form.danhSachHanhKhach]);

    const tienCoc = useMemo(() => {
        if (form.paymentType === 'full') return 0;
        return Math.round(tongTien * (form.tyLeCoc / 100));
    }, [tongTien, form.paymentType, form.tyLeCoc]);

    const soTienConLai = tongTien - tienCoc;

    const validate = () => {
        const e = {};

        if (!form.maNguoiDung) e.maNguoiDung = 'Vui lòng chọn người đặt tour';
        if (!form.maTour) e.maTour = 'Vui lòng chọn tour';
        if (!form.maChuyen) e.maChuyen = 'Vui lòng chọn chuyến khởi hành';
        if (form.soNguoiLon < 1) e.soNguoiLon = 'Tối thiểu 1 người lớn';

        if (selectedChuyen && totalPax > (selectedChuyen.soChoConLai ?? 0))
            e.soNguoiLon = `Vượt quá số chỗ còn lại (${selectedChuyen.soChoConLai} chỗ)`;

        form.danhSachHanhKhach.forEach((kh, i) => {
            if (!kh.hoTen.trim()) e[`hk_hoTen_${i}`] = 'Vui lòng nhập họ tên';
        });

        if (form.paymentType === 'full' && !form.phuongThucThanhToan)
            e.phuongThucThanhToan = 'Vui lòng chọn phương thức thanh toán';

        if (form.paymentType === 'deposit' && !form.phuongThucThanhToan)
            e.phuongThucThanhToan = 'Vui lòng chọn phương thức thanh toán';

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const clrErr = (k) => setErrors(p => ({ ...p, [k]: '' }));

    const handleSubmit = async () => {
        if (!validate()) {
            setTimeout(() => {
                document.querySelector('[data-error="true"]')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 50);
            return;
        }

        setLoading(true);
        try {
            const isFullPayment = form.paymentType === 'full';
            const tyLeCoc = isFullPayment ? 100 : form.tyLeCoc;

            const payload = {
                maNguoiDung: form.maNguoiDung,
                maChuyen: form.maChuyen,
                soNguoiLon: form.soNguoiLon,
                soTreEm: form.soTreEm,
                soEmBe: form.soEmBe,
                danhSachHanhKhach: form.danhSachHanhKhach.map(kh => {
                    const obj = { ...kh, gioiTinh: kh.gioiTinh === 'true' || kh.gioiTinh === true };
                    if (kh.ngaySinh) obj.ngaySinh = new Date(kh.ngaySinh).toISOString();
                    else delete obj.ngaySinh;
                    return obj;
                }),
                maUuDai: form.maUuDai || undefined,
                ghiChu: form.ghiChu || undefined,
                phuongThucThanhToan: form.phuongThucThanhToan,
                maNhanVien: user?.maNhanVien,
                tyLeCoc: tyLeCoc,
            };

            const result = await createBookingAdminApi(payload);
            
            // Xác định trạng thái đơn dựa trên thanh toán
            const orderStatus = isFullPayment ? ORDER_STATUS[3] : ORDER_STATUS[1]; // Đã duyệt hoặc Chờ thanh toán cọc
            const depositStatus = isFullPayment ? DEPOSIT_STATUS[2] : DEPOSIT_STATUS[1]; // Đã thanh toán đủ hoặc Đã đặt cọc
            
            const paymentText = isFullPayment 
                ? 'thanh toán toàn bộ' 
                : `đặt cọc ${form.tyLeCoc}% (${formatCurrency(tienCoc)})`;
            
            toastSuccess(
                'Tạo đơn thành công', 
                `Đã tạo đơn đặt tour cho ${selectedUser?.hoTen || 'khách hàng'} với ${paymentText}. Trạng thái: ${orderStatus}`
            );
            onSuccess?.(result);
            onClose();
        } catch (err) {
            toastError('Tạo đơn thất bại', getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const updatePax = (i, field, val) => {
        setForm(p => ({
            ...p,
            danhSachHanhKhach: p.danhSachHanhKhach.map((kh, idx) => idx === i ? { ...kh, [field]: val } : kh),
        }));
        clrErr(`hk_hoTen_${i}`);
    };

    const togglePhongDon = (i) =>
        setForm(p => ({
            ...p,
            danhSachHanhKhach: p.danhSachHanhKhach.map((kh, idx) => idx === i ? { ...kh, phongDon: !kh.phongDon } : kh),
        }));

    return (
        <div className="fixed inset-0 bg-slate-900/40 z-[999] flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-[1360px] shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-slate-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/60 shrink-0">
                    <div>
                        <h2 className="text-base font-bold text-slate-800">Tạo đơn đặt chỗ mới</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Điền thông tin để tạo đơn đặt tour cho khách hàng</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        disabled={loading}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                    >
                        <X />
                    </button>
                </div>

                {/* Body chính */}
                <div className="overflow-y-auto flex-1 bg-slate-50/30 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* CỘT TRÁI (8/12) */}
                        <div className="lg:col-span-8 space-y-6">
                            
                            {/* Card 1: Khách hàng & Tour */}
                            <SectionCard title="Thông tin cơ bản" accentColor="border-sky-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div data-error={!!errors.maNguoiDung}>
                                        <FieldLabel required>Khách đặt tour</FieldLabel>
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <SelectField
                                                    value={form.maNguoiDung}
                                                    onChange={v => { setForm(p => ({ ...p, maNguoiDung: v })); clrErr('maNguoiDung'); }}
                                                    options={userOptions}
                                                    valueKey="id" labelKey="name"
                                                    placeholder="Tìm khách hàng..."
                                                    searchable
                                                    searchText="Nhập tên hoặc email..."
                                                    onSearch={handleSearchUsers}
                                                    searching={searchingUsers}
                                                    error={errors.maNguoiDung}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowCreateUser(true)}
                                                className="shrink-0 h-[38px] px-3.5 flex items-center justify-center rounded-lg border border-sky-200 text-sky-600 hover:bg-sky-50 text-xs font-semibold transition"
                                            >
                                                Thêm mới
                                            </button>
                                        </div>
                                        {selectedUser && (
                                            <div className="mt-2.5 p-3 bg-sky-50/50 rounded-lg border border-sky-100 text-xs space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Họ và tên:</span>
                                                    <span className="text-slate-700 font-medium">{selectedUser.hoTen}</span>
                                                </div>
                                                {selectedUser.email && (
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Email:</span>
                                                        <span className="text-slate-700 font-medium truncate">{selectedUser.email}</span>
                                                    </div>
                                                )}
                                                {selectedUser.soDienThoai && (
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Điện thoại:</span>
                                                        <span className="text-slate-700 font-medium">{selectedUser.soDienThoai}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div data-error={!!errors.maTour}>
                                        <FieldLabel required>Chọn Tour Du Lịch</FieldLabel>
                                        <SelectField
                                            value={form.maTour}
                                            onChange={v => { setForm(p => ({ ...p, maTour: v, maChuyen: '' })); clrErr('maTour'); }}
                                            options={tourOptions}
                                            valueKey="id" labelKey="name"
                                            placeholder="Tìm tour du lịch..."
                                            searchable
                                            searchText="Nhập tên hoặc điểm đến..."
                                            onSearch={handleSearchTours}
                                            searching={searchingTours}
                                            error={errors.maTour}
                                        />
                                    </div>
                                </div>
                            </SectionCard>

                            {/* Card 2: Chuyến & Số lượng chỗ */}
                            <SectionCard title="Chuyến khởi hành & Số lượng" accentColor="border-indigo-500">
                                <div className="space-y-4">
                                    <div data-error={!!errors.maChuyen}>
                                        <FieldLabel required>Chuyến khởi hành</FieldLabel>
                                        <SelectField
                                            value={form.maChuyen}
                                            onChange={v => { setForm(p => ({ ...p, maChuyen: v })); clrErr('maChuyen'); }}
                                            options={chuyenOptions}
                                            valueKey="id" labelKey="name"
                                            placeholder={
                                                loadingDeps ? 'Đang tải chuyến...'
                                                    : !form.maTour ? 'Chọn tour trước để tải chuyến khởi hành'
                                                        : !chuyenOptions.length ? 'Không tìm thấy chuyến đi phù hợp nào'
                                                            : 'Chọn chuyến khởi hành'
                                            }
                                            disabled={loadingDeps || !form.maTour || !chuyenOptions.length}
                                            searchable={chuyenOptions.length > 5}
                                            searching={loadingDeps}
                                            error={errors.maChuyen}
                                        />
                                        {!loadingDeps && !chuyenOptions.length && form.maTour && (
                                            <p className="text-amber-600 text-xs mt-1.5 font-medium">
                                                Không có lịch chuyến khởi hành khả dụng cho tour này.
                                            </p>
                                        )}
                                    </div>

                                    {selectedChuyen && (
                                        <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-4 text-xs">
                                            <div className="flex justify-between pb-3 border-b border-slate-200">
                                                <span className="font-bold text-slate-700 uppercase tracking-wide">Chi tiết chuyến: {selectedChuyen.maChuyenCode}</span>
                                                <span className="text-emerald-700 font-bold">Còn {selectedChuyen.soChoConLai} chỗ trống</span>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3">
                                                <div>
                                                    <span className="text-slate-400 block mb-0.5">Khởi hành:</span>
                                                    <span className="font-medium text-slate-700">{new Date(selectedChuyen.ngayKhoiHanh).toLocaleDateString('vi-VN')}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block mb-0.5">HDV:</span>
                                                    <span className="font-medium text-slate-700">{selectedChuyen.tenHuongDanVien || 'Chưa phân công'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block mb-0.5">Giá người lớn:</span>
                                                    <span className="font-bold text-slate-700">{formatCurrency(selectedChuyen.giaNguoiLon)}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block mb-0.5">Giá trẻ em:</span>
                                                    <span className="font-bold text-slate-700">{formatCurrency(selectedChuyen.giaTreEm)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Số lượng khách */}
                                    <div className="grid grid-cols-3 gap-4 pt-2">
                                        <div data-error={!!errors.soNguoiLon}>
                                            <FieldLabel required>Người lớn</FieldLabel>
                                            <InputField
                                                type="number" min={1}
                                                value={form.soNguoiLon}
                                                onChange={e => { setForm(p => ({ ...p, soNguoiLon: Math.max(1, parseInt(e.target.value) || 0) })); clrErr('soNguoiLon'); }}
                                                error={errors.soNguoiLon}
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel>Trẻ em</FieldLabel>
                                            <InputField type="number" min={0}
                                                value={form.soTreEm}
                                                onChange={e => setForm(p => ({ ...p, soTreEm: parseInt(e.target.value) || 0 }))}
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel>Em bé</FieldLabel>
                                            <InputField type="number" min={0}
                                                value={form.soEmBe}
                                                onChange={e => setForm(p => ({ ...p, soEmBe: parseInt(e.target.value) || 0 }))}
                                            />
                                        </div>
                                    </div>

                                    {selectedChuyen && (
                                        <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-4 py-3 rounded-lg border border-slate-100 mt-2">
                                            <span>Tổng số hành khách: <strong className="text-slate-700">{totalPax} người</strong></span>
                                            <span className={`font-semibold ${totalPax > (selectedChuyen.soChoConLai ?? 0) ? 'text-red-600' : 'text-emerald-600'}`}>
                                                {totalPax > (selectedChuyen.soChoConLai ?? 0)
                                                    ? `Số lượng vượt mức cho phép (${selectedChuyen.soChoConLai} chỗ)`
                                                    : `Số ghế trống còn lại: ${(selectedChuyen.soChoConLai ?? 0) - totalPax}`}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </SectionCard>

                            {/* Card 3: Danh sách hành khách đi cùng */}
                            {form.danhSachHanhKhach.length > 0 && (
                                <SectionCard title={`Thông tin hành khách (${form.danhSachHanhKhach.length})`} accentColor="border-violet-500">
                                    <div className="rounded-xl border border-slate-200 overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                    <th className="px-3 py-3 w-8 text-center">#</th>
                                                    <th className="px-3 py-3 w-28">Phân loại</th>
                                                    <th className="px-3 py-3 min-w-[90px]">Họ tên *</th>
                                                    <th className="px-3 py-3 min-w-[90px]">Số điện thoại</th>
                                                    {/* <th className="px-3 py-3 min-w-[150px]">Email</th> */}
                                                    <th className="px-3 py-3 w-40">Ngày sinh</th>
                                                    <th className="px-3 py-3 w-24">Giới tính</th>
                                                    <th className="px-3 py-3 w-24 text-center">Phòng đơn</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {form.danhSachHanhKhach.map((kh, i) => (
                                                    <tr key={i} className="hover:bg-slate-50/40 transition-colors" data-error={!!errors[`hk_hoTen_${i}`]}>
                                                        <td className="px-3 py-2.5 text-center font-bold text-slate-400">
                                                            {i + 1}
                                                        </td>
                                                        <td className="px-3 py-2.5"><LoaiBadge loai={kh.loaiKhach} /></td>
                                                        <td className="px-3 py-3">
                                                            <InputField
                                                                value={kh.hoTen}
                                                                onChange={e => updatePax(i, 'hoTen', e.target.value)}
                                                                placeholder="Họ và tên"
                                                                
                                                                error={errors[`hk_hoTen_${i}`]}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-3">
                                                            <InputField
                                                                value={kh.soDienThoai}
                                                                onChange={e => updatePax(i, 'soDienThoai', e.target.value)}
                                                                placeholder="SĐT"
                                                                
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2.5">
                                                            <DatePicker
                                                                value={kh.ngaySinh}
                                                                onChange={v => updatePax(i, 'ngaySinh', v)}
                                                                maxDate={new Date()}
                                                                placeholderText="Ngày sinh"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2.5">
                                                            <SelectField
                                                                value={String(kh.gioiTinh)}
                                                                onChange={v => updatePax(i, 'gioiTinh', v)}
                                                                options={gioiTinhOpts}
                                                                valueKey="id" labelKey="name"
                                                                searchable={false}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2.5">
                                                            <div className="flex justify-center">
                                                                <ToggleSwitch
                                                                    checked={kh.phongDon}
                                                                    onChange={() => togglePhongDon(i)}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </SectionCard>
                            )}
                        </div>

                        {/* CỘT PHẢI (4/12) */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* Card 4: Ưu đãi & Khuyến mãi */}
                            <SectionCard title="Khuyến mại & Ưu đãi" accentColor="border-amber-500">
                                <FieldLabel>Mã ưu đãi áp dụng</FieldLabel>
                                <SelectField
                                    value={form.maUuDai}
                                    onChange={v => setForm(p => ({ ...p, maUuDai: v }))}
                                    options={promoOptions}
                                    valueKey="id" labelKey="name"
                                    placeholder="Không áp dụng ưu đãi"
                                    searchable
                                    searchText="Tìm kiếm mã ưu đãi..."
                                    onSearch={handleSearchPromos}
                                    searching={searchingPromos}
                                />
                            </SectionCard>

                            {/* Card 5: Ghi chú */}
                            <SectionCard title="Ghi chú đơn hàng" accentColor="border-slate-500">
                                <InputField
                                    multiline rows={2}
                                    value={form.ghiChu}
                                    onChange={e => setForm(p => ({ ...p, ghiChu: e.target.value }))}
                                    placeholder="Lưu ý đặc biệt từ khách hàng (nếu có)..."
                                />
                            </SectionCard>

                            {/* Card 6: Thanh toán & Tóm tắt tài chính */}
                            <SectionCard title="Hình thức thanh toán" accentColor="border-emerald-500">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setForm(p => ({ ...p, paymentType: 'full' }))}
                                            className={`p-3.5 rounded-lg border-2 transition-all text-left ${
                                                form.paymentType === 'full'
                                                    ? 'border-sky-500 bg-sky-50/40'
                                                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100/50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                                                    form.paymentType === 'full' ? 'border-sky-500 bg-sky-500' : 'border-slate-300'
                                                }`}>
                                                    {form.paymentType === 'full' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                </div>
                                                <span className="font-bold text-xs">Thanh toán 100%</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-1 ml-5.5">Khách hàng thực hiện thanh toán toàn bộ giá trị tour ngay bây giờ.</p>
                                            <p className="text-[10px] text-sky-600 mt-1 ml-5.5">→ Đơn sẽ ở trạng thái <strong>Đã duyệt</strong></p>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setForm(p => ({ ...p, paymentType: 'deposit' }))}
                                            className={`p-3.5 rounded-lg border-2 transition-all text-left ${
                                                form.paymentType === 'deposit'
                                                    ? 'border-amber-500 bg-amber-50/40'
                                                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100/50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                                                    form.paymentType === 'deposit' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                                                }`}>
                                                    {form.paymentType === 'deposit' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                </div>
                                                <span className="font-bold text-xs">Đặt cọc giữ chỗ</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-1 ml-5.5">Khách hàng thanh toán trước một phần phí để giữ chỗ đặt trước.</p>
                                            <p className="text-[10px] text-amber-600 mt-1 ml-5.5">→ Đơn sẽ ở trạng thái <strong>Chờ thanh toán cọc</strong></p>
                                        </button>
                                    </div>

                                    {/* Cấu hình tỷ lệ đặt cọc */}
                                    {form.paymentType === 'deposit' && (
                                        <div className="p-4 bg-slate-50/40 rounded-lg border border-slate-200/80 space-y-3.5">
                                            <div>
                                                <FieldLabel required>Phần trăm cọc</FieldLabel>
                                                <SelectField
                                                    value={form.tyLeCoc}
                                                    onChange={v => setForm(p => ({ ...p, tyLeCoc: Number(v) }))}
                                                    options={depositOptions}
                                                    valueKey="id" labelKey="name"
                                                />
                                            </div>
                                            
                                            {selectedChuyen && tongTien > 0 && (
                                                <div className="space-y-1.5 pt-2 border-t border-slate-200/50 text-xs">
                                                    <div className="flex justify-between text-slate-500">
                                                        <span>Tổng tiền đơn:</span>
                                                        <span className="font-medium text-slate-800">{formatCurrency(tongTien)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-slate-700 font-bold">
                                                        <span>Tiền cọc cần thu ({form.tyLeCoc}%):</span>
                                                        <span>{formatCurrency(tienCoc)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-slate-500">
                                                        <span>Phần còn lại thu sau:</span>
                                                        <span className="font-medium text-slate-800">{formatCurrency(soTienConLai)}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Summary thanh toán 100% */}
                                    {form.paymentType === 'full' && selectedChuyen && tongTien > 0 && (
                                        <div className="p-3.5 bg-emerald-50/40 rounded-lg border border-emerald-200/80 flex items-center justify-between text-xs">
                                            <span className="font-medium text-slate-600">Tổng thu thực tế:</span>
                                            <span className="text-sm font-bold text-emerald-700">{formatCurrency(tongTien)}</span>
                                        </div>
                                    )}

                                    {/* Phương thức thanh toán */}
                                    <div className="pt-3 border-t border-slate-100" data-error={!!errors.phuongThucThanhToan}>
                                        <FieldLabel required>Phương thức giao dịch</FieldLabel>
                                        <SelectField
                                            value={String(form.phuongThucThanhToan)}
                                            onChange={v => { setForm(p => ({ ...p, phuongThucThanhToan: Number(v) })); clrErr('phuongThucThanhToan'); }}
                                            options={paymentMethodOpts}
                                            valueKey="id" labelKey="name"
                                            placeholder="Chọn phương thức..."
                                            error={errors.phuongThucThanhToan}
                                        />
                                        <div className="mt-2.5 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-500">
                                            {form.phuongThucThanhToan === 2 ? (
                                                <span>Giao dịch thu tiền mặt trực tiếp từ khách hàng.</span>
                                            ) : (
                                                <span>Giao dịch thông qua phương thức Chuyển khoản Ngân hàng.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </SectionCard>

                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 bg-white px-6 py-4.5 flex justify-between items-center shrink-0">
                    <div className="text-xs text-slate-500 hidden md:flex items-center gap-2">
                        <span>{selectedUser?.hoTen || 'Chưa chọn khách'}</span>
                        <span>·</span>
                        <span className="max-w-[200px] truncate">{selectedTour?.tenTour || 'Chưa chọn tour'}</span>
                        {selectedChuyen && (
                            <>
                                <span>·</span>
                                <span className="font-medium text-slate-700">{formatCurrency(tongTien)}</span>
                            </>
                        )}
                        {form.paymentType === 'deposit' && tongTien > 0 && (
                            <span className="text-amber-600 font-semibold">(Cọc {formatCurrency(tienCoc)})</span>
                        )}
                        {form.paymentType === 'full' && (
                            <span className="text-emerald-600 font-semibold">(Thanh toán đủ)</span>
                        )}
                    </div>

                    <div className="flex gap-2.5 ml-auto">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            disabled={loading}
                            className="px-5 py-2.5 text-xs border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-bold transition"
                        >
                            Huỷ bỏ
                        </button>
                        <button 
                            type="button" 
                            onClick={handleSubmit} 
                            disabled={loading}
                            className="px-6 py-2.5 text-xs bg-sky-500 hover:bg-sky-600 active:bg-sky-700 disabled:bg-slate-300 text-white rounded-lg font-bold transition shadow-sm"
                        >
                            {loading ? (
                                'Đang xử lý...'
                            ) : form.paymentType === 'deposit' ? (
                                `Tạo đơn (Cọc ${form.tyLeCoc}%)`
                            ) : (
                                'Tạo đơn (Thanh toán 100%)'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal phụ tạo khách hàng mới */}
            {showCreateUser && (
                <CreateUserModal
                    isOpen={showCreateUser}
                    onClose={() => setShowCreateUser(false)}
                    onSuccess={async ({ email }) => {
                        try {
                            const r = await getUsersForBookingSelectApi(email, 1);
                            const found = r?.data?.find(u => u.email === email) ?? r?.data?.[0];
                            if (found) {
                                setUsers(prev => [found, ...prev]);
                                setForm(p => ({ ...p, maNguoiDung: found.maNguoiDung }));
                                clrErr('maNguoiDung');
                            } else {
                                toastError('Không tìm thấy khách hàng vừa tạo, vui lòng tìm thủ công.');
                            }
                        } catch {
                            toastError('Lỗi khi tải lại danh sách khách hàng.');
                        } finally {
                            setShowCreateUser(false);
                        }
                    }}
                />
            )}
        </div>
    );
}