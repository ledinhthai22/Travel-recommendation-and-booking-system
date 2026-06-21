import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera, MapPin, Clock, Plus, Save, Loader2, CheckCircle2 } from "lucide-react";
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
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
};

const isExistingId = (value) => {
    const number = Number(value);
    return Number.isInteger(number) && number > 0;
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
    gioKetThuc: ct.gioKetThuc || "",
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

function useSectionSaving() {
    const [state, setState] = useState("idle");
    const timerRef = useRef(null);

    const markSaving = () => {
        clearTimeout(timerRef.current);
        setState("saving");
    };

    const markSaved = () => {
        setState("saved");
        timerRef.current = setTimeout(() => setState("idle"), 2000);
    };

    const markIdle = () => {
        clearTimeout(timerRef.current);
        setState("idle");
    };

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

    const [loading, setLoading] = useState(false);
    const [loaiTours, setLoaiTours] = useState([]);
    const [khachSans, setKhachSans] = useState([]);
    const [diaDiems, setDiaDiems] = useState([]);

    const [formData, setFormData] = useState({
        tenTour: "",
        maLoaiTour: "",
        maKhachSan: "",
        moTa: "",
        thoiGianTour: "",
        diemKhoiHanh: "",
        trongNuoc: true,
        trangThai: true
    });

    const [images, setImages] = useState([]);
    const [lichTrinhs, setLichTrinhs] = useState([]);
    const [chuyenKhoiHanhs, setChuyenKhoiHanhs] = useState([]);
    const [errors, setErrors] = useState({});
    const infoSaving = useSectionSaving();
    const imgSaving = useSectionSaving();
    const scheduleSaving = useSectionSaving();
    const departureSaving = useSectionSaving();

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
                        thoiGianTour: info.thoiGianTour || "",
                        trongNuoc: typeof info.trongNuoc === "boolean" ? info.trongNuoc : true,
                        diemKhoiHanh: info.diemKhoiHanh || "",
                        trangThai: info.trangThai
                    });

                    setImages((tourData.images || []).map(img => ({
                        id: img.maAnhTour,
                        preview: normalizeImageUrl(img.duongDanAnh),
                        anhChinh: img.anhChinh ?? false,
                        file: null
                    })));

                    setLichTrinhs((tourData.lichTrinh || []).map(mapScheduleFromApi));
                    setChuyenKhoiHanhs((tourData.chuyenKhoiHanhs || []).map(mapDepartureFromApi));
                }
            } catch (error) {
                toastError(
                    "Tải dữ liệu thất bại",
                    getErrorMessage(error, "Không thể tải dữ liệu cấu hình Tour!")
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMasterData();
    }, [id, mode, isEdit, isViewMode]);

    const refreshLichTrinhs = async () => {
        if (!id) return;
        try {
            const tourData = await getTourDetailApi(id);
            originalDataRef.current = tourData;
            setLichTrinhs((tourData.lichTrinh || []).map(mapScheduleFromApi));
        } catch (error) {
            toastError("Lỗi tải dữ liệu", getErrorMessage(error, "Không thể tải lại lịch trình!"));
        }
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
            MaChuyenCode: ch.maChuyenCode,
            DiemKhoiHanh: ch.diemKhoiHanh,
            DiemDen: ch.diemDen,
            NgayKhoiHanh: ch.ngayKhoiHanh,
            NgayKetThuc: ch.ngayKetThuc,
            GioDenNoiDi: ch.gioDenNoiDi,
            GioDenNoiVe: ch.gioDenNoiVe,
            SoLuongCho: toNumber(ch.soLuongCho),
            GhiChu: ch.ghiChu
        },
        DanhSachGia: [buildPricePayload(ch)]
    });

    const buildScheduleFormData = (lt, tourId) => {
        const scheduleFd = new FormData();
        scheduleFd.append("MaTour", tourId ? Number(tourId) : 0);
        scheduleFd.append("TenLichTrinh", lt.tenLichTrinh || "");
        scheduleFd.append("BuaAn", lt.buaAn || "");
        scheduleFd.append("SoThuTuNgay", String(toNumber(lt.soThuTuNgay)));
        scheduleFd.append("HoatDongChinh", lt.hoatDongChinh || "");
        scheduleFd.append("LuuY", lt.luuY || "");
        scheduleFd.append("TrangThai", String(lt.trangThai ?? true));

        if (lt.file) scheduleFd.append("DuongDanAnh", lt.file);

        (lt.chiTietLichTrinhs || []).forEach((ct, index) => {
            scheduleFd.append(`ChiTietLichTrinh[${index}].MaCTLT`, toNumber(ct.maCTLT));
            scheduleFd.append(`ChiTietLichTrinh[${index}].MaLichTrinh`, toNumber(ct.maLichTrinh || lt.id));
            scheduleFd.append(`ChiTietLichTrinh[${index}].MaDiaDiem`, toNumber(ct.maDiaDiem));
            scheduleFd.append(`ChiTietLichTrinh[${index}].GioBatDau`, ct.gioBatDau || "");
            scheduleFd.append(`ChiTietLichTrinh[${index}].GioKetThuc`, ct.gioKetThuc || "");
            scheduleFd.append(`ChiTietLichTrinh[${index}].HoatDong`, ct.hoatDong || "");
        });

        return scheduleFd;
    };

    const buildCreateTourDto = (formDataObj, snapshotLichTrinhs, snapshotChuyenKhoiHanhs) => ({
        TourInfo: {
            TenTour: formDataObj.tenTour,
            MaLoaiTour: toNumber(formDataObj.maLoaiTour),
            MoTa: formDataObj.moTa,
            ThoiGianTour: formDataObj.thoiGianTour,
            DiemKhoiHanh: formDataObj.diemKhoiHanh,
            TrongNuoc: formDataObj.trongNuoc,
            TrangThai: formDataObj.trangThai
        },
        DanhSachKhachSan: formDataObj.maKhachSan ? [toNumber(formDataObj.maKhachSan)] : [],
        LichTrinh: snapshotLichTrinhs.map(lt => ({
            TenLichTrinh: lt.tenLichTrinh,
            BuaAn: lt.buaAn,
            SoThuTuNgay: toNumber(lt.soThuTuNgay),
            HoatDongChinh: lt.hoatDongChinh,
            LuuY: lt.luuY,
            TrangThai: lt.trangThai,
            ChiTietLichTrinh: (lt.chiTietLichTrinhs || []).map(ct => ({
                MaDiaDiem: toNumber(ct.maDiaDiem),
                GioBatDau: ct.gioBatDau,
                GioKetThuc: ct.gioKetThuc,
                HoatDong: ct.hoatDong
            }))
        })),
        ChuyenKhoiHanhs: snapshotChuyenKhoiHanhs.map(ch => buildDeparturePayload(ch, 0))
    });

    const handleImageChange = async (e) => {
        if (isViewMode) return;
        const files = Array.from(e.target.files || []);
        e.target.value = ""
        if (images.length + files.length > 10) {
            toastWarning("Vượt giới hạn", "Chỉ cho phép tải tối đa 10 hình ảnh!");
            return;
        }

        if (!isEdit) {
            const newImages = files.map((file, idx) => ({
                id: `IMG-NEW-${Date.now()}-${idx}`,
                file,
                preview: URL.createObjectURL(file),
                anhChinh: false
            }));
            setImages(prev => {
                const updated = [...prev, ...newImages];
                if (!updated.some(img => img.anhChinh) && updated.length > 0) {
                    updated[0].anhChinh = true;
                }
                return updated;
            });
            return;
        }
        try {
            imgSaving.markSaving();
            const fd = new FormData();
            fd.append("TourDataJson", JSON.stringify({
                TourInfo: {
                    TenTour: formData.tenTour,
                    MaLoaiTour: Number(formData.maLoaiTour),
                    MoTa: formData.moTa,
                    ThoiGianTour: formData.thoiGianTour,
                    DiemKhoiHanh: formData.diemKhoiHanh,
                    TrongNuoc: formData.trongNuoc,
                    TrangThai: formData.trangThai
                },
                DanhSachKhachSan: formData.maKhachSan
                    ? [Number(formData.maKhachSan)]
                    : [],
                LichTrinh: [],
                ChuyenKhoiHanhs: []
            }));
            files.forEach(file => {
                fd.append("Images", file);
            });
            await updateFullTourApi(id, fd);
            const tourData = await getTourDetailApi(id);
            originalDataRef.current = { ...originalDataRef.current, images: tourData.images };
            setImages((tourData.images || []).map(img => ({
                id: img.maAnhTour,
                preview: normalizeImageUrl(img.duongDanAnh),
                anhChinh: img.anhChinh ?? false,
                file: null
            })));

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
                const targetImg = prev.find(img => img.id === targetId);
                if (targetImg?.preview?.startsWith("blob:")) URL.revokeObjectURL(targetImg.preview);
                const filtered = prev.filter(img => img.id !== targetId);
                if (filtered.length > 0 && !filtered.some(img => img.anhChinh)) {
                    filtered[0].anhChinh = true;
                }
                return filtered;
            });
            return;
        }

        try {
            imgSaving.markSaving();
            await deleteTourImageApi(targetId);

            setImages(prev => {
                const filtered = prev.filter(img => img.id !== targetId);
                if (filtered.length > 0 && !filtered.some(img => img.anhChinh)) {
                    filtered[0].anhChinh = true;
                }
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
        setLichTrinhs(newLichTrinhs);

        if (!isEdit || !id) return;

        try {
            scheduleSaving.markSaving();
            await syncSchedulesImmediate(newLichTrinhs);
            await refreshLichTrinhs();
            scheduleSaving.markSaved();
        } catch (err) {
            scheduleSaving.markIdle();
            toastError("Lỗi lưu lịch trình", getErrorMessage(err));
        }
    };

    const syncSchedulesImmediate = async (snapshotLichTrinhs) => {
        const originalSchedules = originalDataRef.current?.lichTrinh || [];

        const deletedSchedules = originalSchedules.filter(ol => {
            const originalId = toNumber(ol.maLichTrinh);
            return isExistingId(originalId) &&
                !snapshotLichTrinhs.some(sl => toNumber(sl.id) === originalId);
        });


        const deleteResults = await Promise.allSettled(
            deletedSchedules.map(lt => deleteScheduleApi(toNumber(lt.maLichTrinh)))
        );

        const upsertResults = await Promise.allSettled(
            snapshotLichTrinhs.map(lt => {
                const scheduleId = toNumber(lt.id);
                const scheduleFd = buildScheduleFormData(lt, id);
                return isExistingId(scheduleId)
                    ? updateScheduleApi(scheduleId, scheduleFd)
                    : createScheduleApi(scheduleFd);
            })
        );

        const failed = [...deleteResults, ...upsertResults].filter(r => r.status === "rejected");
        if (failed.length > 0) {
            console.error("Một số lịch trình lưu thất bại:", failed.map(f => f.reason));
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

        const upsertResults = await Promise.allSettled(
            snapshotChuyenKhoiHanhs.map(ch => {
                const maChuyen = toNumber(ch.maChuyen);
                const payload = buildDeparturePayload(ch, id);
                return isExistingId(maChuyen)
                    ? updateDepartureApi(maChuyen, payload)
                    : createDepartureApi(payload);
            })
        );

        const failed = [...deleteResults, ...upsertResults].filter(r => r.status === "rejected");
        if (failed.length > 0) {
            console.error("Một số chuyến khởi hành lưu thất bại:", failed.map(f => f.reason));
            throw new Error(`Có ${failed.length} thao tác chuyến khởi hành thất bại, vui lòng kiểm tra lại.`);
        }
    };



    const validateBasicInfo = () => {
        const tempErrors = {};
        if (!formData.tenTour?.trim()) tempErrors.tenTour = "Tên tour không được để trống.";
        if (!formData.maLoaiTour) tempErrors.maLoaiTour = "Vui lòng chọn loại danh mục tour.";
        setErrors(prev => ({ ...prev, ...tempErrors }));
        return Object.keys(tempErrors).length === 0;
    };

    const handleSaveBasicInfo = async () => {
        if (isViewMode || !validateBasicInfo()) return;

        try {
            infoSaving.markSaving();
            const fd = new FormData();
            fd.append("TourDataJson", JSON.stringify({
                TourInfo: {
                    TenTour: formData.tenTour,
                    MaLoaiTour: toNumber(formData.maLoaiTour),
                    MoTa: formData.moTa,
                    ThoiGianTour: formData.thoiGianTour,
                    TrongNuoc: formData.trongNuoc,
                    DiemKhoiHanh: formData.diemKhoiHanh,
                    TrangThai: formData.trangThai ?? true
                },
                DanhSachKhachSan: formData.maKhachSan ? [toNumber(formData.maKhachSan)] : [],
                LichTrinh: [],
                ChuyenKhoiHanhs: []
            }));
            await updateFullTourApi(id, fd);
            infoSaving.markSaved();
        } catch (err) {
            infoSaving.markIdle();
            toastError("Lỗi cập nhật thông tin", getErrorMessage(err));
        }
    };



    const validateCreate = () => {
        const tempErrors = {};

        if (!formData.tenTour?.trim()) tempErrors.tenTour = "Tên tour không được để trống.";
        if (!formData.maLoaiTour) tempErrors.maLoaiTour = "Vui lòng chọn loại danh mục tour.";
        if (images.length === 0) tempErrors.images = "Bạn phải tải lên ít nhất 1 hình ảnh.";

        const scheduleWithoutDetail = lichTrinhs.find(
            lt => !lt.chiTietLichTrinhs || lt.chiTietLichTrinhs.length === 0
        );
        if (scheduleWithoutDetail) {
            tempErrors.lichTrinhs = `Ngày ${scheduleWithoutDetail.soThuTuNgay} chưa có mốc chi tiết địa điểm tham quan nào.`;
            toastWarning(
                "Thiếu thông tin lịch trình",
                `Ngày ${scheduleWithoutDetail.soThuTuNgay} chưa có mốc chi tiết. Vui lòng thêm ít nhất 1 mốc.`
            );
        }

        const isDeparturesValid = tourScheduleRef.current?.validateAll?.() ?? true;
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0 && isDeparturesValid;
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
                fd.append("ScheduleFiles", lt.file ? lt.file : new Blob([]), "");
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
        formData.thoiGianTour?.trim() &&
        formData.diemKhoiHanh?.trim() &&
        formData.maKhachSan && formData.moTa.trim();
    const hasSchedule = lichTrinhs.length > 0;
    const phanLoaiTours = [
        { value: true, label: "Trong nước" },
        { value: false, label: "Nước ngoài" }
    ];
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
                {!isViewMode && !isEdit && (
                    <button
                        onClick={handleCreateTour}
                        disabled={loading}
                        className="text-white font-semibold px-8 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 transition disabled:opacity-70 flex items-center gap-2"
                    >
                        {loading ? (
                            <><Loader2 size={16} className="animate-spin" /> Đang tạo...</>
                        ) : "Thêm Tour"}
                    </button>
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
                <section className="border-t border-slate-200 pt-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Thông tin cơ bản
                        </p>
                        {!isViewMode && (
                            <div className="flex items-center gap-3">
                                <SaveStatusBadge state={infoSaving.state} />
                                {isEdit && (
                                    <button
                                        onClick={handleSaveBasicInfo}
                                        disabled={infoSaving.state === "saving"}
                                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-sky-400/80 hover:bg-sky-400/60 rounded-xl transition disabled:opacity-60"
                                    >
                                        <Save size={10} />
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
                            disabled={isViewMode}
                            required
                        />
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Loại tour *</label>
                            <SelectField
                                value={formData.maLoaiTour}
                                options={loaiTours}
                                valueKey="maLoaiTour"
                                labelKey="tenLoaiTour"
                                onChange={(e) => setFormData(p => ({ ...p, maLoaiTour: getVal(e) }))}
                                error={errors.maLoaiTour}
                                disabled={isViewMode}
                            />
                        </div>
                        <InputField
                            label="Thời gian tour"
                            value={formData.thoiGianTour}
                            onChange={(e) => setFormData(p => ({ ...p, thoiGianTour: getVal(e) }))}
                            placeholder="Ví dụ: 3 ngày 2 đêm"
                            icon={<Clock size={18} />}
                            disabled={isViewMode}
                        />
                        <InputField
                            label="Điểm khởi hành"
                            value={formData.diemKhoiHanh}
                            onChange={(e) => setFormData(p => ({ ...p, diemKhoiHanh: getVal(e) }))}
                            icon={<MapPin size={18} />}
                            disabled={isViewMode}
                        />
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Khách sạn</label>
                            <SelectField
                                value={formData.maKhachSan}
                                options={khachSans}
                                valueKey="maKhachSan"
                                labelKey="tenKhachSan"
                                onChange={(e) => setFormData(p => ({ ...p, maKhachSan: getVal(e) }))}
                                disabled={isViewMode}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Phân vùng tour *</label>
                            <SelectField
                                value={formData.trongNuoc}
                                options={phanLoaiTours}
                                valueKey="value"
                                labelKey="label"
                                onChange={(e) => {
                                    const val = getVal(e);
                                    setFormData(p => ({
                                        ...p,
                                        trongNuoc: val === true || val === "true" || val === 1
                                    }));
                                }}
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
                        disabled={isViewMode}
                    />
                </section>

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
                    />
                    {errors.lichTrinhs && (
                        <p className="text-red-600 text-sm mt-2">{errors.lichTrinhs}</p>
                    )}
                </div>
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
                            onEdit={!isViewMode ? (item) => tourScheduleRef.current?.openEditModal(item) : null}
                            loading={loading}
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