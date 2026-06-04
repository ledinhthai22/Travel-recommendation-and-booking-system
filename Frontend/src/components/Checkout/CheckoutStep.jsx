import React from 'react';

export default function CheckoutStep({ step }) {
    const steps = [
        { number: 1, label: 'Nhập thông tin' },
        { number: 2, label: 'Thanh toán' },
        { number: 3, label: 'Hoàn tất' },
    ];

    return (
        <div className="flex justify-center my-6 w-full mt-20">
            <div className="w-full max-w-2xl relative">

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

                {/* Grid */}
                <div className="grid grid-cols-3">
                    {steps.map((s) => {
                        const isActive  = step === s.number;
                        const isDone    = step > s.number;

                        const circleBg     = isActive ? '#0EA5E5' : isDone ? '#0EA5E5' : '#62748E';
                        const circleColor  = isActive || isDone ? '#fff' : '#fff';
                        // const circleBorder = isActive ? '#0EA5E5' : '#0EA5E5';
                        const labelColor   = isActive ? '#0EA5E5' : '#62748E';

                        return (
                            <div key={s.number} className="flex flex-col items-center z-10">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-base font-medium transition-colors duration-300"
                                    style={{
                                        background: circleBg,
                                        color: circleColor,
                                       
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
                                    style={{ color: labelColor }}
                                >
                                    {s.label}
                                </p>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}