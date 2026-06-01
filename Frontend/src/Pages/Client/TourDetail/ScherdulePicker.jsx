import { Bus } from "lucide-react";
import { useState } from "react";

const MOCK_TOUR = {
    id: 1,
    name: 'Khám Phá Vũng Tàu 2 Ngày 1 Đêm',
    destination: 'Vũng Tàu',
    category: 'Biển đảo',
    duration: '2',
    price: 1599000,
    originalPrice: 2100000,
    rating: 4.8,
    reviewCount: 124,
    groupSize: '10-20 người',
    featured: true,
    images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
        'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&q=80',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=80',
    ],
    schedules: [
        { id: 1, code: 'NNSGN133-073-030626VN-V', date: '03/06/2026' },
        { id: 2, code: 'NNSGN133-046-160626VJ-V', date: '16/06/2026' },
        { id: 3, code: 'NNSGN133-123-180626VN-V', date: '18/06/2026' },
        { id: 4, code: 'NNSGN133-048-300626VJ-V', date: '30/06/2026' },
        { id: 5, code: 'NNSGN133-001-050726VN-V', date: '05/07/2026' },
        { id: 6, code: 'NNSGN133-002-200726VN-V', date: '20/07/2026' },
        { id: 7, code: 'NNSGN133-003-020826VN-V', date: '02/08/2026' },
        { id: 8, code: 'NNSGN133-004-150826VN-V', date: '15/08/2026' },
    ],
    pricing: {
        adult: 1599000,
        child: 1060000,
        infant: 0,
        singleSupplement: 0,
    },
    itinerary: [
        {
            day: 1,
            title: 'NGÀY 1: LÀNG DÂU PHƯỚC HẢI',
            details: [
                'Đón khách tại TP.HCM, khởi hành đi Vũng Tàu',
                'Tham quan Làng Dâu Phước Hải',
                'Nhận phòng khách sạn, nghỉ ngơi',
                'Tự do khám phá bãi biển buổi chiều',
                'Ăn tối hải sản tươi sống tại nhà hàng địa phương',
            ],
        },
        {
            day: 2,
            title: 'NGÀY 2: BÌNH GIÃ – NÚI DINH – CHÙA HÒA',
            details: [
                'Ăn sáng tại khách sạn',
                'Tham quan Chùa Hòa, Núi Dinh',
                'Ghé thăm Bình Giã và các địa điểm lịch sử',
                'Ăn trưa, mua sắm đặc sản',
                'Trả phòng, khởi hành về TP.HCM',
            ],
        },
    ],
    notes: [
        'Tour đã bao gồm bữa ăn theo chương trình',
        'Lưu ý trẻ em dưới 5 tuổi',
    ],
    includes: [
        'Xe đưa đón khứ hồi từ TP.HCM',
        'Khách sạn 3 sao (2 người/phòng)',
        'Các bữa ăn theo chương trình',
        'Hướng dẫn viên tiếng Việt',
        'Bảo hiểm du lịch',
    ],
    excludes: [
        'Chi phí cá nhân',
        'Đồ uống trong bữa ăn',
        'Phụ thu phòng đơn: liên hệ',
    ],
    reviews: [
        { name: 'Nguyễn Thị Lan', rating: 5, date: '15/06/2026', content: 'Tour rất tuyệt, hướng dẫn viên nhiệt tình, lịch trình hợp lý. Sẽ đi lần sau!' },
        { name: 'Trần Văn Minh', rating: 5, date: '02/06/2026', content: 'Chuyến đi thực sự đáng tiền, khách sạn sạch sẽ, đồ ăn ngon.' },
        { name: 'Phạm Thu Hương', rating: 4, date: '20/05/2026', content: 'Nhìn chung ổn, chỉ tiếc thời gian tự do hơi ít.' },
    ],
};

