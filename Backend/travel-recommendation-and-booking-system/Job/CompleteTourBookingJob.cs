using Hangfire;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Constants;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.DTOs.LogSystem;
using travel_recommendation_and_booking_system.DTOs.Notifications;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Job
{
    public class CompleteTourBookingJob
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CompleteTourBookingJob> _logger;
        private readonly INotificationService _notificationService;
        private readonly IDashboardNotifier _dashboardNotifier;
        private readonly ILogService _logService;
        private readonly ICurrentUserService _currentUserService;

        public CompleteTourBookingJob(
            AppDbContext context,
            ILogger<CompleteTourBookingJob> logger,
            INotificationService notificationService,
            IDashboardNotifier dashboardNotifier,
            ILogService logService,
            ICurrentUserService currentUserService)
        {
            _context = context;
            _logger = logger;
            _notificationService = notificationService;
            _dashboardNotifier = dashboardNotifier;
            _logService = logService;
            _currentUserService = currentUserService;
        }

        [AutomaticRetry(Attempts = 3, OnAttemptsExceeded = AttemptsExceededAction.Fail)]
        public async Task ExecuteAsync()
        {
            try
            {
                var now = DateTime.Now;

                // Lấy các đơn đặt tour có:
                // - Trạng thái = 2 (Đã duyệt)
                // - Chuyến khởi hành đã kết thúc (NgayKetThuc < now)
                // - Chưa được hoàn tất
                var bookingsToComplete = await _context.DonDatTours
                    .Include(x => x.NguoiDung)
                    .Include(x => x.ChuyenKhoiHanh)
                    .Include(x => x.ThanhToans)
                    .Include(x => x.NhanVien)
                    .Where(x => x.TrangThaiDon == 2
                                && x.ChuyenKhoiHanh!.NgayKetThuc < now)
                    .ToListAsync();

                if (!bookingsToComplete.Any())
                {
                    _logger.LogInformation("[CompleteTourBookingJob] Không có đơn nào cần hoàn tất.");
                    Console.WriteLine("[CompleteTourBookingJob] Không có đơn nào cần hoàn tất.");
                    return;
                }

                int completedCount = 0;
                int failedCount = 0;

                foreach (var booking in bookingsToComplete)
                {
                    try
                    {
                        // Kiểm tra thanh toán đã thành công chưa
                        var trangThaiThanhToan = booking.ThanhToans
                            .OrderByDescending(t => t.NgayThanhToan)
                            .Select(t => (int?)t.TrangThaiThanhToan)
                            .FirstOrDefault() ?? 0;

                        // Nếu chưa thanh toán thành công, không tự động hoàn tất
                        if (trangThaiThanhToan != 1)
                        {
                            _logger.LogWarning($"[CompleteTourBookingJob] Đơn {booking.MaDatCho} chưa thanh toán thành công, không hoàn tất.");
                            continue;
                        }

                        var oldStatus = booking.TrangThaiDon;

                        // Cập nhật trạng thái
                        booking.TrangThaiDon = 3; // Hoàn tất
                        booking.NgayCapNhat = now;

                        await _context.SaveChangesAsync();

                        // Gửi thông báo cho khách hàng
                        await _notificationService.CreateForUserAsync(
                            booking.MaNguoiDung,
                            new CreateNotificationDTO
                            {
                                TieuDe = "Chuyến đi đã hoàn tất",
                                NoiDung = $"Cảm ơn bạn đã đồng hành cùng chúng tôi. Đơn {booking.MaDatCho} - {booking.ChuyenKhoiHanh?.Tour?.TenTour} đã hoàn tất.",
                                LoaiThongBao = (int)NotificationType.Booking,
                                LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                            });

                        // Ghi log hệ thống
                        await _logService.LoggingAsync(new LogDTO
                        {
                            LoaiTaiKhoan = AccountTypeDTO.HeThong,
                            Email = "system@auto-complete",
                            MaTaiKhoan = 0,
                            TenHanhDong = ActionLogDTO.CapNhat,
                            TenBangTacDong = TableNameDTO.DonDatTour,
                            MaDoiTuong = booking.MaDonDatTour,
                            GiaTriTruoc = new { TrangThaiDon = oldStatus },
                            GiaTriSau = new { TrangThaiDon = 3, LyDo = "Tự động hoàn tất do tour đã kết thúc" }
                        });

                        // Thông báo realtime cho dashboard
                        await _dashboardNotifier.NotifyDashboardChangedAsync("OrderStatusChanged", new
                        {
                            booking.MaDonDatTour,
                            TrangThaiMoi = 3,
                            LyDo = "Tour đã kết thúc"
                        });

                        completedCount++;
                        _logger.LogInformation($"[CompleteTourBookingJob] Đã hoàn tất đơn {booking.MaDatCho} (ID: {booking.MaDonDatTour})");
                    }
                    catch (Exception ex)
                    {
                        failedCount++;
                        _logger.LogError($"[CompleteTourBookingJob] Lỗi khi hoàn tất đơn {booking.MaDatCho}: {ex.Message}");
                    }
                }

                _logger.LogInformation($"[CompleteTourBookingJob] Hoàn tất: Đã xử lý {bookingsToComplete.Count} đơn, thành công: {completedCount}, thất bại: {failedCount}");
                Console.WriteLine($"[CompleteTourBookingJob] Hoàn tất: Đã xử lý {bookingsToComplete.Count} đơn, thành công: {completedCount}, thất bại: {failedCount}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[CompleteTourBookingJob] Lỗi tổng thể: {ex.Message}");
                Console.WriteLine($"[CompleteTourBookingJob] Lỗi tổng thể: {ex.Message}");
                throw;
            }
        }
    }
}