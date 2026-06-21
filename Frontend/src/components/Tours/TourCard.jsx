import { memo, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Calendar, Users, ArrowRight, MapPin } from 'lucide-react';
import { formatCurrency } from '~/Helper/FormatCurrency';
function TourCard({
    id,
    image,
    name,
    destination,
    duration,
    price = 0,
    rating,
    reviewCount,
    availableSlots,
}) {
    const [wishlisted, setWishlisted] = useState(false);



    return (
        <article
            className="
            group flex h-[340px] w-full flex-col overflow-hidden rounded-2xl
            border border-slate-100 bg-white shadow-sm
            transition-all duration-300
            hover:-translate-y-1 hover:border-[#0EA5E5]/30
            "
        >
            {/* 1. IMAGE - Giữ nguyên chiều cao cũ của bạn */}
            <div className="relative h-52 flex-shrink-0 overflow-hidden sm:h-56 md:h-60">
                <img
                    src={image}
                    alt={name || 'Tour du lịch'}
                    loading="lazy"
                    className="
                        h-full w-full object-cover
                        transition-transform duration-500 ease-out
                        group-hover:scale-105
                    "
                />

                {/* Badge số sao đánh giá */}
                <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-slate-900/40 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span>{rating || '0.0'}</span>
                    {reviewCount ? (
                        <span className="text-white/80">({reviewCount})</span>
                    ) : null}
                </div>

                {/* Nút Yêu thích */}
                <button
                    type="button"
                    onClick={() => setWishlisted((v) => !v)}
                    aria-label={wishlisted ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow backdrop-blur-sm transition hover:scale-110 active:scale-95"
                >
                    <Heart
                        size={15}
                        className={wishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}
                    />
                </button>
            </div>

            {/* 2. CONTENT + FOOTER BLOCK - Biến toàn bộ vùng bên dưới thành flex container */}
            <div className="flex flex-1 flex-col justify-between p-2">

                {/* Khối nội dung chữ phía trên */}
                <div className="flex flex-col gap-2.5">
                    {/* Tiêu đề Tour - Fix cứng 1 dòng, quá dài tự động thành dấu ... */}
                    <h3
                        title={name}
                        className="
                            truncate whitespace-nowrap text-[13px] font-bold leading-snug
                            text-slate-900 transition-colors duration-200
                            group-hover:text-[#0EA5E5]
                        "
                    >
                        {name}
                    </h3>

                    {/* Khối thông tin bổ trợ (Lịch trình & Chỗ trống) */}
                    <div

                        className="flex flex-col gap-1 text-xs text-slate-500"
                    >
                        {/* Lịch trình */}
                        <div className="flex items-center gap-1.5">
                            <Calendar size={13} className="shrink-0 text-slate-400" />
                            <span className="truncate text-[12px]">{duration || 'Liên hệ'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin size={13} className="shrink-0 text-slate-400" />
                            <span className="truncate text-[12px]">{destination || 'Liên hệ'}</span>
                        </div>
                    </div>
                </div>

                {/* 3. FOOTER - Chống rớt dòng cho phần giá */}
                <div
                    className="
                        mt-2 flex items-center justify-between gap-3
                        border-t border-slate-100/80 pt-4
                    "
                >
                    <div
                        style={{ fontFamily: "'Inter', sans-serif" }}
                        className="flex flex-col text-left"
                    >
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                            Giá từ
                        </span>

                        <div className="flex items-end gap-1">
                            <span className="text-lg font-bold text-slate-900">
                                {formatCurrency(price)}
                            </span>
                            <span className="mb-[1px] text-[11px] text-slate-400">
                                đ/người
                            </span>
                        </div>
                    </div>

                    {/* Nút Xem chi tiết */}
                    <Link
                        to={`/Cac-Chuyen-Di/${name}`}

                        className="
                            inline-flex shrink-0 items-center justify-center
                            rounded-2xl bg-[#0EA5E5] px-3 py-2.5
                            text-xs font-semibold text-white
                            transition-all duration-200
                            hover:bg-[#0EA5E5]/90 hover:shadow-sm active:scale-95
                        "
                    >
                        <span className="text-[12px]">Xem chi tiết</span>
                        <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default memo(TourCard);