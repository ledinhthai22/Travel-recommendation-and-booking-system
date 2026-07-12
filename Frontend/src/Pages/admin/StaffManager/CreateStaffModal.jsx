import React, { useState } from "react";
import { X, Upload } from "lucide-react";

import InputField from "~/components/UI/Form/InputField";
import Dropdown from "~/components/Common/Dropdown";
import DatePicker from "~/components/UI/Form/DatePicker"; 

import { createStaffApi } from "~/Services/StaffService";
import { toastSuccess, toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";

export default function CreateStaffModal({
    isOpen,
    onClose,
    onSuccess
}) {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [previewImage, setPreviewImage] = useState(null);

    // Đồng bộ với backend: 1=Đang làm việc, 2=Nghỉ phép, 0=Nghỉ việc
    const [form, setForm] = useState({
        hoTen: "",
        email: "",
        matkhau: "",
        soDienThoai: "",
        gioiTinh: true,
        duongDanAnh: null,
        diaChi: "",
        cccd: "",
        ngaySinh: "", 
        trangThai: 1, // Mặc định: Đang làm việc
        maVaiTro: 2
    });

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toastError("Ảnh không được vượt quá 2MB");
            return;
        }

        // Revoke old preview URL if exists
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
        }

        setForm(prev => ({
            ...prev,
            duongDanAnh: file
        }));
        setPreviewImage(URL.createObjectURL(file));
    };

    const validate = () => {
        const newErrors = {};

        if (!form.hoTen.trim()) newErrors.hoTen = "Vui lòng nhập họ tên";
        if (!form.email.trim()) newErrors.email = "Vui lòng nhập email";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (form.email && !emailRegex.test(form.email))
            newErrors.email = "Email không hợp lệ";

        if (!form.matkhau.trim()) newErrors.matkhau = "Vui lòng nhập mật khẩu";
        else if (form.matkhau.length < 6)
            newErrors.matkhau = "Mật khẩu tối thiểu 6 ký tự";

        if (!form.cccd.trim()) newErrors.cccd = "Vui lòng nhập CCCD";

        const cccdRegex = /^\d{12}$/;
        if (form.cccd && !cccdRegex.test(form.cccd))
            newErrors.cccd = "CCCD phải gồm 12 số";

        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(form.soDienThoai))
            newErrors.soDienThoai = "Số điện thoại không hợp lệ";

        if (!form.ngaySinh) newErrors.ngaySinh = "Vui lòng chọn ngày sinh";
        if (!form.diaChi.trim()) newErrors.diaChi = "Vui lòng nhập địa chỉ";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            setLoading(true);
            const formData = new FormData();

            formData.append("HoTen", form.hoTen.trim());
            formData.append("Email", form.email.trim());
            formData.append("Matkhau", form.matkhau);
            formData.append("SoDienThoai", form.soDienThoai.trim());
            formData.append("GioiTinh", form.gioiTinh ? "true" : "false");
            formData.append("DiaChi", form.diaChi.trim());
            formData.append("Cccd", form.cccd.trim());
            formData.append("NgaySinh", form.ngaySinh);
            formData.append("TrangThai", String(form.trangThai));
            formData.append("MaVaiTro", String(form.maVaiTro));

            if (form.duongDanAnh) {
                formData.append("DuongDanAnh", form.duongDanAnh);
            }

            await createStaffApi(formData);
            toastSuccess("Thêm nhân viên thành công");
            
            // Reset form
            setForm({
                hoTen: "",
                email: "",
                matkhau: "",
                soDienThoai: "",
                gioiTinh: true,
                duongDanAnh: null,
                diaChi: "",
                cccd: "",
                ngaySinh: "",
                trangThai: 1,
                maVaiTro: 2
            });
            setPreviewImage(null);
            setErrors({});
            
            onSuccess?.();
            onClose();
        } catch (error) {
            toastError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        // Reset form khi đóng modal
        setForm({
            hoTen: "",
            email: "",
            matkhau: "",
            soDienThoai: "",
            gioiTinh: true,
            duongDanAnh: null,
            diaChi: "",
            cccd: "",
            ngaySinh: "",
            trangThai: 1,
            maVaiTro: 2
        });
        setPreviewImage(null);
        setErrors({});
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center">
            <div className="bg-white rounded-3xl w-full max-w-4xl p-6">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Thêm nhân viên</h2>
                    <button onClick={handleClose} disabled={loading}>
                        <X size={22} />
                    </button>
                </div>

                <div className="flex gap-6 mb-6">
                    <div className="w-40 h-40 shrink-0">
                        <label className="border-2 border-dashed border-slate-300 rounded-2xl h-full w-full flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <Upload size={28} />
                                    <span className="text-xs text-center">Upload ảnh</span>
                                </>
                            )}
                            <input hidden type="file" accept="image/*" onChange={handleImageChange} disabled={loading} />
                        </label>
                    </div>

                    <div className="flex-1">
                        <InputField
                            label="Họ tên"
                            value={form.hoTen}
                            onChange={(e) => handleChange("hoTen", e.target.value)}
                            error={errors.hoTen}
                            disabled={loading}
                        />
                        <div className="mt-5">
                            <InputField
                                label="Email"
                                value={form.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                error={errors.email}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <InputField
                        label="CCCD"
                        value={form.cccd}
                        onChange={(e) => handleChange("cccd", e.target.value)}
                        error={errors.cccd}
                        disabled={loading}
                    />
                    <DatePicker
                        label="Ngày sinh"
                        placeholderText="Chọn ngày sinh..."
                        value={form.ngaySinh}
                        onChange={(formattedDate) => handleChange("ngaySinh", formattedDate)}
                        maxDate={new Date()} 
                        error={errors.ngaySinh}
                        disabled={loading}
                    />

                    <InputField
                        label="Số điện thoại"
                        value={form.soDienThoai}
                        onChange={(e) => handleChange("soDienThoai", e.target.value)}
                        error={errors.soDienThoai}
                        disabled={loading}
                    />
                    <InputField
                        label="Mật khẩu"
                        type="password"
                        value={form.matkhau}
                        onChange={(e) => handleChange("matkhau", e.target.value)}
                        error={errors.matkhau}
                        disabled={loading}
                    />

                    <Dropdown
                        label="Chức danh"
                        placeholder="Vai trò"
                        value={form.maVaiTro.toString()}
                        onChange={(value) => handleChange("maVaiTro", parseInt(value))}
                        options={[
                            { value: "2", label: "Nhân viên" },
                            { value: "3", label: "Hướng dẫn viên" }
                        ]}
                        disabled={loading}
                    />
                    <Dropdown
                        label="Giới tính"
                        placeholder="Giới tính"
                        value={form.gioiTinh}
                        onChange={(value) => handleChange("gioiTinh", value)}
                        options={[
                            { value: true, label: "Nam" },
                            { value: false, label: "Nữ" }
                        ]}
                        error={errors.gioiTinh}
                        disabled={loading}
                    />
                </div>
                
                <div className="mt-5">
                    <Dropdown
                        label="Trạng thái"
                        placeholder="Trạng thái"
                        value={form.trangThai.toString()}
                        onChange={(value) => handleChange("trangThai", parseInt(value))}
                        options={[
                            { value: "1", label: "Đang làm việc" },
                            { value: "2", label: "Nghỉ phép" },
                            { value: "0", label: "Nghỉ việc" }
                        ]}
                        disabled={loading}
                    />
                </div>

                <div className="mt-2">
                    <InputField
                        label="Địa chỉ"
                        value={form.diaChi}
                        onChange={(e) => handleChange("diaChi", e.target.value)}
                        error={errors.diaChi}
                        disabled={loading}
                    />
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button 
                        onClick={handleClose} 
                        disabled={loading}
                        className="px-6 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition disabled:opacity-50"
                    >
                        {loading ? "Đang lưu..." : "Lưu"}
                    </button>
                </div>
            </div>
        </div>
    );
}