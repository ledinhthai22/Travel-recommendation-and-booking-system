import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    MapPin, AlignLeft, ImagePlus, ArrowLeft,
    Globe2, Building, Tags
} from 'lucide-react';
import InputField from '~/components/UI/Form/InputField';
import Dropdown from '~/components/Common/Dropdown';
import { Link } from 'react-router-dom';

import { createLocationApi, updateLocationApi } from '~/Services/LocationService';
import { getTypeLocationListApi, deleteTypeLocationApi } from '~/Services/TypeLocationService';

import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';
import AddTypeLocationModal from './AddTypeLocationModal';
import UpdateTypeLocationModal from './UpdateTypeLocationModal';

import { toastError, toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';

export default function LocationFormPage({ mode = 'add', initialData = null, onCancel, onSave }) {
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isAddMode = mode === 'add';

    const fileInputRef = useRef(null);
    const [activeTab, setActiveTab] = useState('info');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        tenDiaDiem: '',
        loaiDiaDiem: null,
        tinhThanh: '',
        quocGia: 'Việt Nam',
        moTa: '',
        khuVuc: false,
        trangThai: true
    });
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState({});

    const [typeSearch, setTypeSearch] = useState('');
    const [typePage, setTypePage] = useState(1);
    const [typePerPage, setTypePerPage] = useState(10);
    const [typeData, setTypeData] = useState([]);
    const [typeTotalRows, setTypeTotalRows] = useState(0);
    const [typeLoading, setTypeLoading] = useState(false);

    // State cho Modal thêm/sửa/xóa Loại Địa Điểm
    const [isAddTypeOpen, setIsAddTypeOpen] = useState(false);
    const [editTypeConfig, setEditTypeConfig] = useState({ isOpen: false, data: null });
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({ title: '', message: '', type: 'danger', confirmText: 'Xác nhận', action: null });

    useEffect(() => {
        if ((isViewMode || isEditMode) && initialData) {
            setFormData({
                tenDiaDiem: initialData.tenDiaDiem || '',
                loaiDiaDiem: initialData.loaiDiaDiem || null,
                tinhThanh: initialData.tinhThanh || '',
                quocGia: initialData.quocGia || 'Việt Nam',
                moTa: initialData.moTa || '',
                khuVuc: initialData.khuVuc || false,
                trangThai: initialData.trangThai !== undefined ? initialData.trangThai : true
            });
            if (initialData.duongDanAnh) {
                setImage({ previewUrl: `https://localhost:7016${initialData.duongDanAnh}`, file: null });
            }
        }
    }, [mode, initialData]);

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
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
        setImage({ file: file, previewUrl: URL.createObjectURL(file) });
        setErrors(prev => ({ ...prev, image: '' }));
        e.target.value = null;
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.tenDiaDiem.trim()) newErrors.tenDiaDiem = 'Vui lòng nhập tên địa điểm.';
        if (!formData.tinhThanh.trim()) newErrors.tinhThanh = 'Vui lòng nhập tỉnh/thành phố.';
        if (!formData.quocGia.trim()) newErrors.quocGia = 'Vui lòng nhập quốc gia.';
        if (!formData.loaiDiaDiem) {
            newErrors.loaiDiaDiem = 'Vui lòng chọn loại địa điểm.';
        }
        if (isAddMode && !image?.file) newErrors.image = 'Vui lòng tải lên hình ảnh.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
                action: async () => {
                    await executeSubmit();
                }
            });
            setConfirmOpen(true);
        } else {
            await executeSubmit();
        }
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

            if (onSave) onSave();
        } catch (error) {
            console.error("Lỗi từ Server:", error.response?.data);
            toastError("Thao tác thất bại!");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteType = (row) => {
        setConfirmConfig({
            title: "Xóa Loại Địa Điểm",
            message: `Bạn có chắc chắn muốn xóa loại địa điểm "${row.tenLoaiDD}" không?`,
            type: "danger",
            confirmText: "Xóa",
            action: async () => {
                setTypeLoading(true);
                try {
                    await deleteTypeLocationApi(row.maLoaiDD);
                    toastSuccess("Xóa loại địa điểm thành công!");
                    fetchTypeLocations();
                    if (formData.loaiDiaDiem === row.maLoaiDD) {
                        setFormData(prev => ({ ...prev, loaiDiaDiem: null }));
                    }
                } catch (err) {
                    toastError(getErrorMessage(err));
                } finally {
                    setTypeLoading(false);
                }
            }
        });
        setConfirmOpen(true);
    };

    const typeColumns = useMemo(() => [
        {
            name: 'STT',
            width: '80px',
            center: true,
            cell: (row, index) => <span className="font-medium">{(typePage - 1) * typePerPage + index + 1}</span>
        },
        {
            name: 'Tên Loại Địa Điểm',
            selector: row => row.tenLoaiDD,
            sortable: true,
            cell: row => <p className="font-semibold text-sky-700">{row.tenLoaiDD}</p>,
        },
        {
            name: 'Thao tác',
            width: '140px',
            center: true,
            cell: row => (
                <RowActionsButton
                    row={row}
                    onEdit={() => setEditTypeConfig({ isOpen: true, data: row })}
                    onDelete={handleDeleteType}
                />
            ),
        },
    ], [typePage, typePerPage]);

    return (
        <div>
            <div className="bg-white border border-slate-200 rounded-2xl shadow">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4  mb-2 pt-2 pr-2 pl-2">
                    <div>
                        <Link to='/Quan-ly/Dia-diem' onClick={onCancel} className="flex items-center gap-2 flex-1 sm:flex-none py-3 px-6 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200 transition-all">
                            <ArrowLeft size={18} /> Quay trở lại
                        </Link>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {!isViewMode && (
                            <button onClick={handleSubmit} disabled={loading} className="flex-1 sm:flex-none py-3 px-8 rounded-xl text-sm font-medium text-white bg-[#0EA5E5] hover:bg-[#0284c7] transition-all shadow-sm flex items-center justify-center gap-2">
                                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                {isAddMode ? "Lưu Địa Điểm Mới" : "Cập Nhật Dữ Liệu"}
                            </button>
                        )}
                    </div>
                </div>
                {!isViewMode && (
                    <div className="flex border-b border-slate-200 text-sm sm:text-base">
                        <button onClick={() => setActiveTab('info')} className={`flex-1 py-4 font-semibold transition-all ${activeTab === 'info' ? 'text-[#0EA5E5] border-b-2 border-[#0EA5E5] bg-sky-50/50' : 'text-slate-500 hover:text-slate-700'}`}>
                            Thông tin địa điểm
                        </button>
                        <button onClick={() => setActiveTab('category')} className={`flex-1 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'category' ? 'text-[#0EA5E5] border-b-2 border-[#0EA5E5] bg-sky-50/50' : 'text-slate-500 hover:text-slate-700'}`}>
                            Quản lý Loại địa điểm
                            {formData.loaiDiaDiem && <span className="bg-[#0EA5E5] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">1</span>}
                        </button>
                    </div>
                )}
                {activeTab === 'info' && (
                    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
                        <section>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Hình ảnh đại diện</p>
                            <div className="flex items-start gap-4">
                                {image?.previewUrl ? (
                                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border border-slate-200 group">
                                        <img src={image.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        {!isViewMode && (
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                <button type="button" onClick={() => fileInputRef.current.click()} className="text-xs font-medium bg-white text-slate-800 px-4 py-2 rounded-xl shadow-lg hover:bg-sky-50">
                                                    Thay đổi
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button type="button" onClick={() => fileInputRef.current.click()} className={`w-32 h-32 sm:w-40 sm:h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${errors.image ? 'border-red-400 bg-red-50 text-red-500' : 'border-slate-300 bg-slate-50 hover:border-[#0EA5E5] hover:text-[#0EA5E5] text-slate-400'}`}>
                                        <ImagePlus size={32} className="mb-2" />
                                        <span className="text-xs font-medium">Tải ảnh lên</span>
                                    </button>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageChange} className="hidden" />
                            {errors.image && <p className="text-red-600 text-sm mt-2 font-medium">{errors.image}</p>}
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 pt-4 border-t border-slate-100">
                            <div className="md:col-span-2">
                                <InputField label="Tên địa điểm" name="tenDiaDiem" required disabled={isViewMode} value={formData.tenDiaDiem} onChange={handleInputChange} error={errors.tenDiaDiem} Icon={MapPin} />
                            </div>
                            {isViewMode ? (
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Loại địa điểm</label>
                                    <div className="p-3 bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-medium">
                                        {typeData.find(item => item.maLoaiDD === formData.loaiDiaDiem)?.tenLoaiDD || "Chưa chọn"}
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full">
                                    <Dropdown
                                        label="Loại địa điểm"
                                        placeholder="Chọn loại địa điểm..."
                                        value={formData.loaiDiaDiem}
                                        onChange={(value) => {
                                            setFormData(prev => ({ ...prev, loaiDiaDiem: value }));
                                            if (errors.loaiDiaDiem) setErrors(prev => ({ ...prev, loaiDiaDiem: '' }));
                                        }}
                                        options={typeData.map(a => ({ value: a.maLoaiDD.toString(), label: a.tenLoaiDD }))}
                                        fullWidth
                                        error={errors.loaiDiaDiem}
                                        Icon={Tags}
                                    />
                                </div>
                            )}
                            <InputField label="Tỉnh / Thành phố" name="tinhThanh" required disabled={isViewMode} value={formData.tinhThanh} onChange={handleInputChange} error={errors.tinhThanh} Icon={Building} />
                            <InputField label="Quốc gia" name="quocGia" required disabled={isViewMode} value={formData.quocGia} onChange={handleInputChange} error={errors.quocGia} Icon={Globe2} />
                            {isViewMode ? (
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Khu vực</label>
                                    <div className="p-3 bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-medium">
                                        {formData.khuVuc ? "Trong Nước" : "Ngoài Nước"}
                                    </div>
                                </div>
                            ) : (
                                <Dropdown
                                    label="Khu vực"
                                    placeholder="Chọn khu vực"
                                    value={formData.khuVuc}
                                    onChange={(value) => {
                                        setFormData(prev => ({ ...prev, khuVuc: value === true || value === "true" }));
                                    }}
                                    options={[
                                        { value: true, label: "Trong Nước" },
                                        { value: false, label: "Ngoài Nước" }
                                    ]}
                                    fullWidth
                                />
                            )}
                            <div className="md:col-span-2">
                                <InputField label="Mô tả tổng quan" name="moTa" multiline rows={4} disabled={isViewMode} value={formData.moTa} onChange={handleInputChange} Icon={AlignLeft} />
                            </div>
                            {!isAddMode && (
                                <div className="md:col-span-2 bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                                    <div>
                                        <p className="font-semibold text-slate-700">Trạng thái hoạt động</p>
                                    </div>

                                    {isViewMode ? (
                                        <div className={`px-4 py-2 rounded-full font-bold text-sm ${formData.trangThai ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {formData.trangThai ? "Đang hoạt động" : "Tạm ẩn"}
                                        </div>
                                    ) : (
                                        <div className="w-48 relative z-50">
                                            <Dropdown
                                                value={formData.trangThai}
                                                onChange={(value) => setFormData(prev => ({ ...prev, trangThai: value === true || value === "true" }))}
                                                options={[
                                                    { value: true, label: "Đang hoạt động" },
                                                    { value: false, label: "Tạm ẩn" }
                                                ]}
                                                fullWidth
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {!isViewMode && activeTab === 'category' && (
                    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                        <div className="mb-2">
                            {errors.loaiDiaDiem && (
                                <p className="text-red-600 font-medium text-sm mt-3 bg-red-50 p-3 rounded-lg border border-red-200 inline-block">
                                    {errors.loaiDiaDiem}
                                </p>
                            )}
                        </div>

                        <ManagerToolbar
                            searchPlaceholder="Tìm kiếm loại địa điểm..."
                            onSearchChange={(value) => {
                                setTypeSearch(value);
                                setTypePage(1);
                            }}
                            showCategoryFilter={false}
                            showAddButton={!isViewMode}
                            addButtonText="Thêm Loại Mới"
                            onAddClick={() => setIsAddTypeOpen(true)}
                            showExcel={false}
                        />

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <CustomDataTable
                                columns={typeColumns}
                                data={typeData}
                                progressPending={typeLoading}
                                pagination
                                paginationServer
                                paginationTotalRows={typeTotalRows}
                                onChangePage={(page) => setTypePage(page)}
                                onChangeRowsPerPage={(newPerPage, page) => {
                                    setTypePerPage(newPerPage);
                                    setTypePage(page);
                                }}
                                highlightOnHover
                                pointerOnHover
                                paginationComponentOptions={{
                                    rowsPerPageText: 'Số dòng:',
                                    rangeSeparatorText: 'trên',
                                    noRowsPerPage: false,
                                    selectAllRowsItem: false,
                                }}
                                noDataComponent={
                                    <div className="py-12 text-center">
                                        <p className="text-slate-400 text-sm">Không có dữ liệu loại địa điểm</p>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                )}
            </div>

            <AddTypeLocationModal
                isOpen={isAddTypeOpen}
                onClose={() => setIsAddTypeOpen(false)}
                onSuccess={() => {
                    setIsAddTypeOpen(false);
                    fetchTypeLocations();
                }}
            />

            <UpdateTypeLocationModal
                isOpen={editTypeConfig.isOpen}
                initialData={editTypeConfig.data}
                onClose={() => setEditTypeConfig({ isOpen: false, data: null })}
                onSuccess={() => {
                    setEditTypeConfig({ isOpen: false, data: null });
                    fetchTypeLocations();
                }}
                setConfirmConfig={setConfirmConfig}
                setConfirmOpen={setConfirmOpen}
            />

            <ConfirmModal
                isOpen={confirmOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type || "danger"}
                confirmText={confirmConfig.confirmText || "Xóa"}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={async () => {
                    try {
                        await confirmConfig.action?.();
                    } catch (error) {
                        toastError("Thao tác thất bại", getErrorMessage(error));
                    } finally {
                        setConfirmOpen(false);
                    }
                }}
            />
        </div>
    );
}