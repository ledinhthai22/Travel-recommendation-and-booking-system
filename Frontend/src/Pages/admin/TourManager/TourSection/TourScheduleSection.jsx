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

// ✅ Hàm tính ngày kết thúc từ lịch trình (CHỈ ĐỂ GỢI Ý)
const calculateAutoEndDate = (ngayKhoiHanh, schedules) => {
    if (!ngayKhoiHanh || !schedules || schedules.length === 0) return null;
    
    const startDate = new Date(ngayKhoiHanh);
    let maxEndTime = 0;
    
    const lastDay = schedules[schedules.length - 1];
    if (lastDay && lastDay.chiTietLichTrinhs) {
        lastDay.chiTietLichTrinhs.forEach(activity => {
            if (activity.gioKetThuc) {
                const [hour, minute] = activity.gioKetThuc.split(':').map(Number);
                const endTime = hour * 60 + minute;
                if (endTime > maxEndTime) {
                    maxEndTime = endTime;
                }
            }
        });
    }
    
    if (maxEndTime === 0) maxEndTime = 23 * 60 + 59;
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + schedules.length - 1);
    endDate.setHours(Math.floor(maxEndTime / 60), maxEndTime % 60, 0, 0);
    
    return endDate;
};

const formatDateTime = (date) => {
    if (!date) return "Chưa có";
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const getProvinceOnlyFromDiemDen = (diemDenValue) => {
    if (!diemDenValue) return "";
    const parts = diemDenValue.split(",");
    return parts[parts.length - 1].trim();
};

const getWardOnlyFromDiemDen = (diemDenValue) => {
    if (!diemDenValue) return "";
    const parts = diemDenValue.split(",");
    if (parts.length < 2) return "";
    return parts.slice(0, parts.length - 1).join(",").trim();
};

const validateDeparture = (item, schedules) => {
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

    const toDate = (val) => (val ? new Date(val) : null);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const timeline = [
        {
            field: "ngayKhoiHanh",
            value: toDate(item.ngayKhoiHanh),
            requiredMsg: "Vui lòng chọn ngày giờ khởi hành",
            orderMsg: "Ngày giờ khởi hành phải lớn hơn hoặc bằng ngày hiện tại",
            compareTo: today
        },
        {
            field: "gioDenNoiDi",
            value: toDate(item.gioDenNoiDi),
            requiredMsg: "Vui lòng chọn ngày giờ đến nơi đi",
            orderMsg: "Ngày giờ đến nơi đi phải sau ngày giờ khởi hành"
        },
        {
            field: "ngayKetThuc",
            value: toDate(item.ngayKetThuc),
            requiredMsg: "Vui lòng chọn ngày giờ kết thúc",
            orderMsg: "Ngày giờ kết thúc phải sau ngày giờ đến nơi đi"
        },
        {
            field: "gioDenNoiVe",
            value: toDate(item.gioDenNoiVe),
            requiredMsg: "Vui lòng chọn ngày giờ về",
            orderMsg: "Ngày giờ về phải sau ngày giờ kết thúc"
        }
    ];

    let prevValue = null;
    for (const { field, value, requiredMsg, orderMsg, compareTo } of timeline) {
        if (!value) {
            errs[field] = requiredMsg;
        } else {
            const reference = compareTo ?? prevValue;
            if (reference && value <= reference) {
                errs[field] = orderMsg;
            }
        }
        if (value) prevValue = value;
    }

    // ✅ CHỈ CẢNH BÁO, không bắt buộc - User có thể tự điều chỉnh
    if (item.ngayKhoiHanh && schedules && schedules.length > 0 && item.ngayKetThuc) {
        const autoEndDate = calculateAutoEndDate(item.ngayKhoiHanh, schedules);
        const userEndDate = new Date(item.ngayKetThuc);
        if (autoEndDate && userEndDate < autoEndDate) {
            // Chỉ thêm vào errors như một cảnh báo, không block
            errs.ngayKetThuc = `⚠️ Lưu ý: Ngày kết thúc (${formatDateTime(userEndDate)}) sớm hơn gợi ý từ lịch trình (${formatDateTime(autoEndDate)}). Vui lòng kiểm tra lại nếu có di chuyển bằng tàu hỏa/máy bay.`;
        }
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

const TourScheduleSection = forwardRef(({ 
    value = [], 
    onChange, 
    isViewMode = false, 
    trongNuoc, 
    soNgay,
    lichTrinhMau = [] 
}, ref) => {
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

    const [autoEndDate, setAutoEndDate] = useState(null);

    const [wardOptions, setWardOptions] = useState([]);
    const [wardsLoading, setWardsLoading] = useState(false);
    const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
    const [selectedWardName, setSelectedWardName] = useState("");

    const safeData = Array.isArray(value) ? value : [];

    // ✅ Chỉ tính toán gợi ý, không tự động set ngayKetThuc
    useEffect(() => {
        if (currentSchedule?.ngayKhoiHanh && lichTrinhMau && lichTrinhMau.length > 0) {
            const endDate = calculateAutoEndDate(currentSchedule.ngayKhoiHanh, lichTrinhMau);
            setAutoEndDate(endDate);
        } else {
            setAutoEndDate(null);
        }
    }, [currentSchedule?.ngayKhoiHanh, lichTrinhMau]);

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

    useImperativeHandle(ref, () => ({
        openModal: () => {
            const empty = makeEmptySchedule();
            setCurrentSchedule(empty);
            setIsEditMode(false);
            setModalErrors({});
            setSelectedWardName("");
            setAutoEndDate(null);
            setShowModal(true);
        },
        openEditModal: (item) => {
            const cloned = JSON.parse(JSON.stringify(item));
            setCurrentSchedule(cloned);
            setIsEditMode(true);
            setModalErrors({});
            setSelectedWardName(getWardOnlyFromDiemDen(cloned.diemDen));
            setAutoEndDate(null);
            if (cloned.ngayKhoiHanh && lichTrinhMau && lichTrinhMau.length > 0) {
                const endDate = calculateAutoEndDate(cloned.ngayKhoiHanh, lichTrinhMau);
                setAutoEndDate(endDate);
            }
            setShowModal(true);
        },
        validateAll: () => {
            if (safeData.length === 0) return true;
            for (const item of safeData) {
                const errs = validateDeparture(item, lichTrinhMau);
                if (Object.keys(errs).length > 0) {
                    toastWarning("Thiếu thông tin", `Chuyến ${item.maChuyenCode || "(chưa có mã)"} chưa hợp lệ.`);
                    const cloned = JSON.parse(JSON.stringify(item));
                    setCurrentSchedule(cloned);
                    setIsEditMode(true);
                    setModalErrors(errs);
                    setSelectedWardName(getWardOnlyFromDiemDen(item.diemDen));
                    setShowModal(true);
                    return false;
                }
            }
            return true;
        }
    }), [safeData, lichTrinhMau]);

    const handleFieldChange = useCallback((field, val) => {
        setCurrentSchedule(prev => {
            if (!prev) return prev;
            const updated = { ...prev, [field]: val };

            // ✅ Chỉ tính lại gợi ý, không tự động set ngayKetThuc
            if (field === "ngayKhoiHanh" && val) {
                const endDate = calculateAutoEndDate(val, lichTrinhMau);
                setAutoEndDate(endDate);
            }

            return updated;
        });

        setModalErrors(prev => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }, [lichTrinhMau]);

    const handleProvinceChange = useCallback((val) => {
        const provinceName = getVal(val);
        handleFieldChange("diemDen", provinceName);
        setSelectedWardName("");
    }, [handleFieldChange]);

    const handleWardChange = useCallback((val) => {
        const wardName = getVal(val) || "";
        setSelectedWardName(wardName);

        setCurrentSchedule(prev => {
            if (!prev) return prev;
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

    const handleClose = useCallback(() => {
        if (isSaving) return;
        setShowModal(false);
        setCurrentSchedule(null);
        setModalErrors({});
        setSelectedWardName("");
        setAutoEndDate(null);
    }, [isSaving]);

    const doSave = async () => {
        const errs = validateDeparture(currentSchedule, lichTrinhMau);
        if (Object.keys(errs).length > 0) {
            setModalErrors(errs);
            const firstErr = Object.values(errs)[0];
            toastWarning("Dữ liệu chưa hợp lệ", firstErr);
            return;
        }

        if (isEditMode && currentSchedule.maChuyen) {
            const existing = safeData.find(ch => ch.maChuyen === currentSchedule.maChuyen);
            if (existing && currentSchedule.soChoToiDa < existing.soChoDaDat) {
                toastError("Lỗi", `Số chỗ tối đa (${currentSchedule.soChoToiDa}) không thể nhỏ hơn số chỗ đã đặt (${existing.soChoDaDat})`);
                return;
            }
        }

        const scheduleToSave = JSON.parse(JSON.stringify(currentSchedule));

        const existsIndex = safeData.findIndex(ch => {
            if (ch.maChuyen && scheduleToSave.maChuyen) {
                return ch.maChuyen === scheduleToSave.maChuyen;
            }
            return ch.tempId === scheduleToSave.tempId;
        });

        let updatedList;
        if (existsIndex !== -1) {
            updatedList = [...safeData];
            updatedList[existsIndex] = {
                ...safeData[existsIndex],
                ...scheduleToSave,
                tempId: safeData[existsIndex].tempId || scheduleToSave.tempId,
                soChoDaDat: safeData[existsIndex].soChoDaDat || 0
            };
        } else {
            updatedList = [...safeData, { ...scheduleToSave, soChoDaDat: 0 }];
        }

        try {
            setIsSaving(true);
            await onChange?.(updatedList);
            setShowModal(false);
            setCurrentSchedule(null);
            setModalErrors({});
            toastSuccess("Thành công", isEditMode ? "Đã cập nhật chuyến" : "Đã thêm chuyến mới");
        } catch (err) {
            toastError("Lỗi", err?.message || "Không thể lưu.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = () => {
        if (!currentSchedule || isSaving) return;

        if (isEditMode && currentSchedule.maChuyen) {
            const existingItem = safeData.find(ch => ch.maChuyen === currentSchedule.maChuyen);
            if (existingItem && existingItem.soChoDaDat > 0) {
                toastError("Không thể sửa", "Chuyến này đã có người đặt, không được phép chỉnh sửa!");
                return;
            }
        }

        const errs = validateDeparture(currentSchedule, lichTrinhMau);
        if (Object.keys(errs).length > 0) {
            setModalErrors(errs);
            const firstErr = Object.values(errs)[0];
            toastWarning("Dữ liệu chưa hợp lệ", firstErr);
            return;
        }

        if (isEditMode && currentSchedule.maChuyen) {
            setShowConfirmUpdate(true);
        } else {
            doSave();
        }
    };

    const doDelete = async () => {
        if (!currentSchedule || isSaving) return;

        if (currentSchedule.soChoDaDat > 0) {
            toastError("Không thể xóa", "Chuyến này đã có người đặt, không được phép xóa!");
            return;
        }

        const updatedList = safeData.filter(ch => {
            if (ch.maChuyen && currentSchedule.maChuyen) {
                return ch.maChuyen !== currentSchedule.maChuyen;
            }
            return ch.tempId !== currentSchedule.tempId;
        });

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
        if (currentSchedule.soChoDaDat > 0) {
            toastError("Không thể xóa", "Chuyến này đã có người đặt, không được phép xóa!");
            return;
        }
        setShowConfirmDelete(true);
    };

    if (!showModal || !currentSchedule) return null;

    const hasBooking = (currentSchedule?.soChoDaDat ?? 0) > 0;
    const disabled = isViewMode || isSaving || hasBooking;
    const today = new Date();

    return (
        <>
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/20 ">
                <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh]">
                    <div className="flex justify-between items-center p-5 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                            {isEditMode ? <Edit size={18} className="text-sky-500" /> : <Settings size={18} className="text-slate-500" />}
                            <h2 className="text-sm font-bold text-slate-800">
                                {isEditMode ? (isViewMode ? "Chi tiết chuyến" : "Cập nhật chuyến") : "Thêm chuyến khởi hành mới"}
                            </h2>
                            {currentSchedule.maChuyenCode && (
                                <span className="px-3 py-1 text-xs font-mono bg-sky-100 text-sky-700 rounded-lg border border-sky-200">
                                    {currentSchedule.maChuyenCode}
                                </span>
                            )}
                            {hasBooking && (
                                <span className="px-3 py-1 text-xs font-mono bg-red-100 text-red-700 rounded-lg border border-red-200">
                                    Đã có người đặt
                                </span>
                            )}
                        </div>
                        <button onClick={handleClose} disabled={isSaving} className="p-2 text-slate-400 hover:text-slate-600">
                            <X size={22} />
                        </button>
                    </div>

                    {hasBooking && (
                        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            Chuyến này hiện đã có người đặt. Không được phép chỉnh sửa hoặc xóa.
                        </div>
                    )}

                    <div className="p-6 space-y-6 overflow-y-auto flex-1">
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

                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">THỜI GIAN LỊCH TRÌNH</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Ngày giờ khởi hành *
                                    </label>
                                    <DateTimePicker
                                        value={currentSchedule.ngayKhoiHanh ? new Date(currentSchedule.ngayKhoiHanh) : null}
                                        onChange={(date) => handleFieldChange("ngayKhoiHanh", date)}
                                        error={modalErrors.ngayKhoiHanh}
                                        disabled={disabled}
                                        minDate={today}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Ngày giờ đến nơi đi *
                                    </label>
                                    <DateTimePicker
                                        value={currentSchedule.gioDenNoiDi ? new Date(currentSchedule.gioDenNoiDi) : null}
                                        onChange={(date) => handleFieldChange("gioDenNoiDi", date)}
                                        error={modalErrors.gioDenNoiDi}
                                        disabled={disabled}
                                        minDate={currentSchedule.ngayKhoiHanh ? new Date(currentSchedule.ngayKhoiHanh) : today}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Ngày giờ kết thúc *
                                    </label>
                                    <DateTimePicker
                                        value={currentSchedule.ngayKetThuc ? new Date(currentSchedule.ngayKetThuc) : null}
                                        onChange={(date) => handleFieldChange("ngayKetThuc", date)}
                                        error={modalErrors.ngayKetThuc}
                                        disabled={disabled}
                                        minDate={currentSchedule.gioDenNoiDi ? new Date(currentSchedule.gioDenNoiDi) : today}
                                    />
                                    {/* ✅ Hiển thị gợi ý, cho phép user tự quyết định */}
                                    {autoEndDate && (
                                        <div className="mt-1">
                                            <p className="text-[10px] text-emerald-500 flex items-center gap-1">
                                                <span>Gợi ý từ lịch trình: {formatDateTime(autoEndDate)}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleFieldChange("ngayKetThuc", autoEndDate)}
                                                    className="text-[10px] text-sky-500 hover:text-sky-700 underline"
                                                    disabled={disabled}
                                                >
                                                    Áp dụng
                                                </button>
                                            </p>
                                            <p className="text-[9px] text-slate-400 mt-0.5">
                                                * Bạn có thể điều chỉnh nếu di chuyển bằng tàu hỏa/máy bay/Ô to
                                            </p>
                                        </div>
                                    )}
                                    {lichTrinhMau.length === 0 && (
                                        <p className="text-[10px] text-amber-500 mt-1">
                                            Chưa có lịch trình để gợi ý ngày kết thúc
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Ngày giờ về *
                                    </label>
                                    <DateTimePicker
                                        value={currentSchedule.gioDenNoiVe ? new Date(currentSchedule.gioDenNoiVe) : null}
                                        onChange={(date) => handleFieldChange("gioDenNoiVe", date)}
                                        error={modalErrors.gioDenNoiVe}
                                        disabled={disabled}
                                        minDate={currentSchedule.ngayKetThuc ? new Date(currentSchedule.ngayKetThuc) : today}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">BẢNG GIÁ</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { field: "giaNguoiLon", label: "Giá người lớn *" },
                                    { field: "giaTreEm", label: "Giá trẻ em *" },
                                    { field: "giaEmBe", label: "Giá em bé *" },
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

                    <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end items-center gap-3">
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
        </>
    );
});

export default TourScheduleSection;