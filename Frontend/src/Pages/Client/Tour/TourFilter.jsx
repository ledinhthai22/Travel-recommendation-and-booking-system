import { useState, useRef, useEffect } from 'react';
import { Calendar, Tag, DollarSign, MapPin, RotateCcw, ChevronDown } from 'lucide-react';
import SelectField from '~/components/UI/Form/SelectField';
import { getProvincesApi } from '~/Services/ProvinceService';
import { getAllTypeTourClientApi } from '~/Services/TypeTourService';

const DAY_OPTIONS = [
    { id: '', name: 'Tất cả' },
    { id: '2-3', name: '2 – 3 ngày' },
    { id: '4-7', name: '4 – 7 ngày' },
    { id: '7+', name: 'Trên 1 tuần' },
];

const MIN = 1000000;
const MAX = 50000000;
const STEP = 500000;

const formatVND = (n) => Number(n).toLocaleString('vi-VN');

// Chỉ giữ lại chữ số từ chuỗi người dùng gõ, không format/clamp ở đây
const digitsOnly = (str) => str.replace(/[^\d]/g, '');

const clamp = (val) => Math.min(Math.max(val, MIN), MAX);

const FilterBlock = ({ icon: Icon, label, children, className = '' }) => (
    <div className={`flex min-w-[170px] flex-1 flex-col gap-1.5 ${className}`}>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Icon size={13} className="text-[#0EA5E5]" />
            {label}
        </span>
        {children}
    </div>
);

