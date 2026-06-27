import { useState } from "react";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";

const IMAGE_BASE_URL = "https://localhost:7016"; 

export function ImageGallery({ images = [] }) {
    const [active, setActive] = useState(0);

    if (!images || !images.length) return null;

    const currentImage = images[active] ?? images[0];


    const MAX_THUMBNAILS = 5;
    const totalImages = images.length;
    const hasMoreImages = totalImages > MAX_THUMBNAILS;


    const visibleThumbnails = images.slice(0, MAX_THUMBNAILS);


    const getFullImageUrl = (path) => {
        if (!path) return "";
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }
        const cleanPath = path.startsWith("/") ? path : `/${path}`;
        const cleanBase = IMAGE_BASE_URL.endsWith("/") 
            ? IMAGE_BASE_URL.slice(0, -1) 
            : IMAGE_BASE_URL;

        return `${cleanBase}${cleanPath}`;
    };

    return (
        <div className="w-full flex flex-col gap-3">
          
            <div className="relative overflow-hidden rounded-2xl bg-slate-100 shadow-sm group">
                <img
                    src={getFullImageUrl(currentImage?.duongDanAnh)}
                    alt="Tour Main"
                    className="block h-[500px] w-full object-cover transition-all duration-500 ease-out"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/800x500?text=No+Image+Found";
                    }}
                />

                <button
                    onClick={() =>
                        setActive((prev) => (prev - 1 + totalImages) % totalImages)
                    }
                    className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-105"
                >
                    <ChevronLeft size={22} className="text-slate-800" />
                </button>

                <button
                    onClick={() =>
                        setActive((prev) => (prev + 1) % totalImages)
                    }
                    className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-105"
                >
                    <ChevronRight size={22} className="text-slate-800" />
                </button>


                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm tracking-wider">
                    {active + 1} / {totalImages}
                </div>
            </div>

            <div 
                className="grid gap-3 w-full"
                style={{ gridTemplateColumns: `repeat(${visibleThumbnails.length}, minmax(0, 1fr))` }}
            >
                {visibleThumbnails.map((image, index) => {
                    const isLastVisible = index === MAX_THUMBNAILS - 1;
                    const isActive = active === index;

                    return (
                        <button
                            key={image.maAnhTour || image.duongDanAnh || index}
                            onClick={() => setActive(index)}
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
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/200x120?text=Error";
                                }}
                            />

                            {image.anhChinh && !isLastVisible && (
                                <span className="absolute left-1.5 top-1.5 rounded-md bg-sky-500 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wide">
                                    Chính
                                </span>
                            )}
                            {isLastVisible && hasMoreImages && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white font-bold backdrop-blur-[1px] hover:bg-black/40 transition-colors">
                                    <span className="text-lg">+{totalImages - MAX_THUMBNAILS + 1}</span>
                                    <span className="text-[10px] font-medium tracking-tight opacity-90">Xem tất cả</span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}