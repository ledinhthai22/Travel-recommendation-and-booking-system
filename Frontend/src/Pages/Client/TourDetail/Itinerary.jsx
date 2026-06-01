import { useState } from 'react';
import { ChevronRight, X, MapPin } from 'lucide-react';

export function Itinerary({ itinerary }) {
    const [selectedDay, setSelectedDay] = useState(null);

    return (
        <>
            <div>
                <h2 className="mb-4 text-[24px] font-bold text-slate-800">
                    Lịch trình
                </h2>
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="space-y-3">
                        {itinerary.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedDay(item)}
                                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 text-left transition hover:border-sky-300 hover:bg-sky-50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
                                        {item.day}
                                    </div>

                                    <div>
                                        <p className="font-semibold text-slate-800">
                                            NGÀY {item.day}: {item.title}
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            🍴02 bữa ăn
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
                            <span className="font-bold text-[18px] text-slate-800">Lịch trình chi tiết</span>
                            <button
                                onClick={() => setSelectedDay(null)}
                                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        {/* Hero */}
                        <div className="relative h-48 overflow-hidden ">
                            <div className="grid h-full grid-cols-2 p-4">

                                {/* Trái - thông tin ngày */}
                                <div className="flex flex-col justify-end bg-sky-50 p-5">
                                    <span className="mb-2 inline-block w-fit   px-3 py-0.5 text-[16px] font-bold text-sky-900">
                                        Ngày {selectedDay.day} : {selectedDay.title}
                                    </span>
                                    <p className="mt-1 ml-2 text-xs text-slate-500">🍴 Ăn sáng · trưa · tối</p>
                                </div>

                                {/* Phải - ảnh */}
                                <div className="overflow-hidden rounded-2xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=1200"
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Scrollable body */}
                        <div className="max-h-64 overflow-y-auto px-6 py-5">
                            <p className="mb-4 text-[11px] font-medium uppercase tracking-widest text-slate-400">
                                Hoạt động chính
                            </p>
                            <div className="flex flex-col">
                                {selectedDay.details.map((detail, idx) => (
                                    <div key={idx} className="flex gap-3.5">
                                        <div className="flex w-5 flex-shrink-0 flex-col items-center">
                                            <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-sky-400 ring-2 ring-white ring-offset-0" />
                                            {idx < selectedDay.details.length - 1 && (
                                                <div className="mt-1 flex-1 w-px bg-slate-200" />
                                            )}
                                        </div>
                                        <p className="pb-4 text-sm leading-relaxed text-slate-700">{detail}</p>
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