import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import InputField from "~/components/UI/Form/InputField";
import { createBannerApi } from "~/Services/BannerService";
import { toastSuccess, toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";

export default function CreateBannerModal({ isOpen, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        tieuDe: "",
        linkLienKet: "",
        duongDanAnh: null
    });

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
        const newErrors = {};
        if (!form.tieuDe.trim()) {
            newErrors.tieuDe = "Vui lòng nhập tiêu đề banner"
        }

        if (!form.duongDanAnh) {
            newErrors.duongDanAnh = "Vui lòng chọn hình ảnh banner"
        }
        if (!form.linkLienKet.trim()) {
            newErrors.linkLienKet = "Vui lòng nhập link liên kết"
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();

            formData.append("TieuDe", form.tieuDe);
            if (form.linkLienKet) {
                formData.append("LinkLienKet", form.linkLienKet);
            }
            formData.append("TrangThai", true);
            formData.append("DuongDanAnh", form.duongDanAnh);

            await createBannerApi(formData);

            toastSuccess("Thêm banner mới thành công!");
            onSuccess?.();
            handleClose();

        } catch (error) {
            toastError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setForm({ tieuDe: "", linkLienKet: "", trangThai: true, duongDanAnh: null });
        if (previewImage) URL.revokeObjectURL(previewImage);
        setPreviewImage(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center">
            <div className="bg-white rounded-3xl w-full max-w-3xl p-6 shadow-2xl">

                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">Thêm Banner Mới</h2>
                    <button onClick={handleClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={22} className="text-slate-500" />
                    </button>
                </div>

                <div className="flex flex-col gap-6 mb-6">
                    <div className="w-full flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Hình ảnh (Tối đa 10MB)
                            <span className="text-red-500">*</span>
                        </label>
                            <label
                                className="
                                    border-2 border-dashed
                                    border-sky-300
                                    bg-sky-50
                                    rounded-2xl
                                    h-64
                                    w-full
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    cursor-pointer
                                    overflow-hidden
                                    hover:bg-sky-100
                                    transition-colors
                                "
                            >
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <>
                                        <Upload
                                            size={40}
                                            className="text-sky-500 mb-3"
                                        />

                                        <span className="text-sm font-medium text-sky-700">
                                            Nhấn để tải ảnh lên
                                        </span>

                                        <span className="text-xs text-sky-500 mt-1">
                                            JPG, PNG, WEBP (Max 10MB)
                                        </span>
                                    </>
                                )}

                                <input
                                    hidden
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    onChange={handleImageChange}
                                />
                            </label>
                        {errors.duongDanAnh && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.duongDanAnh}
                            </p>
                        )}
                    </div>


                    <div className="space-y-5">
                        <InputField
                            label="Tiêu đề Banner"
                            value={form.tieuDe}
                            onChange={(e) =>
                                handleChange(
                                    "tieuDe",
                                    e.target.value
                                )
                            }
                            placeholder="Nhập tiêu đề..."
                            error={errors.tieuDe}
                        />

                        <InputField
                            label="Link liên kết (Tùy chọn)"
                            value={form.linkLienKet}
                            onChange={(e) =>
                                handleChange(
                                    "linkLienKet",
                                    e.target.value
                                )
                            }
                            placeholder="https://vidu.com/khuyen-mai"
                            error={errors.linkLienKet}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">


                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                        {loading ? "Đang lưu..." : "Lưu Banner"}
                    </button>
                </div>
            </div>
        </div>
    );
}