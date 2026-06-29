import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera, Clock, Plus, Save, Loader2, CheckCircle2 } from "lucide-react";
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
const PHAN_LOAI_TOURS = [
    { value: true, label: "Trong nước" },
    { value: false, label: "Nước ngoài" }
];


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
    maDiaDiem: toNumber(ct.maDiaDiem),
    gioBatDau: ct.gioBatDau || "",

    gioKetThuc: ct.gioKetThuc || null,
    hoatDong: ct.hoatDong || ""
});

const mapScheduleFromApi = (lt) => ({
    id: toNumber(lt.maLichTrinh),
    soThuTuNgay: toNumber(lt.soThuTuNgay),
    tenLichTrinh: lt.tenLichTrinh || "",
    buaAn: lt.buaAn || "",
    hoatDongChinh: lt.hoatDongChinh || "",
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

const mapDepartureFromApi = (ch) => ({
    ...ch.chuyenKhoiHanh,
    maChuyen: ch.chuyenKhoiHanh?.maChuyen,
    tempId: ch.chuyenKhoiHanh?.maChuyen || Date.now() + Math.random(),
    gia: ch.danhSachGia?.[0] || {
        maGia: "",
        hangKhachSan: "",
        giaNguoiLon: "",
        giaTreEm: "",
        giaEmBe: "",
        phuThuPhongDon: ""
    }
});



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

    (lt.chiTietLichTrinhs || []).forEach((ct, index) => {
        fd.append(`ChiTietLichTrinh[${index}].MaCTLT`, toNumber(ct.maCTLT));
        fd.append(`ChiTietLichTrinh[${index}].MaLichTrinh`, toNumber(ct.maLichTrinh || lt.id));
        fd.append(`ChiTietLichTrinh[${index}].MaDiaDiem`, toNumber(ct.maDiaDiem));
        fd.append(`ChiTietLichTrinh[${index}].GioBatDau`, ct.gioBatDau || "");
        if (ct.gioKetThuc?.trim()) {
            fd.append(`ChiTietLichTrinh[${index}].GioKetThuc`, ct.gioKetThuc);
        }
        fd.append(`ChiTietLichTrinh[${index}].HoatDong`, ct.hoatDong || "");
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

const buildDeparturePayload = (ch, tourId) => ({
    ChuyenKhoiHanh: {
        MaChuyen: toNumber(ch.maChuyen),
        MaTour: toNumber(tourId || 0),
        MaHDV: toNumber(ch.maHDV),
        MaPhuongTien: toNumber(ch.maPhuongTien),
        DiemKhoiHanh: ch.diemKhoiHanh,
        DiemDen: ch.diemDen,
        NgayKhoiHanh: ch.ngayKhoiHanh,
        NgayKetThuc: ch.ngayKetThuc,
        GioDenNoiDi: ch.gioDenNoiDi,
        GioDenNoiVe: ch.gioDenNoiVe,
        SoChoToiDa: toNumber(ch.soChoToiDa),
        GhiChu: ch.ghiChu
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
        ChiTietLichTrinh: (lt.chiTietLichTrinhs || []).map(ct => ({
            MaDiaDiem: toNumber(ct.maDiaDiem),
            GioBatDau: ct.gioBatDau,

            GioKetThuc: ct.gioKetThuc?.trim() || null,
            HoatDong: ct.hoatDong
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
    hasFile: !!lt.file,
    chiTiet: (lt.chiTietLichTrinhs || []).map(ct => ({
        maCTLT: ct.maCTLT,
        maDiaDiem: ct.maDiaDiem,
        gioBatDau: ct.gioBatDau,
        gioKetThuc: ct.gioKetThuc || null,
        hoatDong: ct.hoatDong
    }))
});


const serializeDeparture = (ch) => JSON.stringify({
    maChuyen: ch.maChuyen,
    maHDV: ch.maHDV,
    maPhuongTien: ch.maPhuongTien,
    maChuyenCode: ch.maChuyenCode,
    ngayKhoiHanh: ch.ngayKhoiHanh,
    ngayKetThuc: ch.ngayKetThuc,
    diemKhoiHanh: ch.diemKhoiHanh,
    diemDen: ch.diemDen,
    soChoToiDa: ch.soChoToiDa,
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
    const [loading, setLoading] = useState(false);
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
    const departureSaving = useSectionSaving();

    const isScheduleLocked = chuyenKhoiHanhs.some(
        x => x.trangThai === 2 || x.trangThai === 3 || x.soChoDaDat > 0
    );
    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                setLoading(true);
                const [typeTourRes, hotelRes, locationRes] = await Promise.all([
                    getAllTypeTourApi(),
                    getHotelListApi(),
                    getLocatioListApi()
                ]);

                setLoaiTours(typeTourRes);
                setKhachSans(hotelRes);
                setDiaDiems(locationRes);

                if ((isEdit || isViewMode) && id) {
                    const tourData = await getTourDetailApi(id);
                    applyTourData(tourData, hotelRes);
                }
            } catch (error) {
                toastError("Tải dữ liệu thất bại", getErrorMessage(error, "Không thể tải dữ liệu cấu hình Tour!"));
            } finally {
                setLoading(false);
            }
        };

        fetchMasterData();
    }, [id, mode]);

    const applyTourData = (tourData, hotelRes) => {
        originalDataRef.current = tourData;
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

        setChuyenKhoiHanhs((tourData.chuyenKhoiHanhs || []).map(mapDepartureFromApi));
    };

    const refreshLichTrinhs = async () => {
        if (!id) return;
        try {
            const tourData = await getTourDetailApi(id);
            originalDataRef.current = tourData;
            const mapped = (tourData.lichTrinh || []).map(mapScheduleFromApi);
            setLichTrinhs(mapped);
            scheduleSnapshotRef.current = Object.fromEntries(
                mapped.map(lt => [lt.id, serializeSchedule(lt)])
            );
        } catch (error) {
            toastError("Lỗi tải dữ liệu", getErrorMessage(error, "Không thể tải lại lịch trình!"));
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

            const tourData = await getTourDetailApi(id);
            originalDataRef.current = { ...originalDataRef.current, images: tourData.images };
            setImages((tourData.images || []).map(mapImageFromApi));
            imgSaving.markSaved();
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
            setImages(prev => {
                const filtered = prev.filter(img => img.id !== targetId);
                if (filtered.length > 0 && !filtered.some(img => img.anhChinh)) filtered[0].anhChinh = true;
                return filtered;
            });
            imgSaving.markSaved();
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
            setImages(prev => prev.map(img => ({ ...img, anhChinh: img.id === targetId })));
            imgSaving.markSaved();
        } catch (err) {
            imgSaving.markIdle();
            toastError("Lỗi đặt ảnh chính", getErrorMessage(err));
        }
    };


    const handleLichTrinhsChange = async (newLichTrinhs) => {
        if (!isEdit || !id) {
            setLichTrinhs(newLichTrinhs);
            return;
        }

        try {
            scheduleSaving.markSaving();
            await syncSchedulesImmediate(newLichTrinhs);
            await refreshLichTrinhs();
            scheduleSaving.markSaved();
        } catch (err) {
            scheduleSaving.markIdle();
            toastError("Lỗi lưu lịch trình", getErrorMessage(err));
            throw err;
        }
    };

    const syncSchedulesImmediate = async (snapshotLichTrinhs) => {
        const originalSchedules = originalDataRef.current?.lichTrinh || [];

        const deletedSchedules = originalSchedules.filter(ol => {
            const originalId = toNumber(ol.maLichTrinh);
            return isExistingId(originalId) &&
                !snapshotLichTrinhs.some(sl => toNumber(sl.id) === originalId);
        });


        const toUpsert = snapshotLichTrinhs.filter(lt => {
            const scheduleId = toNumber(lt.id);
            if (!isExistingId(scheduleId)) return true;
            const prev = scheduleSnapshotRef.current[scheduleId];
            return prev !== serializeSchedule(lt);
        });

        const deleteResults = await Promise.allSettled(
            deletedSchedules.map(lt => deleteScheduleApi(toNumber(lt.maLichTrinh)))
        );

        const upsertResults = await Promise.allSettled(
            toUpsert.map(lt => {
                const scheduleId = toNumber(lt.id);
                const fd = buildScheduleFormData(lt, id);
                return isExistingId(scheduleId)
                    ? updateScheduleApi(scheduleId, fd)
                    : createScheduleApi(fd);
            })
        );

        const failed = [...deleteResults, ...upsertResults].filter(r => r.status === "rejected");
        if (failed.length > 0) {
            console.error(
                "Chi tiết lỗi lịch trình:",
                failed.map(f => f.reason?.response?.data ?? f.reason?.message ?? f.reason)
            );
            throw new Error(`Có ${failed.length} thao tác lịch trình thất bại, vui lòng kiểm tra lại.`);
        }
    };


    const handleChuyenKhoiHanhsChange = async (newChuyen) => {
        setChuyenKhoiHanhs(newChuyen);

        if (!isEdit || !id) return;

        try {
            departureSaving.markSaving();
            await syncDeparturesImmediate(newChuyen);
            const tourData = await getTourDetailApi(id);
            originalDataRef.current = { ...originalDataRef.current, chuyenKhoiHanhs: tourData.chuyenKhoiHanhs };
            setChuyenKhoiHanhs((tourData.chuyenKhoiHanhs || []).map(mapDepartureFromApi));
            departureSaving.markSaved();
        } catch (err) {
            departureSaving.markIdle();
            toastError("Lỗi lưu chuyến khởi hành", getErrorMessage(err));
        }
    };

    const syncDeparturesImmediate = async (snapshotChuyenKhoiHanhs) => {
        const originalDepartures = originalDataRef.current?.chuyenKhoiHanhs || [];

        const deletedDepartures = originalDepartures.filter(oc => {
            const maChuyen = toNumber(oc.chuyenKhoiHanh?.maChuyen);
            return isExistingId(maChuyen) &&
                !snapshotChuyenKhoiHanhs.some(sc => toNumber(sc.maChuyen) === maChuyen);
        });

        const deleteResults = await Promise.allSettled(
            deletedDepartures.map(oc => deleteDepartureApi(toNumber(oc.chuyenKhoiHanh.maChuyen)))
        );

        const toUpsert = snapshotChuyenKhoiHanhs.filter(ch => {
            const maChuyen = toNumber(ch.maChuyen);
            if (!isExistingId(maChuyen)) return true;
            const prev = departureSnapshotRef.current[maChuyen];
            return prev !== serializeDeparture(ch);
        });

        const upsertResults = await Promise.allSettled(
            toUpsert.map(ch => {
                const maChuyen = toNumber(ch.maChuyen);
                const payload = buildDeparturePayload(ch, id);
                return isExistingId(maChuyen)
                    ? updateDepartureApi(maChuyen, payload)
                    : createDepartureApi(payload);
            })
        );

        const failed = [...deleteResults, ...upsertResults].filter(r => r.status === "rejected");
        if (failed.length > 0) {
            console.error("Chi tiết lỗi chuyến khởi hành:", failed.map(f => f.reason));
            throw new Error(`Có ${failed.length} thao tác chuyến khởi hành thất bại, vui lòng kiểm tra lại.`);
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
        setErrors(prev => ({ ...prev, ...errs }));
        return Object.keys(errs).length === 0;
    };

    const handleSaveBasicInfo = async () => {
        if (isViewMode || !validateBasicInfo()) return;

        try {
            infoSaving.markSaving();
            const fd = new FormData();
            fd.append("TourDataJson", JSON.stringify(buildTourInfoJson()));
            await updateFullTourApi(id, fd);
            infoSaving.markSaved();
        } catch (err) {
            infoSaving.markIdle();
            toastError("Lỗi cập nhật thông tin", getErrorMessage(err));
        }
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
            errs.lichTrinhs = `Ngày ${scheduleWithoutDetail.soThuTuNgay} chưa có mốc chi tiết địa điểm tham quan nào.`;
            toastWarning(
                "Thiếu thông tin lịch trình",
                `Ngày ${scheduleWithoutDetail.soThuTuNgay} chưa có mốc chi tiết. Vui lòng thêm ít nhất 1 mốc.`
            );
        }
        if (!formData.ngay)
            errs.ngay = "Vui lòng nhập số ngày";

        if (!formData.dem && formData.dem !== 0)
            errs.dem = "Vui lòng nhập số đêm";

        const isDeparturesValid = tourScheduleRef.current?.validateAll?.() ?? true;
        setErrors(errs);
        return Object.keys(errs).length === 0 && isDeparturesValid;
    };

    const handleCreateTour = async () => {
        if (!validateCreate()) return;

        try {
            setLoading(true);
            const fd = new FormData();
            fd.append("TourDataJson", JSON.stringify(
                buildCreateTourDto(formData, lichTrinhs, chuyenKhoiHanhs)
            ));
            images.forEach(img => {
                if (img.file) fd.append("Images", img.file);
            });
            lichTrinhs.forEach(lt => {
                if (lt.file) fd.append("ScheduleFiles", lt.file, lt.file.name);
            });

            await createFullTourApi(fd);
            toastSuccess("Thành công", "Thêm mới tour trọn gói thành công!");
            navigate("/Quan-ly/Cac-chuyen-di");
        } catch (err) {
            toastError("Có lỗi xảy ra", getErrorMessage(err, "Có lỗi xảy ra trong quá trình tạo tour!"));
        } finally {
            setLoading(false);
        }
    };

    const isBasicInfoCompleted =
        formData.tenTour?.trim() &&
        formData.maLoaiTour &&
        formData.ngay !== "" && formData.ngay !== null && formData.ngay !== undefined &&
        formData.dem !== "" && formData.dem !== null && formData.dem !== undefined &&
        formData.maKhachSan &&
        formData.moTa?.trim();

    const hasSchedule = lichTrinhs.length > 0;

    const handleNumberChange = (field, value) => {
        const number = Number(value);

        if (value === "") {
            setFormData(prev => ({
                ...prev,
                [field]: ""
            }));
            return;
        }

        if (number < 0) return;

        setFormData(prev => ({
            ...prev,
            [field]: number
        }));
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow">
            {/* Header */}
            <div className="p-6 flex justify-between items-center border-b border-slate-200 bg-slate-50 rounded-t-2xl">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-600 hover:bg-slate-200 px-4 py-2 rounded-xl transition"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Quay lại</span>
                </button>
                {!isViewMode && !isEdit && (
                    <button
                        onClick={handleCreateTour}
                        disabled={loading}
                        className="text-white font-semibold px-8 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 transition disabled:opacity-70 flex items-center gap-2"
                    >
                        {loading
                            ? <><Loader2 size={16} className="animate-spin" /> Đang tạo...</>
                            : "Thêm Tour"
                        }
                    </button>
                )}
            </div>

            <div className="p-8 space-y-10">
                {/* Images */}
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
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-all">
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

                    <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    {errors.images && <p className="text-red-600 text-sm mt-2">{errors.images}</p>}
                </section>

                {/* Basic Info */}
                <section className="border-t border-slate-200 pt-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Thông tin cơ bản
                        </p>
                        {isEdit && !isScheduleLocked && (
                            <div className="flex items-center gap-3">
                                <SaveStatusBadge state={infoSaving.state} />
                                {isEdit && (
                                    <button
                                        onClick={handleSaveBasicInfo}
                                        disabled={infoSaving.state === "saving"}
                                        className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-white bg-sky-400/80 hover:bg-sky-400/60 rounded-xl transition disabled:opacity-60"
                                    >
                                        <span>Lưu thông tin</span>
                                    </button>
                                )}
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
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Loại tour *</label>
                            <SelectField
                                searchable
                                searchText="Tìm kiếm loại tour"
                                value={formData.maLoaiTour}
                                options={loaiTours}
                                valueKey="maLoaiTour"
                                labelKey="tenLoaiTour"
                                onChange={(e) => setFormData(p => ({ ...p, maLoaiTour: getVal(e) }))}
                                error={errors.maLoaiTour}
                                disabled={isViewMode || isScheduleLocked}
                            />
                        </div>
                        <div >
                            <InputField
                                type="number"
                                label="Số ngày"
                                value={formData.ngay}
                                onChange={(e) =>
                                    handleNumberChange("ngay", getVal(e))
                                }
                                disabled={isViewMode || isScheduleLocked}
                                min={1}
                            />


                        </div>
                        <div>
                            <InputField
                                type="number"
                                label="Số đêm"
                                value={formData.dem}
                                onChange={(e) =>
                                    handleNumberChange("dem", getVal(e))
                                }
                                disabled={isViewMode || isScheduleLocked}
                                min={1}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Khách sạn</label>
                        <SelectField
                            searchable
                            searchText="Tìm kiếm khách sạn"
                            value={formData.maKhachSan}
                            options={khachSans}
                            valueKey="maKhachSan"
                            labelKey="tenKhachSan"
                            onChange={(e) => setFormData(p => ({ ...p, maKhachSan: getVal(e) }))}
                            disabled={isViewMode || isScheduleLocked}
                        />
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

                {/* Itineraries */}
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        {isEdit && <SaveStatusBadge state={scheduleSaving.state} />}
                    </div>
                    <TourItinerariesSection
                        maTour={id}
                        value={lichTrinhs}
                        onChange={isEdit ? handleLichTrinhsChange : (val) => setLichTrinhs(val)}
                        diaDiems={diaDiems}
                        isViewMode={isViewMode}
                        loading={loading}
                        canAddDay={isBasicInfoCompleted}
                        isLocked={isScheduleLocked}
                    />
                    {errors.lichTrinhs && (
                        <p className="text-red-600 text-sm mt-2">{errors.lichTrinhs}</p>
                    )}
                </div>

                {/* Departures */}
                <section className="border-t border-slate-200 pt-8 space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                                Danh sách chuyến đi thuộc Tour
                            </h3>
                            {isEdit && <SaveStatusBadge state={departureSaving.state} />}
                        </div>
                        {!isViewMode && (
                            <button
                                type="button"
                                disabled={!hasSchedule}
                                onClick={() => tourScheduleRef.current?.openModal()}
                                className={`flex items-center gap-1.5 px-4 py-2 text-white font-medium text-xs rounded-xl shadow-sm transition
                                    ${!hasSchedule ? "bg-slate-300 cursor-not-allowed" : "bg-sky-400/80 hover:bg-sky-400/60"}
                                `}
                            >
                                <Plus size={18} />
                                Thêm chuyến số {chuyenKhoiHanhs.length + 1}
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
                            onEdit={
                                !isViewMode
                                    ? (item) => tourScheduleRef.current?.openEditModal(item)
                                    : null
                            }
                            loading={loading}
                            showStatus={isEdit || isViewMode}
                            showCodeChuyen={isEdit || isViewMode}
                        />
                    )}
                </section>
            </div>

            <TourScheduleSection
                ref={tourScheduleRef}
                value={chuyenKhoiHanhs}
                onChange={isEdit ? handleChuyenKhoiHanhsChange : setChuyenKhoiHanhs}
                isViewMode={isViewMode}
                trongNuoc={formData.trongNuoc}
            />
        </div>
    );
}