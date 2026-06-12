import React, { useState } from "react";
import { X, Upload } from "lucide-react";

import InputField from "~/components/UI/Form/InputField";
import Dropdown from "~/components/Common/Dropdown";

import { createStaffApi } from "~/Services/StaffService";
import { toastSuccess, toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";

export default function CreateStaffModal({
    isOpen,
    onClose,
    onSuccess
}) {

    const [loading, setLoading] = useState(false);

    const [previewImage, setPreviewImage] = useState(null);

    const [form, setForm] = useState({
        hoTen: "",
        email: "",
        matkhau: "",
        soDienThoai: "",
        gioiTinh: true,
        duongDanAnh: null,
        diaChi: "",
        ngaySinh: "",
        trangThai: 2,
        maVaiTro: 2
    });

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toastError("Ảnh không được vượt quá 2MB");
            return;
        }

        setForm(prev => ({
            ...prev,
            duongDanAnh: file
        }));

        setPreviewImage(URL.createObjectURL(file));
    };

    const validate = () => {

        if (!form.hoTen.trim())
            return "Vui lòng nhập họ tên";

        if (!form.email.trim())
            return "Vui lòng nhập email";

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(form.email))
            return "Email không hợp lệ";

        if (!form.matkhau.trim())
            return "Vui lòng nhập mật khẩu";

        if (form.matkhau.length < 8)
            return "Mật khẩu tối thiểu 8 ký tự";

        const phoneRegex = /^0\d{9}$/;

        if (!phoneRegex.test(form.soDienThoai))
            return "Số điện thoại không hợp lệ";

        if (!form.ngaySinh)
            return "Vui lòng chọn ngày sinh";

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
            formData.append("Matkhau", form.matkhau);
            formData.append("SoDienThoai", form.soDienThoai);
            formData.append("GioiTinh", form.gioiTinh);
            formData.append("DiaChi", form.diaChi);
            formData.append("NgaySinh", form.ngaySinh);
            formData.append("TrangThai", form.trangThai);
            formData.append("MaVaiTro", form.maVaiTro);

            if (form.duongDanAnh) {
                formData.append(
                    "DuongDanAnh",
                    form.duongDanAnh
                );
            }

            await createStaffApi(formData);

            toastSuccess(
                "Thêm nhân viên thành công"
            );

            onSuccess?.();
            onClose();

        } catch (error) {

            toastError(
                getErrorMessage(error)
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-999 flex items-center justify-center">

            <div className="bg-white rounded-3xl w-full max-w-4xl p-6">

                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">
                        Thêm nhân viên
                    </h2>

                    <button onClick={onClose}>
                        <X size={22} />
                    </button>
                </div>

                <div className="flex gap-6 mb-6">

                    <div className="w-40 h-40 shrink-0">

                        <label
                            className="
                            border-2 border-dashed
                            border-slate-300
                            rounded-2xl
                            h-full w-full
                            flex flex-col
                            items-center
                            justify-center
                            cursor-pointer
                            overflow-hidden
                        "
                        >

                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt=""
                                    className="
                                    w-full
                                    h-full
                                    object-cover
                                "
                                />
                            ) : (
                                <>
                                    <Upload size={28} />
                                    <span className="text-xs text-center">
                                        Upload ảnh
                                    </span>
                                </>
                            )}

                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </label>

                    </div>

                    <div className="flex-1">
                        <InputField
                            label="Họ tên"
                            value={form.hoTen}
                            onChange={(e) =>
                                handleChange(
                                    "hoTen",
                                    e.target.value
                                )
                            }
                        />
                        <div className="mt-5">
                            <InputField
                                label="Email"
                                value={form.email}
                                onChange={(e) =>
                                    handleChange(
                                        "email",
                                        e.target.value
                                    )
                                }
                            />
                        </div>


                    </div>

                </div>

                <div className="grid grid-cols-2 gap-5">


                    <InputField
                        label="Số điện thoại"
                        value={form.soDienThoai}
                        onChange={(e) =>
                            handleChange(
                                "soDienThoai",
                                e.target.value
                            )
                        }
                    />

                    <InputField
                        label="Mật khẩu"
                        type="password"
                        value={form.matkhau}
                        onChange={(e) =>
                            handleChange(
                                "matkhau",
                                e.target.value
                            )
                        }
                    />

                    <InputField
                        label="Ngày sinh"
                        type="date"
                        value={form.ngaySinh}
                        onChange={(e) =>
                            handleChange(
                                "ngaySinh",
                                e.target.value
                            )
                        }
                    />
                    <InputField
                        label="Địa chỉ"
                        value={form.diaChi}
                        onChange={(e) =>
                            handleChange(
                                "diaChi",
                                e.target.value
                            )
                        }
                    />

                    <Dropdown
                        label="Giới tính"
                        placeholder="Giới tính"
                        value={form.gioiTinh}
                        onChange={(value) =>
                            handleChange(
                                "gioiTinh",
                                value
                            )
                        }
                        options={[
                            {
                                value: true,
                                label: "Nam"
                            },
                            {
                                value: false,
                                label: "Nữ"
                            }
                        ]}
                    />

                    <Dropdown
                        label="Chức danh"
                        placeholder="Vai trò"
                        value={form.maVaiTro}
                        onChange={(value) =>
                            handleChange(
                                "maVaiTro",
                                value
                            )
                        }
                        options={[
                            {
                                value: 2,
                                label: "Nhân viên"
                            },
                            {
                                value: 3,
                                label: "Quản lý"
                            }
                        ]}
                    />




                </div>

                <div className="flex justify-end gap-3 mt-8">

                    <button
                        onClick={onClose}
                        className="
                        px-6 py-2
                        rounded-xl
                        bg-slate-100
                    "
                    >
                        Hủy
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="
                        px-6 py-2
                        rounded-xl
                        bg-sky-500
                        text-white
                    "
                    >
                        {loading
                            ? "Đang lưu..."
                            : "Lưu"}
                    </button>

                </div>

            </div>

        </div>
    );


}
