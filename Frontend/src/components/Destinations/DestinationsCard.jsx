import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

function DestinationsCard({
    id,
    slug,
    image,
    name,
    description,
    province,
    toursCount = 0,
}) {
    return (
        <article
            className="
               group flex h-[360px] w-full flex-col overflow-hidden rounded-2xl
                border border-slate-100 bg-white shadow-sm
                transition-all duration-300
                hover:-translate-y-1 hover:border-[#0EA5E5]/30
            "
        >
            {/* 1. IMAGE - Gọn gàng theo thiết kế */}
            <div className="relative h-44 flex-shrink-0 overflow-hidden sm:h-48 md:h-52">
                <img
                    src={image}
                    alt={name || 'Điểm đến du lịch'}
                    loading="lazy"
                    className="
                        h-full w-full object-cover
                        transition-transform duration-500 ease-out
                        group-hover:scale-105
                    "
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>

            </div>

            {/* 2. CONTENT - Áp dụng Font Poppins cho Heading & Inter cho Body */}
            <div className="flex flex-1 flex-col gap-1.5 p-4">
                <div className="flex items-start justify-between gap-3">
                    <h3
                        title={name}
                        className="
                            line-clamp-2 text-[13px] font-bold leading-snug
                            text-slate-900 transition-colors duration-200
                            group-hover:text-[#0EA5E5]
                        "
                    >
                        {name}
                    </h3>

                    {/* Badge số lượng tours */}
                    <span
                        style={{ color: '#0EA5E5', backgroundColor: '#0EA5E510' }}
                        className="
                            shrink-0 whitespace-nowrap rounded-full
                            px-2.5 py-0.5 text-[11px] font-semibold
                        "
                    >
                        {toursCount} tours
                    </span>
                </div>

                {/* Mô tả ngắn */}
                <p
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="
                        line-clamp-4 text-[12px] leading-relaxed text-slate-500 
                    "
                >
                    {description}
                </p>
            </div>

            {/* 3. FOOTER - Text link phẳng chuẩn Figma */}
            <div
                className="
                    flex items-center justify-between gap-2 border-t border-slate-100/80
                    px-4 py-3 mt-auto
                "
            >
                {/* Địa điểm bên trái */}
                <div
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="flex min-w-0 items-center gap-1.5 text-xs text-slate-400"
                >
                    <MapPin size={14} className="shrink-0 text-slate-400" />
                    <span className="truncate leading-none text-[12px] font-semibold">{province}</span>
                </div>

                <Link
                    to={`/Cac-Chuyen-Di?diaDiem=${slug}`}
                    style={{ fontFamily: "'Inter', sans-serif", color: '#0EA5E5' }}
                    className="
                    inline-flex shrink-0 items-center justify-center gap-1 px-3 py-2 rounded-2xl
                    text-xs font-semibold transition-all duration-200 bg-[#0EA5E5]
                    hover:opacity-80
                    "
                >
                    <span className="text-[12px] text-white">Xem địa điểm</span>
                    <ArrowRight size={13} className="text-white transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
            </div>
        </article>
    );
}

export default memo(DestinationsCard);