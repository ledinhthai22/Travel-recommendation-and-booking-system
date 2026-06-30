import { useState } from 'react';
import { SlidersHorizontal, Star, Calendar, Tag, DollarSign } from 'lucide-react';
import SelectField from '~/components/UI/Form/SelectField';
import { useCategories } from '~/Hooks/useCategories';

const SectionLabel = ({ icon: Icon, label }) => (
    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Icon size={15} className="text-[#0EA5E5]" />
        {label}
    </h3>
);

const FilterDivider = () => <div className="my-4 h-px bg-slate-100" />;

const DAY_OPTIONS = [
    { id: '', name: 'Tất cả' },
    { id: '2-3', name: '2 – 3 ngày' },
    { id: '4-7', name: '4 – 7 ngày' },
    { id: '7+', name: 'Trên 1 tuần' },
];

export default function TourFilter({
    minPrice = 1000000,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    ratings,
    setRatings,
    dayFilters,
    setDayFilters,
    category,
    setCategory,
}) {
    const MIN = 1000000;
    const MAX = 50000000;

    const minPercent = ((minPrice - MIN) / (MAX - MIN)) * 100;
    const maxPercent = ((maxPrice - MIN) / (MAX - MIN)) * 100;

    const toggleRating = (value) => {
        setRatings(prev =>
            prev.includes(value) ? prev.filter(r => r !== value) : [...prev, value]
        );
    };

    const { categories, loading } = useCategories();


    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">

            {/* Header */}
            <h2 className="mb-5 flex items-center justify-center gap-2 text-lg font-bold text-slate-800">
                <SlidersHorizontal size={18} className="text-[#0EA5E5]" />
                Bộ lọc
            </h2>

            {/* ── Khoảng giá (2 đầu) ── */}
            <div className="mb-2">
                <SectionLabel icon={DollarSign} label="Khoảng giá" />

                {/* Min - Max display */}
                <div className="flex items-center justify-between mb-3 gap-2">
                    <span className="text-xs font-semibold text-[#0EA5E5] bg-sky-50 border border-sky-100 rounded-lg px-2.5 py-1 tabular-nums">
                        {minPrice.toLocaleString('vi-VN')}đ
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-semibold text-[#0EA5E5] bg-sky-50 border border-sky-100 rounded-lg px-2.5 py-1 tabular-nums">
                        {maxPrice.toLocaleString('vi-VN')}đ
                    </span>
                </div>

                {/* Dual range track */}
                <div className="relative h-1.5 w-full rounded-full bg-slate-200 my-4">
                    {/* Active track */}
                    <div
                        className="absolute top-0 h-full rounded-full bg-[#0EA5E5]"
                        style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
                    />

                    {/* Min thumb */}
                    <input
                        type="range"
                        min={MIN} max={MAX} step={500000}
                        value={minPrice}
                        onChange={e => {
                            const val = Number(e.target.value);
                            if (val < maxPrice - 500000) setMinPrice(val);
                        }}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-20"
                    />
                    <div
                        className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white shadow-md z-10"
                        style={{ left: `${minPercent}%`, borderColor: '#0EA5E5' }}
                    />

                    {/* Max thumb */}
                    <input
                        type="range"
                        min={MIN} max={MAX} step={500000}
                        value={maxPrice}
                        onChange={e => {
                            const val = Number(e.target.value);
                            if (val > minPrice + 500000) setMaxPrice(val);
                        }}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-20"
                    />
                    <div
                        className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white shadow-md z-10"
                        style={{ left: `${maxPercent}%`, borderColor: '#0EA5E5' }}
                    />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>1.000.000đ</span>
                    <span>50.000.000đ</span>
                </div>
            </div>

            <FilterDivider />

            {/* ── Loại tour ── */}
            <div className="mb-2">
                <SectionLabel icon={Tag} label="Loại tour" />
                <SelectField
                    value={category}
                    onChange={setCategory}
                    options={categories} // <--- Dùng danh sách động từ API
                    valueKey="id"
                    labelKey="name"
                    searchable={false}
                    placeholder={loading ? "Đang tải..." : "Chọn loại tour"}
                />
            </div>

            <FilterDivider />

            {/* ── Số sao đánh giá ── */}
            <div className="mb-2">
                <SectionLabel icon={Star} label="Đánh giá" />
                <div className="flex flex-col gap-2">
                    {[5, 4, 3].map(star => {
                        const active = ratings.includes(star);
                        return (
                            <button
                                key={star}
                                type="button"
                                onClick={() => toggleRating(star)}
                                className="flex items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm font-medium transition-all duration-200"
                                style={active
                                    ? { borderColor: '#0EA5E5', backgroundColor: '#EFF9FF', color: '#0EA5E5' }
                                    : { borderColor: '#e2e8f0', backgroundColor: 'white', color: '#64748b' }
                                }
                            >
                                {/* Checkbox */}
                                <span
                                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all"
                                    style={active
                                        ? { borderColor: '#0EA5E5', backgroundColor: '#0EA5E5' }
                                        : { borderColor: '#cbd5e1', backgroundColor: 'white' }
                                    }
                                >
                                    {active && (
                                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                            <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </span>

                                {/* Stars */}
                                <div className="flex items-center gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={13}
                                            fill={i < star ? (active ? '#FBBF24' : '#e2e8f0') : 'transparent'}
                                            stroke={i < star ? (active ? '#FBBF24' : '#e2e8f0') : '#e2e8f0'}
                                        />
                                    ))}
                                </div>

                                <span className="text-xs">({star} sao{star < 5 ? ' trở lên' : ''})</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <FilterDivider />

            {/* ── Số ngày đi ── */}
           <div>
            <SectionLabel icon={Calendar} label="Số ngày đi" />
            <SelectField
                value={dayFilters[0] ?? ''}
                onChange={(val) => setDayFilters(val ? [val] : [])}
                options={DAY_OPTIONS}
                valueKey="id"
                labelKey="name"
                searchable={false}
                placeholder="Chọn khoảng thời gian"
            />
        </div>
        </div>
    );
}