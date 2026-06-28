import React from "react";
import InputField from "~/components/UI/Form/InputField";
import { formatCurrency } from "~/Helper/FormatCurrency";
import { formatDate } from "~/Helper/FormatDate";
export default function PromotionDetailModal({
    isOpen,
    onClose,
    promotion
}) {
    if (!isOpen || !promotion) return null;

    const statusLabels = {
        1: "Chờ kích hoạt",
        2: "Đang hoạt động",
        3: "Ngưng hoạt động",
        4: "Hết hạn"
    };
    const statusColors = {
        1: "bg-yellow-100 text-yellow-700",
        2: "bg-green-100 text-green-700",
        3: "bg-yellow-100 text-yellow-700",
        4: "bg-slate-100 text-slate-700"
    };
    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleString("vi-VN");
    };



    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
            <div className="w-full max-w-5xl rounded-2xl bg-white p-6 shadow-xl">

                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">
                        Chi tiết ưu đãi
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-xl text-slate-500 hover:text-red-500"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    <InputField
                        label="Mã code"
                        value={promotion.maCode}
                        readOnly
                    />

                    <InputField
                        label="Tên ưu đãi"
                        value={promotion.tenUuDai}
                        readOnly
                    />

                    <InputField
                        label="Phần trăm giảm (%)"
                        value={promotion.phanTramGiam}
                        readOnly
                    />

                    <InputField
                        label="Điều kiện áp dụng"
                        value={formatCurrency(
                            promotion.dieuKienApDung
                        )}
                        readOnly
                    />

                    <InputField
                        label="Số lượng tối đa"
                        value={promotion.soLuongToiDa}
                        readOnly
                    />

                    <InputField
                        label="Ngày bắt đầu"
                        value={formatDate(
                            promotion.ngayBatDau
                        )}
                        readOnly
                    />

                    <InputField
                        label="Ngày hết hạn"
                        value={formatDate(
                            promotion.ngayHetHan
                        )}
                        readOnly
                    />

                    <InputField
                        label="Ngày tạo"
                        value={formatDate(
                            promotion.ngayTao
                        )}
                        readOnly
                    />
                    <div>
                        <label className="text-sm text-slate-500 block mb-1"> Trạng thái </label>
                        <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${statusColors[promotion.trangThai]}`} >
                            {statusLabels[promotion.trangThai]}
                        </span>
                    </div>


                </div>


            </div>
        </div >
    );
}