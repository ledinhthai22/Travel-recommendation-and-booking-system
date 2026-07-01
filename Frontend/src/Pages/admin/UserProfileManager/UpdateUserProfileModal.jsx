import { useState, useEffect, useRef } from "react";
import { X, Camera } from "lucide-react";
import InputField from "~/components/UI/Form/InputField";
import SelectField from "~/components/UI/Form/SelectField";
import { updateUserProfileApi } from "~/Services/UserProfile";
import useAuth from "~/Hooks/useAuth";
import { toastSuccess, toastError } from "~/utils/Toast";

export default function UpdateUserProfileModal({ isOpen, onClose, profileData, onUpdateSuccess }) {
    const { setUser } = useAuth();
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [errors, setErrors] = useState({});

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
            ngaySinh: profileData.ngaySinh ? new Date(profileData.ngaySinh).toLocaleDateString('en-CA') : ""
        });

        setPreviewUrl(profileData.duongDanAnh ? `https://localhost:7016${profileData.duongDanAnh}` : "");
        setSelectedFile(null);
        setErrors({});
    }, [profileData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenderChange = (value) => {
        setFormData((prev) => ({ ...prev, gioiTinh: value === "true" }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const img = new Image();
        img.onload = () => {
            if (img.width < 300 || img.height < 300) {
                toastError("Ảnh quá nhỏ", "Vui lòng chọn ảnh tối thiểu 300x300px");
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

        if (!formData.email || formData.email.trim() === "") {
            validationErrors.Email = ["Email không được để trống"];
        } else if (!emailRegex.test(formData.email)) {
            validationErrors.Email = ["Email không đúng định dạng"];
        }

        const phoneRegex = /^(0[3|5|7|8|9])+[0-9]{8}$/;
        if (formData.soDienThoai && !phoneRegex.test(formData.soDienThoai)) {
            validationErrors.SoDienThoai = ["Số điện thoại không hợp lệ"];
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
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

            if (formData.ngaySinh) data.append("NgaySinh", formData.ngaySinh);
            if (selectedFile) data.append("DuongDanAnh", selectedFile);

            const res = await updateUserProfileApi(data);
            toastSuccess(res?.message || "Cập nhật thông tin thành công");

            const currentUser = JSON.parse(localStorage.getItem("user"));
            const updatedUser = {
                ...currentUser,
                hoTen: formData.hoTen,
                email: formData.email,
                duongDanAnh: res.newImagePath || currentUser.duongDanAnh
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            window.dispatchEvent(new Event("profileUpdated"));
            onUpdateSuccess?.();
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100 max-h-[95vh] overflow-y-auto">

                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <h3 className="text-lg font-bold text-slate-800">Cập nhật hồ sơ cá nhân</h3>
                    <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6 flex flex-col items-center">
                        <div className="relative group">
                            {(!previewUrl || previewUrl === "undefined" || previewUrl === "null" || previewUrl.trim() === "") ? (
                                <div className="h-24 w-24 flex items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 text-white font-bold text-3xl shadow-md">
                                    {(formData.hoTen || "UN").substring(0, 2).toUpperCase()}
                                </div>
                            ) : (
                                <img src={previewUrl} alt="avatar" className="h-24 w-24 rounded-2xl border-2 border-sky-500/20 object-cover shadow-md" />
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white shadow-lg hover:bg-sky-600 transition-transform active:scale-95"
                            >
                                <Camera size={14} />
                            </button>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 font-medium">Khuyến nghị ảnh kích thước vuông từ 300px</p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <InputField label="Họ và tên" name="hoTen" value={formData.hoTen} onChange={handleChange} error={errors.HoTen?.[0]} />
                        <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.Email?.[0]} />
                        <InputField label="Số điện thoại" name="soDienThoai" value={formData.soDienThoai} onChange={handleChange} error={errors.SoDienThoai?.[0]} />
                        <InputField label="Ngày sinh" type="date" name="ngaySinh" value={formData.ngaySinh} onChange={handleChange} />


                    </div>
                    <div className="mt-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Giới tính</label>
                        <SelectField value={String(formData.gioiTinh)} onChange={handleGenderChange} options={[{ value: "true", label: "Nam" }, { value: "false", label: "Nữ" }]} />
                    </div>
                    <div className="mt-1">
                          <InputField label="Địa chỉ" multiline row ={3} name="diaChi" value={formData.diaChi} onChange={handleChange} />
                    </div>
                  
                    <div className="mt-8 flex justify-end gap-2.5 border-t border-slate-100 pt-4">
                        <button type="submit" className="rounded-xl bg-sky-500 px-5 py-2 text-xs font-bold text-white hover:bg-sky-600 shadow-sm shadow-sky-500/10 transition">
                            Cập nhật
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}