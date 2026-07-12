import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera, Loader2, CheckCircle2, Plus } from "lucide-react";

import TourItinerariesSection from "./TourSection/TourItinerariesSection";
import InputField from "~/components/UI/Form/InputField";
import SelectField from "~/components/UI/Form/SelectField";
import TourSchedulesTable from "./TourSchedulesTable";
import TourScheduleSection from "./TourSection/TourScheduleSection";

import { getAllTypeTourApi } from "~/Services/TypeTourService";
import { getHotelListApi } from "~/Services/HotelService";
import { getLocatioListApi } from "~/Services/LocationService";
import { toastSuccess, toastError, toastWarning } from "~/utils/Toast";

import {
    createFullTourApi,
    updateFullTourApi,
    getTourDetailApi,
    deleteTourImageApi,
    setMainTourImageApi
} from "~/Services/TourService";

import {
    createScheduleApi,
    updateScheduleApi,
    deleteScheduleApi
} from "~/Services/ScheduleService";

import {
    createDepartureApi,
    updateDepartureApi,
    deleteDepartureApi
} from "~/Services/DepartureService";

const API_BASE = "https://localhost:7016";

const DEFAULT_FORM_DATA = {
    tenTour: "",
    maLoaiTour: "",
    maKhachSan: "",
    moTa: "",
    ngay: "",
    dem: "",
    trongNuoc: true,
    trangThai: 1,
    diemKhoiHanh: ""
};

const getVal = (e) => e?.target?.value ?? e;

const getErrorMessage = (err, fallback = "Có lỗi xảy ra trong quá trình gọi API!") => {
    const data = err?.response?.data;
    if (!data) return err?.message || fallback;
    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (data.title || data.errors) {
        const detail = data.errors
            ? Object.values(data.errors).flat().join(" | ")
            : "";
        return detail ? `${data.title}: ${detail}` : (data.title || fallback);
    }
    return fallback;
};

const toNumber = (value, fallback = 0) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
};

const isExistingId = (value) => {
    const n = Number(value);
    return Number.isInteger(n) && n > 0;
};

const normalizeImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${API_BASE}${path}`;
};

const mapScheduleDetailFromApi = (ct, maLichTrinh) => ({
    maCTLT: toNumber(ct.maCTLT),
    maLichTrinh: toNumber(ct.maLichTrinh || maLichTrinh),
    maDiaDiem: ct.maDiaDiem || "",
    gioBatDau: ct.gioBatDau || "",
    gioKetThuc: ct.gioKetThuc || null,
    hoatDong: ct.hoatDong || "",
    loaiHoatDong: ct.loaiHoatDong || null
});

const mapScheduleFromApi = (lt) => ({
    id: toNumber(lt.maLichTrinh),
    soThuTuNgay: toNumber(lt.soThuTuNgay),
    tenLichTrinh: lt.tenLichTrinh || "",
    buaAn: lt.buaAn || "",
    hoatDongChinh: lt.hoatDongChinh || "",
    maKhachSan: lt.maKhachSan?.toString() || "",
    luuY: lt.luuY || "",
    trangThai: lt.trangThai ?? true,
    preview: normalizeImageUrl(lt.duongDanAnh),
    file: null,
    chiTietLichTrinhs: (lt.chiTietLichTrinhs || []).map(ct =>
        mapScheduleDetailFromApi(ct, lt.maLichTrinh)
    )
});

const mapImageFromApi = (img) => ({
    id: img.maAnhTour,
    preview: normalizeImageUrl(img.duongDanAnh),
    anhChinh: img.anhChinh ?? false,
    file: null
});

const mapDepartureFromApi = (ch) => {
    const departure = JSON.parse(JSON.stringify(ch.chuyenKhoiHanh || ch));

    return {
        ...departure,
        maChuyen: departure.maChuyen,
        tempId: departure.maChuyen || `temp-${Date.now()}-${Math.random()}`,
        gia: ch.danhSachGia?.[0] || {
            maGia: "",
            hangKhachSan: "",
            giaNguoiLon: "",
            giaTreEm: "",
            giaEmBe: "",
            phuThuPhongDon: ""
        },
        ngayKhoiHanh: departure.ngayKhoiHanh || null,
        ngayKetThuc: departure.ngayKetThuc || null,
        gioTapTrung: departure.gioTapTrung || "",
        gioXuatPhat: departure.gioXuatPhat || "",
        gioDenNoiDi: departure.gioDenNoiDi || null,
        gioDenNoiVe: departure.gioDenNoiVe || null,
    };
};

const buildScheduleFormData = (lt, tourId) => {
    const fd = new FormData();
    fd.append("MaTour", tourId ? Number(tourId) : 0);
    fd.append("TenLichTrinh", lt.tenLichTrinh || "");
    fd.append("BuaAn", lt.buaAn || "");
    fd.append("SoThuTuNgay", String(toNumber(lt.soThuTuNgay)));
    fd.append("HoatDongChinh", lt.hoatDongChinh || "");
    fd.append("LuuY", lt.luuY || "");
    fd.append("TrangThai", String(lt.trangThai ?? true));
    if (lt.file) fd.append("DuongDanAnh", lt.file);
    if (lt.maKhachSan) fd.append("MaKhachSan", Number(lt.maKhachSan));
    (lt.chiTietLichTrinhs || []).forEach((ct, index) => {
        fd.append(`ChiTietLichTrinh[${index}].MaCTLT`, toNumber(ct.maCTLT));
        fd.append(`ChiTietLichTrinh[${index}].MaLichTrinh`, toNumber(ct.maLichTrinh || lt.id));
        const maDiaDiemValue = ct.maDiaDiem && ct.maDiaDiem !== "" && ct.maDiaDiem !== "0" 
            ? toNumber(ct.maDiaDiem) 
            : 0;
        fd.append(`ChiTietLichTrinh[${index}].MaDiaDiem`, maDiaDiemValue);
        fd.append(`ChiTietLichTrinh[${index}].GioBatDau`, ct.gioBatDau || "");
        if (ct.gioKetThuc?.trim()) fd.append(`ChiTietLichTrinh[${index}].GioKetThuc`, ct.gioKetThuc);
        fd.append(`ChiTietLichTrinh[${index}].HoatDong`, ct.hoatDong || "");
        fd.append(`ChiTietLichTrinh[${index}].LoaiHoatDong`, ct.loaiHoatDong || "");
    });
    return fd;
};

const buildPricePayload = (ch) => ({
    MaGia: toNumber(ch.gia?.maGia),
    HangKhachSan: toNumber(ch.gia?.hangKhachSan),
    GiaNguoiLon: toNumber(ch.gia?.giaNguoiLon),
    GiaTreEm: toNumber(ch.gia?.giaTreEm),
    GiaEmBe: toNumber(ch.gia?.giaEmBe),
    PhuThuPhongDon: toNumber(ch.gia?.phuThuPhongDon)
});

const toLocalISO = (d) => {
    if (!d) return null;
    const date = d instanceof Date ? d : new Date(d);
    if (isNaN(date.getTime())) return null;
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const buildDeparturePayload = (ch, tourId) => ({
    ChuyenKhoiHanh: {
        MaChuyen: toNumber(ch.maChuyen),
        MaTour: toNumber(tourId || ch.maTour || 0),
        MaHDV: toNumber(ch.maHDV),
        MaPhuongTien: toNumber(ch.maPhuongTien),
        DiemKhoiHanh: ch.diemKhoiHanh?.trim() || "",
        DiemDen: ch.diemDen?.trim() || "",
        NgayKhoiHanh: toLocalISO(ch.ngayKhoiHanh),
        NgayKetThuc: toLocalISO(ch.ngayKetThuc),
        GioTapTrung: ch.gioTapTrung || "",
        GioXuatPhat: ch.gioXuatPhat || "",
        GioDenNoiDi: toLocalISO(ch.gioDenNoiDi),
        GioDenNoiVe: toLocalISO(ch.gioDenNoiVe),
        SoChoToiDa: toNumber(ch.soChoToiDa),
        GhiChu: ch.ghiChu || ""
    },
    DanhSachGia: [buildPricePayload(ch)]
});

const buildCreateTourDto = (formDataObj, lichTrinhs, chuyenKhoiHanhs) => ({
    TourInfo: {
        TenTour: formDataObj.tenTour,
        MaLoaiTour: toNumber(formDataObj.maLoaiTour),
        MoTa: formDataObj.moTa,
        Ngay: toNumber(formDataObj.ngay),
        Dem: toNumber(formDataObj.dem),
        TrongNuoc: formDataObj.trongNuoc,
    },
    DanhSachKhachSan: formDataObj.maKhachSan ? [toNumber(formDataObj.maKhachSan)] : [],
    LichTrinh: lichTrinhs.map(lt => ({
        TenLichTrinh: lt.tenLichTrinh,
        BuaAn: lt.buaAn,
        SoThuTuNgay: toNumber(lt.soThuTuNgay),
        HoatDongChinh: lt.hoatDongChinh,
        LuuY: lt.luuY,
        TrangThai: lt.trangThai,
        MaKhachSan: lt.maKhachSan ? Number(lt.maKhachSan) : null,
        ChiTietLichTrinh: (lt.chiTietLichTrinhs || []).map(ct => ({
            MaDiaDiem: ct.maDiaDiem && ct.maDiaDiem !== "" && ct.maDiaDiem !== "0" 
                ? toNumber(ct.maDiaDiem) 
                : null,
            GioBatDau: ct.gioBatDau,
            GioKetThuc: ct.gioKetThuc?.trim() || null,
            HoatDong: ct.hoatDong,
            LoaiHoatDong: ct.loaiHoatDong || null
        }))
    })),
    ChuyenKhoiHanhs: chuyenKhoiHanhs.map(ch => buildDeparturePayload(ch, 0))
});

const serializeSchedule = (lt) => JSON.stringify({
    tenLichTrinh: lt.tenLichTrinh,
    buaAn: lt.buaAn,
    hoatDongChinh: lt.hoatDongChinh,
    luuY: lt.luuY,
    trangThai: lt.trangThai,
    maKhachSan: lt.maKhachSan,
    hasFile: !!lt.file,
    chiTiet: (lt.chiTietLichTrinhs || []).map(ct => ({
        maCTLT: ct.maCTLT,
        maDiaDiem: ct.maDiaDiem || null,
        gioBatDau: ct.gioBatDau,
        gioKetThuc: ct.gioKetThuc || null,
        hoatDong: ct.hoatDong,
        loaiHoatDong: ct.loaiHoatDong || null
    }))
});

const toISO = (d) => d ? new Date(d).toISOString() : null;

const serializeDeparture = (ch) => JSON.stringify({
    maChuyen: ch.maChuyen,
    maHDV: ch.maHDV,
    maPhuongTien: ch.maPhuongTien,
    maChuyenCode: ch.maChuyenCode,
    diemKhoiHanh: ch.diemKhoiHanh,
    diemDen: ch.diemDen,
    ngayKhoiHanh: toISO(ch.ngayKhoiHanh),
    ngayKetThuc: toISO(ch.ngayKetThuc),
    gioTapTrung: ch.gioTapTrung,
    gioXuatPhat: ch.gioXuatPhat,
    gioDenNoiDi: toISO(ch.gioDenNoiDi),
    gioDenNoiVe: toISO(ch.gioDenNoiVe),
    soChoToiDa: ch.soChoToiDa,
    ghiChu: ch.ghiChu,
    gia: ch.gia
});

function useSectionSaving() {
    const [state, setState] = useState("idle");
    const timerRef = useRef(null);

    const markSaving = useCallback(() => {
        clearTimeout(timerRef.current);
        setState("saving");
    }, []);

    const markSaved = useCallback(() => {
        setState("saved");
        timerRef.current = setTimeout(() => setState("idle"), 2000);
    }, []);

    const markIdle = useCallback(() => {
        clearTimeout(timerRef.current);
        setState("idle");
    }, []);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    return { state, markSaving, markSaved, markIdle };
}

function SaveStatusBadge({ state }) {
    if (state === "idle") return null;
    if (state === "saving") return (
        <span className="flex items-center gap-1 text-xs text-slate-400">
            <Loader2 size={12} className="animate-spin" /> Đang lưu...
        </span>
    );
    return (
        <span className="flex items-center gap-1 text-xs text-emerald-500">
            <CheckCircle2 size={12} /> Đã lưu
        </span>
    );
}

export default function TourFormPage({ mode }) {
    const navigate = useNavigate();
    const { id } = useParams();

    const isViewMode = mode === "view";
    const isEdit = mode === "edit";

    const fileInputRef = useRef(null);
    const tourScheduleRef = useRef(null);
    const originalDataRef = useRef(null);
    const scheduleSnapshotRef = useRef({});
    const departureSnapshotRef = useRef({});
    const demManualRef = useRef(false);

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [loaiTours, setLoaiTours] = useState([]);
    const [khachSans, setKhachSans] = useState([]);
    const [diaDiems, setDiaDiems] = useState([]);
    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
    const [images, setImages] = useState([]);
    const [lichTrinhs, setLichTrinhs] = useState([]);
    const [chuyenKhoiHanhs, setChuyenKhoiHanhs] = useState([]);
    const [errors, setErrors] = useState({});

    const infoSaving = useSectionSaving();
    const imgSaving = useSectionSaving();
    const scheduleSaving = useSectionSaving();
    const deleteSaving = useSectionSaving();

    const isScheduleLocked = chuyenKhoiHanhs.some(
        x => x.soChoDaDat && x.soChoDaDat > 0
    );

    useEffect(() => {
        if (isEdit && formData.ngay && lichTrinhs.length > 0) {
            if (Number(formData.ngay) !== lichTrinhs.length) {
                setErrors(prev => ({
                    ...prev,
                    ngay: `Số ngày (${formData.ngay}) phải bằng số lịch trình (${lichTrinhs.length}). Vui lòng thêm hoặc xóa lịch trình cho khớp.`
                }));
            } else {
                setErrors(prev => {
                    const { ngay, ...rest } = prev;
                    return rest;
                });
            }
        }
    }, [formData.ngay, lichTrinhs.length, isEdit]);

    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                setInitialLoading(true);
                setLoadError(null);
                
                const [typeTourRes, hotelRes, locationRes] = await Promise.all([
                    getAllTypeTourApi(),
                    getHotelListApi(),
                    getLocatioListApi()
                ]);

                setLoaiTours(typeTourRes);
                setKhachSans(hotelRes);
                setDiaDiems(locationRes);

                if ((isEdit || isViewMode) && id) {
                    try {
                        const tourData = await getTourDetailApi(id);
                        
                        if (!tourData) {
                            throw new Error("Không tìm thấy dữ liệu tour");
                        }
                        
                        if (!tourData.tourInfo) {
                            throw new Error("Dữ liệu tour không hợp lệ");
                        }
                        
                        applyTourData(tourData, hotelRes);
                    } catch (tourError) {
                        console.error("Lỗi tải tour detail:", tourError);
                        setLoadError(tourError.message || "Không thể tải thông tin tour");
                        toastError("Lỗi tải dữ liệu", getErrorMessage(tourError, "Không thể tải thông tin tour!"));
                    }
                }
            } catch (error) {
                console.error("Lỗi tải master data:", error);
                setLoadError(error.message || "Không thể tải dữ liệu cấu hình");
                toastError("Tải dữ liệu thất bại", getErrorMessage(error, "Không thể tải dữ liệu cấu hình Tour!"));
            } finally {
                setInitialLoading(false);
            }
        };

        fetchMasterData();
    }, [id, mode]);

    // Kiểm tra nếu đang view mode và chưa có dữ liệu
    if (isViewMode && !initialLoading && !loading) {
        if (loadError) {
            return (
                <div className="bg-white border border-slate-200 rounded-2xl shadow p-8">
                    <div className="text-center py-12">
                        <div className="text-red-500 mb-4">
                            <AlertCircle size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                            Không thể tải dữ liệu
                        </h3>
                        <p className="text-slate-500 mb-6">{loadError}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            );
        }
        
        if (!formData.tenTour && !initialLoading) {
            return (
                <div className="bg-white border border-slate-200 rounded-2xl shadow p-8">
                    <div className="text-center py-12">
                        <div className="text-amber-500 mb-4">
                            <AlertCircle size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">
                            Không tìm thấy tour
                        </h3>
                        <p className="text-slate-500 mb-6">
                            Tour với ID #{id} không tồn tại hoặc đã bị xóa.
                        </p>
                        <button
                            onClick={() => navigate("/Quan-ly/Cac-chuyen-di")}
                            className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
                        >
                            Quay lại danh sách
                        </button>
                    </div>
                </div>
            );
        }
    }

    const applyTourData = (tourData, hotelRes) => {
        originalDataRef.current = tourData;
        demManualRef.current = true;

        const info = tourData.tourInfo;
        const matchedKhachSan = tourData.maKhachSans?.length
            ? hotelRes.find(ks => ks.maKhachSan === tourData.maKhachSans[0])
            : hotelRes.find(ks => tourData.tenKhachSans?.includes(ks.tenKhachSan));

        setFormData({
            tenTour: info.tenTour || "",
            maLoaiTour: info.maLoaiTour?.toString() || "",
            maKhachSan: matchedKhachSan?.maKhachSan?.toString() || "",
            moTa: info.moTa || "",
            ngay: info.ngay,
            dem: info.dem,
            trongNuoc: typeof info.trongNuoc === "boolean" ? info.trongNuoc : true,
            diemKhoiHanh: info.diemKhoiHanh || "",
            trangThai: info.trangThai
        });

        setImages((tourData.images || []).map(mapImageFromApi));

        const mapped = (tourData.lichTrinh || []).map(mapScheduleFromApi);
        setLichTrinhs(mapped);
        scheduleSnapshotRef.current = Object.fromEntries(
            mapped.map(lt => [lt.id, serializeSchedule(lt)])
        );

        const mappedDepartures = (tourData.chuyenKhoiHanhs || []).map(mapDepartureFromApi);
        departureSnapshotRef.current = Object.fromEntries(
            mappedDepartures.map(ch => [ch.maChuyen, serializeDeparture(ch)])
        );

        setChuyenKhoiHanhs(mappedDepartures);
    };

    const reloadTourData = useCallback(async () => {
        if (!id) return null;
        try {
            const tourData = await getTourDetailApi(id);
            originalDataRef.current = tourData;

            const info = tourData.tourInfo;
            const matchedKhachSan = tourData.maKhachSans?.length
                ? khachSans.find(ks => ks.maKhachSan === tourData.maKhachSans[0])
                : khachSans.find(ks => tourData.tenKhachSans?.includes(ks.tenKhachSan));

            setFormData(prev => ({
                ...prev,
                tenTour: info.tenTour || "",
                maLoaiTour: info.maLoaiTour?.toString() || "",
                maKhachSan: matchedKhachSan?.maKhachSan?.toString() || "",
                moTa: info.moTa || "",
                ngay: info.ngay,
                dem: info.dem,
                trongNuoc: typeof info.trongNuoc === "boolean" ? info.trongNuoc : true,
                diemKhoiHanh: info.diemKhoiHanh || "",
                trangThai: info.trangThai
            }));

            setImages((tourData.images || []).map(mapImageFromApi));

            const mapped = (tourData.lichTrinh || []).map(mapScheduleFromApi);
            setLichTrinhs(mapped);
            scheduleSnapshotRef.current = Object.fromEntries(
                mapped.map(lt => [lt.id, serializeSchedule(lt)])
            );

            const mappedDepartures = (tourData.chuyenKhoiHanhs || []).map(mapDepartureFromApi);
            departureSnapshotRef.current = Object.fromEntries(
                mappedDepartures.map(ch => [ch.maChuyen, serializeDeparture(ch)])
            );
            setChuyenKhoiHanhs(mappedDepartures);

            return tourData;
        } catch (error) {
            toastError("Lỗi tải dữ liệu", getErrorMessage(error, "Không thể tải lại dữ liệu tour!"));
            throw error;
        }
    }, [id, khachSans]);

    const handleNumberChange = (field, value) => {
        if (value === "") {
            if (field === "dem") demManualRef.current = true;
            setFormData(prev => ({ ...prev, [field]: "" }));
            setErrors(prev => { const { [field]: _, ...rest } = prev; return rest; });
            return;
        }

        const number = Number(value);
        if (number < 0) return;

        if (field === "ngay") {
            setFormData(prev => {
                const autoDem = Math.max(0, number - 1);
                const newDem = demManualRef.current ? prev.dem : autoDem;
                return { ...prev, ngay: number, dem: newDem };
            });
            setErrors(prev => { const { ngay: _, dem: __, ...rest } = prev; return rest; });
        } else if (field === "dem") {
            demManualRef.current = true;
            setFormData(prev => ({ ...prev, dem: number }));
            setErrors(prev => { const { dem: _, ...rest } = prev; return rest; });
        } else {
            setFormData(prev => ({ ...prev, [field]: number }));
        }
    };

    const validateNgayDem = (errs, ngayVal, demVal, checkScheduleMatch = false) => {
        const ngayNum = Number(ngayVal);
        const demNum = Number(demVal);

        if (!ngayVal || ngayNum <= 0) {
            errs.ngay = "Số ngày phải lớn hơn 0.";
        } else if (checkScheduleMatch && lichTrinhs.length > 0 && ngayNum !== lichTrinhs.length) {
            errs.ngay = `Số ngày (${ngayNum}) phải bằng số lịch trình (${lichTrinhs.length}).`;
        }

        if (demVal === "" || demVal == null) {
            errs.dem = "Số đêm không được để trống.";
        } else if (demNum < 0) {
            errs.dem = "Số đêm không được âm.";
        } else if (ngayVal && ngayNum > 0 && demNum >= ngayNum) {
            errs.dem = `Số đêm phải nhỏ hơn số ngày (tối đa ${ngayNum - 1} đêm).`;
        }
    };

    const handleImageChange = async (e) => {
        if (isViewMode) return;
        const files = Array.from(e.target.files || []);
        e.target.value = "";

        if (images.length + files.length > 10) {
            toastWarning("Vượt giới hạn", "Chỉ cho phép tải tối đa 10 hình ảnh!");
            return;
        }

        if (!isEdit) {
            setImages(prev => {
                const newImgs = files.map((file, idx) => ({
                    id: `IMG-NEW-${Date.now()}-${idx}`,
                    file,
                    preview: URL.createObjectURL(file),
                    anhChinh: false
                }));
                const updated = [...prev, ...newImgs];
                if (!updated.some(img => img.anhChinh)) updated[0].anhChinh = true;
                return updated;
            });
            return;
        }

        try {
            imgSaving.markSaving();
            const fd = new FormData();
            fd.append("TourDataJson", JSON.stringify(buildTourInfoJson()));
            files.forEach(file => fd.append("Images", file));
            await updateFullTourApi(id, fd);
            await reloadTourData();
            imgSaving.markSaved();
            toastSuccess("Thành công", "Đã cập nhật hình ảnh.");
        } catch (err) {
            imgSaving.markIdle();
            toastError("Lỗi upload ảnh", getErrorMessage(err));
        }
    };

    const handleRemoveImage = async (targetId) => {
        if (isViewMode) return;
        if (!isEdit) {
            setImages(prev => {
                const target = prev.find(img => img.id === targetId);
                if (target?.preview?.startsWith("blob:")) URL.revokeObjectURL(target.preview);
                const filtered = prev.filter(img => img.id !== targetId);
                if (filtered.length > 0 && !filtered.some(img => img.anhChinh)) filtered[0].anhChinh = true;
                return filtered;
            });
            return;
        }
        try {
            imgSaving.markSaving();
            await deleteTourImageApi(targetId);
            await reloadTourData();
            imgSaving.markSaved();
            toastSuccess("Thành công", "Đã xóa ảnh.");
        } catch (err) {
            imgSaving.markIdle();
            toastError("Lỗi xóa ảnh", getErrorMessage(err));
        }
    };

    const handleSetMainImage = async (targetId) => {
        if (isViewMode) return;
        if (!isEdit) {
            setImages(prev => prev.map(img => ({ ...img, anhChinh: img.id === targetId })));
            return;
        }
        try {
            imgSaving.markSaving();
            await setMainTourImageApi(targetId);
            await reloadTourData();
            imgSaving.markSaved();
            toastSuccess("Thành công", "Đã đặt ảnh chính.");
        } catch (err) {
            imgSaving.markIdle();
            toastError("Lỗi đặt ảnh chính", getErrorMessage(err));
        }
    };

    const handleLichTrinhsChange = async (newLichTrinhs) => {
        if (isScheduleLocked && isEdit) {
            toastWarning(
                "Không thể sửa lịch trình",
                "Tour đã có khách đặt, không được phép thay đổi lịch trình."
            );
            return;
        }

        if (!isEdit || !id) {
            setLichTrinhs(newLichTrinhs);
            return;
        }

        try {
            scheduleSaving.markSaving();
            await syncSchedulesImmediate(newLichTrinhs);
            await reloadTourData();
            scheduleSaving.markSaved();
        } catch (err) {
            scheduleSaving.markIdle();
            toastError("Lỗi lưu lịch trình", getErrorMessage(err));
            await reloadTourData();
            throw err;
        }
    };

    const syncSchedulesImmediate = async (snapshotLichTrinhs) => {
        const originalSchedules = originalDataRef.current?.lichTrinh || [];

        const deletedSchedules = originalSchedules.filter(ol => {
            const originalId = toNumber(ol.maLichTrinh);
            return isExistingId(originalId) && !snapshotLichTrinhs.some(sl => toNumber(sl.id) === originalId);
        });

        const toUpsert = snapshotLichTrinhs.filter(lt => {
            const scheduleId = toNumber(lt.id);
            if (!isExistingId(scheduleId)) return true;
            const prev = scheduleSnapshotRef.current[scheduleId];
            return prev !== serializeSchedule(lt);
        });

        if (deletedSchedules.length > 0) {
            const deleteResults = await Promise.allSettled(
                deletedSchedules.map(lt => deleteScheduleApi(toNumber(lt.maLichTrinh)))
            );
            const failedDeletes = deleteResults.filter(r => r.status === "rejected");
            if (failedDeletes.length > 0) {
                throw new Error(`Xóa ${failedDeletes.length} lịch trình thất bại.`);
            }
        }

        if (toUpsert.length > 0) {
            const upsertResults = await Promise.allSettled(
                toUpsert.map(async (lt) => {
                    const scheduleId = toNumber(lt.id);
                    const fd = buildScheduleFormData(lt, id);

                    if (isExistingId(scheduleId)) {
                        return await updateScheduleApi(scheduleId, fd);
                    } else {
                        return await createScheduleApi(fd);
                    }
                })
            );

            const failedUpserts = upsertResults.filter(r => r.status === "rejected");
            if (failedUpserts.length > 0) {
                throw new Error(`Cập nhật ${failedUpserts.length} lịch trình thất bại.`);
            }
        }
    };

    const syncSingleDeparture = useCallback(async (snapshotChuyenKhoiHanhs) => {
        const changedIndex = snapshotChuyenKhoiHanhs.findIndex(ch => {
            const maChuyen = toNumber(ch.maChuyen);
            if (!isExistingId(maChuyen)) return true;

            const currentSnapshot = departureSnapshotRef.current[maChuyen];
            const newSerialized = serializeDeparture(ch);
            return currentSnapshot !== newSerialized;
        });

        if (changedIndex === -1) {
            console.log("Không có thay đổi nào");
            return null;
        }

        const changedDeparture = snapshotChuyenKhoiHanhs[changedIndex];
        const maChuyen = toNumber(changedDeparture.maChuyen);
        const payload = buildDeparturePayload(changedDeparture, id);

        console.log(`[API CALL] ${isExistingId(maChuyen) ? 'UPDATE' : 'CREATE'} cho maChuyen=${maChuyen}`);

        try {
            let responseData;
            if (isExistingId(maChuyen)) {
                responseData = await updateDepartureApi(maChuyen, payload);
            } else {
                responseData = await createDepartureApi(payload);
            }

            const mappedDeparture = mapDepartureFromApi({
                chuyenKhoiHanh: responseData.chuyenKhoiHanh,
                danhSachGia: responseData.danhSachGia
            });

            const newMaChuyen = toNumber(mappedDeparture.maChuyen);
            if (isExistingId(newMaChuyen)) {
                departureSnapshotRef.current[newMaChuyen] = serializeDeparture(mappedDeparture);
            }

            return {
                index: changedIndex,
                data: mappedDeparture,
                isNew: !isExistingId(maChuyen)
            };
        } catch (err) {
            console.error(`[API ERROR]`, err?.response?.data || err);
            throw err;
        }
    }, [id]);

    const handleChuyenKhoiHanhsChange = useCallback(async (newChuyen) => {
        const validData = (newChuyen || []).filter(item => {
            if (!item.maChuyen && !item.tempId) return false;
            if (!item.diemKhoiHanh && !item.diemDen && !item.ngayKhoiHanh) return false;
            return true;
        });

        setChuyenKhoiHanhs(validData);

        if (!isEdit || !id) return;

        try {
            deleteSaving.markSaving();

            const result = await syncSingleDeparture(newChuyen);

            if (result) {
                setChuyenKhoiHanhs(prev => {
                    const updated = [...prev];
                    if (result.isNew) {
                        updated[result.index] = result.data;
                    } else {
                        updated[result.index] = {
                            ...prev[result.index],
                            ...result.data,
                            tempId: prev[result.index].tempId || result.data.tempId
                        };
                    }
                    return updated;
                });
            }

            deleteSaving.markSaved();
        } catch (err) {
            deleteSaving.markIdle();
            toastError("Lỗi cập nhật chuyến", getErrorMessage(err));
            console.error(err);
            await reloadTourData();
        }
    }, [isEdit, id, deleteSaving, syncSingleDeparture, reloadTourData]);

    const handleDeleteDeparture = async (row) => {
        if (!isEdit) {
            const updated = chuyenKhoiHanhs.filter(ch => ch.tempId !== row.tempId);
            setChuyenKhoiHanhs(updated);
            toastSuccess("Thành công", "Đã gỡ chuyến khởi hành tạm thời.");
            return;
        }

        let rawId = null;
        if (row) {
            if (typeof row.maChuyen !== 'undefined' && row.maChuyen !== null) {
                rawId = row.maChuyen;
            } else if (row.chuyenKhoiHanh && row.chuyenKhoiHanh.maChuyen) {
                rawId = row.chuyenKhoiHanh.maChuyen;
            } else if (row.id) {
                rawId = row.id;
            }
        }

        const targetMaChuyen = Number(rawId);

        if (!rawId || isNaN(targetMaChuyen) || targetMaChuyen <= 0) {
            console.error("Dữ liệu dòng chọn xóa bị lỗi định danh:", row);
            toastError("Lỗi dữ liệu", `Không xác định được mã chuyến khởi hành hợp lệ.`);
            return;
        }

        try {
            deleteSaving.markSaving();
            await deleteDepartureApi(targetMaChuyen);
            await reloadTourData();
            deleteSaving.markSaved();
            toastSuccess("Thành công", "Đã xóa chuyến khởi hành.");
        } catch (err) {
            deleteSaving.markIdle();
            console.error("Chi tiết lỗi từ Server khi xóa chuyến:", err);
            toastError("Lỗi xóa chuyến", getErrorMessage(err, "Không thể xóa chuyến đi này."));
            await reloadTourData();
        }
    };

    const buildTourInfoJson = () => ({
        TourInfo: {
            TenTour: formData.tenTour,
            MaLoaiTour: toNumber(formData.maLoaiTour),
            MoTa: formData.moTa,
            Ngay: formData.ngay,
            Dem: formData.dem,
            TrongNuoc: formData.trongNuoc,
            DiemKhoiHanh: formData.diemKhoiHanh,
            TrangThai: formData.trangThai
        },
        DanhSachKhachSan: formData.maKhachSan ? [toNumber(formData.maKhachSan)] : [],
        LichTrinh: [],
        ChuyenKhoiHanhs: []
    });

    const validateBasicInfo = () => {
        const errs = {};
        if (!formData.tenTour?.trim()) errs.tenTour = "Tên tour không được để trống.";
        if (!formData.maLoaiTour) errs.maLoaiTour = "Vui lòng chọn loại danh mục tour.";
        validateNgayDem(errs, formData.ngay, formData.dem, true);
        setErrors(prev => ({ ...prev, ...errs }));
        return Object.keys(errs).length === 0;
    };

    const validateCreate = () => {
        const errs = {};
        if (!formData.tenTour?.trim()) errs.tenTour = "Tên tour không được để trống.";
        if (!formData.maLoaiTour) errs.maLoaiTour = "Vui lòng chọn loại danh mục tour.";
        if (images.length === 0) errs.images = "Bạn phải tải lên ít nhất 1 hình ảnh.";

        const scheduleWithoutDetail = lichTrinhs.find(
            lt => !lt.chiTietLichTrinhs || lt.chiTietLichTrinhs.length === 0
        );
        if (scheduleWithoutDetail) {
            errs.lichTrinhs = `Ngày ${scheduleWithoutDetail.soThuTuNgay} chưa có mốc chi tiết.`;
        }

        validateNgayDem(errs, formData.ngay, formData.dem, false);

        const isDeparturesValid = tourScheduleRef.current?.validateAll?.() ?? true;
        setErrors(errs);
        return Object.keys(errs).length === 0 && isDeparturesValid;
    };

    const handleSaveBasicInfo = async () => {
        if (isViewMode || !validateBasicInfo()) return;

        if (Number(formData.ngay) !== lichTrinhs.length) {
            toastWarning(
                "Số ngày không khớp",
                `Tour có ${formData.ngay} ngày nhưng đang có ${lichTrinhs.length} lịch trình.`
            );
            return;
        }

        try {
            infoSaving.markSaving();
            const fd = new FormData();
            fd.append("TourDataJson", JSON.stringify(buildTourInfoJson()));
            await updateFullTourApi(id, fd);
            await reloadTourData();
            infoSaving.markSaved();
            toastSuccess("Thành công", "Đã lưu thông tin cơ bản.");
        } catch (err) {
            infoSaving.markIdle();
            toastError("Lỗi cập nhật thông tin", getErrorMessage(err));
        }
    };

    const handleCreateTour = async () => {
        if (!validateCreate()) return;
        try {
            setLoading(true);
            const fd = new FormData();
            fd.append("TourDataJson", JSON.stringify(buildCreateTourDto(formData, lichTrinhs, chuyenKhoiHanhs)));
            images.forEach(img => { if (img.file) fd.append("Images", img.file); });
            lichTrinhs.forEach(lt => { if (lt.file) fd.append("ScheduleFiles", lt.file, lt.file.name); });
            await createFullTourApi(fd);
            toastSuccess("Thành công", "Thêm mới tour trọn gói thành công!");
            navigate("/Quan-ly/Cac-chuyen-di");
        } catch (err) {
            toastError("Có lỗi xảy ra", getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    // Hiển thị loading khi đang tải dữ liệu
    if (initialLoading) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl shadow p-8">
                <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 size={48} className="animate-spin text-sky-500 mb-4" />
                    <p className="text-slate-500">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    const isBasicInfoCompleted =
        formData.tenTour?.trim() &&
        formData.maLoaiTour &&
        formData.ngay &&
        formData.dem !== "" &&
        formData.moTa?.trim();

    const hasSchedule = lichTrinhs.length > 0;
    const canAddDay = isBasicInfoCompleted && lichTrinhs.length < Number(formData.ngay || 0);
    const canSaveBasicInfo = isEdit && !isScheduleLocked && Number(formData.ngay) === lichTrinhs.length;

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow">
            <div className="p-6 flex justify-between items-center border-b border-slate-200 bg-slate-50 rounded-t-2xl">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-600 hover:bg-slate-200 px-4 py-2 rounded-xl transition"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Quay lại</span>
                </button>
                {!isEdit && !isViewMode && (
                    <div className="flex justify-end">
                        <button
                            onClick={handleCreateTour}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            Thêm tour
                        </button>
                    </div>
                )}
            </div>

            <div className="p-8 space-y-10">
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Hình ảnh ({images.length}/10)
                        </p>
                        {isEdit && <SaveStatusBadge state={imgSaving.state} />}
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {images.map((img) => (
                            <div
                                key={img.id}
                                className="relative w-32 h-32 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden group"
                            >
                                <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                                {img.anhChinh && (
                                    <span className="absolute top-1 left-1 bg-sky-500 text-white text-[9px] px-1.5 py-0.5 rounded">
                                        Ảnh chính
                                    </span>
                                )}
                                {!isViewMode && (
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1">
                                        {!img.anhChinh && (
                                            <button
                                                onClick={() => handleSetMainImage(img.id)}
                                                className="text-[10px] text-white bg-sky-500 px-2 py-1 rounded"
                                            >
                                                Đặt ảnh chính
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleRemoveImage(img.id)}
                                            className="text-[10px] bg-red-500 text-white px-2 py-1 rounded"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {!isViewMode && images.length < 10 && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center hover:border-sky-500 hover:text-sky-500 text-slate-400 transition"
                            >
                                <Camera size={20} />
                                <span className="text-[10px] mt-1">Tải ảnh</span>
                            </button>
                        )}
                    </div>
                    {errors.images && (
                        <p className="mt-2 text-xs text-red-500">{errors.images}</p>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </section>
                <section className="border-t border-slate-200 pt-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Thông tin cơ bản</p>
                        {isEdit && !isScheduleLocked && (
                            <div className="flex items-center gap-3">
                                <SaveStatusBadge state={infoSaving.state} />
                                <button
                                    onClick={handleSaveBasicInfo}
                                    disabled={!canSaveBasicInfo || infoSaving.state === "saving"}
                                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    Lưu thông tin
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Tên tour"
                            value={formData.tenTour}
                            onChange={(e) => setFormData(p => ({ ...p, tenTour: getVal(e) }))}
                            error={errors.tenTour}
                            disabled={isViewMode || isScheduleLocked}
                            required
                        />
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                Loại tour *
                            </label>
                            <SelectField
                                searchable
                                value={formData.maLoaiTour}
                                options={loaiTours}
                                valueKey="maLoaiTour"
                                labelKey="tenLoaiTour"
                                onChange={(e) => setFormData(p => ({ ...p, maLoaiTour: getVal(e) }))}
                                error={errors.maLoaiTour}
                                disabled={isViewMode || isScheduleLocked}
                            />
                        </div>

                        <InputField
                            type="number"
                            label="Số ngày"
                            value={formData.ngay}
                            onChange={(e) => handleNumberChange("ngay", getVal(e))}
                            disabled={isViewMode || isScheduleLocked}
                            min={1}
                            error={errors.ngay}
                        />

                        <div className="flex flex-col gap-1">
                            <InputField
                                type="number"
                                label="Số đêm"
                                value={formData.dem}
                                onChange={(e) => handleNumberChange("dem", getVal(e))}
                                disabled={isViewMode || isScheduleLocked}
                                min={0}
                                error={errors.dem}
                            />
                        </div>
                    </div>

                    <InputField
                        label="Mô tả tour"
                        multiline
                        rows={4}
                        value={formData.moTa}
                        onChange={(e) => setFormData(p => ({ ...p, moTa: getVal(e) }))}
                        placeholder="Mô tả chi tiết về tour..."
                        disabled={isViewMode || isScheduleLocked}
                    />
                </section>

                <div>
                    {errors.lichTrinhs && (
                        <p className="mb-2 text-xs text-red-500">{errors.lichTrinhs}</p>
                    )}
                    <TourItinerariesSection
                        maTour={id}
                        value={lichTrinhs}
                        onChange={handleLichTrinhsChange}
                        diaDiems={diaDiems}
                        khachSans={khachSans}
                        isViewMode={isViewMode}
                        loading={loading}
                        canAddDay={canAddDay && !isScheduleLocked}
                        isLocked={isScheduleLocked}
                        hasBooking={isScheduleLocked}
                    />
                </div>

                <section className="border-t border-slate-200 pt-8 space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                                Danh sách chuyến đi thuộc Tour
                            </h3>
                            {isEdit && <SaveStatusBadge state={deleteSaving.state} />}
                        </div>
                        {!isViewMode && (
                            <button
                                type="button"
                                disabled={!hasSchedule}
                                onClick={() => tourScheduleRef.current?.openModal()}
                                className={`flex items-center gap-1.5 px-4 py-2 text-white font-medium text-xs rounded-xl ${!hasSchedule ? "bg-slate-300 cursor-not-allowed" : "bg-sky-500 hover:bg-sky-600"
                                    }`}
                            >
                                <Plus size={18} /> Thêm chuyến số {chuyenKhoiHanhs.length + 1}
                            </button>
                        )}
                    </div>

                    {chuyenKhoiHanhs.length === 0 ? (
                        <div className="text-center py-8 bg-white border border-dashed border-slate-200 rounded-xl text-sm text-slate-400">
                            Chưa có chuyến khởi hành nào.
                        </div>
                    ) : (
                        <TourSchedulesTable
                            data={chuyenKhoiHanhs}
                            onView={(item) => tourScheduleRef.current?.openEditModal(item)}
                            onEdit={!isViewMode ? (item) => tourScheduleRef.current?.openEditModal(item) : null}
                            onDelete={!isViewMode ? handleDeleteDeparture : null}
                            loading={loading}
                            showStatus={isEdit || isViewMode}
                            showCodeChuyen={isEdit || isViewMode}
                            isCreateMode={!isEdit && !isViewMode}
                        />
                    )}
                </section>
            </div>

            <TourScheduleSection
                ref={tourScheduleRef}
                value={chuyenKhoiHanhs}
                onChange={handleChuyenKhoiHanhsChange}
                isViewMode={isViewMode}
                trongNuoc={formData.trongNuoc}
                soNgay={formData.ngay}
                lichTrinhMau={lichTrinhs}
            />
        </div>
    );
}