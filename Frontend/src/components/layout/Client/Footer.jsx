import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import Logo from '~/assets/Image/Logo.png';

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
                style={{ fontFamily: "'Poppins', sans-serif" }}
                className="text-sm font-bold text-white"
            >
                {title}
            </h3>
            <ul className="flex flex-col gap-2">
                {links.map((link, index) => (
                    <li key={index}>
                        <Link
                            to={link.href}
                            style={{ fontFamily: "'Inter', sans-serif" }}
                            className="text-xs text-slate-400 transition hover:text-[#0EA5E5]"
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
    return (
        <footer className="bg-[#0F172A] text-slate-400">
            <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-12 lg:py-16">
                {/* Grid Hệ thống phân chia theo mẫu ảnh */}
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_2fr] items-start">
                    
                    {/* Cột 1: Thông tin thương hiệu & MXH */}
                    <div className="flex flex-col gap-4">
                        <Link to="/" className="flex items-center gap-2.5">
                            <img
                                src={Logo}
                                alt="Lối Riêng Travel"
                                className="h-8 w-auto object-contain"
                            />
                            <span 
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                                className="text-base font-bold text-white tracking-wide"
                            >
                                Lối Riêng Travel
                            </span>
                        </Link>
                        
                        <p 
                            style={{ fontFamily: "'Inter', sans-serif" }}
                            className="text-[11px] leading-relaxed text-slate-400 max-w-[200px]"
                        >
                            Địa chỉ: 65 Huỳnh Thúc Kháng, Phường Sài Gòn, TP.HCM
                        </p>

                        {/* Nhóm Icon mạng xã hội dạng phẳng trắng */}
                        <div className="flex items-center gap-3 mt-1">
                            <a href="#" aria-label="Facebook" className="text-white hover:text-[#0EA5E5] transition">
                                <i className="fa-brands fa-facebook text-lg" />
                            </a>
                            <a href="#" aria-label="Instagram" className="text-white hover:text-[#0EA5E5] transition">
                                <i className="fa-brands fa-instagram text-lg" />
                            </a>
                            <a href="#" aria-label="Youtube" className="text-white hover:text-[#0EA5E5] transition">
                                <i className="fa-brands fa-youtube text-lg" />
                            </a>
                        </div>
                    </div>

                    {/* Cột 2, 3, 4: Các cột nội dung link (lorem lorem) */}
                    <FooterColumn title="lorem lorem" links={QUICK_LINKS} />
                    <FooterColumn title="lorem lorem" links={SERVICES} />
                    <FooterColumn title="lorem lorem" links={SUPPORT_LINKS} />

                    {/* Cột 5: Đăng ký nhận tin bên phải */}
                    <div className="flex flex-col gap-3 lg:pl-4">
                        <h3 
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                            className="text-sm font-bold text-white"
                        >
                            Nhận ưu đãi du lịch
                        </h3>
                        
                        <p 
                            style={{ fontFamily: "'Inter', sans-serif" }}
                            className="text-xs text-slate-400 leading-normal"
                        >
                            Đăng ký để nhận thông tin về các tour mới, ưu đãi.
                        </p>

                        {/* Khung Input & Nút Send nằm ngang sát nhau chuẩn mẫu */}
                        <form className="mt-2 flex items-center gap-2 max-w-sm">
                            <input
                                type="email"
                                placeholder="Email của bạn"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                                className="w-full rounded-xl bg-white px-4 py-3 text-xs text-slate-800 outline-none placeholder:text-slate-400"
                            />

                            <button
                                type="submit"
                                className="flex h-10 w-11 shrink-0  items-center justify-center rounded-xl bg-[#0EA5E5] text-white transition hover:bg-[#0EA5E5]/90 active:scale-95 shadow-md"
                                aria-label="Gửi"
                            >
                                <Send size={14} className="transform -rotate-12" />
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </footer>
    );
}