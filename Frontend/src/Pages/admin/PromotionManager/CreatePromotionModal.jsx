import React, { useState } from "react";
import { X } from "lucide-react";

import InputField from "~/components/UI/Form/InputField";

import { createPromotionApi } from "~/Services/PromotionService";
import { toastSuccess, toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";
import { toUTC } from "~/Helper/ToUTC";
export default function CreatePromotionModal({
    isOpen,
    onClose,
    onSuccess
}) {

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        maCode: "",
        tenUuDai: "",
        phanTramGiam: "",
        dieuKienApDung: "",
        ngayBatDau: "",
        ngayHetHan: "",
        soLuongToiDa: ""
    });
    const resetForm = () => {
        setForm({
            maCode: "",
            tenUuDai: "",
            phanTramGiam: "",
            dieuKienApDung: "",
            ngayBatDau: "",
            ngayHetHan: "",
            soLuongToiDa: ""
        });
    };
    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validate = () => {

        if (!form.maCode.trim())
            return "Vui lòng nhập mã code";

        if (!form.tenUuDai.trim())
            return "Vui lòng nhập tên ưu đãi";

        if (!form.phanTramGiam)
            return "Vui lòng nhập phần trăm giảm";

        if (
            Number(form.phanTramGiam) <= 0 ||
            Number(form.phanTramGiam) > 100
        ) {
            return "Phần trăm giảm từ 1 đến 100";
        }

        if (
            form.dieuKienApDung === "" ||
            Number(form.dieuKienApDung) < 0
        ) {
            return "Điều kiện áp dụng không hợp lệ";
        }

        if (!form.ngayBatDau)
            return "Vui lòng chọn ngày bắt đầu";

        if (!form.ngayHetHan)
            return "Vui lòng chọn ngày hết hạn";

        if (
            new Date(toUTC(form.ngayBatDau)) >= new Date(toUTC(form.ngayHetHan))
        ) {
            return "Ngày hết hạn phải lớn hơn ngày bắt đầu";
        }

        if (
            !form.soLuongToiDa ||
            Number(form.soLuongToiDa) <= 0
        ) {
            return "Số lượng tối đa phải lớn hơn 0";
        }

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

            const payload = {
                maCode: form.maCode.trim().toUpperCase(),
                tenUuDai: form.tenUuDai.trim(),
                phanTramGiam: Number(
                    form.phanTramGiam
                ),
                dieuKienApDung: Number(
                    form.dieuKienApDung
                ),
                ngayBatDau: toUTC(form.ngayBatDau),
                ngayHetHan: toUTC(form.ngayHetHan),
                soLuongToiDa: Number(
                    form.soLuongToiDa
                )
            };

            await createPromotionApi(payload);

            toastSuccess(
                "Thêm ưu đãi thành công"
            );
            resetForm()
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

            <div className="bg-white rounded-3xl w-full max-w-3xl p-6">

                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">
                        Thêm ưu đãi
                    </h2>

                    <button onClick={onClose}>
                        <X size={22} />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-5">

                    <InputField
                        label="Mã code"
                        value={form.maCode}
                        onChange={(e) => {
                            const value = e.target.value
                                .normalize("NFD")
                                .replace(/[\u0300-\u036f]/g, "")
                                .replace(/[^a-zA-Z0-9]/g, "")
                                .toUpperCase();

                            handleChange("maCode", value);
                        }}
                    />

                    <InputField
                        label="Tên ưu đãi"
                        value={form.tenUuDai}
                        onChange={(e) =>
                            handleChange(
                                "tenUuDai",
                                e.target.value
                            )
                        }
                    />

                    <InputField
                        label="Phần trăm giảm (%)"
                        type="number"
                        value={form.phanTramGiam}
                        onChange={(e) =>
                            handleChange(
                                "phanTramGiam",
                                e.target.value
                            )
                        }
                    />

                    <InputField
                        label="Điều kiện áp dụng (VNĐ)"
                        type="number"
                        value={form.dieuKienApDung}
                        onChange={(e) =>
                            handleChange(
                                "dieuKienApDung",
                                e.target.value
                            )
                        }
                    />

                    <InputField
                        label="Ngày bắt đầu"
                        type="datetime-local"
                        min={new Date().toISOString().slice(0, 16)}
                        value={form.ngayBatDau}
                        onChange={(e) =>
                            handleChange("ngayBatDau", e.target.value)
                        }
                    />

                    <InputField
                        label="Ngày hết hạn"
                        type="datetime-local"
                        value={form.ngayHetHan}
                        onChange={(e) =>
                            handleChange(
                                "ngayHetHan",
                                e.target.value
                            )
                        }
                    />

                    <InputField
                        label="Số lượng tối đa"
                        type="number"
                        value={form.soLuongToiDa}
                        onChange={(e) =>
                            handleChange(
                                "soLuongToiDa",
                                e.target.value
                            )
                        }
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
                        {
                            loading
                                ? "Đang lưu..."
                                : "Lưu"
                        }
                    </button>

                </div>

            </div>

        </div>
    );
}