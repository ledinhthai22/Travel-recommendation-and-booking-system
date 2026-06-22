import React, { useState } from 'react';
import { X } from 'lucide-react';
import InputField from '~/components/UI/Form/InputField';
// CHÚ Ý SỬA DÒNG NÀY: Trỏ chuẩn về TypeTourService
import { createTypeTourApi } from '~/Services/TypeTourService'; 
import { toastError, toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';

export default function AddTypeTourModal({ isOpen, onClose, onSuccess }) {
    const [tenLoaiTour, setTenLoaiTour] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!tenLoaiTour.trim()) {
            setError('Vui lòng nhập tên loại tour.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Vì API dùng "multipart/form-data", bọc vào FormData
            const formData = new FormData();
            formData.append('TenLoaiTour', tenLoaiTour.trim());

            await createTypeTourApi(formData);
            
            toastSuccess("Thêm loại tour thành công!");
            setTenLoaiTour('');
            onSuccess?.();
            onClose();
        } catch (error) {
            toastError("Thêm loại tour thất bại", getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between m-4 ">
                    <h3 className="text-xl font-semibold text-slate-800">Thêm Loại Tour Mới</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 pt-0">
                    <InputField
                        label="Tên loại hình tour"
                        placeholder="Ví dụ: Tour sinh thái, Tour nghỉ dưỡng..."
                        value={tenLoaiTour}
                        onChange={(e) => setTenLoaiTour(e.target.value)}
                        required
                        disabled={loading}
                        error={error}
                    />

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-6 rounded-xl border border-slate-300 font-medium text-slate-700 hover:bg-slate-50"
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-6 rounded-xl bg-[#0EA5E5] hover:bg-[#0284c7] text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            Thêm loại tour
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}