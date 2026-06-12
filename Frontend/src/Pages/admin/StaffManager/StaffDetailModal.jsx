import { useEffect, useState } from "react";
import { X } from "lucide-react";

import InputField from "~/components/UI/Form/InputField";
import { getStaffByIdApi } from "~/Services/StaffService";

import { toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";

export default function StaffDetailModal({
    isOpen,
    onClose,
    staffId
}) {
    const [loading, setLoading] = useState(false);
    const [staff, setStaff] = useState(null);

    useEffect(() => {
        if (!isOpen || !staffId) return;

        const fetchStaff = async () => {
            try {
                setLoading(true);

                const res = await getStaffByIdApi(staffId);

                setStaff(res);
            } catch (error) {
                toastError(
                    getErrorMessage(error)
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, [isOpen, staffId]);

    if (!isOpen) return null;

    const statusLabels = {
        2: "Đang làm việc",
        3: "Nghỉ phép",
        4: "Nghỉ việc"
    };

    const statusColors = {
        2: "bg-green-100 text-green-700",
        3: "bg-yellow-100 text-yellow-700",
        4: "bg-red-100 text-red-700"
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-999 flex items-center justify-center">
            <div className="bg-white rounded-3xl w-full max-w-4xl p-6">

                <div className="flex items-center justify-between mb-8">

                    <div className="flex items-center gap-3">

                        <h2 className="text-2xl font-bold">
                            Chi tiết nhân viên
                        </h2>

                        {staff && (
                            <span
                                className={`
                                    px-4 py-1.5
                                    rounded-full
                                    text-xs
                                    font-bold
                                    ${statusColors[staff.trangThai]}
                                `}
                            >
                                {statusLabels[staff.trangThai]}
                            </span>
                        )}

                    </div>

                    <button
                        onClick={onClose}
                        className="
                            p-2 rounded-full
                            hover:bg-slate-100
                        "
                    >
                        <X size={20} />
                    </button>

                </div>

                {loading ? (
                    <div className="py-20 text-center">
                        Đang tải dữ liệu...
                    </div>
                ) : !staff ? (
                    <div className="py-20 text-center text-red-500">
                        Không tìm thấy dữ liệu
                    </div>
                ) : (
                    <>
                        {/* Avatar + Họ tên */}
                        <div className="flex gap-6 mb-6">

                            <div className="w-40 h-40 shrink-0">
                                <img
                                    src={
                                        staff.duongDanAnh
                                            ? `https://localhost:7016${staff.duongDanAnh}`
                                            : "/default-avatar.png"
                                    }
                                    alt={staff.hoTen}
                                    className="
                                        w-full
                                        h-full
                                        object-cover
                                        rounded-2xl
                                       
                                    "
                                />
                            </div>

                            <div className="flex-1">
                                <InputField
                                    label="Họ tên"
                                    value={staff.hoTen || ""}
                                    readOnly
                                />
                                <div className="mt-5">
                                    <InputField
                                        label="Email"
                                        value={staff.email || ""}
                                        readOnly
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Thông tin */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">



                            <InputField
                                label="Số điện thoại"
                                value={staff.soDienThoai || ""}
                                readOnly
                            />

                            <InputField
                                label="Chức danh"
                                value={staff.tenVaiTro || ""}
                                readOnly
                            />

                            <InputField
                                label="Giới tính"
                                value={
                                    staff.gioiTinh
                                        ? "Nam"
                                        : "Nữ"
                                }
                                readOnly
                            />

                            <InputField
                                label="Ngày sinh"
                                value={
                                    staff.ngaySinh
                                        ? new Date(
                                            staff.ngaySinh
                                        ).toLocaleDateString(
                                            "vi-VN"
                                        )
                                        : ""
                                }
                                readOnly
                            />

                            <InputField
                                label="Ngày vào làm"
                                value={
                                    staff.ngayTao
                                        ? new Date(
                                            staff.ngayTao
                                        ).toLocaleDateString(
                                            "vi-VN"
                                        )
                                        : ""
                                }
                                readOnly
                            />
                            <InputField
                                label="Địa chỉ"
                                value={staff.diaChi || ""}
                                readOnly
                            />
                        </div>

                       
                        <div className="flex justify-end mt-8">

                            <button
                                onClick={onClose}
                                className="
                                px-6 py-2
                                rounded-xl
                                bg-slate-100
                                hover:bg-slate-200
                            "
                            >
                                Đóng
                            </button>

                        </div>
                    </>
                )}
            </div>
        </div>
    );
}