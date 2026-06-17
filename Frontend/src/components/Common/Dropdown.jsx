import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Check, Search, X, Star } from 'lucide-react';

export default function Dropdown({
    label,
    value,
    options = [],
    onChange,
    disabled = false,
    multiSelect = false,
    selected = [],
    searchable = false,
    clearable = false,
    placeholder = 'Chọn',
    fullWidth = true,
    className = ""
}) {
    const [open, setOpen] = useState(false);
    const [keyword, setKeyword] = useState('');
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const normalizedOptions = useMemo(() => {
        return options.map((option) => {
            if (typeof option === 'string') {
                return { value: option, label: option };
            }
            return { value: option.value, label: option.label };
        });
    }, [options]);

    const selectedOption = normalizedOptions.find(
        (option) => option.value === value,
    );

    const displayLabel = multiSelect
        ? selected.length > 0
            ? `${placeholder} (${selected.length})`
            : placeholder
        : selectedOption?.label || placeholder;

    const filteredOptions = useMemo(() => {
        const text = keyword.trim().toLowerCase();

        if (!text) return normalizedOptions;

        return normalizedOptions.filter((option) =>
            typeof option.label === "string"
                ? option.label.toLowerCase().includes(text)
                : true
        );
    }, [keyword, normalizedOptions]);

    const handleClear = (event) => {
        event.stopPropagation();
        if (multiSelect) {
            onChange?.('__clear__');
            return;
        }
        onChange?.(normalizedOptions[0]?.value || '');
    };

    return (

        <div
            ref={ref}
            className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : 'w-fit'} ${className}`}
        >

            {label && (
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    {label}
                </label>
            )}

            <div className="relative w-full">
                <button
                    type="button"
                    onClick={() => {
                        if (disabled) return;
                        setOpen((prev) => !prev)
                    }}
                    className={`
                            flex h-11 w-full items-center justify-between
                            rounded-2xl border border-slate-200
                            px-4 text-[15px] font-medium
                            shadow-sm transition-all duration-200
                            ${disabled
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-white text-slate-800 hover:border-slate-300"
                        }
                `}
                >

                    <span className="truncate text-sm font-normal">
                        {displayLabel}
                    </span>

                    <div className="flex items-center gap-1">
                        {clearable && value && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="text-slate-400 hover:text-red-500"
                            >
                                <X size={14} />
                            </button>
                        )}

                        <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''
                                }`}
                        />
                    </div>
                </button>

                {open && (
                    <div
                        className="
                            absolute left-0 top-full z-50 mt-2
                            w-full overflow-hidden
                            rounded-2xl border border-slate-200
                            bg-white shadow-xl
                        "
                    >
                        {searchable && (
                            <div className="border-b border-slate-100 p-3">
                                <div className="relative">
                                    <Search
                                        size={15}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                    <input
                                        value={keyword}
                                        onChange={(event) => setKeyword(event.target.value)}
                                        placeholder="Tìm kiếm..."
                                        className="
                                            w-full rounded-xl border border-slate-200
                                            py-2 pl-9 pr-3 text-sm
                                            outline-none
                                            focus:border-sky-500
                                            focus:ring-1 focus:ring-sky-500
                                        "
                                    />
                                </div>
                            </div>
                        )}

                        <div className="max-h-64 overflow-y-auto py-2">
                            {filteredOptions.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-slate-400">
                                    Không có dữ liệu
                                </div>
                            ) : multiSelect ? (
                                filteredOptions.map((option) => {
                                    const checked = selected.includes(option.value);
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => onChange?.(option.value)}
                                            className={`
                                                flex w-full items-center gap-3
                                                px-4 py-2.5 text-left text-sm
                                                transition
                                                ${checked ? 'bg-sky-50 text-sky-600' : 'hover:bg-slate-50'}
                                            `}
                                        >
                                            <span className={`flex h-4 w-4 items-center justify-center rounded border ${checked ? 'border-sky-600 bg-sky-600' : 'border-slate-300'}`}>
                                                {checked && <Check size={11} className="text-white" />}
                                            </span>
                                            {option.label}
                                        </button>
                                    );
                                })
                            ) : (

                                filteredOptions.map((option) => {
                                    const isSelected = value === option.value;

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => {
                                                onChange?.(option.value);
                                                setOpen(false);
                                            }}
                                            className={`
                                                        flex w-full items-center
                                                        px-4 py-3 text-left text-sm
                                                        transition-colors
                                                        ${isSelected
                                                    ? "bg-sky-50 font-semibold text-sky-600"
                                                    : "text-slate-700 hover:bg-slate-50"
                                                }
                                                    `}
                                        >
                                            {typeof option.value === "number" ? (
                                                <div className="flex items-center gap-1">
                                                    {[...Array(option.value)].map((_, index) => (
                                                        <Star
                                                            key={index}
                                                            size={10}
                                                            className="fill-yellow-400 text-yellow-400"
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                option.label
                                            )}
                                        </button>
                                    );
                                })

                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}