import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Camera,
    MapPin,
    Clock,
    X,
    CalendarDays,
    Plus,
    Utensils,
    Activity,
    Trash2
} from "lucide-react";
import TourItinerariesTable from "./TourItinerariesTable";
import InputField from "~/components/UI/Form/InputField";
import SelectField from "~/components/UI/Form/SelectField";
import TourSchedulesTable from "./TourSchedulesTable";
import TourScheduleSection from "./TourSection/TourScheduleSection";

export default function TourFormPage() {
    const navigate = useNavigate();
    const { id, mode } = useParams();
    const isViewMode = mode === "view";
    const isEdit = mode === "edit";

    const fileInputRef = useRef(null);

    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showItineraryModal, setShowItineraryModal] = useState(false);

    // State lưu ngày lịch trình đang sửa/thêm mới
    const [currentItinerary, setCurrentItinerary] = useState(null);

    // State tạm thời phục vụ cho form thêm nhanh 1 dòng Chi tiết lịch trình bên trong Modal
    const [newSubRow, setNewSubRow] = useState({
        gioBatDau: "",
        gioKetThuc: "",
        maDiaDiem: "",
        hoatDong: ""
    });

    const [loading, setLoading] = useState(false);
    const [loaiTours, setLoaiTours] = useState([]);
    const [khachSans, setKhachSans] = useState([]);
    const [diaDiems, setDiaDiems] = useState([]); // Master data danh sách địa điểm để chọn (FK)

    const [formData, setFormData] = useState({
        tenTour: "",
        maLoaiTour: "",
        maKhachSan: "",
        moTa: "",
        thoiGianTour: "",
        soLuongToiDa: "",
        diemKhoiHanh: "",
        trangThai: true,
    });

    const [images, setImages] = useState([]);
    const [lichTrinhs, setLichTrinhs] = useState([]);
    const [chuyenKhoiHanhs, setChuyenKhoiHanhs] = useState([]);
    const [errors, setErrors] = useState({});

    const showToast = (msg, type = "success") => alert(msg);
    const getVal = (e) => e?.target?.value ?? e;

    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                setLoaiTours([
                    { maLoaiTour: "LT01", tenLoaiTour: "Tour Trong Nước" },
                    { maLoaiTour: "LT02", tenLoaiTour: "Tour Nước Ngoài" }
                ]);
                setKhachSans([
                    { maKhachSan: "KS01", tenKhachSan: "Mường Thanh Luxury 5*" },
                    { maKhachSan: "KS02", tenKhachSan: "Vinpearl Resort 5*" }
                ]);
                // Giả lập master data địa điểm đổ vào select option trong chi tiết lịch trình
                setDiaDiems([
                    { maDiaDiem: 1, tenDiaDiem: "VinWonders Phú Quốc" },
                    { maDiaDiem: 2, tenDiaDiem: "Vườn Thú Safari" },
                    { maDiaDiem: 3, tenDiaDiem: "Chùa Hộ Quốc" },
                    { maDiaDiem: 4, tenDiaDiem: "Bãi Sao" }
                ]);

                if ((isEdit || isViewMode) && id) {
                    setLoading(true);
                    const mockTour = {
                        tenTour: "Tour Du Lịch Phú Quốc 3 Ngày 2 Đêm",
                        maLoaiTour: "LT01",
                        maKhachSan: "KS02",
                        moTa: "Khám phá đảo ngọc Phú Quốc với dịch vụ đẳng cấp...",
                        thoiGianTour: "3 ngày 2 đêm",
                        soLuongToiDa: "25",
                        diemKhoiHanh: "TP. Hồ Chí Minh",
                        trangThai: true,
                        images: [
                            { id: 1, preview: "https://picsum.photos/400/400?random=1", anhChinh: true },
                            { id: 2, preview: "https://picsum.photos/400/400?random=2", anhChinh: false }
                        ],
                        lichTrinhs: [
                            {
                                id: 10,
                                soThuTuNgay: 1,
                                tenLichTrinh: "Chào Phú Quốc - Khám Phá Đông Đảo",
                                buaAn: "Trưa, Tối",
                                hoatDongChinh: "Hàm Ninh, Suối Tranh, Chùa Hộ Quốc",
                                luuY: "Mang theo đồ bơi nhẹ nhàng",
                                trangThai: true,
                                preview: "https://picsum.photos/300/200?random=10",
                                // Mảng chi tiết kịch bản hoạt động con của ngày này
                                chiTietLichTrinhs: [
                                    {
                                        maCTLT: 201,
                                        gioBatDau: "08:00",
                                        gioKetThuc: "11:30",
                                        maDiaDiem: "2",
                                        hoatDong: "Xe đón khách đi tham quan sở thú Safari ngắm động vật hoang dã"
                                    }
                                ]
                            }
                        ],
                        chuyenKhoiHanhs: [
                            { id: 101, maChuyenCode: "PQ-001", tenChuyen: "Chuyến Phú Quốc đầu hè", soLuongCho: 25, gia: [] }
                        ]
                    };

                    setFormData({
                        tenTour: mockTour.tenTour,
                        maLoaiTour: mockTour.maLoaiTour,
                        maKhachSan: mockTour.maKhachSan,
                        moTa: mockTour.moTa,
                        thoiGianTour: mockTour.thoiGianTour,
                        soLuongToiDa: mockTour.soLuongToiDa,
                        diemKhoiHanh: mockTour.diemKhoiHanh,
                        trangThai: mockTour.trangThai,
                    });
                    setImages(mockTour.images);
                    setLichTrinhs(mockTour.lichTrinhs || []);
                    setChuyenKhoiHanhs(mockTour.chuyenKhoiHanhs);
                }
            } catch (error) {
                showToast("Không thể tải dữ liệu. Vui lòng thử lại!", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchMasterData();
    }, [id, mode]);


    const handleOpenAddLichTrinh = () => {
        const nextDay = lichTrinhs.length + 1;
        setCurrentItinerary({
            id: `LT-NEW-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            soThuTuNgay: nextDay,
            tenLichTrinh: "",
            buaAn: "",
            hoatDongChinh: "",
            luuY: "",
            trangThai: true,
            file: null,
            preview: "",
            chiTietLichTrinhs: [] // Khởi tạo mảng chi tiết rỗng
        });
        resetSubRowForm();
        setShowItineraryModal(true);
    };

    const handleOpenEditLichTrinh = (lt) => {
        setCurrentItinerary({
            ...lt,
            chiTietLichTrinhs: lt.chiTietLichTrinhs ? [...lt.chiTietLichTrinhs] : []
        });
        resetSubRowForm();
        setShowItineraryModal(true);
    };

    const resetSubRowForm = () => {
        setNewSubRow({ gioBatDau: "", gioKetThuc: "", maDiaDiem: "", hoatDong: "" });
    };

    // Hàm xử lý thêm 1 bản ghi Chi tiết lịch trình vào danh sách tạm thời trong modal
    const handleAddSubRow = () => {
        if (!newSubRow.gioBatDau || !newSubRow.hoatDong) {
            showToast("Vui lòng điền ít nhất giờ bắt đầu và nội dung hoạt động cụ thể!", "error");
            return;
        }

        const newRecord = {
            maCTLT: `CTLT-NEW-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            gioBatDau: newSubRow.gioBatDau,
            gioKetThuc: newSubRow.gioKetThuc,
            maDiaDiem: newSubRow.maDiaDiem,
            hoatDong: newSubRow.hoatDong
        };

        setCurrentItinerary(prev => ({
            ...prev,
            chiTietLichTrinhs: [...prev.chiTietLichTrinhs, newRecord]
        }));

        resetSubRowForm();
    };

    // Hàm xóa 1 bản ghi Chi tiết lịch trình ra khỏi modal đang sửa
    const handleRemoveSubRow = (subId) => {
        setCurrentItinerary(prev => ({
            ...prev,
            chiTietLichTrinhs: prev.chiTietLichTrinhs.filter(item => item.maCTLT !== subId)
        }));
    };

    const handleSaveItineraryModal = () => {
        if (!currentItinerary.tenLichTrinh?.trim()) {
            showToast("Vui lòng nhập tiêu đề ngày!", "error");
            return;
        }

        setLichTrinhs(prev => {
            const isExist = prev.some(item => item.id === currentItinerary.id);
            if (isExist) {
                return prev.map(item => item.id === currentItinerary.id ? currentItinerary : item);
            } else {
                return [...prev, currentItinerary];
            }
        });

        setShowItineraryModal(false);
        setCurrentItinerary(null);
    };

    const handleRemoveLichTrinh = (targetId) => {
        const target = lichTrinhs.find(item => item.id === targetId);
        if (target?.preview && target.preview.startsWith("blob:")) {
            URL.revokeObjectURL(target.preview);
        }
        const filtered = lichTrinhs.filter(item => item.id !== targetId);
        const reIndexed = filtered.map((item, idx) => ({
            ...item,
            soThuTuNgay: idx + 1
        }));
        setLichTrinhs(reIndexed);
    };

    const handleToggleItineraryStatus = (targetId, currentStatus) => {
        setLichTrinhs(prev => prev.map(item =>
            item.id === targetId ? { ...item, trangThai: !currentStatus } : item
        ));
    };

    const handleModalImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (currentItinerary.preview && currentItinerary.preview.startsWith("blob:")) {
            URL.revokeObjectURL(currentItinerary.preview);
        }
        setCurrentItinerary(prev => ({
            ...prev,
            file: file,
            preview: URL.createObjectURL(file)
        }));
    };

    const handleViewScheduleRow = (row) => {
        showToast(`Đang xem chi tiết chuyến: ${row.tenChuyen || "Chưa đặt tên"}`);
        setShowScheduleModal(true);
    };

    const handleEditScheduleRow = (row) => {
        showToast(`Đang cập nhật chuyến: ${row.tenChuyen || "Chưa đặt tên"}`);
        setShowScheduleModal(true);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        if (images.length + files.length > 10) {
            showToast("Hệ thống chỉ cho phép tải tối đa 10 hình ảnh!", "error");
            return;
        }
        const newImages = files.map((file, idx) => ({
            id: `${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 9)}`,
            file: file,
            preview: URL.createObjectURL(file),
            anhChinh: false
        }));
        setImages((prevImages) => {
            const updated = [...prevImages, ...newImages];
            if (!updated.some(img => img.anhChinh) && updated.length > 0) {
                updated[0].anhChinh = true;
            }
            return updated;
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleRemoveImage = (targetId) => {
        setImages((prevImages) => {
            const targetImage = prevImages.find(img => img.id === targetId);
            if (targetImage && targetImage.preview.startsWith("blob:")) {
                URL.revokeObjectURL(targetImage.preview);
            }
            const filtered = prevImages.filter(img => img.id !== targetId);
            if (targetImage?.anhChinh && filtered.length > 0) {
                filtered[0].anhChinh = true;
            }
            return filtered;
        });
    };

    const handleSetMainImage = (targetId) => {
        setImages((prevImages) =>
            prevImages.map(img => ({
                ...img,
                anhChinh: img.id === targetId
            }))
        );
        showToast("Đã thay đổi ảnh đại diện Tour!");
    };

    const validate = () => {
        const tempErrors = {};
        if (!formData.tenTour?.trim()) tempErrors.tenTour = "Tên tour không được để trống.";
        if (!formData.maLoaiTour) tempErrors.maLoaiTour = "Vui lòng chọn loại danh mục tour.";
        if (images.length === 0) tempErrors.images = "Bạn phải tải lên ít nhất 1 hình ảnh cho Tour này.";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) {
            showToast("Vui lòng kiểm tra lại các trường thông tin bắt buộc!", "error");
            return;
        }

        try {
            setLoading(true);
            const payload = new FormData();
            payload.append("tenTour", formData.tenTour);
            payload.append("maLoaiTour", formData.maLoaiTour);
            payload.append("maKhachSan", formData.maKhachSan || "");
            payload.append("moTa", formData.moTa || "");
            payload.append("thoiGianTour", formData.thoiGianTour || "");
            payload.append("soLuongToiDa", formData.soLuongToiDa || "");
            payload.append("diemKhoiHanh", formData.diemKhoiHanh || "");
            payload.append("trangThai", formData.trangThai);
            payload.append("chuyenKhoiHanhs", JSON.stringify(chuyenKhoiHanhs));

            const imageMetadata = [];
            images.forEach((img) => {
                if (img.file) {
                    payload.append("files", img.file);
                    imageMetadata.push({ id: img.id, isNew: true, anhChinh: img.anhChinh });
                } else {
                    imageMetadata.push({ id: img.id, isNew: false, preview: img.preview, anhChinh: img.anhChinh });
                }
            });
            payload.append("imageMetadata", JSON.stringify(imageMetadata));

            const itineraryCleanMeta = [];
            lichTrinhs.forEach((lt) => {
                if (lt.file) {
                    payload.append(`itinerary_image_day_${lt.soThuTuNgay}`, lt.file);
                    itineraryCleanMeta.push({ ...lt, file: null, hasNewFile: true });
                } else {
                    itineraryCleanMeta.push({ ...lt, hasNewFile: false });
                }
            });
            // Chuỗi JSON này lúc này đã đính kèm toàn bộ mảng `chiTietLichTrinhs` của từng ngày để gửi lên Backend xuôi chèo mát mái
            payload.append("lichTrinhs", JSON.stringify(itineraryCleanMeta));

            showToast(isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!");
            navigate("/tours");
        } catch (error) {
            showToast(error?.message || "Đã xảy ra lỗi.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="bg-white border border-slate-200 rounded-2xl shadow">
                <div className="p-6 flex justify-between items-center border-b border-slate-200 bg-slate-50 rounded-t-2xl">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:bg-slate-200 px-4 py-2 rounded-xl transition">
                        <ArrowLeft size={20} />
                        <span className="font-medium">Quay lại</span>
                    </button>
                    <button onClick={handleSave} disabled={loading} className="text-white font-semibold px-8 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 transition disabled:opacity-70 flex items-center gap-2">
                        {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm Tour"}
                    </button>
                </div>

                <div className="p-8 space-y-10">
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Hình ảnh ({images.length}/10)</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {images.map((img) => (
                                <div
                                    key={img.id}
                                    className="relative w-32 h-32 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden group"
                                >
                                    <img
                                        src={img.preview}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />

                                    {img.anhChinh && (
                                        <span className="absolute top-1 left-1 bg-sky-500 text-white text-[9px] px-1.5 py-0.5 rounded">
                                            Ảnh chính
                                        </span>
                                    )}

                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-all">
                                        {!img.anhChinh && (
                                            <button
                                                onClick={() => handleSetMainImage(img.id)}
                                                className="text-[10px] text-white bg-sky-500 px-2 py-1 rounded"
                                            >
                                               Đặt làm ảnh chính
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleRemoveImage(img.id)}
                                            className="text-[10px] bg-red-500 text-white px-2 py-1 rounded"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {images.length < 10 && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center hover:border-sky-500 hover:text-sky-500 text-slate-400 transition"
                                >
                                    <Camera size={20} />
                                    <span className="text-[10px] mt-1">
                                        Tải ảnh
                                    </span>
                                </button>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                        {errors.images && <p className="text-red-600 text-sm mt-2">{errors.images}</p>}
                    </section>
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-200 pt-8">
                        <InputField label="Tên tour" value={formData.tenTour} onChange={(e) => setFormData(p => ({ ...p, tenTour: getVal(e) }))} error={errors.tenTour} required />
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Loại tour</label>
                            <SelectField
                                value={formData.maLoaiTour}
                                options={loaiTours}
                                valueKey="maLoaiTour"
                                labelKey="tenLoaiTour"
                                onChange={(e) => setFormData(p => ({ ...p, maLoaiTour: getVal(e) }))}
                                error={errors.maLoaiTour}
                                required
                            />
                        </div>
                        <InputField
                            label="Thời gian tour"
                            value={formData.thoiGianTour}
                            onChange={(e) => setFormData(p => ({ ...p, thoiGianTour: getVal(e) }))}
                            placeholder="Ví dụ: 3 ngày 2 đêm"
                            icon={<Clock size={18} />}
                        />
                        <InputField
                            label="Số lượng tối đa"
                            type="number" value={formData.soLuongToiDa}
                            onChange={(e) => setFormData(p => ({ ...p, soLuongToiDa: getVal(e) }))}
                            placeholder="20"
                        />
                        <InputField
                            label="Điểm khởi hành"
                            value={formData.diemKhoiHanh}
                            onChange={(e) => setFormData(p => ({ ...p, diemKhoiHanh: getVal(e) }))}
                            icon={<MapPin size={18} />}
                        />
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Khách sạn</label>
                            <SelectField
                                value={formData.maKhachSan}
                                options={khachSans}
                                valueKey="maKhachSan"
                                labelKey="tenKhachSan"
                                onChange={(e) => setFormData(p => ({ ...p, maKhachSan: getVal(e) }))}
                            />
                        </div>
                    </section>
                    <section className="border-t border-slate-200 pt-8">
                        <InputField
                            label="Mô tả tour"
                            multiline rows={4}
                            value={formData.moTa}
                            onChange={(e) => setFormData(p => ({ ...p, moTa: getVal(e) }))}
                            placeholder="Mô tả chi tiết về tour..." />
                    </section>
                    <section className="border-t border-slate-200 pt-8 space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Kịch bản & Lịch trình chi tiết từng ngày</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Thiết lập tuyến tham quan, chế độ ăn và hoạt động qua cửa sổ Popup.</p>
                            </div>
                            <button type="button" onClick={handleOpenAddLichTrinh} className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs rounded-xl shadow-sm transition">
                                <Plus size={14} /> Thêm Ngày Mới
                            </button>
                        </div>

                        {lichTrinhs.length === 0 ? (
                            <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-sm text-slate-400">
                                Chưa lập lịch trình ngày. Bấm nút "Thêm Ngày Mới" để bắt đầu thiết lập.
                            </div>
                        ) : (
                            <TourItinerariesTable
                                data={lichTrinhs}
                                onEdit={handleOpenEditLichTrinh}
                                onRemove={handleRemoveLichTrinh}
                                onToggleStatus={handleToggleItineraryStatus}
                                loading={loading}
                            />
                        )}
                    </section>
                    <section className="border-t border-slate-200 pt-8 space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Danh sách chuyến đi thuộc Tour</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Hiển thị thông tin nhanh của các chuyến khởi hành đã thiết lập.</p>
                            </div>
                            <button type="button" onClick={() => setShowScheduleModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs rounded-xl shadow-sm transition">
                                <Plus size={18} />
                                Thêm chuyến khởi hành
                            </button>
                        </div>
                        {chuyenKhoiHanhs.length == 0 ? (
                            <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-sm text-slate-400">
                                Chưa tạo chuyến khởi hành. Bấm nút "Thêm chuyến khởi" để bắt đầu thiết lập.
                            </div>
                        ) : (<TourSchedulesTable
                            data={chuyenKhoiHanhs}
                            onView={handleViewScheduleRow}
                            onEdit={handleEditScheduleRow}
                            loading={loading}
                        />)}

                    </section>
                </div>
            </div>
            {showItineraryModal && currentItinerary && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        {/* Header Modal */}
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Cấu hình Lịch trình: Ngày {currentItinerary.soThuTuNgay}</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Thiết lập thông tin chung và kịch bản chi tiết các mốc giờ.</p>
                            </div>
                            <button onClick={() => setShowItineraryModal(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
                            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-6 items-start bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                <div className="w-full aspect-[4/3] md:w-36 md:h-28 rounded-xl border border-slate-200 bg-white relative overflow-hidden flex flex-col items-center justify-center text-slate-400 group mx-auto shadow-sm">
                                    {currentItinerary.preview ? (
                                        <>
                                            <img src={currentItinerary.preview} alt="" className="w-full h-full object-cover" />
                                            <label className="absolute inset-0 bg-black/40 text-white text-[10px] font-medium flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all">Đổi ảnh ngày</label>
                                        </>
                                    ) : (
                                        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full p-2 text-center">
                                            <Camera size={20} className="mb-1 text-slate-400" />
                                            <span className="text-[10px] font-medium leading-tight">Ảnh đại diện ngày</span>
                                        </label>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleModalImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                    <InputField
                                        label="Tiêu đề ngày"
                                        placeholder="VD: Khám phá Safari - Tự do dạo phố cổ"
                                        value={currentItinerary.tenLichTrinh}
                                        onChange={(e) => setCurrentItinerary(p => ({ ...p, tenLichTrinh: getVal(e) }))}
                                        required
                                    />
                                    <InputField
                                        label="Chế độ bữa ăn"
                                        placeholder="VD: Sáng/Trưa/Tối"
                                        icon={<Utensils size={16} />}
                                        value={currentItinerary.buaAn}
                                        onChange={(e) => setCurrentItinerary(p => ({ ...p, buaAn: getVal(e) }))}
                                    />
                                    <div className="sm:col-span-2">
                                        <InputField
                                            label="Tóm tắt hoạt động chính"
                                            placeholder="Hàm Ninh, Suối Tranh, Chùa Hộ Quốc..."
                                            value={currentItinerary.hoatDongChinh}
                                            onChange={(e) => setCurrentItinerary(p => ({ ...p, hoatDongChinh: getVal(e) }))}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                                <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Dòng thời gian & Chi tiết hoạt động kịch bản</h4>
                                </div>

                                <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-col gap-4">
                                    {/* Hàng trên: Thời gian, Địa điểm và Nút hành động */}
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                                        <div className="sm:col-span-3">
                                            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Bắt đầu</label>
                                            <input
                                                type="time"
                                                value={newSubRow.gioBatDau}
                                                onChange={(e) => setNewSubRow(p => ({ ...p, gioBatDau: e.target.value }))}
                                                className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:border-sky-500 focus:outline-none bg-white h-9"
                                            />
                                        </div>
                                        <div className="sm:col-span-3">
                                            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Kết thúc</label>
                                            <input
                                                type="time"
                                                value={newSubRow.gioKetThuc}
                                                onChange={(e) => setNewSubRow(p => ({ ...p, gioKetThuc: e.target.value }))}
                                                className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:border-sky-500 focus:outline-none bg-white h-9"
                                            />
                                        </div>
                                        <div className="sm:col-span-4">
                                            <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Địa điểm ghé thăm</label>
                                            <select
                                                value={newSubRow.maDiaDiem}
                                                onChange={(e) => setNewSubRow(p => ({ ...p, maDiaDiem: e.target.value }))}
                                                className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:border-sky-500 focus:outline-none bg-white h-9"
                                            >
                                                <option value="">-- Chọn địa điểm --</option>
                                                {diaDiems.map(d => (
                                                    <option key={d.maDiaDiem} value={d.maDiaDiem}>{d.tenDiaDiem}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <button
                                                type="button"
                                                onClick={handleAddSubRow}
                                                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs py-2 rounded-lg transition h-9 flex items-center justify-center"
                                            >
                                                Thêm mốc
                                            </button>
                                        </div>
                                    </div>

                                    {/* Hàng dưới: Nội dung chi tiết chiếm trọn chiều ngang */}
                                    <div>
                                        <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Nội dung hoạt động chi tiết</label>
                                        <input
                                            type="text"
                                            placeholder="Ghi chú chi tiết lịch trình di chuyển, tham quan, ăn uống tại điểm này..."
                                            value={newSubRow.hoatDong}
                                            onChange={(e) => setNewSubRow(p => ({ ...p, hoatDong: e.target.value }))}
                                            className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:border-sky-500 focus:outline-none bg-white h-9"
                                        />
                                    </div>
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold sticky top-0">
                                                <th className="py-2.5 px-4 w-40">Khoảng thời gian</th>
                                                <th className="py-2.5 px-4 w-44">Địa điểm</th>
                                                <th className="py-2.5 px-4">Hoạt động cụ thể</th>
                                                <th className="py-2.5 px-4 text-center w-20">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {currentItinerary.chiTietLichTrinhs?.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" className="py-6 text-center text-slate-400 italic">
                                                        Chưa có mốc thời gian chi tiết nào được lập cho ngày này.
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentItinerary.chiTietLichTrinhs.map((sub, sIdx) => {
                                                    const currentLoc = diaDiems.find(d => String(d.maDiaDiem) === String(sub.maDiaDiem));
                                                    return (
                                                        <tr key={sub.maCTLT} className="hover:bg-slate-50/50">
                                                            <td className="py-2.5 px-4 font-medium text-slate-700">
                                                                {sub.gioBatDau} {sub.gioKetThuc ? ` - ${sub.gioKetThuc}` : ""}
                                                            </td>
                                                            <td className="py-2.5 px-4 text-slate-600 font-medium">
                                                                {currentLoc ? currentLoc.tenDiaDiem : <span className="text-slate-400 italic">Không chọn</span>}
                                                            </td>
                                                            <td className="py-2.5 px-4 text-slate-500 leading-relaxed">
                                                                {sub.hoatDong}
                                                            </td>
                                                            <td className="py-2.5 px-4 text-center">
                                                                <button type="button" onClick={() => handleRemoveSubRow(sub.maCTLT)} className="p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50 transition">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <InputField label="Lưu ý quan trọng của ngày (LuuY)" multiline rows={2} placeholder="Các lưu ý đặc biệt về hành lý, sức khỏe..." value={currentItinerary.luuY} onChange={(e) => setCurrentItinerary(p => ({ ...p, luuY: getVal(e) }))} />
                        </div>

                        {/* Footer Modal */}
                        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowItineraryModal(false)} className="px-5 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition">
                                Hủy bỏ
                            </button>
                            <button type="button" onClick={handleSaveItineraryModal} className="px-6 py-2 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition">
                                Xác nhận lưu ngày
                            </button>
                        </div>

                    </div>
                </div>
            )}
            {showScheduleModal && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Cấu hình Lịch trình & Chuyến đi</h2>
                            </div>
                            <button onClick={() => setShowScheduleModal(false)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
                            <TourScheduleSection value={chuyenKhoiHanhs} onChange={setChuyenKhoiHanhs} />
                        </div>
                        <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-5">
                            <button onClick={() => setShowScheduleModal(false)} className="px-8 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition">
                                Hủy
                            </button>
                            <button onClick={() => setShowScheduleModal(false)} className="px-8 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl transition">
                                Lưu chuyến đi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}