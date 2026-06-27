import { useState, useMemo } from 'react';
import {
    ChevronDown,
    MessageCircle,
    Building2,
    ShieldCheck,
    Headphones,
} from 'lucide-react';

import InputField from '~/components/UI/Form/InputField';
import { sentContactApi } from '~/Services/ContactService';
import {
    toastSuccess,
    toastError,
} from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";
import { useWebInfo } from "~/Hooks/useWebInfo";

const SUPPORT_TOPICS = [
    {
        icon: MessageCircle,
        title: 'Tư vấn lịch trình',
        desc: 'Hỗ trợ giải đáp mọi thắc mắc và các bước cần thiết trước khi trải nghiệm.',
    },
    {
        icon: Headphones,
        title: 'Hỗ trợ trong chuyến đi',
        desc: 'Theo dõi yêu cầu, cập nhật thông tin và hỗ trợ trong chuyến đi.',
    },
    {
        icon: Building2,
        title: 'Hỗ trợ sau đặt chỗ',
        desc: 'Tư vấn các vấn đề phát sinh sau khi đặt dịch vụ.',
    },
    {
        icon: ShieldCheck,
        title: 'Chính sách & Thanh toán',
        desc: 'Giải đáp về hoàn hủy, thanh toán và bảo hiểm.',
    },
];

function FaqItem({ index, title, answer }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="border-b border-slate-200 last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between py-4 text-left"
            >
                <span className="font-medium">
                    {index}.{title}
                </span>

                <ChevronDown
                    size={18}
                    className={`transition ${open ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {open && (
                <div className="pb-4 text-sm text-slate-500">
                    {answer}
                </div>
            )}
        </div>
    );
}

export default function Contact() {
    const [form, setForm] = useState({
        hoTen: '',
        email: '',
        soDienthoai: '',
        noiDung: '',
    });
    const { webInfo } = useWebInfo();
    const faqs = useMemo(() => {
        const result = [];

        for (let i = 1; i <= 10; i++) {
            const question = webInfo?.[`faq_${i}_question`];
            const answer = webInfo?.[`faq_${i}_answer`];

            if (question && answer) {
                result.push({
                    question,
                    answer,
                });
            }
        }

        return result;
    }, [webInfo]);
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const [loading, setLoading] = useState(false);
    // Thêm state lỗi
const [errors, setErrors] = useState({});

const validate = () => {
    const newErrors = {};
    
    // Regex cho SĐT (khớp với Regex C# của bạn)
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;

    if (!form.hoTen.trim()) newErrors.hoTen = "Họ tên không được để trống";
    
    if (!form.email.trim()) {
        newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        newErrors.email = "Email không hợp lệ";
    }

    if (!form.soDienthoai.trim()) {
        newErrors.soDienthoai = "Số điện thoại không được để trống";
    } else if (!phoneRegex.test(form.soDienthoai.trim())) {
        newErrors.soDienthoai = "Số điện thoại không đúng định dạng";
    }

    if (!form.noiDung.trim()) newErrors.noiDung = "Nội dung không được để trống";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Đã click nút gửi!");
        if (!validate()) return;
        try {
            setLoading(true);

            await sentContactApi({
                hoTen: form.hoTen.trim(),
                email: form.email.trim(),
                soDienThoai: form.soDienthoai.trim(),
                noiDung: form.noiDung.trim(),
            });

            toastSuccess(
                "Gửi thành công",
                "Chúng tôi sẽ liên hệ với bạn sớm nhất."
            );

            setForm({
                hoTen: "",
                email: "",
                soDienThoai: "",
                noiDung: "",
            });

        } catch (error) {
            toastError(
                "Thao tác thất bại",
                getErrorMessage(error)
            );
        } finally {
            setLoading(false);
        }
    };
    const mapUrl = webInfo?.Map_Trang_Lien_He?.replaceAll('"', '');
    return (
        <div className="bg-white/50 py-10 mt-20">
            <div className="mx-auto max-w-[1388px] ">
                <div className="mb-8 text-center ">
                    <h1 className="text-4xl font-bold">
                        Liên hệ với chúng tôi
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Bạn có thắc mắc về hành trình hoặc cần hỗ trợ đặt tour? Đội ngũ của chúng tôi luôn sẵn sàng đồng hành cùng bạn.
                    </p>
                </div>

                {/* MAP + FORM */}
                <div>
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* MAP */}
                        <div className="overflow-hidden rounded-4xl border border-slate-200 ">
                            <iframe
                                title="Google Map"
                                src={mapUrl}
                                width="100%"
                                height="650"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="strict-origin-when-cross-origin"
                            />
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="rounded-4xl border border-slate-200 p-5"
                        >
                            <p className="mb-5 text-center text-[16px] text-slate-600 font-semibold">
                                Gửi lời nhắn cho chúng tôi
                            </p>

                            <div className="grid gap-4 md:grid-rows-2">
                                <InputField
                                    label="Họ tên"
                                    name="hoTen"
                                    value={form.hoTen}
                                    onChange={handleChange}
                                    placeholder="Nguyễn Văn A"
                                    error={errors.hoTen}
                                />

                                <InputField
                                    label="Email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="example@gmail.com"
                                    error={errors.email}
                                />

                                <InputField
                                    label="Số điện thoại"
                                    name="soDienthoai"
                                    value={form.soDienthoai}
                                    onChange={handleChange}
                                    placeholder="0901234567"
                                    error={errors.soDienthoai}
                                />

                            </div>



                            <div className="mt-4">
                                <InputField
                                    label="Nội dung"
                                    name="noiDung"
                                    value={form.noiDung}
                                    onChange={handleChange}
                                    multiline
                                    rows={8}
                                    placeholder="Nhập nội dung cần hỗ trợ..."
                                    error={errors.noiDung}
                                />
                            </div>

                            <div className="mt-6 text-center">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-full bg-sky-500 px-10 py-2 text-white transition hover:bg-sky-600 disabled:opacity-70"
                                >
                                    {loading ? "Đang gửi..." : "Gửi"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* SUPPORT */}
                <div className="mt-20 rounded-4xl border border-slate-200 p-8 ">
                    <h2 className="text-center text-3xl font-bold">
                        Chọn đúng nhu cầu để được tư vấn nhanh hơn
                    </h2>

                    <p className="mt-2 text-center text-sm text-slate-500">
                        Từ tour, khách sạn đến dịch vụ sau đặt chỗ, đội ngũ hỗ trợ luôn sẵn sàng đồng hành với bạn.
                    </p>

                    <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {SUPPORT_TOPICS.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="rounded-xl border border-slate-200 p-4 text-center"
                                >
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-500 text-white">
                                        <Icon size={22} />
                                    </div>

                                    <h3 className="font-semibold">
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 text-xs text-slate-500">
                                        {item.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>


                <div className="mt-20">
                    <h2 className="text-center text-3xl font-bold">
                        Bạn cần biết gì trước khi liên hệ?
                    </h2>

                    <p className="mt-2 text-center text-sm text-slate-500">
                        Một số thông tin thường được khách hàng hỏi khi cần tư vấn tour.
                    </p>

                    <div className="mx-auto mt-8 max-w-4xl rounded-3xl shadow-2xl border border-slate-200 bg-white px-8 py-4">
                        {faqs.length > 0 ? (
                            faqs.map((faq, index) => (
                                <FaqItem
                                    key={index}
                                    index={index + 1}
                                    title={faq.question}
                                    answer={faq.answer}
                                />
                            ))
                        ) : (
                            <div className="py-6 text-center text-slate-500">
                                Chưa có câu hỏi thường gặp
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}