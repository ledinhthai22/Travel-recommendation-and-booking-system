import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    MapPin, AlignLeft, ImagePlus, ArrowLeft,
    Globe2, Building, Tags, Plus
} from 'lucide-react';

import InputField from '~/components/UI/Form/InputField';
import Dropdown from '~/components/Common/Dropdown';
import { Link } from 'react-router-dom';

import { createLocationApi, updateLocationApi } from '~/Services/LocationService';
import { getTypeLocationListApi } from '~/Services/TypeLocationService';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';
import CreateTypeLocationModal from "~/Pages/admin/TypeLocationManager/AddTypeLocationModal";
import { toastError, toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';

export default function LocationFormPage({
    mode = 'add',
    initialData = null,
    onCancel,
    onSave
}) {
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isAddMode = mode === 'add';

    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({});
    const [showCreateTypeModal, setShowCreateTypeModal] = useState(false);
    const [formData, setFormData] = useState({
        tenDiaDiem: '',
        loaiDiaDiem: null,
        tinhThanh: '',
        quocGia: 'Việt Nam',
        moTa: '',
        khuVuc: true,
        trangThai: true
    });

    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});

    // Type Location management
    const [typeData, setTypeData] = useState([]);
    const [typeSearch, setTypeSearch] = useState('');
    const [typePage, setTypePage] = useState(1);
    const [typePerPage, setTypePerPage] = useState(10);
    const [typeLoading, setTypeLoading] = useState(false);
    const [typeTotalRows, setTypeTotalRows] = useState(0);

    // Load initial data
    useEffect(() => {
        if ((isViewMode || isEditMode) && initialData) {
            setFormData({
                tenDiaDiem: initialData.tenDiaDiem || '',
                loaiDiaDiem: initialData.loaiDiaDiem || null,
                tinhThanh: initialData.tinhThanh || '',
                quocGia: initialData.quocGia || 'Việt Nam',
                moTa: initialData.moTa || '',
                khuVuc: initialData.khuVuc || true,
                trangThai: initialData.trangThai !== undefined ? initialData.trangThai : true
            });

            if (initialData.duongDanAnh) {
                setImage({
                    previewUrl: `https://localhost:7016${initialData.duongDanAnh}`,
                    file: null
                });
            }
        }
    }, [mode, initialData]);

    // Fetch location types
    const fetchTypeLocations = async () => {
        try {
            setTypeLoading(true);
            const response = await getTypeLocationListApi(typePage, typePerPage, typeSearch);
            setTypeData(response.items || []);
            setTypeTotalRows(response.totalItems || 0);
        } catch (error) {
            toastError("Lỗi tải danh sách loại địa điểm", getErrorMessage(error));
        } finally {
            setTypeLoading(false);
        }
    };

    useEffect(() => {
        fetchTypeLocations();
    }, [typePage, typePerPage, typeSearch]);

    const handleInputChange = (e) => {
        if (isViewMode) return;
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleImageChange = (e) => {
        if (isViewMode) return;
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toastError("Ảnh không được vượt quá 10MB!");
            return;
        }

        setImage({
            file: file,
            previewUrl: URL.createObjectURL(file)
        });
        setErrors(prev => ({ ...prev, image: '' }));
        e.target.value = null;
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.tenDiaDiem.trim()) newErrors.tenDiaDiem = 'Vui lòng nhập tên địa điểm.';
        if (!formData.tinhThanh.trim()) newErrors.tinhThanh = 'Vui lòng nhập tỉnh/thành phố.';
        if (!formData.moTa.trim()) newErrors.moTa = 'Vui lòng nhập mô tả tổng quan';
        if (!formData.quocGia.trim()) newErrors.quocGia = 'Vui lòng nhập quốc gia.';
        if (!formData.loaiDiaDiem) newErrors.loaiDiaDiem = 'Vui lòng chọn loại địa điểm.';
        if (isAddMode && !image?.file) newErrors.image = 'Vui lòng tải lên hình ảnh.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const executeSubmit = async () => {
        try {
            setLoading(true);
            const payload = new FormData();

            payload.append("TenDiaDiem", formData.tenDiaDiem);
            payload.append("MoTa", formData.moTa);
            payload.append("LoaiDiaDiem", formData.loaiDiaDiem);
            payload.append("TinhThanh", formData.tinhThanh);
            payload.append("QuocGia", formData.quocGia);
            payload.append("KhuVuc", formData.khuVuc);
            payload.append("TrangThai", formData.trangThai);

            if (image?.file) {
                payload.append("DuongDanAnh", image.file, image.file.name);
            }

            if (isAddMode) {
                await createLocationApi(payload);
                toastSuccess("Thêm địa điểm thành công!");
            } else {
                await updateLocationApi(initialData.maDiaDiem, payload);
                toastSuccess("Cập nhật địa điểm thành công!");
            }

            onSave?.();
        } catch (error) {
            console.error("Lỗi từ Server:", error.response?.data);
            toastError("Thao tác thất bại!", getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isViewMode || !validate()) return;

        if (isEditMode) {
            setConfirmConfig({
                title: "Xác nhận cập nhật",
                message: "Bạn có chắc chắn muốn lưu các thay đổi này không?",
                type: "warning",
                confirmText: "Lưu thay đổi",
                action: executeSubmit
            });
            setConfirmOpen(true);
        } else {
            await executeSubmit();
        }
    };


    return (
        <div >
            <div className="bg-white border border-slate-200 rounded-2xl shadow">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 ">
                    <Link
                        to="/Quan-ly/Dia-diem"
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
                            {loading && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            )}
                            {isAddMode ? "Thêm Địa Điểm Mới" : "Cập Nhật Địa điểm"}
                        </button>
                    )}
                </div>

                <div className="p-6 lg:p-8 space-y-10 ">

                    <section>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4">
                            Hình ảnh đại diện
                        </p>
                        <div className="flex items-start gap-4">
                            {image?.previewUrl ? (
                                <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-slate-200 group">
                                    <img
                                        src={image.previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    {!isViewMode && (
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current.click()}
                                                className="text-xs font-medium bg-white text-slate-800 px-5 py-2.5 rounded-xl shadow-lg hover:bg-sky-50"
                                            >
                                                Thay đổi ảnh
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className={`w-40 h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${errors.image
                                        ? 'border-red-400 bg-red-50 text-red-500'
                                        : 'border-slate-300 bg-slate-50 hover:border-[#0EA5E5] hover:text-[#0EA5E5] text-slate-400'
                                        }`}
                                >
                                    <ImagePlus size={40} className="mb-3" />
                                    <span className="text-sm font-medium">Tải ảnh lên</span>
                                </button>
                            )}
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        {errors.image && (
                            <p className="text-red-600 text-sm mt-2 font-medium">{errors.image}</p>
                        )}
                    </section>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <InputField
                                label="Tên địa điểm"
                                name="tenDiaDiem"
                                required
                                disabled={isViewMode}
                                value={formData.tenDiaDiem}
                                onChange={handleInputChange}
                                error={errors.tenDiaDiem}
                            />
                        </div>

                        {isViewMode ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Loại địa điểm</label>
                                <div className="p-3 bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-medium">
                                    {typeData.find(item => item.maLoaiDD === Number(formData.loaiDiaDiem))?.tenLoaiDD || "Chưa có"}
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-3 items-end">
                                <div className="flex-1">
                                    <Dropdown
                                        label="Loại địa điểm"
                                        placeholder="Chọn loại địa điểm..."
                                        value={formData.loaiDiaDiem ? formData.loaiDiaDiem.toString() : ""}
                                        onChange={(value) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                loaiDiaDiem: value
                                            }));

                                            if (errors.loaiDiaDiem) {
                                                setErrors(prev => ({
                                                    ...prev,
                                                    loaiDiaDiem: ''
                                                }));
                                            }
                                        }}
                                        options={typeData.map(a => ({
                                            value: a.maLoaiDD.toString(),
                                            label: a.tenLoaiDD
                                        }))}
                                        fullWidth
                                        Icon={Tags}
                                        error={errors.loaiDiaDiem}
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowCreateTypeModal(true)}
                                    className="px-4 py-2.5 bg-sky-400 hover:bg-sky-600 text-white rounded-4xl flex items-center gap-2 font-medium"
                                >
                                    <Plus size={16} />
                                    Thêm mới
                                </button>
                            </div>
                        )}

                        <InputField
                            label="Tỉnh / Thành phố"
                            name="tinhThanh"
                            required
                            disabled={isViewMode}
                            value={formData.tinhThanh}
                            onChange={handleInputChange}
                            error={errors.tinhThanh}
                        />

                        <InputField
                            label="Quốc gia"
                            name="quocGia"
                            required
                            disabled={isViewMode}
                            value={formData.quocGia}
                            onChange={handleInputChange}
                            error={errors.quocGia}
                        />

                        {isViewMode ? (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Khu vực</label>
                                <div className="p-3 bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-medium">
                                    {formData.khuVuc ? "Trong Nước" : "Ngoài Nước"}
                                </div>
                            </div>
                        ) : (
                            <Dropdown
                                label="Khu vực"
                                value={formData.khuVuc}
                                onChange={(value) => setFormData(prev => ({
                                    ...prev,
                                    khuVuc: value === true || value === "true"
                                }))}
                                options={[
                                    { value: true, label: "Trong Nước" },
                                    { value: false, label: "Ngoài Nước" }
                                ]}
                                fullWidth
                            />
                        )}

                        <div className="md:col-span-2">
                            <InputField
                                label="Mô tả tổng quan"
                                name="moTa"
                                multiline
                                rows={5}
                                disabled={isViewMode}
                                value={formData.moTa}
                                onChange={handleInputChange}
                                Icon={AlignLeft}
                                error={errors.moTa}
                            />
                        </div>

                        {!isAddMode && (
                            <div className="md:col-span-2 bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <p className="font-semibold text-slate-700">Trạng thái hoạt động</p>
                                {isViewMode ? (
                                    <div className={`px-4 py-2 rounded-full font-bold text-sm ${formData.trangThai ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {formData.trangThai ? "Đang hoạt động" : "Tạm ẩn"}
                                    </div>
                                ) : (
                                    <div className="w-52">
                                        <Dropdown
                                            value={formData.trangThai}
                                            onChange={(value) => setFormData(prev => ({
                                                ...prev,
                                                trangThai: value === true || value === "true"
                                            }))}
                                            options={[
                                                { value: true, label: "Đang khai thác" },
                                                { value: false, label: "Ngưng khai thác" }
                                            ]}
                                            fullWidth
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <CreateTypeLocationModal
                isOpen={showCreateTypeModal}
                onClose={() => setShowCreateTypeModal(false)}
                onSuccess={async (newType) => {
                    await fetchTypeLocations();

                    if (newType?.maLoaiDD) {
                        setFormData(prev => ({
                            ...prev,
                            loaiDiaDiem: String(newType.maLoaiDD)
                        }));
                    }

                    setShowCreateTypeModal(false);
                }}
            />
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