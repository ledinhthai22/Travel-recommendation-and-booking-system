import React, { useState, useEffect, useRef } from "react";
import { Clock } from "lucide-react";

const Picker = ({
    value,
    onChange,
    disabled,
    placeholder = "HH:mm",
    error,
    onBlur
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const activeItemRef = useRef(null); 
    const scrollContainerRef = useRef(null); 
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                if (isOpen) {
                    setIsOpen(false);
                    onBlur?.();
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onBlur, isOpen]);


    useEffect(() => {
        if (isOpen && value) {
            const timer = setTimeout(() => {
                if (activeItemRef.current) {
                    activeItemRef.current.scrollIntoView({
                        behavior: "auto", 
                        block: "nearest"
                    });
                } else if (scrollContainerRef.current) {

                    const [hStr, mStr] = value.split(":");
                    const h = parseInt(hStr, 10) || 0;
                    const m = parseInt(mStr, 10) || 0;
                    const index = h * 4 + Math.floor(m / 15);
                    const itemHeight = 34; 
                    scrollContainerRef.current.scrollTop = index * itemHeight;
                }
            }, 50);
            
            return () => clearTimeout(timer);
        }
    }, [isOpen, value]);


    const times = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 15) {
            times.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
        }
    }

    return (
        <div className="relative w-full" ref={containerRef}>
            <div className="relative flex items-center">
                <input
                    type="text"
                    readOnly
                    value={value || ""}
                    placeholder={placeholder}
                    disabled={disabled}
                    onClick={() => {
                        if (!disabled) {
                            if (!value) {
                                const now = new Date();
                                const currentHour = String(now.getHours()).padStart(2, "0");
                                const roundedMinutes = String(Math.floor(now.getMinutes() / 15) * 15).padStart(2, "0");
                                
                                const defaultTime = `${currentHour}:${roundedMinutes}`;
                                onChange?.(defaultTime);
                            }
                            setIsOpen((v) => !v);
                        }
                    }}
                    className={`w-full rounded-xl border bg-white text-slate-900 px-4 py-2.5 outline-none transition-all duration-200 cursor-pointer text-sm
                        ${error
                            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-100"
                            : "border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-100"
                        }
                        disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500`}
                />

                <Clock
                    size={16}
                    className="absolute right-3.5 text-slate-400 pointer-events-none"
                />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white border border-slate-200 shadow-xl rounded-2xl p-3 z-[10000] animate-in fade-in zoom-in-95 duration-200">
                    <div 
                        ref={scrollContainerRef}
                        className="overflow-y-auto max-h-64 pr-1 grid grid-cols-1 gap-1.5 scrollbar-thin"
                    >
                        {times.map((timeLabel) => {
                            const isSelected = value === timeLabel;
                            return (
                                <button
                                    key={timeLabel}
                                    ref={isSelected ? activeItemRef : null} 
                                    type="button"
                                    onClick={() => {
                                        onChange(timeLabel);
                                        setIsOpen(false);
                                        onBlur?.();
                                    }}
                                    className={`w-full text-center py-2 rounded-lg text-xs font-medium transition-all
                                        ${isSelected
                                            ? "bg-sky-500 text-white font-bold shadow-sm"
                                            : "hover:bg-slate-100 text-slate-700"
                                        }`}
                                >
                                    {timeLabel}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Picker;