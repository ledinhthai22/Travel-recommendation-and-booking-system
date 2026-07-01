using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using travel_recommendation_and_booking_system.DTOs.TourBooking;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services.PdfBuilders
{
    public static class ContractPdfBuilder
    {
        private static string FormatPrice(decimal price)
        {
            return price.ToString("#,##0", System.Globalization.CultureInfo.InvariantCulture)
                        .Replace(",", ".");
        }

        public static byte[] GenerateContractsPdf(List<TourBookingDetailDTO> details)
        {
            // Sắp theo ngày đặt đơn, sớm nhất đến trễ nhất
            var sorted = details.OrderBy(d => d.NgayDat).ToList();

            var document = Document.Create(container =>
            {
                // Trang 1: danh sách điểm danh tổng hợp
                BuildAttendanceList(container, sorted);

                // Các trang sau: từng hợp đồng chi tiết
                foreach (var detail in sorted)
                {
                    container.Page(page =>
                    {
                        page.Size(PageSizes.A4);
                        page.Margin(40);
                        page.DefaultTextStyle(x => x.FontSize(11).FontFamily("Times New Roman"));

                        // Không dùng page.Header() vì sẽ bị lặp lại quốc hiệu/tiêu đề
                        // ở mọi trang khi nội dung hợp đồng tràn hơn 1 trang.
                        // Quốc hiệu/tiêu đề được đưa vào đầu Content, chỉ in 1 lần.
                        page.Content().Element(c => BuildBody(c, detail));
                        // Không đánh số trang (đã bỏ page.Footer()).
                    });
                }
            });

            return document.GeneratePdf();
        }

        private static void BuildAttendanceList(IDocumentContainer container, List<TourBookingDetailDTO> details)
        {
            if (!details.Any()) return;

            var chuyen = details[0].Chuyen;

            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.DefaultTextStyle(x => x.FontSize(11).FontFamily("Times New Roman"));

                page.Content().Column(col =>
                {
                    col.Spacing(10);

                    col.Item().AlignCenter().Text("DANH SÁCH ĐIỂM DANH").FontSize(18).Bold();
                    col.Item().AlignCenter().Text($"Chuyến: {chuyen.MaChuyenCode}");
                    col.Item().AlignCenter().Text(
                        $"Khởi hành: {chuyen.NgayKhoiHanh:dd/MM/yyyy}   |   Lộ trình: {chuyen.DiemKhoiHanh} → {chuyen.DiemDen}");

                    col.Item().PaddingTop(15).Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.ConstantColumn(30);
                            c.RelativeColumn(2.5f);
                            c.RelativeColumn(2);
                            c.RelativeColumn(1.5f);
                            c.RelativeColumn(1.5f);
                            c.ConstantColumn(60);
                        });

                        table.Header(h =>
                        {
                            h.Cell().Border(1).Padding(4).Text("#").Bold();
                            h.Cell().Border(1).Padding(4).Text("Khách hàng").Bold();
                            h.Cell().Border(1).Padding(4).Text("SĐT").Bold();
                            h.Cell().Border(1).Padding(4).Text("Ngày đặt").Bold();
                            h.Cell().Border(1).Padding(4).Text("Số khách").Bold();
                            h.Cell().Border(1).Padding(4).Text("Có mặt").Bold();
                        });

                        int i = 1;
                        foreach (var d in details)
                        {
                            int soKhach = d.SoNguoiLon + d.SoTreEm + d.SoEmBe;
                            table.Cell().Border(1).Padding(4).Text(i.ToString());
                            table.Cell().Border(1).Padding(4).Text(d.TenNguoiDat);
                            table.Cell().Border(1).Padding(4).Text(d.SoDienThoai);
                            table.Cell().Border(1).Padding(4).Text(d.NgayDat.ToString("dd/MM/yyyy"));
                            table.Cell().Border(1).Padding(4).Text(soKhach.ToString());
                            table.Cell().Border(1).Padding(4).Height(22).Text("");
                            i++;
                        }
                    });

                    col.Item().PaddingTop(10).Text(
                        $"Tổng số đơn: {details.Count}   |   Tổng khách: {details.Sum(d => d.SoNguoiLon + d.SoTreEm + d.SoEmBe)}");
                });
            });
        }

        private static void BuildBody(IContainer container, TourBookingDetailDTO d)
        {
            container.Column(col =>
            {
                col.Spacing(6);

                //Quốc hiệu và tiêu đề
                col.Item().AlignCenter().Text("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM").Bold().FontSize(13);
                col.Item().AlignCenter().Text("Độc lập - Tự do - Hạnh phúc").Bold().FontSize(12);
                col.Item().AlignCenter().PaddingTop(2).Text("───────────").FontSize(10);

                col.Item().PaddingTop(10).AlignCenter()
                    .Text("HỢP ĐỒNG DỊCH VỤ LỮ HÀNH TRỌN GÓI").Bold().FontSize(16);
                col.Item().AlignCenter()
                    .Text($"(Số: {d.MaDatCho}/HĐDL-{DateTime.Now.Year})").FontSize(10).Italic();

                int tongKhach = d.SoNguoiLon + d.SoTreEm + d.SoEmBe;
                decimal giaTrungBinh = tongKhach > 0 ? Math.Round(d.TongTien / tongKhach) : 0;

                col.Item().PaddingTop(8).Text(
                    $"Hôm nay, ngày {d.NgayDat.Day} tháng {d.NgayDat.Month} năm {d.NgayDat.Year}, tại ...................................., chúng tôi gồm có:");
                // khách hàng
                col.Item().PaddingTop(8).Text("BÊN A: KHÁCH HÀNG (BÊN MUA DỊCH VỤ)").Bold().FontSize(12);
                col.Item().Text($"Đại diện/Cá nhân: {d.TenNguoiDat}");
                col.Item().Text("Số CMND/CCCD/Passport: ..................................................Ngày cấp: .......... Nơi cấp: ..........");
                col.Item().Text("Địa chỉ: ............................................................................");
                col.Item().Text($"Điện thoại: {d.SoDienThoai}        Email: {d.Email}");

                // đơn vị lữ hành
                col.Item().PaddingTop(8).Text("BÊN B: ĐƠN VỊ LỮ HÀNH (BÊN CUNG CẤP DỊCH VỤ)").Bold().FontSize(12);
                col.Item().Text("Tên đơn vị: ............................................................................");
                col.Item().Text("Địa chỉ: ............................................................................");
                col.Item().Text("Mã số thuế: ........................   Điện thoại: ........................");
                col.Item().Text($"Người đại diện: {d.NhanVienDuyet ?? "........................"}    Chức vụ: ................");

                //điều khoản 1
                col.Item().PaddingTop(10).Text("ĐIỀU 1: NỘI DUNG DỊCH VỤ (CHƯƠNG TRÌNH TOUR)").Bold().FontSize(12);
                col.Item().Text("Bên B cam kết tổ chức cho Bên A chương trình du lịch trọn gói với các chi tiết sau:");
                col.Item().Text($"Tên chương trình tour: {d.Tour.TenTour}");
                col.Item().Text($"Lộ trình: {d.Chuyen.DiemKhoiHanh} → {d.Chuyen.DiemDen}");
                col.Item().Text(
                    $"Thời gian: Từ ngày {d.Chuyen.NgayKhoiHanh:dd/MM/yyyy} đến ngày {d.Chuyen.NgayKetThuc:dd/MM/yyyy}");
                col.Item().Text($"Số lượng khách: {d.SoNguoiLon} Người lớn, {d.SoTreEm} Trẻ em, {d.SoEmBe} Em bé.");
                if (!string.IsNullOrEmpty(d.Chuyen.TenHuongDanVien))
                    col.Item().Text($"Hướng dẫn viên phụ trách: {d.Chuyen.TenHuongDanVien}");
                col.Item().Text(
                    "(Chi tiết về phương tiện di chuyển, khách sạn, lịch trình tham quan cụ thể được đính kèm theo Phụ lục 01 của hợp đồng này).");

                // danh sách hành khách đính kèm ở đầu
                col.Item().PaddingTop(8).Text("DANH SÁCH HÀNH KHÁCH").Bold().FontSize(11).Italic();
                col.Item().Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.ConstantColumn(25);
                        c.RelativeColumn(3);
                        c.RelativeColumn(2);
                        c.RelativeColumn(1.5f);
                        c.RelativeColumn(1.5f);
                    });

                    table.Header(h =>
                    {
                        h.Cell().Border(1).Padding(3).Text("#").Bold();
                        h.Cell().Border(1).Padding(3).Text("Họ tên").Bold();
                        h.Cell().Border(1).Padding(3).Text("Ngày sinh").Bold();
                        h.Cell().Border(1).Padding(3).Text("Loại khách").Bold();
                        h.Cell().Border(1).Padding(3).Text("Phòng đơn").Bold();
                    });

                    int i = 1;
                    foreach (var k in d.DanhSachHanhKhach)
                    {
                        string loai = k.LoaiKhach == 1 ? "Người lớn" : k.LoaiKhach == 2 ? "Trẻ em" : "Em bé";
                        table.Cell().Border(1).Padding(3).Text(i.ToString());
                        table.Cell().Border(1).Padding(3).Text(k.HoTen);
                        table.Cell().Border(1).Padding(3).Text(k.NgaySinh.ToString("dd/MM/yyyy"));
                        table.Cell().Border(1).Padding(3).Text(loai);
                        table.Cell().Border(1).Padding(3).Text(k.PhongDon ? "Có" : "Không");
                        i++;
                    }
                });
                // điều khoản số 4
                col.Item().PaddingTop(10).Text("ĐIỀU 2: GIÁ TRỊ HỢP ĐỒNG VÀ PHƯƠNG THỨC THANH TOÁN").Bold().FontSize(12);
                col.Item().Text("1. Tổng giá trị hợp đồng:").Bold();
                col.Item().Text($"Giá tour/khách (trung bình): {FormatPrice(giaTrungBinh)} VNĐ/khách.");
                col.Item().Text($"Tổng cộng: {FormatPrice(d.TongTien)} VNĐ (Bằng chữ: .................................................).");
                col.Item().Text("Giá trên đã bao gồm thuế VAT, bảo hiểm du lịch, các chi phí quy định trong chương trình.");

                col.Item().PaddingTop(4).Text("2. Phương thức và tiến độ thanh toán:").Bold();
                col.Item().Text("Đợt 1: Bên A đặt cọc ......% tổng giá trị hợp đồng (tương đương: .............. VNĐ) ngay sau khi ký hợp đồng.");
                col.Item().Text("Đợt 2: Bên A thanh toán số tiền còn lại trước ngày khởi hành ...... ngày.");
                col.Item().Text(
                    $"Hình thức thanh toán: {(string.IsNullOrEmpty(d.ThongTinThanhToan?.TenPhuongThuc) ? "Tiền mặt hoặc Chuyển khoản ngân hàng" : d.ThongTinThanhToan.TenPhuongThuc)}.");
                col.Item().Text(
                    $"Trạng thái thanh toán hiện tại: {(d.TrangThaiThanhToan == 1 ? "Đã thanh toán đủ" : "Chưa thanh toán đủ")}.");

                // điều khoản số 3
                col.Item().PaddingTop(10).Text("ĐIỀU 3: ĐIỀU KHOẢN HOÃN, HỦY TOUR").Bold().FontSize(12);
                col.Item().Text("Hủy do Bên A:").Bold();
                col.Item().Text("Hủy trước ngày khởi hành ...... ngày: Phạt ......% tổng giá trị tour.");
                col.Item().Text("Hủy trước ngày khởi hành ...... ngày: Phạt ......% tổng giá trị tour.");
                col.Item().Text(
                    "Hủy do Bên B: Nếu Bên B không tổ chức được chuyến đi theo đúng lịch trình (trừ lý do bất khả kháng), Bên B phải hoàn trả toàn bộ tiền cọc và bồi thường ......% giá trị tour cho Bên A.");
                col.Item().Text(
                    "Trường hợp bất khả kháng: (Thiên tai, dịch bệnh, chiến tranh, hoãn/hủy chuyến bay từ hãng hàng không...): Hai bên cùng thương lượng để dời ngày hoặc hoàn trả chi phí thực tế chưa chi tiêu.");

                // điều khoản số 4
                col.Item().PaddingTop(10).Text("ĐIỀU 4: QUYỀN VÀ NGHĨA VỤ CỦA CÁC BÊN").Bold().FontSize(12);
                col.Item().Text(
                    "Bên A: Có trách nhiệm cung cấp đầy đủ, chính xác thông tin cá nhân (CCCD/Passport), có mặt đúng giờ quy định và tuân thủ pháp luật tại điểm đến.");
                col.Item().Text(
                    "Bên B: Có trách nhiệm thực hiện đúng và đầy đủ các dịch vụ theo chương trình đã cam kết (xe, phòng, ăn uống, hướng dẫn viên); mua bảo hiểm du lịch cho khách suốt tuyến.");

                // điều khoản số 5
                col.Item().PaddingTop(10).Text("ĐIỀU 5: ĐIỀU KHOẢN CHUNG").Bold().FontSize(12);
                col.Item().Text(
                    "Hai bên cam kết thực hiện đúng các điều khoản trong hợp đồng. Mọi thay đổi phải được thông báo bằng văn bản và có sự đồng ý của cả hai bên.");
                col.Item().Text(
                    "Hợp đồng này được lập thành 02 (hai) bản có giá trị pháp lý như nhau, mỗi bên giữ 01 (một) bản và có hiệu lực kể từ ngày ký.");

                // phần ký tên
                col.Item().PaddingTop(25).Row(row =>
                {
                    row.RelativeItem().AlignCenter().Column(c =>
                    {
                        c.Item().Text("ĐẠI DIỆN BÊN A").Bold();
                        c.Item().Text("(Ký, ghi rõ họ tên)").FontSize(9).Italic();
                        c.Item().Height(70);
                    });
                    row.RelativeItem().AlignCenter().Column(c =>
                    {
                        c.Item().Text("ĐẠI DIỆN BÊN B").Bold();
                        c.Item().Text("(Ký, đóng dấu, ghi rõ họ tên)").FontSize(9).Italic();
                        c.Item().Height(70);
                    });
                });
            });
        }
    }
}