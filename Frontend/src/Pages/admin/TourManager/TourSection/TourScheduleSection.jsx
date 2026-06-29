import { Settings, X, Edit, Trash2, Loader2 } from "lucide-react";
import InputField from "~/components/UI/Form/InputField";
import SelectField from "~/components/UI/Form/SelectField";
import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { getAllVehicleApi } from "~/Services/VehicleService";
import { getAllTourGuideApi } from "~/Services/TourGuideService";
import { toastSuccess, toastError, toastWarning } from "~/utils/Toast";
import ConfirmModal from "~/components/UI/Modal/ConfirmModal";
import { getProvincesApi } from "~/Services/ProvinceService";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import DateTimePicker from "~/components/UI/Form/DateTimePicker";
import { getDate } from "date-fns";
registerLocale("vi", vi);
const DIEM_DI_OPTIONS = [
    { value: "Hồ Chí Minh", label: "Hồ Chí Minh" },
    { value: "Đà Nẵng", label: "Đà Nẵng" },
    { value: "Hà Nội", label: "Hà Nội" }
];

const EMPTY_GIA = {
    hangKhachSan: "",
    giaNguoiLon: "",
    giaTreEm: "",
    giaEmBe: "",
    phuThuPhongDon: ""
};

const makeEmptySchedule = () => ({
    tempId: Date.now() + Math.random(),
    maChuyen: null,
    maChuyenCode: "",
    maHDV: "",
    maPhuongTien: "",
    diemKhoiHanh: "",
    diemDen: "",
    ngayKhoiHanh: null,
    gioDenNoiDi: null,
    ngayKetThuc: null,
    gioDenNoiVe: null,
    soChoToiDa: "",
    ghiChu: "",
    gia: { ...EMPTY_GIA }
});



const getVal = (e) => e?.target?.value ?? e;

const isValidNonNegativeNumber = (val) => {
    if (val === "" || val == null) return false;
    const num = Number(val);
    return !Number.isNaN(num) && num >= 0;
};



const validateDeparture = (item) => {
    const errs = {};

    if (!item.maHDV) errs.maHDV = "Vui lòng chọn hướng dẫn viên";
    if (!item.maPhuongTien) errs.maPhuongTien = "Vui lòng chọn phương tiện";
    if (!item.diemKhoiHanh?.trim()) errs.diemKhoiHanh = "Vui lòng chọn điểm khởi hành";
    if (!item.diemDen?.trim()) errs.diemDen = "Vui lòng nhập điểm đến";

    if (
        item.diemKhoiHanh?.trim() &&
        item.diemDen?.trim() &&
        item.diemKhoiHanh.trim().toLowerCase() === item.diemDen.trim().toLowerCase()
    ) {
        errs.diemDen = "Điểm đến không được trùng với điểm khởi hành";
    }

    if (!item.soChoToiDa || !isValidNonNegativeNumber(item.soChoToiDa) || Number(item.soChoToiDa) <= 0) {
        errs.soChoToiDa = "Số lượng chỗ phải là số lớn hơn 0";
    }

    if (!item.ngayKhoiHanh) errs.ngayKhoiHanh = "Vui lòng nhập ngày khởi hành";
    if (!item.gioDenNoiDi) errs.gioDenNoiDi = "Vui lòng nhập giờ đến nơi đi";
    if (!item.ngayKetThuc) errs.ngayKetThuc = "Vui lòng nhập ngày kết thúc";
    if (!item.gioDenNoiVe) errs.gioDenNoiVe = "Vui lòng nhập giờ đến nơi về";

    const toDate = (val) => {
        if (!val) return null;

        const d = val instanceof Date
            ? val
            : new Date(val);

        return isNaN(d.getTime())
            ? null
            : d;
    };

    const ngayKD = toDate(item.ngayKhoiHanh);
    const ngayKT = toDate(item.ngayKetThuc);
    const gioDi = toDate(item.gioDenNoiDi);
    const gioVe = toDate(item.gioDenNoiVe);
    const now = new Date();

    if (ngayKD && ngayKD < now) errs.ngayKhoiHanh = "Ngày giờ khởi hành phải lớn hơn hiện tại";
    if (gioDi && gioDi < now) errs.gioDenNoiDi = "Ngày giờ đến nơi phải lớn hơn hiện tại";
    if (ngayKT && ngayKT < now) errs.ngayKetThuc = "Ngày giờ kết thúc phải lớn hơn hiện tại";
    if (gioVe && gioVe < now) errs.gioDenNoiVe = "Ngày giờ về phải lớn hơn hiện tại";

    if (ngayKD && gioDi && gioDi <= ngayKD) errs.gioDenNoiDi = "Ngày giờ đến nơi phải sau ngày giờ khởi hành";
    if (gioDi && ngayKT && ngayKT <= gioDi) errs.ngayKetThuc = "Ngày giờ kết thúc phải sau ngày giờ đến nơi";
    if (ngayKT && gioVe && gioVe <= ngayKT) errs.gioDenNoiVe = "Ngày giờ về phải sau ngày giờ kết thúc";

    if (ngayKD && gioDi && ngayKT && gioVe) {
        const ok = ngayKD < gioDi && gioDi < ngayKT && ngayKT < gioVe;
        if (!ok) errs.gioDenNoiVe = "Chuỗi thời gian chuyến đi không hợp lệ";
    }

    if (!item.gia?.hangKhachSan?.toString().trim()) errs.hangKhachSan = "Vui lòng nhập hạng khách sạn";
    if (!isValidNonNegativeNumber(item.gia?.giaNguoiLon)) errs.giaNguoiLon = "Giá người lớn không hợp lệ";
    if (!isValidNonNegativeNumber(item.gia?.giaTreEm)) errs.giaTreEm = "Giá trẻ em không hợp lệ";
    if (!isValidNonNegativeNumber(item.gia?.giaEmBe)) errs.giaEmBe = "Giá em bé không hợp lệ";

    const phu = item.gia?.phuThuPhongDon;
    if (phu != null && phu !== "" && !isValidNonNegativeNumber(phu))
        errs.phuThuPhongDon = "Phụ thu phòng đơn không hợp lệ";

    return errs;
};



