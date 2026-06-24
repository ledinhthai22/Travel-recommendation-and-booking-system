import { Link } from "react-router-dom";

export function HotelInfo({
    hotels = [],
    tourSlug,
    tourName
}) {
    if (!hotels.length) return null;

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.25rem" }}>
                <h2 className="text-[18px] font-medium text-slate-800 m-0">Nơi lưu trú</h2>
            </div>

            <div className="flex flex-col gap-3">
                {hotels.map((hotel) => (
                    <div
                        key={hotel.maKhachSan}
                        className="bg-white border border-slate-200/70 rounded-xl p-5"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                <div className="w-12 h-12 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-sky-500">
                                        <path d="M3 21l18 0" /><path d="M9 8l1 0" /><path d="M9 12l1 0" /><path d="M9 16l1 0" /><path d="M14 8l1 0" /><path d="M14 12l1 0" /><path d="M14 16l1 0" /><path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[15px] font-medium text-slate-800 mb-1">{hotel.tenKhachSan}</p>
                                    <div className="flex items-center gap-0.5 mb-1.5">
                                        {Array.from({ length: hotel.soSao }).map((_, i) => (
                                            <svg key={i} xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="#EF9F27" stroke="#EF9F27" strokeWidth="1">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                        ))}
                                    </div>
                                    {hotel.diaChi && (
                                        <p className="text-sm text-slate-500">{hotel.diaChi}</p>
                                    )}
                                </div>
                            </div>
                                    
                            <Link
                                to={`/khach-san/${hotel.slug}`}
                                state={{
                                    tourSlug: tourSlug,
                                    tourName: tourName
                                }}
                                className="
                                inline-flex items-center gap-1.5
                                px-3.5 py-2
                                text-[13px] font-medium
                                text-slate-700
                                transition-all duration-200
                                hover:text-sky-600
                                hover:border-sky-300
                                group
                                flex-shrink-0
                            "
                            >
                                <span className="group-hover:underline">
                                    Xem chi tiết
                                </span>

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-transform duration-200 group-hover:translate-x-1"
                                >
                                    <path d="M5 12l14 0" />
                                    <path d="M13 18l6 -6" />
                                    <path d="M13 6l6 6" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}