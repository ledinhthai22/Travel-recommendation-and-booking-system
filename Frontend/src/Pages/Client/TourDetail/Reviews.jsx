import { Star } from "lucide-react";
export function Reviews({ reviews, rating, reviewCount }) {
    return (
        <div>
            <h2 className="mb-4 text-[24px] font-bold text-slate-800">Đánh giá</h2>

            <div className="rounded-4xl border border-slate-200 p-4">
                {/* Summary */}
                <div className="mb-5 flex items-center gap-4 rounded-4xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-center">
                        <p className="text-4xl font-bold" style={{ color: '#0EA5E5' }}>{rating}</p>
                        <div className="mt-1 flex justify-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={14} fill={i < Math.floor(rating) ? '#FBBF24' : 'transparent'} stroke="#FBBF24" />
                            ))}
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{reviewCount} đánh giá</p>
                    </div>
                    <div className="flex-1 space-y-1.5">
                        {[5, 4, 3, 2, 1].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <span className="w-2 text-right text-xs text-slate-500">{s}</span>
                                <Star size={11} fill="#FBBF24" stroke="#FBBF24" />
                                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                                    <div
                                        className="h-full rounded-full bg-amber-400"
                                        style={{ width: s === 5 ? '70%' : s === 4 ? '20%' : '10%' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comment list */}
                <div className="space-y-4">
                    {reviews.map((r, i) => (
                        <div key={i} className="rounded-4xl border border-slate-100 bg-white p-4 shadow-sm">
                            <div className="mb-2 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                                        style={{ backgroundColor: '#0EA5E5' }}
                                    >
                                        {r.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{r.name}</p>
                                        <p className="text-xs text-slate-400">{r.date}</p>
                                    </div>
                                </div>
                                <div className="flex gap-0.5">
                                    {Array.from({ length: r.rating }).map((_, j) => (
                                        <Star key={j} size={13} fill="#FBBF24" stroke="#FBBF24" />
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm leading-relaxed text-slate-600">{r.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
