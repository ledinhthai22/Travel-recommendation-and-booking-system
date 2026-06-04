import { Bus } from "lucide-react";
import { useMemo, useState } from "react";

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("vi-VN");
}

function formatPrice(value) {
    return value === 0
        ? "Miễn phí"
        : `${value.toLocaleString("vi-VN")}đ`;
}

export function SchedulePicker({
    schedules = [],
    selectedDeparture,
    onSelectDeparture,
}) {
    const months = useMemo(() => {
        return [
            ...new Set(
                schedules.map((schedule) => {
                    const date = new Date(
                        schedule.ngayKhoiHanh
                    );

                    return `${String(
                        date.getMonth() + 1
                    ).padStart(2, "0")}/${date.getFullYear()}`;
                })
            ),
        ];
    }, [schedules]);

    const [selectedMonth, setSelectedMonth] = useState(
        months[0]
    );

    const filteredSchedules = schedules.filter(
        (schedule) => {
            const date = new Date(
                schedule.ngayKhoiHanh
            );

            const monthYear = `${String(
                date.getMonth() + 1
            ).padStart(2, "0")}/${date.getFullYear()}`;

            return monthYear === selectedMonth;
        }
    );
    function formatTime(dateString) {
        const date = new Date(dateString);

        return date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    return (
        <div>
            <h2 className="mb-4 text-[24px] font-bold text-slate-800">
                Lịch trình khởi hành
            </h2>

            {/* Month Tabs */}
            <div className="flex flex-wrap gap-5">
                {months.map((month) => {
                    const active =
                        selectedMonth === month;

                    return (
                        <button
                            key={month}
                            onClick={() =>
                                setSelectedMonth(month)
                            }
                            className="rounded-lg border px-10 py-5 text-sm font-medium transition-all"
                            style={
                                active
                                    ? {
                                        borderColor:
                                            "#0EA5E5",
                                        backgroundColor:
                                            "#0EA5E5",
                                    }
                                    : {
                                        borderColor:
                                            "#e2e8f0",
                                    }
                            }
                        >
                            <p
                                className={`font-bold ${active
                                    ? "text-white"
                                    : "text-slate-500"
                                    }`}
                            >
                                Tháng {month}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Schedule List */}
            <div className="mt-4 flex flex-col gap-4">
                {filteredSchedules.map(
                    (schedule) => {
                        const isActive =
                            selectedDeparture?.maChuyen ===
                            schedule.maChuyen;

                        return (
                            <div
                                key={schedule.maChuyen}
                                className={`
                                    overflow-hidden rounded-3xl border bg-white
                                    transition-all duration-300
                                    ${isActive
                                        ? "border-[#0EA5E5] shadow-md"
                                        : "border-slate-200 hover:border-[#0EA5E5]/40"
                                    }
                                `}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between p-4">
                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                        <span className="shrink-0 rounded-full bg-[#EFF9FF] px-4 py-1.5 text-sm font-bold text-[#0EA5E5]">
                                            {formatDate(
                                                schedule.ngayKhoiHanh
                                            )}
                                        </span>

                                        <span className="truncate text-sm text-slate-600">
                                            {
                                                schedule.maChuyenCode
                                            }
                                        </span>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-4">
                                        <span className="text-xl font-bold text-red-500">
                                            {schedule.gia.giaNguoiLon.toLocaleString(
                                                "vi-VN"
                                            )}
                                            đ
                                        </span>

                                        <button
                                            onClick={() =>
                                                onSelectDeparture(
                                                    schedule
                                                )
                                            }
                                            className={`
                                                rounded-full px-6 py-2 text-sm font-medium text-white transition
                                                ${isActive
                                                    ? "bg-[#38BDF8]"
                                                    : "bg-slate-500 hover:bg-slate-600"
                                                }
                                            `}
                                        >
                                            {isActive
                                                ? "Đang chọn"
                                                : "Chọn"}
                                        </button>
                                    </div>
                                </div>

                                {/* Detail */}
                                {isActive && (
                                    <div className="p-4">
                                        <div className="mx-4">
                                            <div className="border-t border-slate-200 pt-4">
                                                <h4 className="mb-4 text-center font-bold text-slate-700">
                                                    Phương tiện di chuyển
                                                </h4>

                                                <div className="grid grid-cols-2 divide-x divide-slate-300">
                                                    {/* NGÀY ĐI */}
                                                    <div className="pr-6">
                                                        <div className="mb-3 flex items-center justify-between">
                                                            <span className="font-semibold text-slate-600">
                                                                Ngày đi: {formatDate(schedule.ngayKhoiHanh)}
                                                            </span>

                                                            <span className="flex items-center gap-1 text-sm text-[#F97316]">
                                                                <Bus size={14} />
                                                                Xe khách
                                                            </span>
                                                        </div>

                                                        {/* Timeline */}
                                                        <div>
                                                            <div className="flex justify-between text-xl text-slate-700">
                                                                <span>6:00</span>
                                                                <span>8:00</span>
                                                            </div>

                                                            <div className="relative my-2">
                                                                <div className="border-t border-dashed border-slate-400"></div>
                                                                <div className="absolute left-0 top-[-3px] h-2 w-2 rounded-full bg-slate-500"></div>
                                                                <div className="absolute right-0 top-[-3px] h-2 w-2 rounded-full bg-slate-500"></div>
                                                            </div>

                                                            <div className="flex justify-between text-lg text-slate-600">
                                                                <span>{schedule.diemKhoiHanh}</span>
                                                                <span>{schedule.diemDen}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* NGÀY VỀ */}
                                                    <div className="pl-6">
                                                        <div className="mb-3 flex items-center justify-between">
                                                            <span className="font-semibold text-slate-600">
                                                                Ngày về: {formatDate(schedule.ngayKetThuc)}
                                                            </span>

                                                            <span className="flex items-center gap-1 text-sm text-[#F97316]">
                                                                <Bus size={14} />
                                                                Xe khách
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <div className="flex justify-between text-xl text-slate-700">
                                                                <span>17:30</span>
                                                                <span>19:00</span>
                                                            </div>

                                                            <div className="relative my-2">
                                                                <div className="absolute left-0 top-[-3px] h-2 w-2 rounded-full bg-slate-500"></div>
                                                                <div className="border-t border-dashed border-slate-400"></div>
                                                                <div className="absolute right-0 top-[-3px] h-2 w-2 rounded-full bg-slate-500"></div>
                                                            </div>

                                                            <div className="flex justify-between text-lg text-slate-600">
                                                                <span>{schedule.diemDen}</span>
                                                                <span>{schedule.diemKhoiHanh}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 border-t border-slate-200 pt-4">
                                                <h4 className="mb-6 text-center text-[16px] font-bold text-slate-800">
                                                    Giá chuyến đi
                                                </h4>

                                                <div className="grid grid-cols-2 gap-8">

                                                    <div className="border-r border-slate-300 pr-8">
                                                        <div className="mb-6 flex justify-between">
                                                            <p>Người lớn</p>

                                                            <span className="font-bold text-red-500">
                                                                {formatPrice(
                                                                    schedule.gia.giaNguoiLon
                                                                )}
                                                            </span>
                                                        </div>

                                                        <div className="flex justify-between">
                                                            <p>Trẻ em</p>

                                                            <span className="font-bold text-red-500">
                                                                {formatPrice(
                                                                    schedule.gia.giaTreEm
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="mb-6 flex justify-between">
                                                            <p>Em bé</p>

                                                            <span className="font-bold text-red-500">
                                                                {formatPrice(
                                                                    schedule.gia.giaEmBe
                                                                )}
                                                            </span>
                                                        </div>

                                                        <div className="flex justify-between">
                                                            <p>
                                                                Phụ thu phòng đơn
                                                            </p>

                                                            <span className="font-bold text-red-500">
                                                                {formatPrice(
                                                                    schedule.gia.phuThuPhongDon
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    }
                )}
            </div>
        </div>
    );
}