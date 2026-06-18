import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import {
    updateWebInfoApi,
    updateWebInfoStatusApi
} from '~/Services/WebInfoService'

import { toastSuccess, toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";
import InputField from "~/components/UI/Form/InputField";
import ConfirmModal from "~/components/UI/Modal/ConfirmModal";


export default function WebInfoEditModal({
    isOpen,
    onClose,
    data,
    onReload
}) {
    const [status, setStatus] = useState(false);
    const [noidung, setNoidung] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [toggleLoading, setToggleLoading] = useState(false);

    
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({});
    const validateByKey = (key, value) => {
        if (key === "so_dien_thoai" || key === "zalo") {
            const phoneRegex = /^(0|\+84)[0-9]{9}$/;

            if (!value || !value.trim()) {
                return "Không được để trống";
            }

            if (!phoneRegex.test(value.trim())) {
                return "Số điện thoại không hợp lệ";
            }
        }

        if (key === "email_hotro") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!value || !value.trim()) {
                return "Email không được để trống";
            }

            if (!emailRegex.test(value.trim())) {
                return "Email không hợp lệ";
            }
        }

        return null;
    };
    useEffect(() => {
        if (data) {
            setStatus(data.trangthai);
            setNoidung(data.noidung || '');
            setLogoFile(null);
            setLogoPreview('');
        }
    }, [data]);

    if (!isOpen || !data) return null;

    const isLogo = data.key === 'logo_url';

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        
        if (file.type !== "image/png" && !file.name.endsWith('.png')) {
            toastError("Thông báo lỗi", "Chỉ chấp nhận ảnh định dạng .png");
            e.target.value = ""; 
            return;
        }

        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
    };


    const handleToggleStatus = async () => {
        try {
            const newStatus = !status;

            setToggleLoading(true);
            setStatus(newStatus);

            await updateWebInfoStatusApi(data.maTTTrang, newStatus);

            toastSuccess("Cập nhật trạng thái thành công", data.key);
            onReload?.();

        } catch (error) {
            setStatus(prev => !prev);
            toastError("Cập nhật thất bại", getErrorMessage(error));
        } finally {
            setToggleLoading(false);
        }
    };


    const handleSaveClick = () => {
        setConfirmConfig({
            title: "Xác nhận cập nhật",
            message: `Bạn có chắc muốn cập nhật "${data.key}" không?`,
            type: "warning",
            confirmText: "Cập nhật",
            action: handleSaveConfirm
        });

        setConfirmOpen(true);
    };


    const handleSaveConfirm = async () => {
        const error = validateByKey(data.key, noidung);

        if (error) {
            toastError("Thông báo lỗi", error);
            setLoading(false);
            setConfirmOpen(false);
            return;
        }
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("trangthai", status);

            if (isLogo) {
                if (logoFile) {
                    formData.append("logo", logoFile);
                }
            } else {
                if (!noidung?.trim()) {
                    toastError(`${data.key} không được để trống`);
                    return;
                }
                formData.append("noidung", noidung);
            }

            await updateWebInfoApi(data.maTTTrang, formData);

            toastSuccess("Cập nhật thành công", data.key);
            onReload?.();
            onClose();

        } catch (error) {
            toastError("Cập nhật thất bại", getErrorMessage(error));
        } finally {
            setLoading(false);
            setConfirmOpen(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-999 flex justify-center items-center">
                <div className="bg-white rounded-3xl w-full max-w-xl p-6">


                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-bold text-xl">
                            Chỉnh sửa thông tin trang
                        </h2>
                        <button onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-5">

                        <div>
                            <label className="text-sm text-slate-500">Key</label>
                            <div className="font-mono text-blue-600 mt-1">
                                {data.key}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-slate-500">Nội dung</label>

                            {isLogo ? (
                                <div className="space-y-3">
                                    <img
                                        src={
                                            logoPreview ||
                                            (data.noidung
                                                ? `https://localhost:7016${data.noidung}`
                                                : "")
                                        }
                                        className="h-24 object-contain"
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                    />
                                </div>
                            ) : (
                                <InputField
                                    value={noidung}
                                    onChange={(e) => setNoidung(e.target.value)}
                                />
                            )}
                        </div>

                        <div>
                            <label className="text-sm text-slate-500">
                                Trạng thái hiển thị
                            </label>

                            <div className="mt-3 flex items-center gap-3">
                                <button
                                    onClick={handleToggleStatus}
                                    disabled={toggleLoading}
                                    className={`w-12 h-6 rounded-full transition-all
                                        ${status ? "bg-green-500" : "bg-gray-300"}
                                    `}
                                >
                                    <span
                                        className={`block w-5 h-5 bg-white rounded-full transition-transform
                                            ${status ? "translate-x-6" : "translate-x-0"}
                                        `}
                                    />
                                </button>

                                <span className="text-sm">
                                    {status ? "Đang hiển thị" : "Đang ẩn"}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-slate-500">
                                Ngày cập nhật
                            </label>
                            <div className="text-sm mt-1">
                                {new Date(data.ngayCapNhat).toLocaleString("vi-VN")}
                            </div>
                        </div>

                    </div>


                    <div className="flex gap-3 mt-8">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-100 rounded-xl"
                        >
                            Hủy
                        </button>

                        <button
                            onClick={handleSaveClick}
                            disabled={loading}
                            className="flex-1 py-3 bg-sky-500 text-white rounded-xl flex items-center justify-center gap-2"
                        >
                           
                            {loading ? "Đang lưu..." : "Lưu"}
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                confirmText={confirmConfig.confirmText}
                type={confirmConfig.type}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={confirmConfig.action}
            />
        </>
    );
}