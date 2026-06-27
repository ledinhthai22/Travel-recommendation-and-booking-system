import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import InputField from '~/components/UI/Form/InputField';
import { updateTypeTourApi } from '~/Services/TypeTourService';
import { toastError, toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';
import ConfirmModal from "~/components/UI/Modal/ConfirmModal";

export default function UpdateTypeTourModal({ isOpen, initialData = null, onClose, onSuccess }) {
    const [tenLoaiTour, setTenLoaiTour] = useState('');
    const [trangThai, setTrangThai] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTenLoaiTour(initialData.tenLoaiTour || '');
            setTrangThai(initialData.trangThai !== undefined ? initialData.trangThai : true);
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!tenLoaiTour.trim()) {
            toastError("Lỗi", "Vui lòng nhập tên loại tour");
            return;
        }
        setShowConfirm(true);
    };

    const handleUpdate = async () => {
        if (!tenLoaiTour.trim() || !initialData?.maLoaiTour) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('TenLoaiTour', tenLoaiTour.trim());
            formData.append('TrangThai', trangThai);

            await updateTypeTourApi(initialData.maLoaiTour, formData);

            toastSuccess("Cập nhật loại tour thành công!");
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between m-4">
                    <h3 className="text-xl font-semibold text-slate-800">Cập Nhật Loại Tour</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-red-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 pt-0 space-y-4">
                    <InputField
                        label="Tên loại tour"
                        placeholder="Nhập tên loại tour..."
                        value={tenLoaiTour}
                        onChange={(e) => setTenLoaiTour(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-slate-700">
                            Trạng thái hoạt động:
                        </label>

                        <button
                            type="button"
                            onClick={() => setTrangThai(!trangThai)}
                            disabled={loading}
                            className={`
                                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                                ${trangThai ? "bg-sky-500" : "bg-slate-300"}
                                ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                            `}
                        >
                            <span
                                className={`
                                    inline-block h-4 w-4 transform rounded-full bg-white transition
                                    ${trangThai ? "translate-x-6" : "translate-x-1"}
                                `}
                            />
                        </button>

                        <span className="text-sm text-slate-600">
                            {trangThai ? "Hoạt động" : "Ngưng hoạt động"}
                        </span>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading || !tenLoaiTour.trim()}
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
                message={`Bạn có chắc muốn cập nhật loại tour này không?`}
                onConfirm={handleUpdate}
                onCancel={() => setShowConfirm(false)}
            />
        </div>
    );
}