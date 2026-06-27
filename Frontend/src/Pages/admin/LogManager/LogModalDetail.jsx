import { useEffect, useState } from "react";
import { X } from "lucide-react";
import logService from "~/Services/LogService";
import { toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";
import InputField from "~/components/UI/Form/InputField";

const ACTION_COLOR_MAP = {
    'Tạo': 'bg-emerald-100 text-emerald-700',
    'Cập nhật': 'bg-amber-100 text-amber-700',
    'Xóa': 'bg-red-100 text-red-700',
    'Đăng nhập': 'bg-blue-100 text-blue-700',
    'Cập nhật trạng thái': 'bg-purple-100 text-purple-700',
    'Đặt lại mật khẩu': 'bg-orange-100 text-orange-700',
    'Xem danh sách': 'bg-slate-100 text-slate-600',
    'Xem chi tiết': 'bg-sky-100 text-sky-700',
};

function InfoRow({ label, value }) {
    return (
        <div className="flex flex-col gap-1"> 
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                {label}
            </span>
            <span className="text-sm text-slate-700 font-medium break-all">
                {value || '—'}
            </span>
        </div>
    );
}

function JsonBlock({ label, value }) {
    if (!value) return (
        <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                {label}
            </span>
            <span className="text-sm text-slate-400 italic">Không có dữ liệu</span>
        </div>
    );

    let parsed = value;
    let isJson = false;
    try {
        parsed = JSON.parse(value);
        isJson = true;
    } catch {
       
    }

    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                {label}
            </span>
            <pre className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 overflow-auto max-h-48 whitespace-pre-wrap break-all font-mono">
                {isJson ? JSON.stringify(parsed, null, 2) : value}
            </pre>
        </div>
    );
}

export default function LogDetailModal({ isOpen, onClose, logId }) {
    const [loading, setLoading] = useState(false);
    const [log, setLog] = useState(null);

    useEffect(() => {
        if (!isOpen || !logId) return;

        const fetchLog = async () => {
            try {
                setLoading(true);
                const res = await logService.getLogById(logId);
                if (res?.success) {
                    setLog(res.data);
                } else {
                    toastError('Không tìm thấy bản ghi log.');
                }
            } catch (error) {
                toastError(getErrorMessage(error));
            } finally {
                setLoading(false);
            }
        };

        fetchLog();
    }, [isOpen, logId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold">Chi tiết nhật ký</h2>
                        {log && (
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold
                                ${ACTION_COLOR_MAP[log.tenHanhDong] ?? 'bg-slate-100 text-slate-700'}`}>
                                {log.tenHanhDong}
                            </span>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {loading ? (
                        <div className="py-20 text-center text-slate-400">Đang tải dữ liệu...</div>
                    ) : !log ? (
                        <div className="py-20 text-center text-red-500">Không tìm thấy bản ghi log</div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoRow label="Loại tài khoản" value={log.loaiTaiKhoan} />
                                <InfoRow label="Mã tài khoản" value={log.maTaiKhoan ? `#${log.maTaiKhoan}` : ''} />
                                <InfoRow label="Hành động" value={log.tenHanhDong} />
                                <InfoRow label="Module tác động" value={log.tenBangTacDong} />
                                <InfoRow label="Email" value={log.email} />
                                <InfoRow label="Địa chỉ IP" value={log.diaChiIP} />
                                <InfoRow label="Trình duyệt" value={log.trinhDuyet} />
                                <InfoRow
                                    label="Thời gian"
                                    value={log.thoiGianTao
                                        ? new Date(log.thoiGianTao).toLocaleString('vi-VN')
                                        : '—'}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-6 pt-4 border-t border-slate-100">
                                <JsonBlock label="Giá trị trước" value={log.giaTriTruoc} />
                                <JsonBlock label="Giá trị sau" value={log.giaTriSau} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}