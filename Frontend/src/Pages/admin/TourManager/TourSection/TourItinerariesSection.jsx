import React, { useState, useCallback, useMemo } from "react";
import { Utensils, Camera, X, Trash2, Plus, Loader2, Pencil } from "lucide-react";
import TourItinerariesTable from "../TourItinerariesTable";
import InputField from "~/components/UI/Form/InputField";
import { toastSuccess, toastWarning } from "~/utils/Toast";
import ConfirmModal from "~/components/UI/Modal/ConfirmModal";
import SelectField from "~/components/UI/Form/SelectField";
import TimePicker from "~/components/UI/Form/TimePicker";

const getVal = (e) => e?.target?.value ?? e;

const makeTempId = () => `CTLT-TEMP-${Date.now()}-${Math.random()}`;

const getSubKey = (sub) => sub.maCTLT > 0 ? `DB-${sub.maCTLT}` : sub.tempId;

const timeToMinutes = (time) => {
    if (!time) return 0;
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
};

const MIN_TIME = timeToMinutes("05:00");
const MAX_TIME = timeToMinutes("23:00");

const hasTimeOverlap = (rows, newStart, newEnd) =>
    rows.some(row => {
        const start = timeToMinutes(row.gioBatDau);
        const end = timeToMinutes(row.gioKetThuc || row.gioBatDau);
        return newStart < end && newEnd > start;
    });


const makeSubRow = () => ({
    tempId: makeTempId(),
    maCTLT: 0,
    gioBatDau: "",
    gioKetThuc: null,
    maDiaDiem: "",
    hoatDong: ""
});

const makeDayRow = (nextDayNumber) => ({
    id: `LT-NEW-${Date.now()}`,
    soThuTuNgay: nextDayNumber,
    tenLichTrinh: `Hành trình Ngày ${nextDayNumber}`,
    buaAn: "",
    hoatDongChinh: "",
    luuY: "",
    trangThai: true,
    preview: null,
    file: null,
    chiTietLichTrinhs: []
});

const validateItinerary = (item) => {
    const errs = {};
    if (!item?.tenLichTrinh?.trim())
        errs.tenLichTrinh = "Vui lòng nhập tiêu đề ngày";
    if (!item?.chiTietLichTrinhs?.length)
        errs.chiTietLichTrinhs = "Vui lòng thêm ít nhất 1 mốc thời gian/hoạt động cho ngày này";
    return errs;
};


