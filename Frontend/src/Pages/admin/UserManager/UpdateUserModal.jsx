import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import InputField from "~/components/UI/Form/InputField";
import { updateUserApi } from "~/Services/UserService";
import Dropdown from "~/components/Common/Dropdown";
import { toastSuccess, toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";
import ConfirmModal from "~/components/UI/Modal/ConfirmModal";

export default function UpdateUserModal({ isOpen, onClose, onSuccess, userData }) {
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({
        title: '',
        message: '',
        type: 'warning',
        confirmText: 'Xác nhận',
        action: null
    });

    const [form, setForm] = useState({
        hoTen: "",
        email: "",
        soDienThoai: "",
        diaChi: "",
        ngaySinh: "",
        gioiTinh: true,
        maVaiTro: 4,
        duongDanAnh: null
    })

    useEffect(() => {
        if (isOpen && userData) {
            setErrors({});
            if (userData.duongDanAnh) {
            setPreviewImage(`https://localhost:7016${userData.duongDanAnh}`);
                } else {
                    setPreviewImage(null);
                }
            setForm({
                hoTen: userData.hoTen || "",
                email: userData.email || "",
                soDienThoai: userData.soDienThoai || "",
                maVaiTro: userData.maVaiTro || 4,
                diaChi: userData.diaChi || "",
                gioiTinh: userData.gioiTinh ?? true,
                ngaySinh: userData.ngaySinh
                    ? userData.ngaySinh.split("T")[0]
                    : "",
                duongDanAnh: null
            });
        }
    }, [isOpen, userData]);

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

        if (file.size > 10 * 1024 * 1024) {
            toastError("Ảnh không được vượt quá 10MB");
            return;
        }

        setForm(prev => ({ ...prev, duongDanAnh: file }));
        setPreviewImage(URL.createObjectURL(file));
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

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        try {
            setLoading(true);
            const formData = new FormData();

            formData.append("HoTen", form.hoTen);
            formData.append("Email", form.email);
            formData.append("SoDienThoai", form.soDienThoai);
            formData.append("GioiTinh", form.gioiTinh);
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

            const res = await updateUserApi(userData.maNguoiDung, formData);

            toastSuccess(res.message || "Cập nhật thành công!");
            onSuccess?.();
            handleClose();

        } catch (error) {
            toastError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmUpdate = () => {
    if (!validate()) return;

        setConfirmConfig({
            title: "Xác nhận cập nhật",
            message: `Bạn có chắc muốn cập nhật tài khoản "${form.hoTen}" không?`,
            type: "warning",
            confirmText: "Cập nhật",
            action: handleSubmit
        });

        setConfirmOpen(true);
    };

    const handleClose = () => {
        if (form.duongDanAnh && previewImage && previewImage.startsWith("blob:")) {
            URL.revokeObjectURL(previewImage);
        }
        setPreviewImage(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Cập nhật tài khoản</h2>
                    <button onClick={handleClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={22} className="text-slate-500" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-8 mb-6">
                    <div className="w-full md:w-1/3 flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">Ảnh đại diện</label>
                        <label className="border-2 border-dashed border-sky-300 bg-sky-50 rounded-full aspect-square w-48 mx-auto flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:bg-sky-100 transition-colors group">
                            {previewImage ? (
                                <div className="relative w-full h-full">
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = 'https://placehold.co/200x200?text=Lỗi+Ảnh' }}
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Upload className="text-white" />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Upload size={28} className="text-sky-500 mb-2" />
                                    <span className="text-xs text-sky-700 font-medium text-center px-2">Đổi ảnh mới<br />(Max 10MB)</span>
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
                                error={errors.hoTen}
                            />
                        </div>

                        <InputField
                            label="Email *"
                            type="email"
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            error={errors.email}
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
                        onClick={handleConfirmUpdate}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                        {loading ? "Đang xử lý..." : "Lưu thay đổi"}
                    </button>
                </div>
            </div>
           <ConfirmModal
                isOpen={confirmOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
                confirmText={loading ? "Đang xử lý..." : confirmConfig.confirmText}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={async () => {
                    await confirmConfig.action?.();
                    setConfirmOpen(false);
                }}
            />
        </div>
    );
}