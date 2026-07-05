import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    X, Ticket, Loader2, AlertCircle,
    Users2, CalendarDays, CreditCard, StickyNote,
    MapPin, ChevronRight, Tag,
} from 'lucide-react';
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

function SectionCard({ title, icon, children }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-50 rounded-t-2xl">
                {icon}
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</span>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

function FieldLabel({ children, required }) {
    return (
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
            {children}{required && <span className="text-red-400 ml-0.5">*</span>}
        </p>
    );
}

const ToggleSwitch = ({ checked, onChange, label }) => (
    <label className="flex items-center justify-between gap-3 cursor-pointer select-none group">
        <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-700 transition">{label}</span>
        <button
            type="button" role="switch" aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none
                ${checked ? 'bg-sky-500' : 'bg-slate-200'}`}
        >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200
                ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    </label>
);

const LoaiBadge = ({ loai }) => {
    const cfg = {
        1: ['Người lớn', 'text-sky-700'],
        2: ['Trẻ em', 'text-violet-700'],
        3: ['Em bé', 'text-pink-700'],
    }[loai] ?? ['?', 'text-slate-500'];
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg[1]}`}>{cfg[0]}</span>;
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
        thanhToanNgay: true,
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

    const selectedUser = users.find(u => u.maNguoiDung === form.maNguoiDung);
    const selectedTour = tours.find(t => t.maTour === form.maTour);
    const selectedChuyen = chuyens.find(c => c.maChuyen === form.maChuyen);
    const totalPax = form.soNguoiLon + form.soTreEm + form.soEmBe;

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

        if (form.thanhToanNgay && !form.phuongThucThanhToan)
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
                thanhToanNgay: form.thanhToanNgay,
                phuongThucThanhToan: form.phuongThucThanhToan,
                maNhanVien: user?.maNhanVien,
            };

            const result = await createBookingAdminApi(payload);
            toastSuccess('Tạo đơn thành công', `Đã tạo đơn đặt tour cho ${selectedUser?.hoTen || 'khách hàng'}.`);
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
        <div className="fixed inset-0 bg-slate-600/20  z-[1000] flex justify-center items-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-[1340px] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-100">

    
                <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white shrink-0">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="inline-flex items-center gap-1.5 bg-sky-500 text-white px-3 py-1 rounded-lg text-sm font-bold tracking-wide">
                                <Ticket size={13} /> Tạo đơn mới
                            </div>
                            {selectedTour && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                                    <MapPin size={11} />{selectedTour.name}
                                </span>
                            )}
                            {selectedChuyen && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border bg-indigo-50 text-indigo-700 border-indigo-200">
                                    <CalendarDays size={11} />
                                    {new Date(selectedChuyen.ngayKhoiHanh).toLocaleDateString('vi-VN')}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-[13px] text-slate-500 flex-wrap">
                            {selectedUser && <span className="flex items-center gap-1"><Users2 size={11} />{selectedUser.hoTen}</span>}
                            <span className="flex items-center gap-1"><Users2 size={11} />{totalPax} khách</span>
                            <span className="text-slate-400">Người tạo: {user?.hoTen || 'Quản trị viên'}</span>
                        </div>
                    </div>
                    <button onClick={onClose} disabled={loading}
                        className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition">
                        <X size={18} />
                    </button>
                </div>


                <div className="overflow-y-auto flex-1 bg-slate-50/40">
                    <div className="p-6 space-y-4">


                        <SectionCard title="Thông tin đặt tour" icon={<Users2 size={14} className="text-sky-500" />}>
                            <div className="grid grid-cols-1 gap-5">
                                <div data-error={!!errors.maNguoiDung}>
                                    <FieldLabel required>Người đặt</FieldLabel>
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
                                    {selectedUser && (
                                        <div className="mt-2 p-3 bg-sky-50 rounded-xl border border-sky-100 text-xs grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                                            <span className="text-sky-500 font-semibold">Họ tên</span>
                                            <span className="text-slate-700">{selectedUser.hoTen}</span>
                                            {selectedUser.email && <>
                                                <span className="text-sky-500 font-semibold">Email</span>
                                                <span className="text-slate-700 truncate">{selectedUser.email}</span>
                                            </>}
                                            {selectedUser.soDienThoai && <>
                                                <span className="text-sky-500 font-semibold">SĐT</span>
                                                <span className="text-slate-700">{selectedUser.soDienThoai}</span>
                                            </>}
                                        </div>
                                    )}
                                </div>

                                <div data-error={!!errors.maTour}>
                                    <FieldLabel required>Tour</FieldLabel>
                                    <SelectField
                                        value={form.maTour}
                                        onChange={v => { setForm(p => ({ ...p, maTour: v, maChuyen: '' })); clrErr('maTour'); }}
                                        options={tourOptions}
                                        valueKey="id" labelKey="name"
                                        placeholder="Tìm tour..."
                                        searchable
                                        searchText="Nhập tên tour hoặc điểm đến..."
                                        onSearch={handleSearchTours}
                                        searching={searchingTours}
                                        error={errors.maTour}
                                    />
                                    {selectedTour && (
                                        <div className="mt-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                                            <span className="text-emerald-500 font-semibold">Tên tour</span>
                                            <span className="text-slate-700">{selectedTour.tenTour}</span>
                                            {selectedTour.diemKhoiHanh && <>
                                                <span className="text-emerald-500 font-semibold">Điểm đi</span>
                                                <span className="text-slate-700">{selectedTour.diemKhoiHanh}</span>
                                            </>}
                                            {selectedTour.diemDen && <>
                                                <span className="text-emerald-500 font-semibold">Điểm đến</span>
                                                <span className="text-slate-700">{selectedTour.diemDen}</span>
                                            </>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard title="Chuyến khởi hành" icon={<CalendarDays size={14} className="text-sky-500" />}>
                            <div data-error={!!errors.maChuyen}>
                                <FieldLabel required>Chọn chuyến</FieldLabel>
                                <SelectField
                                    value={form.maChuyen}
                                    onChange={v => { setForm(p => ({ ...p, maChuyen: v })); clrErr('maChuyen'); }}
                                    options={chuyenOptions}
                                    valueKey="id" labelKey="name"
                                    placeholder={
                                        loadingDeps ? 'Đang tải chuyến...'
                                            : !form.maTour ? 'Chọn tour trước'
                                                : !chuyenOptions.length ? 'Không có chuyến nào'
                                                    : 'Chọn chuyến khởi hành'
                                    }
                                    disabled={loadingDeps || !form.maTour || !chuyenOptions.length}
                                    searchable={chuyenOptions.length > 5}
                                    searching={loadingDeps}
                                    error={errors.maChuyen}
                                />
                                {!loadingDeps && !chuyenOptions.length && form.maTour && (
                                    <p className="flex items-center gap-1 text-amber-500 text-xs mt-1">
                                        <AlertCircle size={11} /> Không có chuyến khởi hành cho tour này
                                    </p>
                                )}
                            </div>
                            {selectedChuyen && (
                                <div className="mt-3 rounded-xl border border-slate-200 overflow-hidden">
                                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
                                        <CalendarDays size={13} className="text-indigo-500" />
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                                            Chi tiết chuyến — <span className="font-mono">{selectedChuyen.maChuyenCode}</span>
                                        </span>
                                        <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                                            Còn {selectedChuyen.soChoConLai} chỗ
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 p-4">
                                        {[
                                            ['Ngày KH', new Date(selectedChuyen.ngayKhoiHanh).toLocaleDateString('vi-VN')],
                                            ['HDV', selectedChuyen.tenHuongDanVien || '—'],
                                            ['Giá NL', <span className="font-semibold text-slate-700">{selectedChuyen.giaNguoiLon?.toLocaleString('vi-VN')}₫</span>],
                                            ['Giá TE', <span className="font-semibold text-slate-700">{selectedChuyen.giaTreEm?.toLocaleString('vi-VN')}₫</span>],
                                            ['Giá EB', <span className="font-semibold text-slate-700">{selectedChuyen.giaEmBe?.toLocaleString('vi-VN')}₫</span>],
                                            ['Phụ thu PĐ', <span className="font-semibold text-slate-700">{selectedChuyen.phuThuPhongDon?.toLocaleString('vi-VN')}₫</span>],
                                        ].map(([label, val]) => (
                                            <div key={label} className="space-y-0.5">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                                                <p className="text-sm text-slate-700">{val}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </SectionCard>

                        <SectionCard title="Số lượng khách" icon={<Users2 size={14} className="text-sky-500" />}>
                            <div className="grid grid-cols-3 gap-5">
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
                                    <FieldLabel>Trẻ em (2–11 tuổi)</FieldLabel>
                                    <InputField type="number" min={0}
                                        value={form.soTreEm}
                                        onChange={e => setForm(p => ({ ...p, soTreEm: parseInt(e.target.value) || 0 }))}
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Em bé (dưới 2 tuổi)</FieldLabel>
                                    <InputField type="number" min={0}
                                        value={form.soEmBe}
                                        onChange={e => setForm(p => ({ ...p, soEmBe: parseInt(e.target.value) || 0 }))}
                                    />
                                </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
                                <Users2 size={12} />
                                Tổng: <span className="font-semibold text-slate-600">{totalPax} khách</span>
                                {selectedChuyen && (
                                    <span className={`ml-1 font-semibold ${totalPax > (selectedChuyen.soChoConLai ?? 0) ? 'text-red-500' : 'text-emerald-600'}`}>
                                        {totalPax > (selectedChuyen.soChoConLai ?? 0)
                                            ? `· Vượt quá số chỗ còn lại (${selectedChuyen.soChoConLai})`
                                            : `· Còn ${(selectedChuyen.soChoConLai ?? 0) - totalPax} chỗ sau khi đặt`}
                                    </span>
                                )}
                            </div>
                        </SectionCard>
                        {form.danhSachHanhKhach.length > 0 && (
                            <SectionCard title={`Hành khách (${form.danhSachHanhKhach.length})`} icon={<Users2 size={14} className="text-sky-500" />}>
                                <div className="rounded-xl border border-slate-200 overflow-x-auto overflow-y-visible">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                <th className="px-3 py-2.5 w-8">#</th>
                                                <th className="px-3 py-2.5">Loại</th>
                                                <th className="px-3 py-2.5">Họ và tên *</th>
                                                <th className="px-3 py-2.5">Số điện thoại</th>
                                                <th className="px-3 py-2.5">Email</th>
                                                <th className="px-3 py-2.5">Ngày sinh</th>
                                                <th className="px-3 py-2.5">Giới tính</th>
                                                <th className="px-3 py-2.5 text-center">Phòng đơn</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {form.danhSachHanhKhach.map((kh, i) => (
                                                <tr key={i} className="hover:bg-slate-50/60 transition-colors"
                                                    data-error={!!errors[`hk_hoTen_${i}`]}>
                                                    <td className="px-3 py-2">
                                                        <span className="text-[10px] font-bold text-slate-400">#{i + 1}</span>
                                                    </td>
                                                    <td className="px-3 py-2"><LoaiBadge loai={kh.loaiKhach} /></td>
                                                    <td className="px-3 py-2 min-w-[160px]">
                                                        <InputField
                                                            value={kh.hoTen}
                                                            onChange={e => updatePax(i, 'hoTen', e.target.value)}
                                                            placeholder="Họ và tên"
                                                            className="!py-1.5"
                                                            error={errors[`hk_hoTen_${i}`]}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 min-w-[130px]">
                                                        <InputField
                                                            value={kh.soDienThoai}
                                                            onChange={e => updatePax(i, 'soDienThoai', e.target.value)}
                                                            placeholder="SĐT"
                                                            className="!py-1.5"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 min-w-[160px]">
                                                        <InputField
                                                            type="email"
                                                            value={kh.email}
                                                            onChange={e => updatePax(i, 'email', e.target.value)}
                                                            placeholder="Email"
                                                            className="!py-1.5"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 min-w-[140px]">
                                                        <DatePicker
                                                            value={kh.ngaySinh}
                                                            onChange={v => updatePax(i, 'ngaySinh', v)}
                                                            maxDate={new Date()}
                                                            placeholderText="Ngày sinh"
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 min-w-[130px]">
                                                        <SelectField
                                                            value={String(kh.gioiTinh)}
                                                            onChange={v => updatePax(i, 'gioiTinh', v)}
                                                            options={gioiTinhOpts}
                                                            valueKey="id" labelKey="name"
                                                            searchable={false}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2 min-w-[110px]">
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

                        <SectionCard title="Ưu đãi / Khuyến mãi" icon={<Tag size={14} className="text-sky-500" />}>
                            <FieldLabel>Chọn ưu đãi</FieldLabel>
                            <SelectField
                                value={form.maUuDai}
                                onChange={v => setForm(p => ({ ...p, maUuDai: v }))}
                                options={promoOptions}
                                valueKey="id" labelKey="name"
                                placeholder="Không áp dụng"
                                searchable
                                searchText="Tìm mã ưu đãi..."
                                onSearch={handleSearchPromos}
                                searching={searchingPromos}
                            />
                        </SectionCard>
                        <SectionCard title="Ghi chú" icon={<StickyNote size={14} className="text-sky-500" />}>
                            <InputField
                                multiline rows={3}
                                value={form.ghiChu}
                                onChange={e => setForm(p => ({ ...p, ghiChu: e.target.value }))}
                                placeholder="Ghi chú thêm cho đơn hàng (nếu có)..."
                            />
                        </SectionCard>
                        <SectionCard title="Thanh toán" icon={<CreditCard size={14} className="text-sky-500" />}>
                            <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <ToggleSwitch
                                    checked={form.thanhToanNgay}
                                    onChange={v => setForm(p => ({ ...p, thanhToanNgay: v }))}
                                    label="Thu tiền ngay khi tạo đơn"
                                />
                                {!form.thanhToanNgay && (
                                    <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                                        <AlertCircle size={11} />
                                        Đơn sẽ ở trạng thái <strong className="ml-0.5">Chờ duyệt</strong>, chưa có bản ghi thanh toán.
                                    </p>
                                )}
                            </div>

                            {form.thanhToanNgay && (
                                <div data-error={!!errors.phuongThucThanhToan}>
                                    <FieldLabel required>Phương thức thanh toán</FieldLabel>
                                    <SelectField
                                        value={String(form.phuongThucThanhToan)}
                                        onChange={v => { setForm(p => ({ ...p, phuongThucThanhToan: Number(v) })); clrErr('phuongThucThanhToan'); }}
                                        options={paymentMethodOpts}
                                        valueKey="id" labelKey="name"
                                        placeholder="Chọn phương thức thanh toán"
                                        error={errors.phuongThucThanhToan}
                                    />
                                    <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 p-3">
                                        {form.phuongThucThanhToan === 2 && (
                                            <p className="text-xs text-slate-600">Thu tiền mặt trực tiếp tại quầy.</p>
                                        )}
                                        {form.phuongThucThanhToan === 3 && (
                                            <p className="text-xs text-slate-600">Thanh toán bằng chuyển khoản ngân hàng.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </SectionCard>
                    </div>
                </div>
                <div className="border-t border-slate-100 bg-white px-6 py-4 flex flex-wrap justify-between items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                        <span>{selectedUser?.hoTen || 'Chưa chọn KH'}</span>
                        <ChevronRight size={11} />
                        <span>{selectedTour?.tenTour || 'Chưa chọn tour'}</span>
                        <ChevronRight size={11} />
                        <span>{selectedChuyen?.maChuyenCode || 'Chưa chọn chuyến'}</span>
                        <ChevronRight size={11} />
                        <span className="font-semibold text-slate-500">
                            {form.danhSachHanhKhach.filter(k => k.hoTen.trim()).length}/{totalPax} hành khách
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={onClose} disabled={loading}
                            className="px-5 py-2.5 text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold transition">
                            Huỷ
                        </button>
                        <button type="button" onClick={handleSubmit} disabled={loading}
                            className="px-7 py-2.5 text-sm bg-sky-500 hover:bg-sky-600 active:bg-sky-700 disabled:bg-slate-300 text-white rounded-xl font-bold flex items-center gap-2 transition shadow shadow-sky-200">
                            {loading
                                ? <><Loader2 size={15} className="animate-spin" />Đang tạo...</>
                                : 'Tạo đơn đặt tour'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}