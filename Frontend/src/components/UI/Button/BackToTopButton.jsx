import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTopButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            const isNearFooter = scrollTop + windowHeight >= documentHeight - 500;

            setVisible(isNearFooter);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!visible) return null;

    return (
        <button
            type="button"
            onClick={scrollToTop}
            aria-label="Quay lại đầu trang"
            className="
                fixed bottom-24 right-6 z-50
                flex h-12 w-12 items-center justify-center
                rounded-full bg-[#0EA5E5] text-white shadow-xl
                transition-all duration-300
                hover:-translate-y-1 hover:bg-[#0EA5E5] hover:shadow-2xl
                active:scale-95
            "
        >
            <ArrowUp size={22} />
        </button>
    );
}