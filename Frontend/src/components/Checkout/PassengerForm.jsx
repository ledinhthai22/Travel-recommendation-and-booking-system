import React, { useState, useCallback } from 'react';

export default function PassengerForm({ passengers = { adults: 1, children: 0, toddlers: 0 }, onChange }) {
    const [inputValues, setInputValues] = useState({
        adults: passengers.adults.toString(),
        children: passengers.children.toString(),
        toddlers: passengers.toddlers.toString(),
    });

    const handleChange = useCallback((type, value) => {
        if (type === 'adults') {
            const newValue = Math.max(1, value);
            onChange(type, newValue);
            setInputValues(prev => ({ ...prev, [type]: newValue.toString() }));
        } else {
            const newValue = Math.max(0, value);
            onChange(type, newValue);
            setInputValues(prev => ({ ...prev, [type]: newValue.toString() }));
        }
    }, [onChange]);

    const handleInputBlur = useCallback((type, value) => {
        const numValue = parseInt(value) || 0;
        
        if (type === 'adults') {
            const newValue = Math.max(1, numValue);
            onChange(type, newValue);
            setInputValues(prev => ({ ...prev, [type]: newValue.toString() }));
        } else {
            const newValue = Math.max(0, numValue);
            onChange(type, newValue);
            setInputValues(prev => ({ ...prev, [type]: newValue.toString() }));
        }
    }, [onChange]);

    const configs = [
        { 
            key: 'adults',  
            label: 'Người lớn', 
            desc: 'Từ 12 tuổi trở lên', 
            iconBg: 'bg-blue-50',   
            iconColor: 'text-blue-500',   
           
            min: 1,
        },
        { 
            key: 'children', 
            label: 'Trẻ em',    
            desc: 'Từ 5 – 11 tuổi',     
            iconBg: 'bg-green-50',  
            iconColor: 'text-green-500',  

            min: 0,
        },
        { 
            key: 'toddlers', 
            label: 'Trẻ nhỏ',   
            desc: 'Từ 2 – 4 tuổi',      
            iconBg: 'bg-amber-50',  
            iconColor: 'text-amber-500', 

            min: 0,
        },
    ];

    const total = passengers.adults + passengers.children + passengers.toddlers;

    return (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <style jsx>{`
                input[type=number]::-webkit-inner-spin-button,
                input[type=number]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type=number] {
                    -moz-appearance: textfield;
                }
            `}</style>

            <h2 className="text-xl font-bold mb-5 text-slate-900">Hành khách</h2>

            <div className="space-y-2">
                {configs.map(({ key, label, desc, iconBg, iconColor, char, min }) => (
                    <div
                        key={key}
                        className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                           
                            <div>
                                <p className="text-sm font-semibold text-slate-800">{label}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                            </div>
                        </div>

                        <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden">
                            <button
                                type="button"
                                onClick={() => handleChange(key, passengers[key] - 1)}
                                disabled={passengers[key] <= min}
                                className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:text-slate-200 disabled:cursor-not-allowed transition-colors text-lg"
                            >
                                −
                            </button>
                            
                            <input
                                type="number"
                                min={min}
                                value={inputValues[key]}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setInputValues(prev => ({ ...prev, [key]: val }));
                                }}
                                onBlur={(e) => handleInputBlur(key, e.target.value)}
                                onFocus={(e) => e.target.select()}
                                className="w-12 text-center text-sm font-semibold text-slate-800 border-x border-slate-200 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-inset [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            
                            <button
                                type="button"
                                onClick={() => handleChange(key, passengers[key] + 1)}
                                className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors text-lg"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Thanh tổng cộng giữ nguyên cấu trúc cũ nhưng không hiển thị icon */}
            <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-sky-50 border border-sky-100 rounded-2xl">
                <span className="text-sm font-semibold text-sky-700">Tổng cộng</span>
                <span className="ml-auto text-sm font-semibold text-sky-700 bg-sky-100 px-3 py-0.5 rounded-full">
                    {total} hành khách
                </span>
            </div>
        </div>
    );
}