const PriceRangeFilter = ({ minPrice, maxPrice, setMinPrice, setMaxPrice }) => {
    const [open, setOpen] = useState(false);

    // State nhập tay để riêng biệt (dạng chuỗi) — không bị clamp/format khi đang gõ,
    // tránh lỗi ô input tự nhảy về giá trị cũ khi xóa để gõ số mới
    const [minText, setMinText] = useState(String(minPrice));
    const [maxText, setMaxText] = useState(String(maxPrice));

    const ref = useRef(null);

    // Đồng bộ lại khi mở popover, để hiển thị đúng giá trị đang được áp dụng thật sự
    useEffect(() => {
        if (open) {
            setMinText(String(minPrice));
            setMaxText(String(maxPrice));
        }
    }, [open, minPrice, maxPrice]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Cho phép gõ tự do, kể cả xóa trắng để nhập số mới — không ép về MIN/MAX ngay lúc gõ
    const handleMinTextChange = (e) => setMinText(digitsOnly(e.target.value));
    const handleMaxTextChange = (e) => setMaxText(digitsOnly(e.target.value));

    // Chỉ chuẩn hóa (clamp + đảm bảo min < max) khi rời khỏi ô input
    const handleMinBlur = () => {
        const num = minText === '' ? MIN : clamp(Number(minText));
        const maxNum = maxText === '' ? MAX : Number(maxText);
        setMinText(String(Math.min(num, maxNum - STEP)));
    };

    const handleMaxBlur = () => {
        const num = maxText === '' ? MAX : clamp(Number(maxText));
        const minNum = minText === '' ? MIN : Number(minText);
        setMaxText(String(Math.max(num, minNum + STEP)));
    };

    // Giá trị số dùng để vẽ thanh trượt — luôn hợp lệ kể cả khi ô input đang để trống lúc gõ dở
    const sliderMin = clamp(minText === '' ? MIN : Number(minText));
    const sliderMax = clamp(maxText === '' ? MAX : Number(maxText));

    const handleSliderMinChange = (e) => {
        const val = Number(e.target.value);
        if (val <= sliderMax - STEP) setMinText(String(val));
    };

    const handleSliderMaxChange = (e) => {
        const val = Number(e.target.value);
        if (val >= sliderMin + STEP) setMaxText(String(val));
    };

    const handleApply = () => {
        const finalMin = minText === '' ? MIN : clamp(Number(minText));
        const finalMax = maxText === '' ? MAX : clamp(Number(maxText));
        setMinPrice(Math.min(finalMin, finalMax - STEP));
        setMaxPrice(Math.max(finalMax, finalMin + STEP));
        setOpen(false);
    };

    const handleClearRange = () => {
        setMinText(String(MIN));
        setMaxText(String(MAX));
    };

    const minPercent = ((sliderMin - MIN) / (MAX - MIN)) * 100;
    const maxPercent = ((sliderMax - MIN) / (MAX - MIN)) * 100;

    const isApplied = minPrice !== MIN || maxPrice !== MAX;

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-left text-sm text-slate-700 transition hover:border-[#0EA5E5]"
            >
                <span className="truncate tabular-nums">
                    {isApplied
                        ? `${formatVND(minPrice)}đ – ${formatVND(maxPrice)}đ`
                        : 'Chọn khoảng giá'}
                </span>
                <ChevronDown size={15} className={`shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute left-0 top-[calc(100%+8px)] z-40 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                    {/* Ô nhập tay kiểu sàn TMĐT */}
                    <div className="mb-4 flex items-center gap-2">
                        <div className="flex-1">
                            <label className="mb-1 block text-[11px] font-medium text-slate-400">Từ</label>
                            <div className="flex items-center rounded-lg border border-slate-200 px-2.5 py-1.5 focus-within:border-[#0EA5E5]">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={minText === '' ? '' : formatVND(minText)}
                                    onChange={handleMinTextChange}
                                    onBlur={handleMinBlur}
                                    placeholder="0"
                                    className="w-full min-w-0 text-sm tabular-nums text-slate-700 outline-none"
                                />
                                <span className="shrink-0 text-xs text-slate-400">đ</span>
                            </div>
                        </div>

                        <div className="mt-4 h-px w-3 shrink-0 bg-slate-300" />

                        <div className="flex-1">
                            <label className="mb-1 block text-[11px] font-medium text-slate-400">Đến</label>
                            <div className="flex items-center rounded-lg border border-slate-200 px-2.5 py-1.5 focus-within:border-[#0EA5E5]">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={maxText === '' ? '' : formatVND(maxText)}
                                    onChange={handleMaxTextChange}
                                    onBlur={handleMaxBlur}
                                    placeholder="0"
                                    className="w-full min-w-0 text-sm tabular-nums text-slate-700 outline-none"
                                />
                                <span className="shrink-0 text-xs text-slate-400">đ</span>
                            </div>
                        </div>
                    </div>

                    {/* Thanh trượt đôi để kéo trực quan, luôn dùng giá trị đã clamp để tránh NaN/lệch UI */}
                    <div className="relative h-1.5 w-full rounded-full bg-slate-200 my-4">
                        <div
                            className="absolute top-0 h-full rounded-full bg-[#0EA5E5]"
                            style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
                        />

                        <input
                            type="range"
                            min={MIN}
                            max={MAX}
                            step={STEP}
                            value={sliderMin}
                            onChange={handleSliderMinChange}
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
                            style={{ zIndex: sliderMin > MAX * 0.7 ? 30 : 20 }}
                        />
                        <div
                            className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white shadow-md"
                            style={{ left: `${minPercent}%`, borderColor: '#0EA5E5', zIndex: sliderMin > MAX * 0.7 ? 31 : 21 }}
                        />

                        <input
                            type="range"
                            min={MIN}
                            max={MAX}
                            step={STEP}
                            value={sliderMax}
                            onChange={handleSliderMaxChange}
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
                            style={{ zIndex: sliderMin > MAX * 0.7 ? 20 : 30 }}
                        />
                        <div
                            className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white shadow-md"
                            style={{ left: `${maxPercent}%`, borderColor: '#0EA5E5', zIndex: sliderMin > MAX * 0.7 ? 21 : 31 }}
                        />
                    </div>

                    <div className="mb-4 flex justify-between text-[11px] text-slate-400">
                        <span>{formatVND(MIN)}đ</span>
                        <span>{formatVND(MAX)}đ</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                        <button
                            type="button"
                            onClick={handleClearRange}
                            className="text-xs font-medium text-slate-400 hover:text-slate-600"
                        >
                            Xóa lọc
                        </button>
                        <button
                            type="button"
                            onClick={handleApply}
                            className="rounded-lg bg-[#0EA5E5] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0b8fc7]"
                        >
                            Áp dụng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function TourFilter({
    minPrice = MIN,
    maxPrice = MAX,
    setMinPrice,
    setMaxPrice,
    dayFilters,
    setDayFilters,
    category,
    setCategory,
    province,
    setProvince,
    onReset,
}) {
    const [provinces, setProvinces] = useState([]);
    const [loadingProvinces, setLoadingProvinces] = useState(false);

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    useEffect(() => {
        const fetchFilterData = async () => {
            setLoadingProvinces(true);
            setLoadingCategories(true);
            try {
                const [provinceData, categoryData] = await Promise.all([
                    getProvincesApi(),
                    getAllTypeTourClientApi(),
                ]);

                setProvinces([
                    { name: 'Tất cả điểm đến', filterValue: '' },
                    ...(provinceData || []).map((p) => ({
                        name: p.name,
                        filterValue: p.name,
                    })),
                ]);

                const fetchedCategories = Array.isArray(categoryData)
                    ? categoryData
                    : (categoryData?.data || []);

                setCategories([
                    { maLoaiTour: '', tenLoaiTour: 'Tất cả loại tour' },
                    ...fetchedCategories,
                ]);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu bộ lọc:", error);
            } finally {
                setLoadingProvinces(false);
                setLoadingCategories(false);
            }
        };

        fetchFilterData();
    }, []);

    return (
        <div className="w-full flex-1  p-4 ">
            <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
                <FilterBlock icon={MapPin} label="Điểm đến">
                    <SelectField
                        value={province}
                        onChange={setProvince}
                        options={provinces}
                        valueKey="filterValue"
                        labelKey="name"
                        searchable={true}
                        placeholder={loadingProvinces ? "Đang tải..." : "Chọn tỉnh thành"}
                    />
                </FilterBlock>

                <FilterBlock icon={Tag} label="Loại tour">
                    <SelectField
                        value={category}
                        onChange={setCategory}
                        options={categories}
                        valueKey="maLoaiTour"
                        labelKey="tenLoaiTour"
                        searchable={false}
                        placeholder={loadingCategories ? "Đang tải..." : "Chọn loại tour"}
                    />
                </FilterBlock>

                <FilterBlock icon={Calendar} label="Số ngày đi">
                    <SelectField
                        value={dayFilters[0] ?? ''}
                        onChange={(val) => setDayFilters(val ? [val] : [])}
                        options={DAY_OPTIONS}
                        valueKey="id"
                        labelKey="name"
                        searchable={false}
                        placeholder="Chọn khoảng thời gian"
                    />
                </FilterBlock>

                <FilterBlock icon={DollarSign} label="Khoảng giá">
                    <PriceRangeFilter
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        setMinPrice={setMinPrice}
                        setMaxPrice={setMaxPrice}
                    />
                </FilterBlock>

                {onReset && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-[#0EA5E5]"
                    >
                        <RotateCcw size={14} />
                        Xóa bộ lọc
                    </button>
                )}
            </div>
        </div>
    );
}