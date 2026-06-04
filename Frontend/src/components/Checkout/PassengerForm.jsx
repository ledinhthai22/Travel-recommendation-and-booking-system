import React from 'react';

export default function PassengerForm({ passengers = { adults: 1, children: 0, toddlers: 0 }, onChange }) {
    const handleChange = (type, value) => {
        if (type === 'adults') {
            onChange(type, Math.max(1, value)); // luôn >= 1
        } else {
            onChange(type, Math.max(0, value));
        }
    };

    // Định nghĩa mảng dữ liệu để tối ưu hóa việc render UI đồng bộ
    const passengerConfigs = [
        { key: 'adults', label: 'Người lớn', desc: 'Từ 12 tuổi trở lên' },
        { key: 'children', label: 'Trẻ em', desc: 'Từ 5 - 11 tuổi' },
        { key: 'toddlers', label: 'Trẻ nhỏ', desc: 'Từ 2 - 4 tuổi' },
    ];

    return (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-slate-900">Hành khách</h2>

            <div className="space-y-3">
                {passengerConfigs.map((item) => (
                    <div
                        key={item.key}
                        className="flex justify-between items-center border border-slate-200 rounded-[20px] px-6 py-4 bg-white transition-colors hover:border-slate-300"
                    >
                        {/* Bên trái: Nhãn và mô tả tuổi kèm icon info */}
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-base">
                                {item.label}
                            </span>
                            <span className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                                {item.desc}
                                {/* Icon ⓘ nhỏ gọn chuẩn thiết kế */}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                </svg>
                            </span>
                        </div>

                        {/* Bên phải: Bộ nút tăng giảm số lượng */}
                        <div className="flex items-center gap-4">
                            {/* Nút Giảm (-) hình tròn */}
                            <button
                                type="button"
                                onClick={() => handleChange(item.key, passengers[item.key] - 1)}
                                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors select-none
                                    ${(item.key === 'adults' && passengers.adults === 1) ||
                                        (item.key !== 'adults' && passengers[item.key] === 0)
                                        ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                                        : 'border-slate-400 text-slate-700'
                                    }`}
                                disabled={
                                    item.key === 'adults'
                                        ? passengers.adults === 1
                                        : passengers[item.key] === 0
                                }
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                </svg>
                            </button>

                            {/* Số hiển thị ở giữa */}
                            <span className="w-6 text-center font-semibold text-slate-900 text-base select-none">
                                {passengers[item.key]}
                            </span>

                            {/* Nút Tăng (+) hình tròn */}
                            <button
                                type="button"
                                onClick={() => handleChange(item.key, passengers[item.key] + 1)}
                                className="w-8 h-8 rounded-full border border-slate-600 flex items-center justify-center text-slate-700 focus:ring-2 focus:ring-[#0EA5E5] transition-colors select-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}