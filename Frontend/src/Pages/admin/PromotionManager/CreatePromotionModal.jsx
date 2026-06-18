import React, { useState } from "react";
import { X } from "lucide-react";

import InputField from "~/components/UI/Form/InputField";

import { createPromotionApi } from "~/Services/PromotionService";
import { toastSuccess, toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";


export default function CreatePromotionModal({
    isOpen,
    onClose,
    onSuccess
}) {
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({});

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

        setErrors({});
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: ""
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!form.maCode.trim()) {
            newErrors.maCode = "Vui lòng nhập mã code";
        }

        if (!form.tenUuDai.trim()) {
            newErrors.tenUuDai = "Vui lòng nhập tên ưu đãi";
        }

        if (!form.dieuKienApDung.trim()) {
            newErrors.dieuKienApDung =
                "Vui lòng nhập điều kiện áp dụng";
        }

        if (!form.phanTramGiam) {
            newErrors.phanTramGiam =
                "Vui lòng nhập phần trăm giảm";
        } else if (
            Number(form.phanTramGiam) <= 0 ||
            Number(form.phanTramGiam) > 100
        ) {
            newErrors.phanTramGiam =
                "Phần trăm giảm phải từ 1 đến 100";
        }

        if (!form.soLuongToiDa) {
            newErrors.soLuongToiDa =
                "Vui lòng nhập số lượng tối đa";
        } else if (
            Number(form.soLuongToiDa) < 1
        ) {
            newErrors.soLuongToiDa =
                "Số lượng tối đa phải lớn hơn 0";
        }

        if (!form.ngayBatDau) {
            newErrors.ngayBatDau =
                "Vui lòng chọn ngày bắt đầu";
        }

        if (!form.ngayHetHan) {
            newErrors.ngayHetHan =
                "Vui lòng chọn ngày hết hạn";
        }

        if (
            form.ngayBatDau &&
            form.ngayHetHan &&
            new Date(form.ngayBatDau) >=
            new Date(form.ngayHetHan)
        ) {
            newErrors.ngayHetHan =
                "Ngày hết hạn phải lớn hơn ngày bắt đầu";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        try {
            if (!validate()) return;

            setLoading(true);

            const payload = {
                maCode: form.maCode
                    .trim()
                    .toUpperCase(),

                tenUuDai: form.tenUuDai.trim(),

                phanTramGiam: Number(
                    form.phanTramGiam
                ),

                dieuKienApDung:
                    form.dieuKienApDung.trim(),

                ngayBatDau:
                    form.ngayBatDau
                ,

                ngayHetHan:
                    form.ngayHetHan
                ,

                soLuongToiDa: Number(
                    form.soLuongToiDa
                )
            };

            await createPromotionApi(payload);

            toastSuccess(
                "Thêm ưu đãi thành công"
            );

            resetForm();

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

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-999 flex items-center justify-center">
            <div className="bg-white rounded-3xl w-full max-w-2xl p-6">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl ml-1 font-bold">
                        Thêm ưu đãi
                    </h2>

                    <button onClick={handleClose}>
                        <X size={22} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-4">
                    <InputField
                        label="Mã code"
                        value={form.maCode}
                        error={errors.maCode}
                        onChange={(e) => {
                            const value =
                                e.target.value
                                    .normalize("NFD")
                                    .replace(
                                        /[\u0300-\u036f]/g,
                                        ""
                                    )
                                    .replace(
                                        /[^a-zA-Z0-9]/g,
                                        ""
                                    )
                                    .toUpperCase();

                            handleChange(
                                "maCode",
                                value
                            );
                        }}
                    />

                    <InputField
                        label="Tên ưu đãi"
                        value={form.tenUuDai}
                        error={errors.tenUuDai}
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
                        error={errors.phanTramGiam}
                        onChange={(e) =>
                            handleChange(
                                "phanTramGiam",
                                e.target.value
                            )
                        }
                    />

                    <InputField
                        label="Điều kiện áp dụng"
                        value={form.dieuKienApDung}
                        error={
                            errors.dieuKienApDung
                        }
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
                        min={new Date()
                            .toISOString()
                            .slice(0, 16)}
                        value={form.ngayBatDau}
                        error={errors.ngayBatDau}
                        onChange={(e) =>
                            handleChange(
                                "ngayBatDau",
                                e.target.value
                            )
                        }
                    />

                    <InputField
                        label="Ngày hết hạn"
                        type="datetime-local"
                        value={form.ngayHetHan}
                        error={errors.ngayHetHan}
                        onChange={(e) =>
                            handleChange(
                                "ngayHetHan",
                                e.target.value
                            )
                        }
                    />


                </div>
                <InputField
                    label="Số lượng tối đa"
                    type="number"
                    value={form.soLuongToiDa}
                    error={errors.soLuongToiDa}
                    onChange={(e) =>
                        handleChange(
                            "soLuongToiDa",
                            e.target.value
                        )
                    }
                />
                <div className="flex justify-end gap-3 mt-8">
                    <button
                        onClick={handleClose}
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
                            disabled:opacity-50
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