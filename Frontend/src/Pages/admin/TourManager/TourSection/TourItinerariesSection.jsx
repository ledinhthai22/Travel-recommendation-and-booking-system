import React, { useState, useCallback } from "react";
import {
    Utensils,
    Camera,
    X,
    Trash2,
    Plus,
    Loader2,
    Pencil
} from "lucide-react";
import TourItinerariesTable from "../TourItinerariesTable";
import InputField from "~/components/UI/Form/InputField";
import { toastSuccess, toastWarning } from "~/utils/Toast";
import ConfirmModal from "~/components/UI/Modal/ConfirmModal";
import SelectField from "~/components/UI/Form/SelectField";

const getVal = (e) => e?.target?.value ?? e;
const makeTempId = () => `CTLT-TEMP-${Date.now()}-${Math.random()}`;

const INITIAL_SUB_ROW = () => ({
    tempId: makeTempId(),
    maCTLT: 0,
    gioBatDau: "",
    gioKetThuc: "",
    maDiaDiem: "",
    hoatDong: ""
});

const INITIAL_DAY_ROW = (nextDayNumber) => ({
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

const getSubKey = (sub) => sub.maCTLT > 0 ? `DB-${sub.maCTLT}` : sub.tempId;

export default function TourItinerariesSection({
    maTour,
    value = [],
    onChange,
    diaDiems = [],
    isViewMode = false,
    loading = false,
    canAddDay
}) {
    const [showItineraryModal, setShowItineraryModal] = useState(false);
    const [currentItinerary, setCurrentItinerary] = useState(null);
    const [newSubRow, setNewSubRow] = useState(INITIAL_SUB_ROW());
    const [modalMode, setModalMode] = useState("EDIT");
    const [modalErrors, setModalErrors] = useState({});
    const [timelineError, setTimelineError] = useState("");


    const [isSaving, setIsSaving] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);

    const safeData = Array.isArray(value) ? value : [];
    const [editingSubKey, setEditingSubKey] = useState(null);
    const [editingSubRow, setEditingSubRow] = useState(null);
    const validateItinerary = (item) => {
        const errs = {};
        if (!item?.tenLichTrinh?.trim()) {
            errs.tenLichTrinh = "Vui lòng nhập tiêu đề ngày";
        }
        if (!item?.chiTietLichTrinhs || item.chiTietLichTrinhs.length === 0) {
            errs.chiTietLichTrinhs = "Vui lòng thêm ít nhất 1 mốc thời gian/hoạt động cho ngày này";
        }
        return errs;
    };

    const handleAddNewDayClick = () => {
        const nextDayNumber = safeData.length + 1;
        setCurrentItinerary(INITIAL_DAY_ROW(nextDayNumber));
        setNewSubRow(INITIAL_SUB_ROW());
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
                gioKetThuc: sub.gioKetThuc || "",
                maDiaDiem: sub.maDiaDiem || "",
                hoatDong: sub.hoatDong || ""
            }))
        });
        setNewSubRow(INITIAL_SUB_ROW());
        setModalErrors({});
        setTimelineError("");
        setModalMode("EDIT");
        setShowItineraryModal(true);
    }, []);

    const handleModalImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setCurrentItinerary(prev => ({
            ...prev,
            file,
            preview: previewUrl
        }));
    };

    const handleFieldChange = (field, val) => {
        setCurrentItinerary(prev => ({ ...prev, [field]: val }));
        if (modalErrors[field]) {
            setModalErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleFieldBlur = (field) => {
        if (!currentItinerary) return;
        const itemErrors = validateItinerary(currentItinerary);
        if (itemErrors[field]) {
            setModalErrors(prev => ({ ...prev, [field]: itemErrors[field] }));
        }
    };

    const handleAddSubRow = () => {
        if (!newSubRow.gioBatDau) {
            setTimelineError("Vui lòng nhập giờ bắt đầu");
            toastWarning("Thiếu dữ liệu", "Mốc thời gian bắt đầu hành trình không được để trống.");
            return;
        }
        if (newSubRow.gioKetThuc && newSubRow.gioKetThuc < newSubRow.gioBatDau) {
            setTimelineError("Giờ kết thúc phải sau giờ bắt đầu");
            toastWarning("Sai logic", "Giờ kết thúc không thể xảy ra trước giờ bắt đầu.");
            return;
        }
        if (!newSubRow.hoatDong?.trim()) {
            setTimelineError("Vui lòng nhập nội dung hoạt động cụ thể");
            toastWarning("Thiếu dữ liệu", "Vui lòng mô tả hoạt động chi tiết tại mốc thời gian này.");
            return;
        }

        setCurrentItinerary(prev => ({
            ...prev,
            chiTietLichTrinhs: [
                ...(prev.chiTietLichTrinhs || []),
                { ...newSubRow, tempId: makeTempId(), maCTLT: 0 }
            ]
        }));

        if (modalErrors.chiTietLichTrinhs) {
            setModalErrors(prev => ({ ...prev, chiTietLichTrinhs: null }));
        }

        setNewSubRow(INITIAL_SUB_ROW());
        setTimelineError("");
    };

    const handleRemoveSubRow = (targetKey) => {
        setCurrentItinerary(prev => ({
            ...prev,
            chiTietLichTrinhs: (prev.chiTietLichTrinhs || []).filter(
                sub => getSubKey(sub) !== targetKey
            )
        }));
    };

    const handleEditSubRow = (sub) => {
        setEditingSubKey(getSubKey(sub));
        setEditingSubRow({ ...sub });
    };
    const handleSaveSubRow = () => {
        setCurrentItinerary(prev => ({
            ...prev,
            chiTietLichTrinhs: prev.chiTietLichTrinhs.map(sub =>
                getSubKey(sub) === editingSubKey
                    ? editingSubRow
                    : sub
            )
        }));

        setEditingSubKey(null);
        setEditingSubRow(null);
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

        const exists = safeData.some(lt => lt.id === currentItinerary.id);
        const updatedList = exists
            ? safeData.map(lt => lt.id === currentItinerary.id ? currentItinerary : lt)
            : [...safeData, currentItinerary];

        try {
            setIsSaving(true);
            await onChange?.(updatedList);

            toastSuccess(
                "Hoàn tất",
                `Đã lưu thành công dữ liệu lịch trình Ngày ${currentItinerary.soThuTuNgay}`
            );

            setShowItineraryModal(false);
        } catch {
            // Lỗi đã được toast ở TourFormPage, ở đây chỉ reset saving để user retry
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

        } finally {
            setIsSaving(false);
        }
    };
    console.log(diaDiems)
    console.log(editingSubRow)
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
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={isSaving || loading || !canAddDay}
                            onClick={handleAddNewDayClick}
                            className={`${!canAddDay
                                ? "bg-slate-300 cursor-not-allowed"
                                : "bg-sky-400/80 hover:bg-sky-400/60 text-white"}
                             flex items-center gap-1.5 px-4 py-2  text-white font-medium text-xs rounded-xl shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <Plus size={16} /> Thêm ngày {safeData.length + 1}
                        </button>
                    </div>
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
                    <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh]">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-800">
                                {isViewMode
                                    ? "Chi tiết Lịch trình"
                                    : modalMode === "ADD"
                                        ? "Thêm mới Lịch trình"
                                        : "Cấu hình Lịch trình"
                                }: Ngày {currentItinerary.soThuTuNgay}
                            </h2>
                            <button
                                disabled={isSaving}
                                onClick={() => setShowItineraryModal(false)}
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
                                            <img
                                                src={currentItinerary.preview}
                                                alt="Ảnh lịch trình"
                                                className="w-full h-full object-cover"
                                            />
                                            {!isViewMode && !isSaving && (
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

                                    {!isViewMode && !isSaving && (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleModalImageChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                    <InputField
                                        label="Tiêu đề ngày"
                                        value={currentItinerary.tenLichTrinh || ""}
                                        error={modalErrors.tenLichTrinh}
                                        onChange={(e) => handleFieldChange("tenLichTrinh", getVal(e))}
                                        onBlur={() => handleFieldBlur("tenLichTrinh")}
                                        disabled={isViewMode || isSaving}
                                        required
                                    />
                                    <InputField
                                        label="Chế độ bữa ăn"
                                        icon={<Utensils size={16} />}
                                        value={currentItinerary.buaAn || ""}
                                        onChange={(e) => handleFieldChange("buaAn", getVal(e))}
                                        disabled={isViewMode || isSaving}
                                    />
                                    <div className="sm:col-span-2">
                                        <InputField
                                            label="Tóm tắt hoạt động"
                                            value={currentItinerary.hoatDongChinh || ""}
                                            onChange={(e) => handleFieldChange("hoatDongChinh", getVal(e))}
                                            disabled={isViewMode || isSaving}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={`border rounded-xl overflow-visible bg-white ${modalErrors.chiTietLichTrinhs ? "border-red-400" : "border-slate-200"}`}>
                                {!isViewMode && (
                                    <div className="p-4 bg-slate-50 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                                        <div className="sm:col-span-3">
                                            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Bắt đầu <span className="text-red-500">*</span></label>
                                            <InputField type="time" disabled={isSaving} value={newSubRow.gioBatDau} onChange={(e) => { setNewSubRow(p => ({ ...p, gioBatDau: e.target.value })); setTimelineError(""); }} />
                                        </div>
                                        <div className="sm:col-span-3">
                                            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Kết thúc</label>
                                            <InputField type="time" disabled={isSaving} value={newSubRow.gioKetThuc} onChange={(e) => { setNewSubRow(p => ({ ...p, gioKetThuc: e.target.value })); setTimelineError(""); }} />
                                        </div>
                                        <div className="sm:col-span-4">
                                            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Địa điểm ghé thăm</label>
                                            <SelectField
                                                value={newSubRow.maDiaDiem}
                                                options={diaDiems}
                                                valueKey="maDiaDiem"
                                                labelKey="tenDiaDiem"
                                                placeholder="Chọn địa điểm"
                                                onChange={(value) =>
                                                    setNewSubRow(prev => ({
                                                        ...prev,
                                                        maDiaDiem: value
                                                    }))
                                                }
                                                disabled={isSaving}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <button type="button" disabled={isSaving} onClick={handleAddSubRow} className="w-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-400 transition text-white text-xs h-9 rounded-lg font-medium">Thêm mốc</button>
                                        </div>
                                        <div className="sm:col-span-12 mt-2">
                                            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Nội dung hoạt động chi tiết <span className="text-red-500">*</span></label>
                                            <InputField multiline type="text" disabled={isSaving} placeholder="Nội dung hoạt động chi tiết cụ thể..." value={newSubRow.hoatDong} onChange={(e) => { setNewSubRow(p => ({ ...p, hoatDong: e.target.value })); setTimelineError(""); }} className="w-full text-xs border border-slate-300 rounded-lg p-2 h-9 disabled:bg-slate-100" />
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
                                            <th className="p-3 w-32">Khoảng thời gian</th>
                                            <th className="p-3 w-44">Địa điểm</th>
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
                                                const loc = diaDiems.find(d => String(d.maDiaDiem) === String(sub.maDiaDiem));
                                                const subKey = getSubKey(sub);

                                                return (
                                                    <tr key={subKey} className="hover:bg-slate-50/50 transition">
                                                        <td className="p-3">
                                                            {editingSubKey === subKey ? (
                                                                <div className="flex gap-1">
                                                                    <InputField
                                                                        type="time"
                                                                        value={editingSubRow.gioBatDau}
                                                                        onChange={(e) =>
                                                                            setEditingSubRow(prev => ({
                                                                                ...prev,
                                                                                gioBatDau: e.target.value
                                                                            }))
                                                                        }
                                                                    />

                                                                    <InputField
                                                                        type="time"
                                                                        value={editingSubRow.gioKetThuc}
                                                                        onChange={(e) =>
                                                                            setEditingSubRow(p => ({
                                                                                ...p,
                                                                                gioKetThuc: e.target.value
                                                                            }))
                                                                        }
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    {sub.gioBatDau}
                                                                    {sub.gioKetThuc ? ` - ${sub.gioKetThuc}` : ""}
                                                                </>
                                                            )}
                                                        </td>
                                                        <td className="p-3">
                                                            {editingSubKey === subKey ? (
                                                                <div>
                                                                    <SelectField
                                                                        label=""
                                                                        value={editingSubRow.maDiaDiem}
                                                                        options={diaDiems}
                                                                        valueKey="maDiaDiem"
                                                                        labelKey="tenDiaDiem"
                                                                        placeholder="Chọn địa điểm"
                                                                        onChange={(value) =>
                                                                            setEditingSubRow(prev => ({
                                                                                ...prev,
                                                                                maDiaDiem: value
                                                                            }))
                                                                        }
                                                                    />
                                                                </div>

                                                            ) : (
                                                                loc?.tenDiaDiem || "Không chọn"
                                                            )}
                                                        </td>
                                                        <td className="p-3">
                                                            {editingSubKey === subKey ? (
                                                                <InputField
                                                                    type="text"
                                                                    value={editingSubRow.hoatDong}
                                                                    onChange={(e) =>
                                                                        setEditingSubRow(p => ({
                                                                            ...p,
                                                                            hoatDong: e.target.value
                                                                        }))
                                                                    }
                                                                    className="border rounded px-2 py-1 text-xs w-full"
                                                                />
                                                            ) : (
                                                                sub.hoatDong
                                                            )}
                                                        </td>
                                                        {!isViewMode && (
                                                            <td className="p-3 text-center">
                                                                <div className="flex justify-center gap-2">
                                                                    {editingSubKey === subKey ? (
                                                                        <>
                                                                            <button
                                                                                type="button"
                                                                                onClick={handleSaveSubRow}
                                                                                className="text-emerald-500 hover:text-emerald-700 text-xs font-semibold"
                                                                            >
                                                                                Lưu
                                                                            </button>

                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    setEditingSubKey(null);
                                                                                    setEditingSubRow(null);
                                                                                }}
                                                                                className="text-slate-500 hover:text-slate-700 text-xs font-semibold"
                                                                            >
                                                                                Hủy
                                                                            </button>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleEditSubRow(sub)}
                                                                                className="text-sky-500 hover:text-sky-700"
                                                                            >
                                                                                <Pencil size={14} />
                                                                            </button>

                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleRemoveSubRow(subKey)}
                                                                                className="text-red-400 hover:text-red-600"
                                                                            >
                                                                                <Trash2 size={14} />
                                                                            </button>
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
                                rows={2}
                                value={currentItinerary.luuY || ""}
                                onChange={(e) => handleFieldChange("luuY", getVal(e))}
                                disabled={isViewMode || isSaving}
                            />
                        </div>

                        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                            <button disabled={isSaving} onClick={() => setShowItineraryModal(false)} className="px-5 py-2 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition disabled:opacity-50">
                                {isViewMode ? "Đóng" : "Hủy bỏ"}
                            </button>
                            {!isViewMode && (
                                <button
                                    disabled={isSaving}
                                    onClick={handleSaveItineraryModal}
                                    className="px-5 py-2 text-xs font-semibold bg-sky-500 hover:bg-sky-600 disabled:bg-sky-400 text-white rounded-xl shadow transition flex items-center gap-1.5 min-w-[120px] justify-center"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Đang lưu...
                                        </>
                                    ) : (
                                        modalMode === "ADD" ? "Thêm vào lịch trình" : "Cập nhật lịch trình"
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <ConfirmModal
                isOpen={showDeleteModal}
                title="Xóa lịch trình"
                message={
                    selectedDeleteItem
                        ? `Bạn có chắc muốn xóa Ngày ${selectedDeleteItem.soThuTuNgay}?`
                        : ""
                }
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
                onConfirm={confirmDeleteItinerary}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setSelectedDeleteItem(null);
                }}
            />
        </section>
    );
}