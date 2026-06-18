import React, { useState, useEffect } from 'react';
import { X, Edit2 } from 'lucide-react';
import InputField from '~/components/UI/Form/InputField';
import { updateTypeLocationApi } from '~/Services/TypeLocationService';
import { toastError, toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';

export default function UpdateTypeLocationModal({ 
    isOpen, 
    initialData, 
    onClose, 
    onSuccess, 
    setConfirmConfig, 
    setConfirmOpen 
}) {
    const [tenLoaiDD, setTenLoaiDD] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && initialData) {
            setTenLoaiDD(initialData.tenLoaiDD || '');
            setError('');
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!tenLoaiDD.trim()) {
            setError('Vui lòng nhập tên loại địa điểm.');
            return;
        }

        if (tenLoaiDD.trim() === initialData.tenLoaiDD) {
            onClose();
            return;
        }

        setConfirmConfig({
            title: "Xác nhận cập nhật",
            message: `Bạn có chắc chắn muốn đổi tên thành "${tenLoaiDD.trim()}" không?`,
            type: "warning",
            confirmText: "Cập nhật",
            action: async () => {
                try {
                    setLoading(true);
                    const payload = { TenLoaiDD: tenLoaiDD.trim() }; 
                    await updateTypeLocationApi(initialData.maLoaiDD, payload);
                    toastSuccess("Cập nhật loại địa điểm thành công!");
                    onSuccess();
                    onClose();
                } catch (err) {
                    toastError(getErrorMessage(err));
                } finally {
                    setLoading(false);
                }
            }
        });
        setConfirmOpen(true);
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col">
                <div className="flex items-center justify-between m-4 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        Cập Nhật Loại Địa Điểm
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-red-600 hover:bg-slate-100 p-2 rounded-xl transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 pt-0">
                    <InputField
                        label="Tên Loại Địa Điểm"
                        name="tenLoaiDD"
                        value={tenLoaiDD}
                        onChange={(e) => {
                            setTenLoaiDD(e.target.value);
                            if (error) setError('');
                        }}
                        error={error}
                        autoFocus
                    />
                    <div className="flex items-center justify-end gap-3 mt-8">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer">
                            Hủy bỏ
                        </button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-[#0EA5E5] hover:bg-[#0284c7] transition-all shadow-sm flex items-center gap-2 disabled:opacity-70 cursor-pointer">
                            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                            Cập Nhật
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}