import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
    Building2, Phone, MapPin, Star, AlignLeft,
    ImagePlus, ArrowLeft, X
} from 'lucide-react';
import { Plus } from "lucide-react";
import InputField from '~/components/UI/Form/InputField';
import Dropdown from '~/components/Common/Dropdown';
import { Link } from 'react-router-dom';

import { toastError, toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';

import {
    getAmenitiesApi,
    getAmenitiesPageApi,
} from '~/Services/Amenities';

import CreateAmenityModal from "~/Pages/admin/AmenitiesManager/AddAmenityModal";
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';

const renderStars = (count) => (
    <div className="flex items-center gap-1">
        {[...Array(count)].map((_, index) => (
            <Star key={index} size={10} className="fill-yellow-400 text-yellow-400" />
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
    const [showCreateAmenityModal, setShowCreateAmenityModal] = useState(false);
    const fileInputRef = useRef(null);
    const [reloadAmenities, setReloadAmenities] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({});

    const [formData, setFormData] = useState({
        tenKhachSan: '',
        soDienThoai: '',
        diaChi: '',
        soSao: '',
        moTa: '',
        trangThai: true
    });

    const [images, setImages] = useState([]);
    const [amenitiesSelected, setAmenitiesSelected] = useState([]);
    const [errors, setErrors] = useState({});

    const [allAmenities, setAllAmenities] = useState([]);
    const [selectedAmenityId, setSelectedAmenityId] = useState('');
    const loadAllAmenities = useCallback(async () => {
        try {
            const data = await getAmenitiesApi();
            setAllAmenities(data);
        } catch (error) {
            toastError("Lỗi tải danh sách tiện nghi", getErrorMessage(error));
        }
    }, []);

    useEffect(() => {
        loadAllAmenities();
    }, [loadAllAmenities, reloadAmenities]);

    useEffect(() => {
        if ((isViewMode || isEditMode) && initialData) {
            setFormData({
                tenKhachSan: initialData.tenKhachSan || '',
                soDienThoai: initialData.soDienThoai || '',
                diaChi: initialData.diaChi || '',
                soSao: initialData.soSao?.toString() || '',
                moTa: initialData.moTa || '',
                trangThai: initialData.trangThai !== undefined ? initialData.trangThai : true,
            });

            if (initialData.hinhAnh) {
                setImages(initialData.hinhAnh.map(img => ({
                    id: img.maAnhSK,
                    previewUrl: `https://localhost:7016${img.duongDanAnh}`,
                    anhChinh: img.anhChinh || false,
                    soThuTu: img.soThuTu || 1,
                    isFromUpdate: true
                })));
            }

            if (initialData.tienNghi) {
                setAmenitiesSelected(initialData.tienNghi);
            }
        }
    }, [mode, initialData]);



    const handleInputChange = (e) => {
        if (isViewMode) return;
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox' && name === 'trangThai') {
            setFormData(prev => ({ ...prev, trangThai: checked }));
            if (isEditMode && onStatusChange) onStatusChange(checked);
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleImageChange = (e) => {
        if (isViewMode) return;
        const files = Array.from(e.target.files);

        if (images.length + files.length > 8) {
            toastError("Chỉ cho phép tối đa 8 hình ảnh!");
            return;
        }

        for (const file of files) {
            if (!validExtensions.includes(file.type)) {
                toastError("Chỉ cho phép JPG, PNG, WEBP");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toastError("Ảnh tối đa 5MB");
                return;
            }
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

    const handleSetMainImage = (clickedImg) => {
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
            if (updated.length > 0 && !updated.some(img => img.anhChinh)) {
                updated[0].anhChinh = true;
            }
            return updated.map((img, idx) => ({ ...img, soThuTu: idx + 1 }));
        });
    };

    const addAmenityFromDropdown = () => {
        if (!selectedAmenityId) return;
        const amenity = allAmenities.find(a => a.maTienNghi === Number(selectedAmenityId));
        if (!amenity) return;

        if (amenitiesSelected.some(a => a.maTienNghi === amenity.maTienNghi)) {
            toastError("Tiện nghi này đã được thêm!");
            return;
        }

        setAmenitiesSelected(prev => [...prev, amenity]);
        setSelectedAmenityId('');
        toastSuccess("Đã thêm tiện ích!");
    };

    const removeAmenity = (maTienNghi) => {
        setAmenitiesSelected(prev => prev.filter(a => a.maTienNghi !== maTienNghi));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.tenKhachSan.trim()) newErrors.tenKhachSan = 'Vui lòng nhập tên khách sạn.';
        if (!formData.moTa.trim()) newErrors.moTa = "Vui lòng nhập mô tả";
        if (!formData.soDienThoai.trim()) newErrors.soDienThoai = 'Vui lòng nhập số điện thoại.';
        if (!/^(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})$/.test(formData.soDienThoai.trim())) {
            newErrors.soDienThoai = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0).';
        }
        if (!formData.diaChi.trim()) newErrors.diaChi = 'Vui lòng nhập địa chỉ.';
        if (images.length === 0) newErrors.images = 'Vui lòng thêm ít nhất 1 hình ảnh.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const executeSubmit = async () => {
        try {
            setLoading(true);
            const payload = {
                ...formData,
                soSao: parseInt(formData.soSao),
                maTienNghi: amenitiesSelected.map(x => x.maTienNghi),
                images,
            };
            await onSave?.(payload);
        } catch (error) {
            toastError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isViewMode || !validate()) return;
        executeSubmit();
    };

    return (
        <div >
            <div className="bg-white border border-slate-200 rounded-2xl shadow">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 justify-between items-center border-b border-slate-200 bg-slate-50 rounded-t-2xl">
                    <Link
                        to="/Quan-ly/Khach-san"
                        onClick={onCancel}
                        className="flex items-center gap-2 py-3 px-6 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200 transition-all"
                    >
                        <ArrowLeft size={18} /> Quay trở lại
                    </Link>

                    {!isViewMode && (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 sm:flex-none py-3 px-8 rounded-xl text-sm font-medium text-white bg-[#0EA5E5] hover:bg-[#0284c7] transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            {isAddMode ? "Lưu Khách Sạn Mới" : "Cập Nhật Khách Sạn"}
                        </button>
                    )}
                </div>

                <div className="p-6 lg:p-8 space-y-10">

                    <section>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4">
                            Hình ảnh ({images.length}/8)
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4">
                            {images.map((img) => (
                                <div key={img.id} className="relative aspect-square rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden group">
                                    <img
                                        src={img.previewUrl}
                                        className="w-full h-full object-cover"
                                        alt="preview"
                                    />
                                    {img.anhChinh && (
                                        <span className="absolute top-2 left-2 bg-[#0EA5E5] text-white text-[10px] px-2 py-0.5 rounded font-medium">Ảnh chính</span>
                                    )}
                                    {!isViewMode && (
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all">
                                            {!img.anhChinh && (
                                                <button
                                                    onClick={() => handleSetMainImage(img)}
                                                    className="text-xs bg-white/90 hover:bg-white text-slate-800 px-4 py-1.5 rounded-xl"
                                                >
                                                    Đặt làm chính
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleRemoveImage(img.id)}
                                                className="text-xs bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-xl"
                                            >
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
                                    className="aspect-square border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center hover:border-[#0EA5E5] hover:text-[#0EA5E5] text-slate-400 transition-colors"
                                >
                                    <ImagePlus size={32} className="mb-2" />
                                    <span className="text-xs font-medium">Tải ảnh lên</span>
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

                        {errors.images && (
                            <p className="text-red-600 text-sm mt-2">{errors.images}</p>
                        )}
                    </section>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            label="Tên khách sạn"
                            name="tenKhachSan"
                            required
                            disabled={isViewMode}
                            value={formData.tenKhachSan}
                            onChange={handleInputChange}
                            error={errors.tenKhachSan}
                            Icon={Building2}
                        />
                        <InputField
                            label="Số điện thoại"
                            name="soDienThoai"
                            required
                            disabled={isViewMode}
                            value={formData.soDienThoai}
                            onChange={handleInputChange}
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
                            error={errors.diaChi}
                            Icon={MapPin}
                        />
                        <Dropdown
                            label="Hạng sao"
                            value={formData.soSao}
                            options={STAR_OPTIONS}
                            onChange={v => setFormData(p => ({ ...p, soSao: v }))}
                            disabled={isViewMode}
                            fullWidth
                        />
                    </div>

                    <InputField
                        label="Mô tả tổng quan"
                        name="moTa"
                        multiline
                        rows={5}
                        disabled={isViewMode}
                        value={formData.moTa}
                        onChange={handleInputChange}
                        Icon={AlignLeft}
                    />

                    {/* Amenities Section */}
                    <section>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4">
                            Tiện ích ({amenitiesSelected.length})
                        </p>

                        {!isViewMode && (
                            <div className="flex gap-3 mb-6">
                                <div className="flex-1">
                                    <Dropdown
                                        value={selectedAmenityId}
                                        options={allAmenities
                                            .filter(
                                                a =>
                                                    !amenitiesSelected.some(
                                                        selected =>
                                                            selected.maTienNghi === a.maTienNghi
                                                    )
                                            )
                                            .map(a => ({
                                                value: a.maTienNghi.toString(),
                                                label: a.tenTienNghi
                                            }))}
                                        onChange={setSelectedAmenityId}
                                        placeholder="Chọn tiện ích..."
                                        fullWidth
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={addAmenityFromDropdown}
                                    disabled={!selectedAmenityId}
                                    className="px-6 py-3 bg-[#0EA5E5] hover:bg-[#0284c7] text-white rounded-xl font-medium disabled:opacity-50"
                                >
                                    Thêm
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowCreateAmenityModal(true)}
                                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium flex items-center gap-2 shadow-sm transition-all"
                                >
                                    <Plus size={16} strokeWidth={2.5} />
                                    Thêm tiện ích
                                </button>
                            </div>
                        )}

                        <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50">
                            {amenitiesSelected.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {amenitiesSelected.map((amenity) => (
                                        <div
                                            key={amenity.maTienNghi}
                                            className="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-700 hover:border-sky-300 hover:shadow-md transition-all"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                                            <span>{amenity.tenTienNghi}</span>
                                            {!isViewMode && (
                                                <button
                                                    onClick={() => removeAmenity(amenity.maTienNghi)}
                                                    className="ml-1 w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-100 hover:text-red-500 transition-all"
                                                >
                                                    <X size={10} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-20">
                                    <p className="text-sm text-slate-400 italic">Chưa có tiện nghi nào được chọn</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Status */}
                    {!isAddMode && (
                        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex justify-between items-center">
                            <p className="font-semibold text-slate-700">Trạng thái hoạt động</p>
                            {isViewMode ? (
                                <div className={`px-4 py-2 rounded-full font-bold text-sm ${formData.trangThai ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {formData.trangThai ? "Đang hoạt động" : "Tạm ẩn"}
                                </div>
                            ) : (
                                <div className="w-48">
                                    <Dropdown
                                        value={formData.trangThai === true ? "true" : "false"}
                                        onChange={(value) => {
                                            const newStatus = value === "true";
                                            setFormData(prev => ({ ...prev, trangThai: newStatus }));
                                            if (isEditMode && onStatusChange) onStatusChange(newStatus);
                                        }}
                                        options={[
                                            { value: "true", label: "Đang hợp tác" },
                                            { value: "false", label: "Ngưng hợp tác" }
                                        ]}
                                        fullWidth
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <CreateAmenityModal
                isOpen={showCreateAmenityModal}
                onClose={() => setShowCreateAmenityModal(false)}
                onSuccess={async () => {
                    await loadAllAmenities();
                    setShowCreateAmenityModal(false);
                }}
            />

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={confirmOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
                confirmText={confirmConfig.confirmText}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={async () => {
                    await confirmConfig.action?.();
                    setConfirmOpen(false);
                }}
            />
        </div>
    );
}