import { useState, useEffect, useRef } from "react";
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

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                onBlur?.();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onBlur]);

    const times = [];

    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 15) {
            times.push({
                hours: h,
                minutes: m,
                label: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
            });
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
                    onClick={() => !disabled && setIsOpen((v) => !v)}
                    className={`w-full rounded-xl border bg-white text-slate-900 px-4 py-2.5 outline-none transition-all duration-200 cursor-pointer text-sm
                        ${
                            error
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
                <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-slate-200 shadow-xl rounded-2xl p-2 z-[10000]">
                    <div className="overflow-y-auto max-h-64 pr-1 space-y-1">
                        {times.map((t, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                    onChange(t.label);
                                    setIsOpen(false);
                                    onBlur?.()
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                                    ${
                                        value === t.label
                                            ? "bg-sky-500 text-white font-semibold"
                                            : "hover:bg-slate-100 text-slate-700"
                                    }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Picker;