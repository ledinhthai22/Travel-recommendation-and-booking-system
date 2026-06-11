import { X } from "lucide-react";

export default function ConfirmModal({
    isOpen,
    title = "Xác nhận",
    message = "Bạn có chắc không?",
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    type = "warning", // warning | danger | info
    onConfirm,
    onCancel
}) {
    if (!isOpen) return null;

    const colorMap = {
        warning: "bg-yellow-500",
        danger: "bg-red-500",
        info: "bg-sky-500"
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-999">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <button onClick={onCancel}>
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <p className="text-sm text-gray-600 mb-6">
                    {message}
                </p>

                {/* Footer */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg text-white text-sm ${colorMap[type]}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}