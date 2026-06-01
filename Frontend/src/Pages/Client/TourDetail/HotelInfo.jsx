import { Star, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
export function HotelInfo({hotelInfo}) {
    return (
        <div>
            <h2 className="mb-4 text-[24px] font-bold text-slate-800">
                Nơi lưu trú
            </h2>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4  transition">
                <div>
                    <h3 className="text-[16px] font-semibold text-slate-800 uppercase">
                       {hotelInfo.name}
                    </h3>

                    <div className="mt-1 flex items-center gap-1">
                        {Array.from({ length: Number(hotelInfo.level) }).map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                className="fill-yellow-400 text-yellow-400"
                            />
                        ))}
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                        {hotelInfo.address}
                    </p>
                </div>

                <Link
                    to="/hotels/sammy-vung-tau"
                    className="flex items-center gap-1 rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600"
                >
                    Xem chi tiết
                    <ChevronRight size={16} />
                </Link>
            </div>
        </div>
    )
}
