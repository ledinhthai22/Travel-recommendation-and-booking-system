import { useState } from "react";
import { X, KeyRound } from "lucide-react";

import InputField from "~/components/UI/Form/InputField";
import { toastError, toastSuccess } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";

import { resetStaffPasswordApi } from "~/Services/StaffService";
import ConfirmModal from "~/components/UI/Modal/ConfirmModal";


export default function ResetPasswordModal({
    isOpen,
    onClose,
    staff
}) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState({
        title: "",
        message: "",
        type: "warning",
        confirmText: "Xác nhận",
        action: null
    });
    if (!isOpen) return null;

    const validate = () => {
        if (!password.trim()) {
            toastError("Vui lòng nhập mật khẩu mới");
            return false;
        }

        if (password.length < 8) {
            toastError("Mật khẩu tối thiểu 8 ký tự");
            return false;
        }

        if (password !== confirmPassword) {
            toastError("Mật khẩu xác nhận không khớp");
            return false;
        }

        return true;
    };

    const submitResetPassword = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            await resetStaffPasswordApi(
                staff.maNguoiDung,
                password
            );

            toastSuccess("Cấp lại mật khẩu thành công cho nhân viên", staff.hoTen);
            onClose();

        } catch (error) {
            toastError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };
    const handleConfirmReset = () => {
        setConfirmConfig({
            title: "Xác nhận cấp lại mật khẩu",
            message: `Bạn có chắc muốn cấp lại mật khẩu cho "${staff?.hoTen}" không?`,
            type: "warning",
            confirmText: "Cấp lại",
            action: submitResetPassword
        });

        setConfirmOpen(true);
    };
    return (
        <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center">
            <div className="bg-white rounded-3xl w-full max-w-xl p-6">

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <KeyRound size={22} />
                        <h2 className="text-xl font-bold">
                            Cấp lại mật khẩu
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-5 p-4 rounded-xl bg-slate-50">
                    <p className="font-semibold">
                        {staff?.hoTen}
                    </p>

                    <p className="text-sm text-slate-500">
                        {staff?.email}
                    </p>
                </div>

                <div className="space-y-4">

                    <InputField
                        label="Mật khẩu mới"
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <InputField
                        label="Xác nhận mật khẩu"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                    />

                </div>

                <div className="flex justify-end gap-3 mt-8">

                    <button
                        onClick={onClose}
                        className="
                            px-5 py-2
                            rounded-xl
                            bg-slate-100
                            hover:bg-slate-200
                        "
                    >
                        Hủy
                    </button>

                    <button
                        onClick={handleConfirmReset}
                        disabled={loading}
                        className="
                            px-5 py-2
                            rounded-xl
                            bg-sky-500
                            text-white
                            hover:bg-sky-600
                        "
                    >
                        {loading ? "Đang xử lý" : "Cấp lại mật khẩu"}
                    </button>

                </div>
            </div>
            <ConfirmModal
                isOpen={confirmOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                confirmText={confirmConfig.confirmText}
                type={confirmConfig.type}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={async () => {
                    setConfirmOpen(false);
                    await confirmConfig.action?.();
                }}
            />
        </div>
    );
}