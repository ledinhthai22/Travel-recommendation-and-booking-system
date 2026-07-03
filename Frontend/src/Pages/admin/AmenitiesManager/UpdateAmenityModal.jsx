import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import InputField from '~/components/UI/Form/InputField';
import { updateAmenityApi } from '~/Services/Amenities';
import { toastError, toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
import ConfirmModal from "~/components/UI/Modal/ConfirmModal";

export default function UpdateAmenityModal({ isOpen, initialData = null, onClose, onSuccess }) {
    const [tenTienIch, setTenTienIch] = useState('');
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const amenityId = initialData?.maTienIch ?? initialData?.MaTienIch;

    useEffect(() => {
        if (initialData) {
            setTenTienIch(initialData.tenTienIch ?? initialData.TenTienIch ?? '');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!tenTienIch.trim()) {
            toastError("Lỗi", "Vui lòng nhập tên tiện nghi");
            return;
        }

        setShowConfirm(true);
    };

    const handleUpdate = async () => {
        if (!tenTienIch.trim() || !amenityId) return;

        setLoading(true);
        try {
            await updateAmenityApi(amenityId, {
                TenTienIch: tenTienIch.trim()
            });

            toastSuccess("Cập nhật tiện nghi thành công!");
            onSuccess?.();
            onClose();
        } catch (error) {
            toastError("Cập nhật thất bại", getErrorMessage(error));
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[999] p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between m-4">
                    <h3 className="text-xl font-semibold text-slate-800">Cập Nhật Tiện Nghi</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-red-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 pt-0">
                    <InputField
                        label="Tên tiện nghi"
                        placeholder="Nhập tên tiện nghi..."
                        value={tenTienIch}
                        onChange={(e) => setTenTienIch(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <div className="flex gap-3 pt-4">

                        <button
                            type="submit"
                            disabled={loading || !tenTienIch.trim()}
                            className="flex-1 py-3 px-6 rounded-xl bg-[#0EA5E5] hover:bg-[#0284c7] text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            Cập nhật
                        </button>
                    </div>
                </form>
            </div>
            
            <ConfirmModal
                isOpen={showConfirm}
                title="Xác nhận cập nhật"
                message={`Bạn có chắc muốn cập nhật tiện nghi "${tenTienIch}" không?`}
                onConfirm={handleUpdate}
                onCancel={() => setShowConfirm(false)}
            />
        </div>
    );
}