import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import InputField from "~/components/UI/Form/InputField";
import Dropdown from "~/components/Common/Dropdown";
import DatePicker from "~/components/UI/Form/DatePicker"; // Import DatePicker mới của bạn
import { createUserApi } from "~/Services/UserService";
import { toastSuccess, toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";

export default function CreateUserModal({ isOpen, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        hoTen: "",
        email: "",
        soDienThoai: "",
        ngaySinh: "", // Thêm trường ngaySinh vào state form
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
                ngaySinh: "", // Reset về rỗng khi mở lại modal
                matKhau: "",
                xacNhanMatKhau: "",
                gioiTinh: true,
                maVaiTro: 4
            });
            setErrors({});
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!form.hoTen.trim()) {
            newErrors.hoTen = "Vui lòng nhập họ tên";
        }

        if (!form.email.trim()) {
            newErrors.email = "Vui lòng nhập email";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email)) {
                newErrors.email = "Email không hợp lệ";
            }
        }

        if (!form.soDienThoai.trim()) {
            newErrors.soDienThoai = "Vui lòng nhập số điện thoại";
        } else {
            const phoneRegex = /^0\d{9}$/;
            if (!phoneRegex.test(form.soDienThoai)) {
                newErrors.soDienThoai = "Số điện thoại không hợp lệ";
            }
        }

        // Validate ngày sinh
        if (!form.ngaySinh) {
            newErrors.ngaySinh = "Vui lòng chọn ngày sinh";
        }

        if (!form.matKhau.trim()) {
            newErrors.matKhau = "Vui lòng nhập mật khẩu";
        } else if (form.matKhau.length < 8) {
            newErrors.matKhau = "Mật khẩu phải có ít nhất 8 ký tự";
        }

        if (!form.xacNhanMatKhau.trim()) {
            newErrors.xacNhanMatKhau = "Vui lòng xác nhận mật khẩu";
        } else if (form.matKhau !== form.xacNhanMatKhau) {
            newErrors.xacNhanMatKhau = "Mật khẩu xác nhận không khớp";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);

            const fd = new FormData();
            fd.append("hoTen", form.hoTen);
            fd.append("email", form.email);
            fd.append("soDienThoai", form.soDienThoai);
            fd.append("ngaySinh", form.ngaySinh);
            fd.append("matKhau", form.matKhau);
            fd.append("xacNhanMatKhau", form.xacNhanMatKhau);
            fd.append("gioiTinh", Boolean(form.gioiTinh));
            fd.append("maVaiTro", 4);

            const newUser = await createUserApi(fd);

            toastSuccess("Thêm khách hàng thành công!");
            onSuccess?.(newUser);
            onClose();
        } catch (error) {
            toastError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl w-full max-w-[440px] p-6 shadow-2xl overflow-y-auto max-h-[99vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Thêm khách hàng mới</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={22} className="text-slate-500" />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-5 mb-8">
                    <InputField
                        label="Họ và Tên *"
                        value={form.hoTen}
                        onChange={(e) => handleChange("hoTen", e.target.value)}
                        error={errors.hoTen}
                    />

                    <InputField
                        label="Email *"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        error={errors.email}
                    />
                    {/* TÍCH HỢP DATEPICKER CHỌN NĂM NHANH VÀO ĐÂY */}
                    <DatePicker
                        label="Ngày sinh *"
                        placeholderText="Chọn ngày sinh..."
                        value={form.ngaySinh}
                        onChange={(dateString) => handleChange("ngaySinh", dateString)}
                        error={errors.ngaySinh}
                        disabled={loading}
                    />
                    <InputField
                        label="Số điện thoại *"
                        value={form.soDienThoai}
                        onChange={(e) => handleChange("soDienThoai", e.target.value)}
                        error={errors.soDienThoai}
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
                        error={errors.matKhau}
                    />

                    <InputField
                        label="Xác nhận mật khẩu *"
                        type="password"
                        value={form.xacNhanMatKhau}
                        onChange={(e) => handleChange("xacNhanMatKhau", e.target.value)}
                        error={errors.xacNhanMatKhau}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                        {loading ? "Đang xử lý..." : "Thêm khách hàng"}
                    </button>
                </div>
            </form >
        </div >
    );
}