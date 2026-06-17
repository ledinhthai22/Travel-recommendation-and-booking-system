import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    Building2, Phone, MapPin, Star, AlignLeft,
    ImagePlus, ArrowLeft, X
} from 'lucide-react';

import InputField from '~/components/UI/Form/InputField';
import Dropdown from '~/components/Common/Dropdown';
import { Link } from 'react-router-dom';

import { toastError, toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';

import {
    getAmenitiesApi,
    getAmenitiesPageApi,
    createAmenityApi,
    updateAmenityApi,
    deleteAmenityApi,
} from '~/Services/Amenities';

import CustomDataTable from '~/components/UI/Table/CustomDataTable';
import RowActionsButton from '~/components/UI/Table/Button/RowActionsButton';
import ManagerToolbar from '~/components/UI/ToolBar/ToolBar';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';

import AddAmenityModal from './AddAmenityModal';
import UpdateAmenityModal from './UpdateAmenityModal';

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

    const fileInputRef = useRef(null);

    const [activeTab, setActiveTab] = useState('info');
    const [loading, setLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({});

    // Form data
    const [formData, setFormData] = useState({
        tenKhachSan: '', 
        soDienThoai: '', 
        diaChi: '', 
        soSao: '5', 
        moTa: '', 
        trangThai: true
    });

    const [images, setImages] = useState([]);
    const [amenitiesSelected, setAmenitiesSelected] = useState([]);
    const [errors, setErrors] = useState({});

    // Amenities dropdown
    const [allAmenities, setAllAmenities] = useState([]);
    const [selectedAmenityId, setSelectedAmenityId] = useState('');

    // Amenities Management Tab
    const [amenitySearch, setAmenitySearch] = useState('');
    const [amenityPage, setAmenityPage] = useState(1);
    const [amenityPerPage, setAmenityPerPage] = useState(10);
    const [amenityData, setAmenityData] = useState([]);
    const [amenityTotalRows, setAmenityTotalRows] = useState(0);
    const [amenityLoading, setAmenityLoading] = useState(false);

    // Modals
    const [isAddAmenityOpen, setIsAddAmenityOpen] = useState(false);
    const [editAmenityConfig, setEditAmenityConfig] = useState({ isOpen: false, data: null });

    // Load all amenities for dropdown
    useEffect(() => {
        const loadAllAmenities = async () => {
            try {
                const data = await getAmenitiesApi();
                setAllAmenities(data);
            } catch (error) {
                toastError("Lỗi tải danh sách tiện nghi", getErrorMessage(error));
            }
        };
        loadAllAmenities();
    }, []);

    // Load initial data
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

    // Fetch amenities with pagination
    const fetchAmenities = async () => {
        try {
            setAmenityLoading(true);
            const response = await getAmenitiesPageApi(amenityPage, amenityPerPage, amenitySearch);
            setAmenityData(response.items || []);
            setAmenityTotalRows(response.totalItems || 0);
        } catch (error) {
            toastError("Lỗi tải danh sách tiện nghi", getErrorMessage(error));
        } finally {
            setAmenityLoading(false);
        }
    };

    useEffect(() => {
        fetchAmenities();
    }, [amenityPage, amenityPerPage, amenitySearch]);

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

    // Amenities functions
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
        if (!formData.soDienThoai.trim()) newErrors.soDienThoai = 'Vui lòng nhập số điện thoại.';
        else if (!/^(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})$/.test(formData.soDienThoai.trim())) {
            newErrors.soDienThoai = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0).';
        }
        if (!formData.diaChi.trim()) newErrors.diaChi = 'Vui lòng nhập địa chỉ.';
        if (images.length === 0) newErrors.images = 'Vui lòng thêm ít nhất 1 hình ảnh.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isViewMode || !validate()) return;

        if (isEditMode) {
            setConfirmConfig({
                title: "Xác nhận cập nhật",
                message: `Bạn có chắc chắn muốn cập nhật thông tin khách sạn "${formData.tenKhachSan}"?`,
                type: "warning",
                confirmText: "Cập nhật",
                action: executeSubmit
            });
            setConfirmOpen(true);
        } else {
            executeSubmit();
        }
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
            setConfirmOpen(false);
        }
    };

    // Amenity Management
    const handleDeleteAmenity = (row) => {
        setConfirmConfig({
            title: "Xóa Tiện Nghi",
            message: `Bạn có chắc chắn muốn xóa tiện nghi "${row.tenTienNghi}"?`,
            type: "danger",
            confirmText: "Xóa",
            action: async () => {
                setAmenityLoading(true);
                try {
                    await deleteAmenityApi(row.maTienNghi);
                    toastSuccess("Xóa tiện nghi thành công!");
                    fetchAmenities();
                    setAmenitiesSelected(prev => prev.filter(a => a.maTienNghi !== row.maTienNghi));
                } catch (err) {
                    toastError(getErrorMessage(err));
                } finally {
                    setAmenityLoading(false);
                }
            }
        });
        setConfirmOpen(true);
    };

    const amenityColumns = useMemo(() => [
        {
            name: 'STT',
            width: '80px',
            center: true,
            cell: (row, index) => <span className="font-medium">{(amenityPage - 1) * amenityPerPage + index + 1}</span>
        },
        {
            name: 'Tên Tiện Nghi',
            selector: row => row.tenTienNghi,
            sortable: true,
            cell: row => <p className="font-semibold text-sky-700">{row.tenTienNghi}</p>,
        },
        {
            name: 'Thao tác',
            width: '140px',
            center: true,
            cell: row => (
                <RowActionsButton
                    row={row}
                    onEdit={() => setEditAmenityConfig({ isOpen: true, data: row })}
                    onDelete={handleDeleteAmenity}
                />
            ),
        },
    ], [amenityPage, amenityPerPage]);

    return (
        <div>
            <div className="bg-white border border-slate-200 rounded-2xl shadow">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2 pt-2 pr-2 pl-2">
                    <Link
                        to="/Quan-ly/Khach-san"
                        onClick={onCancel}
                        className="flex items-center gap-2 flex-1 sm:flex-none py-3 px-6 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200 transition-all"
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

                {/* Tabs */}
                {!isViewMode && (
                    <div className="flex border-b border-slate-200 text-sm sm:text-base">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`flex-1 py-4 font-semibold transition-all ${activeTab === 'info' ? 'text-[#0EA5E5] border-b-2 border-[#0EA5E5] bg-sky-50/50' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Thông tin khách sạn
                        </button>
                        <button
                            onClick={() => setActiveTab('amenities')}
                            className={`flex-1 py-4 font-semibold transition-all ${activeTab === 'amenities' ? 'text-[#0EA5E5] border-b-2 border-[#0EA5E5] bg-sky-50/50' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Quản lý Tiện nghi
                        </button>
                    </div>
                )}

                {/* ==================== TAB THÔNG TIN ==================== */}
                {activeTab === 'info' && (
                    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
                        {/* Images */}
                        <section>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Hình ảnh ({images.length}/8)</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3">
                                {images.map((img) => (
                                    <div key={img.id} className="relative aspect-square rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden group">
                                        <img src={img.previewUrl} className="w-full h-full object-cover" alt="preview" />
                                        {img.anhChinh && <span className="absolute top-2 left-2 bg-[#0EA5E5] text-white text-[10px] px-2 py-0.5 rounded font-medium">Ảnh chính</span>}
                                        {!isViewMode && (
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all">
                                                {!img.anhChinh && (
                                                    <button onClick={() => handleSetMainImage(img)} className="text-xs bg-white/90 hover:bg-white text-slate-800 px-4 py-1.5 rounded-xl">Đặt làm chính</button>
                                                )}
                                                <button onClick={() => handleRemoveImage(img.id)} className="text-xs bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-xl">Xóa</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {!isViewMode && images.length < 8 && (
                                    <button type="button" onClick={() => fileInputRef.current.click()} className="aspect-square border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center hover:border-[#0EA5E5] hover:text-[#0EA5E5]">
                                        <ImagePlus size={32} className="mb-2" />
                                        <span className="text-xs font-medium">Tải ảnh lên</span>
                                    </button>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                            {errors.images && <p className="text-red-600 text-sm mt-2">{errors.images}</p>}
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                            <InputField label="Tên khách sạn" name="tenKhachSan" required disabled={isViewMode} value={formData.tenKhachSan} onChange={handleInputChange} error={errors.tenKhachSan} Icon={Building2} />
                            <InputField label="Số điện thoại" name="soDienThoai" required disabled={isViewMode} value={formData.soDienThoai} onChange={handleInputChange} error={errors.soDienThoai} Icon={Phone} />
                            <InputField label="Địa chỉ chi tiết" name="diaChi" required disabled={isViewMode} value={formData.diaChi} onChange={handleInputChange} error={errors.diaChi} Icon={MapPin} />
                            <Dropdown label="Hạng sao" value={formData.soSao} options={STAR_OPTIONS} onChange={v => setFormData(p => ({ ...p, soSao: v }))} disabled={isViewMode} fullWidth />
                        </div>

                        <InputField label="Mô tả tổng quan" name="moTa" multiline rows={5} disabled={isViewMode} value={formData.moTa} onChange={handleInputChange} Icon={AlignLeft} />

                        {/* Amenities Selection */}
                        <section>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4">Tiện ích ({amenitiesSelected.length})</p>

                            {!isViewMode && (
                                <div className="flex gap-3 mb-5">
                                    <div className="flex-1">
                                        <Dropdown
                                            value={selectedAmenityId}
                                            options={allAmenities
                                                .filter(a => !amenitiesSelected.some(selected => selected.maTienNghi === a.maTienNghi))
                                                .map(a => ({ value: a.maTienNghi.toString(), label: a.tenTienNghi }))}
                                            onChange={setSelectedAmenityId}
                                            placeholder="Chọn tiện ích..."
                                            fullWidth
                                        />
                                    </div>
                                    <button
                                        onClick={addAmenityFromDropdown}
                                        disabled={!selectedAmenityId}
                                        className="px-6 py-3 bg-[#0EA5E5] hover:bg-[#0284c7] text-white rounded-xl font-medium self-end disabled:opacity-50"
                                    >
                                        Thêm
                                    </button>
                                </div>
                            )}

                            <div className="p-4 border border-slate-200 rounded-2xl min-h-[50px] bg-slate-50/50">
                                {amenitiesSelected.length > 0 ? (
                                    <div className="flex flex-wrap gap-3">
                                        {amenitiesSelected.map((amenity) => (
                                            <div key={amenity.maTienNghi} className="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-700 hover:border-sky-300 hover:shadow-md transition-all">
                                                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                                                <span>{amenity.tenTienNghi}</span>
                                                {!isViewMode && (
                                                    <button onClick={() => removeAmenity(amenity.maTienNghi)} className="ml-1 w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-100 hover:text-red-500 transition-all">
                                                        <X size={10} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-12">
                                        <p className="text-sm text-slate-400 italic">Chưa có tiện nghi nào được chọn</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {!isAddMode && (
                            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex justify-between items-center">
                                <p className="font-semibold text-slate-700">Trạng thái hoạt động</p>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        name="trangThai" 
                                        checked={formData.trangThai} 
                                        onChange={handleInputChange} 
                                        className="sr-only peer" 
                                        disabled={isViewMode} 
                                    />
                                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-[#0EA5E5] after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                                </label>
                            </div>
                        )}
                    </div>
                )}

                {/* ==================== TAB QUẢN LÝ TIỆN NGHỊ ==================== */}
                {!isViewMode && activeTab === 'amenities' && (
                    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                        <ManagerToolbar
                            searchPlaceholder="Tìm kiếm tiện nghi..."
                            onSearchChange={(value) => {
                                setAmenitySearch(value);
                                setAmenityPage(1);
                            }}
                            showCategoryFilter={false}
                            showAddButton
                            addButtonText="Thêm Tiện Nghi Mới"
                            onAddClick={() => setIsAddAmenityOpen(true)}
                            showExcel={false}
                        />

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <CustomDataTable
                                columns={amenityColumns}
                                data={amenityData}
                                progressPending={amenityLoading}
                                pagination
                                paginationServer
                                paginationTotalRows={amenityTotalRows}
                                onChangePage={setAmenityPage}
                                onChangeRowsPerPage={(newPerPage, page) => {
                                    setAmenityPerPage(newPerPage);
                                    setAmenityPage(page);
                                }}
                                highlightOnHover
                                pointerOnHover
                                noDataComponent={<div className="py-12 text-center text-slate-400">Không có dữ liệu tiện nghi</div>}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AddAmenityModal
                isOpen={isAddAmenityOpen}
                onClose={() => setIsAddAmenityOpen(false)}
                onSuccess={() => {
                    setIsAddAmenityOpen(false);
                    fetchAmenities();
                }}
            />

            <UpdateAmenityModal
                isOpen={editAmenityConfig.isOpen}
                initialData={editAmenityConfig.data}
                onClose={() => setEditAmenityConfig({ isOpen: false, data: null })}
                onSuccess={() => {
                    setEditAmenityConfig({ isOpen: false, data: null });
                    fetchAmenities();
                }}
            />

            <ConfirmModal
                isOpen={confirmOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
                confirmText={confirmConfig.confirmText}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={confirmConfig.action}
            />
        </div>
    );
}