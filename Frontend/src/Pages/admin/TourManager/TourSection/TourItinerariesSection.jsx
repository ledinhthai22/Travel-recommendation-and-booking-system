import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Utensils, Camera, X, Trash2, Plus, Loader2, Pencil, Bed, MapPin, AlertCircle } from "lucide-react";
import TourItinerariesTable from "../TourItinerariesTable";
import InputField from "~/components/UI/Form/InputField";
import Dropdown from "~/components/Common/Dropdown";
import SelectField from "~/components/UI/Form/SelectField";
import TimePicker from "~/components/UI/Form/TimePicker";
import { toastSuccess, toastWarning } from "~/utils/Toast";
import ConfirmModal from "~/components/UI/Modal/ConfirmModal";
import { getProvincesApi } from "~/Services/ProvinceService";
import { getLocationsByProvinceApi } from "~/Services/LocationService";
import { getHotelsByAddressApi } from "~/Services/HotelService";

const BUA_AN_OPTIONS = [
    { value: "", label: "Không có" },
    { value: "Trưa, Tối", label: "Trưa, Tối" },
    { value: "Sáng, Trưa, Tối", label: "Sáng, Chiều, Tối" },
];

const makeTempId = () => `CTLT-TEMP-${Date.now()}-${Math.random()}`;

const getSubKey = (sub) => (sub.maCTLT > 0 ? `DB-${sub.maCTLT}` : sub.tempId);

const timeToMinutes = (time) => {
    if (!time) return 0;
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
};

const hasTimeOverlap = (rows, newStart, newEnd) =>
    rows.some((row) => {
        const start = timeToMinutes(row.gioBatDau);
        const end = timeToMinutes(row.gioKetThuc || row.gioBatDau);
        return newStart < end && newEnd > start;
    });

const makeSubRow = () => ({
    tempId: makeTempId(),
    maCTLT: 0,
    gioBatDau: "",
    gioKetThuc: null,
    maDiaDiem: "", // Vẫn giữ nhưng không bắt buộc
    hoatDong: "",
});

const makeDayRow = (nextDayNumber) => ({
    id: `LT-NEW-${Date.now()}`,
    soThuTuNgay: nextDayNumber,
    tenLichTrinh: `Hành trình Ngày ${nextDayNumber}`,
    buaAn: "",
    hoatDongChinh: "",
    luuY: "",
    trangThai: true,
    maKhachSan: "",
    preview: null,
    file: null,
    chiTietLichTrinhs: [],
});

const validateItinerary = (item) => {
    const errs = {};
    if (!item?.tenLichTrinh?.trim()) errs.tenLichTrinh = "Vui lòng nhập tiêu đề ngày";
    if (!item?.chiTietLichTrinhs?.length) errs.chiTietLichTrinhs = "Vui lòng thêm ít nhất 1 mốc hoạt động";

    if (item?.chiTietLichTrinhs?.length > 0) {
        const invalidActivities = item.chiTietLichTrinhs.filter(
            act => !act.gioBatDau || !act.hoatDong?.trim() // ✅ Bỏ kiểm tra maDiaDiem
        );
        if (invalidActivities.length > 0) {
            errs.chiTietLichTrinhs = `Có ${invalidActivities.length} mốc hoạt động chưa đầy đủ thông tin.`;
        }
    }

    return errs;
};

const getLatestEndTime = (chiTietLichTrinhs) => {
    if (!chiTietLichTrinhs || chiTietLichTrinhs.length === 0) return null;

    let latestTime = 0;
    chiTietLichTrinhs.forEach(act => {
        if (act.gioKetThuc) {
            const minutes = timeToMinutes(act.gioKetThuc);
            if (minutes > latestTime) latestTime = minutes;
        } else if (act.gioBatDau) {
            const minutes = timeToMinutes(act.gioBatDau);
            if (minutes > latestTime) latestTime = minutes;
        }
    });

    return latestTime > 0 ? latestTime : null;
};

