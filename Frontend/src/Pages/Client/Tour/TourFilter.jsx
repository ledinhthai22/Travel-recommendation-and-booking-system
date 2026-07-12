import { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, Calendar, Tag, DollarSign, MapPin, RotateCcw, ChevronDown } from 'lucide-react';
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

const FilterBlock = ({ icon: Icon, label, children, className = '' }) => (
    <div className={`flex min-w-[170px] flex-1 flex-col gap-1.5 ${className}`}>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Icon size={13} className="text-[#0EA5E5]" />
            {label}
        </span>
        {children}
    </div>
);

const PriceRangePopover = ({ minPrice, maxPrice, setMinPrice, setMaxPrice }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const minPercent = ((minPrice - MIN) / (MAX - MIN)) * 100;
    const maxPercent = ((maxPrice - MIN) / (MAX - MIN)) * 100;

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-left text-sm text-slate-700 transition hover:border-[#0EA5E5]"
            >
                <span className="truncate tabular-nums">
                    {minPrice.toLocaleString('vi-VN')}đ – {maxPrice.toLocaleString('vi-VN')}đ
                </span>
                <ChevronDown size={15} className={`shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute left-0 top-[calc(100%+8px)] z-40 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#0EA5E5] bg-sky-50 border border-sky-100 rounded-lg px-2.5 py-1 tabular-nums">
                            {minPrice.toLocaleString('vi-VN')}đ
                        </span>
                        <div className="h-px flex-1 bg-slate-200" />
                        <span className="text-xs font-semibold text-[#0EA5E5] bg-sky-50 border border-sky-100 rounded-lg px-2.5 py-1 tabular-nums">
                            {maxPrice.toLocaleString('vi-VN')}đ
                        </span>
                    </div>

                    <div className="relative h-1.5 w-full rounded-full bg-slate-200 my-4">
                        <div
                            className="absolute top-0 h-full rounded-full bg-[#0EA5E5]"
                            style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
                        />

                        <input
                            type="range"
                            min={MIN}
                            max={MAX}
                            step={500000}
                            value={minPrice}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                if (val <= maxPrice - 500000) setMinPrice(val);
                            }}
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
                            style={{ zIndex: minPrice > MAX * 0.7 ? 30 : 20 }}
                        />
                        <div
                            className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white shadow-md"
                            style={{ left: `${minPercent}%`, borderColor: '#0EA5E5', zIndex: minPrice > MAX * 0.7 ? 31 : 21 }}
                        />

                        <input
                            type="range"
                            min={MIN}
                            max={MAX}
                            step={500000}
                            value={maxPrice}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                if (val >= minPrice + 500000) setMaxPrice(val);
                            }}
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
                            style={{ zIndex: minPrice > MAX * 0.7 ? 20 : 30 }}
                        />
                        <div
                            className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white shadow-md"
                            style={{ left: `${maxPercent}%`, borderColor: '#0EA5E5', zIndex: minPrice > MAX * 0.7 ? 21 : 31 }}
                        />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-400">
                        <span>1.000.000đ</span>
                        <span>50.000.000đ</span>
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
                    <PriceRangePopover
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