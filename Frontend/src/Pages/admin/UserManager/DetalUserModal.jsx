import React from "react";
import { X } from "lucide-react";
import InputField from "~/components/UI/Form/InputField";

export default function DetailUserModal({ isOpen, onClose, userData }) {
    if (!isOpen || !userData) return null;

    const statusLabels = {
        1: "Đang hoạt động",
        0: "Đã khóa"
    };

    const statusColors = {
        1: "bg-green-100 text-green-700",
        0: "bg-red-100 text-red-700"
    };

    const formatNgay = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("vi-VN");
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold">Chi tiết người dùng</h2>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${statusColors[userData.trangThai]}`}>
                            {statusLabels[userData.trangThai] || "Không xác định"}
                        </span>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex gap-6 mb-6">
                    <div className="w-40 h-40 shrink-0">
                        <img
                            src={userData.duongDanAnh ? `https://localhost:7016${userData.duongDanAnh}` : "/default-avatar.png"}
                            alt={userData.hoTen}
                            className="w-full h-full object-cover rounded-2xl border border-slate-200"
                        />
                    </div>

                    <div className="flex-1">
                        <InputField label="Họ tên" value={userData.hoTen || ""} readOnly />
                        <div className="mt-5">
                            <InputField label="Email" value={userData.email || ""} readOnly />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField label="Số điện thoại" value={userData.soDienThoai} readOnly />
                    <InputField label="Vai trò" value={userData.tenVaiTro} readOnly />
                    <InputField label="Giới tính" value={userData.gioiTinh === true ? "Nam" : "Nữ"} readOnly />
                    <InputField label="Ngày sinh" value={formatNgay(userData.ngaySinh)} readOnly />
                    <InputField label="Ngày tham gia" value={formatNgay(userData.ngayTao)} readOnly />

                    <InputField label="Địa chỉ" value={userData.diaChi} readOnly />

                </div>

            </div>
        </div>
    );
}