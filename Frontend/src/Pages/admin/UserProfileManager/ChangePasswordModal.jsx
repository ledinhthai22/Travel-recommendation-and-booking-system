import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';
import InputField from '~/components/UI/Form/InputField';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';
import { changePasswordApi } from '~/Services/UserProfile';
import { toastSuccess, toastError } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';

export default function ChangePasswordModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({ matKhau: '', matKhauMoi: '', xacNhanMatKhau: '' });
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [errors, setErrors] = useState({});

    React.useEffect(() => {
        if (isOpen) {
            setFormData({ matKhau: '', matKhauMoi: '', xacNhanMatKhau: ''});
            setErrors({});
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const validateForm = () => {
        const newErrors = {};
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

        if (!formData.matKhau) newErrors.matKhau = ["Vui lòng nhập mật khẩu hiện tại"];
        if (!formData.matKhauMoi) {
            newErrors.matKhauMoi = ["Vui lòng nhập mật khẩu mới"];
        } else if (formData.matKhauMoi.length < 8) {
            newErrors.matKhauMoi = ["Mật khẩu phải tối thiểu từ 8 ký tự"];
        } else if (!passwordRegex.test(formData.matKhauMoi)) {
            newErrors.matKhauMoi = ["Yêu cầu bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"];
        }
        
        if (!formData.xacNhanMatKhau) {
            newErrors.xacNhanMatKhau = ["Vui lòng nhập lại mật khẩu xác nhận"];
        } else if (formData.matKhauMoi !== formData.xacNhanMatKhau) {
            newErrors.xacNhanMatKhau = ["Mật khẩu xác nhận không khớp"];
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (Object.keys(errors).length > 0) setErrors({});
    };

    const handleConfirmSubmit = async () => {
        setErrors({}); 
        try {
            await changePasswordApi(formData);
            toastSuccess("Đổi bảo mật mật khẩu thành công!");
            setFormData({ matKhau: '', matKhauMoi: '', xacNhanMatKhau: ''});
            onClose();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toastError("Thay đổi mật khẩu không thành công", getErrorMessage(error));
            }
        } finally {
            setConfirmOpen(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) setConfirmOpen(true);
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
                <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Lock size={18} className="text-sky-500" /> Thiết lập mật khẩu mới
                        </h3>
                        <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition">
                            <X size={18} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <InputField label="Mật khẩu hiện tại" type="password" name="matKhau" value={formData.matKhau} onChange={handleChange} error={errors.matKhau?.[0]} required />
                        <InputField label="Mật khẩu mới" type="password" name="matKhauMoi" value={formData.matKhauMoi} onChange={handleChange} error={errors.matKhauMoi?.[0]} required />
                        <InputField label="Xác nhận mật khẩu mới" type="password" name="xacNhanMatKhau" value={formData.xacNhanMatKhau} onChange={handleChange} error={errors.xacNhanMatKhau?.[0]} required />

                        <div className="mt-8 flex justify-end gap-2.5 border-t border-slate-100 pt-4">
                            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
                                Hủy bỏ
                            </button>
                            <button type="submit" className="rounded-xl bg-sky-500 px-5 py-2 text-xs font-bold text-white hover:bg-sky-600 shadow-sm shadow-sky-500/10 transition">
                                Cập nhật mật khẩu
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmOpen}
                title="Yêu cầu thay đổi mật khẩu"
                message="Sếp có chắc chắn muốn áp dụng cấu hình mật khẩu mới này không?"
                confirmText="Xác nhận đổi"
                type="info"
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleConfirmSubmit}
            />
        </>
    );
}