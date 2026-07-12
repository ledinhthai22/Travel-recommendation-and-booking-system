import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

const IMAGE_BASE_URL = import.meta.env.VITE_SIGNAL_URL || "https://localhost:7016";

const DEFAULT_IMAGE = "https://cdn-media.sforum.vn/storage/app/media/anh-vinh-ha-long-2.jpg";

export function ImageGallery({ images = [] }) {
    const [active, setActive] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const sortedImages = [...images].sort((a, b) => {
        if (a.anhChinh === true && b.anhChinh !== true) return -1;
        if (a.anhChinh !== true && b.anhChinh === true) return 1;
        return (a.soThuTu || 0) - (b.soThuTu || 0);
    });

    const totalImages = sortedImages.length;
    const MAX_THUMBNAILS = 5;
    const visibleThumbnails = sortedImages.slice(0, MAX_THUMBNAILS);
    const hasMoreImages = totalImages > MAX_THUMBNAILS;
    const isMultiple = totalImages > 1;

    const getFullImageUrl = (path) => {
        if (!path) return DEFAULT_IMAGE;
        if (path.startsWith("http://") || path.startsWith("https://")) return path;
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        const cleanBase = IMAGE_BASE_URL.endsWith("/") ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
        return `${cleanBase}${cleanPath}`;
    };

    const handleKeyDown = useCallback((e) => {
        if (!lightboxOpen) return;
        if (e.key === "ArrowRight") setLightboxIndex(p => (p + 1) % totalImages);
        if (e.key === "ArrowLeft") setLightboxIndex(p => (p - 1 + totalImages) % totalImages);
        if (e.key === "Escape") setLightboxOpen(false);
    }, [lightboxOpen, totalImages]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        document.body.style.overflow = lightboxOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [lightboxOpen]);

    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    if (!sortedImages || !totalImages) {
        return (
            <div className="w-full">
                <div className="relative overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                    <img
                        src={DEFAULT_IMAGE}
                        alt="Tour"
                        className="block h-[500px] w-full object-cover"
                    />
                </div>
            </div>
        );
    }

    const currentImage = sortedImages[active] ?? sortedImages[0];

    return (
        <>
            <div className="w-full flex flex-col gap-3">
                <div
                    className="relative overflow-hidden rounded-2xl bg-slate-100 shadow-sm group cursor-zoom-in"
                    onClick={() => openLightbox(active)}
                >
                    <img
                        src={getFullImageUrl(currentImage?.duongDanAnh)}
                        alt="Tour Main"
                        className="block h-[500px] w-full object-cover transition-all duration-500 ease-out"
                        onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                    />

                    <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn size={13} /> Xem ảnh lớn
                    </div>

                    {isMultiple && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); setActive(p => (p - 1 + totalImages) % totalImages); }}
                                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
                            >
                                <ChevronLeft size={22} className="text-slate-800" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setActive(p => (p + 1) % totalImages); }}
                                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
                            >
                                <ChevronRight size={22} className="text-slate-800" />
                            </button>
                            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                                {active + 1} / {totalImages}
                            </div>
                        </>
                    )}
                </div>

                {isMultiple && (
                    <div
                        className="grid gap-3 w-full"
                        style={{ gridTemplateColumns: `repeat(${Math.min(visibleThumbnails.length, MAX_THUMBNAILS)}, minmax(0, 1fr))` }}
                    >
                        {visibleThumbnails.map((image, index) => {
                            const isLastVisible = index === MAX_THUMBNAILS - 1 && hasMoreImages;
                            const isActive = active === index;

                            return (
                                <button
                                    key={image.maAnhTour || image.duongDanAnh || index}
                                    onClick={() => isLastVisible ? openLightbox(index) : setActive(index)}
                                    className={`relative h-24 w-full overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                                        isActive && !isLastVisible
                                            ? "border-sky-500 shadow-sm scale-[0.97]"
                                            : "border-transparent hover:opacity-90"
                                    }`}
                                >
                                    <img
                                        src={getFullImageUrl(image?.duongDanAnh)}
                                        alt={`Thumb ${index + 1}`}
                                        className="h-full w-full object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                                    />

                                    {isLastVisible && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 text-white font-bold backdrop-blur-[1px] hover:bg-black/45 transition-colors">
                                            <span className="text-xl">+{totalImages - MAX_THUMBNAILS + 1}</span>
                                            <span className="text-[10px] font-medium opacity-90">Xem tất cả</span>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex flex-col"
                    onClick={() => setLightboxOpen(false)}
                >
                    <div className="flex items-center justify-between px-6 py-4 shrink-0" onClick={e => e.stopPropagation()}>
                        <span className="text-white/70 text-sm font-medium">
                            {lightboxIndex + 1} / {totalImages}
                        </span>
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div
                        className="flex-1 flex items-center justify-center px-16 relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setLightboxIndex(p => (p - 1 + totalImages) % totalImages)}
                            className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                        >
                            <ChevronLeft size={26} />
                        </button>

                        <img
                            src={getFullImageUrl(sortedImages[lightboxIndex]?.duongDanAnh)}
                            alt={`Ảnh ${lightboxIndex + 1}`}
                            className="max-h-[75vh] max-w-full object-contain rounded-xl select-none"
                            onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                        />

                        <button
                            onClick={() => setLightboxIndex(p => (p + 1) % totalImages)}
                            className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                        >
                            <ChevronRight size={26} />
                        </button>
                    </div>

                    <div
                        className="flex gap-2 px-6 py-4 overflow-x-auto shrink-0 justify-center"
                        onClick={e => e.stopPropagation()}
                    >
                        {sortedImages.map((image, index) => (
                            <button
                                key={image.maAnhTour || image.duongDanAnh || index}
                                onClick={() => setLightboxIndex(index)}
                                className={`shrink-0 h-16 w-24 overflow-hidden rounded-lg border-2 transition-all ${
                                    lightboxIndex === index
                                        ? "border-sky-400 opacity-100 scale-105"
                                        : "border-transparent opacity-50 hover:opacity-80"
                                }`}
                            >
                                <img
                                    src={getFullImageUrl(image?.duongDanAnh)}
                                    alt={`Thumb ${index + 1}`}
                                    className="h-full w-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}