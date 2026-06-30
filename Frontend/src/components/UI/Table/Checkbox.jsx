import React from 'react';
import { Check } from 'lucide-react';

export default function Checkbox({ checked, disabled, onChange, title, indeterminate = false }) {
    return (
        <label
            title={title}
            className={`inline-flex items-center justify-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={onChange}
                className="sr-only peer"
            />
            <span
                className={`
                    w-[13px] h-[13px] rounded-[4px] border flex items-center justify-center
                    transition-all duration-150
                    ${disabled
                        ? 'bg-slate-50 border-slate-200 opacity-40'
                        : checked || indeterminate
                            ? 'bg-blue-500 border-blue-500'
                            : 'bg-white border-slate-300 hover:border-blue-400'
                    }
                `}
            >
                {indeterminate ? (
                    <span className="w-2 h-[2px] bg-white rounded-full" />
                ) : checked ? (
                    <Check size={10} strokeWidth={4} className="text-white" />
                ) : null}
            </span>
        </label>
    );
}