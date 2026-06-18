import { useState, useEffect, useRef } from "react";
import { X, Camera } from "lucide-react";
import { updateUserProfileApi } from "~/Services/UserProfile";
import { toastSuccess, toastError } from "~/utils/Toast";
import useAuth from "~/Hooks/useAuth";

export default function UpdateUserProfileModal({ isOpen, onClose, profileData, onUpdateSuccess }) {
    const { setUser } = useAuth();
    const [formData, setFormData] = useState({
        maNguoiDung: 0,
        hoTen: "",
        email: "",
        soDienThoai: "",
        diaChi: "",
        gioiTinh: true,
        ngaySinh: ""
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const fileInputRef = useRef(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (profileData && isOpen) {
            let formattedDate = "";
            if (profileData.ngaySinh) {
                formattedDate = new Date(profileData.ngaySinh).toISOString().split('T')[0];
            }

            setFormData({
                maNguoiDung: profileData.maNguoiDung || 0,
                hoTen: profileData.hoTen || "",
                email: profileData.email || "",
                soDienThoai: profileData.soDienThoai || "",
                diaChi: profileData.diaChi || "",
                gioiTinh: profileData.gioiTinh ?? true,
                ngaySinh: formattedDate
            });
            setPreviewUrl(profileData.duongDanAnh ? `https://localhost:7016${profileData.duongDanAnh}` : "");
            setSelectedFile(null);
        }
    }, [profileData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "gioiTinh" ? value === "true" : value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toastError("File ảnh không được vượt quá 10MB!");
                return;
            }
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const newErrors = {};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.Email = ["Email không đúng định dạng!"];
        }

        const phoneRegex = /^(0[3|5|7|8|9])+[0-9]{8}$/;
        if (formData.soDienThoai && !phoneRegex.test(formData.soDienThoai)) {
            newErrors.SoDienThoai = ["Số điện thoại không hợp lệ!"];
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            const data = new FormData();
            data.append("MaNguoiDung", formData.maNguoiDung);
            data.append("HoTen", formData.hoTen);
            data.append("Email", formData.email);
            data.append("SoDienThoai", formData.soDienThoai);
            data.append("DiaChi", formData.diaChi);
            data.append("GioiTinh", formData.gioiTinh);
            
            if (formData.ngaySinh) {
                data.append("NgaySinh", formData.ngaySinh);
            }

            if (selectedFile) {
                data.append("DuongDanAnh", selectedFile);
            }

            const res = await updateUserProfileApi(data);
            toastSuccess(res?.message || "Cập nhật thành công!");
            onUpdateSuccess(); 
            setUser(prevUser => ({
                ...prevUser,
                hoTen: formData.hoTen,
                email: formData.email,
                duongDanAnh: selectedFile ? URL.createObjectURL(selectedFile) : prevUser.duongDanAnh
            }));
            onClose();
        } catch (error) {
            if (error.response?.data?.errors) {
            setErrors(error.response.data.errors); 
        } else {
            toastError(error.response?.data || "Có lỗi xảy ra");
        }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="text-xl font-bold text-slate-800">Chỉnh sửa thông tin cá nhân</h3>
                    <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="relative">
                            <img
                                src={previewUrl || "https://i.pravatar.cc/200?img=32"}
                                alt="Avatar Preview"
                                className="h-24 w-24 rounded-full object-cover border-2 border-sky-500"
                            />
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-white shadow hover:bg-sky-600 transition"
                            >
                                <Camera size={14} />
                            </button>
                        </div>
                        <span className="text-xs text-slate-400">Hỗ trợ JPG, PNG, GIF tối đa 10MB</span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-slate-600">Họ và tên</label>
                            <input
                                type="text"
                                name="hoTen"
                                value={formData.hoTen}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-sky-500 transition"
                            />
                            {errors.HoTen && <p className="text-xs text-red-500 mt-1">{errors.HoTen[0]}</p>}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-600">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-sky-500 transition"
                            />
                            {errors.Email && <p className="text-xs text-red-500 mt-1">{errors.Email[0]}</p>}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-600">Số điện thoại</label>
                            <input
                                type="text"
                                name="soDienThoai"
                                value={formData.soDienThoai}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-sky-500 transition"
                            />
                            {errors.soDienThoai && <p className="text-xs text-red-500 mt-1">{errors.soDienThoai[0]}</p>}
                            
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-600">Ngày sinh</label>
                            <input
                                type="date"
                                name="ngaySinh"
                                value={formData.ngaySinh}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-sky-500 transition"
                            />
                            
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-600">Địa chỉ</label>
                            <input
                                type="text"
                                name="diaChi"
                                value={formData.diaChi}
                                onChange={handleChange}
                                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-sky-500 transition"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-600 block mb-2">Giới tính</label>
                            <div className="mt-3 flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input
                                        type="radio"
                                        name="gioiTinh"
                                        value="true"
                                        checked={formData.gioiTinh === true}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-sky-500"
                                    />
                                    Nam
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input
                                        type="radio"
                                        name="gioiTinh"
                                        value="false"
                                        checked={formData.gioiTinh === false}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-sky-500"
                                    />
                                    Nữ
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="rounded-lg bg-sky-500 px-4 py-2 text-sm text-white hover:bg-sky-600 transition"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}