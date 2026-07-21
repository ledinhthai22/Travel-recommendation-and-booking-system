import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useWebInfo } from "~/Hooks/useWebInfo";
export function Notes() {
    const [openIndex, setOpenIndex] = useState(null);
    const {webInfo} = useWebInfo()
    const notes = [
        {
            title: "Giá tour bao gồm",
            content: [
                "Xe tham quan theo chương trình",
                "Khách sạn 2–3 khách/phòng",
                "Khách sạn tương đương 3 sao hoặc 4 sao",
                "Vé tham quan theo chương trình",
                "Các bữa ăn chính tiêu chuẩn từ 110.000 – 130.000 VNĐ/bữa",
                "Hướng dẫn viên tiếng Việt suốt tuyến",
                "Bảo hiểm du lịch tối đa 120.000.000 VNĐ/vụ",
                "Nón Vietravel, nước suối, khăn lạnh",
                "Thuế VAT"
            ]
        },
        {
            title: "Giá tour không bao gồm",
            content: [
                "Chi phí cá nhân: ăn uống ngoài chương trình, giặt ủi, phụ thu phòng đơn",
                "Chi phí tham quan ngoài chương trình"
            ]
        },
        {
            title: "Lưu ý giá trẻ em",
            content: [
                "Dưới 5 tuổi: không thu phí dịch vụ",
                "Từ 5 đến dưới 12 tuổi: 50% giá dịch vụ, không giường riêng",
                "Từ 12 tuổi trở lên: tính như người lớn"
            ]
        },
        {
            title: "Điều kiện thanh toán",
            content: [
                "Khi đăng ký đặt cọc 50% số tiền tour.",
                "Thanh toán hết trước ngày khởi hành 7 ngày (tour ngày thường), trước ngày khởi hành 20 ngày (tour Lễ Tết).",
            ]
        },
        {
            title: "Lưu ý khi tham gia tour",
            content: [
                "Khi đăng ký vui lòng cung cấp giấy tờ tùy thân của tất cả hành khách: CCCD, Hộ chiếu hoặc Giấy khai sinh (đối với trẻ em dưới 14 tuổi).",
                "Khách quốc tịch Việt Nam: trẻ em dưới 14 tuổi mang Giấy khai sinh hoặc Hộ chiếu; từ 14 tuổi trở lên mang CCCD hoặc Hộ chiếu còn hiệu lực.",
                "Khách quốc tịch nước ngoài hoặc Việt kiều phải mang theo Hộ chiếu (Passport), thẻ xanh hoặc Visa còn hiệu lực theo quy định.",
                "Quý khách tập trung tại sân bay Tân Sơn Nhất trước giờ bay 2 tiếng vào ngày thường và 3 tiếng vào dịp lễ, tết.",
                "Hành lý xách tay tối đa 7kg/khách, kích thước không vượt quá 56cm x 36cm x 23cm; chất lỏng không quá 100ml.",
                "Hành lý ký gửi tối đa 20kg/khách, kích thước không vượt quá 119cm x 119cm x 81cm.",
                "Trường hợp cung cấp sai thông tin cá nhân hoặc đến trễ giờ bay, khách hàng phải tự thanh toán các chi phí đổi hoặc mua lại vé theo quy định hãng hàng không.",
                "Vé máy bay khuyến mãi không hoàn, không đổi, không hủy; sai tên sẽ mất 100% giá trị vé.",
                "Giờ bay, giá vé hoặc lịch trình có thể thay đổi do điều kiện khai thác của hãng hàng không hoặc các yếu tố khách quan.",
                "Trong các trường hợp bất khả kháng như thiên tai, dịch bệnh, an ninh hoặc sự cố hàng không, công ty có quyền điều chỉnh chương trình tham quan.",
                "Sau khi nhận thẻ lên máy bay, quý khách cần tự bảo quản và có mặt đúng giờ tại cửa khởi hành.",
                "Giờ nhận phòng khách sạn từ 14:00 và trả phòng trước 12:00 theo quy định chung.",
                "Phòng khách sạn có thể không cùng tầng hoặc không đúng loại giường theo yêu cầu do tình trạng thực tế.",
                "Nhóm 03 khách có thể được bố trí 01 giường lớn và 01 giường phụ (extra bed).",
                "Nếu có nhu cầu nâng hạng phòng, vui lòng liên hệ và thanh toán chi phí phát sinh theo quy định.",
                "Đối với các chương trình biển đảo, khách có tiền sử bệnh hoặc sử dụng chất kích thích không nên tham gia tắm biển hoặc lặn biển.",
                "Khách từ 70 tuổi trở lên phải có người thân dưới 55 tuổi đi cùng. Hạn chế nhận khách từ 80 tuổi trở lên.",
                "Khách mang thai cần thông báo khi đăng ký tour và tuân thủ các quy định của hãng hàng không.",
                "Mọi chi phí phát sinh liên quan đến sức khỏe ngoài phạm vi bảo hiểm sẽ do khách hàng tự chi trả.",
                "Nhu cầu xuất hóa đơn phải được thông báo khi đăng ký hoặc trước khi hoàn tất thanh toán.",
                "Quý khách vui lòng đọc kỹ chương trình tour, điều kiện hủy và các khoản bao gồm hoặc không bao gồm trước khi đăng ký."
            ]
        },
        {
            title: "Lưu ý về chuyển hoặc hủy tour",
            content: [
                "Quý khách chỉ có thể gửi yêu cầu hủy tour khi tour chưa kết thúc và chưa khởi hành quá 3 ngày; sau thời điểm này hệ thống sẽ không còn cho phép hủy đơn.",
                "Yêu cầu hủy tour được gửi và xử lý trực tiếp trên hệ thống. Sau khi xác nhận, đơn sẽ chuyển sang trạng thái Đã hủy và không thể khôi phục.",
                "Số tiền hoàn (nếu có) sẽ được hoàn về theo phương thức thanh toán ban đầu hoặc theo thỏa thuận với công ty, tùy vào thời điểm hủy so với ngày khởi hành.",
                "Quý khách vui lòng liên hệ nhân viên tư vấn nếu cần hỗ trợ thêm về thủ tục hủy tour."
            ]
        },
        {
            title: "Chính sách hoàn tiền khi hủy tour",
            content: [
                "Hủy trước ngày khởi hành từ 30 ngày trở lên: Hoàn 100% số tiền đã thanh toán.",
                "Hủy trước ngày khởi hành từ 15 - 29 ngày: Hoàn 70% số tiền đã thanh toán.",
                "Hủy trước ngày khởi hành từ 7 - 14 ngày: Hoàn 50% số tiền đã thanh toán.",
                "Hủy trước ngày khởi hành từ 3 - 6 ngày: Hoàn 30% số tiền đã thanh toán.",
                "Hủy trong vòng 3 ngày trước ngày khởi hành: Không hoàn tiền, mất toàn bộ số tiền đã thanh toán.",
                "Hủy sau khi tour đã khởi hành: Không hoàn tiền.",
                "Số ngày trước khởi hành được tính từ thời điểm hệ thống ghi nhận yêu cầu hủy đến ngày khởi hành của chuyến đi."
            ]
        },
        {
            title: "Trường hợp bất khả kháng",
            content: [
                "Trong trường hợp chương trình du lịch bị hủy hoặc thay đổi do các sự kiện bất khả kháng như hỏa hoạn, thời tiết xấu, tai nạn, thiên tai, chiến tranh, dịch bệnh hoặc thay đổi từ các phương tiện vận chuyển công cộng, công ty sẽ không chịu trách nhiệm bồi thường các tổn thất phát sinh.",
                "Các trường hợp hoãn, dời, hủy chuyến bay hoặc các sự kiện bất khả kháng khác theo quy định pháp luật cũng thuộc phạm vi miễn trừ trách nhiệm.",
                "Hai bên có trách nhiệm phối hợp và hỗ trợ lẫn nhau nhằm giảm thiểu tối đa các thiệt hại phát sinh do sự kiện bất khả kháng.",
                "Đối với các dịch vụ phải hoàn tiền do hủy tour vì lý do bất khả kháng, thời gian xử lý hoàn tiền dự kiến từ 60 đến 90 ngày tùy thuộc vào điều kiện của các đối tác cung cấp dịch vụ."
            ]
        },
        {
            title: "Thông tin liên hệ",
            content: [
                `Số điện thoại hỗ trợ: ${webInfo.so_dien_thoai} (hoạt động 24/7, miễn phí cước gọi).`,
                `Trụ sở chính: ${webInfo.dia_chi}`,
                "Quý khách vui lòng liên hệ tổng đài hoặc văn phòng để được tư vấn, hỗ trợ và giải đáp các thắc mắc liên quan đến chương trình du lịch."
            ]
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
                                className={`transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {openIndex === index && (
                            <div className="px-5 pb-4">
                                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                                    {note.content.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}