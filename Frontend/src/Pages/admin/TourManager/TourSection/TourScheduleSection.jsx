import { Settings, X, Edit, Trash2, Loader2 } from "lucide-react";
import InputField from "~/components/UI/Form/InputField";
import SelectField from "~/components/UI/Form/SelectField";
import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { getAllVehicleApi } from "~/Services/VehicleService";
import { getAllTourGuideApi } from "~/Services/TourGuideService";
import { getStaffByIdApi } from "~/Services/StaffService";
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
    return !Number.isNaN(num) && num >= 0 && Number.isInteger(num);
};

const getScheduleTimes = (lichTrinhMau) => {
    if (!lichTrinhMau || lichTrinhMau.length === 0) {
        return { firstDayStart: null, firstDayEnd: null, lastDayEnd: null, diChuyenSource: false };
    }

    const sortedSchedules = [...lichTrinhMau].sort((a, b) => a.soThuTuNgay - b.soThuTuNgay);
    const firstDay = sortedSchedules[0];
    const lastDay = sortedSchedules[sortedSchedules.length - 1];

    let firstDayStart = null;
    let firstDayEnd = null;
    let lastDayEnd = null;
    let diChuyenSource = false;

    if (firstDay?.chiTietLichTrinhs && firstDay.chiTietLichTrinhs.length > 0) {
        const sortedByStart = [...firstDay.chiTietLichTrinhs].sort((a, b) => {
            return a.gioBatDau.localeCompare(b.gioBatDau);
        });
        firstDayStart = sortedByStart[0]?.gioBatDau || null;

        const diChuyenActivity = firstDay.chiTietLichTrinhs.find(
            act => act.loaiHoatDong === "DI_CHUYEN"
        );

        if (diChuyenActivity) {
            firstDayEnd = diChuyenActivity.gioKetThuc || diChuyenActivity.gioBatDau || null;
            diChuyenSource = true;
        } else {
            const sortedByEnd = [...firstDay.chiTietLichTrinhs].sort((a, b) => {
                const endA = a.gioKetThuc || a.gioBatDau;
                const endB = b.gioKetThuc || b.gioBatDau;
                return endA.localeCompare(endB);
            });
            const lastActivityFirstDay = sortedByEnd[sortedByEnd.length - 1];
            firstDayEnd = lastActivityFirstDay.gioKetThuc || lastActivityFirstDay.gioBatDau || null;
        }
    }

    if (lastDay?.chiTietLichTrinhs && lastDay.chiTietLichTrinhs.length > 0) {
        const sortedByEnd = [...lastDay.chiTietLichTrinhs].sort((a, b) => {
            const endA = a.gioKetThuc || a.gioBatDau;
            const endB = b.gioKetThuc || b.gioBatDau;
            return endA.localeCompare(endB);
        });
        const lastActivity = sortedByEnd[sortedByEnd.length - 1];
        lastDayEnd = lastActivity.gioKetThuc || lastActivity.gioBatDau || null;
    }

    return { firstDayStart, firstDayEnd, lastDayEnd, diChuyenSource };
};

