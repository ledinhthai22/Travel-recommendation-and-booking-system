import { Settings, X, Edit, Trash2, Loader2 } from "lucide-react";
import InputField from "~/components/UI/Form/InputField";
import SelectField from "~/components/UI/Form/SelectField";
import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { getAllVehicleApi } from "~/Services/VehicleService";
import { getAllTourGuideApi } from "~/Services/TourGuideService";
import { toastSuccess, toastError, toastWarning } from "~/utils/Toast";
import ConfirmModal from "~/components/UI/Modal/ConfirmModal";
import { getProvincesApi, getWardsByProvinceCodeApi } from "~/Services/ProvinceService";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import DateTimePicker from "~/components/UI/Form/DateTimePicker";

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

// Tách tên tỉnh thuần từ giá trị diemDen đã lưu.
// diemDen có thể là "Tỉnh Y" hoặc "Phường X, Tỉnh Y" -> luôn lấy phần cuối cùng sau dấu phẩy.
const getProvinceOnlyFromDiemDen = (diemDenValue) => {
    if (!diemDenValue) return "";
    const parts = diemDenValue.split(",");
    return parts[parts.length - 1].trim();
};

// Tách tên phường/xã (nếu có) từ giá trị diemDen đã lưu.
const getWardOnlyFromDiemDen = (diemDenValue) => {
    if (!diemDenValue) return "";
    const parts = diemDenValue.split(",");
    if (parts.length < 2) return "";
    return parts.slice(0, parts.length - 1).join(",").trim();
};

const validateDeparture = (item) => {
    const errs = {};

    if (!item.maHDV) errs.maHDV = "Vui lòng chọn hướng dẫn viên";
    if (!item.maPhuongTien) errs.maPhuongTien = "Vui lòng chọn phương tiện";
    if (!item.diemKhoiHanh?.trim()) errs.diemKhoiHanh = "Vui lòng chọn điểm khởi hành";
    if (!item.diemDen?.trim()) errs.diemDen = "Vui lòng chọn điểm đến";

    if (item.diemKhoiHanh?.trim() && item.diemDen?.trim() &&
        item.diemKhoiHanh.trim().toLowerCase() === item.diemDen.trim().toLowerCase()) {
        errs.diemDen = "Điểm đến không được trùng với điểm khởi hành";
    }

    if (!item.soChoToiDa || !isValidNonNegativeNumber(item.soChoToiDa) || Number(item.soChoToiDa) <= 0) {
        errs.soChoToiDa = "Số chỗ phải lớn hơn 0";
    }

    const toDate = (val) => val ? (val instanceof Date ? new Date(val) : new Date(val)) : null;
    const ngayKD = toDate(item.ngayKhoiHanh);  // VD: 07/07 03:15
    const gioDi = toDate(item.gioDenNoiDi);   // VD: 07/07 06:45  → phải sau ngayKD
    const ngayKT = toDate(item.ngayKetThuc);   // VD: 09/07 00:00  → phải sau ngayKD (khác ngày)
    const gioVe = toDate(item.gioDenNoiVe);   // VD: 09/07 10:00  → phải sau ngayKT
    const now = new Date();

    // 1. Ngày giờ khởi hành
    if (!ngayKD) {
        errs.ngayKhoiHanh = "Vui lòng chọn ngày giờ khởi hành";
    } else if (ngayKD <= now) {
        errs.ngayKhoiHanh = "Ngày giờ khởi hành phải lớn hơn hiện tại";
    }

    // 2. Giờ đến nơi đi → phải sau ngayKD (cùng ngày, giờ sau)
    if (!gioDi) {
        errs.gioDenNoiDi = "Vui lòng chọn ngày giờ đến nơi đi";
    } else if (ngayKD && gioDi <= ngayKD) {
        errs.gioDenNoiDi = "Giờ đến nơi đi phải sau giờ khởi hành";
    }

    if (!ngayKT) {
        errs.ngayKetThuc = "Vui lòng chọn ngày giờ kết thúc";
    } else if (gioDi && ngayKT < gioDi) {
        errs.ngayKetThuc = "Ngày giờ kết thúc phải sau thời điểm đến nơi đi";
    } else if (ngayKD) {
        const ngayKDOnly = new Date(ngayKD); ngayKDOnly.setHours(0, 0, 0, 0);
        const ngayKTOnly = new Date(ngayKT); ngayKTOnly.setHours(0, 0, 0, 0);
        if (ngayKTOnly < ngayKDOnly) {
            errs.ngayKetThuc = "Ngày kết thúc không được trước ngày khởi hành";
        }
    }

    // 4. Giờ về → phải sau ngayKT (cùng ngày cuối, giờ sau)
    if (!gioVe) {
        errs.gioDenNoiVe = "Vui lòng chọn ngày giờ về";
    } else if (ngayKT && gioVe <= ngayKT) {
        errs.gioDenNoiVe = "Giờ về phải sau giờ kết thúc";
    }

    if (!isValidNonNegativeNumber(item.gia?.giaNguoiLon)) errs.giaNguoiLon = "Giá người lớn không hợp lệ";
    if (!isValidNonNegativeNumber(item.gia?.giaTreEm)) errs.giaTreEm = "Giá trẻ em không hợp lệ";
    if (!isValidNonNegativeNumber(item.gia?.giaEmBe)) errs.giaEmBe = "Giá em bé không hợp lệ";

    const phu = item.gia?.phuThuPhongDon;
    if (phu != null && phu !== "" && !isValidNonNegativeNumber(phu)) {
        errs.phuThuPhongDon = "Phụ thu phòng đơn không hợp lệ";
    }

    return errs;
};

