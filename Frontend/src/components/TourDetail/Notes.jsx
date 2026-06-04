import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function Notes() {
    const [openIndex, setOpenIndex] = useState(null);

    const notes = [
        {
            title: "Giá tour bao gồm",
            content:
                "Xe đưa đón theo chương trình, khách sạn tiêu chuẩn, các bữa ăn theo lịch trình, vé tham quan và bảo hiểm du lịch."
        },
        {
            title: "Giá tour không bao gồm",
            content:
                "Chi phí cá nhân, giặt ủi, điện thoại, đồ uống ngoài chương trình và các chi phí phát sinh khác."
        },
        {
            title: "Chính sách trẻ em",
            content:
                "Trẻ em dưới 2 tuổi miễn phí. Trẻ từ 2 đến dưới 12 tuổi áp dụng giá trẻ em. Từ 12 tuổi trở lên tính như người lớn."
        },
        {
            title: "Lưu ý khi tham gia tour",
            content:
                "Quý khách cần mang theo CCCD hoặc hộ chiếu còn hiệu lực. Có mặt tại điểm tập trung trước giờ khởi hành ít nhất 30 phút."
        }
    ];

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
                            <span className="font-semibold text-[16px] text-slate-800">
                                {note.title}
                            </span>

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
