import { SlidersHorizontal, Star, Calendar, Tag, DollarSign } from 'lucide-react';
import Dropdown from '~/components/Common/Dropdown';
import { CATEGORIES } from '~/constants/Tours.constants';

const SectionLabel = ({ icon: Icon, label }) => (
    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Icon size={15} className="text-[#0EA5E5]" />
        {label}
    </h3>
);

const FilterDivider = () => (
    <div className="my-5 h-px bg-slate-100" />
);

export default function TourFilter({
    maxPrice,
    setMaxPrice,
    ratings,
    setRatings,
    dayFilters,
    setDayFilters,
    category,
    setCategory,
}) {
    const toggleRating = (value) => {
        setRatings((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    const toggleDay = (value) => {
        setDayFilters((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    const pricePercent =
        ((maxPrice - 1000000) / (50000000 - 1000000)) * 100;

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">

            {/* Header */}
            <h2 className="mb-6 flex items-center justify-center gap-2 text-[22px] font-semibold text-slate-800">
                <SlidersHorizontal size={22} className="text-[#0EA5E5]" />
                Bộ lọc
            </h2>

            {/* GIÁ TỐI ĐA */}
            <div className="mb-6">
                <SectionLabel icon={DollarSign} label="Giá tối đa" />

                {/* Price display */}
                <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="text-slate-400">1.000.000đ</span>
                    <span
                        className="rounded-lg px-3 py-1 text-sm font-bold tabular-nums text-white"
                        style={{ backgroundColor: '#0EA5E5' }}
                    >
                        {maxPrice.toLocaleString('vi-VN')}đ
                    </span>
                </div>

                {/* Custom range track */}
                <div className="relative h-1.5 w-full rounded-full bg-slate-200">
                    <div
                        className="absolute left-0 top-0 h-full rounded-full"
                        style={{
                            width: `${pricePercent}%`,
                            backgroundColor: '#0EA5E5',
                        }}
                    />
                    <input
                        type="range"
                        min="1000000"
                        max="50000000"
                        step="500000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    {/* Thumb */}
                    <div
                        className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white shadow-md"
                        style={{
                            left: `${pricePercent}%`,
                            borderColor: '#0EA5E5',
                        }}
                    />
                </div>

                <div className="mt-2 text-right text-xs text-slate-400">
                    50.000.000đ
                </div>
            </div>

            <FilterDivider />

            {/* ĐÁNH GIÁ */}
            <div className="mb-6">
                <SectionLabel icon={Star} label="Đánh giá" />

                <div className="flex flex-col gap-2">
                    {[
                        { value: 4, },
                        { value: 5, },
                    ].map(({ value, label }) => {
                        const active = ratings.includes(value);
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => toggleRating(value)}
                                className="flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-all duration-200"
                                style={
                                    active
                                        ? {
                                            borderColor: '#0EA5E5',
                                            backgroundColor: '#EFF9FF',
                                            color: '#0EA5E5',
                                        }
                                        : {
                                            borderColor: '#e2e8f0',
                                            backgroundColor: 'white',
                                            color: '#64748b',
                                        }
                                }
                                onMouseEnter={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.borderColor = '#0EA5E5';
                                        e.currentTarget.style.color = '#0EA5E5';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.color = '#64748b';
                                    }
                                }}
                            >
                                {/* Custom checkbox */}
                                <span
                                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all duration-200"
                                    style={
                                        active
                                            ? { borderColor: '#0EA5E5', backgroundColor: '#0EA5E5' }
                                            : { borderColor: '#cbd5e1', backgroundColor: 'white' }
                                    }
                                >
                                    {active && (
                                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                            <path
                                                d="M1 4l2 2 4-4"
                                                stroke="white"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </span>

                                {/* Stars + label */}
                                <div className="flex items-center gap-1.5">
                                    {Array.from({ length: value === 4 ? 4 : 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={12}
                                            fill={active ? '#FBBF24' : 'transparent'}
                                            stroke={active ? '#FBBF24' : '#cbd5e1'}
                                        />
                                    ))}
                                    {value === 4 && (
                                        <Star size={12} fill="transparent" stroke="#FEF3C7" />
                                    )}
                                    <span className="ml-1">{label}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <FilterDivider />

            {/* SỐ NGÀY */}
            <div className="mb-6">
                <SectionLabel icon={Calendar} label="Số ngày đi" />

                <div className="flex flex-col gap-2">
                    {[
                        { value: '2-3', label: '2 – 3 ngày' },
                        { value: '4-7', label: '4 – 7 ngày' },
                        { value: '7+', label: 'Trên 1 tuần' },
                    ].map(({ value, label }) => {
                        const active = dayFilters.includes(value);
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => toggleDay(value)}
                                className="flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-all duration-200"
                                style={
                                    active
                                        ? {
                                            borderColor: '#0EA5E5',
                                            backgroundColor: '#EFF9FF',
                                            color: '#0EA5E5',
                                        }
                                        : {
                                            borderColor: '#e2e8f0',
                                            backgroundColor: 'white',
                                            color: '#64748b',
                                        }
                                }
                                onMouseEnter={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.borderColor = '#0EA5E5';
                                        e.currentTarget.style.color = '#0EA5E5';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.color = '#64748b';
                                    }
                                }}
                            >
                                <span
                                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all duration-200"
                                    style={
                                        active
                                            ? { borderColor: '#0EA5E5', backgroundColor: '#0EA5E5' }
                                            : { borderColor: '#cbd5e1', backgroundColor: 'white' }
                                    }
                                >
                                    {active && (
                                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                            <path
                                                d="M1 4l2 2 4-4"
                                                stroke="white"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </span>
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <FilterDivider />

            {/* LOẠI TOUR */}
            <div>
                <SectionLabel icon={Tag} label="Loại tour" />
                <Dropdown
                    value={category}
                    options={CATEGORIES.map((item) => ({
                        value: item,
                        label: item,
                    }))}
                    onChange={setCategory}
                    fullWidth
                />
            </div>
        </div>
    );
}