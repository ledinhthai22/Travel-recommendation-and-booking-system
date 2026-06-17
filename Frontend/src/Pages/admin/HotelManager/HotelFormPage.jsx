import React, { useState, useRef, useEffect } from 'react';
import {
    Building2, Phone, MapPin, Star, AlignLeft,
    Plus, X, ImagePlus, Edit2, Trash2,
    MoveLeft
} from 'lucide-react';
import InputField from '~/components/UI/Form/InputField';
import Dropdown from '~/components/Common/Dropdown';
import { Link } from 'react-router-dom';
import { toastError, toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
import {
    getAmenitiesApi,
    createAmenityApi,
} from '~/Services/Amenities';

const renderStars = (count) => (
    <div className="flex items-center gap-1">
        {[...Array(count)].map((_, index) => (
            <Star
                key={index}
                size={10}
                className="fill-yellow-400 text-yellow-400"
            />
        ))}
    </div>
);

const STAR_OPTIONS = [
    { value: "5", label: renderStars(5) },
    { value: "4", label: renderStars(4) },
    { value: "3", label: renderStars(3) },
    { value: "2", label: renderStars(2) },
    { value: "1", label: renderStars(1) }
];
const validExtensions = ["image/jpeg", "image/png", "image/webp"];

export default function HotelForm({
    mode = 'add',
    initialData = null,
    onCancel,
    onSave,
    onStatusChange,
    onSetMainImage
}) {
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isAddMode = mode === 'add';
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        tenKhachSan: '', soDienThoai: '', diaChi: '', soSao: '5', moTa: '', trangThai: true
    });
    const [images, setImages] = useState([]);
    const [allAmenities, setAllAmenities] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [selectedAmenityId, setSelectedAmenityId] = useState('');
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [newAmenityName, setNewAmenityName] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadAllAmenities();
    }, []);

    const loadAllAmenities = async () => {
        try {
            const data = await getAmenitiesApi();
            setAllAmenities(data);
        } catch (error) {
            toastError(getErrorMessage(error));
        }
    };

    useEffect(() => {
        if ((isViewMode || isEditMode) && initialData) {
            setFormData({
                tenKhachSan: initialData.tenKhachSan || '',
                soDienThoai: initialData.soDienThoai || '',
                diaChi: initialData.diaChi || '',
                soSao: initialData.soSao?.toString() || '5',
                moTa: initialData.moTa || '',
                trangThai: initialData.trangThai !== undefined ? initialData.trangThai : true,
            });
            if (initialData.hinhAnh) {
                setImages(initialData.hinhAnh.map((img) => ({
                    id: img.maAnhSK, // 
                    previewUrl: `https://localhost:7016${img.duongDanAnh}`,
                    anhChinh: img.anhChinh || false,
                    soThuTu: img.soThuTu || 1,
                    isFromUpdate: true
                })));
            }
            if (initialData.tienNghi) {
                setAmenities(initialData.tienNghi);
            }
        }
    }, [mode, initialData]);

    const handleInputChange = (e) => {
        if (isViewMode) return;
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox' && name === 'trangThai') {

            setFormData(prev => ({ ...prev, trangThai: checked }));


            if (isEditMode && onStatusChange) {
                onStatusChange(checked);
            }
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleImageChange = (e) => {
        if (isViewMode) return;
        const files = Array.from(e.target.files);
        if (images.length + files.length > 8) {
            alert("Chỉ cho phép tối đa 8 hình ảnh!");
            return;
        }
        for (const file of files) {
            if (!validExtensions.includes(file.type)) { alert("Chỉ cho phép JPG, PNG, WEBP"); return; }
            if (file.size > 5 * 1024 * 1024) { alert("Ảnh tối đa 5MB"); return; }
        }
        const newImages = files.map((file, index) => ({
            id: Date.now() + index + Math.random(),
            file,
            previewUrl: URL.createObjectURL(file),
            anhChinh: !images.some(img => img.anhChinh) && index === 0,
            soThuTu: images.length + index + 1,
            isFromUpdate: false
        }));
        setImages(prev => [...prev, ...newImages]);
        e.target.value = null;
    };

    useEffect(() => {
        return () => { images.forEach(img => { if (img.file) URL.revokeObjectURL(img.previewUrl); }); };
    }, [images]);
    const handleSetMainImageClick = (clickedImg) => {
        if (isViewMode) return;

        if (isEditMode && clickedImg.isFromUpdate && onSetMainImage) {
            onSetMainImage(clickedImg.id);
        } else {
            setImages(prev => prev.map(img => ({ ...img, anhChinh: img.id === clickedImg.id })));
        }
    };

    const handleRemoveImage = (id) => {
        setImages(prev => {
            const updated = prev.filter(img => img.id !== id);
            if (updated.length > 0 && !updated.some(img => img.anhChinh)) updated[0].anhChinh = true;
            return updated.map((img, idx) => ({ ...img, soThuTu: idx + 1 }));
        });
    };

    const isDuplicate = (name, excludeId = null) =>
        amenities.some(a =>
            a?.tenTienNghi?.trim().toLowerCase() === name?.trim().toLowerCase()
            && a.maTienNghi !== excludeId
        );

    const addAmenityFromDropdown = () => {
        if (!selectedAmenityId || isViewMode) return;
        const amenity = allAmenities.find(a => a.maTienNghi === Number(selectedAmenityId));
        if (!amenity || isDuplicate(amenity.tenTienNghi)) {
            toastError('Tiện nghi này đã được thêm!');
            return;
        }
        setAmenities(prev => [...prev, amenity]);
        setSelectedAmenityId('');
        toastSuccess('Đã thêm tiện ích!');
    };

    const openAddPopup = () => {
        setNewAmenityName('');
        setShowAddPopup(true);
    };

    const addNewAmenity = async () => {
        const value = newAmenityName.trim();
        if (!value) return;
        if (isDuplicate(value)) {
            toastError('Tiện nghi này đã tồn tại!');
            return;
        }
        try {
            const created = await createAmenityApi({ tenTienNghi: value });
            const newAmenity = {
                maTienNghi: created.maTienNghi,
                tenTienNghi: created.tenTienNghi || value
            };
            setAmenities(prev => [...prev, newAmenity]);
            setAllAmenities(prev => [...prev, newAmenity]);
            setShowAddPopup(false);
            setNewAmenityName('');
            toastSuccess('Đã thêm và lựa chọn tiện nghi mới!');
        } catch (error) {
            toastError(getErrorMessage(error));
        }
    };

    const removeAmenity = (maTienNghi) => {
        if (isViewMode) return;
        setAmenities(prev => prev.filter(a => a.maTienNghi !== maTienNghi));
        toastSuccess('Đã bỏ chọn tiện ích!');
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.tenKhachSan.trim()) {
            newErrors.tenKhachSan = 'Vui lòng nhập tên khách sạn.';
        }
        const phoneTrimmed = formData.soDienThoai.trim();

        const vnf_regex = /^(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})$/;

        if (!phoneTrimmed) {
            newErrors.soDienThoai = 'Vui lòng nhập số điện thoại.';
        } else if (!vnf_regex.test(phoneTrimmed)) {
            newErrors.soDienThoai = 'Số điện thoại không hợp lệ (Phải gồm 10 số và bắt đầu bằng số 0).';
        }


        if (!formData.diaChi.trim()) {
            newErrors.diaChi = 'Vui lòng nhập địa chỉ.';
        }


        if (images.length === 0) {
            newErrors.images = 'Vui lòng thêm ít nhất 1 hình ảnh.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isViewMode || !validate()) return;
        const payload = {
            ...formData,
            soSao: parseInt(formData.soSao),
            maTienNghi: amenities.map(x => x.maTienNghi),
            images,
            ngayCapNhat: new Date().toISOString(),
        };
        if (isAddMode) {
            payload.ngayTao = new Date().toISOString();
            payload.ngayXoa = null;
        }
        if (onSave) onSave(payload);
    };

    return (
        <div>
            <div className="bg-white border border-slate-200 rounded-2xl shadow overflow-visible p-2 sm:p-6 lg:p-8 space-y-8">
                <div className="flex items-center justify-between mb-2">
                    <Link
                        to="/Quan-ly/Khach-san"
                        onClick={onCancel}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all"
                    >
                        <MoveLeft size={12} />
                        Quay trở lại
                    </Link>
                    {!isViewMode && (
                        <button
                            onClick={handleSubmit}
                            className="px-5 py-2 rounded-xl text-[12px] font-medium text-white bg-[#0EA5E5] hover:bg-[#0284c7] transition-all"
                        >
                            {isAddMode ? "Thêm Khách Sạn" : "Cập Nhật"}
                        </button>
                    )}
                </div>
                <section>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4">
                        Hình ảnh ({images.length}/8)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-2">
                        {images.map((img) => (
                            <div key={img.id} className="relative aspect-square rounded-2xl border-slate-200 bg-slate-50 p-2 group overflow-hidden">
                                <img src={img.previewUrl} className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105" />
                                {img.anhChinh && (
                                    <span className="absolute top-2 left-2 bg-[#0EA5E5] text-white text-[10px] px-2 py-0.5 rounded font-medium">
                                        Ảnh chính
                                    </span>
                                )}
                                {!isViewMode && (
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2">
                                        {!img.anhChinh && (
                                            <button
                                                onClick={() => handleSetMainImageClick(img)}
                                                className="text-xs bg-white/20 hover:bg-white/40 text-white px-4 py-1.5 rounded-xl"
                                            >
                                                Đặt làm chính
                                            </button>
                                        )}
                                        <button onClick={() => handleRemoveImage(img.id)} className="text-xs bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-xl">
                                            Xóa
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {!isViewMode && images.length < 8 && (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center hover:border-[#0EA5E5] hover:text-[#0EA5E5] transition-all active:scale-95 aspect-square"
                            >
                                <ImagePlus size={18} className="mb-1" />
                                <span className="text-xs font-medium">Tải ảnh lên</span>
                            </button>
                        )}
                    </div>
                    <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                    {errors.images && <p className="text-red-600 text-sm mt-3">{errors.images}</p>}
                </section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                    <InputField
                        label="Tên khách sạn"
                        name="tenKhachSan"
                        placeholder="Ví dụ:The Song"
                        required
                        disabled={isViewMode}
                        value={formData.tenKhachSan}
                        onChange={handleInputChange}
                        error={errors.tenKhachSan}
                        Icon={Building2} />
                    <InputField
                        label="Số điện thoại"
                        name="soDienThoai"
                        placeholder="Ví dụ:0987654321"
                        required
                        disabled={isViewMode}
                        value={formData.soDienThoai}
                        onChange={handleInputChange}
                        error={errors.soDienThoai}
                        Icon={Phone} />
                    <InputField
                        label="Địa chỉ chi tiết"
                        name="diaChi"
                        placeholder="Ví dụ: 21/6 Dương Đình Hội...."
                        required
                        disabled={isViewMode}
                        value={formData.diaChi}
                        onChange={handleInputChange}
                        error={errors.diaChi}
                        Icon={MapPin} />
                    <Dropdown
                        label="Hạng sao"
                        value={formData.soSao}
                        options={STAR_OPTIONS}
                        onChange={(v) => setFormData(p => ({ ...p, soSao: v }))}
                        disabled={isViewMode}
                        fullWidth />
                </div>

                <InputField
                    label="Mô tả tổng quan"
                    name="moTa"
                    placeholder="Gần biển có hồ bơi"
                    multiline
                    rows={5}
                    disabled={isViewMode}
                    value={formData.moTa}
                    onChange={handleInputChange}
                    Icon={AlignLeft} />

                {!isAddMode && (
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <p className="font-semibold text-slate-700">
                            Trạng thái {formData.trangThai ? "hoạt động" : "ngưng hợp tác"}
                        </p>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="trangThai"
                                checked={formData.trangThai}
                                onChange={handleInputChange}
                                disabled={isViewMode}
                                className="sr-only peer" />
                            <div className="
                                w-11
                                h-6
                              bg-slate-200 
                                rounded-full peer
                              peer-checked:bg-[#0EA5E5]
                                peer-checked:after:translate-x-full
                                after:content-[''] 
                                after:absolute after:top-0.5 
                                after:left-0.5
                              after:bg-white
                                 after:rounded-full 
                                 after:h-5 
                                 after:w-5 
                                 after:transition-all" />
                        </label>
                    </div>
                )}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Tiện ích ({amenities.length})
                        </p>
                    </div>

                    {!isViewMode && (
                        <div className="flex gap-3 mb-5">
                            <div className="flex-1">
                                <Dropdown
                                    value={selectedAmenityId}
                                    options={allAmenities
                                        .filter(a => !amenities.some(selected => selected.maTienNghi === a.maTienNghi))
                                        .map(a => ({ value: a.maTienNghi.toString(), label: a.tenTienNghi }))}
                                    onChange={setSelectedAmenityId}
                                    fullWidth
                                    placeholder="Chọn tiện ích có sẵn..."
                                />
                            </div>
                            <button
                                onClick={addAmenityFromDropdown}
                                disabled={!selectedAmenityId}
                                className="
                                self-end 
                                px-5 
                                py-2.5
                                 bg-[#0EA5E5]
                                  hover:bg-[#0284c7]
                                   text-white 
                                   rounded-xl 
                                   font-medium 
                                   disabled:opacity-50
                                    transition-all"
                            >
                                Thêm
                            </button>
                            <button
                                onClick={openAddPopup}
                                className="
                                self-end 
                                px-5 
                                py-2.5 
                                border
                                border-slate-300 
                                hover:border-[#0EA5E5] 
                                hover:text-[#0EA5E5] 
                                rounded-xl
                                font-medium 
                                flex 
                                items-center 
                                gap-2 
                                transition-all"
                            >
                                <Plus size={16} /> Tạo mới
                            </button>
                        </div>
                    )}

                    <div className="p-4 border border-slate-200 rounded-2xl min-h-[64px] flex flex-wrap gap-2 items-center bg-slate-50/50">
                        {amenities.length > 0 ? (
                            amenities.map((amenity) => (
                                <div
                                    key={amenity.maTienNghi}
                                    className="
                                    group 
                                    relative
                                    flex
                                    items-center
                                    bg-white
                                    border
                                    border-slate-200
                                    rounded-xl 
                                    text-sm
                                    font-medium
                                    text-slate-700 
                                    shadow-sm
                                    transition-all 
                                    duration-200
                                    hover:border-red-200
                                    hover:bg-red-50/30
                                    pl-4
                                    pr-4 
                                    group-hover:pr-8
                                    "
                                    style={{ paddingRight: !isViewMode ? '2rem' : '1rem' }}
                                >
                                    <span className="py-2 select-none">{amenity.tenTienNghi}</span>

                                    {!isViewMode && (
                                        <button
                                            type="button"
                                            onClick={() => removeAmenity(amenity.maTienNghi)}
                                            className="
                                            absolute 
                                            right-1.5 
                                            opacity-0 
                                            group-hover:opacity-100 
                                            p-1 
                                            text-slate-400
                                            hover:text-red-500 
                                            rounded-lg
                                            hover:bg-white
                                            border 
                                            border-transparent
                                            hover:border-red-100 
                                            shadow-none
                                            hover:shadow-sm  
                                            transition-all 
                                            duration-200
                                            "
                                            title="Xóa khỏi danh sách"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-400 w-full text-center py-2">
                                Chưa có tiện ích nào được chọn
                            </p>
                        )}
                    </div>
                </section>
            </div>

            {showAddPopup && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-4">Thêm tiện ích mới</h3>
                        <InputField
                            type="text"
                            value={newAmenityName}
                            onChange={(e) => setNewAmenityName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addNewAmenity()}
                            placeholder="Ví dụ: WiFi tốc độ cao"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-[#0EA5E5] focus:outline-none mb-4"
                        />
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={addNewAmenity}
                                disabled={!newAmenityName.trim()}
                                className="px-4 py-2 rounded-lg text-white font-medium text-sm transition-colors bg-[#0EA5E5]  hover:bg-[#0284c7] disabled:opacity-50 "
                            >
                                Thêm
                            </button>
                            <button
                                onClick={() => setShowAddPopup(false)}
                                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-slate-700 font-medium text-sm transition-colors"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}