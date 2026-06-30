import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';
import InputField from '~/components/UI/Form/InputField';
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';
import { changePasswordApi } from '~/Services/UserProfile';
import { toastSuccess, toastError } from '~/utils/Toast';
import { getErrorMessage } from '~/utils/errorHelper';

export default function ChangePasswordModal({ isOpen, onClose   }) {
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

        if (!formData.matKhau) {
            newErrors.matKhau = ["Nhập mật khẩu hiện tại"];
        }

        if (!formData.matKhauMoi) {
            newErrors.matKhauMoi = ["Nhập mật khẩu mới"];
        } else if (formData.matKhauMoi.length < 8) {
            newErrors.matKhauMoi = ["Tối thiểu 8 ký tự"];
        } else if (!passwordRegex.test(formData.matKhauMoi)) {
            newErrors.matKhauMoi = ["Phải có chữ hoa, thường, số và ký tự đặc biệt"];
        }
        
        if (!formData.xacNhanMatKhau) {
            newErrors.xacNhanMatKhau = ["Nhập xác nhận mật khẩu"];
        }
        else if (formData.matKhauMoi !== formData.xacNhanMatKhau) {
            newErrors.xacNhanMatKhau = ["Mật khẩu xác nhận không khớp"];
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
};

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // if (errors[name]) {
        //     setErrors(prev => ({ ...prev, [name]: null }));
        // }
        if (Object.keys(errors).length > 0) {
        setErrors({});
    }
    };

    const handleConfirmSubmit = async () => {
        setErrors({}); 
        try {
            await changePasswordApi(formData);
            toastSuccess("Đổi mật khẩu thành công!");
            setFormData({ matKhau: '', matKhauMoi: '', xacNhanMatKhau: ''});
            onClose();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toastError("Đổi mật khẩu thất bại", getErrorMessage(error));
            }
        } finally {
            setConfirmOpen(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setConfirmOpen(true);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Lock size={20} className="text-sky-500" /> Đổi mật khẩu
                        </h3>
                        <button onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <InputField 
                            label="Mật khẩu hiện tại" 
                            type="password" 
                            name="matKhau" 
                            value={formData.matKhau} 
                            onChange={handleChange} 
                            error={errors.matKhau?.[0]} 
                            required 
                        />
                        <InputField 
                            label="Mật khẩu mới" 
                            type="password" 
                            name="matKhauMoi" 
                            value={formData.matKhauMoi} 
                            onChange={handleChange} 
                            error={errors.matKhauMoi?.[0]} 
                            required 
                        />
                        <InputField 
                            label="Xác nhận mật khẩu mới" 
                            type="password" 
                            name="xacNhanMatKhau" 
                            value={formData.xacNhanMatKhau} 
                            onChange={handleChange} 
                            error={errors.xacNhanMatKhau?.[0]} 
                            required 
                        />

                        <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5">
                            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-50">Hủy</button>
                            <button type="submit" className="rounded-xl bg-sky-500 px-5 py-2.5 font-medium text-white hover:bg-sky-600">Xác nhận đổi</button>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmOpen}
                title="Xác nhận đổi mật khẩu"
                message="Bạn có chắc chắn muốn thay đổi mật khẩu không?"
                confirmText="Đổi mật khẩu"
                type="info"
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleConfirmSubmit}
            />
        </>
    );
}