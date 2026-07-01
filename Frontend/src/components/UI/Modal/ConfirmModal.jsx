import React, { useEffect } from "react";
import { createPortal } from "react-dom"; // Thêm dòng này
import { X } from "lucide-react";

export default function ConfirmModal({
    isOpen,
    title = "Xác nhận",
    message = "Bạn có chắc không?",
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    type = "warning",
    onConfirm,
    onCancel
}) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const colorMap = {
        warning: "bg-yellow-500 hover:bg-yellow-600",
        danger: "bg-red-500 hover:bg-red-600",
        info: "bg-sky-500 hover:bg-sky-600"
    };

    // Sử dụng createPortal để đưa Modal ra ngoài body, tránh xung đột CSS từ modal cha
    return createPortal(
        <div className="fixed inset-0 w-screen h-screen bg-black/50 flex items-center justify-center z-[9999]">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200 management-modal">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-slate-800">{title}</h2>
                    <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    {message}
                </p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-slate-700 font-medium text-sm transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg text-white font-medium text-sm transition-colors ${colorMap[type]}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body // Gắn trực tiếp vào body của trang web
    );
}