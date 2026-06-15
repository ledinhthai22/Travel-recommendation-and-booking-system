import React, { useState, useRef, useEffect } from 'react';
import {
    Building2, Phone, MapPin, Star, AlignLeft,
    Plus, X, ImagePlus
} from 'lucide-react';
import InputField from '~/components/UI/Form/InputField';
import Dropdown from '~/components/Common/Dropdown';

const SUGGESTED_AMENITIES = [
    "WiFi miễn phí",
    "Hồ bơi",
    "Spa",
    "Phòng Gym",
    "Nhà hàng",
    "Bãi biển riêng",
    "Quầy bar",
    "Lễ tân 24h"
];

const STAR_OPTIONS = [
    { value: '5', label: '5 Sao (Premium Resort)' },
    { value: '4', label: '4 Sao (Luxury Hotel)' },
    { value: '3', label: '3 Sao (Standard Boutique)' },
    { value: '2', label: '2 Sao (Budget Hotel)' },
    { value: '1', label: '1 Sao (Homestay / Motel)' },
];

export default function HotelForm({ mode = 'add', initialData = null, onCancel, onSave }) {
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isAddMode = mode === 'add';

    const fileInputRef = useRef(null);
    const amenitySuggestRef = useRef(null);

    const [formData, setFormData] = useState({
        tenKhachSan: '',
        soDienThoai: '',
        diaChi: '',
        soSao: '5',
        moTa: '',
        trangThai: true
    });

    const [images, setImages] = useState([]);
    const [amenityInput, setAmenityInput] = useState('');
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if ((isViewMode || isEditMode) && initialData) {
            setFormData({
                tenKhachSan: initialData.tenKhachSan || '',
                soDienThoai: initialData.soDienThoai || '',
                diaChi: initialData.diaChi || '',
                soSao: initialData.soSao?.toString() || '5',
                moTa: initialData.moTa || '',
                trangThai: initialData.trangThai !== undefined ? initialData.trangThai : true
            });
            if (initialData.hinhAnh) {
                setImages(initialData.hinhAnh.map((img, idx) => ({
                    id: img.maAnhSK || idx,
                    previewUrl: img.duongDanAnh,
                    anhChinh: img.anhChinh || false,
                    soThuTu: img.soThuTu || (idx + 1)
                })));
            }
            if (initialData.tienNghi) {
                setSelectedAmenities(initialData.tienNghi);
            }
        }
    }, [mode, initialData]);

    /* Đóng dropdown gợi ý khi click ra ngoài */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (amenitySuggestRef.current && !amenitySuggestRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        if (isViewMode) return;
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleImageChange = (e) => {
        if (isViewMode) return;
        const files = Array.from(e.target.files);
        if (images.length + files.length > 8) {
            alert("Hệ thống chỉ cho phép tối đa 8 hình ảnh cho một khách sạn!");
            return;
        }
        const newImages = files.map((file, index) => {
            const hasMainImage = images.some(img => img.anhChinh);
            return {
                id: Date.now() + index + Math.random(),
                file,
                previewUrl: URL.createObjectURL(file),
                anhChinh: !hasMainImage && index === 0,
                soThuTu: images.length + index + 1
            };
        });
        setImages(prev => [...prev, ...newImages]);
        e.target.value = null;
    };

    const handleSetMainImage = (id) => {
        if (isViewMode) return;
        setImages(prev => prev.map(img => ({ ...img, anhChinh: img.id === id })));
    };

    const handleRemoveImage = (id) => {
        if (isViewMode) return;
        setImages(prev => {
            const updated = prev.filter(img => img.id !== id);
            if (updated.length > 0 && !updated.some(img => img.anhChinh)) {
                updated[0].anhChinh = true;
            }
            return updated.map((img, index) => ({ ...img, soThuTu: index + 1 }));
        });
    };

    const handleAddAmenity = () => {
        if (isViewMode) return;
        const value = amenityInput.trim();
        if (!value) return;
        if (selectedAmenities.includes(value)) {
            alert("Tiện ích này đã tồn tại trong danh sách!");
            return;
        }
        setSelectedAmenities(prev => [...prev, value]);
        setAmenityInput('');
        setShowSuggestions(false);
    };

    const handleRemoveAmenity = (indexToRemove) => {
        if (isViewMode) return;
        setSelectedAmenities(prev => prev.filter((_, i) => i !== indexToRemove));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.tenKhachSan.trim()) newErrors.tenKhachSan = 'Vui lòng nhập tên khách sạn.';
        if (!formData.soDienThoai.trim()) newErrors.soDienThoai = 'Vui lòng nhập số điện thoại.';
        if (!formData.diaChi.trim()) newErrors.diaChi = 'Vui lòng nhập địa chỉ.';
        if (images.length === 0) newErrors.images = 'Vui lòng thêm ít nhất 1 hình ảnh.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isViewMode) return;
        if (!validate()) return;

        const payload = {
            ...formData,
            soSao: parseInt(formData.soSao),
            hinhAnh: images.map(img => ({
                duongDanAnh: img.previewUrl,
                anhChinh: img.anhChinh,
                soThuTu: img.soThuTu
            })),
            tienNghi: selectedAmenities,
            ngayCapNhat: new Date().toISOString()
        };
        if (isAddMode) {
            payload.ngayTao = new Date().toISOString();
            payload.ngayXoa = null;
        }
        console.log("Payload CRUD:", payload);
        if (onSave) onSave(payload);
    };

    const filteredSuggestions = SUGGESTED_AMENITIES.filter(
        item => item.toLowerCase().includes(amenityInput.toLowerCase())
    );

    return (
        <div className=" p-2 ">
            <div className=" bg-white border border-slate-200 p-4 mb-4 rounded-xl shadow">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                            {isAddMode && "Thêm Đối Tác Khách Sạn Mới"}
                            {isEditMode && "Cập Nhật Thông Tin Khách Sạn"}
                            {isViewMode && "Chi Tiết Thông Tin Khách Sạn"}
                        </h1>

                        <p className="mt-1 text-sm text-slate-400">
                            Quản lý thông tin khách sạn và dịch vụ lưu trú trong hệ thống.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="
                                py-[10px]
                                px-6
                                rounded-[8px]
                                text-sm
                                font-medium
                                text-slate-600
                                bg-slate-100
                                hover:bg-slate-200
                                transition-all
                            "
                        >
                            {isViewMode ? "Đóng / Quay lại" : "Hủy thao tác"}
                        </button>

                        {!isViewMode && (
                            <button
                                type="submit"
                                className="
                                    py-[10px]
                                    px-6
                                    rounded-[8px]
                                    text-sm
                                    font-medium
                                    text-white
                                    bg-[#0EA5E5]
                                    hover:bg-[#0284c7]
                                    transition-all
                                "
                            >
                                {isAddMode
                                    ? "Thêm Khách Sạn"
                                    : "Cập Nhật Dữ Liệu"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit} noValidate className="space-y-8  bg-white border border-slate-200 p-4 rounded-2xl shadow ">
                <section className="space-y-3">


                    <div className="flex flex-wrap gap-3 items-start">
                        {images.map((img) => (
                            <div
                                key={img.id}
                                className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] border border-slate-200 rounded-2xl overflow-hidden group bg-slate-50 flex-shrink-0"
                            >
                                <img
                                    src={img.previewUrl}
                                    alt="Thumbnail"
                                    className="w-full h-full object-cover"
                                />
                                {img.anhChinh && (
                                    <span className="absolute top-1.5 left-1.5 bg-[#0EA5E5] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow">
                                        Ảnh chính
                                    </span>
                                )}
                                {!isViewMode && (
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                                        {!img.anhChinh && (
                                            <button
                                                type="button"
                                                onClick={() => handleSetMainImage(img.id)}
                                                className="text-[10px] text-white bg-white/20 hover:bg-white/40 px-2.5 py-1 rounded-lg transition-all"
                                            >
                                                Đặt chính
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(img.id)}
                                            className="text-[10px] text-white bg-red-500 hover:bg-red-600 px-2.5 py-1 rounded-lg transition-all"
                                        >
                                            Xóa hình
                                        </button>
                                    </div>
                                )}
                            </div>

                        ))}

                        {!isViewMode && images.length < 8 && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className={`
                                    w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]
                                    border-2  rounded-2xl flex-shrink-0
                                    flex flex-col items-center justify-center gap-1
                                    text-slate-400 transition-all
                                    ${errors.images
                                        ? 'border-red-400 bg-red-50 text-red-400'
                                        : 'border-slate-300 bg-slate-50 hover:border-[#0EA5E5] hover:text-[#0EA5E5]'
                                    }
                                `}
                            >
                                <ImagePlus size={22} />
                                <span className="text-[10px] font-medium">Tải ảnh lên</span>
                            </button>
                        )}
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            <span className="ml-1.5 text-slate-400 font-normal normal-case">
                                ({images.length}/8)
                            </span>
                        </p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </div>

                    {errors.images && (
                        <p className="text-xs font-medium text-red-600">{errors.images}</p>
                    )}
                </section>

                {/* ── KHU VỰC 2: THÔNG TIN CƠ BẢN ── */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-2">
                    <InputField
                        label="Tên khách sạn"
                        name="tenKhachSan"
                        required
                        disabled={isViewMode}
                        value={formData.tenKhachSan}
                        onChange={handleInputChange}
                        placeholder="Nhập tên thương mại khách sạn..."
                        error={errors.tenKhachSan}
                        Icon={Building2}
                    />

                    <InputField
                        label="Số điện thoại liên hệ"
                        name="soDienThoai"
                        required
                        disabled={isViewMode}
                        value={formData.soDienThoai}
                        onChange={handleInputChange}
                        placeholder="Nhập hotline đặt phòng..."
                        error={errors.soDienThoai}
                        Icon={Phone}
                    />

                    <InputField
                        label="Địa chỉ chi tiết"
                        name="diaChi"
                        required
                        disabled={isViewMode}
                        value={formData.diaChi}
                        onChange={handleInputChange}
                        placeholder="Số nhà, tên đường, khu vực..."
                        error={errors.diaChi}
                        Icon={MapPin}
                    />

                    <Dropdown
                        label="Tiêu chuẩn hạng sao"
                        value={formData.soSao}
                        options={STAR_OPTIONS}
                        onChange={(val) => {
                            if (isViewMode) return;
                            setFormData(prev => ({ ...prev, soSao: val }));
                        }}
                        placeholder="Chọn hạng sao..."
                        fullWidth
                    />
                </section>
                <section className="mb-0.5 ">
                    <InputField
                        label="Giới thiệu tổng quan"
                        name="moTa"
                        multiline
                        rows={3}
                        disabled={isViewMode}
                        value={formData.moTa}
                        onChange={handleInputChange}
                        placeholder="Mô tả dịch vụ phòng ốc, vị trí địa lý, view cảnh quan..."
                        Icon={AlignLeft}
                    />
                </section>


                {!isAddMode && (
                    <section className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-2">
                        <div>
                            <p className="text-sm font-semibold text-slate-700">Trạng thái quan hệ đối tác</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Nếu ngưng hợp tác, khách sạn sẽ ẩn khỏi các lượt tạo Tour mới.
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer select-none flex-shrink-0">
                            <input
                                type="checkbox"
                                name="trangThai"
                                disabled={isViewMode}
                                checked={formData.trangThai}
                                onChange={handleInputChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0EA5E5]" />
                        </label>
                    </section>
                )}

                <section className="space-y-2" ref={amenitySuggestRef}>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Danh mục tiện ích khách sạn
                    </p>

                    {!isViewMode && (
                        <div className="flex gap-2 items-start">
                            <div className="flex-1 relative">
                                <InputField
                                    name="amenityInput"
                                    value={amenityInput}
                                    onChange={(e) => {
                                        setAmenityInput(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddAmenity();
                                        }
                                    }}
                                    placeholder="Chọn từ danh sách hoặc tự nhập tiện ích mới..."
                                />

                                {showSuggestions && (
                                    <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-lg z-20 max-h-44 overflow-y-auto text-sm text-slate-700">
                                        {filteredSuggestions.length > 0 ? (
                                            filteredSuggestions.map((item) => (
                                                <div
                                                    key={item}
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        setAmenityInput(item);
                                                        setShowSuggestions(false);
                                                    }}
                                                    className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                                                >
                                                    {item}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-xs text-slate-400 text-center">
                                                Không tìm thấy gợi ý — nhấn nút + để thêm mới
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleAddAmenity}
                                className="
                                    w-12 h-12
                                    flex-shrink-0
                                    rounded-xl
                                    border border-slate-200
                                    bg-white
                                    flex items-center justify-center
                                    text-slate-500
                                    shadow-sm
                                    hover:bg-slate-50
                                    hover:border-slate-300
                                    hover:text-[#0EA5E5]
                                    active:scale-95
                                    transition-all
                                "
                                title="Thêm tiện ích"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    )}

                    {selectedAmenities.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {selectedAmenities.map((amenity, index) => (
                                <span
                                    key={index}
                                    className="
                                        inline-flex items-center gap-1.5
                                        px-3 py-1.5
                                        rounded-xl
                                        bg-sky-50
                                        border border-sky-100
                                        text-[#0EA5E5]
                                        text-xs
                                        font-semibold
                                    "
                                >
                                    {amenity}

                                    {!isViewMode && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveAmenity(index)}
                                            className="
                                text-sky-400
                                hover:text-red-500
                                transition-colors
                            "
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 italic">
                            Chưa có tiện ích nào được thêm.
                        </p>
                    )}
                </section>



            </form>
        </div>
    );
}