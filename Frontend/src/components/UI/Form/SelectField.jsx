import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
    IconComponent = null,
}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const selectedOption = options.find(
        (opt) => String(opt[valueKey]) === String(value)
    );

    const selectedLabel = selectedOption ? selectedOption[labelKey] : placeholder;

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

    const handleSelect = (option) => {
        if (disabled) return;

        onChange(String(option[valueKey]));
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative w-full">
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen((prev) => !prev)}
                className={`group relative flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all outline-none ${
                    error
                        ? 'border-[#ba1a1a]/50 bg-red-50/50 focus:ring-4 focus:ring-[#ba1a1a]/10'
                        : disabled
                        ? 'cursor-not-allowed border-transparent bg-gray-50 text-gray-400'
                        : open
                        ? 'border-[#0EA5E5] bg-white ring-4 ring-[#0EA5E5]/10'
                        : 'border-gray-200 bg-white hover:border-[#0EA5E5]/40 hover:bg-gray-50'
                }`}
            >
                {IconComponent && (
                    <IconComponent
                        size={22}
                        className={`shrink-0 transition-transform ${
                            disabled
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
                            className={`text-[10px] font-bold uppercase tracking-wider ${
                                error ? 'text-[#ba1a1a]' : 'text-gray-400'
                            }`}
                        >
                            {label}
                        </span>
                    )}

                    <span
                        className={`mt-0.5 truncate text-sm font-medium ${
                            selectedOption
                                ? 'text-gray-800'
                                : 'text-gray-400'
                        }`}
                    >
                        {selectedLabel}
                    </span>
                </div>

                <ChevronDown
                    size={16}
                    className={`shrink-0 transition-transform duration-300 ${
                        open ? 'rotate-180 text-[#0EA5E5]' : 'text-gray-400'
                    }`}
                />
            </button>

            {open && !disabled && (
                <div className="absolute left-0 top-[110%] z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-100 bg-white py-2 text-left shadow-xl animate-in fade-in zoom-in-95 duration-200">
                    {options.length > 0 ? (
                        options.map((option, index) => {
                            const optionValue = String(option[valueKey]);
                            const optionLabel = option[labelKey];
                            const active = String(value) === optionValue;

                            return (
                                <button
                                    key={optionValue || index}
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors ${
                                        active
                                            ? 'bg-slate-50 text-[#0EA5E5]'
                                            : 'text-gray-700 hover:bg-slate-50 hover:text-[#0EA5E5]'
                                    }`}
                                >
                                    {optionLabel}
                                </button>
                            );
                        })
                    ) : (
                        <div className="px-4 py-3 text-sm text-gray-400">
                            Không có dữ liệu
                        </div>
                    )}
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