export default function TourItinerariesSection({
    value = [],
    onChange,
    diaDiems = [],
    isViewMode = false,
    loading = false,
    canAddDay
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

    const safeData = Array.isArray(value) ? value : [];

    const selectedLocationIds = useMemo(
        () => currentItinerary?.chiTietLichTrinhs?.map(item => String(item.maDiaDiem)).filter(Boolean) ?? [],
        [currentItinerary?.chiTietLichTrinhs]
    );

    const availableLocations = useMemo(
        () => diaDiems.filter(item => !selectedLocationIds.includes(String(item.maDiaDiem))),
        [diaDiems, selectedLocationIds]
    );

    const getAvailableLocationsForEdit = useCallback((currentLocationId) =>
        diaDiems.filter(item =>
            String(item.maDiaDiem) === String(currentLocationId) ||
            !selectedLocationIds.includes(String(item.maDiaDiem))
        ),
        [diaDiems, selectedLocationIds]
    );


    const openAddModal = () => {
        setCurrentItinerary(makeDayRow(safeData.length + 1));
        setNewSubRow(makeSubRow());
        setModalErrors({});
        setTimelineError("");
        setModalMode("ADD");
        setShowItineraryModal(true);
    };

    const handleEditClick = useCallback((row) => {
        setCurrentItinerary({
            ...row,
            file: null,
            preview: row.preview || null,
            chiTietLichTrinhs: (row.chiTietLichTrinhs || []).map(sub => ({
                tempId: sub.tempId || makeTempId(),
                maCTLT: Number(sub.maCTLT || 0),
                maLichTrinh: Number(sub.maLichTrinh || row.id || 0),
                gioBatDau: sub.gioBatDau || "",
                gioKetThuc: sub.gioKetThuc || null,
                maDiaDiem: sub.maDiaDiem || "",
                hoatDong: sub.hoatDong || ""
            }))
        });
        setNewSubRow(makeSubRow());
        setModalErrors({});
        setTimelineError("");
        setEditingSubKey(null);
        setEditingSubRow(null);
        setModalMode("EDIT");
        setShowItineraryModal(true);
    }, []);

    const handleCloseModal = () => {
        if (isSaving) return;
        setShowItineraryModal(false);
        setEditingSubKey(null);
        setEditingSubRow(null);
    };


    const handleModalImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCurrentItinerary(prev => ({ ...prev, file, preview: URL.createObjectURL(file) }));
    };

    const handleFieldChange = useCallback((field, val) => {
        setCurrentItinerary(prev => ({ ...prev, [field]: val }));
        setModalErrors(prev => prev[field] ? { ...prev, [field]: null } : prev);
    }, []);

    const handleFieldBlur = useCallback((field) => {
        if (!currentItinerary) return;
        const errs = validateItinerary(currentItinerary);
        if (errs[field]) setModalErrors(prev => ({ ...prev, [field]: errs[field] }));
    }, [currentItinerary]);


    const handleAddSubRow = () => {

        if (!newSubRow.gioBatDau) {
            setTimelineError("Vui lòng nhập giờ bắt đầu");
            toastWarning("Thiếu dữ liệu", "Mốc thời gian bắt đầu hành trình không được để trống.");
            return;
        }

        const newStart = timeToMinutes(newSubRow.gioBatDau);
        const newEnd = timeToMinutes(newSubRow.gioKetThuc || newSubRow.gioBatDau);

        if (newStart < MIN_TIME || newEnd > MAX_TIME) {
            setTimelineError("Thời gian phải nằm trong khoảng 05:00 - 23:00");
            return;
        }

        if (newSubRow.gioKetThuc && timeToMinutes(newSubRow.gioKetThuc) <= newStart) {
            setTimelineError("Giờ kết thúc phải lớn hơn giờ bắt đầu");
            return;
        }

        if (!newSubRow.maDiaDiem) {
            setTimelineError("Vui lòng chọn địa điểm");
            toastWarning("Thiếu dữ liệu", "Địa điểm tham quan không được để trống.");
            return;
        }

        if (!newSubRow.hoatDong?.trim()) {
            setTimelineError("Vui lòng nhập nội dung hoạt động cụ thể");
            return;
        }

        const existingRows = currentItinerary?.chiTietLichTrinhs || [];
        if (hasTimeOverlap(existingRows, newStart, newEnd)) {
            setTimelineError("Khoảng thời gian bị trùng với mốc khác");
            toastWarning("Trùng thời gian", "Khoảng thời gian này đang giao với một hoạt động khác.");
            return;
        }

        setCurrentItinerary(prev => ({
            ...prev,
            chiTietLichTrinhs: [
                ...(prev.chiTietLichTrinhs || []),
                { ...newSubRow, tempId: makeTempId(), maCTLT: 0 }
            ]
        }));
        setModalErrors(prev => prev.chiTietLichTrinhs ? { ...prev, chiTietLichTrinhs: null } : prev);
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
        if (!editingSubRow.gioBatDau) {
            toastWarning("Thiếu dữ liệu", "Vui lòng nhập giờ bắt đầu.");
            return;
        }
        if (editingSubRow.gioKetThuc && timeToMinutes(editingSubRow.gioKetThuc) <= timeToMinutes(editingSubRow.gioBatDau)) {
            toastWarning("Sai thời gian", "Giờ kết thúc phải lớn hơn giờ bắt đầu.");
            return;
        }
        if (!editingSubRow.maDiaDiem) {
            toastWarning("Thiếu dữ liệu", "Vui lòng chọn địa điểm.");
            return;
        }
        if (!editingSubRow.hoatDong?.trim()) {
            toastWarning("Thiếu dữ liệu", "Nội dung hoạt động không được để trống.");
            return;
        }

        const otherRows = currentItinerary.chiTietLichTrinhs.filter(
            item => getSubKey(item) !== editingSubKey
        );

        if (otherRows.some(item => String(item.maDiaDiem) === String(editingSubRow.maDiaDiem))) {
            toastWarning("Trùng địa điểm", "Địa điểm này đã được sử dụng trong ngày.");
            return;
        }

        const editStart = timeToMinutes(editingSubRow.gioBatDau);
        const editEnd = timeToMinutes(editingSubRow.gioKetThuc || editingSubRow.gioBatDau);

        if (hasTimeOverlap(otherRows, editStart, editEnd)) {
            toastWarning("Trùng thời gian", "Khoảng thời gian bị giao với mốc khác.");
            return;
        }

        setCurrentItinerary(prev => ({
            ...prev,
            chiTietLichTrinhs: prev.chiTietLichTrinhs.map(
                sub => getSubKey(sub) === editingSubKey ? editingSubRow : sub
            )
        }));
        setEditingSubKey(null);
        setEditingSubRow(null);
    };

    const handleRemoveSubRow = (targetKey) => {
        setCurrentItinerary(prev => ({
            ...prev,
            chiTietLichTrinhs: (prev.chiTietLichTrinhs || []).filter(sub => getSubKey(sub) !== targetKey)
        }));
    };


    const handleSaveItineraryModal = async () => {
        const errors = validateItinerary(currentItinerary);
        if (Object.keys(errors).length > 0) {
            setModalErrors(errors);
            toastWarning(
                "Dữ liệu chưa hợp lệ",
                errors.chiTietLichTrinhs
                    ? "Vui lòng cấu hình ít nhất 1 mốc thời gian cụ thể cho ngày này."
                    : "Vui lòng nhập tên/tiêu đề cho ngày hành trình."
            );
            return;
        }

        const sortedTimeline = [...currentItinerary.chiTietLichTrinhs]
            .sort((a, b) => timeToMinutes(a.gioBatDau) - timeToMinutes(b.gioBatDau));

        const itineraryToSave = { ...currentItinerary, chiTietLichTrinhs: sortedTimeline };
        const exists = safeData.some(lt => lt.id === currentItinerary.id);
        const updatedList = exists
            ? safeData.map(lt => lt.id === itineraryToSave.id ? itineraryToSave : lt)
            : [...safeData, itineraryToSave];

        try {
            setIsSaving(true);
            await onChange?.(updatedList);
            toastSuccess("Hoàn tất", `Đã lưu thành công dữ liệu lịch trình Ngày ${currentItinerary.soThuTuNgay}`);
            setShowItineraryModal(false);
        } catch {
            // Lỗi đã toast ở TourFormPage
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteClick = (row) => {
        setSelectedDeleteItem(row);
        setShowDeleteModal(true);
    };

    const confirmDeleteItinerary = async () => {
        if (!selectedDeleteItem) return;
        const updatedList = safeData.filter(lt => lt.id !== selectedDeleteItem.id);

        try {
            setIsSaving(true);
            await onChange?.(updatedList);
            toastSuccess("Thành công", `Đã xóa Ngày ${selectedDeleteItem.soThuTuNgay}`);
            setShowDeleteModal(false);
            setSelectedDeleteItem(null);
        } catch {
            // Lỗi đã toast ở TourFormPage
        } finally {
            setIsSaving(false);
        }
    };


    const disabled = isViewMode || isSaving;

    return (
        <section className="border-t border-slate-200 pt-8 space-y-4">

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                        Lịch trình chi tiết theo ngày
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Tổng số: {safeData.length} ngày hành trình</p>
                </div>
                {!isViewMode && (
                    <button
                        type="button"
                        disabled={isSaving || loading || !canAddDay}
                        onClick={openAddModal}
                        className={`flex items-center gap-1.5 px-4 py-2 text-white font-medium text-xs rounded-xl shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed
                            ${!canAddDay ? "bg-slate-300 cursor-not-allowed" : "bg-sky-400/80 hover:bg-sky-400/60"}`}
                    >
                        <Plus size={16} /> Thêm ngày {safeData.length + 1}
                    </button>
                )}
            </div>


            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <TourItinerariesTable
                    data={safeData}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    isViewMode={isViewMode}
                    loading={loading}
                />
            </div>


            {showItineraryModal && currentItinerary && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh]">

                        <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-800">
                                {isViewMode ? "Chi tiết Lịch trình" : modalMode === "ADD" ? "Thêm mới Lịch trình" : "Cấu hình Lịch trình"}
                                : Ngày {currentItinerary.soThuTuNgay}
                            </h2>
                            <button
                                disabled={isSaving}
                                onClick={handleCloseModal}
                                className="p-2 text-slate-400 hover:text-red-500 rounded-xl transition disabled:opacity-30"
                            >
                                <X size={20} />
                            </button>
                        </div>


                        <div className="p-6 space-y-6 overflow-y-auto flex-1">

                            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6 items-start bg-slate-50 p-4 rounded-xl">
                                <div className="w-full aspect-[4/3] md:w-36 md:h-28 rounded-xl border border-slate-200 bg-white relative overflow-hidden flex flex-col items-center justify-center text-slate-400 group mx-auto">
                                    {currentItinerary.preview ? (
                                        <>
                                            <img src={currentItinerary.preview} alt="Ảnh lịch trình" className="w-full h-full object-cover" />
                                            {!disabled && (
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer">
                                                    <Camera size={18} className="mb-1" />
                                                    <span className="text-[10px] font-medium">Thay đổi ảnh</span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <label className="cursor-pointer flex flex-col items-center justify-center text-center p-2 w-full h-full hover:bg-slate-50 transition">
                                            <Camera size={20} className="mb-1 text-slate-400" />
                                            <span className="text-slate-500 font-semibold text-[10px]">Ảnh ngày</span>
                                        </label>
                                    )}
                                    {!disabled && (
                                        <input type="file" accept="image/*" onChange={handleModalImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                    <InputField
                                        label="Tiêu đề ngày"
                                        value={currentItinerary.tenLichTrinh || ""}
                                        error={modalErrors.tenLichTrinh}
                                        onChange={(e) => handleFieldChange("tenLichTrinh", getVal(e))}
                                        onBlur={() => handleFieldBlur("tenLichTrinh")}
                                        disabled={disabled}
                                        required
                                    />
                                    <InputField
                                        label="Chế độ bữa ăn"
                                        icon={<Utensils size={16} />}
                                        value={currentItinerary.buaAn || ""}
                                        onChange={(e) => handleFieldChange("buaAn", getVal(e))}
                                        disabled={disabled}
                                    />
                                    <div className="sm:col-span-2">
                                        <InputField
                                            label="Tóm tắt hoạt động"
                                            value={currentItinerary.hoatDongChinh || ""}
                                            onChange={(e) => handleFieldChange("hoatDongChinh", getVal(e))}
                                            disabled={disabled}
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className={`border rounded-xl overflow-visible bg-white ${modalErrors.chiTietLichTrinhs ? "border-red-400" : "border-slate-200"}`}>

                                {!isViewMode && (
                                    <div className="p-4 bg-slate-50 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                                        <div className="sm:col-span-3">
                                            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Bắt đầu <span className="text-red-500">*</span></label>
                                            <TimePicker
                                                value={newSubRow.gioBatDau}
                                                disabled={isSaving}
                                                onChange={(timeStr) => setNewSubRow(p => ({
                                                    ...p,
                                                    gioBatDau: timeStr,
                                                    ...(!timeStr ? { gioKetThuc: null } : {})
                                                }))}
                                            />
                                        </div>
                                        <div className="sm:col-span-3">
                                            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Kết thúc</label>
                                            <TimePicker
                                                value={newSubRow.gioKetThuc}
                                                disabled={isSaving}
                                                onChange={(timeStr) => setNewSubRow(p => ({ ...p, gioKetThuc: timeStr }))}
                                            />
                                        </div>
                                        <div className="sm:col-span-4">
                                            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Địa điểm ghé thăm</label>
                                            <SelectField
                                                searchable
                                                searchText="Tìm kiếm địa điểm tham quan"
                                                value={newSubRow.maDiaDiem}
                                                options={availableLocations}
                                                valueKey="maDiaDiem"
                                                labelKey="tenDiaDiem"
                                                placeholder="Chọn địa điểm"
                                                onChange={(val) => setNewSubRow(prev => ({ ...prev, maDiaDiem: val }))}
                                                disabled={isSaving}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <button
                                                type="button"
                                                disabled={isSaving}
                                                onClick={handleAddSubRow}
                                                className="w-full py-[13px] text-center bg-sky-400 hover:bg-sky-700 disabled:bg-slate-400 transition text-white text-xs rounded-lg font-medium"
                                            >
                                                Thêm mốc
                                            </button>
                                        </div>
                                        <div className="sm:col-span-12 mt-2">
                                            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Nội dung hoạt động chi tiết <span className="text-red-500">*</span></label>
                                            <InputField
                                                multiline
                                                disabled={isSaving}
                                                placeholder="Nội dung hoạt động chi tiết cụ thể..."
                                                value={newSubRow.hoatDong}
                                                onChange={(e) => { setNewSubRow(p => ({ ...p, hoatDong: e.target.value })); setTimelineError(""); }}
                                            />
                                        </div>
                                        {timelineError && (
                                            <div className="sm:col-span-12 text-red-500 text-[11px] font-medium mt-1">
                                                * {timelineError}
                                            </div>
                                        )}
                                    </div>
                                )}


                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                                            <th className="p-3 w-32 ">Khoảng thời gian</th>
                                            <th className="p-3">Địa điểm</th>
                                            <th className="p-3">Hoạt động</th>
                                            {!isViewMode && <th className="p-3 text-center w-24">Thao tác</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {(currentItinerary.chiTietLichTrinhs || []).length === 0 ? (
                                            <tr>
                                                <td colSpan={isViewMode ? 3 : 4} className="p-4 text-center text-slate-400 italic">
                                                    Chưa có mốc chi tiết timeline nào.
                                                </td>
                                            </tr>
                                        ) : (
                                            currentItinerary.chiTietLichTrinhs.map((sub) => {
                                                const subKey = getSubKey(sub);
                                                const isEditing = editingSubKey === subKey;
                                                const loc = diaDiems.find(d => String(d.maDiaDiem) === String(sub.maDiaDiem));

                                                return (
                                                    <tr key={subKey} className="hover:bg-slate-50/50 transition">

                                                        <td className="p-3">
                                                            {isEditing ? (
                                                                <div className="flex flex-col gap-1 w-[120px]">
                                                                    <TimePicker
                                                                        value={editingSubRow.gioBatDau}
                                                                        onChange={(timeStr) => setEditingSubRow(p => ({ ...p, gioBatDau: timeStr }))}
                                                                    />
                                                                    <TimePicker
                                                                        value={editingSubRow.gioKetThuc}
                                                                        onChange={(timeStr) => setEditingSubRow(p => ({ ...p, gioKetThuc: timeStr }))}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <span>{sub.gioBatDau}{sub.gioKetThuc ? ` - ${sub.gioKetThuc}` : ""}</span>
                                                            )}
                                                        </td>

                                                        {/* Location cell */}
                                                        <td className="p-3 w-[250px]">
                                                            {isEditing ? (
                                                                <SelectField
                                                                    searchable
                                                                    searchText="Tìm kiếm địa điểm tham quan"
                                                                    value={editingSubRow.maDiaDiem}
                                                                    options={getAvailableLocationsForEdit(editingSubRow.maDiaDiem)}
                                                                    valueKey="maDiaDiem"
                                                                    labelKey="tenDiaDiem"
                                                                    placeholder="Chọn địa điểm"
                                                                    onChange={(val) => setEditingSubRow(p => ({ ...p, maDiaDiem: val }))}
                                                                />
                                                            ) : (
                                                                loc?.tenDiaDiem || "Không chọn"
                                                            )}
                                                        </td>

                                                        {/* Activity cell */}
                                                        <td className="p-3 w-[350px]">
                                                            {isEditing ? (
                                                                <InputField
                                                                    multiline
                                                                    rows={1}
                                                                    value={editingSubRow.hoatDong}
                                                                    onChange={(e) => setEditingSubRow(p => ({ ...p, hoatDong: e.target.value }))}
                                                                />
                                                            ) : (
                                                                sub.hoatDong
                                                            )}
                                                        </td>

                                                        {/* Actions cell */}
                                                        {!isViewMode && (
                                                            <td className="p-3 text-center">
                                                                <div className="flex justify-center gap-2">
                                                                    {isEditing ? (
                                                                        <>
                                                                            <button type="button" onClick={handleSaveSubRow} className="text-slate-500 hover:text-amber-400 text-xs font-semibold">Lưu</button>
                                                                            <button type="button" onClick={handleCancelEditSubRow} className="text-slate-500 hover:text-red-700 text-xs font-semibold">Hủy</button>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <button type="button" onClick={() => handleEditSubRow(sub)} className="text-sky-500 hover:text-sky-700"><Pencil size={14} /></button>
                                                                            <button type="button" onClick={() => handleRemoveSubRow(subKey)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        )}
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {modalErrors.chiTietLichTrinhs && (
                                <p className="text-red-600 text-xs -mt-4">{modalErrors.chiTietLichTrinhs}</p>
                            )}

                            <InputField
                                label="Lưu ý quan trọng"
                                multiline
                                rows={7}
                                value={currentItinerary.luuY || ""}
                                onChange={(e) => handleFieldChange("luuY", getVal(e))}
                                disabled={disabled}
                            />
                        </div>

                        {/* Modal footer */}
                        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                            <button
                                disabled={isSaving}
                                onClick={handleCloseModal}
                                className="px-5 py-2 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition disabled:opacity-50"
                            >
                                {isViewMode ? "Đóng" : "Hủy bỏ"}
                            </button>
                            {!isViewMode && (
                                <button
                                    disabled={isSaving}
                                    onClick={handleSaveItineraryModal}
                                    className="px-5 py-2 text-xs font-semibold bg-sky-500 hover:bg-sky-600 disabled:bg-sky-400 text-white rounded-xl shadow transition flex items-center gap-1.5 min-w-[120px] justify-center"
                                >
                                    {isSaving
                                        ? <><Loader2 size={14} className="animate-spin" />Đang lưu...</>
                                        : modalMode === "ADD" ? "Thêm vào lịch trình" : "Cập nhật lịch trình"
                                    }
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirm modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                title="Xóa lịch trình"
                message={selectedDeleteItem ? `Bạn có chắc muốn xóa Ngày ${selectedDeleteItem.soThuTuNgay}?` : ""}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
                onConfirm={confirmDeleteItinerary}
                onCancel={() => { setShowDeleteModal(false); setSelectedDeleteItem(null); }}
            />
        </section>
    );
}