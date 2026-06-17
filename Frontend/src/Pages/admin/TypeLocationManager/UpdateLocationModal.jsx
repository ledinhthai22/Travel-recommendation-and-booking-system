import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import InputField from '~/components/UI/Form/InputField';
import SelectField from '~/components/UI/Form/SelectField';

export default function LocationModal({
    isOpen,
    onClose,
    mode = 'add',
    initialData = null,
    onSave
}) {
    const [formData, setFormData] = useState({
        name: '',
        province: '',
        category: '',
        rating: '',
        image: '',
        description: '',
    });

    const [errors, setErrors] = useState({});

    // 🔒 Lock scroll + ESC close
    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = 'hidden';

        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) return;

        if (initialData) {
            setFormData({
                name: initialData.name || '',
                province: initialData.province || '',
                category: initialData.category || '',
                rating: initialData.rating?.toString() || '',
                image: initialData.image || '',
                description: initialData.description || '',
            });
        } else {
            setFormData({ name: '', province: '', category: '', rating: '', image: '', description: '' });
        }

        setErrors({});
    }, [isOpen, initialData, mode]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Tên địa điểm không được để trống";
        if (!formData.province.trim()) newErrors.province = "Tỉnh/thành phố không được để trống";
        if (!formData.category) newErrors.category = "Vui lòng chọn loại hình";
        if (!formData.rating) newErrors.rating = "Vui lòng nhập đánh giá";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const newLocation = {
            id: initialData?.id || Date.now(),
            name: formData.name,
            province: formData.province,
            status: initialData?.status || "open",
            rating: parseFloat(formData.rating) || 4.5,
            image: formData.image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600",
            category: formData.category,
            activeTours: initialData?.activeTours || 0,
            revenue: initialData?.revenue || "0M",
            avatars: initialData?.avatars || ["https://i.pravatar.cc/150?u=new"],
            description: formData.description,
        };

        onSave(newLocation, mode);
        onClose();
    };

    if (!isOpen) return null;

    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';

    
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            onClick={handleOverlayClick}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col animate-scaleIn">

                <div className="flex items-center justify-between px-8 py-5">
                    <h2 className="text-xl font-bold text-slate-800">
                        {isViewMode ? 'Chi tiết địa điểm' : isEditMode ? 'Chỉnh sửa địa điểm' : 'Thêm địa điểm'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <InputField
                            label="Tên địa điểm"
                            value={formData.name}
                            onChange={(v) => handleChange('name', v)}
                            disabled={isViewMode}
                            error={errors.name}
                        />

                        <InputField
                            label="Tỉnh / Thành phố"
                            value={formData.province}
                            onChange={(v) => handleChange('province', v)}
                            disabled={isViewMode}
                            error={errors.province}
                        />

                        <SelectField
                            label="Loại hình"
                            value={formData.category}
                            onChange={(v) => handleChange('category', v)}
                            disabled={isViewMode}
                            error={errors.category}
                            options={[
                                { value: "Du lịch Biển", label: "Du lịch Biển" },
                                { value: "Vùng Núi", label: "Vùng Núi" },
                                { value: "Phố Cổ", label: "Phố Cổ" },
                                { value: "Di sản", label: "Di sản" },
                            ]}
                        />

                        <InputField
                            label="Đánh giá"
                            type="number"
                            value={formData.rating}
                            onChange={(v) => handleChange('rating', v)}
                            disabled={isViewMode}
                            error={errors.rating}
                        />

                        <div className="md:col-span-2">
                            <InputField
                                label="Link hình ảnh"
                                value={formData.image}
                                onChange={(v) => handleChange('image', v)}
                                disabled={isViewMode}
                            />
                        </div>

                        <div className="md:col-span-2">
                            Mô tả
                            <textarea
                              
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                disabled={isViewMode}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl bg-gray-100  outline-none"
                                placeholder="Mô tả..."
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl"
                        >
                            Đóng
                        </button>

                        {!isViewMode && (
                            <button
                                type="submit"
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                {isEditMode ? 'Cập nhật' : 'Thêm'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
            <style>
                {`@keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scaleIn {
                    animation: scaleIn 0.2s ease;
                }`}
            </style>
        </div>
    );
}
