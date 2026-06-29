using System.Net.Mail;
using System.Net;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
            QuestPDF.Settings.License = LicenseType.Community;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");
            var smtpServer = emailSettings["SmtpServer"];
            var port = int.Parse(emailSettings["Port"]!);
            var senderEmail = emailSettings["SenderEmail"];
            var password = emailSettings["Password"];
            var senderName = emailSettings["SenderName"];

            using var client = new SmtpClient(smtpServer, port)
            {
                Credentials = new NetworkCredential(senderEmail, password),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail!, senderName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };
            mailMessage.To.Add(toEmail);
            await client.SendMailAsync(mailMessage);
        }

        public async Task SendBookingConfirmationAsync(DonDatTour order)
        {
            try
            {
                var pdfBytes = GenerateBookingPdf(order);
                var emailSettings = _configuration.GetSection("EmailSettings");

                // Ưu tiên email từ thông tin liên lạc
                string toEmail = order.KhachHangs?.FirstOrDefault(k => !string.IsNullOrEmpty(k.Email))?.Email
                              ?? order.NguoiDung?.Email
                              ?? throw new Exception("Không tìm thấy email người nhận");

                using var client = new SmtpClient(emailSettings["SmtpServer"], int.Parse(emailSettings["Port"]!))
                {
                    Credentials = new NetworkCredential(emailSettings["SenderEmail"], emailSettings["Password"]),
                    EnableSsl = true,
                };

                var mail = new MailMessage
                {
                    From = new MailAddress(emailSettings["SenderEmail"]!, emailSettings["SenderName"]),
                    Subject = $"Xác nhận đặt tour - {order.MaDatCho}",
                    Body = $"""
                        <h2>Đặt tour thành công!</h2>
                        <p>Xin chào <strong>{order.NguoiDung?.HoTen ?? "Quý khách"}</strong>,</p>
                        <p>Đơn đặt tour <strong>{order.MaDatCho}</strong> đã được ghi nhận thành công.</p>
                        <p>Vui lòng xem file PDF đính kèm để biết thông tin chi tiết.</p>
                        <p>Trân trọng,<br/>Đội ngũ Travel System</p>
                        """,
                    IsBodyHtml = true
                };

                mail.To.Add(toEmail);

                var attachment = new Attachment(new MemoryStream(pdfBytes), $"DonDatTour_{order.MaDatCho}.pdf", "application/pdf");
                mail.Attachments.Add(attachment);

                await client.SendMailAsync(mail);
                Console.WriteLine($"[Email] Gửi thành công đến {toEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Email] Lỗi: {ex.Message}\n{ex.StackTrace}");
            }
        }

        private byte[] GenerateBookingPdf(DonDatTour order)
        {
            var colorPrimary = "#1A1A1A";
            var colorMuted = "#555555";
            var colorBorder = "#E5E5E5";
            var colorAccent = "#0EA5E9";
            var colorWhite = "#FFFFFF";

            string GetTrangThaiDonText(int status) => status switch
            {
                1 => "CHỜ DUYỆT",
                2 => "ĐÃ DUYỆT",
                3 => "HOÀN TẤT",
                4 => "ĐÃ HỦY",
                _ => "KHÔNG XÁC ĐỊNH"
            };

            string GetPhuongThucThanhToanText(int? method) => method switch
            {
                1 => "VNPay",
                2 => "Tiền mặt",
                3 => "Chuyển khoản ngân hàng",
                _ => "Chưa thanh toán"
            };

            // ====================== LẤY THÔNG TIN LIÊN LẠC ======================
            string hoTen = "N/A";
            string sdt = "N/A";
            string email = "N/A";
            string diaChi = "";

            // Parse từ GhiChu (ưu tiên)
            if (!string.IsNullOrWhiteSpace(order.GhiChu))
            {
                var match = System.Text.RegularExpressions.Regex.Match(
                    order.GhiChu,
                    @"\[Liên hệ\]\s*(.+?)\s*-\s*(.+?)\s*-\s*(.+?)(?:\s*-\s*(.+))?",
                    System.Text.RegularExpressions.RegexOptions.IgnoreCase);

                if (match.Success)
                {
                    hoTen = match.Groups[1].Value.Trim();
                    sdt = match.Groups[2].Value.Trim();
                    email = match.Groups[3].Value.Trim();
                    if (match.Groups.Count > 4 && match.Groups[4].Success)
                        diaChi = match.Groups[4].Value.Trim();
                }
            }

            // Nếu chưa có thì lấy từ KhachHangs
            if (email == "N/A" && order.KhachHangs?.Any() == true)
            {
                var kh = order.KhachHangs.First();
                hoTen = kh.HoTen ?? hoTen;
                sdt = kh.SoDienThoai ?? sdt;
                email = kh.Email ?? email;
            }

            // ====================== TẠO PDF ======================
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(40);
                    page.DefaultTextStyle(x => x.FontFamily("Arial").FontSize(11).FontColor(colorPrimary));

                    // HEADER
                    page.Header().BorderBottom(3, Unit.Point).BorderColor(colorAccent).PaddingBottom(20).Row(row =>
                    {
                        row.RelativeItem().Column(col =>
                        {
                            col.Item().Text("TRAVEL SYSTEM PLATFORM").FontSize(18).ExtraBold();
                            col.Item().Text("XÁC NHẬN ĐẶT TOUR").FontSize(24).ExtraBold().LetterSpacing(-0.5f);
                        });

                        row.ConstantItem(240).AlignRight().Column(col =>
                        {
                            col.Item().Text(t => { t.Span("Mã đơn: ").Bold(); t.Span(order.MaDatCho).Bold().FontSize(13); });
                            col.Item().Text($"Ngày đặt: {order.NgayDat:dd/MM/yyyy HH:mm}").FontSize(10).FontColor(colorMuted);
                        });
                    });

                    page.Content().PaddingVertical(25).Column(col =>
                    {
                        // THÔNG TIN KHÁCH HÀNG (ĐÃ SỬA)
                        col.Item().Row(row =>
                        {
                            row.RelativeItem().Column(c =>
                            {
                                c.Item().BorderBottom(1, Unit.Point).BorderColor(colorAccent).PaddingBottom(6)
                                    .Text("THÔNG TIN KHÁCH HÀNG").Bold().FontSize(12);

                                c.Item().PaddingTop(10).Text(t => { t.Span("Họ tên: ").FontColor(colorMuted); t.Span(hoTen); });
                                c.Item().Text(t => { t.Span("Email: ").FontColor(colorMuted); t.Span(email); });
                                c.Item().Text(t => { t.Span("SĐT: ").FontColor(colorMuted); t.Span(sdt); });
                                if (!string.IsNullOrWhiteSpace(diaChi))
                                    c.Item().Text(t => { t.Span("Địa chỉ: ").FontColor(colorMuted); t.Span(diaChi); });
                            });

                            row.ConstantItem(50);

                            row.RelativeItem().Column(c =>
                            {
                                c.Item().BorderBottom(1, Unit.Point).BorderColor(colorAccent).PaddingBottom(6)
                                    .Text("TRẠNG THÁI & THANH TOÁN").Bold().FontSize(12);

                                c.Item().PaddingTop(10).Text(t => { t.Span("Trạng thái: ").FontColor(colorMuted); t.Span(GetTrangThaiDonText(order.TrangThaiDon)).Bold(); });
                                c.Item().Text(t => { t.Span("Phương thức: ").FontColor(colorMuted); t.Span(GetPhuongThucThanhToanText(order.ThanhToanMoiNhat?.PhuongThucThanhToan)); });
                                c.Item().Text(t => { t.Span("Mã giao dịch: ").FontColor(colorMuted); t.Span(order.ThanhToanMoiNhat?.MaGiaoDich ?? "Chưa có"); });
                            });
                        });

                        // CHI TIẾT CHUYẾN ĐI
                        col.Item().PaddingTop(30).Column(c =>
                        {
                            c.Item().BorderBottom(1, Unit.Point).BorderColor(colorAccent).PaddingBottom(6)
                                .Text("CHI TIẾT CHUYẾN ĐI").Bold().FontSize(12);

                            c.Item().PaddingTop(12).Table(table =>
                            {
                                table.ColumnsDefinition(columns => { columns.RelativeColumn(3); columns.RelativeColumn(2); columns.RelativeColumn(2); });

                                table.Header(header =>
                                {
                                    header.Cell().Background(colorAccent).Padding(10).Text("Tên Tour").FontColor(colorWhite).Bold();
                                    header.Cell().Background(colorAccent).Padding(10).Text("Mã Chuyến").FontColor(colorWhite).Bold();
                                    header.Cell().Background(colorAccent).Padding(10).Text("Ngày Khởi Hành").FontColor(colorWhite).Bold();
                                });

                                table.Cell().BorderBottom(1, Unit.Point).BorderColor(colorBorder).Padding(10).Text(order.ChuyenKhoiHanh?.Tour?.TenTour ?? "N/A").Bold();
                                table.Cell().BorderBottom(1, Unit.Point).BorderColor(colorBorder).Padding(10).Text(order.ChuyenKhoiHanh?.MaChuyenCode ?? "N/A");
                                table.Cell().BorderBottom(1, Unit.Point).BorderColor(colorBorder).Padding(10).Text(order.ChuyenKhoiHanh?.NgayKhoiHanh.ToString("dd/MM/yyyy"));
                            });
                        });

                        // BẢNG CHI PHÍ (giữ nguyên)
                        col.Item().PaddingTop(30).Column(c =>
                        {
                            c.Item().BorderBottom(1, Unit.Point).BorderColor(colorAccent).PaddingBottom(6)
                                .Text("CHI TIẾT CHI PHÍ").Bold().FontSize(12);

                            c.Item().PaddingTop(12).Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn(3);
                                    columns.RelativeColumn(1);
                                    columns.RelativeColumn(1.5f);
                                    columns.RelativeColumn(1.5f);
                                });

                                table.Header(header =>
                                {
                                    header.Cell().Background(colorAccent).Padding(10).Text("Loại").FontColor(colorWhite).Bold();
                                    header.Cell().Background(colorAccent).Padding(10).Text("Số lượng").FontColor(colorWhite).Bold().AlignCenter();
                                    header.Cell().Background(colorAccent).Padding(10).Text("Đơn giá").FontColor(colorWhite).Bold().AlignRight();
                                    header.Cell().Background(colorAccent).Padding(10).Text("Thành tiền").FontColor(colorWhite).Bold().AlignRight();
                                });

                                if (order.SoNguoiLon > 0)
                                {
                                    table.Cell().BorderBottom(1, Unit.Point).BorderColor(colorBorder).Padding(8).Text("Người lớn");
                                    table.Cell().BorderBottom(1, Unit.Point).BorderColor(colorBorder).Padding(8).Text(order.SoNguoiLon.ToString()).AlignCenter();
                                    table.Cell().BorderBottom(1, Unit.Point).BorderColor(colorBorder).Padding(8).Text($"{order.GiaNguoiLonTaiDat:N0} đ").AlignRight();
                                    table.Cell().BorderBottom(1, Unit.Point).BorderColor(colorBorder).Padding(8).Text($"{(order.SoNguoiLon * order.GiaNguoiLonTaiDat):N0} đ").AlignRight();
                                }

                                if (order.SoTreEm > 0)
                                {
                                    table.Cell().BorderBottom(1, Unit.Point).BorderColor(colorBorder).Padding(8).Text("Trẻ em");
                                    table.Cell().BorderBottom(1, Unit.Point).BorderColor(colorBorder).Padding(8).Text(order.SoTreEm.ToString()).AlignCenter();
                                    table.Cell().BorderBottom(1, Unit.Point).BorderColor(colorBorder).Padding(8).Text($"{order.GiaTreEmTaiDat:N0} đ").AlignRight();
                                    table.Cell().BorderBottom(1, Unit.Point).BorderColor(colorBorder).Padding(8).Text($"{(order.SoTreEm * order.GiaTreEmTaiDat):N0} đ").AlignRight();
                                }

                                if (order.SoEmBe > 0)
                                {
                                    table.Cell().BorderBottom(1, Unit.Point).BorderColor(colorBorder).Padding(8).Text("Em bé");
                                    table.Cell().BorderBottom(1, Unit.Point).BorderColor(colorBorder).Padding(8).Text(order.SoEmBe.ToString()).AlignCenter();
                                    table.Cell().BorderBottom(1, Unit.Point).BorderColor(colorBorder).Padding(8).Text($"{order.GiaEmBeTaiDat:N0} đ").AlignRight();
                                    table.Cell().BorderBottom(1, Unit.Point).BorderColor(colorBorder).Padding(8).Text($"{(order.SoEmBe * order.GiaEmBeTaiDat):N0} đ").AlignRight();
                                }

                                if (order.SoPhongDon > 0)
                                {
                                    table.Cell().BorderBottom(1, Unit.Point).BorderColor(colorBorder).Padding(8).Text("Phụ thu phòng đơn");
                                    table.Cell().BorderBottom(1, Unit.Point).BorderColor(colorBorder).Padding(8).Text(order.SoPhongDon.ToString()).AlignCenter();
                                    table.Cell().BorderBottom(1, Unit.Point).BorderColor(colorBorder).Padding(8).Text($"{order.PhuThuPhongDonTaiDat:N0} đ").AlignRight();
                                    table.Cell().BorderBottom(1, Unit.Point).BorderColor(colorBorder).Padding(8).Text($"{(order.SoPhongDon * order.PhuThuPhongDonTaiDat):N0} đ").AlignRight();
                                }
                            });
                        });

                        // TỔNG TIỀN
                        col.Item().PaddingTop(20).AlignRight().Width(320).Column(s =>
                        {
                            decimal tamTinh = (order.SoNguoiLon * order.GiaNguoiLonTaiDat) +
                                              (order.SoTreEm * order.GiaTreEmTaiDat) +
                                              (order.SoEmBe * order.GiaEmBeTaiDat) +
                                              (order.SoPhongDon * order.PhuThuPhongDonTaiDat);

                            s.Item().Row(r => { r.RelativeItem().Text("Tạm tính:").FontSize(12); r.ConstantItem(160).AlignRight().Text($"{tamTinh:N0} đ"); });

                            if (order.GiaTriGiamTaiDat > 0)
                            {
                                s.Item().PaddingTop(4).Row(r => { r.RelativeItem().Text("Giảm giá:").FontSize(12); r.ConstantItem(160).AlignRight().Text($"-{order.GiaTriGiamTaiDat:N0} đ").FontColor("#EF4444"); });
                            }

                            s.Item().PaddingTop(12).BorderTop(2, Unit.Point).BorderColor(colorPrimary).Row(r =>
                            {
                                r.RelativeItem().Text("TỔNG TIỀN:").ExtraBold().FontSize(16);
                                r.ConstantItem(160).AlignRight().Text($"{order.TongTien:N0} đ").ExtraBold().FontSize(16);
                            });
                        });

                        // Ghi chú
                        if (!string.IsNullOrWhiteSpace(order.GhiChu))
                        {
                            col.Item().PaddingTop(30).Border(1, Unit.Point).BorderColor(colorBorder).Background("#FAFAFA").Padding(15)
                                .Text(order.GhiChu).Italic().FontSize(10);
                        }
                    });

                    page.Footer().BorderTop(1, Unit.Point).BorderColor(colorBorder).PaddingTop(15).Row(row =>
                    {
                        row.RelativeItem().Text("Cảm ơn quý khách đã tin tưởng Travel System!").FontSize(9).Italic().FontColor(colorMuted);
                        row.ConstantItem(80).AlignRight().Text(x => x.CurrentPageNumber());
                    });
                });
            });

            return document.GeneratePdf();
        }
    }
}