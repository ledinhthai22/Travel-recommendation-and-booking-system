import { X } from "lucide-react";
import InputField from "~/components/UI/Form/InputField";

export default function ContactDetailModal({
    isOpen,
    onClose,
    data,
}) {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[999] flex justify-center items-center">
            <div className="bg-white rounded-3xl w-full max-w-xl p-6 shadow-xl">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-xl text-slate-800">Chi tiết liên hệ</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-slate-500">Người gửi</label>
                            <div className="font-semibold text-slate-800 mt-1">{data.hoTen || '--'}</div>
                        </div>
                        <div>
                            <label className="text-sm text-slate-500">Số điện thoại</label>
                            <div className="font-medium text-slate-800 mt-1">{data.sodienThoai || '--'}</div>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-slate-500">Email</label>
                        <div className="font-medium text-slate-800 mt-1">{data.email || '--'}</div>
                    </div>

                    <div>
                        <label className="text-sm text-slate-500">Nội dung liên hệ</label>
                        <div className="mt-2 p-3 bg-slate-50 rounded-xl text-sm text-slate-700 whitespace-pre-wrap border border-slate-100">
                            {data.noiDung || 'Không có nội dung'}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-slate-500">Trạng thái</label>
                            <div className="mt-2">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                                    data.trangThai
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-blue-100 text-blue-700"
                                }`}>
                                    {data.trangThai ? "Đã đọc" : "Chưa đọc"}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-slate-500">Ngày gửi</label>
                            <div className="text-sm text-slate-700 mt-2">
                                {data.ngayTao ? new Date(data.ngayTao).toLocaleString('vi-VN') : '--'}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}