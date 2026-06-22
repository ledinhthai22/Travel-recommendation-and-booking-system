import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Search } from "lucide-react";

const SelectField = ({
    label,
    value,
    onChange,
    options = [],
    valueKey = 'value',
    labelKey = 'label',
    placeholder = 'Chọn...',
    error = '',
    disabled = false,
    searchable = false,
    searchText = "",
    IconComponent = null,
}) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const ref = useRef(null);
    const searchInputRef = useRef(null);
    const selectedOption = options.find(
        (opt) => String(opt[valueKey]) === String(value)
    );

    const selectedLabel = selectedOption ? selectedOption[labelKey] : placeholder;
    const filteredOptions = searchable
        ? options.filter((option) =>
            String(option[labelKey] || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
        : options;
    useEffect(() => {
        if (open && searchable) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
        }
    }, [open, searchable]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
                setSearchTerm("");
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (option) => {
        if (disabled) return;

        onChange(String(option[valueKey]));
        setSearchTerm("");
        setOpen(false);
    };
    return (
        <div ref={ref} className="relative w-full">
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen((prev) => !prev)}
                className={`group relative flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all outline-none ${error
                    ? 'border-[#ba1a1a]/50 bg-red-50/50 focus:ring-4 focus:ring-[#ba1a1a]/10'
                    : disabled
                        ? 'cursor-not-allowed border-transparent bg-gray-50 text-gray-400'
                        : open
                            ? 'border-[#0EA5E5] bg-white ring-1 ring-[#0EA5E5]/10'
                            : 'border-gray-200 bg-white hover:border-[#0EA5E5]/40 hover:bg-gray-50'
                    }`}
            >
                {IconComponent && (
                    <IconComponent
                        size={22}
                        className={`shrink-0 transition-transform ${disabled
                            ? 'text-gray-300'
                            : error
                                ? 'text-[#ba1a1a]'
                                : 'text-[#0EA5E5] group-hover:scale-110'
                            }`}
                    />
                )}

                <div className="flex min-w-0 flex-1 flex-col items-start">
                    {label && (
                        <span
                            className={`text-[10px] font-bold uppercase tracking-wider ${error ? 'text-[#ba1a1a]' : 'text-gray-400'
                                }`}
                        >
                            {label}
                        </span>
                    )}

                    <span
                        className={`mt-0.5 truncate text-sm font-medium ${selectedOption
                            ? 'text-gray-800'
                            : 'text-gray-400'
                            }`}
                    >
                        {selectedLabel}
                    </span>
                </div>

                <ChevronDown
                    size={16}
                    className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-[#0EA5E5]' : 'text-gray-400'
                        }`}
                />
            </button>

            {open && !disabled && (
                <div className="absolute left-0 top-[110%] z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-100 bg-white text-left shadow-xl animate-in fade-in zoom-in-95 duration-200">
                    {searchable && (
                        <div className="relative p-3">
                            <Search
                                size={16}
                                className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={searchText}
                                className="w-full rounded-lg border border-gray-200 pl-10 pr-3 py-2 text-sm outline-none focus:border-sky-500"
                            />
                        </div>)}
                    <div
                        className={`overflow-y-auto py-2 ${filteredOptions.length > 4
                                ? "max-h-45"
                                : ""
                            }`}
                    >
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => {
                                const optionValue = String(option[valueKey]);
                                const optionLabel = option[labelKey];
                                const active = String(value) === optionValue;

                                return (
                                    <button
                                        key={optionValue || index}
                                        type="button"
                                        onClick={() => handleSelect(option)}
                                        className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors ${active
                                            ? 'bg-slate-50 text-[#0EA5E5]'
                                            : 'text-gray-700 hover:bg-slate-50 hover:text-[#0EA5E5]'
                                            }`}
                                    >
                                        {optionLabel}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-400 text-center">
                                Không tìm thấy kết quả
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-[#ba1a1a] font-medium">
                    {error}
                </p>
            )}
        </div>
    );
};

export default SelectField;