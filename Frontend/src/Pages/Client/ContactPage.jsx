import { useState } from 'react';
import {
    ChevronDown,
    MessageCircle,
    Building2,
    ShieldCheck,
    Headphones,
} from 'lucide-react';

import InputField from '~/components/UI/Form/InputField';
import SelectField from '~/components/UI/Form/SelectField';

const TOPICS = [
    'Du lịch',
    'Khách sạn',
    'Visa',
    'Tour nước ngoài',
    'Khác',
];

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

const FAQS = [
    'Tôi nên liên hệ trước bao lâu để được tư vấn đặt tour ?',
    'Tôi nên liên hệ trước bao lâu để được tư vấn đặt tour ?',
    'Tôi nên liên hệ trước bao lâu để được tư vấn đặt tour ?',
    'Tôi nên liên hệ trước bao lâu để được tư vấn đặt tour ?',
    'Tôi nên liên hệ trước bao lâu để được tư vấn đặt tour ?',
];

function FaqItem({ title }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="border-b border-slate-200 last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between py-4 text-left"
            >
                <span className="font-medium">
                    {title}
                </span>

                <ChevronDown
                    size={18}
                    className={`transition ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {open && (
                <div className="pb-4 text-sm text-slate-500">
                    Bạn nên liên hệ trước từ 7 - 14 ngày để được tư vấn và sắp xếp lịch trình phù hợp.
                </div>
            )}
        </div>
    );
}

export default function Contact() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        topic: '',
        message: '',
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="bg-white py-10 mt-20">
            <div className="mx-auto max-w-screen-2xl px-4">
                {/* TITLE */}
                <div className="mb-8 text-center ">
                    <h1 className="text-4xl font-bold">
                        Liên hệ với chúng tôi
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Mọi vấn đề em đều bạn thắc mắc
                    </p>
                </div>

                {/* MAP + FORM */}
                <div>
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* MAP */}
                        <div className="overflow-hidden rounded-4xl border border-slate-200 shadow-2xl">
                            <iframe
                                title="Google Map"
                                src="https://maps.google.com/maps?q=10.850523,106.771914&z=16&output=embed"
                                className="h-full  w-full"
                                loading="lazy"
                            />
                        </div>

                        {/* FORM */}
                        <form className="rounded-4xl border border-slate-200 p-5 shadow-xl">
                            <p className="mb-5 text-center text-[16px] text-slate-600 font-semibold">
                                Liên hệ với chúng tôi bạn vui lòng điền bên dưới gửi cho chúng tôi
                            </p>

                            <div className="grid gap-4 md:grid-cols-2">
                                <InputField
                                    label="Họ tên"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Nguyễn Văn A"
                                />

                                <InputField
                                    label="Email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="example@gmail.com"
                                />
                            </div>

                            <div className="mt-4">
                                <label className="mb-2 block text-sm font-medium">
                                    Loại liên hệ
                                </label>

                                <SelectField
                                    value={form.topic}
                                    onChange={(value) =>
                                        setForm({
                                            ...form,
                                            topic: value,
                                        })
                                    }
                                    options={TOPICS.map((item) => ({
                                        value: item,
                                        label: item,
                                    }))}
                                />
                            </div>

                            <div className="mt-4">
                                <label className="mb-2 block text-sm font-medium">
                                    Nội dung
                                </label>

                                <textarea
                                    rows="8"
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-sky-500"
                                />
                            </div>

                            <div className="mt-6 text-center">
                                <button
                                    type="submit"
                                    className="rounded-full bg-sky-500 px-10 py-2 text-white transition hover:bg-sky-600"
                                >
                                    Gửi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* SUPPORT */}
                <div className="mt-20 rounded-4xl border border-slate-200 p-8 shadow-xl">
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

                {/* FAQ */}
                <div className="mt-20">
                    <h2 className="text-center text-3xl font-bold">
                        Bạn cần biết gì trước khi liên hệ?
                    </h2>

                    <p className="mt-2 text-center text-sm text-slate-500">
                        Một số thông tin thường được khách hàng hỏi khi cần tư vấn tour.
                    </p>

                    <div className="mx-auto mt-8 max-w-4xl rounded-3xl shadow-2xl border border-slate-200 bg-white px-8 py-4">
                        {FAQS.map((item, index) => (
                            <FaqItem
                                key={index}
                                title={item}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}