export default function TourItinerariesSection({
    value = [],
    onChange,
    diaDiems = [],
    khachSans = [],
    isViewMode = false,
    loading = false,
    canAddDay,
    isLocked = false,
    hasBooking = false,
}) {
    const [showItineraryModal, setShowItineraryModal] = useState(false);
    const [currentItinerary, setCurrentItinerary] = useState(null);
    const [newSubRow, setNewSubRow] = useState(makeSubRow);
    const [modalMode, setModalMode] = useState("EDIT");
    const [modalErrors, setModalErrors] = useState({});
    const [timelineError, setTimelineError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);
    const [editingSubKey, setEditingSubKey] = useState(null);
    const [editingSubRow, setEditingSubRow] = useState(null);

    const [provinces, setProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [diaDiemsByProvince, setDiaDiemsByProvince] = useState([]);
    const [khachSansByProvince, setKhachSansByProvince] = useState([]);
    const [loadingProvinceData, setLoadingProvinceData] = useState(false);

    const safeData = Array.isArray(value) ? value : [];

    const effectiveDiaDiems = selectedProvince ? diaDiemsByProvince : diaDiems;
    const effectiveKhachSans = selectedProvince ? khachSansByProvince : khachSans;

    const selectedLocationIds = useMemo(
        () => currentItinerary?.chiTietLichTrinhs?.map((item) => String(item.maDiaDiem)).filter(Boolean) ?? [],
        [currentItinerary?.chiTietLichTrinhs]
    );

    const availableLocations = useMemo(
        () => effectiveDiaDiems.filter((item) => !selectedLocationIds.includes(String(item.maDiaDiem))),
        [effectiveDiaDiems, selectedLocationIds]
    );

    const getAvailableLocationsForEdit = useCallback(
        (currentLocationId) =>
            effectiveDiaDiems.filter(
                (item) =>
                    String(item.maDiaDiem) === String(currentLocationId) ||
                    !selectedLocationIds.includes(String(item.maDiaDiem))
            ),
        [effectiveDiaDiems, selectedLocationIds]
    );

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const data = await getProvincesApi();
                setProvinces(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (!selectedProvince) {
            setDiaDiemsByProvince([]);
            setKhachSansByProvince([]);
            return;
        }

        let cancelled = false;
        const fetchByProvince = async () => {
            try {
                setLoadingProvinceData(true);
                const [locs, hotels] = await Promise.all([
                    getLocationsByProvinceApi(selectedProvince),
                    getHotelsByAddressApi(selectedProvince),
                ]);
                if (cancelled) return;
                setDiaDiemsByProvince(Array.isArray(locs) ? locs : []);
                setKhachSansByProvince(Array.isArray(hotels) ? hotels : []);
            } catch (error) {
                if (cancelled) return;
                console.error(error);
                toastWarning(
                    "Lỗi tải dữ liệu",
                    "Không thể tải điểm tham quan/khách sạn theo tỉnh thành đã chọn."
                );
                setDiaDiemsByProvince([]);
                setKhachSansByProvince([]);
            } finally {
                if (!cancelled) setLoadingProvinceData(false);
            }
        };

        fetchByProvince();
        return () => { cancelled = true; };
    }, [selectedProvince]);

    const openAddModal = () => {
        if (hasBooking) {
            toastWarning(
                "Không thể thêm ngày",
                "Tour đã có khách đặt, không được phép thay đổi lịch trình."
            );
            return;
        }

        setCurrentItinerary(makeDayRow(safeData.length + 1));
        setNewSubRow(makeSubRow());
        setModalErrors({});
        setTimelineError("");
        setModalMode("ADD");
        setSelectedProvince("");
        setDiaDiemsByProvince([]);
        setKhachSansByProvince([]);
        setShowItineraryModal(true);
    };

    const handleEditClick = useCallback((row) => {
        if (hasBooking) {
            toastWarning(
                "Không thể sửa lịch trình",
                "Tour đã có khách đặt, không được phép thay đổi lịch trình."
            );
            return;
        }

        setCurrentItinerary({
            ...row,
            file: null,
            preview: row.preview || null,
            maKhachSan: row.maKhachSan?.toString() || "",
            chiTietLichTrinhs: (row.chiTietLichTrinhs || []).map((sub) => ({
                tempId: sub.tempId || makeTempId(),
                maCTLT: Number(sub.maCTLT || 0),
                gioBatDau: sub.gioBatDau || "",
                gioKetThuc: sub.gioKetThuc || null,
                maDiaDiem: sub.maDiaDiem || "",
                hoatDong: sub.hoatDong || "",
            })),
        });
        setNewSubRow(makeSubRow());
        setModalErrors({});
        setTimelineError("");
        setEditingSubKey(null);
        setEditingSubRow(null);
        setModalMode("EDIT");
        setSelectedProvince("");
        setDiaDiemsByProvince([]);
        setKhachSansByProvince([]);
        setShowItineraryModal(true);
    }, [hasBooking]);

    const handleCloseModal = () => {
        if (isSaving) return;
        setShowItineraryModal(false);
        setEditingSubKey(null);
        setEditingSubRow(null);
    };

    const handleFieldChange = useCallback((field, val) => {
        setCurrentItinerary((prev) => ({ ...prev, [field]: val }));
        setModalErrors((prev) => (prev[field] ? { ...prev, [field]: null } : prev));
    }, []);

    const handleModalImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCurrentItinerary((prev) => ({ ...prev, file, preview: URL.createObjectURL(file) }));
    };

    const handleProvinceChange = (val) => {
        setSelectedProvince(val);
    };

    const handleAddSubRow = () => {
        if (!newSubRow.gioBatDau) {
            setTimelineError("Vui lòng nhập giờ bắt đầu");
            toastWarning("Thiếu dữ liệu", "Mốc thời gian bắt đầu không được để trống.");
            return;
        }

        const newStart = timeToMinutes(newSubRow.gioBatDau);
        const newEnd = timeToMinutes(newSubRow.gioKetThuc || newSubRow.gioBatDau);

        if (newSubRow.gioKetThuc && timeToMinutes(newSubRow.gioKetThuc) <= newStart) {
            setTimelineError("Giờ kết thúc phải lớn hơn giờ bắt đầu");
            return;
        }
        
        // ✅ Bỏ kiểm tra bắt buộc chọn địa điểm
        if (!newSubRow.hoatDong?.trim()) {
            setTimelineError("Vui lòng nhập nội dung hoạt động");
            toastWarning("Thiếu dữ liệu", "Nội dung hoạt động không được để trống.");
            return;
        }

        const existingRows = currentItinerary?.chiTietLichTrinhs || [];
        if (hasTimeOverlap(existingRows, newStart, newEnd)) {
            setTimelineError("Khoảng thời gian bị trùng");
            toastWarning("Trùng thời gian", "Khoảng thời gian này giao với hoạt động khác.");
            return;
        }

        setCurrentItinerary((prev) => ({
            ...prev,
            chiTietLichTrinhs: [
                ...(prev.chiTietLichTrinhs || []),
                { ...newSubRow, tempId: makeTempId(), maCTLT: 0 },
            ],
        }));
        setNewSubRow(makeSubRow());
        setTimelineError("");
    };

    const handleEditSubRow = (sub) => {
        setEditingSubKey(getSubKey(sub));
        setEditingSubRow({ ...sub });
    };

    const handleCancelEditSubRow = () => {
        setEditingSubKey(null);
        setEditingSubRow(null);
    };

    const handleSaveSubRow = () => {
        if (!editingSubRow.gioBatDau) return toastWarning("Thiếu dữ liệu", "Vui lòng nhập giờ bắt đầu.");
        if (editingSubRow.gioKetThuc && timeToMinutes(editingSubRow.gioKetThuc) <= timeToMinutes(editingSubRow.gioBatDau)) {
            return toastWarning("Sai thời gian", "Giờ kết thúc phải lớn hơn giờ bắt đầu.");
        }
        // ✅ Bỏ kiểm tra bắt buộc chọn địa điểm
        if (!editingSubRow.hoatDong?.trim()) return toastWarning("Thiếu dữ liệu", "Nội dung hoạt động không được để trống.");

        const otherRows = currentItinerary.chiTietLichTrinhs.filter((item) => getSubKey(item) !== editingSubKey);

        if (hasTimeOverlap(otherRows, timeToMinutes(editingSubRow.gioBatDau), timeToMinutes(editingSubRow.gioKetThuc || editingSubRow.gioBatDau))) {
            return toastWarning("Trùng thời gian", "Khoảng thời gian bị giao với mốc khác.");
        }

        setCurrentItinerary((prev) => ({
            ...prev,
            chiTietLichTrinhs: prev.chiTietLichTrinhs.map((sub) =>
                getSubKey(sub) === editingSubKey ? editingSubRow : sub
            ),
        }));
        setEditingSubKey(null);
        setEditingSubRow(null);
    };

    const handleRemoveSubRow = (targetKey) => {
        setCurrentItinerary((prev) => ({
            ...prev,
            chiTietLichTrinhs: (prev.chiTietLichTrinhs || []).filter((sub) => getSubKey(sub) !== targetKey),
        }));
    };

    const checkScheduleImpact = useCallback(() => {
        if (!hasBooking) return true;

        const originalSchedule = safeData.find(lt => lt.id === currentItinerary?.id);
        if (!originalSchedule) return true;

        if (safeData.length !== value.length) {
            toastWarning(
                "Không thể thay đổi số ngày",
                "Tour đã có khách đặt, không được phép thêm hoặc xóa ngày."
            );
            return false;
        }
        const isLastDay = currentItinerary.soThuTuNgay === safeData.length;
        if (isLastDay) {
            const oldLatestEnd = getLatestEndTime(originalSchedule.chiTietLichTrinhs);
            const newLatestEnd = getLatestEndTime(currentItinerary.chiTietLichTrinhs);

            if (oldLatestEnd !== null && newLatestEnd !== null && newLatestEnd < oldLatestEnd) {
                toastWarning(
                    "Không thể giảm thời gian kết thúc",
                    "Ngày cuối của lịch trình không thể kết thúc sớm hơn vì đã có khách đặt."
                );
                return false;
            }
        }

        return true;
    }, [hasBooking, currentItinerary, safeData, value]);

    const handleSaveItineraryModal = async () => {
        if (!checkScheduleImpact()) return;

        const errors = validateItinerary(currentItinerary);
        if (Object.keys(errors).length > 0) {
            setModalErrors(errors);
            toastWarning("Dữ liệu chưa hợp lệ", "Vui lòng kiểm tra lại thông tin.");
            return;
        }

        const sortedTimeline = [...currentItinerary.chiTietLichTrinhs].sort(
            (a, b) => timeToMinutes(a.gioBatDau) - timeToMinutes(b.gioBatDau)
        );

        const itineraryToSave = { ...currentItinerary, chiTietLichTrinhs: sortedTimeline };
        const exists = safeData.some((lt) => lt.id === currentItinerary.id);
        const updatedList = exists
            ? safeData.map((lt) => (lt.id === itineraryToSave.id ? itineraryToSave : lt))
            : [...safeData, itineraryToSave];

        try {
            setIsSaving(true);
            await onChange?.(updatedList);
            toastSuccess("Thành công", `Đã lưu Ngày ${currentItinerary.soThuTuNgay}`);
            setShowItineraryModal(false);
        } catch {
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteClick = (row) => {
        if (hasBooking) {
            toastWarning(
                "Không thể xóa ngày",
                "Tour đã có khách đặt, không được phép xóa ngày trong lịch trình."
            );
            return;
        }
        setSelectedDeleteItem(row);
        setShowDeleteModal(true);
    };

    const confirmDeleteItinerary = async () => {
        if (!selectedDeleteItem) return;
        const updatedList = safeData.filter((lt) => lt.id !== selectedDeleteItem.id);
        try {
            setIsSaving(true);
            await onChange?.(updatedList);
            toastSuccess("Thành công", `Đã xóa Ngày ${selectedDeleteItem.soThuTuNgay}`);
        } finally {
            setShowDeleteModal(false);
            setSelectedDeleteItem(null);
            setIsSaving(false);
        }
    };

    const isActuallyLocked = isLocked || hasBooking || isViewMode || isSaving;

    return (
        <section className="border-t border-slate-200 pt-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                        Lịch trình chi tiết theo ngày
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Tổng số: {safeData.length} ngày hành trình</p>
                </div>

                {hasBooking && (
                    <span className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                        <AlertCircle size={14} />
                        Đã khóa (có khách đặt)
                    </span>
                )}

                {!isViewMode && !isLocked && !hasBooking && (
                    <button
                        type="button"
                        disabled={!canAddDay || isSaving || isLocked}
                        onClick={openAddModal}
                        className="flex items-center gap-1.5 px-4 py-2 text-white font-medium text-xs rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50"
                    >
                        <Plus size={16} /> Thêm ngày
                    </button>
                )}
            </div>

            <TourItinerariesTable
                data={safeData}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                isViewMode={isViewMode}
                loading={loading}
                isLocked={isActuallyLocked}
            />

            {showItineraryModal && currentItinerary && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/20">
                    <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh]">
                        <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-800">
                                Ngày {currentItinerary.soThuTuNgay} —{" "}
                                {modalMode === "ADD" ? "Thêm mới" : "Cập nhật"} lịch trình
                            </h2>
                            <button onClick={handleCloseModal} disabled={isSaving} className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        {hasBooking && (
                            <div className="mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                                <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                <div className="text-sm text-amber-700">
                                    <p className="font-medium">Lịch trình đã có khách đặt</p>
                                    <p className="text-xs text-amber-600 mt-0.5">
                                        Bạn chỉ có thể thay đổi thời gian kết thúc (tăng lên), không thể giảm hoặc thay đổi số ngày.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-slate-50/50">
                            <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="w-full md:w-1/4 shrink-0">
                                    <div className="aspect-[5/3] w-full rounded-xl border border-slate-200 overflow-hidden relative group bg-slate-50">
                                        {currentItinerary.preview ? (
                                            <img src={currentItinerary.preview} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-1">
                                                <Camera size={40} />
                                                <span className="text-[11px] text-slate-400 font-medium">Chưa có ảnh đại diện</span>
                                            </div>
                                        )}
                                        {!isActuallyLocked && (
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleModalImageChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 space-y-5">
                                    <InputField
                                        label="Tiêu đề ngày"
                                        value={currentItinerary.tenLichTrinh || ""}
                                        onChange={(e) => handleFieldChange("tenLichTrinh", e.target.value)}
                                        disabled={isActuallyLocked}
                                        required
                                    />

                                    <div>
                                        <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                                            <MapPin size={14} className="text-slate-400" /> Tỉnh/Thành phố
                                            {loadingProvinceData && <Loader2 size={12} className="animate-spin text-sky-500" />}
                                        </label>
                                        <SelectField
                                            searchable
                                            value={selectedProvince}
                                            options={provinces}
                                            valueKey="name"
                                            labelKey="name"
                                            placeholder="Chọn tỉnh/thành để lọc điểm tham quan & khách sạn"
                                            onChange={handleProvinceChange}
                                            disabled={isActuallyLocked}
                                        />
                                        <p className="text-[11px] text-slate-400 mt-1">
                                            Chọn tỉnh/thành để danh sách điểm tham quan và khách sạn bên dưới chỉ hiển thị theo khu vực này.
                                            Bỏ chọn để xem lại toàn bộ danh sách.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                                                <Utensils size={14} className="text-slate-400" /> Chế độ bữa ăn
                                            </label>
                                            <Dropdown
                                                value={currentItinerary.buaAn || ""}
                                                options={BUA_AN_OPTIONS}
                                                onChange={(val) => handleFieldChange("buaAn", val)}
                                                disabled={isActuallyLocked}
                                                fullWidth
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                                                <Bed size={14} className="text-slate-400" /> Khách sạn nghỉ đêm
                                            </label>
                                            <SelectField
                                                searchable
                                                value={currentItinerary.maKhachSan || ""}
                                                options={effectiveKhachSans}
                                                valueKey="maKhachSan"
                                                labelKey="tenKhachSan"
                                                placeholder={selectedProvince ? "Chọn khách sạn trong tỉnh/thành" : "Chọn khách sạn"}
                                                onChange={(val) => handleFieldChange("maKhachSan", val)}
                                                disabled={isActuallyLocked || loadingProvinceData}
                                            />
                                            {selectedProvince && effectiveKhachSans.length === 0 && !loadingProvinceData && (
                                                <p className="text-[11px] text-amber-500 mt-1">
                                                    Không tìm thấy khách sạn nào thuộc tỉnh/thành đã chọn.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`bg-white border rounded-2xl shadow-sm ${modalErrors.chiTietLichTrinhs ? "border-red-400" : "border-slate-200"}`}>
                                {!isViewMode && !isLocked && !hasBooking && (
                                    <div className="p-5 bg-slate-50/70 border-b border-slate-100 space-y-4">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">Thêm mốc thời gian & hoạt động</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                            <div className="md:col-span-3">
                                                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Giờ bắt đầu *</label>
                                                <TimePicker
                                                    value={newSubRow.gioBatDau}
                                                    onChange={(timeStr) => setNewSubRow((p) => ({ ...p, gioBatDau: timeStr }))}
                                                />
                                            </div>
                                            <div className="md:col-span-3">
                                                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Giờ kết thúc</label>
                                                <TimePicker
                                                    value={newSubRow.gioKetThuc}
                                                    onChange={(timeStr) => setNewSubRow((p) => ({ ...p, gioKetThuc: timeStr }))}
                                                />
                                            </div>
                                            <div className="md:col-span-5">
                                                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                                                    Địa điểm tham quan
                                                    {selectedProvince && <span className="text-sky-500 normal-case font-medium"> (theo {selectedProvince})</span>}
                                                </label>
                                                <SelectField
                                                    searchable
                                                    value={newSubRow.maDiaDiem}
                                                    options={availableLocations}
                                                    valueKey="maDiaDiem"
                                                    labelKey="tenDiaDiem"
                                                    placeholder={selectedProvince ? "Chọn địa điểm trong tỉnh/thành" : "Chọn địa điểm (không bắt buộc)"}
                                                    onChange={(val) => setNewSubRow((p) => ({ ...p, maDiaDiem: val }))}
                                                    disabled={isSaving || loadingProvinceData}
                                                    isClearable={true}
                                                />
                                                {selectedProvince && availableLocations.length === 0 && !loadingProvinceData && (
                                                    <p className="text-[11px] text-amber-500 mt-1">
                                                        Không còn địa điểm nào thuộc tỉnh/thành đã chọn.
                                                    </p>
                                                )}
                                            </div>
                                            <div className="md:col-span-1 pt-6">
                                                <button
                                                    type="button"
                                                    onClick={handleAddSubRow}
                                                    disabled={isSaving}
                                                    className="px-7 py-3.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-4xl shadow-sm transition-colors"
                                                >
                                                    Thêm
                                                </button>
                                            </div>

                                            <div className="md:col-span-12">
                                                <InputField
                                                    multiline
                                                    rows={2}
                                                    placeholder="Nội dung hoạt động chi tiết tại địa điểm này..."
                                                    value={newSubRow.hoatDong}
                                                    onChange={(e) => setNewSubRow((p) => ({ ...p, hoatDong: e.target.value }))}
                                                />
                                            </div>
                                            {timelineError && <p className="text-red-500 text-xs md:col-span-12 font-medium mt-1">{timelineError}</p>}
                                        </div>
                                    </div>
                                )}

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100 text-xs uppercase tracking-wider">
                                                <th className="py-3 px-5 w-64">Thời gian</th>
                                                <th className="py-3 px-5 w-64">Địa điểm</th>
                                                <th className="py-3 px-5">Chi tiết hoạt động</th>
                                                {!isViewMode && !isLocked && !hasBooking && <th className="py-3 px-5 w-28 text-center">Thao tác</th>}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {(currentItinerary.chiTietLichTrinhs || []).length === 0 ? (
                                                <tr>
                                                    <td colSpan={isViewMode || isLocked || hasBooking ? 3 : 4} className="py-10 px-5 text-center text-slate-400 italic">
                                                        Chưa có mốc hoạt động chi tiết nào cho ngày này.
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentItinerary.chiTietLichTrinhs.map((sub) => {
                                                    const subKey = getSubKey(sub);
                                                    const isEditing = editingSubKey === subKey;
                                                    const loc = diaDiems.find((d) => String(d.maDiaDiem) === String(sub.maDiaDiem));

                                                    return (
                                                        <tr key={subKey} className="hover:bg-slate-50/60 transition-colors">
                                                            <td className="py-4 px-5 vertical-align-top font-medium text-slate-700">
                                                                {isEditing ? (
                                                                    <div className="flex items-center gap-2 min-w-[260px]">
                                                                        <TimePicker value={editingSubRow.gioBatDau} onChange={(t) => setEditingSubRow((p) => ({ ...p, gioBatDau: t }))} />
                                                                        <span className="text-slate-400 shrink-0">-</span>
                                                                        <TimePicker value={editingSubRow.gioKetThuc} onChange={(t) => setEditingSubRow((p) => ({ ...p, gioKetThuc: t }))} />
                                                                    </div>
                                                                ) : (
                                                                    <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-semibold">
                                                                        {sub.gioBatDau}{sub.gioKetThuc ? ` - ${sub.gioKetThuc}` : ""}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="py-4 px-5 text-slate-700">
                                                                {isEditing ? (
                                                                    <SelectField
                                                                        searchable
                                                                        value={editingSubRow.maDiaDiem}
                                                                        options={getAvailableLocationsForEdit(editingSubRow.maDiaDiem)}
                                                                        valueKey="maDiaDiem"
                                                                        labelKey="tenDiaDiem"
                                                                        placeholder="Không chọn"
                                                                        onChange={(val) => setEditingSubRow((p) => ({ ...p, maDiaDiem: val }))}
                                                                        isClearable={true}
                                                                    />
                                                                ) : (
                                                                    <span className="font-semibold text-slate-800">{loc?.tenDiaDiem || "Không chọn"}</span>
                                                                )}
                                                            </td>
                                                            <td className="py-4 px-5 text-slate-600 whitespace-pre-line leading-relaxed">
                                                                {isEditing ? (
                                                                    <InputField
                                                                        multiline
                                                                        rows={2}
                                                                        value={editingSubRow.hoatDong}
                                                                        onChange={(e) => setEditingSubRow((p) => ({ ...p, hoatDong: e.target.value }))}
                                                                    />
                                                                ) : (
                                                                    sub.hoatDong
                                                                )}
                                                            </td>
                                                            {!isViewMode && !isLocked && !hasBooking && (
                                                                <td className="py-4 px-5 text-center">
                                                                    {isEditing ? (
                                                                        <div className="flex items-center justify-center gap-2">
                                                                            <button onClick={handleSaveSubRow} className="px-2 py-1 text-xs bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md hover:bg-emerald-100 font-medium transition-colors">Lưu</button>
                                                                            <button onClick={handleCancelEditSubRow} className="px-2 py-1 text-xs bg-slate-50 text-slate-500 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors">Hủy</button>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex items-center justify-center gap-1">
                                                                            <button onClick={() => handleEditSubRow(sub)} className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors" title="Sửa"><Pencil size={15} /></button>
                                                                            <button onClick={() => handleRemoveSubRow(subKey)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa"><Trash2 size={15} /></button>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            )}
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {modalErrors.chiTietLichTrinhs && <p className="text-red-600 text-sm font-medium">{modalErrors.chiTietLichTrinhs}</p>}

                            <InputField
                                label="Lưu ý quan trọng cho ngày này"
                                multiline
                                rows={3}
                                value={currentItinerary.luuY || ""}
                                onChange={(e) => handleFieldChange("luuY", e.target.value)}
                                disabled={isActuallyLocked}
                                placeholder="Nhập các quy định, trang phục khuyên dùng, ghi chú sức khỏe hoặc lưu ý đặc biệt cho khách hàng..."
                            />
                        </div>

                        {!isViewMode && !isLocked && !hasBooking && (
                            <div className="p-4 px-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                                <button
                                    onClick={handleSaveItineraryModal}
                                    disabled={isSaving}
                                    className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold text-sm flex items-center gap-2 shadow-sm shadow-sky-100 transition-colors"
                                >
                                    {isSaving && <Loader2 size={16} className="animate-spin" />}
                                    {modalMode === "ADD" ? "Thêm vào lịch trình" : "Cập nhật lịch trình"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={showDeleteModal}
                title="Xóa lịch trình"
                message={selectedDeleteItem ? `Bạn có chắc muốn xóa Hành trình Ngày ${selectedDeleteItem.soThuTuNgay}?` : ""}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
                onConfirm={confirmDeleteItinerary}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setSelectedDeleteItem(null);
                    setIsSaving(false);
                }}
            />
        </section>
    );
}