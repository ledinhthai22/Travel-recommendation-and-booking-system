import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function Notes({ notes }) {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div>
            <h2 className="mb-4 text-[24px] font-bold text-slate-800">
                Những điều cần chú ý
            </h2>

            <div className="rounded-2xl border border-slate-200 bg-white">
                {notes.map((note, index) => (
                    <div
                        key={index}
                        className="border-b border-slate-200 last:border-b-0 p-2"
                    >
                        <button
                            onClick={() => handleToggle(index)}
                            className="flex w-full items-center justify-between px-5 py-4 text-left"
                        >
                            <div className="flex items-center gap-3">
                                <span className="font-semibold text-[16px] text-slate-800">
                                    {note.title}
                                </span>
                            </div>

                            <ChevronDown
                                size={18}
                                className={`transition-transform duration-200 ${
                                    openIndex === index ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {openIndex === index && (
                            <div className="px-5 pb-4 text-sm text-slate-600">
                                {note.content}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}