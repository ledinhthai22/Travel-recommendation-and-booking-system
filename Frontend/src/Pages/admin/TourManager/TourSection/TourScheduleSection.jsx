import { Settings, X, Edit, Trash2, Loader2 } from "lucide-react";
import InputField from "~/components/UI/Form/InputField";
import SelectField from "~/components/UI/Form/SelectField";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { getAllVehicleApi } from "~/Services/VehicleService";
import { getAllTourGuideApi } from "~/Services/TourGuideService";
import { toastSuccess, toastError, toastWarning } from "~/utils/Toast";

const EMPTY_SCHEDULE = () => ({
    tempId: Date.now() + Math.random(),
    maChuyen: null,
    maHDV: "",
    maPhuongTien: "",
    maChuyenCode: "",
    diemKhoiHanh: "",
    diemDen: "",
    ngayKhoiHanh: "",
    gioDenNoiDi: "",
    ngayKetThuc: "",
    gioDenNoiVe: "",
    soLuongCho: "",
    ghiChu: "",
    gia: {
        hangKhachSan: "",
        giaNguoiLon: "",
        giaTreEm: "",
        giaEmBe: "",
        phuThuPhongDon: "",
    },
});

const getVal = (e) => e?.target?.value ?? e;

const isValidNonNegativeNumber = (val) => {
    if (val === "" || val === null || val === undefined) return false;
    const num = Number(val);
    return !Number.isNaN(num) && num >= 0;
};
const getLocationCode = (location) => {
    switch (location) {
        case "Hồ Chí Minh":
            return "HCM";
        case "Hà Nội":
            return "HN";
        case "Đà Nẵng":
            return "DN";
        default:
            return "XX";
    }
};

const getVehicleCode = (vehicleId, vehicles = []) => {
    const vehicle = vehicles.find(
        (v) => v.maPhuongTien === Number(vehicleId)
    );

    if (!vehicle) return "XX";

    switch (vehicle.tenPhuongTien) {
        case "Máy Bay":
            return "MB";
        case "Ô tô Du Lịch":
            return "OT";
        case "Tàu Hỏa":
            return "TH";
        case "Tàu Thủy":
            return "TT";
        case "Xe Máy Trekking":
            return "XM";
        default:
            return "XX";
    }
};

