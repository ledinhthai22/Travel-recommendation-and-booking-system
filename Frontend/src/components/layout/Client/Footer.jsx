import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { subscribeNewsletterApi } from '~/Services/NewletterSevice';
import {
    toastSuccess,
    toastError,
} from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";
import { useWebInfo } from '~/Hooks/useWebInfo';

// Chỉ define text phù hợp đồ án du lịch, href để '#' để không chuyển trang
const QUICK_LINKS = [
    { label: 'Về chúng tôi', href: '#' },
    { label: 'Tin tức & Sự kiện', href: '#' },
    { label: 'Liên hệ', href: '#' },
];

const SERVICES = [
    { label: 'Tour trong nước', href: '#' },
    { label: 'Tour liên tỉnh', href: '#' },
];

const SUPPORT_LINKS = [
    { label: 'Điều khoản dịch vụ', href: '#' },
    { label: 'Chính sách bảo mật', href: '#' },
    { label: 'Hướng dẫn thanh toán', href: '#' },
];


function FooterColumn({ title, links }) {
    return (
        <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {title}
            </h3>
            <ul className="flex flex-col gap-2">
                {links.map((link, index) => (
                    <li key={index}>
                        <Link
                            to={link.href}
                            className="text-[12px] text-slate-400 transition hover:text-[#0EA5E5]"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Footer() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { webInfo } = useWebInfo();
    const url = "https://localhost:7016";

    // Bọc an toàn tránh crash nếu webInfo chưa load xong
    const currentWebInfo = webInfo || {
        logo_url: '',
        ten_trang: 'Travel Agency',
        dia_chi: 'Đang cập nhật địa chỉ...',
        facebook_url: '#',
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toastError("Thiếu thông tin", "Vui lòng nhập email");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            toastError("Email không hợp lệ", "Vui lòng nhập đúng định dạng email");
            return;
        }

        try {
            setLoading(true);
            await subscribeNewsletterApi(email.trim());
            toastSuccess(
                "Đăng ký thành công",
                "Bạn sẽ nhận được các tin tức mới nhất qua email."
            );
            setEmail("");
        } catch (error) {
            toastError("Thao tác thất bại", getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="bg-[#0F172A] text-slate-400 border-t border-slate-800">
            <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-12 lg:py-16">
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_2fr] items-start">
                    
                    {/* Cột thông tin thương hiệu */}
                    <div className="flex flex-col gap-4">
                        <Link to="#" className="flex items-center gap-2.5">
                            {currentWebInfo.logo_url && (
                                <img
                                    src={`${url}${currentWebInfo.logo_url}`}
                                    alt={currentWebInfo.ten_trang} 
                                    className="h-8 w-auto object-contain"
                                />
                            )}
                            <span
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                                className="text-base font-bold text-white tracking-wide"
                            >
                                {currentWebInfo.ten_trang}
                            </span>
                        </Link>
                        <p
                            style={{ fontFamily: "'Inter', sans-serif" }}
                            className="text-[12px] leading-relaxed text-slate-400 max-w-[240px]"
                        >
                            {currentWebInfo.dia_chi}
                        </p>
                         <p
                            style={{ fontFamily: "'Inter', sans-serif" }}
                            className="text-[10px] leading-relaxed text-slate-400 max-w-[240px]"
                        >
                          Số điện thoại liên hệ:  {currentWebInfo.so_dien_thoai}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                            <a 
                                href={currentWebInfo.facebook_url} 
                                target="_blank" 
                                rel="noreferrer" 
                                aria-label="Facebook" 
                                className="text-white hover:text-[#0EA5E5] transition"
                            >
                                <i className="fa-brands fa-facebook text-xl" />
                            </a>
                        </div>
                    </div>

                    {/* Các cột danh mục nội dung thực tế */}
                    <FooterColumn title="Khám phá" links={QUICK_LINKS} />
                    <FooterColumn title="Dịch vụ" links={SERVICES} />
                    <FooterColumn title="Hỗ trợ" links={SUPPORT_LINKS} />

                    {/* Form nhận newsletter */}
                    <div className="flex flex-col gap-3 lg:pl-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Nhận ưu đãi du lịch
                        </h3>

                        <p className="text-[12px] text-slate-400 leading-normal">
                            Đăng ký để nhận thông tin về các tour mới, ưu đãi hot nhất từ chúng tôi.
                        </p>

                        <form
                            onSubmit={handleSubscribe}
                            className="mt-2 flex items-center gap-2 max-w-sm"
                        >
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email của bạn"
                                className="w-full rounded-xl bg-slate-800 px-4 py-3 text-[13px] text-white outline-none border border-slate-700 focus:border-[#0EA5E5] placeholder:text-slate-500"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0EA5E5] text-white transition hover:bg-[#0EA5E5]/90 disabled:opacity-50"
                            >
                                <Send size={14} className="-rotate-12" />
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </footer>
    );
}