using System.Net.Mail;
using System.Net;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Constants;
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

        private string Row(string label, string value) => $@"
            <tr>
              <td width='150' align='right' valign='top' style='padding:8px 12px; background:#f8f9fa; font-weight:500; border-bottom:1px solid #eee;'>{label}:</td>
              <td style='padding:8px 12px; border-bottom:1px solid #eee;'>{value}</td>
            </tr>";

        private string GetFinancialStatusForDisplay(DonDatTour order)
        {
            return order.TrangThaiTaiChinh switch
            {
                BookingConstants.TC_CHUA_THANH_TOAN => "Chưa phát sinh thanh toán",
                BookingConstants.TC_DA_DAT_COC => "Đã thanh toán tiền cọc",
                BookingConstants.TC_DA_THANH_TOAN_DU => "Đã thanh toán đầy đủ",
                BookingConstants.TC_DANG_HOAN_TIEN => "Đang xử lý hoàn tiền",
                BookingConstants.TC_DA_HOAN_TIEN => "Đã hoàn tiền",
                BookingConstants.TC_MAT_COC => "Không được hoàn tiền",
                _ => "Không xác định"
            };
        }

        private string GetFinancialColorForDisplay(string status)
        {
            return status switch
            {
                "Chưa thanh toán" => "#888888",
                "Đã đặt cọc" => "#FF8C00",
                "Đã thanh toán đủ" => "#008000",
                "Đang xử lý hoàn tiền" => "#c50000",
                "Đã hoàn tiền" => "#025da6",
                "Mất cọc" => "#c50000",
                _ => "#555555"
            };
        }

        private string GetOrderStatusName(int status)
        {
            return BookingConstants.GetOrderStatusName(status);
        }

        private string GetOrderStatusColor(int status)
        {
            return status switch
            {
                BookingConstants.DON_CHO_THANH_TOAN => "#FF8C00",
                BookingConstants.DON_CHO_DUYET => "#025da6",
                BookingConstants.DON_DA_DUYET => "#008000",
                BookingConstants.DON_DANG_DIEN_RA => "#008000",
                BookingConstants.DON_HOAN_TAT => "#025da6",
                BookingConstants.DON_DA_HUY => "#c50000",
                _ => "#555555"
            };
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

        #region Cancel Request Email

        public async Task SendCancelRequestNotificationAsync(DonDatTour order)
        {
            try
            {
                var fullOrder = await _context.DonDatTours
                    .Include(x => x.KhachHangs)
                    .Include(x => x.NguoiDung)
                    .Include(x => x.ChuyenKhoiHanh).ThenInclude(x => x.Tour)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == order.MaDonDatTour);

                if (fullOrder == null) fullOrder = order;

                string toEmail = fullOrder.NguoiDung?.Email
                              ?? throw new Exception("Không tìm thấy email người nhận");

                string hoTen = fullOrder.NguoiDung?.HoTen ?? "Quý khách";

                string subject = $"[Yêu cầu hủy đơn] Đơn {fullOrder.MaDatCho}";

                string infoRows = Row("Lý do hủy", fullOrder.LyDoHuy ?? "—")
                    + Row("Trạng thái", "<span style='color:#c50000;font-weight:bold;'>Đang xử lý yêu cầu</span>");

                string body = $@"<!DOCTYPE html>
                <html lang='vi'>
                <head><meta charset='UTF-8'></head>
                <body style='margin:0;padding:0;background:#ffffff;font-family:Roboto,Arial,sans-serif;'>
                <table width='100%' cellpadding='0' cellspacing='0' style='max-width:640px;margin:0;background:#fff;'>
                <tbody>
                  <tr>
                    <td style='padding:0;'>
                      <p style='margin:0;padding:12px 0 8px 0;text-align:center;font-size:16pt;font-weight:bold;color:#c50000;text-transform:uppercase;'>
                        Xác nhận yêu cầu hủy đơn
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:3.75pt 7.5pt;'>
                      <p style='margin:0 0 10px 0;font-size:10.5pt;'>Kính gửi Quý khách <strong>{hoTen}</strong>,</p>
                      <p style='margin:0 0 10px 0;font-size:10.5pt;'>
                        Chúng tôi đã nhận được yêu cầu hủy đơn đặt tour <strong>{fullOrder.MaDatCho}</strong> ({fullOrder.ChuyenKhoiHanh?.Tour?.TenTour}) của Quý khách.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:0;'>
                      <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                        <tbody>
                          {infoRows}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:10px 7.5pt 0 7.5pt;'>
                      <p style='margin:0 0 10px 0;font-size:10.5pt;'>
                        Yêu cầu của Quý khách đang được chúng tôi xử lý. Vui lòng chờ phản hồi từ bộ phận CSKH trong vòng 24-48 giờ làm việc.
                      </p>
                      <p style='margin:0 0 10px 0;font-size:10.5pt;'>
                        Chúng tôi sẽ gửi thông báo ngay khi có kết quả xử lý.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:8px 0 12px 0;'>
                      <p style='margin:0;font-size:10.5pt;'>
                        Trân trọng,<br/><strong>Đội ngũ Lối Riêng Travel</strong>
                      </p>
                      <p style='margin:5px 0 0 0;font-size:9pt;color:#888;'>
                        Email: support@loiriengtravel.com | Hotline: 1900 1234
                      </p>
                    </td>
                  </tr>
                </tbody>
                </table>
                </body>
                </html>";

                await SendEmailAsync(toEmail, subject, body);
                Console.WriteLine($"[Email] Gửi thông báo yêu cầu hủy thành công đến {toEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Email] Lỗi gửi mail yêu cầu hủy: {ex.Message}\n{ex.StackTrace}");
            }
        }

        #endregion

        #region Cancel Processed Email

        public async Task SendCancelProcessedAsync(DonDatTour order)
        {
            try
            {
                var fullOrder = await _context.DonDatTours
                    .Include(x => x.KhachHangs)
                    .Include(x => x.NguoiDung)
                    .Include(x => x.ChuyenKhoiHanh).ThenInclude(x => x.Tour)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == order.MaDonDatTour);

                if (fullOrder == null) fullOrder = order;

                string toEmail = fullOrder.NguoiDung?.Email
                              ?? throw new Exception("Không tìm thấy email người nhận");

                string hoTen = fullOrder.NguoiDung?.HoTen ?? "Quý khách";

                string statusText = GetOrderStatusName(fullOrder.TrangThaiDon);
                string statusColor = GetOrderStatusColor(fullOrder.TrangThaiDon);

                string subject = $"[Kết quả xử lý hủy] Đơn {fullOrder.MaDatCho}";

                string infoRows = Row("Lý do hủy", fullOrder.LyDoHuy ?? "—")
                    + Row("Trạng thái đơn", $"<span style='color:{statusColor};font-weight:bold;'>{statusText}</span>")
                    + Row("Trạng thái tài chính", $"<span style='color:{GetFinancialColorForDisplay(GetFinancialStatusForDisplay(fullOrder))};font-weight:bold;'>{GetFinancialStatusForDisplay(fullOrder)}</span>");

                if (!string.IsNullOrEmpty(fullOrder.AdminNote))
                    infoRows += Row("Ghi chú từ admin", fullOrder.AdminNote);

                string refundRows = string.Empty;
                if (fullOrder.TrangThaiTaiChinh == BookingConstants.TC_DANG_HOAN_TIEN)
                {
                    var refund = fullOrder.ThanhToans?
                        .Where(t => t.LoaiThanhToan == BookingConstants.LOAI_HOAN_TIEN)
                        .OrderByDescending(t => t.NgayThanhToan)
                        .FirstOrDefault();

                    refundRows = Row("Số tiền hoàn dự kiến", $"<b style='color:#c50000;'>{FormatPrice(refund?.SoTienHoan ?? 0)} đ</b>")
                        + Row("Trạng thái hoàn tiền", "<span style='color:#c50000;font-weight:bold;'>Đang xử lý hoàn tiền</span>")
                        + Row("Thời gian xử lý", "3-5 ngày làm việc");
                }
                else if (fullOrder.TrangThaiTaiChinh == BookingConstants.TC_DA_HOAN_TIEN)
                {
                    var refund = fullOrder.ThanhToans?
                        .Where(t => t.LoaiThanhToan == BookingConstants.LOAI_HOAN_TIEN)
                        .OrderByDescending(t => t.NgayThanhToan)
                        .FirstOrDefault();

                    refundRows = Row("Số tiền đã hoàn", $"<b style='color:#008000;'>{FormatPrice(refund?.SoTienHoan ?? 0)} đ</b>")
                        + Row("Ngày hoàn", $"{refund?.NgayHoanTien:dd/MM/yyyy HH:mm}");
                }
                else if (fullOrder.TrangThaiTaiChinh == BookingConstants.TC_MAT_COC)
                {
                    refundRows = Row("Hoàn tiền", "<span style='color:#c50000;font-weight:bold;'>Không được hoàn tiền theo chính sách hủy tour</span>");
                }
                else if (fullOrder.TrangThaiTaiChinh == BookingConstants.TC_CHUA_THANH_TOAN)
                {
                    refundRows = Row("Hoàn tiền", "Đơn hàng chưa có thanh toán nên không phát sinh hoàn tiền");
                }

                string body = $@"<!DOCTYPE html>
                <html lang='vi'>
                <head><meta charset='UTF-8'></head>
                <body style='margin:0;padding:0;background:#ffffff;font-family:Roboto,Arial,sans-serif;'>
                <table width='100%' cellpadding='0' cellspacing='0' style='max-width:640px;margin:0;background:#fff;'>
                <tbody>
                  <tr>
                    <td style='padding:0;'>
                      <p style='margin:0;padding:12px 0 8px 0;text-align:center;font-size:16pt;font-weight:bold;color:#c50000;text-transform:uppercase;'>
                        Kết quả xử lý hủy đơn
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:3.75pt 7.5pt;'>
                      <p style='margin:0 0 10px 0;font-size:10.5pt;'>Kính gửi Quý khách <strong>{hoTen}</strong>,</p>
                      <p style='margin:0 0 10px 0;font-size:10.5pt;'>
                        Yêu cầu hủy đơn đặt tour <strong>{fullOrder.MaDatCho}</strong> ({fullOrder.ChuyenKhoiHanh?.Tour?.TenTour}) của Quý khách đã được xử lý.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:0;'>
                      <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                        <tbody>
                          {infoRows}
                          {refundRows}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:8px 0 12px 0;'>
                      <p style='margin:0;font-size:10.5pt;'>
                        Trân trọng,<br/><strong>Đội ngũ Lối Riêng Travel</strong>
                      </p>
                      <p style='margin:5px 0 0 0;font-size:9pt;color:#888;'>
                        Email: support@loiriengtravel.com | Hotline: 1900 1234
                      </p>
                    </td>
                  </tr>
                </tbody>
                </table>
                </body>
                </html>";

                await SendEmailAsync(toEmail, subject, body);
                Console.WriteLine($"[Email] Gửi kết quả xử lý hủy thành công đến {toEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Email] Lỗi gửi mail kết quả xử lý hủy: {ex.Message}\n{ex.StackTrace}");
            }
        }

        #endregion

        #region Refund Processing Email

        public async Task SendRefundProcessingAsync(DonDatTour order, ThanhToan? thanhToan)
        {
            try
            {
                var fullOrder = await _context.DonDatTours
                    .Include(x => x.KhachHangs)
                    .Include(x => x.NguoiDung)
                    .Include(x => x.ChuyenKhoiHanh).ThenInclude(x => x.Tour)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == order.MaDonDatTour);

                if (fullOrder == null) fullOrder = order;

                string toEmail = fullOrder.NguoiDung?.Email
                              ?? throw new Exception("Không tìm thấy email người nhận");

                string hoTen = fullOrder.NguoiDung?.HoTen ?? "Quý khách";

                string subject = $"[Đang xử lý hoàn tiền] Đơn {fullOrder.MaDatCho}";

                decimal soTienHoan = thanhToan?.SoTienHoan ?? 0;

                string refundRows = Row("Số tiền được hoàn", $"<b style='color:#c50000;'>{FormatPrice(soTienHoan)} đ</b>")
                    + Row("Trạng thái", "<span style='color:#c50000;font-weight:bold;'>Đang xử lý</span>");

                string body = $@"<!DOCTYPE html>
                <html lang='vi'>
                <head><meta charset='UTF-8'></head>
                <body style='margin:0;padding:0;background:#ffffff;font-family:Roboto,Arial,sans-serif;'>
                <table width='100%' cellpadding='0' cellspacing='0' style='max-width:640px;margin:0;background:#fff;'>
                <tbody>
                  <tr>
                    <td style='padding:0;'>
                      <p style='margin:0;padding:12px 0 8px 0;text-align:center;font-size:16pt;font-weight:bold;color:#c50000;text-transform:uppercase;'>
                        Đang xử lý hoàn tiền
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:3.75pt 7.5pt;'>
                      <p style='margin:0 0 10px 0;font-size:10.5pt;'>Kính gửi Quý khách <strong>{hoTen}</strong>,</p>
                      <p style='margin:0 0 10px 0;font-size:10.5pt;'>
                        Đơn đặt tour <strong>{fullOrder.MaDatCho}</strong> ({fullOrder.ChuyenKhoiHanh?.Tour?.TenTour}) của Quý khách đã được hủy thành công.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:0;'>
                      <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                        <tbody>
                          {refundRows}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:10px 7.5pt 0 7.5pt;'>
                      <p style='margin:0 0 10px 0;font-size:10.5pt;'>
                        <strong>Lưu ý:</strong> Số tiền hoàn sẽ được chuyển về phương thức thanh toán ban đầu của Quý khách trong vòng <strong>3-5 ngày làm việc</strong>.
                      </p>
                      <p style='margin:0 0 10px 0;font-size:10.5pt;'>
                        Chúng tôi sẽ gửi email xác nhận ngay khi hoàn tất quá trình hoàn tiền.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:8px 0 12px 0;'>
                      <p style='margin:0;font-size:10.5pt;'>
                        Trân trọng,<br/><strong>Đội ngũ Lối Riêng Travel</strong>
                      </p>
                      <p style='margin:5px 0 0 0;font-size:9pt;color:#888;'>
                        Email: support@loiriengtravel.com | Hotline: 1900 1234
                      </p>
                    </td>
                  </tr>
                </tbody>
                </table>
                </body>
                </html>";

                await SendEmailAsync(toEmail, subject, body);
                Console.WriteLine($"[Email] Gửi thông báo đang xử lý hoàn tiền thành công đến {toEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Email] Lỗi gửi mail đang xử lý hoàn tiền: {ex.Message}\n{ex.StackTrace}");
            }
        }

        #endregion

        #region Cancel No Refund Email

        public async Task SendCancelNoRefundAsync(DonDatTour order)
        {
            try
            {
                var fullOrder = await _context.DonDatTours
                    .Include(x => x.KhachHangs)
                    .Include(x => x.NguoiDung)
                    .Include(x => x.ChuyenKhoiHanh).ThenInclude(x => x.Tour)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == order.MaDonDatTour);

                if (fullOrder == null) fullOrder = order;

                string toEmail = fullOrder.NguoiDung?.Email
                              ?? throw new Exception("Không tìm thấy email người nhận");

                string hoTen = fullOrder.NguoiDung?.HoTen ?? "Quý khách";

                string subject = $"[Hủy tour - Không hoàn tiền] Đơn {fullOrder.MaDatCho}";

                string infoRows = Row("Trạng thái tài chính", "<span style='color:#c50000;font-weight:bold;'>Mất cọc / Không hoàn tiền</span>")
                    + Row("Lý do hủy", fullOrder.LyDoHuy ?? "—");

                if (!string.IsNullOrEmpty(fullOrder.AdminNote))
                    infoRows += Row("Ghi chú từ admin", fullOrder.AdminNote);

                string body = $@"<!DOCTYPE html>
                <html lang='vi'>
                <head><meta charset='UTF-8'></head>
                <body style='margin:0;padding:0;background:#ffffff;font-family:Roboto,Arial,sans-serif;'>
                <table width='100%' cellpadding='0' cellspacing='0' style='max-width:640px;margin:0;background:#fff;'>
                <tbody>
                  <tr>
                    <td style='padding:0;'>
                      <p style='margin:0;padding:12px 0 8px 0;text-align:center;font-size:16pt;font-weight:bold;color:#c50000;text-transform:uppercase;'>
                        Xác nhận hủy đơn - Không hoàn tiền
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:3.75pt 7.5pt;'>
                      <p style='margin:0 0 10px 0;font-size:10.5pt;'>Kính gửi Quý khách <strong>{hoTen}</strong>,</p>
                      <p style='margin:0 0 10px 0;font-size:10.5pt;'>
                        Đơn đặt tour <strong>{fullOrder.MaDatCho}</strong> ({fullOrder.ChuyenKhoiHanh?.Tour?.TenTour}) của Quý khách đã được hủy thành công.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:0;'>
                      <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                        <tbody>
                          {infoRows}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:8px 0 12px 0;'>
                      <p style='margin:0;font-size:10.5pt;'>
                        Trân trọng,<br/><strong>Đội ngũ Lối Riêng Travel</strong>
                      </p>
                      <p style='margin:5px 0 0 0;font-size:9pt;color:#888;'>
                        Email: support@loiriengtravel.com | Hotline: 1900 1234
                      </p>
                    </td>
                  </tr>
                </tbody>
                </table>
                </body>
                </html>";

                await SendEmailAsync(toEmail, subject, body);
                Console.WriteLine($"[Email] Gửi thông báo hủy không hoàn tiền thành công đến {toEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Email] Lỗi gửi mail hủy không hoàn tiền: {ex.Message}\n{ex.StackTrace}");
            }
        }

        #endregion

        #region Existing Methods

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

            decimal soTienConLai = order.TongTien - order.SoTienDaThanhToan;

            string infoRows = Row("Đã thanh toán", $"<b>{FormatPrice(order.SoTienDaThanhToan)} đ</b>")
                + Row("Cần thanh toán", $"<b style='color:#c50000;'>{FormatPrice(soTienConLai)} đ</b>")
                + Row("Điểm thanh toán", diemThanhToan)
                + Row("Số tài khoản", "9704198526191432198")
                + Row("Ngân hàng", "NCB")
                + Row("Nội dung CK", $"{order.NguoiDung?.HoTen}-{order.MaDatCho}");

            string body = $@"<!DOCTYPE html>
                <html lang='vi'>
                <head><meta charset='UTF-8'></head>
                <body style='margin:0;padding:0;background:#ffffff;font-family:Roboto,Arial,sans-serif;'>
                <table width='100%' cellpadding='0' cellspacing='0' style='max-width:640px;margin:0;background:#fff;'>
                <tbody>
                  <tr>
                    <td style='padding:0;'>
                      <p style='margin:0;padding:12px 0 8px 0;text-align:center;font-size:16pt;font-weight:bold;color:#c50000;text-transform:uppercase;'>
                        Nhắc nhở thanh toán
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:3.75pt 7.5pt;'>
                      <p style='margin:0 0 10px 0;font-size:10.5pt;'>Kính gửi Quý khách <strong>{order.NguoiDung?.HoTen}</strong>,</p>
                      <p style='margin:0 0 10px 0;font-size:10.5pt;'>
                        Đơn đặt tour <strong>{order.MaDatCho}</strong> của Quý khách sẽ khởi hành vào ngày <strong>{order.ChuyenKhoiHanh?.NgayKhoiHanh:dd/MM/yyyy}</strong> (còn 7 ngày). Vui lòng thanh toán sớm để tránh đơn bị hủy.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:0;'>
                      <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                        <tbody>
                          {infoRows}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:8px 0 12px 0;'>
                      <p style='margin:0;font-size:10.5pt;'>
                        Trân trọng,<br/><strong>Lối Riêng Travel</strong>
                      </p>
                    </td>
                  </tr>
                </tbody>
                </table>
                </body>
                </html>";

            await SendEmailAsync(order.NguoiDung!.Email, subject, body);
        }

        public async Task SendBookingCancelledAsync(DonDatTour order)
        {
            string subject = $"[Hủy đơn] Đơn {order.MaDatCho}";
            string body = $@"<!DOCTYPE html>
                <html lang='vi'>
                <head><meta charset='UTF-8'></head>
                <body style='margin:0;padding:0;background:#ffffff;font-family:Roboto,Arial,sans-serif;'>
                <table width='100%' cellpadding='0' cellspacing='0' style='max-width:640px;margin:0;background:#fff;'>
                <tbody>
                  <tr>
                    <td style='padding:0;'>
                      <p style='margin:0;padding:12px 0 8px 0;text-align:center;font-size:16pt;font-weight:bold;color:#c50000;text-transform:uppercase;'>
                        Thông báo hủy đơn đặt tour
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:3.75pt 7.5pt;'>
                      <p style='margin:0 0 10px 0;font-size:10.5pt;'>Kính gửi Quý khách,</p>
                      <p style='margin:0 0 10px 0;font-size:10.5pt;'>
                        Đơn đặt tour <strong>{order.MaDatCho}</strong> đã bị hủy tự động vì Quý khách chưa thanh toán trước 3 ngày khởi hành.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:8px 0 12px 0;'>
                      <p style='margin:0;font-size:10.5pt;'>
                        Trân trọng,<br/><strong>Lối Riêng Travel</strong>
                      </p>
                    </td>
                  </tr>
                </tbody>
                </table>
                </body>
                </html>";
            await SendEmailAsync(order.NguoiDung!.Email, subject, body);
        }

        public async Task SendBookingConfirmationAsync(DonDatTour order)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");

                var fullOrder = await _context.DonDatTours
                    .Include(x => x.ThanhToans)
                    .Include(x => x.KhachHangs)
                    .Include(x => x.NguoiDung)
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

        public async Task SendRefundPendingAsync(DonDatTour order, ThanhToan thanhToan)
        {
            try
            {
                var fullOrder = await _context.DonDatTours
                    .Include(x => x.KhachHangs)
                    .Include(x => x.NguoiDung)
                    .Include(x => x.ChuyenKhoiHanh).ThenInclude(x => x.Tour)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == order.MaDonDatTour);

                if (fullOrder == null) fullOrder = order;

                string toEmail = fullOrder.KhachHangs?.FirstOrDefault(k => !string.IsNullOrEmpty(k.Email))?.Email
                              ?? fullOrder.NguoiDung?.Email
                              ?? throw new Exception("Không tìm thấy email người nhận");

                string hoTen = fullOrder.NguoiDung?.HoTen ?? "Quý khách";

                string subject = $"[Đã hủy đơn] Đơn {fullOrder.MaDatCho} - Đang xử lý hoàn tiền";

                string infoRows = Row("Lý do hủy", fullOrder.LyDoHuy ?? "—")
                    + Row("Số tiền đã thanh toán", $"{FormatPrice(thanhToan.TongTienThanhToan)} đ")
                    + Row("Số tiền được hoàn", $"<b style='color:#c50000;'>{FormatPrice(thanhToan.SoTienHoan ?? 0)} đ</b>")
                    + Row("Trạng thái", "<span style='color:#c50000;'>Đang xử lý hoàn tiền</span>");

                string body = $@"<!DOCTYPE html>
                <html lang='vi'>
                <head><meta charset='UTF-8'></head>
                <body style='margin:0;padding:0;background:#ffffff;font-family:Roboto,Arial,sans-serif;'>
                <table width='100%' cellpadding='0' cellspacing='0' style='max-width:640px;margin:0;background:#fff;'>
                <tbody>
                  <tr>
                    <td style='padding:0;'>
                      <p style='margin:0;padding:12px 0 8px 0;text-align:center;font-size:16pt;font-weight:bold;color:#000;text-transform:uppercase;'>
                        Xác nhận hủy đơn đặt tour
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:3.75pt 7.5pt;'>
                      <p style='margin:0 0 10px 0;font-size:10.5pt;'>Kính gửi Quý khách <strong>{hoTen}</strong>,</p>
                      <p style='margin:0 0 10px 0;font-size:10.5pt;'>
                        Đơn đặt tour <strong>{fullOrder.MaDatCho}</strong> ({fullOrder.ChuyenKhoiHanh?.Tour?.TenTour}) đã được hủy thành công theo yêu cầu của Quý khách.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:0;'>
                      <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                        <tbody>
                          {infoRows}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:10px 0 4px 0;'>
                      <p style='margin:0;font-size:10.5pt;'>
                        Số tiền hoàn sẽ được chuyển về phương thức thanh toán ban đầu trong vòng 3-5 ngày làm việc. Chúng tôi sẽ gửi email xác nhận khi hoàn tất.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style='padding:8px 0 12px 0;'>
                      <p style='margin:0;font-size:10.5pt;'>
                        Trân trọng,<br/><strong>Đội ngũ Lối Riêng Travel</strong>
                      </p>
                    </td>
                  </tr>
                </tbody>
                </table>
                </body>
                </html>";

                await SendEmailAsync(toEmail, subject, body);
                Console.WriteLine($"[Email] Gửi thông báo hủy đơn (chờ hoàn tiền) thành công đến {toEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Email] Lỗi gửi mail hủy đơn: {ex.Message}\n{ex.StackTrace}");
            }
        }

        public async Task SendRefundCompletedAsync(DonDatTour order, ThanhToan thanhToan)
        {
            try
            {
                var fullOrder = await _context.DonDatTours
                    .Include(x => x.KhachHangs)
                    .Include(x => x.NguoiDung)
                    .Include(x => x.ChuyenKhoiHanh).ThenInclude(x => x.Tour)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == order.MaDonDatTour);

                if (fullOrder == null) fullOrder = order;

                string toEmail = fullOrder.KhachHangs?.FirstOrDefault(k => !string.IsNullOrEmpty(k.Email))?.Email
                              ?? fullOrder.NguoiDung?.Email
                              ?? throw new Exception("Không tìm thấy email người nhận");

                string hoTen = fullOrder.NguoiDung?.HoTen ?? "Quý khách";

                string subject = $"[Đã hoàn tiền] Đơn {fullOrder.MaDatCho}";

                string infoRows = Row("Số tiền đã hoàn", $"<b style='color:#008000;'>{FormatPrice(thanhToan.SoTienHoan ?? 0)} đ</b>")
                    + Row("Ngày hoàn tiền", $"{thanhToan.NgayHoanTien:dd/MM/yyyy HH:mm}");

                string body = $@"<!DOCTYPE html>
                    <html lang='vi'>
                    <head><meta charset='UTF-8'></head>
                    <body style='margin:0;padding:0;background:#ffffff;font-family:Roboto,Arial,sans-serif;'>
                    <table width='100%' cellpadding='0' cellspacing='0' style='max-width:640px;margin:0;background:#fff;'>
                    <tbody>
                      <tr>
                        <td style='padding:0;'>
                          <p style='margin:0;padding:12px 0 8px 0;text-align:center;font-size:16pt;font-weight:bold;color:#000;text-transform:uppercase;'>
                            Hoàn tiền thành công
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style='padding:3.75pt 7.5pt;'>
                          <p style='margin:0 0 10px 0;font-size:10.5pt;'>Kính gửi Quý khách <strong>{hoTen}</strong>,</p>
                          <p style='margin:0 0 10px 0;font-size:10.5pt;'>
                            Chúng tôi xác nhận đã hoàn tất việc hoàn tiền cho đơn đặt tour <strong>{fullOrder.MaDatCho}</strong> ({fullOrder.ChuyenKhoiHanh?.Tour?.TenTour}).
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style='padding:0;'>
                          <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tbody>
                              {infoRows}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style='padding:10px 0 4px 0;'>
                          <p style='margin:0;font-size:10.5pt;'>
                            Nếu sau 3-5 ngày làm việc Quý khách chưa nhận được tiền hoàn, vui lòng liên hệ bộ phận CSKH của chúng tôi để được hỗ trợ.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style='padding:8px 0 12px 0;'>
                          <p style='margin:0;font-size:10.5pt;'>
                            Trân trọng,<br/><strong>Đội ngũ Lối Riêng Travel</strong>
                          </p>
                        </td>
                      </tr>
                    </tbody>
                    </table>
                    </body>
                    </html>";

                await SendEmailAsync(toEmail, subject, body);
                Console.WriteLine($"[Email] Gửi xác nhận hoàn tiền thành công đến {toEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Email] Lỗi gửi mail hoàn tiền: {ex.Message}\n{ex.StackTrace}");
            }
        }

        #endregion

        #region Generate Booking Email HTML

        private string GenerateBookingEmailHtml(DonDatTour order)
        {
            string hoTen = order.NguoiDung?.HoTen ?? "Quý khách";
            string sdt = order.NguoiDung?.SoDienThoai ?? "N/A";
            string email = order.NguoiDung?.Email ?? "N/A";
            string diaChi = order.NguoiDung?.DiaChi ?? "";

            string GetPhuongThucText(int? m) => m switch
            {
                1 => "VNPay",
                2 => "Tiền mặt",
                3 => "Chuyển khoản ngân hàng",
                _ => "Chưa thanh toán"
            };

            var latestPayment = order.ThanhToans?
                .OrderByDescending(t => t.NgayThanhToan)
                .FirstOrDefault();

            string titleTransactionInfo = latestPayment?.PhuongThucThanhToan switch
            {
                1 => "Mã giao dịch VNPay",
                2 => "Cách thanh toán",
                3 => "Thông tin chuyển khoản",
                _ => "Trạng thái thanh toán"
            };

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

            string GetPaymentInfoRows()
            {
                var sb = new System.Text.StringBuilder();

                sb.Append(Row("Phương thức thanh toán", GetPhuongThucText(latestPayment?.PhuongThucThanhToan)));
                sb.Append(Row(titleTransactionInfo, transactionInfo));

                string financialStatus = GetFinancialStatusForDisplay(order);
                string financialColor = GetFinancialColorForDisplay(financialStatus);
                sb.Append(Row("Trạng thái tài chính", $"<span style='color:{financialColor};font-weight:bold;'>{financialStatus}</span>"));

                if (order.TrangThaiTaiChinh == BookingConstants.TC_DA_THANH_TOAN_DU)
                {
                    sb.Append(Row("Số tiền đã thanh toán", $"<b style='color:#008000;'>{FormatPrice(order.SoTienDaThanhToan)} đ</b>"));
                }
                else if (order.TrangThaiTaiChinh == BookingConstants.TC_DA_DAT_COC)
                {
                    sb.Append(Row("Số tiền đã cọc", $"<b style='color:#FF8C00;'>{FormatPrice(order.SoTienDaThanhToan)} đ</b>"));
                    decimal conLai = order.TongTien - order.SoTienDaThanhToan;
                    if (conLai > 0)
                    {
                        sb.Append(Row("Số tiền còn lại", $"<b style='color:#c50000;'>{FormatPrice(conLai)} đ</b>"));
                        sb.Append(Row("Lưu ý thanh toán", $"Vui lòng hoàn tất thanh toán trước ngày khởi hành ({order.ChuyenKhoiHanh?.NgayKhoiHanh:dd/MM/yyyy}) để đảm bảo quyền tham gia chương trình du lịch."));
                    }
                }
                else if (order.TrangThaiTaiChinh == BookingConstants.TC_CHUA_THANH_TOAN)
                {
                    sb.Append(Row("Số tiền đã thanh toán", "0 đ"));
                    sb.Append(Row("Số tiền cần thanh toán", $"<b style='color:#c50000;'>{FormatPrice(order.TongTien)} đ</b>"));
                    sb.Append(Row("Lưu ý thanh toán", $"Vui lòng hoàn tất thanh toán trước ngày khởi hành ({order.ChuyenKhoiHanh?.NgayKhoiHanh:dd/MM/yyyy}) để đảm bảo quyền tham gia chương trình du lịch."));
                }
                else if (order.TrangThaiTaiChinh == BookingConstants.TC_MAT_COC)
                {
                    sb.Append(Row("Số tiền đã thanh toán", $"<b style='color:#c50000;'>{FormatPrice(order.SoTienDaThanhToan)} đ</b>"));
                    sb.Append(Row("Ghi chú", "<span style='color:#c50000;'>Khách hàng đã mất cọc do hủy đơn</span>"));
                }
                else if (order.TrangThaiTaiChinh == BookingConstants.TC_DA_HOAN_TIEN)
                {
                    var refundPayment = order.ThanhToans?
                        .FirstOrDefault(p => p.LoaiThanhToan == BookingConstants.LOAI_HOAN_TIEN && p.TrangThaiThanhToan == BookingConstants.TT_THANH_CONG);
                    if (refundPayment != null && refundPayment.SoTienHoan.HasValue)
                    {
                        sb.Append(Row("Số tiền đã hoàn", $"<b style='color:#025da6;'>{FormatPrice(refundPayment.SoTienHoan.Value)} đ</b>"));
                        if (refundPayment.NgayHoanTien.HasValue)
                        {
                            sb.Append(Row("Ngày hoàn", $"{refundPayment.NgayHoanTien.Value:dd/MM/yyyy HH:mm}"));
                        }
                    }
                    else
                    {
                        sb.Append(Row("Số tiền đã hoàn", $"<b style='color:#025da6;'>{FormatPrice(order.SoTienDaThanhToan)} đ</b>"));
                    }
                }
                else if (order.TrangThaiTaiChinh == BookingConstants.TC_DANG_HOAN_TIEN)
                {
                    var refundPayment = order.ThanhToans?
                        .FirstOrDefault(p => p.LoaiThanhToan == BookingConstants.LOAI_HOAN_TIEN && p.TrangThaiThanhToan == BookingConstants.TT_CHO_XU_LY);
                    if (refundPayment != null && refundPayment.SoTienHoan.HasValue)
                    {
                        sb.Append(Row("Số tiền đang hoàn", $"<b style='color:#c50000;'>{FormatPrice(refundPayment.SoTienHoan.Value)} đ</b>"));
                        sb.Append(Row("Trạng thái", "<span style='color:#c50000;font-weight:bold;'>Đang xử lý</span>"));
                    }
                }

                return sb.ToString();
            }

            string RefundPolicyRows()
            {
                return $@"
                <tr>
                  <td colspan='2' style='padding:8px 12px; background:#fff3cd; border:1px solid #ffeeba;'>
                    <p style='margin:0 0 5px 0;font-weight:bold;color:#856404;'>CHÍNH SÁCH HỦY TOUR VÀ HOÀN TIỀN</p>
                    <ul style='margin:0;padding-left:20px;font-size:9.5pt;color:#333;'>
                      <li>Hủy trước 30 ngày: Hoàn 100% số tiền đã thanh toán.</li>
                      <li>Hủy từ 15 đến 29 ngày: Hoàn 70% số tiền đã thanh toán.</li>
                      <li>Hủy từ 7 đến 14 ngày: Hoàn 50% số tiền đã thanh toán.</li>
                      <li>Hủy từ 3 đến 6 ngày: Hoàn 30% số tiền đã thanh toán.</li>
                      <li>Hủy dưới 3 ngày hoặc sau ngày khởi hành: Không hoàn tiền.</li>
                      <li style='margin-top:5px;'><em>Chính sách hoàn tiền được áp dụng theo thời điểm hệ thống ghi nhận yêu cầu hủy tour.</em></li>
                    </ul>
                  </td>
                </tr>";
            }

            string lienLacRows = Row("Họ tên", hoTen)
                + Row("Số điện thoại", sdt)
                + Row("Email", email)
                + (!string.IsNullOrWhiteSpace(diaChi) ? Row("Địa chỉ", diaChi) : "")
                + (!string.IsNullOrWhiteSpace(order.GhiChu) ? Row("Ghi chú", $"<i>{order.GhiChu}</i>") : "");

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
                      <tr>
                        <td style='padding:0;'>
                          <p style='margin:0;padding:12px 0 8px 0;text-align:center;font-size:18pt;font-family:Roboto,Arial,sans-serif;font-weight:bold;color:#000;text-transform:uppercase;letter-spacing:0.5px;'>
                            XÁC NHẬN ĐẶT TOUR
                          </p>
                          <p style='margin:0 0 4px 0;text-align:center;font-size:10pt;color:#666;'>
                            Mã booking: <strong style='color:#c50000;'>{order.MaDatCho}</strong>
                          </p>
                          <p style='margin:0 0 12px 0;text-align:center;font-size:9pt;color:#666;'>
                            Đây là email xác nhận tự động. Vui lòng kiểm tra kỹ thông tin đặt tour và liên hệ với chúng tôi nếu phát hiện sai sót.
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td style='padding:0;'>
                          <p style='margin:8px 0 4px 0;font-family:Roboto,Arial,sans-serif;font-weight:bold;color:#c50000;text-transform:uppercase;font-size:10.5pt;'>
                            I. THÔNG TIN TOUR
                          </p>
                          <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tbody>
                              <tr>
                                <td colspan='2' style='padding:3.75pt 7.5pt;'>
                                  <p style='margin:0 0 7.5pt 0;text-align:justify;line-height:13.5pt;font-size:10.5pt;font-family:Roboto,Arial,sans-serif;color:#025da6;font-weight:bold;'>
                                    {order.ChuyenKhoiHanh?.Tour?.TenTour ?? "N/A"}
                                  </p>
                                </td>
                              </tr>
                              {Row("Mã tour", order.ChuyenKhoiHanh?.MaChuyenCode ?? "N/A")}
                              {Row("Ngày khởi hành", order.ChuyenKhoiHanh != null ? order.ChuyenKhoiHanh.NgayKhoiHanh.ToString("dd/MM/yyyy HH:mm") : "N/A")}
                              {Row("Ngày kết thúc", order.ChuyenKhoiHanh != null ? order.ChuyenKhoiHanh.NgayKetThuc.ToString("dd/MM/yyyy HH:mm") : "N/A")}
                              {Row("Điểm khởi hành", order.ChuyenKhoiHanh?.DiemKhoiHanh ?? "N/A")}
                              {Row("Điểm đến", order.ChuyenKhoiHanh?.DiemDen ?? "N/A")}
                              {Row("Nơi tập trung", diemTapTrung)}
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      <tr>
                        <td style='padding:0;'>
                          <p style='margin:8px 0 4px 0;font-family:Roboto,Arial,sans-serif;font-weight:bold;color:#c50000;text-transform:uppercase;font-size:10.5pt;'>
                            II. THÔNG TIN BOOKING
                          </p>
                          <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tbody>
                              {Row("Mã booking", $"<b style='color:#c50000;'>{order.MaDatCho}</b>")}
                              {Row("Ngày đặt", $"{order.NgayDat:dd/MM/yyyy HH:mm:ss}")}
                              {Row("Tình trạng đơn", $"<span style='color:{GetOrderStatusColor(order.TrangThaiDon)};font-weight:bold;'>{GetOrderStatusName(order.TrangThaiDon)}</span>")}
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      <tr>
                        <td style='padding:0;'>
                          <p style='margin:8px 0 4px 0;font-family:Roboto,Arial,sans-serif;font-weight:bold;color:#c50000;text-transform:uppercase;font-size:10.5pt;'>
                            III. THÔNG TIN THANH TOÁN
                          </p>
                          <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tbody>
                              {GetPaymentInfoRows()}
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      <tr>
                        <td style='padding:0;'>
                          <p style='margin:8px 0 4px 0;font-family:Roboto,Arial,sans-serif;font-weight:bold;color:#c50000;text-transform:uppercase;font-size:10.5pt;'>
                            IV. GIÁ TRỊ ĐƠN ĐẶT TOUR
                          </p>
                          <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tbody>
                              {CostRows()}
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      <tr>
                        <td style='padding:0;'>
                          <p style='margin:8px 0 4px 0;font-family:Roboto,Arial,sans-serif;font-weight:bold;color:#c50000;text-transform:uppercase;font-size:10.5pt;'>
                            V. THÔNG TIN NGƯỜI ĐẶT TOUR
                          </p>
                          <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tbody>
                              {lienLacRows}
                            </tbody>
                          </table>
                        </td>
                      </tr>

                      {RefundPolicyRows()}

                      <tr>
                        <td style='padding:8px 0 4px 0;'>
                          <p style='margin:0;font-size:10.5pt;font-family:Roboto,Arial,sans-serif;font-weight:bold;color:#025da6;'>
                            Cảm ơn Quý khách đã lựa chọn Lối Riêng Travel. Chúng tôi sẽ tiếp tục cập nhật các thông tin liên quan đến chuyến đi qua email và hệ thống.
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td style='padding:0 0 12px 0;'>
                          <p style='margin:0;font-size:10.5pt;font-family:Roboto,Arial,sans-serif;'>
                            Trân trọng,<br/>
                            <strong style='color:#c50000;'>Đội ngũ Lối Riêng Travel</strong>
                          </p>
                          <p style='margin:5px 0 0 0;font-size:9pt;color:#888;'>
                            Email: support@loiriengtravel.com | Hotline: 1900 1234
                          </p>
                        </td>
                      </tr>

                    </tbody>
                    </table>
                    </body>
                    </html>";
        }

        #endregion


        public async Task SendRefundConfirmedByUserAsync(DonDatTour order, ThanhToan thanhToan)
        {
            try
            {
                var fullOrder = await _context.DonDatTours
                    .Include(x => x.KhachHangs)
                    .Include(x => x.NguoiDung)
                    .Include(x => x.ChuyenKhoiHanh).ThenInclude(x => x.Tour)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == order.MaDonDatTour);

                if (fullOrder == null) fullOrder = order;

                string toEmail = fullOrder.NguoiDung?.Email
                              ?? throw new Exception("Không tìm thấy email người nhận");

                string hoTen = fullOrder.NguoiDung?.HoTen ?? "Quý khách";

                string subject = $"[Xác nhận nhận tiền hoàn] Đơn {fullOrder.MaDatCho}";

                string confirmRows = Row("Số tiền đã nhận", $"<b style='color:#008000;'>{FormatPrice(thanhToan.SoTienHoan ?? 0)} đ</b>")
                    + Row("Ngày xác nhận", $"{DateTime.Now:dd/MM/yyyy HH:mm}");

                string body = $@"<!DOCTYPE html>
                    <html lang='vi'>
                    <head><meta charset='UTF-8'></head>
                    <body style='margin:0;padding:0;background:#ffffff;font-family:Roboto,Arial,sans-serif;'>
                    <table width='100%' cellpadding='0' cellspacing='0' style='max-width:640px;margin:0;background:#fff;'>
                    <tbody>
                      <tr>
                        <td style='padding:0;'>
                          <p style='margin:0;padding:12px 0 8px 0;text-align:center;font-size:16pt;font-weight:bold;color:#008000;text-transform:uppercase;'>
                            Xác nhận đã nhận tiền hoàn
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style='padding:3.75pt 7.5pt;'>
                          <p style='margin:0 0 10px 0;font-size:10.5pt;'>Kính gửi Quý khách <strong>{hoTen}</strong>,</p>
                          <p style='margin:0 0 10px 0;font-size:10.5pt;'>
                            Cảm ơn Quý khách đã xác nhận đã nhận được tiền hoàn cho đơn đặt tour <strong>{fullOrder.MaDatCho}</strong>.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style='padding:0;'>
                          <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                            <tbody>
                              {confirmRows}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style='padding:10px 7.5pt 0 7.5pt;'>
                          <p style='margin:0 0 10px 0;font-size:10.5pt;'>
                            Quý khách vui lòng kiểm tra lại tài khoản đã nhận đủ số tiền trên.
                          </p>
                          <p style='margin:0 0 10px 0;font-size:10.5pt;'>
                            Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ bộ phận CSKH của chúng tôi.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style='padding:8px 0 12px 0;'>
                          <p style='margin:0;font-size:10.5pt;'>
                            Trân trọng,<br/><strong>Đội ngũ Lối Riêng Travel</strong>
                          </p>
                          <p style='margin:5px 0 0 0;font-size:9pt;color:#888;'>
                            Email: support@loiriengtravel.com | Hotline: 1900 1234
                          </p>
                        </td>
                      </tr>
                    </tbody>
                    </table>
                    </body>
                    </html>";

                await SendEmailAsync(toEmail, subject, body);
                Console.WriteLine($"[Email] Gửi xác nhận người dùng đã nhận hoàn tiền thành công đến {toEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Email] Lỗi gửi mail xác nhận đã nhận hoàn tiền: {ex.Message}\n{ex.StackTrace}");
            }
        }
    }
}