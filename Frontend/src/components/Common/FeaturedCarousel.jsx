import React, {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

/**
 * FeaturedCarousel
 */
function FeaturedCarousel({
    items = [],
    renderItem,
    itemsPerPage = 4,
    gap = 20,
    autoPlayMs = 4000,
    title,
    subtitle,
    viewAllTo,
    className = '',
}) {
    const trackRef = useRef(null);

    const [index, setIndex] = useState(0);
    const [isHover, setIsHover] = useState(false);
    const [visibleItems, setVisibleItems] = useState(itemsPerPage);

    // 1. Khởi tạo Responsive số card theo màn hình
    useEffect(() => {
        const updateVisibleItems = () => {
            const width = window.innerWidth;
            if (width < 640) {
                setVisibleItems(1);
            } else if (width < 1024) {
                setVisibleItems(2);
            } else if (width < 1440) {
                setVisibleItems(3);
            } else {
                setVisibleItems(4);
            }
        };

        updateVisibleItems();
        window.addEventListener('resize', updateVisibleItems);

        return () => window.removeEventListener('resize', updateVisibleItems);
    }, [itemsPerPage]);

    const maxIndex = useMemo(() => {
        return Math.max(0, Math.ceil(items.length / visibleItems) - 1);
    }, [items.length, visibleItems]);

    // 2. Khai báo hàm xử lý scroll (Đặt ở trên để tránh lỗi Hoisting / ReferenceError)
    const scrollToToIndex = useCallback(
        (nextIndex) => {
            const track = trackRef.current;
            if (!track) return;

            const firstCard = track.children[0];
            if (!firstCard) return;

            const cardWidth = firstCard.offsetWidth;
            const left = (cardWidth + gap) * visibleItems * nextIndex;

            track.scrollTo({
                left,
                behavior: 'smooth',
            });
        },
        [gap, visibleItems]
    );

    const goTo = useCallback(
        (nextIndex) => {
            const safeIndex = Math.min(Math.max(nextIndex, 0), maxIndex);
            setIndex(safeIndex);
            scrollToToIndex(safeIndex);
        },
        [maxIndex, scrollToToIndex]
    );

    const goNext = useCallback(() => {
        const nextIndex = index >= maxIndex ? 0 : index + 1;
        goTo(nextIndex);
    }, [index, maxIndex, goTo]);

    const goPrev = useCallback(() => {
        const nextIndex = index <= 0 ? maxIndex : index - 1;
        goTo(nextIndex);
    }, [index, maxIndex, goTo]);

    // 3. Điều khiển Autoplay
    useEffect(() => {
        if (!autoPlayMs || isHover || maxIndex === 0) return;

        const intervalId = window.setInterval(goNext, autoPlayMs);

        return () => window.clearInterval(intervalId);
    }, [autoPlayMs, isHover, maxIndex, goNext]);

    // 4. Theo dõi và cập nhật vị trí khi Resize hoặc đổi trang
    useEffect(() => {
        if (index > maxIndex) {
            goTo(maxIndex);
        } else {
            scrollToToIndex(index);
        }
    }, [visibleItems, maxIndex, index, goTo, scrollToToIndex]);

    if (!items.length || typeof renderItem !== 'function') return null;

    const showControls = maxIndex > 0;

    return (
        <section
            className={`relative w-full ${className}`}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            {/* HEADER ZONE */}
            <div className="mb-6 flex items-end justify-between gap-4 px-0 sm:px-8">
                <div className="text-left">
                    {title && (
                        <h2
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                            className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
                        >
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <p
                            style={{ fontFamily: "'Inter', sans-serif" }}
                            className="mt-1.5 text-xs text-slate-500 sm:text-sm"
                        >
                            {subtitle}
                        </p>
                    )}
                </div>

                {viewAllTo && (
                    <Link
                        to={viewAllTo}
                        style={{ fontFamily: "'Inter', sans-serif", color: '#0EA5E5' }}
                        className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold transition-colors hover:gap-10 duration-200 hover:opacity-80"
                    >
                        <span>Xem thêm</span>
                        <ArrowRight size={15} />
                    </Link>
                )}
            </div>

            {/* CAROUSEL TRACK */}
            <div className="relative w-full">
                {showControls && (
                    <button
                        type="button"
                        onClick={goPrev}
                        aria-label="Trước"
                        className="
                            absolute left-2 top-1/2 z-10 hidden -translate-y-1/2
                            rounded-full bg-white p-2.5 text-slate-600 shadow-md
                            transition-all duration-200 border border-slate-100
                            hover:bg-slate-50 active:scale-95
                            sm:flex
                        "
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}

                <div
                    ref={trackRef}
                    className="
                        no-scrollbar flex overflow-x-auto overflow-y-visible scroll-smooth
                        px-0 py-2 sm:px-8
                    "
                    style={{ gap }}
                >
                    {items.map((item, itemIndex) => (
                        <div
                            key={item.id ?? itemIndex}
                            className="shrink-0"
                            style={{
                                width: `calc((100% - ${gap * (visibleItems - 1)}px) / ${visibleItems})`,
                            }}
                        >
                            {renderItem(item)}
                        </div>
                    ))}
                </div>

                {showControls && (
                    <button
                        type="button"
                        onClick={goNext}
                        aria-label="Tiếp theo"
                        className="
                            absolute right-2 top-1/2 z-10 hidden -translate-y-1/2
                            rounded-full bg-white p-2.5 text-slate-600 shadow-md
                            transition-all duration-200 border border-slate-100
                            hover:bg-slate-50 active:scale-95
                            sm:flex
                        "
                    >
                        <ChevronRight size={18} />
                    </button>
                )}
            </div>

            {/* BOTTOM NAVIGATION DOTS */}
            {showControls && (
                <div className="mt-6 flex justify-center gap-1.5">
                    {Array.from({ length: maxIndex + 1 }).map((_, dotIndex) => (
                        <button
                            key={dotIndex}
                            type="button"
                            onClick={() => goTo(dotIndex)}
                            aria-label={`Trang ${dotIndex + 1}`}
                            className={`
                                rounded-full transition-all duration-300
                                ${dotIndex === index
                                    ? 'h-2 w-5 bg-[#0EA5E5]'
                                    : 'h-2 w-2 bg-slate-200 hover:bg-slate-300'
                                }
                            `}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default memo(FeaturedCarousel);