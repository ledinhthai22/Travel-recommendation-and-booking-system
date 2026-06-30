using System.Net.Mail;
using System.Net;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;
using travel_recommendation_and_booking_system.Data;

namespace travel_recommendation_and_booking_system.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;

        public EmailService(IConfiguration configuration, AppDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }
        private string FormatPrice(decimal price)
        {
            return price.ToString("#,##0", System.Globalization.CultureInfo.InvariantCulture)
                        .Replace(",", ".");
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");
            using var client = new SmtpClient(emailSettings["SmtpServer"], int.Parse(emailSettings["Port"]!))
            {
                Credentials = new NetworkCredential(emailSettings["SenderEmail"], emailSettings["Password"]),
                EnableSsl = true,
            };
            var mailMessage = new MailMessage
            {
                From = new MailAddress(emailSettings["SenderEmail"]!, emailSettings["SenderName"]),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };
            mailMessage.To.Add(toEmail);
            await client.SendMailAsync(mailMessage);
        }
        public async Task SendPaymentReminderAsync(DonDatTour order)
        {
            string subject = $"[Nhắc thanh toán] Đơn {order.MaDatCho} sắp khởi hành";
            string diemThanhToan = order.ChuyenKhoiHanh?.DiemKhoiHanh ?? "Chưa có thông tin";
            if (order.ChuyenKhoiHanh?.DiemKhoiHanh?.Contains("Hồ Chí Minh", StringComparison.OrdinalIgnoreCase) == true)
                diemThanhToan = "địa chỉ: 65 Huỳnh Thúc Kháng, Phường Sài Gòn, TP. HCM";
            else if (order.ChuyenKhoiHanh?.DiemKhoiHanh?.Contains("Hà Nội", StringComparison.OrdinalIgnoreCase) == true)
                diemThanhToan = "địa chỉ: Số 48 ngách 26 ngõ Thái Thịnh 2, Phường Thịnh Quang, Quận Đống Đa, Hà Nội";
            else if (order.ChuyenKhoiHanh?.DiemKhoiHanh?.Contains("Đà Nẵng", StringComparison.OrdinalIgnoreCase) == true)
                diemThanhToan = "địa chỉ: Tòa nhà EH1, phường An Hải Bắc, quận Sơn Trà.";
            string body = $@"
                <h2>Nhắc nhở thanh toán</h2>
                <p>Kính gửi Quý khách <strong>{order.NguoiDung?.HoTen}</strong>,</p>
                <p>Đơn đặt tour <strong>{order.MaDatCho}</strong> của Quý khách sẽ khởi hành vào ngày <strong>{order.ChuyenKhoiHanh?.NgayKhoiHanh:dd/MM/yyyy}</strong> (còn 7 ngày).</p>
                <p><strong>Số tiền cần thanh toán: {order.TongTien:N0} đ</strong></p>
                <p>Vui lòng thanh toán sớm để tránh đơn bị hủy.</p>
                <p>Điểm thanh toán: {diemThanhToan} </p>
                <p>Trân trọng,<br/>Lối Riêng Travel</p>";

            await SendEmailAsync(order.NguoiDung!.Email, subject, body);
        }

        public async Task SendBookingCancelledAsync(DonDatTour order)
        {
            string subject = $"[Hủy đơn] Đơn {order.MaDatCho}";

            string body = $@"
                <h2>Thông báo hủy đơn đặt tour</h2>
                <p>Kính gửi Quý khách,</p>
                <p>Đơn đặt tour <strong>{order.MaDatCho}</strong> đã bị hủy tự động vì Quý khách chưa thanh toán trước 3 ngày khởi hành.</p>
                <p>Trân trọng,<br/>Lối Riêng Travel</p>";

            await SendEmailAsync(order.NguoiDung?.Email, subject, body);
        }
        public async Task SendBookingConfirmationAsync(DonDatTour order)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");

                // Load đầy đủ dữ liệu cần thiết
                var fullOrder = await _context.DonDatTours
                    .Include(x => x.ThanhToans)
                    .Include(x => x.KhachHangs)
                    .Include(x => x.ChuyenKhoiHanh).ThenInclude(x => x.Tour)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == order.MaDonDatTour);

                if (fullOrder == null) fullOrder = order;

                string toEmail = fullOrder.KhachHangs?.FirstOrDefault(k => !string.IsNullOrEmpty(k.Email))?.Email
                              ?? fullOrder.NguoiDung?.Email
                              ?? throw new Exception("Không tìm thấy email người nhận");

                using var client = new SmtpClient(emailSettings["SmtpServer"], int.Parse(emailSettings["Port"]!))
                {
                    Credentials = new NetworkCredential(emailSettings["SenderEmail"], emailSettings["Password"]),
                    EnableSsl = true,
                };

                var mail = new MailMessage
                {
                    From = new MailAddress(emailSettings["SenderEmail"]!, emailSettings["SenderName"]),
                    Subject = $"Xác nhận đặt tour - {fullOrder.MaDatCho}",
                    Body = GenerateBookingEmailHtml(fullOrder),
                    IsBodyHtml = true
                };

                mail.To.Add(toEmail);
                await client.SendMailAsync(mail);

                Console.WriteLine($"[Email] Gửi thành công đến {toEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Email] Lỗi: {ex.Message}\n{ex.StackTrace}");
            }
        }

        private string GenerateBookingEmailHtml(DonDatTour order)
        {
            string hoTen = order.NguoiDung?.HoTen ?? "Quý khách";
            string sdt = "N/A";
            string email = "N/A";
            string diaChi = "";

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

            if (email == "N/A" && order.KhachHangs?.Any() == true)
            {
                var kh = order.KhachHangs.First();
                hoTen = kh.HoTen ?? hoTen;
                sdt = kh.SoDienThoai ?? sdt;
                email = kh.Email ?? email;
            }

            string GetTrangThaiLabel(int s) => s switch
            {
                1 => "CHỜ DUYỆT",
                2 => "ĐÃ DUYỆT",
                3 => "HOÀN TẤT",
                4 => "ĐÃ HỦY",
                _ => "KHÔNG XÁC ĐỊNH"
            };

            string GetTrangThaiColor(int s) => s switch   // ← ĐÃ THÊM HÀM NÀY
            {
                1 => "#c50000",
                2 => "#008000",
                3 => "#025da6",
                4 => "#888888",
                _ => "#555555"
            };

            string GetPhuongThucText(int? m) => m switch
            {
                1 => "VNPay",
                2 => "Tiền mặt",
                3 => "Chuyển khoản ngân hàng",
                _ => "Chưa thanh toán"
            };

            // Lấy ThanhToan mới nhất
            var latestPayment = order.ThanhToans?
                .OrderByDescending(t => t.NgayThanhToan)
                .FirstOrDefault();

            string transactionInfo = latestPayment?.PhuongThucThanhToan switch
            {
                1 => !string.IsNullOrWhiteSpace(latestPayment.MaGiaoDich)
                    ? latestPayment.MaGiaoDich
                    : "Mã giao dịch VNPay đang được cập nhật",
                2 => "Thanh toán trực tiếp tại văn phòng hoặc khi nhận dịch vụ",
                3 => !string.IsNullOrWhiteSpace(latestPayment.MaGiaoDich)
                    ? $"Mã tham chiếu: {latestPayment.MaGiaoDich}"
                    : "Vui lòng sử dụng mã booking khi chuyển khoản",
                _ => "Chưa phát sinh giao dịch"
            };

            string diemTapTrung = order.ChuyenKhoiHanh?.DiemKhoiHanh ?? "Chưa có thông tin";
            if (order.ChuyenKhoiHanh?.DiemKhoiHanh?.Contains("Hồ Chí Minh", StringComparison.OrdinalIgnoreCase) == true)
                diemTapTrung = "địa chỉ: 65 Huỳnh Thúc Kháng, Phường Sài Gòn, TP. HCM";
            else if (order.ChuyenKhoiHanh?.DiemKhoiHanh?.Contains("Hà Nội", StringComparison.OrdinalIgnoreCase) == true)
                diemTapTrung = "địa chỉ: Số 48 ngách 26 ngõ Thái Thịnh 2, Phường Thịnh Quang, Quận Đống Đa, Hà Nội";
            else if (order.ChuyenKhoiHanh?.DiemKhoiHanh?.Contains("Đà Nẵng", StringComparison.OrdinalIgnoreCase) == true)
                diemTapTrung = "địa chỉ: Tòa nhà EH1, phường An Hải Bắc, quận Sơn Trà.";

            decimal tamTinh = (order.SoNguoiLon * order.GiaNguoiLonTaiDat)
                            + (order.SoTreEm * order.GiaTreEmTaiDat)
                            + (order.SoEmBe * order.GiaEmBeTaiDat)
                            + (order.SoPhongDon * order.PhuThuPhongDonTaiDat);

            string Row(string label, string value) => $@"
            <tr>
              <td width='150' align='right' valign='top' style='padding:8px 12px; background:#f8f9fa; font-weight:500; border-bottom:1px solid #eee;'>{label}:</td>
              <td style='padding:8px 12px; border-bottom:1px solid #eee;'>{value}</td>
            </tr>";

            string CostRows()
            {
                var sb = new System.Text.StringBuilder();
                if (order.SoNguoiLon > 0)
                    sb.Append(Row("Người lớn", $"{order.SoNguoiLon} x {FormatPrice(order.GiaNguoiLonTaiDat)} đ = <b>{FormatPrice(order.SoNguoiLon * order.GiaNguoiLonTaiDat)} đ</b>"));
                if (order.SoTreEm > 0)
                    sb.Append(Row("Trẻ em", $"{order.SoTreEm} x {FormatPrice(order.GiaTreEmTaiDat)} đ = <b>{FormatPrice(order.SoTreEm * order.GiaTreEmTaiDat)} đ</b>"));
                if (order.SoEmBe > 0)
                    sb.Append(Row("Em bé", $"{order.SoEmBe} x {FormatPrice(order.GiaEmBeTaiDat)} đ = <b>{FormatPrice(order.SoEmBe * order.GiaEmBeTaiDat)} đ</b>"));
                if (order.SoPhongDon > 0)
                    sb.Append(Row("Phụ thu phòng đơn", $"{order.SoPhongDon} x {FormatPrice(order.PhuThuPhongDonTaiDat)} đ = <b>{FormatPrice(order.SoPhongDon * order.PhuThuPhongDonTaiDat)} đ</b>"));
                if (order.GiaTriGiamTaiDat > 0)
                    sb.Append(Row("Giảm giá", $"<span style='color:#c50000;'>-{FormatPrice(order.GiaTriGiamTaiDat)} đ</span>"));
                sb.Append(Row("Tổng tiền", $"<b style='font-size:12pt;color:#c50000;'>{FormatPrice(order.TongTien)} đ</b>"));
                return sb.ToString();
            }

            string ghiChuRow = !string.IsNullOrWhiteSpace(order.GhiChu) ? Row("Ghi chú thông tin", $"<i>{order.GhiChu}</i>") : "";

            return $@"<!DOCTYPE html>
                    <html lang='vi'>
                    <head>
                        <meta charset='UTF-8'>
                        <meta name='viewport' content='width=device-width,initial-scale=1'>
                        <title>Xác nhận đặt tour</title>
                    </head>
                    <body style='margin:0;padding:0;background:#ffffff;font-family:Roboto,Arial,sans-serif;'>
                    <table width='100%' cellpadding='0' cellspacing='0' style='max-width:640px;margin:0;background:#fff;'>
                    <tbody>
                      <!-- TIÊU ĐỀ -->
                      <tr>
                        <td style='padding:0;'>
                          <p style='margin:0;padding:12px 0 8px 0;text-align:center;font-size:18pt;font-family:Roboto,Arial,sans-serif;font-weight:bold;color:#000;text-transform:uppercase;letter-spacing:0.5px;'>
                            Booking của quý khách
                          </p>
                        </td>
                      </tr>

                      <!-- I. PHIẾU XÁC NHẬN -->
                      <tr>
                        <td style='padding:0;'>
                          <p style='margin:8px 0 4px 0;font-family:Roboto,Arial,sans-serif;font-weight:bold;color:#c50000;text-transform:uppercase;font-size:10.5pt;'>
                            I. Phiếu xác nhận booking:
                          </p>
                          <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tbody>
                              <tr>
                                <td colspan='2' style='padding:3.75pt 7.5pt;'>
                                  <p style='margin:0 0 7.5pt 0;text-align:justify;line-height:13.5pt;font-size:10.5pt;font-family:Roboto,Arial,sans-serif;color:#025da6;'>
                                    {order.ChuyenKhoiHanh?.Tour?.TenTour ?? "N/A"}
                                  </p>
                                </td>
                              </tr>
                              {Row("Mã tour", order.ChuyenKhoiHanh?.MaChuyenCode ?? "N/A")}
                              {Row("Ngày đi", order.ChuyenKhoiHanh?.NgayKhoiHanh.ToString("dd/MM/yyyy HH:mm") ?? "N/A")}
                              {Row("Ngày về", order.ChuyenKhoiHanh?.NgayKetThuc.ToString("dd/MM/yyyy HH:mm") ?? "N/A")}
                              {Row("Nơi tập trung di chuyển", diemTapTrung)}
                              {Row("Điểm khởi hành", order.ChuyenKhoiHanh?.DiemKhoiHanh ?? "N/A")}
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      <!-- II. CHI TIẾT BOOKING -->
                      <tr>
                        <td style='padding:0;'>
                          <p style='margin:8px 0 4px 0;font-family:Roboto,Arial,sans-serif;font-weight:bold;color:#c50000;text-transform:uppercase;font-size:10.5pt;'>
                            II. Chi tiết booking:
                          </p>
                          <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tbody>
                              {Row("Số booking", $"<b>{order.MaDatCho}</b>")}
                              {Row("Tổng trị giá booking", $"<b style='color:#c50000;'>{FormatPrice(order.TongTien)} đ</b>")}
                              {Row("Ngày đặt", $"{order.NgayDat:dd/MM/yyyy HH:mm:ss}")}
                              {Row("Phương thức thanh toán", GetPhuongThucText(latestPayment?.PhuongThucThanhToan))}
                              {Row("Mã giao dịch", transactionInfo)}
                              {Row("Tình trạng", $"<span style='color:{GetTrangThaiColor(order.TrangThaiDon)};'>{GetTrangThaiLabel(order.TrangThaiDon)}</span>")}
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      <!-- CHI TIẾT CHI PHÍ -->
                      <tr>
                        <td style='padding:0;'>
                          <p style='margin:8px 0 4px 0;font-family:Roboto,Arial,sans-serif;font-weight:bold;color:#c50000;text-transform:uppercase;font-size:10.5pt;'>
                            Chi tiết chi phí:
                          </p>
                          <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tbody>
                              {CostRows()}
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      <!-- III. THÔNG TIN LIÊN LẠC -->
                      <tr>
                        <td style='padding:0;'>
                          <p style='margin:8px 0 4px 0;font-family:Roboto,Arial,sans-serif;font-weight:bold;color:#c50000;text-transform:uppercase;font-size:10.5pt;'>
                            III. Thông tin liên lạc:
                          </p>
                          <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tbody>
                              {ghiChuRow}
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      <!-- LỜI CHÚC -->
                      <tr>
                        <td style='padding:8px 0 4px 0;'>
                          <p style='margin:0;font-size:10.5pt;font-family:Roboto,Arial,sans-serif;font-weight:bold;'>
                            Chúc quý khách 1 chuyến hành trình tuyệt vời và những trải nghiệm đầy hạnh phúc
                          </p>
                        </td>
                      </tr>

                      <!-- FOOTER -->
                      <tr>
                        <td style='padding:0 0 12px 0;'>
                          <p style='margin:0;font-size:10.5pt;font-family:Roboto,Arial,sans-serif;'>
                            Trân trọng,<br/>
                            <strong>Đội ngũ Lối Riêng Travel</strong>
                          </p>
                        </td>
                      </tr>

                    </tbody>
                    </table>
                    </body>
                    </html>";
        }
    }
}