const TourScheduleSection = forwardRef(({ value = [], onChange, isViewMode = false }, ref) => {
    const [vehicles, setVehicles] = useState([]);
    const [guides, setGuides] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [modalErrors, setModalErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [showConfirmUpdate, setShowConfirmUpdate] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const safeData = Array.isArray(value) ? value : [];
    const [provinces, setProvinces] = useState([]);
    const [provincesLoading, setProvincesLoading] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vehicleRes, guideRes] = await Promise.all([
                    getAllVehicleApi(),
                    getAllTourGuideApi()
                ]);
                setVehicles(Array.isArray(vehicleRes) ? vehicleRes : []);
                setGuides(
                    (guideRes.data || guideRes || []).map(({ maNhanVien, hoTen }) => ({
                        maHDV: maNhanVien,
                        tenHDV: hoTen
                    }))
                );
            } catch {
                toastError("Tải dữ liệu thất bại", "Không thể tải danh sách phương tiện hoặc hướng dẫn viên.");
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                setProvincesLoading(true);
                const data = await getProvincesApi();
                setProvinces(Array.isArray(data) ? data : []);
            } catch {
                toastError("Tải dữ liệu thất bại", "Không thể tải danh sách tỉnh/thành phố.");
            } finally {
                setProvincesLoading(false);
            }
        };
        fetchProvinces();
    }, []);


    // ── Imperative handle ──────────────────────────────────────────────────────

    useImperativeHandle(ref, () => ({
        openModal: () => {
            setCurrentSchedule(makeEmptySchedule());
            setIsEditMode(false);
            setModalErrors({});
            setIsSaving(false);
            setShowModal(true);
        },
        openEditModal: (item) => {
            setCurrentSchedule(JSON.parse(JSON.stringify(item)));
            setIsEditMode(true);
            setModalErrors({});
            setIsSaving(false);
            setShowModal(true);
        },
        validateAll: () => {
            if (safeData.length === 0) return true;
            for (const item of safeData) {
                const errs = validateDeparture(item);
                if (Object.keys(errs).length > 0) {
                    toastWarning(
                        "Thiếu thông tin",
                        `Chuyến ${item.maChuyenCode || "(chưa có mã)"} chưa nhập đầy đủ hoặc dữ liệu không hợp lệ.`
                    );
                    setCurrentSchedule(JSON.parse(JSON.stringify(item)));
                    setIsEditMode(true);
                    setModalErrors(errs);
                    setIsSaving(false);
                    setShowModal(true);
                    return false;
                }
            }
            return true;
        }
    }), [safeData]);

    const handleFieldChange = useCallback((field, val) => {
        setCurrentSchedule(prev => ({ ...prev, [field]: val }));
        // Xóa lỗi của field đó ngay khi user chọn/nhập
        setModalErrors(prev => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }, []);

    const handleGiaChange = useCallback((field, val) => {
        setCurrentSchedule(prev => ({ ...prev, gia: { ...prev.gia, [field]: val } }));
        setModalErrors(prev => prev[field] ? { ...prev, [field]: null } : prev);
    }, []);

    const handleFieldBlur = useCallback((field) => {
        if (!currentSchedule) return;
        const errs = validateDeparture(currentSchedule);
        setModalErrors(prev => ({ ...prev, [field]: errs[field] ?? null }));
    }, [currentSchedule]);



    const handleClose = useCallback(() => {
        if (isSaving) return;
        setShowModal(false);
        setCurrentSchedule(null);
        setModalErrors({});
    }, [isSaving]);
    const doSave = async () => {
        const exists = safeData.some(
            ch => ch.tempId === currentSchedule.tempId
        );

        const updatedList = exists
            ? safeData.map(ch =>
                ch.tempId === currentSchedule.tempId
                    ? currentSchedule
                    : ch
            )
            : [...safeData, currentSchedule];

        try {
            setIsSaving(true);

            await onChange?.(updatedList);

            toastSuccess(
                "Thành công",
                exists
                    ? "Cập nhật chuyến khởi hành thành công."
                    : "Thêm chuyến khởi hành thành công."
            );

            setShowModal(false);
        } catch (err) {
            toastError(
                "Lỗi",
                err?.message || "Không thể lưu chuyến khởi hành."
            );
        } finally {
            setIsSaving(false);
        }
    };
    const handleSave = () => {
        if (!currentSchedule || isSaving) return;

        const errs = validateDeparture(currentSchedule);

        if (Object.keys(errs).length > 0) {
            setModalErrors(errs);

            toastWarning(
                "Dữ liệu chưa hợp lệ",
                "Vui lòng kiểm tra lại các trường được đánh dấu đỏ."
            );

            return;
        }

        // Chỉ confirm khi sửa
        if (isEditMode) {
            setShowConfirmUpdate(true);
            return;
        }

        // Thêm mới thì lưu luôn
        doSave();
    };
    // const handleSave = async () => {
    //     if (!currentSchedule || isSaving) return;

    //     const errs = validateDeparture(currentSchedule);
    //     if (Object.keys(errs).length > 0) {
    //         setModalErrors(errs);
    //         toastWarning("Dữ liệu chưa hợp lệ", "Vui lòng kiểm tra lại các trường được đánh dấu đỏ.");
    //         return;
    //     }

    //     const exists = safeData.some(ch => ch.tempId === currentSchedule.tempId);
    //     const updatedList = exists
    //         ? safeData.map(ch => ch.tempId === currentSchedule.tempId ? currentSchedule : ch)
    //         : [...safeData, currentSchedule];

    //     try {
    //         setIsSaving(true);
    //         await onChange?.(updatedList);
    //         toastSuccess(
    //             "Thành công",
    //             exists ? "Cập nhật chuyến khởi hành thành công." : "Thêm chuyến khởi hành thành công."
    //         );
    //         setShowModal(false);
    //     } catch (err) {
    //         // Hiển thị lỗi từ server (ví dụ: "Ngày khởi hành phải nhỏ hơn ngày kết thúc")
    //         toastError("Lỗi", err?.message || "Không thể lưu chuyến khởi hành.");
    //     } finally {
    //         setIsSaving(false);
    //     }
    // };
    const doDelete = async () => {
        if (!currentSchedule || isSaving) return;

        const label = currentSchedule.maChuyenCode
            ? `chuyến "${currentSchedule.maChuyenCode}"`
            : "chuyến khởi hành này";

        const updatedList = safeData.filter(
            ch => ch.tempId !== currentSchedule.tempId
        );

        try {
            setIsSaving(true);

            await onChange?.(updatedList);

            toastSuccess(
                "Đã xóa",
                `Xóa ${label} thành công.`
            );

            setShowModal(false);
            setCurrentSchedule(null);
            setModalErrors({});
        } catch (err) {
            toastError(
                "Lỗi",
                err?.message || "Không thể xóa chuyến khởi hành."
            );
        } finally {
            setIsSaving(false);
        }
    };
    const handleDelete = () => {
        if (!currentSchedule || isSaving) return;

        setShowConfirmDelete(true);
    };
    // const handleDelete = async () => {
    //     if (!currentSchedule || isSaving) return;

    //     const label = currentSchedule.maChuyenCode
    //         ? `chuyến "${currentSchedule.maChuyenCode}"`
    //         : "chuyến khởi hành này";

    //     const updatedList = safeData.filter(ch => ch.tempId !== currentSchedule.tempId);

    //     try {
    //         setIsSaving(true);
    //         await onChange?.(updatedList);
    //         toastSuccess("Đã xóa", `Xóa ${label} thành công.`);
    //         setShowModal(false);
    //         setCurrentSchedule(null);
    //         setModalErrors({});
    //     } catch (err) {
    //         toastError("Lỗi", err?.message || "Không thể xóa chuyến khởi hành.");
    //     } finally {
    //         setIsSaving(false);
    //     }
    // };



    if (!showModal || !currentSchedule) return null;

    const isView = isViewMode;
    const disabled = isView || isSaving;
    const isSavedInDB = !!currentSchedule.maChuyen;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh]">

                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        {isEditMode
                            ? <Edit size={18} className="text-sky-500" />
                            : <Settings size={18} className="text-slate-500" />
                        }
                        <h2 className="text-sm font-bold text-slate-800">
                            {isEditMode
                                ? (isView ? "Chi tiết chuyến khởi hành" : "Cập nhật chuyến khởi hành")
                                : "Thêm chuyến khởi hành mới"
                            }
                        </h2>
                        {/* Hiển thị mã chuyến sau khi đã lưu vào DB */}
                        {isSavedInDB && currentSchedule.maChuyenCode && (
                            <span className="px-2 py-0.5 text-xs font-mono font-semibold
                                             bg-sky-50 text-sky-700 border border-sky-200 rounded-lg">
                                {currentSchedule.maChuyenCode}
                            </span>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSaving}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition disabled:opacity-40"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-5 overflow-y-auto flex-1">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                HƯỚNG DẪN VIÊN <span className="text-red-500">*</span>
                            </label>
                            <SelectField
                                searchable
                                searchText="Tìm hướng dẫn viên"
                                value={currentSchedule.maHDV || ""}
                                options={guides}
                                valueKey="maHDV"
                                labelKey="tenHDV"
                                error={modalErrors.maHDV}
                                onChange={(e) => handleFieldChange("maHDV", getVal(e))}
                                disabled={disabled}
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                PHƯƠNG TIỆN <span className="text-red-500">*</span>
                            </label>
                            <SelectField
                                value={currentSchedule.maPhuongTien || ""}
                                options={vehicles}
                                valueKey="maPhuongTien"
                                labelKey="tenPhuongTien"
                                error={modalErrors.maPhuongTien}
                                onChange={(e) => handleFieldChange("maPhuongTien", getVal(e))}
                                disabled={disabled}
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                ĐIỂM ĐI <span className="text-red-500">*</span>
                            </label>
                            <SelectField
                                value={currentSchedule.diemKhoiHanh || ""}
                                options={DIEM_DI_OPTIONS}
                                valueKey="value"
                                labelKey="label"
                                error={modalErrors.diemKhoiHanh}
                                onChange={(e) => handleFieldChange("diemKhoiHanh", getVal(e))}
                                disabled={disabled}
                            />
                        </div>
                        <InputField
                            type="number"
                            label="SỐ LƯỢNG CHỖ"
                            value={currentSchedule.soChoToiDa || ""}
                            error={modalErrors.soChoToiDa}
                            onChange={(e) => handleFieldChange("soChoToiDa", getVal(e))}
                            onBlur={() => handleFieldBlur("soChoToiDa")}
                            disabled={disabled}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                            ĐIỂM ĐẾN <span className="text-red-500">*</span>
                        </label>

                        <SelectField
                            searchable
                            searchText="Tìm tỉnh / thành phố..."
                            value={currentSchedule.diemDen || ""}
                            options={provinces}
                            valueKey="name"
                            labelKey="name"
                            placeholder="Chọn tỉnh / thành phố"
                            error={modalErrors.diemDen}
                            searching={provincesLoading}
                            onChange={(val) => {
                                handleFieldChange("diemDen", val);
                                setModalErrors(prev => ({ ...prev, diemDen: null }));
                            }}
                            disabled={disabled}
                        />
                    </div>



                    {/* Timeline */}
                    <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-200 pb-1">
                            CHI TIẾT MỐC THỜI GIAN LỊCH TRÌNH
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { field: "ngayKhoiHanh", label: "NGÀY GIỜ KHỞI HÀNH", minDate: getDate(), disableToday: false },
                                { field: "gioDenNoiDi", label: "NGÀY GIỜ ĐẾN NƠI", minDate: getDate(), disableToday: false },
                                { field: "ngayKetThuc", label: "NGÀY GIỜ KẾT THÚC", minDate: getDate(), disableToday: false },
                                { field: "gioDenNoiVe", label: "NGÀY GIỜ ĐẾN NƠI VỀ", minDate: getDate(), disableToday: false },
                            ].map(({ field, label, minDate, disableToday }) => (
                                <div key={field} className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                        {label}
                                        <span className="ml-1 text-red-500">*</span>
                                    </label>

                                    <DateTimePicker
                                        placeholderText="Chọn ngày giờ"
                                        value={currentSchedule[field] ? new Date(currentSchedule[field]) : null}
                                        onChange={(date) => handleFieldChange(field, date)}
                                        onBlur={() => handleFieldBlur(field)}
                                        disabled={disabled}
                                        error={modalErrors[field]}
                                        minDate={minDate}
                                        disableToday={disableToday}
                                    />

                                    {modalErrors[field] && (
                                        <p className="text-xs text-red-600">{modalErrors[field]}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-200 pb-1">
                            ĐƠN GIÁ PHÂN LOẠI KHÁCH HÀNG (VND)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

                            {[
                                { field: "giaNguoiLon", label: "GIÁ NGƯỜI LỚN" },
                                { field: "giaTreEm", label: "GIÁ TRẺ EM" },
                                { field: "giaEmBe", label: "GIÁ EM BÉ" },
                                { field: "phuThuPhongDon", label: "PHỤ THU PHÒNG ĐƠN" }
                            ].map(({ field, label }) => (
                                <InputField
                                    key={field}
                                    type="number"
                                    label={label}
                                    value={currentSchedule.gia?.[field] || ""}
                                    error={modalErrors[field]}
                                    onChange={(e) => handleGiaChange(field, getVal(e))}
                                    onBlur={() => handleFieldBlur(field)}
                                    disabled={disabled}
                                    required={field !== "phuThuPhongDon"}
                                />
                            ))}
                        </div>
                    </div>

                    <InputField
                        multiline
                        rows={3}
                        label="GHI CHÚ CHUYẾN ĐI"
                        value={currentSchedule.ghiChu || ""}
                        onChange={(e) => handleFieldChange("ghiChu", getVal(e))}
                        disabled={disabled}
                    />
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center gap-2">
                    <div>
                        {!isView && isEditMode && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isSaving}
                                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-600
                                           hover:bg-red-50 border border-red-200 rounded-xl transition disabled:opacity-40"
                            >
                                {isSaving
                                    ? <Loader2 size={13} className="animate-spin" />
                                    : <Trash2 size={14} />
                                }
                                Xóa chuyến này
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {isSaving && (
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                                <Loader2 size={12} className="animate-spin" /> Đang lưu...
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSaving}
                            className="px-4 py-2 text-xs font-semibold bg-slate-200 hover:bg-slate-300
                                       text-slate-700 rounded-xl transition disabled:opacity-40"
                        >
                            {isView ? "Đóng" : "Hủy bỏ"}
                        </button>
                        {!isView && (
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 text-xs font-semibold bg-sky-500 hover:bg-sky-600
                                           text-white rounded-xl shadow transition disabled:opacity-60
                                           flex items-center gap-1.5"
                            >
                                {isSaving && <Loader2 size={13} className="animate-spin" />}
                                {isEditMode ? "Cập nhật" : "Xác nhận thêm"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <ConfirmModal
                isOpen={showConfirmDelete}
                title="Xác nhận xóa chuyến đi"
                message={`Bạn có chắc muốn xóa chuyến ${currentSchedule?.maChuyenCode || ""
                    } không?`}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
                onCancel={() => setShowConfirmDelete(false)}
                onConfirm={() => {
                    setShowConfirmDelete(false);
                    doDelete();
                }}
            />
            <ConfirmModal
                isOpen={showConfirmUpdate}
                title="Xác nhận cập nhật"
                message={`Bạn có chắc muốn cập nhật chuyến ${currentSchedule?.maChuyenCode || ""
                    } không?`}
                confirmText="Cập nhật"
                cancelText="Hủy"
                type="warning"
                onCancel={() => setShowConfirmUpdate(false)}
                onConfirm={() => {
                    setShowConfirmUpdate(false);
                    doSave();
                }}
            />
        </div>

    );
});


export default TourScheduleSection;