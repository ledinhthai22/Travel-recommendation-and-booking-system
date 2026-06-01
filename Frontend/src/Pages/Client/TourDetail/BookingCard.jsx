import { Phone } from "lucide-react";
export function BookingCard({ price }) {
    return (
        <div className="sticky top-20 rounded-[20px] border border-slate-300  p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-1">
                    <span className="text-[18px] font-bold">
                        GIÁ:
                    </span>

                    <span className="text-[16px] font-bold text-red-500">
                        {price.toLocaleString('vi-VN')}₫
                    </span>
                </div>

                <div className="rounded-full bg-sky-100 px-2 py-1 text-xs font-bold text-sky-500">
                    30/05/2026
                </div>
            </div>

            <div className="grid grid-cols-[100px_1fr] gap-y-1 text-sm border-t-1 border-b-1 border-slate-200 p-2">
                <span className="text-slate-500">Mã tour:</span>
                <span className="text-right">NDSGN3363-027-300526VN-V</span>

                <span className="text-slate-500">Khởi hành:</span>
                <span className="text-right">TP.HCM</span>

                <span className="text-slate-500">Số thời gian:</span>
                <span className="text-right">2 ngày 1 đêm</span>

                <span className="text-slate-500">Số chỗ còn lại:</span>
                <span className="text-right font-medium text-orange-500">
                    Còn lại 5 chỗ
                </span>
            </div>

            <div className="mt-5 flex gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-white">
                    <Phone size={18} />
                </button>

                <button className="flex-1 rounded-full bg-sky-500 py-2.5 font-semibold text-white">
                    Đặt ngay
                </button>
            </div>
        </div>
    );
}

