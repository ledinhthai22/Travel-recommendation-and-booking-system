import React, { useState, useRef, useEffect } from 'react';
import {
    ImagePlus, X, Plus
} from 'lucide-react';

import InputField from '~/components/UI/Form/InputField';
import Dropdown from '~/components/Common/Dropdown';

import { createLocationApi, updateLocationApi } from '~/Services/LocationService';
import { getAllTypeLocationApi } from '~/Services/TypeLocationService';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';
import CreateTypeLocationModal from "~/Pages/admin/TypeLocationManager/AddTypeLocationModal";
import { toastError, toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
import { getProvincesApi } from '~/Services/ProvinceService';
import SelectField from '~/components/UI/Form/SelectField';
export default function LocationFormModal({
    isOpen,
    onClose,
    mode = 'add',
    initialData = null,
    onSave
}) {
    if (!isOpen) return null;

    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isAddMode = mode === 'add';

    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({});
    const [showCreateTypeModal, setShowCreateTypeModal] = useState(false);
    const [provinceData, setProvinceData] = useState([]);
    const [provinceLoading, setProvinceLoading] = useState(false);
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


    const [typeData, setTypeData] = useState([]);
    const [typeSearch, setTypeSearch] = useState('');
    const [typePage, setTypePage] = useState(1);
    const [typePerPage, setTypePerPage] = useState(10);
    const [typeLoading, setTypeLoading] = useState(false);

    // Load data khi mở modal
    useEffect(() => {
        if (!isOpen) return;

        if ((isViewMode || isEditMode) && initialData) {
            setFormData({
                tenDiaDiem: initialData.tenDiaDiem || '',
                loaiDiaDiem: initialData.loaiDiaDiem || null,
                tinhThanh: initialData.tinhThanh || '',
                quocGia: initialData.quocGia || 'Việt Nam',
                moTa: initialData.moTa || '',
                khuVuc: initialData.khuVuc ?? true,
                trangThai: initialData.trangThai ?? true
            });

            if (initialData.duongDanAnh) {
                setImage({
                    previewUrl: `https://localhost:7016${initialData.duongDanAnh}`,
                    file: null
                });
            }
        } else {
            // Reset form khi thêm mới
            setFormData({
                tenDiaDiem: '',
                loaiDiaDiem: null,
                tinhThanh: '',
                quocGia: 'Việt Nam',
                moTa: '',
                khuVuc: true,
                trangThai: true
            });
            setImage(null);
            setErrors({});
        }
    }, [isOpen, mode, initialData]);
    const fetchProvinces = async () => {
        try {
            setProvinceLoading(true);

            const data = await getProvincesApi();

            setProvinceData(data);
        } catch (error) {
            console.error(error);
        } finally {
            setProvinceLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchProvinces();
        }
    }, [isOpen]);
    const fetchTypeLocations = async () => {
        try {
            setTypeLoading(true);

            const response = await getAllTypeLocationApi();

            console.log(response);

            setTypeData(response);
        } catch (error) {
            toastError("Lỗi tải danh sách loại địa điểm", getErrorMessage(error));
        } finally {
            setTypeLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) fetchTypeLocations();
    }, [isOpen, typePage, typePerPage, typeSearch]);

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
            file,
            previewUrl: URL.createObjectURL(file)
        });
        setErrors(prev => ({ ...prev, image: '' }));
        e.target.value = '';
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.tenDiaDiem?.trim()) newErrors.tenDiaDiem = 'Vui lòng nhập tên địa điểm.';
        if (!formData.tinhThanh?.trim()) newErrors.tinhThanh = 'Vui lòng nhập tỉnh/thành phố.';
        if (!formData.moTa?.trim()) newErrors.moTa = 'Vui lòng nhập mô tả tổng quan.';
        if (!formData.quocGia?.trim()) newErrors.quocGia = 'Vui lòng nhập quốc gia.';
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
            onClose();
        } catch (error) {
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
        <>
            {/* Modal Backdrop */}
            <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl max-h-[95vh] flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-slate-50 rounded-t-3xl">
                        <h2 className="text-2xl font-semibold text-slate-800">
                            {isAddMode ? "Thêm địa điểm mới" : isEditMode ? "Cập nhật địa điểm" : "Chi tiết địa điểm"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-200 rounded-2xl transition-colors cursor-pointer"
                        >
                            <X size={22} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="overflow-y-auto flex-1 p-6 lg:p-8 space-y-10">
                        {/* Hình ảnh */}
                        <section>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4">
                                Hình ảnh địa điểm
                            </p>
                            <div className="flex items-start gap-4">
                                {image?.previewUrl ? (
                                    <div className="relative w-220 h-48 rounded-2xl overflow-hidden border border-slate-200 group">
                                        <img src={image.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        {!isViewMode && (
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current.click()}
                                                    className="bg-white text-slate-800 px-6 py-3 rounded-2xl font-medium shadow hover:bg-sky-50 cursor-pointer"
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
                                        className={`w-220 h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all ${errors.image ? 'border-red-400 bg-red-50' : 'border-slate-300 hover:border-sky-500 hover:text-sky-500'}`}
                                    >
                                        <ImagePlus size={48} className="mb-4 text-slate-400" />
                                        <span className="font-medium">Tải ảnh lên</span>
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
                            {errors.image && <p className="text-red-600 text-sm mt-2 font-medium">{errors.image}</p>}
                        </section>


                        <div className="grid grid-cols-1 gap-6">

                            <InputField
                                label="Tên địa điểm"
                                name="tenDiaDiem"
                                required
                                disabled={isViewMode}
                                value={formData.tenDiaDiem}
                                onChange={handleInputChange}
                                error={errors.tenDiaDiem}
                            />

                            {isViewMode ? (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Loại địa điểm
                                    </label>
                                    <div className="p-3 bg-slate-100 border border-slate-300 rounded-2xl text-slate-700">
                                        {typeData.find(t => t.maLoaiDD === Number(formData.loaiDiaDiem))?.tenLoaiDD || "Chưa có"}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-3 items-end">
                                    <div className="flex-1">
                                        <Dropdown
                                            label="Loại địa điểm"
                                            placeholder="Chọn loại địa điểm..."
                                            value={formData.loaiDiaDiem?.toString() || ""}
                                            onChange={(value) => {
                                                setFormData(prev => ({ ...prev, loaiDiaDiem: value }));
                                            }}
                                            options={typeData.map(item => ({
                                                value: item.maLoaiDD.toString(),
                                                label: item.tenLoaiDD
                                            }))}
                                            fullWidth
                                            searchable
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setShowCreateTypeModal(true)}
                                        className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-sm text-white rounded-2xl cursor-pointer"
                                    >
                                        Thêm mới
                                    </button>
                                </div>
                            )}

                            <SelectField
                                label="Tỉnh / Thành phố"
                                value={formData.tinhThanh}
                                onChange={(value) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        tinhThanh: value
                                    }))
                                }
                                options={provinceData}
                                valueKey="name"
                                labelKey="name"
                                placeholder="Chọn tỉnh / thành phố"
                                searchable
                                searching={provinceLoading}
                                disabled={isViewMode}
                                error={errors.tinhThanh}
                            />

                            <InputField
                                label="Mô tả tổng quan"
                                name="moTa"
                                multiline
                                rows={5}
                                value={formData.moTa}
                                onChange={handleInputChange}
                            />

                        </div>
                    </div>

                    {/* Footer */}
                    {!isViewMode && (
                        <div className="border-t border-slate-200 p-2 flex justify-end gap-4 bg-slate-50 rounded-b-3xl">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-8 py-3 bg-[#0EA5E5] hover:bg-[#0284c7] text-white rounded-2xl font-medium flex items-center gap-2 disabled:opacity-70 transition-all"
                            >
                                {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin cursor-pointer" />}
                                {isAddMode ? "Thêm địa điểm" : "Lưu thay đổi"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Sub Modals */}
            <CreateTypeLocationModal
                isOpen={showCreateTypeModal}
                onClose={() => setShowCreateTypeModal(false)}
                onSuccess={async (newType) => {
                    await fetchTypeLocations();
                    if (newType?.maLoaiDD) {
                        setFormData(prev => ({ ...prev, loaiDiaDiem: String(newType.maLoaiDD) }));
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
        </>
    );
}