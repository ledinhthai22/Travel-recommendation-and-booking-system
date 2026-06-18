import { forwardRef, useState, useEffect, useRef } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { MapPin, Calendar, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DateInput = forwardRef((props, ref) => (
    <input
        {...props}
        ref={ref}
        readOnly
        className="bg-transparent outline-none w-full text-sm font-medium cursor-pointer placeholder:text-gray-400"
    />
));
DateInput.displayName = "DateInput";

export default function HeroSection({
    title,
    subtitle,
    background,
    stats = [],
    link,
    showSearchBar = false,
}) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const navigate = useNavigate();

    const handleBannerClick = () => {
        console.log(link);

        if (!link) return;

        if (link.startsWith("http")) {
            window.open(link, "_blank");
            return;
        }

        navigate(link);
    };
    const handleStartDateChange = (date) => {
        setStartDate(date);
        if (endDate && date > endDate) setEndDate(null);
    };

    return (
        <section
            onClick={handleBannerClick}
            className={`relative h-[650px] min-h-[600px] flex items-center mt-16 justify-center overflow-hidden   ${link ? " cursor-pointer" : ""}`}
        >
            <div className="absolute inset-0 scale-105">
                <img src={background} className="w-full h-full object-cover" alt="" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70" />

            <div className="relative z-10 w-full max-w-7xl text-center text-white ">
                <h1 className="text-[45px] md:text-4xl font-bold mb-2 mt-0 uppercase">{title}</h1>
                <p className="text-white text-base md:text-lg max-w-xl mx-auto mb-8">{subtitle}</p>

                {showSearchBar && (
                    <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 text-black max-w-8xl mx-auto translate-y-4">

                        {/* Điểm đến */}
                        <div className="group flex items-center gap-3 flex-[1.5] hover:bg-gray-50 rounded-xl px-4 py-3 transition-all">
                            <MapPin className="text-[#0EA5E5] group-hover:scale-110 transition-transform shrink-0" size={22} />
                            <div className="flex flex-col items-start w-full">
                                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Điểm đến</span>
                                <input
                                    placeholder="Bạn muốn đi đâu?"
                                    className="bg-transparent outline-none w-full text-sm font-medium placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="hidden md:block w-[1px] bg-gray-200 my-2" />

                        {/* Ngày đi */}
                        <div className="group flex items-center gap-3 flex-1 hover:bg-gray-50 rounded-xl px-4 py-3 transition-all">
                            <Calendar className="text-[#0EA5E5] group-hover:scale-110 transition-transform shrink-0" size={22} />
                            <div className="flex flex-col items-start w-full min-w-0">
                                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Ngày đi</span>
                                <DatePicker
                                    selected={startDate}
                                    onChange={handleStartDateChange}
                                    dateFormat="dd/MM/yyyy"
                                    locale={vi}
                                    minDate={new Date()}
                                    placeholderText="Chọn ngày đi"
                                    popperPlacement="bottom-start"
                                    customInput={<DateInput />}
                                />
                            </div>
                        </div>

                        <div className="hidden md:block w-[1px] bg-gray-200 my-2" />

                        {/* Ngày về */}
                        <div className="group flex items-center gap-3 flex-1 hover:bg-gray-50 rounded-xl px-4 py-3 transition-all">
                            <Calendar className="text-[#0EA5E5] group-hover:scale-110 transition-transform shrink-0" size={22} />
                            <div className="flex flex-col items-start w-full min-w-0">
                                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Ngày về</span>
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    locale={vi}
                                    minDate={startDate || new Date()}
                                    placeholderText="Chọn ngày về"
                                    popperPlacement="bottom-start"
                                    disabled={!startDate}
                                    customInput={<DateInput />}
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
        </section >
    );
}