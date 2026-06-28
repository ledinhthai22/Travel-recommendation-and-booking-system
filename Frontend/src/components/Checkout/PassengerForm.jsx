import React from 'react';
import { User, Smile, Baby, Users } from 'lucide-react';

export default function PassengerForm({ passengers = { adults: 1, children: 0, toddlers: 0 }, onChange }) {
    const handleChange = (type, value) => {
        if (type === 'adults') onChange(type, Math.max(1, value));
        else onChange(type, Math.max(0, value));
    };

    const configs = [
        { 
            key: 'adults',  
            label: 'Người lớn', 
            desc: 'Từ 12 tuổi trở lên', 
            iconBg: 'bg-blue-50',   
            iconColor: 'text-blue-500',   
            icon: User 
        },
        { 
            key: 'children', 
            label: 'Trẻ em',    
            desc: 'Từ 5 – 11 tuổi',     
            iconBg: 'bg-green-50',  
            iconColor: 'text-green-500',  
            icon: Smile 
        },
        { 
            key: 'toddlers', 
            label: 'Trẻ nhỏ',   
            desc: 'Từ 2 – 4 tuổi',      
            iconBg: 'bg-amber-50',  
            iconColor: 'text-amber-500', 
            icon: Baby 
        },
    ];

    const total = passengers.adults + passengers.children + passengers.toddlers;

    return (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-5 text-slate-900">Hành khách</h2>

            <div className="space-y-2">
                {configs.map(({ key, label, desc, iconBg, iconColor, icon: IconComponent }) => (
                    <div
                        key={key}
                        className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
                    >

                        <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
                                <IconComponent className={`w-5 h-5 ${iconColor}`} strokeWidth={2.2} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">{label}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                            </div>
                        </div>

   
                        <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden">
                            <button
                                type="button"
                                onClick={() => handleChange(key, passengers[key] - 1)}
                                disabled={key === 'adults' ? passengers.adults <= 1 : passengers[key] <= 0}
                                className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:text-slate-200 disabled:cursor-not-allowed transition-colors text-lg"
                            >
                                −
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-slate-800 border-x border-slate-200">
                                {passengers[key]}
                            </span>
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

            <div className="mt-4 flex items-center gap-2 px-4 py-3 bg-sky-50 border border-sky-100 rounded-2xl">
                <Users className="w-4 h-4 text-sky-500" strokeWidth={2.2} />
                <span className="text-sm font-medium text-sky-700">Tổng cộng</span>
                <span className="ml-auto text-sm font-semibold text-sky-700 bg-sky-100 px-3 py-0.5 rounded-full">
                    {total} hành khách
                </span>
            </div>
        </div>
    );
}