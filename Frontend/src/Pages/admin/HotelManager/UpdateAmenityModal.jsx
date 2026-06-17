// UpdateAmenityModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import InputField from '~/components/UI/Form/InputField';
import { updateAmenityApi } from '~/Services/Amenities';
import { toastError, toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';

export default function UpdateAmenityModal({ 
    isOpen, 
    initialData = null, 
    onClose, 
    onSuccess 
}) {
    const [tenTienNghi, setTenTienNghi] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTenTienNghi(initialData.tenTienNghi || '');
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!tenTienNghi.trim() || !initialData?.maTienNghi) return;

        setLoading(true);
        try {
            await updateAmenityApi(initialData.maTienNghi, { 
                tenTienNghi: tenTienNghi.trim() 
            });
            toastSuccess("Cập nhật tiện nghi thành công!");
            onSuccess?.();
            onClose();
        } catch (error) {
            toastError("Cập nhật thất bại", getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-xl font-semibold text-slate-800">Cập Nhật Tiện Nghi</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <InputField
                        label="Tên tiện nghi"
                        placeholder="Nhập tên tiện nghi..."
                        value={tenTienNghi}
                        onChange={(e) => setTenTienNghi(e.target.value)}
                        required
                        disabled={loading}
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
                            disabled={loading || !tenTienNghi.trim()}
                            className="flex-1 py-3 px-6 rounded-xl bg-[#0EA5E5] hover:bg-[#0284c7] text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            Cập nhật
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}