function getReturnDate(dateStr) {
    const parts = dateStr.split('/');
    const d = new Date(+parts[2], +parts[1] - 1, +parts[0] + 1);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function formatPrice(value) {
    return value === 0 ? 'Miễn phí' : `${value.toLocaleString('vi-VN')}đ`;
}

export function SchedulePicker({ schedules }) {
    const months = [
        ...new Set(
            schedules.map(s => {
                const [, month, year] = s.date.split('/');
                return `${month}/${year}`;
            })
        )
    ];

    const [selectedMonth, setSelectedMonth] = useState(months[0]);
    const [selected, setSelected] = useState(0);

    const filteredSchedules = schedules.filter(s => {
        const [, month, year] = s.date.split('/');
        return `${month}/${year}` === selectedMonth;
    });

    return (
        <div>
            <h2 className="mb-4 text-[24px] font-bold text-slate-800">Lịch trình khởi hành</h2>

            {/* Month tabs */}
            <div className="flex flex-wrap gap-5">
                {months.map((month) => {
                    const active = selectedMonth === month;
                    return (
                        <button
                            key={month}
                            onClick={() => {
                                setSelectedMonth(month);
                                setSelected(0);
                            }}
                            className="rounded-lg border px-10 py-5 text-sm font-medium transition-all"
                            style={
                                active
                                    ? { borderColor: '#0EA5E5', backgroundColor: '#0EA5E5' }
                                    : { borderColor: '#e2e8f0' }
                            }
                        >
                            <p className={`font-bold ${active ? 'text-white' : 'text-slate-500'}`}>
                                Tháng {month}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Schedule list */}
            <div className="mt-4">
                <div className="mt-4 flex flex-col gap-4">
                    {filteredSchedules.map((schedule, index) => {
                        const isActive = selected === index;

                        return (
                            <div
                                key={schedule.id}
                                className={`
                                    overflow-hidden rounded-3xl border bg-white
                                    transition-all duration-300
                                    ${isActive
                                        ? 'border-[#0EA5E5] shadow-md'
                                        : 'border-slate-200 hover:border-[#0EA5E5]/40'
                                    }
                                `}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between p-4">
                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                        <span className="shrink-0 rounded-full bg-[#EFF9FF] px-4 py-1.5 text-sm font-bold text-[#0EA5E5]">
                                            {schedule.date}
                                        </span>
                                        <span className="truncate text-sm text-slate-600">
                                            {schedule.code}
                                        </span>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-4">
                                        <span className="text-xl font-bold text-red-500">
                                            {MOCK_TOUR.pricing.adult.toLocaleString('vi-VN')}đ
                                        </span>
                                        <button
                                            onClick={() => setSelected(index)}
                                            className={`
                                                rounded-full px-6 py-2 text-sm font-medium text-white transition
                                                ${isActive ? 'bg-[#38BDF8]' : 'bg-slate-500 hover:bg-slate-600'}
                                            `}
                                        >
                                            {isActive ? 'Đang chọn' : 'Chọn'}
                                        </button>
                                    </div>
                                </div>

                                {/* Detail (expanded) */}
                                {isActive && (
                                    <div className="p-4">
                                        <div className="mx-4 border-t border-slate-200 pt-4">

                                            {/* Route */}
                                            <div className="grid grid-cols-2 gap-6 divide-x divide-slate-300">
                                                <div className="pr-6">
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <span className="font-semibold text-slate-700">
                                                            Ngày đi: {schedule.date}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-sm text-[#F97316]">
                                                            <Bus size={16} />
                                                            Xe khách
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 flex justify-between text-sm">
                                                        <span>06:00</span>
                                                        <span>08:00</span>
                                                    </div>
                                                    <div className="relative my-3 flex items-center">
                                                        <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                                                        <div className="mx-2 flex-1 border-b border-dashed border-slate-300"></div>
                                                        <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                                                    </div>
                                                    <div className="mt-1 flex justify-between text-sm">
                                                        <span>TP.HCM</span>
                                                        <span>Vũng Tàu</span>
                                                    </div>
                                                </div>

                                                <div className="pl-6">
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <span className="font-semibold text-slate-700">
                                                            Ngày về: {getReturnDate(schedule.date)}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-sm text-[#F97316]">
                                                            <Bus size={16} />
                                                            Xe khách
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 flex justify-between text-sm">
                                                        <span>17:30</span>
                                                        <span>19:00</span>
                                                    </div>
                                                    <div className="relative my-3 flex items-center">
                                                        <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                                                        <div className="mx-2 flex-1 border-b border-dashed border-slate-300"></div>
                                                        <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                                                    </div>
                                                    <div className="mt-1 flex justify-between text-sm">
                                                        <span>Vũng Tàu</span>
                                                        <span>TP.HCM</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Pricing */}
                                            <div className="mt-6 border-t border-slate-200 pt-4">
                                                <h4 className="mb-6 text-center text-[16px] font-bold text-slate-800">
                                                    Giá chuyến đi
                                                </h4>

                                                <div className="grid grid-cols-2 gap-8">
                                                    {/* Cột trái */}
                                                    <div className="border-r border-slate-300 pr-8">
                                                        <div className="mb-6 flex items-start justify-between">
                                                            <div>
                                                                <p className="text-[13px] font-bold text-slate-900">Người lớn</p>
                                                                <p className="text-[12px] text-slate-500">(Từ 12 tuổi trở lên)</p>
                                                            </div>
                                                            <span className="text-xl font-bold text-red-500">
                                                                {MOCK_TOUR.pricing.adult.toLocaleString('vi-VN')}đ
                                                            </span>
                                                        </div>
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <p className="text-[13px] font-bold text-slate-900">Trẻ em</p>
                                                                <p className="text-[12px] text-slate-500">(Từ 2 đến 11 tuổi)</p>
                                                            </div>
                                                            <span className="text-xl font-bold text-red-500">
                                                                {MOCK_TOUR.pricing.child.toLocaleString('vi-VN')}đ
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Cột phải */}
                                                    <div className="pl-2">
                                                        <div className="mb-6 flex items-start justify-between">
                                                            <div>
                                                                <p className="text-[13px] font-bold text-slate-900">Em bé</p>
                                                                <p className="text-[12px] text-slate-500">(Dưới 2 tuổi)</p>
                                                            </div>
                                                            <span className="text-xl font-bold text-red-500">
                                                                {formatPrice(MOCK_TOUR.pricing.infant)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <p className="text-[13px] font-bold text-slate-900">Phụ thu phòng đơn</p>
                                                            </div>
                                                            <span className="text-xl font-bold text-red-500">
                                                                {formatPrice(MOCK_TOUR.pricing.singleSupplement)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}               