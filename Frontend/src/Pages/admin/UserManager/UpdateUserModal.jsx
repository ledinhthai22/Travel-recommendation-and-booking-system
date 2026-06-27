import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import InputField from "~/components/UI/Form/InputField";
import Dropdown from "~/components/Common/Dropdown";
import DatePicker from "~/components/UI/Form/DatePicker";
import { updateUserApi } from "~/Services/UserService";
import { toastSuccess, toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";

export default function UpdateUserModal({ isOpen, onClose, onSuccess, userData }) {
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        hoTen: "",
        email: "",
        soDienThoai: "",
        diaChi: "",
        ngaySinh: "",
        gioiTinh: true,
        maVaiTro: 4,
        duongDanAnh: null
    });

    useEffect(() => {
        if (isOpen && userData) {
            setErrors({});

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

            setPreviewImage(
                userData.duongDanAnh ? `https://localhost:7016${userData.duongDanAnh}` : null
            );
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

        if (previewImage && previewImage.startsWith("blob:")) {
            URL.revokeObjectURL(previewImage);
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

        if (!form.ngaySinh) {
            newErrors.ngaySinh = "Vui lòng chọn ngày sinh";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Nhận sự kiện (e) và bọc chặn reload trình duyệt giống file Create
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (!validate()) return;
        try {
            setLoading(true);
            const formData = new FormData();

            formData.append("HoTen", form.hoTen.trim());
            formData.append("Email", form.email.trim());
            formData.append("SoDienThoai", form.soDienThoai.trim());
            formData.append("GioiTinh", String(form.gioiTinh));
            formData.append("MaVaiTro", "4");

            if (form.diaChi.trim()) {
                formData.append("DiaChi", form.diaChi.trim());
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

    const handleClose = () => {
        if (previewImage && previewImage.startsWith("blob:")) {
            URL.revokeObjectURL(previewImage);
        }
        setPreviewImage(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
            {/* Chuyển đổi bọc ngoài thành thẻ form có onSubmit giống bản thêm mới */}
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl w-full max-w-4xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Cập nhật tài khoản</h2>
                    <button
                        type="button" // Ngăn kích hoạt nhầm submit
                        onClick={handleClose}
                        className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={22} className="text-slate-500" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6 mb-6">
                    {/* Khu vực Upload Ảnh */}
                    <div className="w-40 h-40 shrink-0 mx-auto md:mx-0">
                        <label className="border-2 border-dashed border-slate-300 rounded-2xl h-full w-full flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-slate-50 hover:bg-slate-100 transition-colors">
                            {previewImage ? (
                                <img src={previewImage} alt="Avatar Preview" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <Upload size={24} className="text-slate-400 mb-1" />
                                    <span className="text-xs text-slate-500 text-center px-2">Upload ảnh</span>
                                </>
                            )}
                            <input hidden type="file" accept="image/*" onChange={handleImageChange} disabled={loading} />
                        </label>
                    </div>

                    {/* Lưới các trường thông tin đầu vào */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <InputField
                                label="Họ và Tên *"
                                value={form.hoTen}
                                onChange={(e) => handleChange("hoTen", e.target.value)}
                                error={errors.hoTen}
                                disabled={loading}
                            />
                        </div>
                        <DatePicker
                            label="Ngày sinh *"
                            placeholderText="Chọn ngày sinh..."
                            value={form.ngaySinh}
                            onChange={(dateString) => handleChange("ngaySinh", dateString)}
                            error={errors.ngaySinh}
                            disabled={loading}
                        />
                        <InputField
                            label="Email *"
                            type="email"
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            error={errors.email}
                            disabled={loading}
                        />

                        <InputField
                            label="Số điện thoại *"
                            value={form.soDienThoai}
                            onChange={(e) => handleChange("soDienThoai", e.target.value)}
                            error={errors.soDienThoai}
                            disabled={loading}
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
                            disabled={loading}
                        />



                        <div className="sm:col-span-2">
                            <InputField
                                label="Địa chỉ"
                                value={form.diaChi}
                                onChange={(e) => handleChange("diaChi", e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>

                {/* Khu vực nút điều hướng hành động */}
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">


                    <button
                        type="submit" // Nút Submit form kích hoạt onSubmit
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                        {loading ? "Đang xử lý..." : "Lưu thay đổi"}
                    </button>
                </div>
            </form>
        </div>
    );
}