import { MapPin, Calendar, Compass, ChevronDown, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const tripTypes = ['Nghỉ dưỡng cao cấp', 'Mạo hiểm tận cùng thế giới', 'Văn hóa đỉnh cao'];

export default function HeroSection({
    title,
    subtitle,
    background,
    stats = [],
    showSearchBar = false,
}) {
    const [type, setType] = useState(tripTypes[0]);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (!ref.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <section className="relative h-[548px] min-h-[600px] flex items-center mt-16 justify-center overflow-hidden">
            <div className="absolute inset-0 scale-105 ">
                <img src={background} className="w-full h-full object-cover" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
            <div className="relative z-10 w-full max-w-7xl  text-center text-white">
                
                <h1 className="text-[45px] md:text-4xl font-bold mb-2">{title}</h1>
                <p className="text-white text-base md:text-lg max-w-xl mx-auto mb-8">
                    {subtitle}
                </p>

                {showSearchBar && (
                    <div className="bg-white/95 backdrop-blur-md p-2  rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 text-black max-w-8xl mx-auto translate-y-4">

                        {/* Location Input */}
                        <div className="group flex items-center gap-3 flex-[1.5] hover:bg-gray-50 rounded-xl px-4 py-3 transition-all">
                            <MapPin className="text-[#0EA5E5] group-hover:scale-110 transition-transform" size={22} />
                            <div className="flex flex-col items-start w-full">
                                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Điểm đến</span>
                                <input
                                    placeholder="Bạn muốn đi đâu?"
                                    className="bg-transparent outline-none w-full text-base font-medium placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="hidden md:block w-[1px] bg-gray-200 my-2" />

                        {/* Start Date */}
                        <div className="group flex items-center gap-3 flex-1 hover:bg-gray-50 rounded-xl px-4 py-3 transition-all">
                            <Calendar className="text-[#0EA5E5] group-hover:scale-110 transition-transform" size={22} />
                            <div className="flex flex-col items-start w-full">
                                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                                    Ngày đi
                                </span>
                                <input
                                    type="date"
                                    className="bg-transparent outline-none w-full text-sm font-medium cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="hidden md:block w-[1px] bg-gray-200 my-2" />

                        {/* End Date */}
                        <div className="group flex items-center gap-3 flex-1 hover:bg-gray-50 rounded-xl px-4 py-3 transition-all">
                            <Calendar className="text-[#0EA5E5] group-hover:scale-110 transition-transform" size={22} />
                            <div className="flex flex-col items-start w-full">
                                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                                    Ngày về
                                </span>
                                <input
                                    type="date"
                                    className="bg-transparent outline-none w-full text-sm font-medium cursor-pointer"
                                />
                            </div>
                        </div>


                        {/* Search Button */}
                        <button className="bg-[#0EA5E5] hover:bg-[#0284c7] text-white px-8 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-95 group">
                            <Search size={15} className="group-hover:rotate-12 transition-transform" />
                            <span>Tìm ngay</span>
                        </button>
                    </div>
                )}
            </div>
            {/* {stats.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex justify-center gap-8">
                        {stats.map(s => (
                            <div key={s.label} className="text-center text-white">
                                <p className="font-bold">{s.value}</p>
                                <p className="text-sm">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )} */}
        </section>
    );
}