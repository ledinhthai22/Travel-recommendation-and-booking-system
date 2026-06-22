import { useState, useEffect, useRef } from "react";
import { Calendar, Clock } from "lucide-react";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    addMonths,
    subMonths,
    setHours,
    setMinutes,
    isValid,
    startOfDay,
    addDays,
} from "date-fns";
import { vi } from "date-fns/locale";

const DateTimePicker = ({
    value,
    onChange,
    placeholderText = "Chọn ngày giờ",
    disabled = false,
    error,
    onBlur,
    minDate,
    maxDate,
    disableToday = false,
}) => {
    const containerRef = useRef(null);
    const timeListRef = useRef(null);

    const effectiveMinDate = minDate
        ?? (disableToday ? startOfDay(addDays(new Date(), 1)) : null);

    const [isOpen, setIsOpen] = useState(false);

    const [currentMonth, setCurrentMonth] = useState(
        value instanceof Date && isValid(value) ? value : new Date()
    );

    useEffect(() => {
        if (value instanceof Date && isValid(value)) {
            setCurrentMonth(value);
        }
    }, [value]);

    // Scroll đến giờ hiện tại khi mở picker
    useEffect(() => {
        if (isOpen && timeListRef.current) {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = Math.floor(now.getMinutes() / 15) * 15;
            const index = currentHour * 4 + currentMinute / 15;
            const itemHeight = 34;
            timeListRef.current.scrollTop = index * itemHeight;
        }
    }, [isOpen]);

    // Click ngoài đóng — chỉ gọi onBlur khi đang mở
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                if (isOpen) {
                    setIsOpen(false);
                    onBlur?.();
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onBlur, isOpen]);

    const isDateDisabled = (date) => {
        const d = startOfDay(date);
        if (effectiveMinDate && d < effectiveMinDate) return true;
        if (maxDate && d > startOfDay(maxDate)) return true;
        return false;
    };

    const handleDateClick = (date) => {
        if (isDateDisabled(date)) return;

        const baseDate = value instanceof Date && isValid(value) ? value : new Date();
        const updatedDate = setMinutes(setHours(date, baseDate.getHours()), baseDate.getMinutes());
        onChange?.(updatedDate);
        setIsOpen(false);
    };

    const handleTimeClick = (hours, minutes) => {
        const baseDate = value instanceof Date && isValid(value) ? value : new Date();
        const updatedDate = setMinutes(setHours(baseDate, hours), minutes);
        onChange?.(updatedDate);
        setIsOpen(false);
    };

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const times = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 15) {
            times.push({
                hours: h,
                minutes: m,
                label: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
            });
        }
    }

    const canGoPreviousMonth = effectiveMinDate
        ? startOfMonth(currentMonth) > startOfMonth(effectiveMinDate)
        : startOfMonth(currentMonth) > startOfMonth(new Date());

    return (
        <div ref={containerRef} className="relative w-full">
            <div className="relative flex items-center">
                <input
                    type="text"
                    readOnly
                    disabled={disabled}
                    placeholder={placeholderText}
                    value={
                        value instanceof Date && isValid(value)
                            ? format(value, "dd/MM/yyyy HH:mm")
                            : ""
                    }
                    onClick={() => !disabled && setIsOpen((prev) => !prev)}
                    className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-all cursor-pointer
                        ${error
                            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-100"
                            : "border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
                        }
                        disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed`}
                />
                <Calendar size={16} className="absolute right-3.5 text-slate-400 pointer-events-none" />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 z-[10000] flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                    {/* CALENDAR */}
                    <div className="w-64">
                        <div className="mb-3 flex items-center justify-between">
                            <button
                                type="button"
                                disabled={!canGoPreviousMonth}
                                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                                className={`p-1 rounded-lg ${canGoPreviousMonth
                                    ? "hover:bg-slate-100 text-slate-600"
                                    : "text-slate-300 cursor-not-allowed"
                                    }`}
                            >
                                ‹
                            </button>
                            <span className="text-xs font-bold text-slate-700 capitalize">
                                {format(currentMonth, "MMMM yyyy", { locale: vi })}
                            </span>
                            <button
                                type="button"
                                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
                            >
                                ›
                            </button>
                        </div>

                        <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400">
                            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                                <div key={d}>{d}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({
                                length: (startOfMonth(currentMonth).getDay() + 6) % 7,
                            }).map((_, i) => (
                                <div key={i} />
                            ))}

                            {daysInMonth.map((date, idx) => {
                                const isSelected =
                                    value instanceof Date &&
                                    isValid(value) &&
                                    isSameDay(date, value);
                                const disabled = isDateDisabled(date);

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => handleDateClick(date)}
                                        className={`h-8 w-8 rounded-lg text-xs font-medium flex items-center justify-center transition-all
                                            ${isSelected
                                                ? "bg-sky-500 text-white font-bold shadow-md"
                                                : disabled
                                                    ? "text-slate-300 cursor-not-allowed"
                                                    : "text-slate-700 hover:bg-slate-100"
                                            }`}
                                    >
                                        {format(date, "d")}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="w-px bg-slate-100" />

                    {/* TIME */}
                    <div className="w-24 flex flex-col">
                        <div className="mb-2 flex items-center justify-center gap-1 border-b border-slate-100 pb-2 text-xs font-bold text-slate-700">
                            <Clock size={12} />
                            Giờ
                        </div>
                        <div ref={timeListRef} className="max-h-48 overflow-y-auto space-y-1 pr-1">
                            {times.map((t) => {
                                const isSelected =
                                    value instanceof Date &&
                                    isValid(value) &&
                                    value.getHours() === t.hours &&
                                    value.getMinutes() === t.minutes;

                                return (
                                    <button
                                        key={t.label}
                                        type="button"
                                        onClick={() => handleTimeClick(t.hours, t.minutes)}
                                        className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-all
                                            ${isSelected
                                                ? "bg-sky-500 text-white font-bold"
                                                : "text-slate-600 hover:bg-slate-100"
                                            }`}
                                    >
                                        {t.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateTimePicker;