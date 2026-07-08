import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Clock } from "lucide-react";

const ITEM_HEIGHT = 34;
const DROPDOWN_HEIGHT = 260;

const Picker = ({
    value,
    onChange,
    disabled,
    placeholder = "HH:mm",
    error,
    onBlur
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || "");
    const [dropdownStyle, setDropdownStyle] = useState(null);
    const containerRef = useRef(null);
    const dropdownRef = useRef(null);
    const activeItemRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const inputRef = useRef(null);

    // Đồng bộ từ props value ngoài vào input khi thay đổi bên ngoài
    useEffect(() => {
        setInputValue(value || "");
    }, [value]);

    // Hàm chuẩn hóa và validate chuỗi thời gian khi người dùng dừng nhập (Enter hoặc Blur)
    const validateAndCommit = (rawVal) => {
        const trimmed = rawVal.trim();
        if (!trimmed) {
            onChange?.("");
            setInputValue("");
            return;
        }

        const parts = trimmed.split(":");
        let hour = parseInt(parts[0], 10);
        let min = parseInt(parts[1] || "0", 10);

        if (isNaN(hour)) hour = 0;
        if (isNaN(min)) min = 0;

        // Giới hạn giá trị hợp lệ
        hour = Math.max(0, Math.min(23, hour));
        min = Math.max(0, Math.min(59, min));

        // Làm tròn phút về khoảng 15 phút (00, 15, 30, 45)
        const roundedMin = Math.floor(min / 15) * 15;
        
        const validTime = `${String(hour).padStart(2, "0")}:${String(roundedMin).padStart(2, "0")}`;
        
        onChange?.(validTime);
        setInputValue(validTime);
    };

    const handleInputChange = (e) => {
        let raw = e.target.value;
        
        // Chỉ cho phép nhập số và dấu hai chấm
        let cleaned = raw.replace(/[^0-9:]/g, "");

        // Tự động thêm dấu ":" khi người dùng gõ xong 2 chữ số giờ (ví dụ "12" -> "12:")
        if (cleaned.length === 2 && !cleaned.includes(":")) {
            const hour = parseInt(cleaned, 10);
            if (hour >= 0 && hour <= 23) {
                cleaned = cleaned + ":";
            }
        }

        // Giới hạn tối đa 5 ký tự (HH:mm)
        if (cleaned.length > 5) {
            cleaned = cleaned.slice(0, 5);
        }

        setInputValue(cleaned);
    };

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
            setInputValue(value || "");
            onBlur?.();
        }

        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            if (!isOpen) {
                setIsOpen(true);
            }
        }
    };

    const handleFocus = () => {
        if (!disabled) {
            if (!value) {
                const now = new Date();
                const currentHour = String(now.getHours()).padStart(2, "0");
                const roundedMinutes = String(Math.floor(now.getMinutes() / 15) * 15).padStart(2, "0");
                const defaultTime = `${currentHour}:${roundedMinutes}`;
                onChange?.(defaultTime);
                setInputValue(defaultTime);
            }
            setIsOpen(true);
        }
    };

    // Xử lý click ra ngoài: Validate dữ liệu đang nhập dở dang và đóng dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            const clickedInsideInput = containerRef.current?.contains(e.target);
            const clickedInsideDropdown = dropdownRef.current?.contains(e.target);
            if (!clickedInsideInput && !clickedInsideDropdown && isOpen) {
                setIsOpen(false);
                validateAndCommit(inputValue); // Khớp dữ liệu khi bấm ra ngoài
                onBlur?.();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, inputValue, value, onBlur]);

    const updatePosition = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const openUpward = spaceBelow < DROPDOWN_HEIGHT && rect.top > spaceBelow;

        setDropdownStyle({
            position: "fixed",
            left: rect.left,
            width: Math.max(rect.width, 140),
            ...(openUpward
                ? { bottom: viewportHeight - rect.top + 6 }
                : { top: rect.bottom + 6 }),
        });
    };

    useLayoutEffect(() => {
        if (!isOpen) return;
        updatePosition();

        const handle = () => updatePosition();
        window.addEventListener("scroll", handle, true);
        window.addEventListener("resize", handle);
        return () => {
            window.removeEventListener("scroll", handle, true);
            window.removeEventListener("resize", handle);
        };
    }, [isOpen]);

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
                    scrollContainerRef.current.scrollTop = index * ITEM_HEIGHT;
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
                    ref={inputRef}
                    type="text"
                    value={inputValue} // Bind trực tiếp với state đang nhập thay vì qua hàm format trung gian gây giật lag
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`w-full rounded-xl border bg-white text-slate-900 px-4 py-2.5 outline-none transition-all duration-200 text-sm font-mono
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

            {isOpen && dropdownStyle && createPortal(
                <div
                    ref={dropdownRef}
                    style={dropdownStyle}
                    className="min-w-[140px] bg-white border border-slate-200 shadow-xl rounded-2xl p-3 z-[10000] animate-in fade-in zoom-in-95 duration-200"
                >
                    <div className="mb-2 text-xs text-slate-500 px-2 font-medium">
                        Nhập hoặc chọn giờ
                    </div>
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
                                        onChange?.(timeLabel);
                                        setInputValue(timeLabel);
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
                </div>,
                document.body
            )}
        </div>
    );
};

export default Picker;