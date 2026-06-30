import { Link } from "react-router-dom";
import { Hotel, MapPin, Star, ArrowRight } from "lucide-react"; 

export function HotelInfo({ hotels = [], tourSlug, tourName }) {

    const uniqueHotels = hotels.reduce((acc, hotel) => {
        if (hotel?.maKhachSan && !acc.some(h => h.maKhachSan === hotel.maKhachSan)) {
            acc.push(hotel);
        }
        return acc;
    }, []);

    if (!uniqueHotels || uniqueHotels.length === 0) {
        return (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500">
                Chưa có thông tin nơi lưu trú cho tour này.
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <Hotel className="w-6 h-6 text-sky-600" />
                <h2 className="text-[22px] font-bold text-slate-800">Nơi lưu trú</h2>
            </div>

            <div className="space-y-4">
                {uniqueHotels.map((hotel) => (
                    <div
                        key={hotel.maKhachSan}
                        className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all group"
                    >
                        <div className="flex gap-5">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center">
                                    <Hotel className="w-7 h-7 text-sky-600" />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xl font-semibold text-slate-800 leading-tight truncate">
                                            {hotel.tenKhachSan}
                                        </p>

                                        <div className="flex items-center gap-0.5 mt-1.5">
                                            {Array.from({ length: hotel.soSao || 3 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className="w-4 h-4 text-amber-400 fill-current"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <Link
                                        to={`/khach-san/${hotel.slug}`}
                                        state={{ tourSlug, tourName }}
                                        className="text-sky-600 hover:text-sky-700 font-medium text-sm flex items-center gap-1 flex-shrink-0 transition-colors"
                                    >
                                        <span>Chi tiết</span>
                                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}