const TourScheduleSection = forwardRef(({ value = [], onChange, isViewMode = false, trongNuoc, soNgay }, ref) => {
    const [vehicles, setVehicles] = useState([]);
    const [guides, setGuides] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [provincesLoading, setProvincesLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [modalErrors, setModalErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [showConfirmUpdate, setShowConfirmUpdate] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    // ── Phường/Xã (tùy chọn) ──
    const [wardOptions, setWardOptions] = useState([]);
    const [wardsLoading, setWardsLoading] = useState(false);
    const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
    const [selectedWardName, setSelectedWardName] = useState("");

    const safeData = Array.isArray(value) ? value : [];

    // Fetch phương tiện + hướng dẫn viên
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vehicleRes, guideRes] = await Promise.all([
                    getAllVehicleApi(),
                    getAllTourGuideApi()
                ]);
                setVehicles(Array.isArray(vehicleRes) ? vehicleRes : []);
                setGuides((guideRes.data || guideRes || []).map(({ maNhanVien, hoTen }) => ({
                    maHDV: maNhanVien,
                    tenHDV: hoTen
                })));
            } catch {
                toastError("Tải dữ liệu thất bại", "Không thể tải danh sách phương tiện hoặc hướng dẫn viên.");
            }
        };
        fetchData();
    }, []);

    // Fetch danh sách tỉnh/thành (kèm code để tra cứu phường/xã)
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

    // Khi tỉnh (phần cuối của diemDen) thay đổi -> tìm mã tỉnh -> load phường/xã tương ứng
    useEffect(() => {
        const provinceName = getProvinceOnlyFromDiemDen(currentSchedule?.diemDen);

        if (!provinceName || provinces.length === 0) {
            setWardOptions([]);
            setSelectedProvinceCode("");
            return;
        }

        const matched = provinces.find(p => p.name === provinceName);
        const code = matched?.code ?? "";
        setSelectedProvinceCode(code);

        if (!code) {
            setWardOptions([]);
            return;
        }

        const fetchWards = async () => {
            try {
                setWardsLoading(true);
                const wards = await getWardsByProvinceCodeApi(code);
                setWardOptions(Array.isArray(wards) ? wards : []);
            } catch {
                setWardOptions([]);
            } finally {
                setWardsLoading(false);
            }
        };
        fetchWards();
    }, [currentSchedule?.diemDen, provinces]);

    // Imperative Handle
    useImperativeHandle(ref, () => ({
        openModal: () => {
            setCurrentSchedule(makeEmptySchedule());
            setIsEditMode(false);
            setModalErrors({});
            setSelectedWardName("");
            setShowModal(true);
        },
        openEditModal: (item) => {
            const cloned = JSON.parse(JSON.stringify(item));
            setCurrentSchedule(cloned);
            setIsEditMode(true);
            setModalErrors({});
            // Parse lại tên phường/xã đã lưu trước đó (nếu có) để hiển thị đúng select
            setSelectedWardName(getWardOnlyFromDiemDen(cloned.diemDen));
            setShowModal(true);
        },
        validateAll: () => {
            if (safeData.length === 0) return true;
            for (const item of safeData) {
                const errs = validateDeparture(item);
                if (Object.keys(errs).length > 0) {
                    toastWarning("Thiếu thông tin", `Chuyến ${item.maChuyenCode || "(chưa có mã)"} chưa hợp lệ.`);
                    setCurrentSchedule(JSON.parse(JSON.stringify(item)));
                    setIsEditMode(true);
                    setModalErrors(errs);
                    setSelectedWardName(getWardOnlyFromDiemDen(item.diemDen));
                    setShowModal(true);
                    return false;
                }
            }
            return true;
        }
    }), [safeData]);

    const handleFieldChange = useCallback((field, val) => {
        setCurrentSchedule(prev => {
            const updated = { ...prev };

            updated[field] = val;

            if (field === "ngayKhoiHanh" && val) {
                const start = new Date(val);

                if (Number(soNgay) > 0) {
                    if (Number(soNgay) > 1) {
                        const end = new Date(start);
                        end.setDate(end.getDate() + Number(soNgay) - 1);
                        end.setHours(0, 0, 0, 0);
                        updated.ngayKetThuc = end;
                    } else {
                        updated.ngayKetThuc = null;
                    }

                    updated.gioDenNoiDi = null;
                    updated.gioDenNoiVe = null;
                } else {
                    toastWarning(
                        "Chưa có số ngày tour",
                        "Vui lòng nhập số ngày ở thông tin cơ bản trước khi chọn ngày khởi hành."
                    );
                }
            }
            return updated;
        });

        setModalErrors(prev => {
            const next = { ...prev };
            delete next[field];
            if (field === "ngayKhoiHanh") delete next.ngayKetThuc;
            return next;
        });
    }, [soNgay]);

    // Khi đổi Tỉnh/Thành phố ở "Điểm đến": ghi nhận tên tỉnh thuần, reset phường/xã đã chọn
    const handleProvinceChange = useCallback((val) => {
        const provinceName = getVal(val);
        handleFieldChange("diemDen", provinceName);
        setSelectedWardName("");
    }, [handleFieldChange]);

    // Khi chọn phường/xã: nối chuỗi "Phường X, Tỉnh Y" rồi gửi vào diemDen
    const handleWardChange = useCallback((val) => {
        const wardName = getVal(val) || "";
        setSelectedWardName(wardName);

        setCurrentSchedule(prev => {
            const provinceOnly = getProvinceOnlyFromDiemDen(prev?.diemDen);
            const finalValue = wardName ? `${wardName}, ${provinceOnly}` : provinceOnly;
            return { ...prev, diemDen: finalValue };
        });

        setModalErrors(prev => {
            const next = { ...prev };
            delete next.diemDen;
            return next;
        });
    }, []);

    const handleGiaChange = useCallback((field, val) => {
        setCurrentSchedule(prev => ({
            ...prev,
            gia: { ...prev.gia, [field]: val }
        }));
        setModalErrors(prev => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }, []);

    const getDateOnly = (date) => {
        if (!date) return null;

        const d = date instanceof Date ? new Date(date) : new Date(date);

        return new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate()
        );
    };

    const handleFieldBlur = useCallback((field) => {
        if (!currentSchedule) return;

        // Chỉ check khớp số ngày khi user rời khỏi ô ngayKetThuc
        if (field === "ngayKetThuc" && currentSchedule.ngayKetThuc && currentSchedule.ngayKhoiHanh && soNgay && Number(soNgay) > 0) {
            const start = getDateOnly(currentSchedule.ngayKhoiHanh);
            const end = getDateOnly(currentSchedule.ngayKetThuc);

            const diffTime = end.getTime() - start.getTime();

            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
            if (diffDays !== Number(soNgay)) {
                toastWarning(
                    "Số ngày không khớp",
                    `Tour có ${soNgay} ngày nhưng khoảng thời gian bạn chọn là ${diffDays} ngày.`
                );
            }
        }

        const errs = validateDeparture(currentSchedule);
        setModalErrors(prev => ({ ...prev, [field]: errs[field] ?? null }));
    }, [currentSchedule, soNgay]);

    const handleClose = useCallback(() => {
        if (isSaving) return;
        setShowModal(false);
        setCurrentSchedule(null);
        setModalErrors({});
        setSelectedWardName("");
    }, [isSaving]);

    const doSave = async () => {
        const exists = safeData.some(ch => ch.tempId === currentSchedule.tempId);
        const updatedList = exists
            ? safeData.map(ch => ch.tempId === currentSchedule.tempId ? currentSchedule : ch)
            : [...safeData, currentSchedule];

        try {
            setIsSaving(true);
            await onChange?.(updatedList);
            toastSuccess("Thành công", exists ? "Cập nhật chuyến khởi hành thành công." : "Thêm chuyến khởi hành thành công.");
            setShowModal(false);
        } catch (err) {
            toastError("Lỗi", err?.message || "Không thể lưu chuyến khởi hành.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = () => {
        if (!currentSchedule || isSaving) return;

        const errs = validateDeparture(currentSchedule);
        if (Object.keys(errs).length > 0) {
            setModalErrors(errs);

            // Toast lỗi đầu tiên tìm thấy theo thứ tự ưu tiên
            const priority = [
                "ngayKhoiHanh", "gioDenNoiDi", "ngayKetThuc", "gioDenNoiVe",
                "maHDV", "maPhuongTien", "diemKhoiHanh", "diemDen",
                "soChoToiDa", "giaNguoiLon", "giaTreEm", "giaEmBe", "phuThuPhongDon"
            ];
            const firstErrKey = priority.find(k => errs[k]);
            if (firstErrKey) {
                toastWarning("Dữ liệu chưa hợp lệ", errs[firstErrKey]);
            }
            return;
        }

        if (isEditMode) {
            setShowConfirmUpdate(true);
        } else {
            doSave();
        }
    };

    const doDelete = async () => {
        if (!currentSchedule || isSaving) return;
        const updatedList = safeData.filter(ch => ch.tempId !== currentSchedule.tempId);

        try {
            setIsSaving(true);
            await onChange?.(updatedList);
            toastSuccess("Đã xóa", `Xóa chuyến ${currentSchedule.maChuyenCode || ""} thành công.`);
            setShowModal(false);
            setCurrentSchedule(null);
            setModalErrors({});
        } catch (err) {
            toastError("Lỗi", err?.message || "Không thể xóa chuyến.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = () => {
        if (!currentSchedule || isSaving) return;
        setShowConfirmDelete(true);
    };

    if (!showModal || !currentSchedule) return null;
    const hasBooking = (currentSchedule?.soChoDaDat ?? 0) > 0;
    const disabled =
        isViewMode ||
        isSaving ||
        (isEditMode && hasBooking);
    const isSavedInDB = !!currentSchedule.maChuyen;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        {isEditMode ? <Edit size={18} className="text-sky-500" /> : <Settings size={18} className="text-slate-500" />}
                        <h2 className="text-sm font-bold text-slate-800">
                            {isEditMode ? (isViewMode ? "Chi tiết chuyến" : "Cập nhật chuyến") : "Thêm chuyến khởi hành mới"}
                        </h2>
                        {isSavedInDB && currentSchedule.maChuyenCode && (
                            <span className="px-3 py-1 text-xs font-mono bg-sky-100 text-sky-700 rounded-lg border border-sky-200">
                                {currentSchedule.maChuyenCode}
                            </span>
                        )}
                    </div>
                    <button onClick={handleClose} disabled={isSaving} className="p-2 text-slate-400 hover:text-slate-600">
                        <X size={22} />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                    {/* Thông tin chính */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <SelectField
                            label="Hướng dẫn viên *"
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
                        <SelectField
                            label="Phương tiện *"
                            value={currentSchedule.maPhuongTien || ""}
                            options={vehicles}
                            valueKey="maPhuongTien"
                            labelKey="tenPhuongTien"
                            error={modalErrors.maPhuongTien}
                            onChange={(e) => handleFieldChange("maPhuongTien", getVal(e))}
                            disabled={disabled}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <SelectField
                            label="Điểm khởi hành *"
                            value={currentSchedule.diemKhoiHanh || ""}
                            options={DIEM_DI_OPTIONS}
                            valueKey="value"
                            labelKey="label"
                            error={modalErrors.diemKhoiHanh}
                            onChange={(e) => handleFieldChange("diemKhoiHanh", getVal(e))}
                            disabled={disabled}
                        />
                        <SelectField
                            label="Điểm đến (Tỉnh/Thành phố) *"
                            searchable
                            searchText="Tìm tỉnh/thành phố..."
                            value={getProvinceOnlyFromDiemDen(currentSchedule.diemDen) || ""}
                            options={provinces}
                            valueKey="name"
                            labelKey="name"
                            error={modalErrors.diemDen}
                            onChange={handleProvinceChange}
                            disabled={disabled || provincesLoading}
                        />
                    </div>

                    <SelectField
                        label="Phường/Xã (không bắt buộc)"
                        searchable
                        searchText="Tìm phường/xã..."
                        value={selectedWardName}
                        options={wardOptions}
                        valueKey="name"
                        labelKey="name"
                        placeholder={wardsLoading ? "Đang tải..." : "Chọn phường/xã (nếu có)"}
                        onChange={handleWardChange}
                        disabled={disabled || wardsLoading || !selectedProvinceCode || wardOptions.length === 0}
                    />

                    <InputField
                        type="number"
                        label="Số chỗ tối đa *"
                        value={currentSchedule.soChoToiDa || ""}
                        error={modalErrors.soChoToiDa}
                        onChange={(e) => handleFieldChange("soChoToiDa", getVal(e))}
                        disabled={disabled}
                        required
                    />

                    {/* Timeline */}
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">THỜI GIAN LỊCH TRÌNH</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {[
                                { field: "ngayKhoiHanh", label: "Ngày giờ khởi hành *" },
                                { field: "gioDenNoiDi", label: "Ngày giờ đến nơi đi *" },
                                { field: "ngayKetThuc", label: "Ngày giờ kết thúc *" },
                                { field: "gioDenNoiVe", label: "Ngày giờ về *" },
                            ].map(({ field, label, hint }) => (
                                <div key={field}>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">{label}</label>
                                    <DateTimePicker
                                        key={field}
                                        label={label}
                                        value={currentSchedule[field] ? new Date(currentSchedule[field]) : null}
                                        onChange={(date) => handleFieldChange(field, date)}
                                        onBlur={() => handleFieldBlur(field)}
                                        error={modalErrors[field]}
                                        disabled={disabled}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Giá */}
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">BẢNG GIÁ</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { field: "giaNguoiLon", label: "Giá người lớn " },
                                { field: "giaTreEm", label: "Giá trẻ em " },
                                { field: "giaEmBe", label: "Giá em bé " },
                                { field: "phuThuPhongDon", label: "Phụ thu phòng đơn" },
                            ].map(({ field, label }) => (
                                <InputField
                                    key={field}
                                    type="number"
                                    label={label}
                                    value={currentSchedule.gia?.[field] || ""}
                                    error={modalErrors[field]}
                                    onChange={(e) => handleGiaChange(field, getVal(e))}
                                    disabled={disabled}
                                    required={field !== "phuThuPhongDon"}
                                />
                            ))}
                        </div>
                    </div>

                    <InputField
                        multiline
                        rows={3}
                        label="Ghi chú chuyến đi"
                        value={currentSchedule.ghiChu || ""}
                        onChange={(e) => handleFieldChange("ghiChu", getVal(e))}
                        disabled={disabled}
                    />
                </div>

                {/* Footer */}
                {/* Footer - Đã được chỉnh sửa */}
                <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end items-center">


                    <div className="flex gap-3">

                        {/* Chỉ hiển thị nút Cập nhật / Thêm khi KHÔNG có booking */}
                        {!isViewMode && !hasBooking && (
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-medium flex items-center gap-2"
                            >
                                {isSaving && <Loader2 size={18} className="animate-spin" />}
                                {isEditMode ? "Cập nhật" : "Thêm chuyến"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirm Modals */}
            <ConfirmModal
                isOpen={showConfirmDelete}
                title="Xác nhận xóa"
                message={`Xóa chuyến ${currentSchedule?.maChuyenCode || ""}?`}
                confirmText="Xóa"
                type="danger"
                onConfirm={() => { setShowConfirmDelete(false); doDelete(); }}
                onCancel={() => setShowConfirmDelete(false)}
            />

            <ConfirmModal
                isOpen={showConfirmUpdate}
                title="Xác nhận cập nhật"
                message={`Cập nhật chuyến ${currentSchedule?.maChuyenCode || ""}?`}
                confirmText="Cập nhật"
                type="warning"
                onConfirm={() => { setShowConfirmUpdate(false); doSave(); }}
                onCancel={() => setShowConfirmUpdate(false)}
            />
        </div>
    );
});

export default TourScheduleSection;