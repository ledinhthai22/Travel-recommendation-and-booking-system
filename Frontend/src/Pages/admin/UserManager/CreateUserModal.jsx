import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import InputField from "~/components/UI/Form/InputField";
import { createUserApi } from "~/Services/UserService";
import { toastSuccess, toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";

export default function CreateUserModal({ isOpen, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const [form, setForm] = useState({
        hoTen: "",
        email: "",
        soDienThoai: "",
        matKhau: "",
        xacNhanMatKhau: "",
        diaChi: "",
        ngaySinh: "", 
        maVaiTro: 4,
        duongDanAnh: null
    });

    useEffect(() => {
        if (isOpen) {
            setForm({
                hoTen: "",
                email: "",
                soDienThoai: "",
                matKhau: "",
                xacNhanMatKhau: "",
                diaChi: "",
                ngaySinh: "",
                maVaiTro: 4,
                duongDanAnh: null
            });
            setPreviewImage(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toastError("Ảnh không được vượt quá 10MB");
            return;
        }

        setForm(prev => ({ ...prev, duongDanAnh: file }));
        setPreviewImage(URL.createObjectURL(file));
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
            const formData = new FormData();

            formData.append("HoTen", form.hoTen);
            formData.append("Email", form.email);
            formData.append("MatKhau", form.matKhau);
            formData.append("XacNhanMatKhau", form.xacNhanMatKhau); 
            formData.append("SoDienThoai", form.soDienThoai);
            formData.append("MaVaiTro", "4"); 
            
            if (form.diaChi.trim()) {
                formData.append("DiaChi", form.diaChi);
            }
            if (form.ngaySinh) {
                formData.append("NgaySinh", form.ngaySinh);
            }
            if (form.duongDanAnh) {
                formData.append("DuongDanAnh", form.duongDanAnh);
            }

            const res = await createUserApi(formData);
            
            toastSuccess(res.message || "Thêm khách hàng thành công!");
            onSuccess?.();
            handleClose();

        } catch (error) {
            toastError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (form.duongDanAnh && previewImage) {
            URL.revokeObjectURL(previewImage);
        }
        setPreviewImage(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Thêm khách hàng mới</h2>
                    <button onClick={handleClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={22} className="text-slate-500" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-8 mb-6">
                    <div className="w-full md:w-1/3 flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">Ảnh đại diện (Tùy chọn)</label>
                        <label className="border-2 border-dashed border-sky-300 bg-sky-50 rounded-full aspect-square w-48 mx-auto flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:bg-sky-100 transition-colors">
                            {previewImage ? (
                                <img 
                                    src={previewImage} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <>
                                    <Upload size={28} className="text-sky-500 mb-2" />
                                    <span className="text-xs text-sky-700 font-medium text-center px-2">Tải ảnh lên<br/>(Max 10MB)</span>
                                </>
                            )}
                            <input hidden type="file" accept="image/png, image/jpeg, image/jpg, image/webp" onChange={handleImageChange} />
                        </label>
                    </div>

                    <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <InputField
                                label="Họ và Tên *"
                                value={form.hoTen}
                                onChange={(e) => handleChange("hoTen", e.target.value)}
                            />
                        </div>

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
                        <InputField
                            label="Địa chỉ"
                            value={form.diaChi}
                            onChange={(e) => handleChange("diaChi", e.target.value)}
                        />

                        <InputField
                            label="Ngày sinh"
                            type="date"
                            value={form.ngaySinh}
                            onChange={(e) => handleChange("ngaySinh", e.target.value)}
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
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                    <button
                        onClick={handleClose}
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