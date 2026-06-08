import React from 'react';

const InputField = ({
    label,
    name,
    value,
    onChange,
    type = 'text',
    disabled = false,
    placeholder,
    error,
    min,
    max,
    step,
    Icon,
    rightAction,
    autoComplete = 'off',
    className = '',
    ...rest
}) => {
    return (
        <div className="flex w-full flex-col gap-1.5 text-left">
            {label && (
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600">
                    {label}
                </label>
            )}

            <div className="relative flex items-center">
                {Icon && (
                    <span className="pointer-events-none absolute left-3.5 text-slate-400">
                        <Icon size={16} className = "text-slate-400" />
                    </span>
                )}

                <input
                    name={name}
                    type={type}
                    value={value ?? ''}
                    placeholder={placeholder}
                    onChange={onChange}
                    disabled={disabled}
                    min={min}
                    max={max}
                    step={step}
                    autoComplete={autoComplete}
                    className={`w-full rounded-xl border py-2.5 outline-none transition-all duration-200
                        ${Icon ? 'pl-10' : 'pl-4'}
                        ${rightAction ? 'pr-10' : 'pr-4'}
                        ${error
                            ? 'border-[#ba1a1a]/50 bg-red-50/50 focus:border-[#ba1a1a] focus:ring-4 focus:ring-[#ba1a1a]/10 text-gray-900 placeholder:text-gray-400'
                            : disabled
                                ? 'cursor-not-allowed border-transparent bg-gray-50 text-gray-400'
                                : 'border-gray-200 bg-white text-gray-900 shadow-sm focus:border-[#0EA5E5] focus:ring-4 focus:ring-[#005ea3]/10'
                        }`}
                    {...rest}
                />

                {rightAction && (
                    <span className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center justify-center">
                        {rightAction}
                    </span>
                )}
            </div>

            {error && (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-[#ba1a1a] font-medium">
                    {error}
                </p>
            )}
        </div>
    );
};

export default InputField;