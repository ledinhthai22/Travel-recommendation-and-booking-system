import { useState } from "react";
import { ChevronLeft,ChevronRight,Camera } from "lucide-react";
export function ImageGallery({ images }) {
    const [active, setActive] = useState(0);

    return (
        <div className="overflow-hidden rounded-2xl ">
            <div className="relative w-full overflow-hidden bg-slate-100">
                <img
                    src={images[active]}
                    alt="Tour"
                    className="h-[550px] w-full rounded-2xl object-fill transition-all duration-500"
                />

                {/* Prev */}
                <button
                    onClick={() => setActive((p) => (p - 1 + images.length) % images.length)}
                    className="group absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition"
                >
                    <ChevronLeft
                        size={24}
                        className="text-slate-700 transition-transform duration-300 group-hover:scale-125"
                    />
                </button>

                {/* Next */}
                <button
                    onClick={() => setActive((p) => (p + 1) % images.length)}
                    className="group absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition"
                >
                    <ChevronRight
                        size={24}
                        className="text-slate-700 transition-transform duration-300 group-hover:scale-125"
                    />
                </button>

                {/* Counter */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
                    <Camera size={12} />
                    {active + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnails */}
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => setActive(i)}
                        className={`relative h-35 w-60 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${active === i ? 'border-[#0EA5E5]' : 'border-none'
                            }`}
                    >
                        <img src={img} alt="" className="h-full w-full object-fill" />
                    </button>
                ))}
            </div>
        </div>
    );
}