const formatTimeToDate = (timeStr, baseDate) => {
    if (!timeStr || !baseDate) return null;
    const date = new Date(baseDate);
    const [hours, minutes] = timeStr.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date;
};

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
        errs.soChoToiDa = "Vui lòng nhập số chỗ là số nguyên dương (> 0)";
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

    if (item.ngayKhoiHanh && schedules && schedules.length > 0 && item.ngayKetThuc) {
        const autoEndDate = calculateAutoEndDate(item.ngayKhoiHanh, schedules);
        const userEndDate = new Date(item.ngayKetThuc);
        if (autoEndDate && userEndDate < autoEndDate) {
            errs.ngayKetThuc = `Lưu ý: Ngày kết thúc (${formatDateTime(userEndDate)}) sớm hơn gợi ý từ lịch trình (${formatDateTime(autoEndDate)}). Vui lòng kiểm tra lại nếu có di chuyển bằng tàu hỏa/máy bay.`;
        }
    }

    if (!isValidNonNegativeNumber(item.gia?.giaNguoiLon)) errs.giaNguoiLon = "Giá người lớn phải là số nguyên dương (> 0)";
    if (!isValidNonNegativeNumber(item.gia?.giaTreEm)) errs.giaTreEm = "Giá trẻ em phải là số nguyên dương (> 0)";
    if (item.gia?.giaEmBe !== "" && item.gia?.giaEmBe !== null && item.gia?.giaEmBe !== undefined) {
        if (!isValidNonNegativeNumber(item.gia.giaEmBe)) {
            errs.giaEmBe = "Giá em bé phải là số nguyên dương hoặc để trống";
        }
    }
    if (item.gia?.phuThuPhongDon !== "" && item.gia?.phuThuPhongDon !== null && item.gia?.phuThuPhongDon !== undefined) {
        if (!isValidNonNegativeNumber(item.gia.phuThuPhongDon)) {
            errs.phuThuPhongDon = "Phụ thu phòng đơn phải là số nguyên dương hoặc để trống";
        }
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
    const [guideLoading, setGuideLoading] = useState(false);
    const [isCurrentGuideAdded, setIsCurrentGuideAdded] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [modalErrors, setModalErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [showConfirmUpdate, setShowConfirmUpdate] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const [autoEndDate, setAutoEndDate] = useState(null);
    const [appliedFromSchedule, setAppliedFromSchedule] = useState(false);

    const [wardOptions, setWardOptions] = useState([]);
    const [wardsLoading, setWardsLoading] = useState(false);
    const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
    const [selectedWardName, setSelectedWardName] = useState("");

    const safeData = Array.isArray(value) ? value : [];

    useEffect(() => {
        if (currentSchedule?.ngayKhoiHanh && lichTrinhMau && lichTrinhMau.length > 0) {
            const endDate = calculateAutoEndDate(currentSchedule.ngayKhoiHanh, lichTrinhMau);
            setAutoEndDate(endDate);
        } else {
            setAutoEndDate(null);
        }
    }, [currentSchedule?.ngayKhoiHanh, lichTrinhMau]);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const vehicleRes = await getAllVehicleApi();
                setVehicles(Array.isArray(vehicleRes) ? vehicleRes : []);
            } catch {
                toastError("Tải dữ liệu thất bại", "Không thể tải danh sách phương tiện.");
            }
        };
        fetchVehicles();
    }, []);

    // Fetch guides - dựa trên khoảng thời gian (ngày khởi hành -> ngày kết thúc), không còn theo tháng
    useEffect(() => {
        if (!currentSchedule?.ngayKhoiHanh || !currentSchedule?.ngayKetThuc) {
            setGuides([]);
            setIsCurrentGuideAdded(false);
            return;
        }

        let cancelled = false;

        const fetchGuides = async () => {
            try {
                setGuideLoading(true);

                const excludeMaChuyen = isEditMode ? currentSchedule.maChuyen : null;

                const availableGuideRes = await getAllTourGuideApi(
                    currentSchedule.ngayKhoiHanh,
                    currentSchedule.ngayKetThuc,
                    excludeMaChuyen
                );
                const availableGuideList = (availableGuideRes.data || availableGuideRes || []).map(({ maNhanVien, hoTen }) => ({
                    maHDV: maNhanVien,
                    tenHDV: hoTen
                }));

                if (cancelled) return;

                // Luôn thêm HDV đã chọn vào danh sách để hiển thị (kể cả khi không còn rảnh)
                let finalGuideList = [...availableGuideList];
                let isCurrentAdded = false;

                if (currentSchedule?.maHDV) {
                    const stillAvailable = availableGuideList.some(g => g.maHDV === currentSchedule.maHDV);

                    if (!stillAvailable) {
                        try {
                            const staffRes = await getStaffByIdApi(currentSchedule.maHDV);
                            if (!cancelled && staffRes && staffRes.maNhanVien) {
                                const currentGuide = {
                                    maHDV: staffRes.maNhanVien,
                                    tenHDV: staffRes.hoTen,
                                    isCurrent: true
                                };
                                finalGuideList = [currentGuide, ...availableGuideList];
                                isCurrentAdded = true;
                            }
                        } catch {
                            // Không lấy được thông tin HDV, giữ nguyên danh sách khả dụng
                        }
                    }
                }

                if (cancelled) return;

                setGuides(finalGuideList);
                setIsCurrentGuideAdded(isCurrentAdded);

                // Ở edit mode: nếu HDV đã chọn bị trùng lịch với chuyến khác -> reset và cảnh báo
                if (isEditMode && !isViewMode && currentSchedule?.maHDV) {
                    const stillAvailable = availableGuideList.some(g => g.maHDV === currentSchedule.maHDV);
                    if (!stillAvailable) {
                        setCurrentSchedule(prev => prev ? { ...prev, maHDV: "" } : prev);
                        toastWarning(
                            "Hướng dẫn viên bị trùng lịch",
                            "HDV đã chọn đang có chuyến khác trùng thời gian với chuyến này, vui lòng chọn HDV khác."
                        );
                    }
                }
            } catch (error) {
                console.error("Lỗi fetch guides:", error);
                if (!isViewMode) {
                    toastError("Tải dữ liệu thất bại", "Không thể tải danh sách hướng dẫn viên.");
                }
            } finally {
                if (!cancelled) setGuideLoading(false);
            }
        };
        fetchGuides();

        return () => { cancelled = true; };
    }, [currentSchedule?.ngayKhoiHanh, currentSchedule?.ngayKetThuc, currentSchedule?.maHDV, currentSchedule?.maChuyen, isEditMode, isViewMode]);

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

    const handleFieldChange = useCallback((field, val) => {
        setCurrentSchedule(prev => {
            if (!prev) return prev;
            const updated = { ...prev, [field]: val };

            if (field === "ngayKhoiHanh" && val && lichTrinhMau && lichTrinhMau.length > 0) {
                const { firstDayStart, firstDayEnd } = getScheduleTimes(lichTrinhMau);

                if (firstDayStart) {
                    const startDate = new Date(val);
                    const [hours, minutes] = firstDayStart.split(':').map(Number);
                    startDate.setHours(hours, minutes, 0, 0);
                    updated.ngayKhoiHanh = startDate;
                }

                if (firstDayEnd && !prev.gioDenNoiDi) {
                    const endDate = new Date(val);
                    const [hours, minutes] = firstDayEnd.split(':').map(Number);
                    endDate.setHours(hours, minutes, 0, 0);
                    updated.gioDenNoiDi = endDate;
                }

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

    const applyTimeFromSchedule = useCallback(() => {
        if (!currentSchedule || !lichTrinhMau || lichTrinhMau.length === 0) return;

        const { firstDayStart, firstDayEnd } = getScheduleTimes(lichTrinhMau);

        let startDate = null;
        let endDate = null;

        if (firstDayStart && currentSchedule.ngayKhoiHanh) {
            startDate = new Date(currentSchedule.ngayKhoiHanh);
            const [hours, minutes] = firstDayStart.split(':').map(Number);
            startDate.setHours(hours, minutes, 0, 0);
        }

        if (firstDayEnd && currentSchedule.ngayKhoiHanh) {
            endDate = new Date(currentSchedule.ngayKhoiHanh);
            const [hours, minutes] = firstDayEnd.split(':').map(Number);
            endDate.setHours(hours, minutes, 0, 0);
        }

        if (startDate && endDate) {
            setCurrentSchedule(prev => ({
                ...prev,
                ngayKhoiHanh: startDate,
                gioDenNoiDi: endDate
            }));

            const autoEnd = calculateAutoEndDate(startDate, lichTrinhMau);
            setAutoEndDate(autoEnd);
            setAppliedFromSchedule(true);

            toastSuccess("Thành công", "Đã áp dụng thời gian từ lịch trình.");
        }
    }, [currentSchedule, lichTrinhMau]);

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
        if (field === "giaEmBe" || field === "phuThuPhongDon") {
            if (val === "" || val === null || val === undefined) {
                setCurrentSchedule(prev => ({
                    ...prev,
                    gia: { ...prev.gia, [field]: "" }
                }));
                setModalErrors(prev => {
                    const next = { ...prev };
                    delete next[field];
                    return next;
                });
                return;
            }
        }

        if (val !== "" && val !== null && val !== undefined) {
            const numValue = Number(val);
            if (!Number.isInteger(numValue) || numValue < 0) {
                toastWarning("Giá trị không hợp lệ", "Vui lòng nhập số nguyên dương.");
                return;
            }
        }

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
        setAppliedFromSchedule(false);
        setIsCurrentGuideAdded(false);
    }, [isSaving]);

    const validateAndShowErrors = useCallback((item) => {
        const errors = validateDeparture(item, lichTrinhMau);
        if (Object.keys(errors).length > 0) {
            setModalErrors(errors);
            const firstError = Object.values(errors)[0];
            toastWarning("Dữ liệu chưa hợp lệ", firstError);
            return false;
        }
        return true;
    }, [lichTrinhMau]);

    const saveSchedule = useCallback(async (scheduleToSave, isUpdate) => {
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
            toastSuccess("Thành công", isUpdate ? "Đã cập nhật chuyến" : "Đã thêm chuyến mới");
        } catch (err) {
            toastError("Lỗi", err?.message || "Không thể lưu.");
            throw err;
        } finally {
            setIsSaving(false);
        }
    }, [safeData, onChange]);

    const handleSave = useCallback(() => {
        if (!currentSchedule || isSaving) return;

        if (isEditMode && currentSchedule.maChuyen) {
            const existingItem = safeData.find(ch => ch.maChuyen === currentSchedule.maChuyen);
            if (existingItem && existingItem.soChoDaDat > 0) {
                toastError("Không thể sửa", "Chuyến này đã có người đặt, không được phép chỉnh sửa!");
                return;
            }
        }

        if (!validateAndShowErrors(currentSchedule)) {
            return;
        }

        if (isEditMode && currentSchedule.maChuyen) {
            setShowConfirmUpdate(true);
        } else {
            const scheduleToSave = JSON.parse(JSON.stringify(currentSchedule));
            saveSchedule(scheduleToSave, false);
        }
    }, [currentSchedule, isSaving, isEditMode, safeData, validateAndShowErrors, saveSchedule]);

    const doDelete = useCallback(async () => {
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
    }, [currentSchedule, isSaving, safeData, onChange]);

    const handleDelete = useCallback(() => {
        if (!currentSchedule || isSaving) return;
        if (currentSchedule.soChoDaDat > 0) {
            toastError("Không thể xóa", "Chuyến này đã có người đặt, không được phép xóa!");
            return;
        }
        setShowConfirmDelete(true);
    }, [currentSchedule, isSaving]);

    useImperativeHandle(ref, () => ({
        openModal: () => {
            const empty = makeEmptySchedule();

            if (lichTrinhMau && lichTrinhMau.length > 0) {
                const { firstDayStart, firstDayEnd } = getScheduleTimes(lichTrinhMau);

                const defaultDate = new Date();
                defaultDate.setDate(defaultDate.getDate() + 1);

                if (firstDayStart) {
                    const startDate = formatTimeToDate(firstDayStart, defaultDate);
                    if (startDate) {
                        empty.ngayKhoiHanh = startDate;
                    }
                }

                if (firstDayEnd) {
                    const endDate = formatTimeToDate(firstDayEnd, defaultDate);
                    if (endDate) {
                        empty.gioDenNoiDi = endDate;
                    }
                }
            }

            setCurrentSchedule(empty);
            setIsEditMode(false);
            setModalErrors({});
            setSelectedWardName("");
            setAutoEndDate(null);
            setAppliedFromSchedule(false);
            setShowModal(true);
        },
        openEditModal: (item) => {
            const cloned = JSON.parse(JSON.stringify(item));
            setCurrentSchedule(cloned);
            setIsEditMode(true);
            setModalErrors({});
            setSelectedWardName(getWardOnlyFromDiemDen(cloned.diemDen));
            setAutoEndDate(null);
            setAppliedFromSchedule(false);
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

    if (!showModal || !currentSchedule) return null;

    const hasBooking = (currentSchedule?.soChoDaDat ?? 0) > 0;
    const disabled = isViewMode || isSaving || hasBooking;
    const today = new Date();
    const showApplyButton = !disabled && lichTrinhMau.length > 1;
    const scheduleTimes = getScheduleTimes(lichTrinhMau);

    return (
        <>
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/20">
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
                                label="Điểm khởi hành"
                                value={currentSchedule.diemKhoiHanh || ""}
                                options={DIEM_DI_OPTIONS}
                                valueKey="value"
                                labelKey="label"
                                error={modalErrors.diemKhoiHanh}
                                onChange={(e) => handleFieldChange("diemKhoiHanh", getVal(e))}
                                disabled={disabled}
                            />

                            <SelectField
                                label="Điểm đến (Tỉnh/Thành phố)"
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                            <SelectField
                                label="Phương tiện"
                                value={currentSchedule.maPhuongTien || ""}
                                options={vehicles}
                                valueKey="maPhuongTien"
                                labelKey="tenPhuongTien"
                                error={modalErrors.maPhuongTien}
                                onChange={(e) => handleFieldChange("maPhuongTien", getVal(e))}
                                disabled={disabled}
                            />
                        </div>

                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">THỜI GIAN LỊCH TRÌNH</p>
                                {showApplyButton && (
                                    <button
                                        type="button"
                                        onClick={applyTimeFromSchedule}
                                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-blue-400 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        Lấy từ lịch trình
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Ngày giờ khởi hành
                                    </label>
                                    <DateTimePicker
                                        value={currentSchedule.ngayKhoiHanh ? new Date(currentSchedule.ngayKhoiHanh) : null}
                                        onChange={(date) => handleFieldChange("ngayKhoiHanh", date)}
                                        error={modalErrors.ngayKhoiHanh}
                                        disabled={disabled}
                                        minDate={today}
                                    />
                                    {appliedFromSchedule && scheduleTimes.firstDayStart && (
                                        <p className="text-[10px] text-green-600 mt-1 flex items-center gap-1">
                                            <span>Đã áp dụng từ lịch trình: {scheduleTimes.firstDayStart}</span>
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Ngày giờ đến nơi đi
                                    </label>
                                    <DateTimePicker
                                        value={currentSchedule.gioDenNoiDi ? new Date(currentSchedule.gioDenNoiDi) : null}
                                        onChange={(date) => handleFieldChange("gioDenNoiDi", date)}
                                        error={modalErrors.gioDenNoiDi}
                                        disabled={disabled}
                                        minDate={currentSchedule.ngayKhoiHanh ? new Date(currentSchedule.ngayKhoiHanh) : today}
                                    />
                                    {appliedFromSchedule && scheduleTimes.firstDayEnd && (
                                        <p className="text-[10px] text-green-600 mt-1 flex items-center gap-1 flex-wrap">
                                            <span>Đã áp dụng từ lịch trình: {scheduleTimes.firstDayEnd}</span>
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Ngày giờ kết thúc
                                    </label>
                                    <DateTimePicker
                                        value={currentSchedule.ngayKetThuc ? new Date(currentSchedule.ngayKetThuc) : null}
                                        onChange={(date) => handleFieldChange("ngayKetThuc", date)}
                                        error={modalErrors.ngayKetThuc}
                                        disabled={disabled}
                                        minDate={currentSchedule.gioDenNoiDi ? new Date(currentSchedule.gioDenNoiDi) : today}
                                    />
                                  
                                    {!isViewMode && autoEndDate && currentSchedule.ngayKetThuc && (
                                        <div className="mt-1">
                                            <p className="text-[10px] text-emerald-500 flex items-center gap-1">
                                                <span>Gợi ý từ lịch trình: {formatDateTime(autoEndDate)}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        handleFieldChange("ngayKetThuc", autoEndDate);
                                                        toastSuccess("Thành công", "Đã áp dụng ngày kết thúc gợi ý từ lịch trình.");
                                                    }}
                                                    className="text-[10px] text-sky-500 hover:text-sky-700 underline"
                                                    disabled={disabled}
                                                >
                                                    Áp dụng
                                                </button>
                                            </p>
                                        </div>
                                    )}
                                    {lichTrinhMau.length === 0 && (
                                        <p className="text-[10px] text-amber-500 mt-1">
                                            Chưa có lịch trình để gợi ý ngày kết thúc
                                        </p>
                                    )}
                                    {modalErrors.ngayKetThuc && (
                                        <p className="text-[10px] text-red-500 mt-1">{modalErrors.ngayKetThuc}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                        Ngày giờ đến nơi về
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
                                    { field: "giaNguoiLon", label: "Giá người lớn", required: true },
                                    { field: "giaTreEm", label: "Giá trẻ em", required: true },
                                    { field: "giaEmBe", label: "Giá em bé", required: false },
                                    { field: "phuThuPhongDon", label: "Phụ thu phòng đơn", required: false },
                                ].map(({ field, label, required }) => (
                                    <InputField
                                        key={field}
                                        type="number"
                                        label={label}
                                        value={currentSchedule.gia?.[field] || ""}
                                        error={modalErrors[field]}
                                        onChange={(e) => {
                                            const val = getVal(e);
                                            if ((field === "giaEmBe" || field === "phuThuPhongDon") && val === "") {
                                                handleGiaChange(field, val);
                                                return;
                                            }
                                            if (val !== "" && val !== null && val !== undefined) {
                                                const num = Number(val);
                                                if (!Number.isInteger(num) || num < 0) {
                                                    toastWarning("Giá trị không hợp lệ", "Vui lòng nhập số nguyên dương.");
                                                    return;
                                                }
                                            }
                                            handleGiaChange(field, val);
                                        }}
                                        disabled={disabled}
                                        required={required}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <SelectField
                                label="Hướng dẫn viên"
                                searchable
                                searchText="Tìm hướng dẫn viên"
                                value={currentSchedule.maHDV || ""}
                                options={guides}
                                valueKey="maHDV"
                                labelKey="tenHDV"
                                error={modalErrors.maHDV}
                                onChange={(e) => handleFieldChange("maHDV", getVal(e))}
                                disabled={disabled || guideLoading || isViewMode}
                                loading={guideLoading}
                            />
                            {guideLoading && (
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                    <Loader2 size={12} className="animate-spin" /> Đang tải danh sách HDV...
                                </p>
                            )}
                            {isViewMode && isCurrentGuideAdded && (
                                <p className="text-xs text-amber-500 mt-1 flex items-center gap-1">
                                    <span> HDV này đang có chuyến khác trùng thời gian, chỉ hiển thị để tham khảo.</span>
                                </p>
                            )}
                            {!guideLoading && guides.length === 0 && currentSchedule?.ngayKhoiHanh && !isViewMode && (
                                <p className="text-xs text-amber-500 mt-1">
                                    Không có HDV nào còn trống trong khoảng thời gian này
                                </p>
                            )}

                            {!isViewMode && !currentSchedule?.ngayKetThuc && (
                                <p className="text-[10px] text-slate-400 mt-1">
                                    Vui lòng chọn ngày giờ khởi hành và kết thúc để tải danh sách HDV còn trống.
                                </p>
                            )}
                        </div>

                        <InputField
                            type="number"
                            label="Số chỗ tối đa"
                            value={currentSchedule.soChoToiDa || ""}
                            error={modalErrors.soChoToiDa}
                            onChange={(e) => {
                                const val = getVal(e);
                                if (val !== "" && val !== null) {
                                    const num = Number(val);
                                    if (!Number.isInteger(num) || num <= 0) {
                                        toastWarning("Giá trị không hợp lệ", "Số chỗ phải là số nguyên dương (> 0).");
                                        return;
                                    }
                                }
                                handleFieldChange("soChoToiDa", val);
                            }}
                            disabled={disabled}
                            required
                        />
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
                        {isViewMode && (
                            <button
                                onClick={handleClose}
                                className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-medium transition-colors"
                            >
                                Đóng
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
                onConfirm={() => {
                    setShowConfirmUpdate(false);
                    const scheduleToSave = JSON.parse(JSON.stringify(currentSchedule));
                    saveSchedule(scheduleToSave, true);
                }}
                onCancel={() => setShowConfirmUpdate(false)}
            />
        </>
    );
});

export default TourScheduleSection;