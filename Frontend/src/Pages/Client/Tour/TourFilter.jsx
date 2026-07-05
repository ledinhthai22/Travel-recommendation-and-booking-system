import { useState, useEffect } from 'react';
import { SlidersHorizontal, Calendar, Tag, DollarSign, MapPin, RotateCcw } from 'lucide-react';
import SelectField from '~/components/UI/Form/SelectField';
import { getProvincesApi } from '~/Services/ProvinceService';
import { getAllTypeTourClientApi } from '~/Services/TypeTourService';

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

const MIN = 1000000;
const MAX = 50000000;

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
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                    <SlidersHorizontal size={18} className="text-[#0EA5E5]" />
                    Bộ lọc
                </h2>

                {onReset && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-[#0EA5E5]"
                    >
                        <RotateCcw size={13} />
                        Xóa bộ lọc
                    </button>
                )}
            </div>

            <div className="mb-2">
                <SectionLabel icon={DollarSign} label="Khoảng giá" />
                <div className="flex items-center justify-between mb-3 gap-2">
                    <span className="text-xs font-semibold text-[#0EA5E5] bg-sky-50 border border-sky-100 rounded-lg px-2.5 py-1 tabular-nums">
                        {minPrice.toLocaleString('vi-VN')}đ
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-semibold text-[#0EA5E5] bg-sky-50 border border-sky-100 rounded-lg px-2.5 py-1 tabular-nums">
                        {maxPrice.toLocaleString('vi-VN')}đ
                    </span>
                </div>

                {/* THANH TRƯỢT 2 ĐẦU ĐÃ ĐƯỢC FIX */}
                <div className="relative h-1.5 w-full rounded-full bg-slate-200 my-4">
                    {/* Thanh màu xanh chỉ khoảng giá được chọn */}
                    <div
                        className="absolute top-0 h-full rounded-full bg-[#0EA5E5]"
                        style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
                    />

                    {/* Input MIN */}
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
                        className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white shadow-md"
                        style={{ left: `${minPercent}%`, borderColor: '#0EA5E5', zIndex: minPrice > MAX * 0.7 ? 31 : 21 }}
                    />

                    {/* Input MAX */}
                    <input
                        type="range"
                        min={MIN}
                        max={MAX}
                        step={500000}
                        value={maxPrice}
                        onChange={e => {
                            const val = Number(e.target.value);
                            // Giữ khoảng cách tối thiểu giữa 2 đầu kéo là 500.000đ
                            if (val >= minPrice + 500000) setMaxPrice(val);
                        }}
                        // FIX: áp dụng pointer-events giống như thanh MIN
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto"
                        style={{ zIndex: minPrice > MAX * 0.7 ? 20 : 30 }}
                    />
                    {/* Nút tròn hiển thị giả lập cho MAX */}
                    <div
                        className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white shadow-md"
                        style={{ left: `${maxPercent}%`, borderColor: '#0EA5E5', zIndex: minPrice > MAX * 0.7 ? 21 : 31 }}
                    />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>1.000.000đ</span>
                    <span>50.000.000đ</span>
                </div>
            </div>

            <FilterDivider />

            <div className="mb-2">
                <SectionLabel icon={MapPin} label="Điểm đến" />
                <SelectField
                    value={province}
                    onChange={setProvince}
                    options={provinces}
                    valueKey="filterValue"
                    labelKey="name"
                    searchable={true}
                    placeholder={loadingProvinces ? "Đang tải điểm đến..." : "Chọn tỉnh thành"}
                />
            </div>

            <FilterDivider />

            <div className="mb-2">
                <SectionLabel icon={Tag} label="Loại tour" />
                <SelectField
                    value={category}
                    onChange={setCategory}
                    options={categories}
                    valueKey="maLoaiTour"
                    labelKey="tenLoaiTour"
                    searchable={false}
                    placeholder={loadingCategories ? "Đang tải..." : "Chọn loại tour"}
                />
            </div>

            <FilterDivider />

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