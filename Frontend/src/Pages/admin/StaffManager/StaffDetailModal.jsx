import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";

import InputField from "~/components/UI/Form/InputField";
import { getStaffByIdApi } from "~/Services/StaffService";

import { toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";

export default function StaffDetailModal({
    isOpen,
    onClose,
    staffId,
    onStatusChange
}) {
    const [loading, setLoading] = useState(false);
    const [staff, setStaff] = useState(null);
    const isClosing = useRef(false);

    // Đồng bộ với backend: 1=Đang làm việc, 2=Nghỉ phép, 0=Nghỉ việc
    const statusLabels = {
        1: "Đang làm việc",
        2: "Nghỉ phép",
        0: "Nghỉ việc"
    };

    const statusColors = {
        1: "bg-green-100 text-green-700",
        2: "bg-yellow-100 text-yellow-700",
        0: "bg-red-100 text-red-700"
    };

    useEffect(() => {
        if (!isOpen || !staffId) {
            isClosing.current = false;
            return;
        }

        const fetchStaff = async () => {
            try {
                setLoading(true);
                const res = await getStaffByIdApi(staffId);
                if (!isClosing.current) {
                    setStaff(res);
                }
            } catch (error) {
                if (!isClosing.current) {
                    toastError(getErrorMessage(error));
                }
            } finally {
                if (!isClosing.current) {
                    setLoading(false);
                }
            }
        };

        fetchStaff();
    }, [isOpen, staffId]);

    const handleClose = () => {
        isClosing.current = true;
        onClose();
        
        // Delay nhẹ để modal đóng trước khi refresh dữ liệu
        if (onStatusChange) {
            setTimeout(() => {
                onStatusChange();
                isClosing.current = false;
            }, 100);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-999 flex items-center justify-center">
            <div className="bg-white rounded-3xl w-full max-w-4xl p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold">Chi tiết nhân viên</h2>
                        {staff && (
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${statusColors[staff.trangThai]}`}>
                                {statusLabels[staff.trangThai]}
                            </span>
                        )}
                    </div>
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-slate-100">
                        <X size={20} />
                    </button>
                </div>

                {loading ? (
                    <div className="py-20 text-center">Đang tải dữ liệu...</div>
                ) : !staff ? (
                    <div className="py-20 text-center text-red-500">Không tìm thấy dữ liệu</div>
                ) : (
                    <>
                        <div className="flex gap-6 mb-6">
                            <div className="w-40 h-40 shrink-0">
                                <img
                                    src={staff.duongDanAnh ? `https://localhost:7016${staff.duongDanAnh}` : "/default-avatar.png"}
                                    alt={staff.hoTen}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </div>
                            <div className="flex-1">
                                <InputField label="Họ tên" value={staff.hoTen || ""} readOnly />
                                <div className="mt-5">
                                    <InputField label="Email" value={staff.email || ""} readOnly />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InputField label="CCCD" value={staff.cccd || ""} readOnly />
                            <InputField label="Số điện thoại" value={staff.soDienThoai || ""} readOnly />
                            <InputField label="Chức danh" value={staff.tenVaiTro || ""} readOnly />
                            <InputField label="Giới tính" value={staff.gioiTinh ? "Nam" : "Nữ"} readOnly />
                            <InputField
                                label="Ngày sinh"
                                value={staff.ngaySinh ? new Date(staff.ngaySinh).toLocaleDateString("vi-VN") : ""}
                                readOnly
                            />
                            <InputField
                                label="Ngày vào làm"
                                value={staff.ngayTao ? new Date(staff.ngayTao).toLocaleDateString("vi-VN") : ""}
                                readOnly
                            />
                        </div>
                        <div className="mt-2">
                            <InputField label="Địa chỉ" value={staff.diaChi || ""} readOnly />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}