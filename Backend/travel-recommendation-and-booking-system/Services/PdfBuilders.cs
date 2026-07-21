using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using travel_recommendation_and_booking_system.Constants;
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

        private static string GetFinancialStatusName(int status)
        {
            return BookingConstants.GetFinancialStatusName(status);
        }

        private static string GetPaymentTypeName(int type)
        {
            return BookingConstants.GetPaymentTypeName(type);
        }

        private static string GetPaymentStatusName(int status)
        {
            return BookingConstants.GetPaymentStatusName(status);
        }

        public static byte[] GenerateContractsPdf(List<TourBookingDetailDTO> details)
        {
            var sorted = details.OrderBy(d => d.NgayDat).ToList();

            var document = Document.Create(container =>
            {
                BuildAttendanceList(container, sorted);

                foreach (var detail in sorted)
                {
                    container.Page(page =>
                    {
                        page.Size(PageSizes.A4);
                        page.Margin(40);
                        page.DefaultTextStyle(x => x.FontSize(11).FontFamily("Times New Roman"));

                        page.Content().Element(c => BuildBody(c, detail));
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

                col.Item().PaddingTop(8).Text("BÊN A: KHÁCH HÀNG (BÊN MUA DỊCH VỤ)").Bold().FontSize(12);
                col.Item().Text($"Đại diện/Cá nhân: {d.TenNguoiDat}");
                col.Item().Text("Số CMND/CCCD/Passport: ..................................................Ngày cấp: .......... Nơi cấp: ..........");
                col.Item().Text($"Địa chỉ: {d.DiaChi}");
                col.Item().Text($"Điện thoại: {d.SoDienThoai}        Email: {d.Email}");

                col.Item().PaddingTop(8)
                .Text("BÊN B: ĐƠN VỊ LỮ HÀNH (BÊN CUNG CẤP DỊCH VỤ)")
                .Bold()
                .FontSize(12);

                col.Item().Text("Tên đơn vị: CÔNG TY TNHH DU LỊCH LỐI RIÊNG TRAVEL");
                col.Item().Text("Tên giao dịch: LOI RIENG TRAVEL CO., LTD");
                col.Item().Text("Địa chỉ trụ sở: 65 Huỳnh Thúc Kháng,phường Sài Gòn, TP. Hồ Chí Minh");
                col.Item().Text("Mã số doanh nghiệp/MST: 0312345678");
                col.Item().Text("Giấy phép kinh doanh lữ hành nội địa: 79-1234/2025/TCDL-GPLH");
                col.Item().Text("Điện thoại: (028) 3822 9999");
                col.Item().Text("Email: info@loiriengtravel.vn");
                col.Item().Text("Website: www.loiriengtravel.vn");
                col.Item().Text($"Người đại diện: {"Trần Quốc Tuấn"}");
                col.Item().Text("Chức vụ: Giám đốc");

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
                        table.Cell().Border(1).Padding(3).Text(k.NgaySinh.HasValue ? k.NgaySinh.Value.ToString("dd/MM/yyyy") : "");
                        table.Cell().Border(1).Padding(3).Text(loai);
                        table.Cell().Border(1).Padding(3).Text(k.PhongDon ? "Có" : "Không");
                        i++;
                    }
                });

                col.Item().PaddingTop(10).Text("ĐIỀU 2: GIÁ TRỊ HỢP ĐỒNG VÀ PHƯƠNG THỨC THANH TOÁN").Bold().FontSize(12);
                col.Item().Text("1. Tổng giá trị hợp đồng:").Bold();
                col.Item().Text($"Giá tour/khách (trung bình): {FormatPrice(giaTrungBinh)} VNĐ/khách.");
                col.Item().Text($"Tổng cộng: {FormatPrice(d.TongTien)} VNĐ (Bằng chữ: .................................................).");
                col.Item().Text("Giá trên đã bao gồm thuế VAT, bảo hiểm du lịch, các chi phí quy định trong chương trình.");

                col.Item().PaddingTop(4).Text("2. Phương thức và tiến độ thanh toán:").Bold();

                // Hiển thị thông tin tài chính chi tiết
                if (d.TrangThaiTaiChinh == BookingConstants.TC_DA_DAT_COC ||
                    d.TrangThaiTaiChinh == BookingConstants.TC_DA_THANH_TOAN_DU)
                {
                    // Đã cọc hoặc đã thanh toán đủ
                    decimal tienCoc = d.TienCoc > 0 ? d.TienCoc : Math.Round(d.TongTien * 30 / 100m, 0);
                    decimal tyLeCoc = d.TongTien > 0 ? Math.Round((tienCoc / d.TongTien) * 100) : 30;

                    col.Item().Text($"Đợt 1: Bên A đặt cọc {tyLeCoc}% tổng giá trị hợp đồng (tương đương: {FormatPrice(tienCoc)} VNĐ) ngay sau khi ký hợp đồng.");

                    if (d.TrangThaiTaiChinh == BookingConstants.TC_DA_DAT_COC)
                    {
                        decimal conLai = d.TongTien - d.SoTienDaThanhToan;
                        col.Item().Text($"Đợt 2: Bên A thanh toán số tiền còn lại là {FormatPrice(conLai)} VNĐ trước ngày khởi hành.");
                    }
                    else if (d.TrangThaiTaiChinh == BookingConstants.TC_DA_THANH_TOAN_DU)
                    {
                        col.Item().Text($"Đợt 2: Bên A đã thanh toán đủ số tiền còn lại.");
                    }
                }
                else if (d.TrangThaiTaiChinh == BookingConstants.TC_CHUA_THANH_TOAN)
                {
                    // Chưa thanh toán
                    col.Item().Text($"Đợt 1: Bên A đặt cọc 30% tổng giá trị hợp đồng (tương đương: {FormatPrice(Math.Round(d.TongTien * 30 / 100m, 0))} VNĐ) ngay sau khi ký hợp đồng.");
                    col.Item().Text($"Đợt 2: Bên A thanh toán số tiền còn lại trước ngày khởi hành.");
                }
                else if (d.TrangThaiTaiChinh == BookingConstants.TC_MAT_COC)
                {
                    col.Item().Text("Đợt 1: Bên A đã đặt cọc nhưng đã mất cọc do hủy đơn.");
                }
                else if (d.TrangThaiTaiChinh == BookingConstants.TC_DA_HOAN_TIEN)
                {
                    col.Item().Text("Đợt 1: Bên A đã đặt cọc và được hoàn cọc.");
                }
                else if (d.TrangThaiTaiChinh == BookingConstants.TC_DANG_HOAN_TIEN)
                {
                    col.Item().Text("Đợt 1: Bên A đã đặt cọc và đang được xử lý hoàn tiền.");
                }

                col.Item().Text($"Hình thức thanh toán: {(string.IsNullOrEmpty(d.ThongTinThanhToan?.TenPhuongThuc) ? "Tiền mặt hoặc Chuyển khoản ngân hàng" : d.ThongTinThanhToan.TenPhuongThuc)}.");
                col.Item().Text($"Trạng thái tài chính: {GetFinancialStatusName(d.TrangThaiTaiChinh)}.");
                col.Item().Text($"Số tiền đã thanh toán: {FormatPrice(d.SoTienDaThanhToan)} VNĐ.");

                if (d.ThongTinThanhToan != null)
                {
                    col.Item().Text($"Giao dịch gần nhất: {GetPaymentTypeName(d.ThongTinThanhToan.LoaiThanhToan)} - {FormatPrice(d.ThongTinThanhToan.TongTienThanhToan)} VNĐ - {d.ThongTinThanhToan.TenTrangThai}.");
                }

                if (d.LichSuThanhToan != null && d.LichSuThanhToan.Any())
                {
                    col.Item().PaddingTop(6).Text("Lịch sử thanh toán:").Bold().FontSize(10);
                    col.Item().Table(table =>
                    {
                        table.ColumnsDefinition(c =>
                        {
                            c.RelativeColumn(2);
                            c.RelativeColumn(1.5f);
                            c.RelativeColumn(1.5f);
                            c.RelativeColumn(1.5f);
                            c.RelativeColumn(1.5f);
                        });

                        table.Header(h =>
                        {
                            h.Cell().Border(1).Padding(3).Text("Ngày").Bold().FontSize(9);
                            h.Cell().Border(1).Padding(3).Text("Loại").Bold().FontSize(9);
                            h.Cell().Border(1).Padding(3).Text("Số tiền").Bold().FontSize(9);
                            h.Cell().Border(1).Padding(3).Text("Phương thức").Bold().FontSize(9);
                            h.Cell().Border(1).Padding(3).Text("Trạng thái").Bold().FontSize(9);
                        });

                        foreach (var p in d.LichSuThanhToan)
                        {
                            table.Cell().Border(1).Padding(3).Text(p.NgayThanhToan.ToString("dd/MM/yyyy") ?? "").FontSize(9);
                            table.Cell().Border(1).Padding(3).Text(p.TenLoaiThanhToan ?? "Khác").FontSize(9);
                            table.Cell().Border(1).Padding(3).Text(FormatPrice(p.TongTienThanhToan)).FontSize(9);
                            table.Cell().Border(1).Padding(3).Text(p.TenPhuongThuc ?? "N/A").FontSize(9);
                            table.Cell().Border(1).Padding(3).Text(p.TenTrangThai ?? "N/A").FontSize(9);
                        }
                    });
                }

                col.Item().PaddingTop(10)
                .Text("ĐIỀU 3: ĐIỀU KHOẢN HỦY TOUR VÀ HOÀN TIỀN")
                .Bold().FontSize(12);

                col.Item().Text("1. Trường hợp Bên A hủy tour:").Bold();

                col.Item().Text("- Hủy từ 30 ngày trở lên trước ngày khởi hành: Hoàn 100% số tiền đã thanh toán.");
                col.Item().Text("- Hủy từ 15 đến dưới 30 ngày trước ngày khởi hành: Hoàn 70% số tiền đã thanh toán.");
                col.Item().Text("- Hủy từ 07 đến dưới 15 ngày trước ngày khởi hành: Hoàn 50% số tiền đã thanh toán.");
                col.Item().Text("- Hủy từ 03 đến dưới 07 ngày trước ngày khởi hành: Hoàn 30% số tiền đã thanh toán.");
                col.Item().Text("- Hủy dưới 03 ngày trước ngày khởi hành hoặc không tham gia chương trình: Không hoàn tiền.");

                col.Item().PaddingTop(4).Text("2. Trường hợp Bên B hủy tour:").Bold();

                col.Item().Text("Bên B có trách nhiệm thông báo cho Bên A trong thời gian sớm nhất và hoàn trả toàn bộ số tiền Bên A đã thanh toán trong trường hợp không thể tổ chức tour theo cam kết.");

                col.Item().Text("3. Trường hợp bất khả kháng:").Bold();

                col.Item().Text("Các trường hợp như thiên tai, dịch bệnh, chiến tranh, đình công, sự cố giao thông, quyết định của cơ quan nhà nước hoặc các sự kiện ngoài khả năng kiểm soát của các bên sẽ được xem là sự kiện bất khả kháng. Hai bên sẽ cùng thương lượng để thay đổi lịch trình hoặc hoàn trả các khoản chi phí còn lại sau khi đã trừ các chi phí thực tế phát sinh.");
                col.Item().PaddingTop(10)
                    .Text("ĐIỀU 4: QUYỀN VÀ NGHĨA VỤ CỦA CÁC BÊN")
                    .Bold().FontSize(12);

                col.Item().Text("1. Quyền và nghĩa vụ của Bên A:").Bold();

                col.Item().Text("- Cung cấp đầy đủ, chính xác thông tin cá nhân theo yêu cầu của chương trình du lịch.");
                col.Item().Text("- Thanh toán đúng thời hạn theo thỏa thuận trong hợp đồng.");
                col.Item().Text("- Tuân thủ quy định của pháp luật và hướng dẫn của hướng dẫn viên trong suốt hành trình.");
                col.Item().Text("- Tự chịu trách nhiệm đối với các thiệt hại phát sinh do việc cung cấp thông tin sai lệch hoặc không đầy đủ.");

                col.Item().PaddingTop(4).Text("2. Quyền và nghĩa vụ của Bên B:").Bold();

                col.Item().Text("- Tổ chức chương trình du lịch đúng nội dung đã cam kết.");
                col.Item().Text("- Đảm bảo các dịch vụ vận chuyển, lưu trú, ăn uống và tham quan theo chương trình.");
                col.Item().Text("- Mua bảo hiểm du lịch theo quy định đối với các chương trình có áp dụng bảo hiểm.");
                col.Item().Text("- Thông báo kịp thời cho Bên A về các thay đổi phát sinh trong quá trình thực hiện tour.");
                col.Item().PaddingTop(10)
                    .Text("ĐIỀU 5: THAY ĐỔI CHƯƠNG TRÌNH DU LỊCH")
                    .Bold().FontSize(12);

                col.Item().Text("Trong trường hợp cần thiết do điều kiện thời tiết, giao thông, an ninh, an toàn hoặc các nguyên nhân khách quan khác, Bên B có quyền điều chỉnh thứ tự tham quan, thay đổi phương tiện vận chuyển hoặc thay thế dịch vụ tương đương mà không làm ảnh hưởng đến chất lượng chung của chương trình du lịch.");

                col.Item().Text("Mọi thay đổi quan trọng ảnh hưởng trực tiếp đến quyền lợi của Bên A sẽ được Bên B thông báo trước và thống nhất với Bên A.");
                col.Item().PaddingTop(10)
                    .Text("ĐIỀU 6: ĐIỀU KHOẢN CHUNG")
                    .Bold().FontSize(12);

                col.Item().Text("Hai bên cam kết thực hiện đầy đủ các điều khoản đã thỏa thuận trong hợp đồng này.");

                col.Item().Text("Mọi sửa đổi, bổ sung hợp đồng phải được lập thành văn bản và có sự đồng ý của cả hai bên.");

                col.Item().Text("Mọi tranh chấp phát sinh trong quá trình thực hiện hợp đồng sẽ được giải quyết trên tinh thần thương lượng và hợp tác. Trường hợp không đạt được thỏa thuận, tranh chấp sẽ được giải quyết theo quy định của pháp luật Việt Nam.");

                col.Item().Text("Hợp đồng được lập thành 02 (hai) bản có giá trị pháp lý như nhau, mỗi bên giữ 01 (một) bản và có hiệu lực kể từ ngày ký.");
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