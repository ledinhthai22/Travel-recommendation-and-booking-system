// CheckoutStep.jsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function CheckoutStep({ step, onBack }) {
    const steps = [
        { number: 1, label: 'Nhập thông tin' },
        { number: 2, label: 'Thanh toán' },
        { number: 3, label: 'Hoàn tất' },
    ];

    return (
        <div className="flex items-center my-6 w-full mt-20 px-4">
            <div className="w-full flex items-center gap-6">

                {/* NÚT QUAY LẠI */}
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-[#0EA5E5] font-medium text-[15px] transition-colors duration-200 shrink-0 self-start mt-2.5"
                >
                    <ArrowLeft size={18} />
                    <span>Quay lại</span>
                </button>

                {/* THANH TIẾN TRÌNH */}
                <div className="flex-1 relative">

                    {/* Line segment 1 */}
                    <div
                        className="absolute top-5 h-[2px] overflow-hidden"
                        style={{
                            left: 'calc(100% / 6)',
                            width: 'calc(100% / 3)',
                            background: 'rgba(100,116,139,0.25)',
                        }}
                    >
                        <div
                            className="h-full transition-all duration-500 ease-in-out"
                            style={{ width: step > 1 ? '100%' : '0%', background: '#0EA5E5' }}
                        />
                    </div>

                    {/* Line segment 2 */}
                    <div
                        className="absolute top-5 h-[2px] overflow-hidden"
                        style={{
                            left: 'calc(100% / 2)',
                            width: 'calc(100% / 3)',
                            background: 'rgba(100,116,139,0.25)',
                        }}
                    >
                        <div
                            className="h-full transition-all duration-500 ease-in-out"
                            style={{ width: step > 2 ? '100%' : '0%', background: '#0EA5E5' }}
                        />
                    </div>

                    <div className="grid grid-cols-3">
                        {steps.map((s) => {
                            const isActive = step === s.number;
                            const isDone   = step > s.number;

                            return (
                                <div key={s.number} className="flex flex-col items-center z-10">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-base font-medium transition-colors duration-300"
                                        style={{
                                            background: isActive || isDone ? '#0EA5E5' : '#62748E',
                                            color: '#fff',
                                        }}
                                    >
                                        {isDone ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" strokeWidth="2.5"
                                                strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        ) : s.number}
                                    </div>
                                    <p
                                        className="mt-3 text-[13px] font-normal tracking-wide whitespace-nowrap transition-colors duration-300"
                                        style={{ color: isActive ? '#0EA5E5' : '#62748E' }}
                                    >
                                        {s.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Spacer cân bằng với nút quay lại */}
                <div className="shrink-0 w-[90px]" />
            </div>
        </div>
    );
}