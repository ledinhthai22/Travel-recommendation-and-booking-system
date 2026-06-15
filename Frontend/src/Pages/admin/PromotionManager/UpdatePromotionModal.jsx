import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

import InputField from "~/components/UI/Form/InputField";
import Dropdown from "~/components/Common/Dropdown";
import ConfirmModal from "~/components/UI/Modal/ConfirmModal";

import {
    updatePromotionApi,
    changePromotionStatusApi
} from "~/Services/PromotionService";
import { toUTC } from "~/Helper/ToUTC";
import {
    toastSuccess,
    toastError
} from "~/utils/Toast";

import { getErrorMessage } from "~/utils/errorHelper";
import { toLocalInput } from "~/Helper/DateTime";
export default function UpdatePromotionModal({
    isOpen,
    onClose,
    onSuccess,
    promotion
}) {
    const [loading, setLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] =
        useState(false);

    const [confirmConfig, setConfirmConfig] =
        useState({
            title: "",
            message: "",
            type: "warning",
            confirmText: "Xác nhận",
            action: null
        });

    const [form, setForm] = useState({
        maCode: "",
        tenUuDai: "",
        phanTramGiam: "",
        dieuKienApDung: "",
        soLuongToiDa: "",
        ngayBatDau: "",
        ngayHetHan: ""
    });

    useEffect(() => {
        if (!promotion) return;

        setForm({
            maCode: promotion.maCode?.toUpperCase() || "",
            tenUuDai: promotion.tenUuDai || "",
            phanTramGiam: promotion.phanTramGiam || "",
            dieuKienApDung: promotion.dieuKienApDung || "",
            soLuongToiDa: promotion.soLuongToiDa || "",

            ngayBatDau: promotion.ngayBatDau
                ? toLocalInput(promotion.ngayBatDau)
                : "",

            ngayHetHan: promotion.ngayHetHan
                ? toLocalInput(promotion.ngayHetHan)
                : ""
        });
    }, [promotion]);
    if (!isOpen || !promotion) return null;

    const handleChange = (
        field,
        value
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const validate = () => {
        if (!form.maCode.trim())
            return "Vui lòng nhập mã code";

        if (!form.tenUuDai.trim())
            return "Vui lòng nhập tên ưu đãi";

        const discount =
            Number(form.phanTramGiam);

        if (
            isNaN(discount) ||
            discount < 1 ||
            discount > 100
        ) {
            return "Phần trăm giảm phải từ 1 đến 100";
        }

        if (
            Number(form.dieuKienApDung) < 0
        ) {
            return "Điều kiện áp dụng không hợp lệ";
        }

        if (
            Number(form.soLuongToiDa) <= 0
        ) {
            return "Số lượng tối đa phải lớn hơn 0";
        }

        if (!form.ngayBatDau)
            return "Vui lòng chọn ngày bắt đầu";

        if (!form.ngayHetHan)
            return "Vui lòng chọn ngày hết hạn";

        if (
            new Date(form.ngayBatDau) >=
            new Date(form.ngayHetHan)
        ) {
            return "Ngày hết hạn phải lớn hơn ngày bắt đầu";
        }

        return null;
    };

    const submitUpdate = async () => {
        try {
            setLoading(true);

            await updatePromotionApi(
                promotion.maUuDai,
                {
                    maCode: form.maCode,
                    tenUuDai: form.tenUuDai,
                    phanTramGiam:
                        Number(
                            form.phanTramGiam
                        ),
                    dieuKienApDung:
                        Number(
                            form.dieuKienApDung
                        ),
                    soLuongToiDa:
                        Number(
                            form.soLuongToiDa
                        ),
                    ngayBatDau:
                        toUTC(form.ngayBatDau),
                    ngayHetHan:
                        toUTC(form.ngayHetHan)
                }
            );

            toastSuccess(
                "Cập nhật thành công ưu đãi", promotion.tenUuDai
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

    const handleConfirmUpdate = () => {

        const error = validate();

        if (error) {
            toastError(error);
            return;
        }

        setConfirmConfig({
            title: "Xác nhận cập nhật",
            message:
                `Bạn có chắc muốn cập nhật ưu đãi "${form.tenUuDai}" không?`,
            type: "warning",
            confirmText: "Cập nhật",
            action: submitUpdate
        });

        setConfirmOpen(true);
    };

    const handleStopPromotion = () => {

        setConfirmConfig({
            title: "Ngưng hoạt động ưu đãi",
            message:
                `Bạn có chắc muốn ngưng hoạt động ưu đãi "${form.tenUuDai}" không?`,
            type: "warning",
            confirmText: "Ngưng hoạt động",
            action: async () => {

                try {

                    setLoading(true);

                    await changePromotionStatusApi(
                        promotion.maUuDai,
                        false
                    );

                    toastSuccess(
                        "Ngưng hoạt động thành công"
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
            }
        });

        setConfirmOpen(true);
    };
    console.log(promotion);

    return (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center">

            <div className="bg-white rounded-3xl w-full max-w-2xl p-5">

                <div className="flex justify-between items-center mb-8">

                    <h2 className="text-2xl font-bold">
                        Cập nhật ưu đãi
                    </h2>

                    <button onClick={onClose}>
                        <X size={22} />
                    </button>

                </div>

                <div className="grid grid-cols-1 gap-5">

                    <InputField
                        label="Mã code"
                        value={form.maCode}
                        placeholder="Ví dụ: SALE10"
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
                        value={
                            form.phanTramGiam
                        }
                        onChange={(e) =>
                            handleChange(
                                "phanTramGiam",
                                e.target.value
                            )
                        }
                    />

                    <InputField
                        label="Điều kiện áp dụng"
                        type="number"
                        value={
                            form.dieuKienApDung
                        }
                        onChange={(e) =>
                            handleChange(
                                "dieuKienApDung",
                                e.target.value
                            )
                        }
                    />

                    <InputField
                        label="Số lượng tối đa"
                        type="number"
                        value={
                            form.soLuongToiDa
                        }
                        onChange={(e) =>
                            handleChange(
                                "soLuongToiDa",
                                e.target.value
                            )
                        }
                    />

                    {(promotion.trangThai === 2 || promotion.trangThai === 3) && (
                        <Dropdown
                            label="Trạng thái"
                            placeholder="Chọn trạng thái"
                            value={promotion.trangThai}
                            onChange={(value) => {
                                const newStatus = Number(value);

                                if (promotion.trangThai === 2 && newStatus === 3) {
                                    handleStopPromotion();
                                }

                                if (promotion.trangThai === 3 && newStatus === 2) {
                                    handleStartPromotion();
                                }
                            }}
                            options={[
                                {
                                    value: 2,
                                    label: "Hoạt động"
                                },
                                {
                                    value: 3,
                                    label: "Ngưng hoạt động"
                                }
                            ]}
                        />
                    )}

                    <InputField
                        label="Ngày bắt đầu"
                        type="datetime-local"
                        value={
                            form.ngayBatDau
                        }
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
                        value={
                            form.ngayHetHan
                        }
                        onChange={(e) =>
                            handleChange(
                                "ngayHetHan",
                                e.target.value
                            )
                        }
                    />

                </div>

                <div className="flex justify-end gap-3 mt-8">

                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-xl bg-slate-100"
                    >
                        Hủy
                    </button>

                    <button
                        onClick={
                            handleConfirmUpdate
                        }
                        disabled={loading}
                        className="px-6 py-2 rounded-xl bg-blue-500 text-white"
                    >
                        {loading
                            ? "Đang cập nhật..."
                            : "Cập nhật"}
                    </button>

                </div>

                <ConfirmModal
                    isOpen={confirmOpen}
                    title={
                        confirmConfig.title
                    }
                    message={
                        confirmConfig.message
                    }
                    confirmText={
                        confirmConfig.confirmText
                    }
                    type={
                        confirmConfig.type
                    }
                    onCancel={() =>
                        setConfirmOpen(
                            false
                        )
                    }
                    onConfirm={async () => {
                        setConfirmOpen(
                            false
                        );

                        await confirmConfig.action?.();
                    }}
                />

            </div>

        </div>
    );

}
