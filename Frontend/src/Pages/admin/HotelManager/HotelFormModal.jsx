import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Building2, Phone, MapPin, Star, AlignLeft, ImagePlus, X } from 'lucide-react';

import InputField from '~/components/UI/Form/InputField';
import Dropdown from '~/components/Common/Dropdown';
import SelectField from '~/components/UI/Form/SelectField';
import { toastError, toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
import { getAmenitiesApi } from '~/Services/Amenities';
import CreateAmenityModal from '~/Pages/admin/AmenitiesManager/AddAmenityModal';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';

import {
    createHotelApi,
    updateHotelApi,
    deleteHotelImageApi,
    setMainHotelImageApi,
} from '~/Services/HotelService';

const renderStars = (count) => (
    <div className="flex items-center gap-1">
        {[...Array(count)].map((_, i) => (
            <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
        ))}
    </div>
);

const STAR_OPTIONS = [5, 4, 3, 2, 1].map((n) => ({
    value: String(n),
    label: renderStars(n),
}));

const VALID_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function HotelFormModal({
    isOpen,
    onClose,
    mode = 'add',
    initialData = null,
    hotelId = null,
    onSave,
}) {
    if (isOpen === false) return null;

    const isView = mode === 'view';
    const isEdit = mode === 'edit';
    const isAdd = mode === 'add';
    const isOverlay = typeof isOpen === 'boolean';

    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        tenKhachSan: '', soDienThoai: '', diaChi: '',
        soSao: '', moTa: '', trangThai: true,
    });
    const [images, setImages] = useState([]);
    const [amenitiesSelected, setAmenitiesSelected] = useState([]);
    const [allAmenities, setAllAmenities] = useState([]);
    const [selectedAmenityId, setSelectedAmenityId] = useState('');
    const [errors, setErrors] = useState({});

    const [showCreateAmenityModal, setShowCreateAmenityModal] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({});

    const loadAmenities = useCallback(async () => {
        try {
            const data = await getAmenitiesApi();
            setAllAmenities(Array.isArray(data) ? data : []);
        } catch (err) {
            toastError('Lỗi tải danh sách tiện nghi', getErrorMessage(err));
        }
    }, []);

    useEffect(() => { loadAmenities(); }, [loadAmenities]);

    useEffect(() => {
        if (isView || isEdit) {
            if (!initialData) return;

            // Console log để bạn dễ dàng debug cấu trúc hình ảnh nếu cần thiết
            console.log("Dữ liệu hình ảnh từ initialData:", initialData.hinhAnh);

            setFormData({
                tenKhachSan: initialData.tenKhachSan || '',
                soDienThoai: initialData.soDienThoai || '',
                diaChi: initialData.diaChi || '',
                soSao: initialData.soSao?.toString() || '',
                moTa: initialData.moTa || '',
                trangThai: initialData.trangThai ?? true,
            });

            setImages(
                (initialData.hinhAnh || []).map((img) => {
                    // Dự phòng tất cả các trường định danh ID có thể trả về từ Backend
                    const imageId = img.maHinhAnh || img.id || img.maAnhSK;

                    // Xử lý chuẩn hóa URL hiển thị ảnh
                    let previewUrl = img.duongDanAnh || '';
                    if (previewUrl && !previewUrl.startsWith('http')) {
                        previewUrl = `https://localhost:7016${previewUrl}`;
                    }

                    return {
                        id: imageId,
                        previewUrl: previewUrl,
                        anhChinh: img.anhChinh || false,
                        soThuTu: img.soThuTu || 1,
                        isExisting: true,
                    };
                })
            );

            setAmenitiesSelected(
                Array.isArray(initialData.tienIch) ? initialData.tienIch : []
            );
        } else {
            setFormData({ tenKhachSan: '', soDienThoai: '', diaChi: '', soSao: '', moTa: '', trangThai: true });
            setImages([]);
            setAmenitiesSelected([]);
            setErrors({});
        }
    }, [mode, initialData, isOpen]);

    const handleInput = (e) => {
        if (isView) return;
        const { name, value, type, checked } = e.target;
        setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    };

    const handleImageAdd = (e) => {
        if (isView) return;
        const files = Array.from(e.target.files);
        if (images.length + files.length > 8) {
            toastError('Chỉ cho phép tối đa 8 hình ảnh!');
            return;
        }
        for (const f of files) {
            if (!VALID_TYPES.includes(f.type)) { toastError('Chỉ cho phép JPG, PNG, WEBP'); return; }
            if (f.size > 5 * 1024 * 1024) { toastError('Ảnh tối đa 5MB'); return; }
        }
        const newImgs = files.map((file, i) => ({
            id: Date.now() + i + Math.random(),
            file,
            previewUrl: URL.createObjectURL(file),
            anhChinh: !images.some((img) => img.anhChinh) && i === 0,
            soThuTu: images.length + i + 1,
            isExisting: false,
        }));
        setImages((p) => [...p, ...newImgs]);
        e.target.value = null;
    };

    const handleSetMain = async (clicked) => {
        if (isView) return;

        if (clicked.isExisting) {
            if (!clicked.id) {
                toastError("Không tìm thấy mã định danh của ảnh để đặt làm ảnh chính!");
                return;
            }
            setConfirmConfig({
                title: 'Đặt ảnh chính',
                message: 'Bạn có chắc muốn đặt ảnh này làm ảnh chính không?',
                type: 'warning',
                confirmText: 'Xác nhận',
                action: async () => {
                    try {
                        await setMainHotelImageApi(clicked.id);

                        setImages(prev =>
                            prev.map(img => ({
                                ...img,
                                anhChinh: img.id === clicked.id
                            }))
                        );
                        toastSuccess('Đã đặt ảnh chính!');
                    } catch (err) {
                        toastError(getErrorMessage(err));
                    }
                },
            });
            setConfirmOpen(true);
        } else {
            setImages((p) => p.map((img) => ({ ...img, anhChinh: img.id === clicked.id })));
        }
    };

    const handleRemoveImage = (img) => {
        if (isView) return;

        if (img.anhChinh) {
            toastError('Không thể xóa ảnh chính! Hãy chọn ảnh khác làm ảnh chính trước.');
            return;
        }

        if (img.isExisting) {
            if (!img.id) {
                toastError("Không tìm thấy mã định danh của ảnh để thực hiện xóa!");
                return;
            }
            setConfirmConfig({
                title: 'Xóa ảnh',
                message: 'Bạn có chắc chắn muốn xóa ảnh này không?',
                type: 'danger',
                confirmText: 'Xóa',
                action: async () => {
                    try {
                        await deleteHotelImageApi(img.id);
                        setImages((p) => {
                            let updated = p.filter(x => x.id !== img.id);

                            if (updated.length > 0 && !updated.some(x => x.anhChinh)) {
                                updated[0].anhChinh = true;
                            }

                            return updated.map((x, i) => ({
                                ...x,
                                soThuTu: i + 1
                            }));
                        });
                        toastSuccess('Đã xóa ảnh thành công!');
                    } catch (err) {
                        toastError(getErrorMessage(err));
                    }
                },
            });
            setConfirmOpen(true);
        } else {
            setImages((p) => {
                const updated = p.filter((x) => x.id !== img.id);
                if (updated.length > 0 && !updated.some((x) => x.anhChinh)) {
                    updated[0].anhChinh = true;
                }
                return updated.map((x, i) => ({ ...x, soThuTu: i + 1 }));
            });
        }
    };

    const availableAmenities = allAmenities.filter(
        (a) => !amenitiesSelected.some((s) => String(s.maTienIch) === String(a.maTienIch))
    );

    const addAmenity = () => {
        if (!selectedAmenityId) return;
        const found = allAmenities.find((a) => String(a.maTienIch) === String(selectedAmenityId));
        if (!found) { toastError('Không tìm thấy tiện nghi!'); return; }
        if (amenitiesSelected.some((a) => String(a.maTienIch) === String(found.maTienIch))) {
            toastError('Tiện nghi này đã được thêm!'); return;
        }
        setAmenitiesSelected((p) => [...p, found]);
        setSelectedAmenityId('');
        toastSuccess('Đã thêm tiện ích!');
    };

    const removeAmenity = (id) =>
        setAmenitiesSelected((p) => p.filter((a) => String(a.maTienIch) !== String(id)));

    const validate = () => {
        const e = {};
        if (!formData.tenKhachSan.trim()) e.tenKhachSan = 'Vui lòng nhập tên khách sạn.';
        if (!formData.moTa.trim()) e.moTa = 'Vui lòng nhập mô tả.';
        if (!formData.soDienThoai.trim()) {
            e.soDienThoai = 'Vui lòng nhập số điện thoại.';
        } else if (!/^(03|02|05|07|08|09|01[2|6|8|9])+([0-9]{8})$/.test(formData.soDienThoai.trim())) {
            e.soDienThoai = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0).';
        }
        if (!formData.soSao) e.soSao = 'Vui lòng chọn hạng sao.';
        if (!formData.diaChi.trim()) e.diaChi = 'Vui lòng nhập địa chỉ.';
        if (images.length === 0) e.images = 'Vui lòng thêm ít nhất 1 hình ảnh.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const buildFormData = (data, imgs) => {
        const fd = new FormData();
        fd.append('TenKhachSan', data.tenKhachSan.trim());
        fd.append('SoSao', data.soSao);
        fd.append('DiaChi', data.diaChi.trim());
        fd.append('SoDienThoai', data.soDienThoai.trim());
        fd.append('MoTa', data.moTa?.trim() || '');
        fd.append('TrangThai', data.trangThai);
        amenitiesSelected.forEach((a) => fd.append('MaTienIch', a.maTienIch));

        const newImgs = imgs.filter((i) => !i.isExisting);
        const sorted = [...newImgs].sort((a, b) => (b.anhChinh ? 1 : 0) - (a.anhChinh ? 1 : 0));
        sorted.forEach((img) => { if (img.file) fd.append('images', img.file); });
        return fd;
    };

    const executeAdd = async () => {
        try {
            setLoading(true);
            await createHotelApi(buildFormData(formData, images));
            toastSuccess('Thêm khách sạn thành công!');
            onSave?.();
            onClose?.();
        } catch (err) {
            toastError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const executeUpdate = async () => {
        try {
            setLoading(true);
            await updateHotelApi(hotelId, buildFormData(formData, images));
            toastSuccess('Cập nhật khách sạn thành công!');
            onSave?.();
            onClose?.();
        } catch (err) {
            toastError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        if (isView || !validate()) return;

        if (isEdit) {
            setConfirmConfig({
                title: 'Xác nhận cập nhật',
                message: `Bạn có chắc chắn muốn cập nhật khách sạn "${formData.tenKhachSan}" không?`,
                type: 'warning',
                confirmText: 'Cập nhật',
                action: executeUpdate,
            });
            setConfirmOpen(true);
        } else {
            executeAdd();
        }
    };

    const content = (
        <div
            className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            style={isOverlay ? { maxHeight: '95vh' } : {}}
        >
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-50 rounded-t-3xl">
                <h2 className="text-xl font-semibold text-slate-800">
                    {isAdd ? 'Thêm Khách Sạn Mới'
                        : isEdit ? 'Cập Nhật Khách Sạn'
                            : 'Chi Tiết Khách Sạn'}
                </h2>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 hover:text-red-600 rounded-2xl cursor-pointer transition-colors"
                    >
                        <X size={22} />
                    </button>
                )}
            </div>

            <div className="overflow-y-auto flex-1 p-6 lg:p-8 space-y-10">
                {/* ── Hình ảnh ── */}
                <section>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                        Hình ảnh ({images.length}/8)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {images.map((img) => (
                            <div
                                key={img.id}
                                className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group"
                            >
                                <img src={img.previewUrl} className="w-full h-full object-cover" alt="preview" />
                                {img.anhChinh && (
                                    <span className="absolute top-2 left-2 bg-sky-500 text-white text-xs px-3 py-1 rounded font-medium">
                                        Ảnh chính
                                    </span>
                                )}
                                {!isView && (
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all">
                                        {!img.anhChinh && (
                                            <button
                                                onClick={() => handleSetMain(img)}
                                                className="bg-sky-400 text-white px-4 py-1 rounded-xl text-sm cursor-pointer"
                                            >
                                                Đặt làm chính
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleRemoveImage(img)}
                                            className="bg-red-500 text-white px-4 py-1 rounded-xl text-sm cursor-pointer"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {!isView && images.length < 8 && (
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="aspect-square border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center text-slate-400 hover:border-sky-500 hover:text-sky-500 transition-colors"
                            >
                                <ImagePlus size={40} className="mb-2" />
                                <span className="text-sm font-medium">Tải ảnh</span>
                            </button>
                        )}
                    </div>
                    <input
                        type="file" ref={fileInputRef} multiple accept="image/*"
                        onChange={handleImageAdd} className="hidden"
                    />
                    {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
                </section>

                <section>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                        Thông tin cơ bản
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Tên khách sạn" name="tenKhachSan" required disabled={isView} value={formData.tenKhachSan} onChange={handleInput} error={errors.tenKhachSan} Icon={Building2} />
                        <InputField label="Số điện thoại" name="soDienThoai" required disabled={isView} value={formData.soDienThoai} onChange={handleInput} error={errors.soDienThoai} Icon={Phone} />
                        <InputField label="Địa chỉ chi tiết" name="diaChi" required disabled={isView} value={formData.diaChi} onChange={handleInput} error={errors.diaChi} Icon={MapPin} />
                        <Dropdown
                            label="Hạng sao" value={formData.soSao}
                            options={STAR_OPTIONS}
                            onChange={(v) => setFormData((p) => ({ ...p, soSao: v }))}
                            disabled={isView} error={errors.soSao} fullWidth
                        />
                    </div>
                    <div className="mt-6">
                        <InputField label="Mô tả tổng quan" name="moTa" multiline rows={3} disabled={isView} value={formData.moTa} onChange={handleInput} error={errors.moTa} Icon={AlignLeft} />
                    </div>
                </section>

                <section>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                        Tiện ích ({amenitiesSelected.length})
                    </p>
                    {!isView && (
                        <div className="flex gap-3 mb-4">
                            <div className="flex-1">
                                <SelectField
                                    value={selectedAmenityId}
                                    options={availableAmenities}
                                    valueKey="maTienIch" labelKey="tenTienIch"
                                    searchable searchText="Tìm tiện ích..."
                                    onChange={setSelectedAmenityId}
                                />
                            </div>
                            <button
                                onClick={addAmenity} disabled={!selectedAmenityId}
                                className="px-6 py-2.5 text-sm bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-medium disabled:opacity-50 transition-colors cursor-pointer"
                            >
                                Thêm
                            </button>
                            <button
                                onClick={() => setShowCreateAmenityModal(true)}
                                className="px-6 py-2.5 text-sm bg-sky-400 hover:bg-sky-600 text-white rounded-2xl font-medium cursor-pointer transition-colors"
                            >
                                Thêm mới
                            </button>
                        </div>
                    )}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 min-h-[72px]">
                        {amenitiesSelected.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {amenitiesSelected.map((a) => (
                                    <div
                                        key={a.maTienIch}
                                        className="group flex items-center gap-2 px-3 py-2 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-sm font-medium transition-all hover:bg-sky-100"
                                    >
                                        <span>{a.tenTienIch}</span>
                                        {!isView && (
                                            <button
                                                onClick={() => removeAmenity(a.maTienIch)}
                                                className="rounded-full p-1 hover:bg-red-100 hover:text-red-600 transition cursor-pointer"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-10">
                                <p className="text-slate-400 text-sm">Chưa chọn tiện nghi nào</p>
                            </div>
                        )}
                    </div>
                </section>

                {!isAdd && <section>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Trạng thái</p>
                    <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold text-slate-700">Trạng thái hợp tác</span>
                            <span className={`text-xs font-medium ${formData.trangThai ? 'text-green-600' : 'text-slate-400'}`}>
                                {formData.trangThai
                                    ? 'Khách sạn đang trong trạng thái hợp tác'
                                    : 'Khách sạn đã ngưng hợp tác'}
                            </span>
                        </div>
                        {isView ? (
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide ${formData.trangThai ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                {formData.trangThai ? 'Đang hợp tác' : 'Ngưng hợp tác'}
                            </span>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-semibold ${formData.trangThai ? 'text-green-600' : 'text-slate-400'}`}>
                                    {formData.trangThai ? 'Bật' : 'Tắt'}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setFormData((p) => ({ ...p, trangThai: !p.trangThai }))}
                                    className={`relative inline-flex h-7 w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${formData.trangThai ? 'bg-green-500 focus:ring-green-400' : 'bg-slate-300 focus:ring-slate-300'}`}
                                >
                                    <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ${formData.trangThai ? 'translate-x-[26px]' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        )}
                    </div>
                </section>}
            </div>

            {/* Footer */}
            {!isView && (
                <div className="border-t border-slate-200 p-6 flex justify-end gap-4 bg-slate-50 rounded-b-3xl">
                    <button
                        onClick={handleSubmit} disabled={loading}
                        className="px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-medium flex items-center gap-2 disabled:opacity-70 cursor-pointer text-sm transition-colors"
                    >
                        {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />}
                        {isAdd ? 'Thêm Khách Sạn' : 'Lưu Thay Đổi'}
                    </button>
                </div>
            )}
        </div>
    );

    const subModals = (
        <>
            <CreateAmenityModal
                isOpen={showCreateAmenityModal}
                onClose={() => setShowCreateAmenityModal(false)}
                onSuccess={async () => { await loadAmenities(); setShowCreateAmenityModal(false); }}
            />
            <ConfirmModal
                isOpen={confirmOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
                confirmText={confirmConfig.confirmText}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={async () => { await confirmConfig.action?.(); setConfirmOpen(false); }}
            />
        </>
    );

    if (isOverlay) {
        return (
            <>
                <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4">
                    {content}
                </div>
                {subModals}
            </>
        );
    }

    return (
        <>
            <div className="p-4">{content}</div>
            {subModals}
        </>
    );
}