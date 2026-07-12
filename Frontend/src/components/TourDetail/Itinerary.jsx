import { useState } from "react";
import { ChevronRight, X, Utensils, MapPin, Clock } from "lucide-react";

export function Itinerary({ itinerary = [] }) {
    const [selectedDay, setSelectedDay] = useState(null);

    return (
        <>
            <div>
                <h2 className="mb-4 text-[24px] font-bold text-slate-800">
                    Lịch trình
                </h2>

                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    {itinerary.map((item, idx) => (
                        <button
                            key={item.maLichTrinh}
                            onClick={() => setSelectedDay(item)}
                            className={`flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50 ${idx < itinerary.length - 1 ? "border-b border-slate-100" : ""}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white shadow-sm">
                                    {item.soThuTuNgay}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">
                                        {item.tenLichTrinh}
                                    </p>
                                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Utensils size={12} />
                                            {item.buaAn}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <ChevronRight size={16} className="flex-shrink-0 text-slate-300" />
                        </button>
                    ))}
                </div>
            </div>

            {selectedDay && (
                <div
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/55 p-4"
                    onClick={(e) => e.target === e.currentTarget && setSelectedDay(null)}
                >
                    <div className="w-full max-w-[820px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <span className="text-[17px] font-bold text-slate-800">
                                Lịch trình chi tiết
                            </span>
                            <button
                                onClick={() => setSelectedDay(null)}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-red-500 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Hero Section - Đã sửa lỗi cố định chiều cao */}
                        <div className="grid min-h-[176px] grid-cols-1 md:grid-cols-2 border-b border-slate-100">
                            <div className="flex flex-col justify-center bg-sky-50 p-5">
                                <p className="text-[17px] font-bold leading-snug text-sky-900">
                                    {selectedDay.tenLichTrinh}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] text-slate-600">
                                        <Utensils size={10} /> {selectedDay.buaAn}
                                    </span>
                                </div>
                                
                                {/* Khối Lưu ý - Hiển thị đẹp, tự động đẩy layout */}
                                {selectedDay.luuY && (
                                    <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 leading-relaxed">
                                        <strong>Lưu ý:</strong> {selectedDay.luuY}
                                    </div>
                                )}
                            </div>
                            
                            {/* Khối Ảnh */}
                            <div className="relative min-h-[150px] bg-slate-100 overflow-hidden">
                                <img
                                    src={`https://localhost:7016${selectedDay.duongDanAnh}`}
                                    alt={selectedDay.tenLichTrinh}
                                    className="absolute inset-0 h-full w-full object-cover"
                                    onError={(e) => {
                                        // Thêm ảnh fallback nếu đường dẫn localhost lỗi/không tìm thấy
                                        e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop";
                                    }}
                                />
                            </div>
                        </div>

                        {/* Body */}
                        <div className="max-h-80 overflow-y-auto px-6 py-5">
                            <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                                Hoạt động chính
                            </p>

                            <div className="flex flex-col">
                                {selectedDay.chiTietLichTrinhs?.map((activity, index) => (
                                    <div key={activity.maCTLT ?? index} className="flex gap-3.5">
                                        <div className="flex w-5 flex-shrink-0 flex-col items-center">
                                            <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-sky-400" />
                                            {index < selectedDay.chiTietLichTrinhs.length - 1 && (
                                                <div className="mt-1 w-px flex-1 bg-slate-100" />
                                            )}
                                        </div>
                                        <div className="pb-4 flex-1">
                                            {(activity.gioBatDau || activity.gioKetThuc) && (
                                                <p className="mb-0.5 flex items-center gap-1 text-[11px] font-semibold text-sky-500">
                                                    <Clock size={10} />
                                                    {activity.gioBatDau} – {activity.gioKetThuc}
                                                </p>
                                            )}
                                            <p className="text-sm leading-relaxed text-slate-700">
                                                {activity.hoatDong}
                                            </p>
                                            {activity.maDiaDiem && (
                                                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                                                    <MapPin size={10} />
                                                    Địa điểm: {activity.tenDiaDiem}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}