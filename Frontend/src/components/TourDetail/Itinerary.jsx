import { useState } from "react";
import { ChevronRight, X } from "lucide-react";

export function Itinerary({ itinerary = [] }) {
    const [selectedDay, setSelectedDay] = useState(null);

    return (
        <>
            <div>
                <h2 className="mb-4 text-[24px] font-bold text-slate-800">
                    Lịch trình
                </h2>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="space-y-3">

                        {itinerary.map((item) => (
                            <button
                                key={item.maLichTrinh}
                                onClick={() => setSelectedDay(item)}
                                className="flex w-full items-center justify-between  border-b-1 border-slate-200 bg-white px-5 py-4 text-left transition"
                            >
                                <div className="flex items-center gap-3">

                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
                                        {item.soThuTuNgay}
                                    </div>

                                    <div>
                                        <p className="font-semibold text-slate-800">
                                            NGÀY {item.soThuTuNgay}: {item.tenLichTrinh}
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            🍴 {item.buaAn}
                                        </p>
                                    </div>

                                </div>

                                <ChevronRight
                                    size={18}
                                    className="text-slate-400"
                                />
                            </button>
                        ))}

                    </div>
                </div>
            </div>

            {selectedDay && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/55 p-6">

                    <div className="w-full max-w-[850px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">

                            <span className="font-bold text-[18px] text-slate-800">
                                Lịch trình chi tiết
                            </span>

                            <button
                                onClick={() => setSelectedDay(null)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
                            >
                                <X size={16} />
                            </button>

                        </div>

                        {/* Hero */}
                        <div className="relative h-48 overflow-hidden">

                            <div className="grid h-full grid-cols-2 p-4">

                                <div className="flex flex-col justify-end bg-sky-50 p-5">

                                    <span className="mb-2 inline-block w-fit px-3 py-0.5 text-[16px] font-bold text-sky-900">
                                        Ngày {selectedDay.soThuTuNgay}:{" "}
                                        {selectedDay.tenLichTrinh}
                                    </span>

                                    <p className="mt-1 ml-2 text-xs text-slate-500">
                                        🍴 {selectedDay.buaAn}
                                    </p>

                                </div>

                                <div className="overflow-hidden rounded-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1200"
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                            </div>

                        </div>

                        {/* Body */}
                        <div className="max-h-64 overflow-y-auto px-6 py-5">

                            <p className="mb-4 text-[11px] font-medium uppercase tracking-widest text-slate-400">
                                Hoạt động chính
                            </p>

                            <div className="flex flex-col">

                                {selectedDay.chiTiet.map(
                                    (activity, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-3.5"
                                        >
                                            <div className="flex w-5 flex-shrink-0 flex-col items-center">

                                                <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-sky-400" />

                                                {index <
                                                    selectedDay.chiTiet.length - 1 && (
                                                    <div className="mt-1 flex-1 w-px bg-slate-200" />
                                                )}

                                            </div>

                                            <p className="pb-4 text-sm leading-relaxed text-slate-700">
                                                {activity.hoatDong}
                                            </p>
                                        </div>
                                    )
                                )}

                            </div>

                        </div>

                    </div>

                </div>
            )}
        </>
    );
}

