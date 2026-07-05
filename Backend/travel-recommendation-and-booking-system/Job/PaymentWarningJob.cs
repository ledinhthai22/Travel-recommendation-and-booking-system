using Hangfire;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.DTOs.LogSystem;
using travel_recommendation_and_booking_system.DTOs.Notifications;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Job
{
    public class PaymentWarningJob
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ILogService _logService;
        private readonly ICurrentUserService _currentUserService;
        private readonly INotificationService _notificationService;

        public PaymentWarningJob(AppDbContext context, IEmailService emailService, ILogService logService, ICurrentUserService currentUserService, INotificationService notificationService)
        {
            _context = context;
            _emailService = emailService;
            _logService = logService;
            _currentUserService = currentUserService;
            _notificationService = notificationService;
        }

        public async Task SendPaymentReminders()
        {
            var targetDate = DateTime.Now.Date.AddDays(7);
            var nextDate = targetDate.AddDays(1);

            var bookings = await _context.DonDatTours
                .Include(d => d.ChuyenKhoiHanh)
                .Include(d => d.ThanhToans)
                .Include(d => d.NguoiDung)
               .Where(d =>
                    d.TrangThaiDon == 1 &&  // chờ duyệt = chưa thu tiền
                    d.ThanhToans.Any(t => t.PhuongThucThanhToan == 2 && t.TrangThaiThanhToan == 0) &&
                    d.ChuyenKhoiHanh!.NgayKhoiHanh >= targetDate &&
                    d.ChuyenKhoiHanh!.NgayKhoiHanh < nextDate)
                .ToListAsync();

            Console.WriteLine($"[Reminder 7 ngày] Tìm thấy {bookings.Count} đơn cần nhắc.");

            foreach (var order in bookings)
            {
                try
                {
                    if (!string.IsNullOrWhiteSpace(order.NguoiDung?.Email))
                    {
                        await _emailService.SendPaymentReminderAsync(order);
                        Console.WriteLine($"[Reminder 7 ngày] Đã gửi mail cho đơn {order.MaDatCho}");
                    }
                    else
                    {
                        Console.WriteLine($"[Reminder] Không tìm thấy email cho đơn {order.MaDatCho}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Reminder] Lỗi gửi mail đơn {order.MaDatCho}: {ex.Message}");
                }
            }
        }


        public async Task CancelExpiredCashBookings()
        {
            var deadlineDate = DateTime.Now.Date.AddDays(3);

            var bookingsToCancel = await _context.DonDatTours
                .Include(d => d.ChuyenKhoiHanh)
                .Include(d => d.ThanhToans)
                .Include(d => d.NguoiDung)
                .Where(d =>
                    d.TrangThaiDon == 1 &&
                    d.ThanhToans.Any(t => t.PhuongThucThanhToan == 2 && t.TrangThaiThanhToan == 0) &&
                    d.ChuyenKhoiHanh!.NgayKhoiHanh < deadlineDate)
                .ToListAsync();

            Console.WriteLine($"[Hủy đơn] Tìm thấy {bookingsToCancel.Count} đơn cần hủy.");

            const string lyDoHuyTuDong = "Hệ thống tự động hủy do quá hạn thanh toán tiền mặt (3 ngày trước khởi hành)";

            foreach (var order in bookingsToCancel)
            {
                try
                {
                    var oldStatusDon = order.TrangThaiDon;

                    // Hủy đơn
                    order.TrangThaiDon = 4;
                    order.LyDoHuy = lyDoHuyTuDong;
                    order.NgayCapNhat = DateTime.Now;

                    // Cộng lại số chỗ
                    int tongKhach = order.SoNguoiLon + order.SoTreEm + order.SoEmBe;
                    order.ChuyenKhoiHanh!.SoChoDaDat = Math.Max(0, order.ChuyenKhoiHanh.SoChoDaDat - tongKhach);

                    await _context.SaveChangesAsync();

                    Console.WriteLine($"[Hủy đơn] Đã hủy {order.MaDatCho}, hoàn {tongKhach} chỗ cho chuyến {order.ChuyenKhoiHanh.MaChuyenCode}. SoChoDaDat còn: {order.ChuyenKhoiHanh.SoChoDaDat}");

                    // Thông báo real-time trong hệ thống
                    await _notificationService.CreateForUserAsync(
                        order.MaNguoiDung,
                        new CreateNotificationDTO
                        {
                            TieuDe = "Đơn đặt tour đã bị hủy",
                            NoiDung = $"Đơn {order.MaDatCho} đã bị hủy tự động do quá hạn thanh toán tiền mặt.",
                            LoaiThongBao = (int)NotificationType.Booking,
                            LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                        });

                    // Email
                    if (!string.IsNullOrWhiteSpace(order.NguoiDung?.Email))
                    {
                        await _emailService.SendBookingCancelledAsync(order);
                    }

                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Hủy] Lỗi hủy đơn {order.MaDatCho}: {ex.Message}");
                }
            }
        }
    }
}