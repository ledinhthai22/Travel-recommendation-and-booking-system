import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import Logo from '~/assets/Image/Logo.png';
import { useState } from 'react';
import { subscribeNewsletterApi } from '~/Services/NewletterSevice';
import {
    toastSuccess,
    toastError,
} from "~/utils/Toast";
import { getErrorMessage } from "~/utils/errorHelper";
import { useWebInfo } from '~/Hooks/useWebInfo';
const QUICK_LINKS = [
    { label: 'lorem lorem', href: '/' },
    { label: 'lorem lorem', href: '/' },
    { label: 'lorem lorem', href: '/' },
];

const SERVICES = [
    { label: 'lorem lorem', href: '/' },
    { label: 'lorem lorem', href: '/' },
    { label: 'lorem lorem', href: '/' },
];

const SUPPORT_LINKS = [
    { label: 'lorem lorem', href: '/' },
    { label: 'lorem lorem', href: '/' },
    { label: 'lorem lorem', href: '/' },
];


function FooterColumn({ title, links }) {
    
    return (
        <div className="flex flex-col gap-3">
            <h3

                className="text-sm font-bold text-white uppercase"
            >
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
    const {webInfo} = useWebInfo()
    const url = "https://localhost:7016"
    const handleSubscribe = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toastError(
                "Thiếu thông tin",
                "Vui lòng nhập email"
            );
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            toastError(
                "Email không hợp lệ",
                "Vui lòng nhập đúng định dạng email"
            );
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
            toastError(
                "Thao tác thất bại",
                getErrorMessage(error)
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <footer className="bg-[#0F172A] text-slate-400">
            <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-12 lg:py-16">
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_2fr] items-start">
                    <div className="flex flex-col gap-4">
                        <Link to="/" className="flex items-center gap-2.5">
                            <img
                                src={`${url}${webInfo.logo_url}`}
                                alt={`${webInfo.ten_trang}`} 
                                className="h-8 w-auto object-contain"
                            />
                            <span
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                                className="text-base font-bold text-white tracking-wide"
                            >
                                {webInfo.ten_trang}
                            </span>
                        </Link>
                        <p
                            style={{ fontFamily: "'Inter', sans-serif" }}
                            className="text-[11px] leading-relaxed text-slate-400 max-w-[200px]"
                        >
                            {webInfo.dia_chi} <br></br>
                        </p>
                        <div className="flex items-center gap-3 mt-0">
                            <Link to={`${webInfo.facebook_url}`} aria-label="Facebook" className="text-white hover:text-[#0EA5E5] transition">
                                <i className="fa-brands fa-facebook text-lg" />
                            </Link>
                        </div>
                    </div>
                    <FooterColumn title="lorem lorem" links={QUICK_LINKS} />
                    <FooterColumn title="lorem lorem" links={SERVICES} />
                    <FooterColumn title="lorem lorem" links={SUPPORT_LINKS} />
                    <div className="flex flex-col gap-3 lg:pl-4">
                        <h3

                            className="text-sm font-bold text-white uppercase"
                        >
                            Nhận ưu đãi du lịch
                        </h3>

                        <p

                            className="text-[12px] text-slate-400 leading-normal"
                        >
                            Đăng ký để nhận thông tin về các tour mới, ưu đãi.
                        </p>

                        <form
                            onSubmit={handleSubscribe}
                            className="mt-2 flex items-center gap-2 max-w-sm"
                        >
                            <input

                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email của bạn"
                                className="w-full rounded-xl bg-white px-8 py-3 text-[13px] text-slate-800 outline-none placeholder:text-slate-400"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0EA5E5] text-white transition hover:bg-[#0EA5E5]/90 disabled:opacity-50"
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