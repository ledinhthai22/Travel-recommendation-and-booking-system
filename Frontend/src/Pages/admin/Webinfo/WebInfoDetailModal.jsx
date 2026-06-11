import { X } from "lucide-react";

export default function WebInfoDetailModal({
    isOpen,
    onClose,
    data,
}) {
    if (!isOpen || !data) return null;

    const isLogo = data.key === 'logo_url';

    return (
        <div className="fixed inset-0 bg-black/50 z-999 flex justify-center items-center">
            <div className="bg-white rounded-3xl w-full max-w-xl p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-xl">Chi tiết thông tin trang</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="space-y-5">
                    <div>
                        <label className="text-sm text-slate-500">Key</label>
                        <div className="font-mono text-blue-600 mt-1">{data.key}</div>
                    </div>

                    <div>
                        <label className="text-sm text-slate-500">Nội dung</label>
                        <div className="mt-2">
                            {isLogo ? (
                                <img
                                    src={`https://localhost:7016${data.noidung}`}
                                    alt="logo"
                                    className="h-24 object-contain"
                                />
                            ) : (
                                <div className="text-sm text-slate-700">{data.noidung}</div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-slate-500">Trạng thái hiển thị</label>
                        <div className="mt-2">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                                data.trangthai
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}>
                                {data.trangthai ? "Hiển thị" : "Ẩn"}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-slate-500">Ngày cập nhật</label>
                        <div className="text-sm text-slate-700 mt-1">
                            {new Date(data.ngayCapNhat).toLocaleString('vi-VN')}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-gray-100 text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}