import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
    isBefore,
    isAfter,
    parse,
} from "date-fns";
import { vi } from "date-fns/locale";

const DateTimePicker = ({
    value,
    onChange,
    placeholderText = "Chọn ngày giờ (dd/MM/yyyy HH:mm)",
    disabled = false,
    error,
    onBlur,
    minDate,
    maxDate,
    disableToday = false,
}) => {
    const containerRef = useRef(null);
    const timeListRef = useRef(null);
    const inputRef = useRef(null);

    const effectiveMinDate = minDate ?? (disableToday ? startOfDay(addDays(new Date(), 1)) : null);

    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(
        value instanceof Date && isValid(value) ? value : new Date()
    );
    const [inputValue, setInputValue] = useState("");

    // Đồng bộ props value bên ngoài vào ô nhập liệu
    useEffect(() => {
        if (value instanceof Date && isValid(value)) {
            setCurrentMonth(value);
            setInputValue(format(value, "dd/MM/yyyy HH:mm"));
        } else {
            setInputValue("");
        }
    }, [value]);

    const isDateDisabled = useCallback((date) => {
        const d = startOfDay(date);
        if (effectiveMinDate && isBefore(d, startOfDay(effectiveMinDate))) return true;
        if (maxDate && isAfter(d, startOfDay(maxDate))) return true;
        return false;
    }, [effectiveMinDate, maxDate]);

   
    const livePreviewDate = useMemo(() => {
        const trimmed = inputValue.trim();
        if (!trimmed) return null;


        let parsed = parse(trimmed, "dd/MM/yyyy HH:mm", new Date());
        if (isValid(parsed)) return parsed;


        parsed = parse(trimmed, "dd/MM/yyyy", new Date());
        if (isValid(parsed)) {
            const baseDate = value instanceof Date && isValid(value) ? value : new Date();
            return setMinutes(setHours(parsed, baseDate.getHours()), baseDate.getMinutes());
        }

        return null;
    }, [inputValue, value]);

  
    const displayDate = livePreviewDate || (value instanceof Date && isValid(value) ? value : null);

 
    useEffect(() => {
        if (livePreviewDate && isValid(livePreviewDate) && !isDateDisabled(livePreviewDate)) {
            setCurrentMonth(livePreviewDate);
        }
    }, [livePreviewDate, isDateDisabled]);

   
    useEffect(() => {
        if (isOpen && timeListRef.current) {
            const activeDate = displayDate || new Date();
            const currentHour = activeDate.getHours();
            const currentMinute = Math.floor(activeDate.getMinutes() / 5) * 5;
            const index = currentHour * 12 + currentMinute / 5;
            const itemHeight = 34;
            timeListRef.current.scrollTop = Math.max(0, index * itemHeight - 50);
        }
    }, [isOpen, displayDate]);

    // Hàm thực hiện kiểm tra chuỗi text và lưu giá trị Date chính thức
    const validateAndCommit = (text) => {
        const trimmed = text.trim();
        if (!trimmed) {
            onChange?.(null);
            setInputValue("");
            return;
        }

        // Thử parse theo cấu trúc đầy đủ: dd/MM/yyyy HH:mm
        let parsedDate = parse(trimmed, "dd/MM/yyyy HH:mm", new Date());

        // Nếu không khớp, thử parse cấu trúc chỉ có ngày: dd/MM/yyyy
        if (!isValid(parsedDate)) {
            const onlyDate = parse(trimmed, "dd/MM/yyyy", new Date());
            if (isValid(onlyDate)) {
                const baseDate = value instanceof Date && isValid(value) ? value : new Date();
                parsedDate = setMinutes(setHours(onlyDate, baseDate.getHours()), baseDate.getMinutes());
            }
        }

        // Kiểm tra xem ngày gõ vào có hợp lệ và không bị disable không
        if (isValid(parsedDate) && !isDateDisabled(parsedDate)) {
            onChange?.(parsedDate);
            setInputValue(format(parsedDate, "dd/MM/yyyy HH:mm"));
            setCurrentMonth(parsedDate);
        } else {
            // Nếu sai định dạng hoặc bị chặn, trả về giá trị cũ từ props
            if (value instanceof Date && isValid(value)) {
                setInputValue(format(value, "dd/MM/yyyy HH:mm"));
            } else {
                setInputValue("");
            }
        }
    };

    const handleDateClick = (date) => {
        if (isDateDisabled(date)) return;
        const baseDate = displayDate || (value instanceof Date && isValid(value) ? value : new Date());
        const updatedDate = setMinutes(setHours(date, baseDate.getHours()), baseDate.getMinutes());
        onChange?.(updatedDate);
        setInputValue(format(updatedDate, "dd/MM/yyyy HH:mm"));
    };

    const handleTimeClick = (hours, minutes) => {
        const baseDate = displayDate || (value instanceof Date && isValid(value) ? value : new Date());
        const updatedDate = setMinutes(setHours(new Date(baseDate), hours), minutes);
        onChange?.(updatedDate);
        setInputValue(format(updatedDate, "dd/MM/yyyy HH:mm"));
    };

    const handleInputChange = (e) => {
        let raw = e.target.value;

        // Chỉ cho phép nhập số, dấu gạch chéo, dấu hai chấm và khoảng trắng
        let cleaned = raw.replace(/[^0-9\/\s:]/g, "");

        // Tự động thêm dấu `/` khi gõ ngày tháng (Ví dụ: "12" -> "12/")
        if ((cleaned.length === 2 && !cleaned.includes("/")) || (cleaned.length === 5 && cleaned.split("/").length === 2)) {
            cleaned += "/";
        }
        // Tự động thêm khoảng trắng sau khi gõ xong năm (Ví dụ: "12/12/2026" -> "12/12/2026 ")
        if (cleaned.length === 10 && cleaned.split("/").length === 3 && !cleaned.includes(" ")) {
            cleaned += " ";
        }
        // Tự động thêm dấu `:` khi gõ giờ (Ví dụ: "12/12/2026 14" -> "12/12/2026 14:")
        if (cleaned.length === 13 && cleaned.includes(" ") && !cleaned.includes(":")) {
            cleaned += ":";
        }

        // Giới hạn độ dài chuỗi tối đa là 16 ký tự (dd/MM/yyyy HH:mm)
        if (cleaned.length > 16) {
            cleaned = cleaned.slice(0, 16);
        }

        setInputValue(cleaned);
    };

    // Xử lý click ra bên ngoài bảng điều khiển
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                if (isOpen) {
                    setIsOpen(false);
                    validateAndCommit(inputValue); // Khớp dữ liệu khi click ra ngoài
                    onBlur?.();
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, inputValue, value]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            validateAndCommit(inputValue);
            setIsOpen(false);
            onBlur?.();
        }

        if (e.key === "Escape") {
            e.preventDefault();
            setIsOpen(false);
            if (value instanceof Date && isValid(value)) {
                setInputValue(format(value, "dd/MM/yyyy HH:mm"));
            } else {
                setInputValue("");
            }
            onBlur?.();
        }
    };

    const handleFocus = () => {
        if (!disabled) {
            if (!value) {
                const today = new Date();
                let defaultDate = minDate && isBefore(today, minDate) ? minDate : today;
                const currentMinutes = defaultDate.getMinutes();
                const roundedMinutes = Math.floor(currentMinutes / 5) * 5;
                defaultDate = setMinutes(defaultDate, roundedMinutes);

                onChange?.(defaultDate);
                setInputValue(format(defaultDate, "dd/MM/yyyy HH:mm"));
            }
            setIsOpen(true);
        }
    };

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const times = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 5) {
            times.push({
                hours: h,
                minutes: m,
                label: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
            });
        }
    }

    const canGoPreviousMonth = effectiveMinDate
        ? isBefore(startOfMonth(effectiveMinDate), startOfMonth(currentMonth))
        : true;

    const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    const startDayIndex = (startOfMonth(currentMonth).getDay() + 6) % 7;

    return (
        <div ref={containerRef} className="relative w-full">
            <div className="relative flex items-center">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    disabled={disabled}
                    placeholder={placeholderText}
                    className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-all font-mono
                        ${error
                            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-100"
                            : "border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
                        }
                        disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed`}
                />
                <Calendar size={16} className="absolute right-3.5 text-slate-400 pointer-events-none" />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 z-[10000] flex w-full min-w-[340px] gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex-1">
                        <div className="mb-3 flex items-center justify-between">
                            <button
                                type="button"
                                disabled={!canGoPreviousMonth}
                                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                                className={`p-1.5 rounded-lg text-sm font-medium transition-all
                                    ${canGoPreviousMonth
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
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 text-sm font-medium transition-all"
                            >
                                ›
                            </button>
                        </div>

                        <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400">
                            {weekDays.map((d) => (
                                <div key={d} className="py-1">{d}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: startDayIndex }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square" />
                            ))}

                            {daysInMonth.map((date, idx) => {
                                const isSelected = displayDate && isSameDay(date, displayDate);
                                const dayDisabled = isDateDisabled(date);
                                const isToday = isSameDay(date, new Date());

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={dayDisabled}
                                        onClick={() => handleDateClick(date)}
                                        className={`w-full aspect-square rounded-lg text-xs font-medium flex items-center justify-center transition-all relative
                                            ${isSelected
                                                ? "bg-sky-500 text-white font-bold shadow-md"
                                                : dayDisabled
                                                    ? "text-slate-300 cursor-not-allowed"
                                                    : isToday
                                                        ? "text-sky-600 font-bold hover:bg-sky-50"
                                                        : "text-slate-700 hover:bg-slate-100"
                                            }`}
                                    >
                                        {format(date, "d")}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="w-px bg-slate-100 self-stretch" />

                    <div className="w-20 shrink-0 flex flex-col">
                        <div className="mb-2 flex items-center justify-center gap-1 border-b border-slate-100 pb-2 text-xs font-bold text-slate-700">
                            <Clock size={12} />
                            Giờ
                        </div>
                        <div ref={timeListRef} className="max-h-[220px] overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                            {times.map((t) => {
                                const isSelected = displayDate &&
                                    displayDate.getHours() === t.hours &&
                                    displayDate.getMinutes() === t.minutes;

                                return (
                                    <button
                                        key={t.label}
                                        type="button"
                                        onClick={() => handleTimeClick(t.hours, t.minutes)}
                                        className={`w-full rounded-lg py-1.5 text-center text-xs font-medium transition-all
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