import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import InputField from "~/components/UI/Form/InputField";
import Dropdown from "~/components/Common/Dropdown";
import { createUserApi } from "~/Services/UserService";
import { toastSuccess, toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";

export default function CreateUserModal({ isOpen, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        hoTen: "",
        email: "",
        soDienThoai: "",
        matKhau: "",
        xacNhanMatKhau: "",
        gioiTinh: true,
        maVaiTro: 4
    });

    useEffect(() => {
        if (isOpen) {
            setForm({
                hoTen: "",
                email: "",
                soDienThoai: "",
                matKhau: "",
                xacNhanMatKhau: "",
                gioiTinh: true,
                maVaiTro: 4
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const validate = () => {
        if (!form.hoTen.trim()) return "Vui lòng nhập họ tên";
        if (!form.email.trim()) return "Vui lòng nhập email";
        if (!form.soDienThoai.trim()) return "Vui lòng nhập số điện thoại";
        if (!form.matKhau.trim()) return "Vui lòng nhập mật khẩu";
        if (form.matKhau.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
        if (form.matKhau !== form.xacNhanMatKhau) return "Mật khẩu xác nhận không khớp";
        return null;
    };

    const handleSubmit = async () => {
        const error = validate();
        if (error) {
            toastError(error);
            return;
        }

        try {
            setLoading(true);
            const payload = {
                hoTen: form.hoTen,
                email: form.email,
                soDienThoai: form.soDienThoai,
                matKhau: form.matKhau,
                xacNhanMatKhau: form.xacNhanMatKhau,
                gioiTinh: Boolean(form.gioiTinh),
                maVaiTro: 4
            };

            await createUserApi(payload);
            toastSuccess("Thêm khách hàng thành công!");
            onSuccess?.();
            onClose();
        } catch (error) {
            toastError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Thêm khách hàng mới</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={22} className="text-slate-500" />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-5 mb-8">
                    <InputField
                        label="Họ và Tên *"
                        value={form.hoTen}
                        onChange={(e) => handleChange("hoTen", e.target.value)}
                    />

                    <InputField
                        label="Email *"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                    />

                    <InputField
                        label="Số điện thoại *"
                        value={form.soDienThoai}
                        onChange={(e) => handleChange("soDienThoai", e.target.value)}
                    />

                    <Dropdown
                        label="Giới tính"
                        placeholder="Chọn giới tính"
                        value={form.gioiTinh}
                        onChange={(value) => handleChange("gioiTinh", value)}
                        options={[
                            { value: true, label: "Nam" },
                            { value: false, label: "Nữ" }
                        ]}
                    />

                    <InputField
                        label="Mật khẩu *"
                        type="password"
                        value={form.matKhau}
                        onChange={(e) => handleChange("matKhau", e.target.value)}
                    />
                    
                    <InputField
                        label="Xác nhận mật khẩu *"
                        type="password"
                        value={form.xacNhanMatKhau}
                        onChange={(e) => handleChange("xacNhanMatKhau", e.target.value)} 
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                        {loading ? "Đang xử lý..." : "Thêm khách hàng"}
                    </button>
                </div>
            </div>
        </div>
    );
}