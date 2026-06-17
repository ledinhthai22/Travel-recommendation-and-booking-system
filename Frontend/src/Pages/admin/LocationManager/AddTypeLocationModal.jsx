import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import InputField from '~/components/UI/Form/InputField';
import { createTypeLocationApi } from '~/Services/TypeLocationService';
import { toastError, toastSuccess } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';

export default function AddTypeLocationModal({ isOpen, onClose, onSuccess }) {
    const [tenLoaiDD, setTenLoaiDD] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTenLoaiDD('');
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!tenLoaiDD.trim()) {
            setError('Vui lòng nhập tên loại địa điểm.');
            return;
        }

        try {
            setLoading(true);
            const payload = { TenLoaiDD: tenLoaiDD.trim() }; 
            await createTypeLocationApi(payload);
            toastSuccess("Thêm loại địa điểm thành công!");
            onSuccess();
        } catch (err) {
            toastError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        <Plus size={20} className="text-[#0EA5E5]" />
                        Thêm Loại Địa Điểm Mới
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <InputField
                        label="Tên Loại Địa Điểm"
                        name="tenLoaiDD"
                        placeholder="VD: Du lịch sinh thái, Biển..."
                        value={tenLoaiDD}
                        onChange={(e) => {
                            setTenLoaiDD(e.target.value);
                            if (error) setError('');
                        }}
                        error={error}
                        autoFocus
                    />

                    <div className="flex items-center justify-end gap-3 mt-8">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                            Hủy bỏ
                        </button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-[#0EA5E5] hover:bg-[#0284c7] transition-all shadow-sm flex items-center gap-2 disabled:opacity-70">
                            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                            Lưu Dữ Liệu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}