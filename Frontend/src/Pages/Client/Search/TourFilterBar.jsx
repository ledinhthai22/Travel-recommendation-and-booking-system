import { useState, useEffect } from 'react';
import { Calendar, Tag, DollarSign, MapPin, RotateCcw } from 'lucide-react';
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

const FilterField = ({ icon: Icon, label, children, className = "" }) => (
    <div className={`flex flex-col gap-1.5 ${className}`}>
        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 h-[17px]">
            <Icon size={13} className="text-[#0EA5E5]" />
            {label}
        </span>
        {children}
    </div>
);

export default function TourFilterBar({
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
    const minPercent = ((minPrice - MIN) / (MAX - MIN)) * 100;
    const maxPercent = ((maxPrice - MIN) / (MAX - MIN)) * 100;

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
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="flex flex-wrap items-end gap-5">

                <FilterField icon={MapPin} label="Điểm đến" className="w-full sm:w-52">
                    <SelectField
                        value={province}
                        onChange={setProvince}
                        options={provinces}
                        valueKey="filterValue"
                        labelKey="name"
                        searchable={true}
                        placeholder={loadingProvinces ? "Đang tải..." : "Chọn tỉnh thành"}
                    />
                </FilterField>

                <FilterField icon={Tag} label="Loại tour" className="w-full sm:w-48">
                    <SelectField
                        value={category}
                        onChange={setCategory}
                        options={categories}
                        valueKey="maLoaiTour"
                        labelKey="tenLoaiTour"
                        searchable={false}
                        placeholder={loadingCategories ? "Đang tải..." : "Chọn loại tour"}
                    />
                </FilterField>

                <FilterField icon={Calendar} label="Số ngày đi" className="w-full sm:w-44">
                    <SelectField
                        value={dayFilters[0] ?? ''}
                        onChange={(val) => setDayFilters(val ? [val] : [])}
                        options={DAY_OPTIONS}
                        valueKey="id"
                        labelKey="name"
                        searchable={false}
                        placeholder="Chọn khoảng thời gian"
                    />
                </FilterField>

                <div className="w-full sm:w-64 sm:flex-1 flex flex-col gap-1.5">

                    <div className="flex items-center justify-between h-[17px]">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            <DollarSign size={13} className="text-[#0EA5E5]" />
                            Khoảng giá
                        </span>
                        

                        <div className="flex items-center gap-1 tabular-nums">
                            <span className="text-[11px] font-bold text-[#0EA5E5] bg-sky-50 border border-sky-100 rounded-md px-1.5 py-0.5">
                                {minPrice.toLocaleString('vi-VN')}đ
                            </span>
                            <span className="text-slate-300 text-[10px]">—</span>
                            <span className="text-[11px] font-bold text-[#0EA5E5] bg-sky-50 border border-sky-100 rounded-md px-1.5 py-0.5">
                                {maxPrice.toLocaleString('vi-VN')}đ
                            </span>
                        </div>
                    </div>

 
                    <div className="relative h-[42px] flex items-center w-full px-2">
                        <div className="relative w-full h-1.5 rounded-full bg-slate-100">

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
                                onChange={e => {
                                    const val = Number(e.target.value);
                                    if (val <= maxPrice - 500000) setMinPrice(val);
                                }}
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
                                style={{ zIndex: minPrice > MAX * 0.7 ? 30 : 20 }}
                            />

                            <div
                                className="pointer-events-none absolute top-0 h-4 w-4 -translate-x-1/2 -translate-y-[5px] rounded-full border-2 border-[#0EA5E5] bg-white shadow-sm"
                                style={{ left: `${minPercent}%`, zIndex: minPrice > MAX * 0.7 ? 31 : 21 }}
                            />

                            <input
                                type="range"
                                min={MIN}
                                max={MAX}
                                step={500000}
                                value={maxPrice}
                                onChange={e => {
                                    const val = Number(e.target.value);
                                    if (val >= minPrice + 500000) setMaxPrice(val);
                                }}
                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
                                style={{ zIndex: minPrice > MAX * 0.7 ? 20 : 30 }}
                            />
   
                            <div
                                className="pointer-events-none absolute top-0 h-4 w-4 -translate-x-1/2 -translate-y-[5px] rounded-full border-2 border-[#0EA5E5] bg-white shadow-sm"
                                style={{ left: `${maxPercent}%`, zIndex: minPrice > MAX * 0.7 ? 21 : 31 }}
                            />
                        </div>
                    </div>
                </div>


                {onReset && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-[#0EA5E5] shrink-0 h-[42px]"
                    >
                        <RotateCcw size={13} />
                        Xóa lọc
                    </button>
                )}
            </div>
        </div>
    );
}