const TourScheduleSection = forwardRef(({ value = [], onChange, isViewMode = false, trongNuoc }, ref) => {
    const [vehicles, setVehicles] = useState([]);
    const [guides, setGuides] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [modalErrors, setModalErrors] = useState({});


    const [isSaving, setIsSaving] = useState(false);

    const safeData = Array.isArray(value) ? value : [];
    const getNextSequence = (data = []) => {
        return data.length + 1;
    };
    const getTourRegionCode = (trongNuoc) => {
        return trongNuoc ? "TN" : "NN";
    };
    const generateTripCode = (
        trongNuoc,
        diemKhoiHanh,
        maPhuongTien,
        ngayKhoiHanh,
        vehicles,
        safeData
    ) => {
        if (!diemKhoiHanh || !maPhuongTien || !ngayKhoiHanh)
            return "";

        const regionCode = trongNuoc ? "TN" : "NN";

        const locationCode = getLocationCode(diemKhoiHanh);

        const vehicleCode = getVehicleCode(
            maPhuongTien,
            vehicles
        );

        const date = new Date(ngayKhoiHanh);

        const dateCode =
            String(date.getDate()).padStart(2, "0") +
            String(date.getMonth() + 1).padStart(2, "0") +
            String(date.getFullYear()).slice(-2);

        const sequence = String(
            getNextSequence(safeData)
        ).padStart(3, "0");

        return `${regionCode}-${locationCode}-${vehicleCode}-${dateCode}-${sequence}`;
    };
    const validateSingleDeparture = (item) => {
        const errs = {};

        if (!item.maChuyenCode?.trim()) errs.maChuyenCode = "Vui lòng nhập mã chuyến";
        if (!item.maHDV) errs.maHDV = "Vui lòng chọn hướng dẫn viên";
        if (!item.maPhuongTien) errs.maPhuongTien = "Vui lòng chọn phương tiện";
        if (!item.diemKhoiHanh?.trim()) errs.diemKhoiHanh = "Vui lòng nhập điểm khởi hành";
        if (!item.diemDen?.trim()) errs.diemDen = "Vui lòng nhập điểm đến";

        if (
            item.diemKhoiHanh?.trim() &&
            item.diemDen?.trim() &&
            item.diemKhoiHanh.trim().toLowerCase() === item.diemDen.trim().toLowerCase()
        ) {
            errs.diemDen = "Điểm đến không được trùng với điểm khởi hành";
        }

        if (!item.soLuongCho || !isValidNonNegativeNumber(item.soLuongCho) || Number(item.soLuongCho) <= 0) {
            errs.soLuongCho = "Số lượng chỗ phải là số lớn hơn 0";
        }

        if (!item.ngayKhoiHanh) errs.ngayKhoiHanh = "Vui lòng nhập ngày khởi hành";
        if (!item.gioDenNoiDi) errs.gioDenNoiDi = "Vui lòng nhập giờ đến nơi đi";
        if (!item.ngayKetThuc) errs.ngayKetThuc = "Vui lòng nhập ngày kết thúc";
        if (!item.gioDenNoiVe) errs.gioDenNoiVe = "Vui lòng nhập giờ đến nơi về";

        if (item.ngayKhoiHanh && item.ngayKetThuc) {
            const start = new Date(item.ngayKhoiHanh);
            const end = new Date(item.ngayKetThuc);
            if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end < start) {
                errs.ngayKetThuc = "Ngày kết thúc phải sau ngày khởi hành";
            }
        }
        if (item.gioDenNoiDi && item.ngayKhoiHanh) {
            const start = new Date(item.ngayKhoiHanh);
            const arrive = new Date(item.gioDenNoiDi);
            if (!Number.isNaN(start.getTime()) && !Number.isNaN(arrive.getTime()) && arrive < start) {
                errs.gioDenNoiDi = "Giờ đến nơi đi phải sau ngày khởi hành";
            }
        }
        if (item.gioDenNoiVe && item.ngayKetThuc) {
            const end = new Date(item.ngayKetThuc);
            const arriveBack = new Date(item.gioDenNoiVe);
            if (!Number.isNaN(end.getTime()) && !Number.isNaN(arriveBack.getTime()) && arriveBack < end) {
                errs.gioDenNoiVe = "Giờ đến nơi về phải sau ngày kết thúc";
            }
        }

        if (!item.gia?.hangKhachSan?.toString().trim()) errs.hangKhachSan = "Vui lòng nhập hạng khách sạn";

        if (!isValidNonNegativeNumber(item.gia?.giaNguoiLon)) errs.giaNguoiLon = "Giá người lớn không hợp lệ";
        if (!isValidNonNegativeNumber(item.gia?.giaTreEm)) errs.giaTreEm = "Giá trẻ em không hợp lệ";
        if (!isValidNonNegativeNumber(item.gia?.giaEmBe)) errs.giaEmBe = "Giá em bé không hợp lệ";

        if (
            item.gia?.phuThuPhongDon !== "" &&
            item.gia?.phuThuPhongDon !== undefined &&
            item.gia?.phuThuPhongDon !== null &&
            !isValidNonNegativeNumber(item.gia?.phuThuPhongDon)
        ) {
            errs.phuThuPhongDon = "Phụ thu phòng đơn không hợp lệ";
        }

        return errs;
    };

    useImperativeHandle(ref, () => ({
        openModal: () => {
            setCurrentSchedule(EMPTY_SCHEDULE());
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
                const itemErrors = validateSingleDeparture(item);
                if (Object.keys(itemErrors).length > 0) {
                    toastWarning(
                        "Thiếu thông tin",
                        `Chuyến ${item.maChuyenCode || ""} chưa nhập đầy đủ hoặc dữ liệu không hợp lệ.`
                    );
                    setCurrentSchedule(JSON.parse(JSON.stringify(item)));
                    setIsEditMode(true);
                    setModalErrors(itemErrors);
                    setIsSaving(false);
                    setShowModal(true);
                    return false;
                }
            }
            return true;
        }
    }));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vehicleRes, guideRes] = await Promise.all([
                    getAllVehicleApi(),
                    getAllTourGuideApi(),
                ]);
                setVehicles(Array.isArray(vehicleRes) ? vehicleRes : []);
                setGuides(
                    (guideRes.data || guideRes || []).map(({ maNhanVien, hoTen }) => ({
                        maHDV: maNhanVien,
                        tenHDV: hoTen,
                    }))
                );
            } catch (err) {
                console.error("Fetch vehicle/guide error:", err);
                toastError("Tải dữ liệu thất bại", "Không thể tải danh sách phương tiện hoặc hướng dẫn viên.");
            }
        };
        fetchData();
    }, []);

    const handleFieldChange = (field, val) => {
        setCurrentSchedule((prev) => {
            const updated = {
                ...prev,
                [field]: val,
            };

            updated.maChuyenCode = generateTripCode(
                trongNuoc,
                updated.diemKhoiHanh,
                updated.maPhuongTien,
                updated.ngayKhoiHanh,
                vehicles,
                safeData
            );

            return updated;
        });

        if (modalErrors[field]) {
            setModalErrors((prev) => ({
                ...prev,
                [field]: null,
            }));
        }
    };

    const handleGiaChange = (field, val) => {
        setCurrentSchedule(prev => ({ ...prev, gia: { ...prev.gia, [field]: val } }));
        if (modalErrors[field]) setModalErrors(prev => ({ ...prev, [field]: null }));
    };

    const handleFieldBlur = (field) => {
        if (!currentSchedule) return;
        const itemErrors = validateSingleDeparture(currentSchedule);
        if (itemErrors[field]) {
            setModalErrors(prev => ({ ...prev, [field]: itemErrors[field] }));
        }
    };

    const handleSave = async () => {
        if (!currentSchedule || isSaving) return;

        const errors = validateSingleDeparture(currentSchedule);
        if (Object.keys(errors).length > 0) {
            setModalErrors(errors);
            toastWarning("Dữ liệu chưa hợp lệ", "Vui lòng kiểm tra lại các trường được đánh dấu đỏ.");
            return;
        }

        const exists = safeData.some(ch => ch.tempId === currentSchedule.tempId);
        const updatedList = exists
            ? safeData.map(ch => ch.tempId === currentSchedule.tempId ? currentSchedule : ch)
            : [...safeData, currentSchedule];

        try {
            setIsSaving(true);
            await onChange?.(updatedList);

            toastSuccess(
                "Thành công",
                exists ? "Cập nhật chuyến khởi hành thành công." : "Thêm chuyến khởi hành thành công."
            );

            setShowModal(false);
        } catch {
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!currentSchedule || isSaving) return;

        const label = currentSchedule.maChuyenCode
            ? `chuyến "${currentSchedule.maChuyenCode}"`
            : "chuyến khởi hành này";

        const updatedList = safeData.filter(ch => ch.tempId !== currentSchedule.tempId);

        try {
            setIsSaving(true);
            await onChange?.(updatedList);

            toastSuccess("Đã xóa", `Xóa ${label} thành công.`);
            setShowModal(false);
            setCurrentSchedule(null);
            setModalErrors({});
        } catch {
            // Lỗi đã toast ở TourFormPage
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        if (isSaving) return;
        setShowModal(false);
        setCurrentSchedule(null);
        setModalErrors({});
    };

    if (!showModal || !currentSchedule) return null;

    const isView = isViewMode;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh]">
                <div className="flex justify-between items-center p-5 border-b border-slate-200">
                    <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        {isEditMode
                            ? <><Edit size={18} className="text-sky-500" /> {isView ? "Chi tiết chuyến khởi hành" : "Cập nhật chuyến khởi hành"}</>
                            : <><Settings size={18} className="text-slate-500" /> Thêm chuyến khởi hành mới</>
                        }
                    </h2>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                HƯỚNG DẪN VIÊN <span className="text-red-500">*</span>
                            </label>
                            <SelectField value={currentSchedule.maHDV || ""} options={guides} valueKey="maHDV" labelKey="tenHDV" error={modalErrors.maHDV} onChange={(e) => handleFieldChange("maHDV", getVal(e))} disabled={isView || isSaving} />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                PHƯƠNG TIỆN <span className="text-red-500">*</span>
                            </label>
                            <SelectField value={currentSchedule.maPhuongTien || ""} options={vehicles} valueKey="maPhuongTien" labelKey="tenPhuongTien" error={modalErrors.maPhuongTien} onChange={(e) => handleFieldChange("maPhuongTien", getVal(e))} disabled={isView || isSaving} />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                ĐIỂM ĐI <span className="text-red-500">*</span>
                            </label>

                            <SelectField
                                value={currentSchedule.diemKhoiHanh || ""}
                                options={[
                                    { value: "Hồ Chí Minh", label: "Hồ Chí Minh" },
                                    { value: "Đà Nẵng", label: "Đà Nẵng" },
                                    { value: "Hà Nội", label: "Hà Nội" }
                                ]}
                                valueKey="value"
                                labelKey="label"
                                error={modalErrors.diemKhoiHanh}
                                onChange={(e) =>
                                    handleFieldChange("diemKhoiHanh", getVal(e))
                                }
                                disabled={isView || isSaving}
                            />
                        </div>
                        <InputField type="number" label="SỐ LƯỢNG CHỖ" value={currentSchedule.soLuongCho || ""} error={modalErrors.soLuongCho} onChange={(e) => handleFieldChange("soLuongCho", getVal(e))} onBlur={() => handleFieldBlur("soLuongCho")} disabled={isView || isSaving} required />


                    </div>
                    <InputField label="ĐIỂM ĐẾN" value={currentSchedule.diemDen || ""} error={modalErrors.diemDen} onChange={(e) => handleFieldChange("diemDen", getVal(e))} onBlur={() => handleFieldBlur("diemDen")} disabled={isView || isSaving} required />
                    <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-200 pb-1">
                            CHI TIẾT MỐC THỜI GIAN LỊCH TRÌNH
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <InputField type="datetime-local" label="NGÀY KHỞI HÀNH" value={currentSchedule.ngayKhoiHanh || ""} error={modalErrors.ngayKhoiHanh} onChange={(e) => handleFieldChange("ngayKhoiHanh", getVal(e))} onBlur={() => handleFieldBlur("ngayKhoiHanh")} disabled={isView || isSaving} required />
                            <InputField type="datetime-local" label="GIỜ ĐẾN NƠI ĐI" value={currentSchedule.gioDenNoiDi || ""} error={modalErrors.gioDenNoiDi} onChange={(e) => handleFieldChange("gioDenNoiDi", getVal(e))} onBlur={() => handleFieldBlur("gioDenNoiDi")} disabled={isView || isSaving} required />
                            <InputField type="datetime-local" label="NGÀY KẾT THÚC" value={currentSchedule.ngayKetThuc || ""} error={modalErrors.ngayKetThuc} onChange={(e) => handleFieldChange("ngayKetThuc", getVal(e))} onBlur={() => handleFieldBlur("ngayKetThuc")} disabled={isView || isSaving} required />
                            <InputField type="datetime-local" label="GIỜ ĐẾN NƠI VỀ" value={currentSchedule.gioDenNoiVe || ""} error={modalErrors.gioDenNoiVe} onChange={(e) => handleFieldChange("gioDenNoiVe", getVal(e))} onBlur={() => handleFieldBlur("gioDenNoiVe")} disabled={isView || isSaving} required />
                        </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-200 pb-1">
                            ĐƠN GIÁ PHÂN LOẠI KHÁCH HÀNG (VND)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                            <InputField label="HẠNG KHÁCH SẠN" value={currentSchedule.gia?.hangKhachSan || ""} error={modalErrors.hangKhachSan} onChange={(e) => handleGiaChange("hangKhachSan", getVal(e))} onBlur={() => handleFieldBlur("hangKhachSan")} disabled={isView || isSaving} required />
                            <InputField type="number" label="GIÁ NGƯỜI LỚN" value={currentSchedule.gia?.giaNguoiLon || ""} error={modalErrors.giaNguoiLon} onChange={(e) => handleGiaChange("giaNguoiLon", getVal(e))} onBlur={() => handleFieldBlur("giaNguoiLon")} disabled={isView || isSaving} required />
                            <InputField type="number" label="GIÁ TRẺ EM" value={currentSchedule.gia?.giaTreEm || ""} error={modalErrors.giaTreEm} onChange={(e) => handleGiaChange("giaTreEm", getVal(e))} onBlur={() => handleFieldBlur("giaTreEm")} disabled={isView || isSaving} required />
                            <InputField type="number" label="GIÁ EM BÉ" value={currentSchedule.gia?.giaEmBe || ""} error={modalErrors.giaEmBe} onChange={(e) => handleGiaChange("giaEmBe", getVal(e))} onBlur={() => handleFieldBlur("giaEmBe")} disabled={isView || isSaving} required />
                            <InputField type="number" label="PHỤ THU PHÒNG ĐƠN" value={currentSchedule.gia?.phuThuPhongDon || ""} error={modalErrors.phuThuPhongDon} onChange={(e) => handleGiaChange("phuThuPhongDon", getVal(e))} onBlur={() => handleFieldBlur("phuThuPhongDon")} disabled={isView || isSaving} />
                        </div>
                    </div>
                    <InputField
                        multiline
                        rows={3}
                        label="GHI CHÚ CHUYẾN ĐI"
                        value={currentSchedule.ghiChu || ""}
                        onChange={(e) => handleFieldChange("ghiChu", getVal(e))}
                        disabled={isView || isSaving}
                    />
                </div>

                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center gap-2">
                    <div>
                        {!isView && isEditMode && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isSaving}
                                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition disabled:opacity-40"
                            >
                                {isSaving
                                    ? <Loader2 size={13} className="animate-spin" />
                                    : <Trash2 size={14} />
                                }
                                Xóa chuyến này
                            </button>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 items-center">
                        {isSaving && (
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                                <Loader2 size={12} className="animate-spin" /> Đang lưu...
                            </span>
                        )}

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSaving}
                            className="px-4 py-2 text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition disabled:opacity-40"
                        >
                            {isView ? "Đóng" : "Hủy bỏ"}
                        </button>

                        {!isView && (
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow transition disabled:opacity-60 flex items-center gap-1.5"
                            >
                                {isSaving && <Loader2 size={13} className="animate-spin" />}
                                {isEditMode ? "Cập nhật" : "Xác nhận thêm"}
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
});

export default TourScheduleSection;