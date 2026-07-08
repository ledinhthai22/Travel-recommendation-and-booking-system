import { useState } from 'react';
import DatePicker from '../UI/Form/DatePicker';
import { MapPin, Calendar, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection({
    title,
    subtitle,
    background,
    stats = [],
    link,
    showSearchBar = false,
}) {

    const [diemDen, setDiemDen] = useState(""); 
    const [startDate, setStartDate] = useState(""); 
    const [endDate, setEndDate] = useState("");

    const navigate = useNavigate();

    const handleBannerClick = () => {
        if (!link) return;
        if (link.startsWith("http")) {
            window.open(link, "_blank");
            return;
        }
        navigate(link);
    };

    const handleStartDateChange = (dateStr) => {
        setStartDate(dateStr);
        if (endDate && new Date(dateStr) > new Date(endDate)) {
            setEndDate("");
        }
    };


    const handleSearch = (e) => {
        e.stopPropagation();
        
        const params = new URLSearchParams();
        if (diemDen.trim()) params.append("diemDen", diemDen.trim());
        if (startDate) params.append("ngayDi", startDate);
        if (endDate) params.append("ngayVe", endDate);


        navigate(`/Tim-kiem?${params.toString()}`);
    };

    return (
        <section className="relative h-[650px] min-h-[600px] flex items-center justify-center mt-16 overflow-hidden">

            <div
                className={`absolute inset-0 z-0 ${link ? "cursor-pointer" : ""}`}
                onClick={handleBannerClick}
            >
                <img src={background} alt={title} className="w-full h-full object-cover scale-105" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70" />
            </div>


            <div className="relative z-10 w-full max-w-6xl px-4 text-center text-white -translate-y-7">
                <h1 className="text-[45px] md:text-5xl font-bold uppercase mb-3">{title}</h1>
                <p className="text-base md:text-lg max-w-5xl mx-auto mb-8">{subtitle}</p>

                {showSearchBar && (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 text-black max-w-7xl mx-auto translate-y-4"
                    >
                        {/* Điểm đến */}
                        <div className="group flex items-center gap-3 flex-[1.5] hover:bg-gray-50 rounded-xl px-4 py-3 transition-all">
                            <MapPin className="text-[#0EA5E5] group-hover:scale-110 transition-transform shrink-0" size={22} />
                            <div className="flex flex-col items-start w-full">
                                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Điểm đến</span>
                                <input
                                    type="text"
                                    value={diemDen}
                                    onChange={(e) => setDiemDen(e.target.value)} 
                                    placeholder="Bạn muốn đi đâu?"
                                    className="bg-transparent outline-none w-full text-sm font-medium placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <div className="hidden md:block w-px bg-gray-200 my-2" />

                        {/* Ngày đi */}
                        <div className="group flex items-center gap-3 flex-1 hover:bg-gray-50 rounded-xl px-2 py-1 transition-all">
                            <div className="w-full text-left custom-search-datepicker">
                                <DatePicker
                                    label="Ngày đi"
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    placeholderText="Chọn ngày đi"
                                    minDate={new Date()}
                                    Icon={Calendar}
                                />
                            </div>
                        </div>

                        <div className="hidden md:block w-px bg-gray-200 my-2" />

                        {/* Ngày về */}
                        {/* <div className="group flex items-center gap-3 flex-1 hover:bg-gray-50 rounded-xl px-2 py-1 transition-all">
                            <div className="w-full text-left custom-search-datepicker">
                                <DatePicker
                                    label="Ngày về"
                                    value={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    placeholderText="Chọn ngày về"
                                    minDate={startDate ? new Date(startDate) : new Date()}
                                    disabled={!startDate}
                                    Icon={Calendar}
                                />
                            </div>
                        </div> */}

                        {/* Nút Tìm ngay kích hoạt luồng */}
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="bg-[#0EA5E5] hover:bg-[#0284c7] text-white px-8 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-95 group self-stretch md:self-auto"
                        >
                            <Search size={15} className="group-hover:rotate-12 transition-transform" />
                            <span>Tìm ngay</span>
                        </button>
                    </div>
                )}
            </div>
            
            <style>{`
                .custom-search-datepicker border { border: none !important; }
                .custom-search-datepicker .relative.flex { gap: 0px !important; }
                .custom-search-datepicker input {
                    border: none !important;
                    background: transparent !important;
                    padding-top: 0px !important;
                    padding-bottom: 0px !important;
                    padding-left: 24px !important;
                }
                .custom-search-datepicker span.absolute { left: 0px !important; }
            `}</style>
        </section>
    );
}