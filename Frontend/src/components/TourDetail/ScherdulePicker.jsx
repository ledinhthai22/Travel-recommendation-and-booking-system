import { Plane, Bus, Train, Ship, Car, Ticket, MapPin, AlertCircle } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { formatDate } from "~/Helper/FormatDate";
import { formatCurrency } from "~/Helper/FormatCurrency";

export function SchedulePicker({
    schedules = [],
    selectedDeparture,
    onSelectDeparture,
}) {
    const months = useMemo(() => {
        return [
            ...new Set(
                schedules.map((item) => {
                    const ngayDi = item?.chuyenKhoiHanh?.ngayKhoiHanh;
                    if (!ngayDi) return null;
                    const date = new Date(ngayDi);
                    return `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
                }).filter(Boolean)
            ),
        ];
    }, [schedules]);

    const [selectedMonth, setSelectedMonth] = useState(months[0] || "");

    useEffect(() => {
        if (months.length > 0 && !months.includes(selectedMonth)) {
            setSelectedMonth(months[0]);
        }
    }, [months, selectedMonth]);

    const filteredSchedules = schedules.filter((item) => {
        const ngayDi = item?.chuyenKhoiHanh?.ngayKhoiHanh;
        if (!ngayDi) return false;
        const date = new Date(ngayDi);
        const monthYear = `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
        return monthYear === selectedMonth;
    });

    function formatTime(dateString) {
        if (!dateString) return "--:--";
        const date = new Date(dateString);
        return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", hour12: false });
    }

    const iconMap = { Plane, Bus, Train, Ship, Car };

    // Kiểm tra chuyến hiện tại có hết chỗ không
    const isCurrentFull = useMemo(() => {
        if (!selectedDeparture) return false;
        const info = selectedDeparture.chuyenKhoiHanh || {};
        const soChoToiDa = info.soChoToiDa || 0;
        const soChoDaDat = info.soChoDaDat || 0;
        return (soChoToiDa - soChoDaDat) <= 0;
    }, [selectedDeparture]);

    const findNextAvailable = () => {
        return filteredSchedules.find(item => {
            const info = item.chuyenKhoiHanh || {};
            const conTrong = (info.soChoToiDa || 0) - (info.soChoDaDat || 0);
            return conTrong > 0;
        });
    };

    return (
        <div>
            <h2 className="mb-4 text-[24px] font-bold text-slate-800">Lịch trình khởi hành</h2>

            {months.length > 0 ? (
                <div className="flex flex-wrap gap-5">
                    {months.map((month) => {
                        const active = selectedMonth === month;
                        return (
                            <button
                                key={month}
                                onClick={() => setSelectedMonth(month)}
                                className="rounded-xl border h-[70px] w-[130px] px-8 py-6 text-sm font-medium transition-all"
                                style={active ? { borderColor: "#0EA5E5", backgroundColor: "#0EA5E5" } : { borderColor: "#e2e8f0" }}
                            >
                                <p className={`font-bold ${active ? "text-white" : "text-slate-500"}`}>{month}</p>
                            </button>
                        );
                    })}
                </div>
            ) : (
                <p className="text-slate-500 italic">Hiện tại chưa có lịch khởi hành cho tour này.</p>
            )}

            <div className="mt-4 flex flex-col gap-4">
                {filteredSchedules.map((item) => {
                    const infoChuyen = item.chuyenKhoiHanh || {};
                    const giaChiTiet = item.danhSachGia?.[0] || {};

                    const soChoToiDa = infoChuyen.soChoToiDa || 0;
                    const soChoDaDat = infoChuyen.soChoDaDat || 0;
                    const conTrong = soChoToiDa - soChoDaDat;
                    const isFull = conTrong <= 0;

                    const isActive = selectedDeparture?.chuyenKhoiHanh?.maChuyen === infoChuyen.maChuyen;

                    const VehicleIcon = iconMap[infoChuyen.icon] || Bus;

                    return (
                        <div
                            key={infoChuyen.maChuyen}
                            className={`
                                overflow-hidden rounded-3xl border bg-white transition-all duration-300
                                ${isFull ? "opacity-70" : "hover:border-[#0EA5E5]/40"}
                                ${isActive ? "border-[#0EA5E5] shadow-md" : "border-slate-200"}
                            `}
                        >
                            <div className="flex items-center justify-between p-4 flex-wrap gap-3">
                                <div className="flex min-w-0 flex-1 items-center gap-3 flex-wrap">
                                    <span className="shrink-0 rounded-full bg-[#EFF9FF] px-4 py-1.5 text-sm font-bold text-[#0EA5E5]">
                                        {formatDate(infoChuyen.ngayKhoiHanh)}
                                    </span>

                                    <span className="truncate text-sm text-slate-600 font-medium flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md">
                                        <Ticket size={14} className="text-slate-400 shrink-0" />
                                        <span>{infoChuyen.maChuyenCode || "Chưa có mã"}</span>
                                    </span>

                                    {infoChuyen.diemKhoiHanh && (
                                        <span className="truncate text-sm text-slate-600 font-medium flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md">
                                            <MapPin size={14} className="text-slate-400 shrink-0" />
                                            <span>{infoChuyen.diemKhoiHanh}</span>
                                        </span>
                                    )}
                                </div>

                                <div className="flex shrink-0 items-center gap-4">
                                    {isFull ? (
                                        <button
                                            onClick={() => {
                                                const nextAvailable = findNextAvailable();
                                                if (nextAvailable) {
                                                    onSelectDeparture(nextAvailable);
                                                }
                                            }}
                                            className="rounded-full bg-red-100 px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-200 transition"
                                        >
                                            Hết chỗ - Chọn chuyến khác
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => onSelectDeparture(item)}
                                            className={`rounded-full px-6 py-2 text-sm font-medium text-white transition ${
                                                isActive ? "bg-[#38BDF8]" : "bg-slate-500 hover:bg-slate-600"
                                            }`}
                                        >
                                            {isActive ? "Đang chọn" : "Chọn"}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Ghi chú chuyến khởi hành */}
                           

                            {isActive && (
                                <div className="p-4 bg-slate-50/50">
                                    <div className="mx-4">
                                        <div className="border-t border-slate-200 pt-4">
                                            <h4 className="mb-4 text-center font-bold text-slate-700">Phương tiện di chuyển</h4>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 divide-x-0 md:divide-x divide-slate-300">
                                                <div className="md:pr-6">
                                                    <div className="mb-3 flex items-center justify-between">
                                                        <span className="font-semibold text-slate-600 text-sm">Ngày đi: {formatDate(infoChuyen.ngayKhoiHanh)}</span>
                                                        <span className="flex items-center gap-1 text-sm text-[#F97316] font-medium">
                                                            <VehicleIcon size={14} /> {infoChuyen.tenPhuongTien}
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <div className="flex justify-between text-xl text-slate-700 font-semibold">
                                                            <span>{formatTime(infoChuyen.ngayKhoiHanh)}</span>
                                                            <span>{formatTime(infoChuyen.gioDenNoiDi)}</span>
                                                        </div>
                                                        <div className="relative my-2">
                                                            <div className="border-t border-dashed border-slate-400" />
                                                            <div className="absolute left-0 top-[-3px] h-2 w-2 rounded-full bg-slate-500" />
                                                            <div className="absolute right-0 top-[-3px] h-2 w-2 rounded-full bg-slate-500" />
                                                        </div>
                                                        <div className="flex justify-between text-sm text-slate-500">
                                                            <span>{infoChuyen.diemKhoiHanh}</span>
                                                            <span>{infoChuyen.diemDen}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="md:pl-6">
                                                    <div className="mb-3 flex items-center justify-between">
                                                        <span className="font-semibold text-slate-600 text-sm">Ngày về: {formatDate(infoChuyen.ngayKetThuc)}</span>
                                                        <span className="flex items-center gap-1 text-sm text-[#F97316] font-medium">
                                                            <VehicleIcon size={14} /> {infoChuyen.tenPhuongTien}
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <div className="flex justify-between text-lg text-slate-700 font-semibold">
                                                            <span>{formatTime(infoChuyen.ngayKetThuc)}</span>
                                                            <span>{formatTime(infoChuyen.gioDenNoiVe)}</span>
                                                        </div>
                                                        <div className="relative my-2">
                                                            <div className="border-t border-dashed border-slate-400" />
                                                            <div className="absolute left-0 top-[-3px] h-2 w-2 rounded-full bg-slate-500" />
                                                            <div className="absolute right-0 top-[-3px] h-2 w-2 rounded-full bg-slate-500" />
                                                        </div>
                                                        <div className="flex justify-between text-sm text-slate-500">
                                                            <span>{infoChuyen.diemDen}</span>
                                                            <span>{infoChuyen.diemKhoiHanh}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 border-t border-slate-200 pt-4">
                                            <h4 className="mb-6 text-center text-[16px] font-bold text-slate-800">Giá chi tiết chuyến đi</h4>

                                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y-0 md:divide-x divide-slate-300">
                                                <div className="md:pr-8 space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-slate-600 text-sm">Người lớn</p>
                                                        <span className="font-bold text-red-500">{formatCurrency(giaChiTiet.giaNguoiLon || 0)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-slate-600 text-sm">Trẻ em</p>
                                                        <span className="font-bold text-red-500">{formatCurrency(giaChiTiet.giaTreEm || 0)}</span>
                                                    </div>
                                                </div>
                                                <div className="md:pl-8 space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-slate-600 text-sm">Em bé</p>
                                                        <span className="font-bold text-red-500">{formatCurrency(giaChiTiet.giaEmBe || 0)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-slate-600 text-sm">Phụ thu phòng đơn</p>
                                                        <span className="font-bold text-red-500">
                                                            {giaChiTiet.phuThuPhongDon === 0 ? "Miễn phí" : formatCurrency(giaChiTiet.phuThuPhongDon || 0)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Hiển thị ghi chú trong phần chi tiết mở rộng nếu chưa hiển thị ở trên */}
                                        {infoChuyen.ghiChu && isActive && (
                                            <div className="mt-6 border-t border-slate-200 pt-4">
                                                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                                                    <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                                    <p className="text-sm text-amber-700 leading-relaxed">
                                                        <span className="font-semibold">Ghi chú: </span>
                                                        {infoChuyen.ghiChu}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                            )}
                          
                        </div>
                    );
                })}
            </div>
        </div>
    );
}