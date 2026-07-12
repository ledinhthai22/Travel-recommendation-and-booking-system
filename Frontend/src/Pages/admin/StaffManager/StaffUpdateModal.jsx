import React, { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";

import InputField from "~/components/UI/Form/InputField";
import Dropdown from "~/components/Common/Dropdown";
import DatePicker from "~/components/UI/Form/DatePicker"; 

import { getStaffByIdApi, updateStaffApi } from "~/Services/StaffService";
import { toastSuccess, toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";
import ConfirmModal from '~/components/UI/Modal/ConfirmModal';

export default function UpdateStaffModal({
    isOpen,
    onClose,
    staffId,
    onSuccess
}) {
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        hoTen: "",
        email: "",
        soDienThoai: "",
        gioiTinh: true,
        duongDanAnh: null,
        diaChi: "",
        cccd: "",
        ngaySinh: "",
        trangThai: 1, // 1=Đang làm việc
        maVaiTro: 2
    });
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({
        title: '',
        message: '',
        type: 'warning',
        confirmText: 'Xác nhận',
        action: null
    });

    useEffect(() => {
        if (!isOpen || !staffId) return;

        setErrors({});
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getStaffByIdApi(staffId);

                setForm({
                    hoTen: res.hoTen || "",
                    email: res.email || "",
                    soDienThoai: res.soDienThoai || "",
                    gioiTinh: res.gioiTinh ?? true,
                    diaChi: res.diaChi || "",
                    cccd: res.cccd || "",
                    ngaySinh: res.ngaySinh ? res.ngaySinh.split("T")[0] : "",
                    trangThai: res.trangThai ?? 1,
                    maVaiTro: res.maVaiTro ?? 2,
                    duongDanAnh: null
                });

                setPreviewImage(
                    res.duongDanAnh ? `https://localhost:7016${res.duongDanAnh}` : null
                );

            } catch (error) {
                toastError(getErrorMessage(error));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isOpen, staffId]);

    useEffect(() => {
        return () => {
            if (previewImage && previewImage.startsWith("blob:")) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

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

        if (previewImage && previewImage.startsWith("blob:")) {
            URL.revokeObjectURL(previewImage);
        }

        setForm(prev => ({ ...prev, duongDanAnh: file }));
        setPreviewImage(URL.createObjectURL(file));
    };

    const validate = () => {
        const newErrors = {};

        if (!form.hoTen.trim())
            newErrors.hoTen = "Vui lòng nhập họ tên";

        if (!form.email.trim())
            newErrors.email = "Vui lòng nhập email";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (form.email && !emailRegex.test(form.email))
            newErrors.email = "Email không hợp lệ";

        if (!form.cccd.trim())
            newErrors.cccd = "Vui lòng nhập CCCD";

        const cccdRegex = /^\d{12}$/;
        if (form.cccd && !cccdRegex.test(form.cccd))
            newErrors.cccd = "CCCD phải gồm 12 số";

        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(form.soDienThoai))
            newErrors.soDienThoai = "Số điện thoại không hợp lệ";

        if (!form.diaChi.trim())
            newErrors.diaChi = "Vui lòng nhập địa chỉ";

        if (!form.ngaySinh)
            newErrors.ngaySinh = "Vui lòng chọn ngày sinh";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitUpdate = async () => {
        if (!validate()) return;

        try {
            setLoading(true);
            const formData = new FormData();

            formData.append("HoTen", form.hoTen.trim());
            formData.append("Email", form.email.trim());
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

            await updateStaffApi(staffId, formData);
            toastSuccess("Cập nhật thông tin nhân viên thành công");
            await onSuccess?.();
            onClose();
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
            message: `Bạn có chắc muốn cập nhật nhân viên "${form.hoTen}" không?`,
            type: "warning",
            confirmText: "Cập nhật",
            action: submitUpdate
        });

        setConfirmOpen(true);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-999 flex items-center justify-center">
            <div className="bg-white rounded-3xl w-full max-w-4xl p-6">

                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Cập nhật nhân viên</h2>
                    <button onClick={onClose} disabled={loading}>
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
                    <InputField
                        label="Số điện thoại"
                        value={form.soDienThoai}
                        onChange={(e) => handleChange("soDienThoai", e.target.value)}
                        error={errors.soDienThoai}
                        disabled={loading}
                    />
                    <InputField
                        label="Địa chỉ"
                        value={form.diaChi}
                        onChange={(e) => handleChange("diaChi", e.target.value)}
                        error={errors.diaChi}
                        disabled={loading}
                    />

                    <DatePicker
                        label="Ngày sinh"
                        placeholderText="Chọn ngày sinh..."
                        value={form.ngaySinh}
                        onChange={(dateString) => handleChange("ngaySinh", dateString)} 
                        error={errors.ngaySinh}
                        disabled={loading}
                    />

                    <Dropdown
                        label="Giới tính"
                        placeholder="Giới tính"
                        value={form.gioiTinh}
                        onChange={(value) => handleChange("gioiTinh", value)}
                        options={[{ value: true, label: "Nam" }, { value: false, label: "Nữ" }]}
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

                <div className="flex justify-end gap-3 mt-8">
                    <button
                        onClick={handleConfirmUpdate}
                        disabled={loading}
                        className="px-6 py-2 rounded-xl bg-sky-500 text-white disabled:opacity-50"
                    >
                        {loading ? "Đang lưu..." : "Cập nhật"}
                    </button>
                </div>

            </div>

            <ConfirmModal
                isOpen={confirmOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                confirmText={loading ? "Đang xử lý..." : confirmConfig.confirmText}
                type={confirmConfig.type}
                onCancel={() => !loading && setConfirmOpen(false)}
                onConfirm={async () => {
                    await confirmConfig.action?.();
                    setConfirmOpen(false);
                }}
            />
        </div>
    );
}