import { Star, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export function HotelInfo({ hotelInfo }) {
    if (!hotelInfo) return null;

    return (
        <div>
            <h2 className="mb-4 text-[24px] font-bold text-slate-800">
                Nơi lưu trú
            </h2>

            <div className="rounded-2xl border border-slate-200 p-5 transition">

                <div className="flex items-center justify-between">

                    <div>
                        <h3 className="text-[16px] font-semibold uppercase text-slate-800">
                            {hotelInfo.tenKhachSan}
                        </h3>

                        <div className="mt-1 flex items-center gap-1">
                            {Array.from({
                                length: hotelInfo.soSao,
                            }).map((_, index) => (
                                <Star
                                    key={index}
                                    size={14}
                                    className="fill-yellow-400 text-yellow-400"
                                />
                            ))}
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                            {hotelInfo.diaChi}
                        </p>
                    </div>

                    <Link
                        to={`/khach-san/${hotelInfo.maKhachSan}`}
                        className="flex items-center gap-1 rounded-full bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600"
                    >
                        Xem chi tiết
                        <ChevronRight size={16} />
                    </Link>

                </div>

                {/* Mô tả
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    {hotelInfo.moTa}
                </p>


                {hotelInfo.tienNghi?.length > 0 && (
                    <div className="mt-4">
                        <p className="mb-2 font-semibold text-slate-700">
                            Tiện nghi
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {hotelInfo.tienNghi.map((item) => (
                                <span
                                    key={item.maTienNghi}
                                    className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
                                >
                                    {item.tenTienNghi}
                                </span>
                            ))}
                        </div>
                    </div>
                )} */}

            </div>
        </div>
    );
}

