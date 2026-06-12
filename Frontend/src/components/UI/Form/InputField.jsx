import React from 'react';

const InputField = ({
    label,
    name,
    value,
    onChange,
    type = 'text',
    disabled = false,
    readOnly = false,
    placeholder,
    error,
    required = false,
    min,
    max,
    step,
    rows = 4,
    multiline = false,
    Icon,
    rightAction,
    autoComplete = 'off',
    className = '',
    ...rest
}) => {

    const inputClass = `
        w-full rounded-xl border py-2.5 outline-none transition-all duration-200
        ${Icon ? 'pl-10' : 'pl-4'}
        ${rightAction ? 'pr-10' : 'pr-4'}
        ${error
            ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100'
            : disabled
                ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
                : 'border-slate-200 bg-white text-slate-900 shadow-sm focus:border-sky-500 focus:ring-4 focus:ring-sky-100'
        }
        ${className}
    `;

    return (
        <div className="flex w-full flex-col gap-1.5">

            {label && (
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    {label}
                    {required && (
                        <span className="ml-1 text-red-500">*</span>
                    )}
                </label>
            )}

            <div className="relative">

                {Icon && (
                    <span className={`
                            pointer-events-none absolute left-3.5 text-slate-400 flex items-center justify-center
                            ${multiline ? 'top-3.5' : 'top-1/2 -translate-y-1/2'}
                        `}>
                        <Icon size={14} />
                    </span>
                )}

                {multiline ? (
                    <textarea
                        name={name}
                        value={value ?? ''}
                        onChange={onChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        readOnly={readOnly}
                        rows={rows}
                        className={inputClass}
                        {...rest}
                    />
                ) : (
                    <input
                        name={name}
                        type={type}
                        value={value ?? ''}
                        onChange={onChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        readOnly={readOnly}
                        min={min}
                        max={max}
                        step={step}
                        autoComplete={autoComplete}
                        className={inputClass}
                        {...rest}
                    />
                )}

                {rightAction && (
                    <span className={`
                            absolute right-3.5 flex items-center justify-center
                            ${multiline ? 'top-3.5' : 'top-1/2 -translate-y-1/2'}
                        `}>
                        {rightAction}
                    </span>
                )}

            </div>

            {error && (
                <p className="text-xs font-medium text-red-600">
                    {error}
                </p>
            )}

        </div>
    );
};

export default InputField;