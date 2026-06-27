import { useState, useEffect, useRef } from "react";
import { X, Camera } from "lucide-react";

import InputField from "~/components/UI/Form/InputField";
import SelectField from "~/components/UI/Form/SelectField";

import { updateUserProfileApi } from "~/Services/UserProfile";
import useAuth from "~/Hooks/useAuth";

// import { AuthContext } from "~/Context/AuthContext";
import { toastSuccess, toastError } from "~/utils/Toast";

export default function UpdateUserProfileModal({
    isOpen,
    onClose,
    profileData,
    onUpdateSuccess
}) {
    const { setUser } = useAuth();

    const fileInputRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [errors, setErrors] = useState({});
    // const [confirmAction, setConfirmAction] = useState(null);//
    // const [confirmOpen, setConfirmOpen] = useState(false);

    const [formData, setFormData] = useState({
        maNguoiDung: 0,
        hoTen: "",
        email: "",
        soDienThoai: "",
        diaChi: "",
        gioiTinh: true,
        ngaySinh: ""
    });

    useEffect(() => {
        if (!profileData || !isOpen) return;

        setFormData({
            maNguoiDung: profileData.maNguoiDung || 0,
            hoTen: profileData.hoTen || "",
            email: profileData.email || "",
            soDienThoai: profileData.soDienThoai || "",
            diaChi: profileData.diaChi || "",
            gioiTinh: profileData.gioiTinh ?? true,
           ngaySinh: profileData.ngaySinh ? new Date(profileData.ngaySinh).toLocaleDateString('en-CA'):""
            });

        setPreviewUrl(
            profileData.duongDanAnh
                ? `https://localhost:7016${profileData.duongDanAnh}`
                : ""
        );

        setSelectedFile(null);
        setErrors({});
    }, [profileData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGenderChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            gioiTinh: value === "true"
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const img = new Image();

        img.onload = () => {
            const width = img.width;
            const height = img.height;

            if (width < 300 || height < 300) {
                toastError(
                    "Ảnh quá nhỏ",
                    "Vui lòng chọn ảnh tối thiểu 300x300px"
                );
                return;
            }

            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        };

        img.src = URL.createObjectURL(file);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({});

        const validationErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            formData.email &&
            !emailRegex.test(formData.email)
        ) {
            validationErrors.Email = [
                "Email không đúng định dạng"
            ];
        }

        const phoneRegex =
            /^(0[3|5|7|8|9])+[0-9]{8}$/;

        if (
            formData.soDienThoai &&
            !phoneRegex.test(formData.soDienThoai)
        ) {
            validationErrors.SoDienThoai = [
                "Số điện thoại không hợp lệ"
            ];
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const data = new FormData();

            data.append(
                "MaNguoiDung",
                formData.maNguoiDung
            );

            data.append("HoTen", formData.hoTen);
            data.append("Email", formData.email);
            data.append(
                "SoDienThoai",
                formData.soDienThoai
            );
            data.append("DiaChi", formData.diaChi);
            data.append(
                "GioiTinh",
                formData.gioiTinh
            );

            if (formData.ngaySinh) {
                data.append(
                    "NgaySinh",
                    formData.ngaySinh
                );
            }

            if (selectedFile) {
                data.append(
                    "DuongDanAnh",
                    selectedFile
                );
            }

            const res = await updateUserProfileApi(
                data
            );

            toastSuccess(
                res?.message ||
                "Cập nhật thông tin thành công"
            );

            const currentUser = JSON.parse(localStorage.getItem("user"));

            const updatedUser = {
                ...currentUser,
                hoTen: formData.hoTen,
                email: formData.email,
                duongDanAnh: previewUrl.startsWith("blob:") ? previewUrl : (res.newImagePath || currentUser.duongDanAnh)
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            onUpdateSuccess?.();

            onClose();
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                toastError(
                    error.response?.data ||
                    "Có lỗi xảy ra"
                );
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">

                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">
                            Cập nhật hồ sơ thông tin cá nhân
                        </h3>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-6"
                >
                    <div className="mb-8 flex flex-col items-center">
                        <div className="relative">
                            <img
                                src={
                                    previewUrl ||
                                    "https://i.pravatar.cc/200?img=32"
                                }
                                alt="avatar"
                                className="h-28 w-28 rounded-full border-4 border-sky-100 object-cover shadow-md "
                            />

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={
                                    handleFileChange
                                }
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white shadow-lg hover:bg-sky-600"
                            >
                                <Camera size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">

                        <InputField
                            label="Họ và tên"
                            name="hoTen"
                            value={formData.hoTen}
                            onChange={handleChange}
                            error={errors.HoTen?.[0]}
                        />

                        <InputField
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.Email?.[0]}
                        />

                        <InputField
                            label="Số điện thoại"
                            name="soDienThoai"
                            value={formData.soDienThoai}
                            onChange={handleChange}
                            error={
                                errors.SoDienThoai?.[0]
                            }
                        />

                        <InputField
                            label="Ngày sinh"
                            type="date"
                            name="ngaySinh"
                            value={formData.ngaySinh}
                            onChange={handleChange}
                        />

                        <InputField
                            label="Địa chỉ"
                            name="diaChi"
                            value={formData.diaChi}
                            onChange={handleChange}
                        />
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Giới tính</label>
                            <SelectField

                                value={String(
                                    formData.gioiTinh
                                )}
                                onChange={
                                    handleGenderChange
                                }
                                options={[
                                    {
                                        value: "true",
                                        label: "Nam"
                                    },
                                    {
                                        value: "false",
                                        label: "Nữ"
                                    }
                                ]}
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-200 px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-50"
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            className="rounded-xl bg-sky-500 px-5 py-2.5 font-medium text-white hover:bg-sky-600"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
