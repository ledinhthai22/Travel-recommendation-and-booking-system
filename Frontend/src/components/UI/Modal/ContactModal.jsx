import { X } from "lucide-react";
import { useState } from "react";
import { sentContactApi } from "~/Services/ContactService";
import { toastSuccess, toastError } from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";
import InputField from "../Form/InputField";

export default function ContactModal({ open, onClose, tourName }) {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        hoTen: "",
        email: "",
        soDienThoai: "",
        noiDung: tourName
            ? `Tôi cần tư vấn tour: ${tourName}`
            : "",
    });

    if (!open) return null;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await sentContactApi(form);

            toastSuccess(
                "Gửi thành công",
                "Chúng tôi sẽ liên hệ với bạn sớm nhất."
            );

            onClose();
        } catch (error) {
            toastError(
                "Gửi thất bại",
                getErrorMessage(error)
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-bold">
                        Liên hệ tư vấn
                    </h3>

                    <button onClick={onClose} className="cursor-pointer hover:text-red-500">
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <InputField
                        name="hoTen"
                        value={form.hoTen}
                        onChange={handleChange}
                        placeholder="Họ tên"
                        className="w-full rounded-xl border p-3"
                    />

                    <InputField
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full rounded-xl border p-3"
                    />

                    <InputField
                        name="soDienThoai"
                        value={form.soDienThoai}
                        onChange={handleChange}
                        placeholder="Số điện thoại"
                        className="w-full rounded-xl border p-3"
                    />

                    <InputField
                        rows={4}
                        name="noiDung"
                        multiline
                        value={form.noiDung}
                        onChange={handleChange}
                        className="w-full rounded-xl border p-3"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-sky-500 py-3 font-semibold text-white hover:bg-sky-600 cursor-pointer"
                    >
                        {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                    </button>
                </form>
            </div>
        </div>
    );
}