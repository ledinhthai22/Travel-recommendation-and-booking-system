import { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Camera
} from "lucide-react";

export function ImageGallery({ images = [] }) {
    const [active, setActive] = useState(0);

    if (!images.length) return null;

    return (
        <div>
            {/* Main Image */}
            <div className="relative overflow-hidden rounded-2xl">

                <img
                    src={images[active].duongDanAnh}
                    alt="Tour"
                    className="block h-[550px] w-full object-cover"
                />

                {/* Prev */}
                <button
                    onClick={() =>
                        setActive(
                            (prev) =>
                                (prev - 1 + images.length) %
                                images.length
                        )
                    }
                    className="group absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm"
                >
                    <ChevronLeft
                        size={24}
                        className="text-slate-700 transition-transform duration-300 group-hover:scale-125"
                    />
                </button>

                {/* Next */}
                <button
                    onClick={() =>
                        setActive(
                            (prev) =>
                                (prev + 1) %
                                images.length
                        )
                    }
                    className="group absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm"
                >
                    <ChevronRight
                        size={24}
                        className="text-slate-700 transition-transform duration-300 group-hover:scale-125"
                    />
                </button>

                {/* Counter */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
                    <Camera size={12} />
                    {active + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnails */}
            <div className="mt-3 flex gap-3 overflow-x-auto">
                {images.map((image, index) => (
                    <button
                        key={image.maAnhTour}
                        onClick={() => setActive(index)}
                        className={`relative h-32 w-52 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                            active === index
                                ? "border-sky-500"
                                : "border-transparent"
                        }`}
                    >
                        <img
                            src={image.duongDanAnh}
                            alt={`Ảnh ${index + 1}`}
                            className="h-full w-full object-cover"
                        />

                        {image.AnhChinh && (
                            <span className="absolute left-2 top-2 rounded-full bg-sky-500 px-2 py-1 text-[10px] font-bold text-white">
                                Ảnh chính
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}