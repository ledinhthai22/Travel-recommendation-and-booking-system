import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Calendar as DefaultCalendarIcon } from "lucide-react";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    addMonths,
    subMonths,
    isValid,
    startOfDay,
    addDays,
    parseISO,
    setYear,
} from "date-fns";
import { vi } from "date-fns/locale";
import SelectField from "./SelectField";

const DatePicker = ({
    label,
    value,
    onChange,
    placeholderText = "Chọn ngày...",
    disabled = false,
    error,
    onBlur,
    minDate,
    maxDate,
    disableToday = false,
    Icon = DefaultCalendarIcon,
}) => {
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const popupRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [popupStyle, setPopupStyle] = useState({});


    const dateValue = typeof value === "string" && value ? parseISO(value) : value;


    const [currentMonth, setCurrentMonth] = useState(
        dateValue instanceof Date && isValid(dateValue) ? dateValue : new Date()
    );


    useEffect(() => {
        if (dateValue instanceof Date && isValid(dateValue)) {
            setCurrentMonth(dateValue);
        }
    }, [value]);


    const updatePopupPosition = useCallback(() => {
        if (!inputRef.current) return;
        const rect = inputRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const popupHeight = 370; 
        const spaceBelow = viewportHeight - rect.bottom;
        const openUpward = spaceBelow < popupHeight && rect.top > popupHeight;

        setPopupStyle({
            position: "fixed",
            left: rect.left,
            width: Math.max(rect.width, 300), 
            zIndex: 99999,
            ...(openUpward
                ? { bottom: viewportHeight - rect.top + 4 }
                : { top: rect.bottom + 4 }),
        });
    }, []);


    useEffect(() => {
        if (isOpen) {
            updatePopupPosition();
            window.addEventListener("scroll", updatePopupPosition, true);
            window.addEventListener("resize", updatePopupPosition);
        }
        return () => {
            window.removeEventListener("scroll", updatePopupPosition, true);
            window.removeEventListener("resize", updatePopupPosition);
        };
    }, [isOpen, updatePopupPosition]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            const clickedInsideContainer = containerRef.current?.contains(event.target);
            const clickedInsidePopup = popupRef.current?.contains(event.target);
            if (!clickedInsideContainer && !clickedInsidePopup) {
                setIsOpen(false);
                onBlur?.();
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onBlur]);

    const effectiveMinDate = minDate ?? (disableToday ? startOfDay(addDays(new Date(), 1)) : null);


    const isDateDisabled = (date) => {
        const d = startOfDay(date);
        if (effectiveMinDate && d < effectiveMinDate) return true;
        if (maxDate && d > startOfDay(maxDate)) return true;
        return false;
    };


    const handleDateClick = (date) => {
        if (isDateDisabled(date)) return;
        onChange?.(format(date, "yyyy-MM-dd"));
        setIsOpen(false);
    };

    const startYear = minDate ? minDate.getFullYear() : 1950;
    const endYear = maxDate ? maxDate.getFullYear() : new Date().getFullYear();
    const yearOptions = [];
    for (let y = endYear; y >= startYear; y--) {
        yearOptions.push({ value: String(y), label: `Năm ${y}` });
    }

    const handleYearChange = (selectedYearStr) => {
        setCurrentMonth(setYear(currentMonth, parseInt(selectedYearStr, 10)));
    };

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const canGoPreviousMonth = effectiveMinDate
        ? startOfMonth(currentMonth) > startOfMonth(effectiveMinDate)
        : true;


    const popup = isOpen ? (
        <div
            ref={popupRef}
            style={popupStyle}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        >

            <div className="mb-4 flex items-center justify-between gap-2">
                <button
                    type="button"
                    disabled={!canGoPreviousMonth}
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className={`px-2 py-1 rounded-lg text-lg font-semibold ${
                        canGoPreviousMonth
                            ? "hover:bg-slate-100 text-slate-600"
                            : "text-slate-300 cursor-not-allowed"
                    }`}
                >
                    ‹
                </button>

                <div className="flex flex-1 items-center justify-center gap-3">
                    <span className="text-sm font-bold text-slate-700 capitalize min-w-[70px] text-center">
                        {format(currentMonth, "MMMM", { locale: vi })}
                    </span>

                    <div className="w-[130px] datepicker-year-select">
                        <SelectField
                            value={String(currentMonth.getFullYear())}
                            onChange={handleYearChange}
                            options={yearOptions}
                            searchable={true}
                            searchText="Tìm năm..."
                            placeholder="Chọn năm"
                        />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="px-2 py-1 rounded-lg text-lg font-semibold hover:bg-slate-100 text-slate-600"
                >
                    ›
                </button>
            </div>


            <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase">
                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                    <div key={d} className="py-1">{d}</div>
                ))}
            </div>


            <div className="grid grid-cols-7 gap-1">
                {Array.from({
                    length: (startOfMonth(currentMonth).getDay() + 6) % 7,
                }).map((_, i) => (
                    <div key={i} className="aspect-square" />
                ))}

                {daysInMonth.map((date, idx) => {
                    const isSelected =
                        dateValue instanceof Date &&
                        isValid(dateValue) &&
                        isSameDay(date, dateValue);
                    const isToday = isSameDay(date, new Date());
                    const isDisabled = isDateDisabled(date);

                    return (
                        <button
                            key={idx}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => handleDateClick(date)}
                            className={`w-full aspect-square rounded-lg text-xs font-medium flex items-center justify-center transition-all
                                ${isSelected
                                    ? "bg-sky-500 text-white font-bold shadow-md"
                                    : isDisabled
                                        ? "text-slate-200 cursor-not-allowed"
                                        : isToday
                                            ? "bg-sky-50 text-sky-600 font-semibold border border-sky-200"
                                            : "text-slate-700 hover:bg-slate-100"
                                }`}
                        >
                            {format(date, "d")}
                        </button>
                    );
                })}
            </div>

            <style>{`
                .datepicker-year-select .overflow-y-auto {
                    max-height: 200px !important;
                }
                .datepicker-year-select button {
                    padding-top: 0.375rem !important;
                    padding-bottom: 0.375rem !important;
                    border-radius: 0.5rem !important;
                }
            `}</style>
        </div>
    ) : null;

    return (
        <div ref={containerRef} className="relative flex w-full flex-col gap-1.5">
            {label && (
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    {label}
                </label>
            )}

            <div className="relative flex items-center">
                {Icon && (
                    <span className="absolute left-3.5 flex items-center justify-center text-slate-400 pointer-events-none">
                        <Icon size={16} />
                    </span>
                )}

                <input
                    ref={inputRef}
                    type="text"
                    readOnly
                    disabled={disabled}
                    placeholder={placeholderText}
                    value={
                        dateValue instanceof Date && isValid(dateValue)
                            ? format(dateValue, "dd/MM/yyyy")
                            : ""
                    }
                    onClick={() => {
                        if (!disabled) {
                            if (!value) {
                                const today = new Date();
                                const defaultDate = minDate && today < startOfDay(minDate) ? minDate : today;
                                onChange?.(format(defaultDate, "yyyy-MM-dd"));
                            }

                            updatePopupPosition();
                            setIsOpen((prev) => !prev);
                        }
                    }}
                    className={`w-full rounded-xl border bg-white py-3 pr-4 text-sm text-slate-900 outline-none transition-all cursor-pointer duration-200
                        ${Icon ? "pl-10" : "pl-4"}
                        ${error
                            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-100"
                            : disabled
                                ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                                : "border-slate-200 text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
                        }`}
                />
            </div>


            {typeof document !== "undefined" && createPortal(popup, document.body)}
        </div>
    );
};

export default DatePicker;