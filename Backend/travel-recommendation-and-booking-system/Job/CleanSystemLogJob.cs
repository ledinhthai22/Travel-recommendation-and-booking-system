using Hangfire;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Job
{
    public class CleanSystemLogJob
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CleanSystemLogJob> _logger;

        public CleanSystemLogJob(AppDbContext context, ILogger<CleanSystemLogJob> logger)
        {
            _context = context;
            _logger = logger;
        }

        [AutomaticRetry(Attempts = 3)]
        public async Task ExecuteAsync()
        {
            try
            {
                // Xác định ngày cần giữ lại (30 ngày trước)
                var cutoffDate = DateTime.Now.AddDays(-45);

                // Đếm số lượng log sẽ bị xóa
                var logsToDelete = await _context.NhatKyHeThongs
                    .Where(l => l.ThoiGianTao < cutoffDate)
                    .ToListAsync();

                if (logsToDelete.Any())
                {
                    // Xóa log cũ
                    _context.NhatKyHeThongs.RemoveRange(logsToDelete);
                    await _context.SaveChangesAsync();

                    // Ghi log hành động xóa (tùy chọn)
                    await CreateCleanupLogAsync(logsToDelete.Count, cutoffDate);

                    _logger.LogInformation($"[CleanSystemLogJob] Đã xóa {logsToDelete.Count} log hệ thống cũ hơn {cutoffDate:dd/MM/yyyy HH:mm}");
                    Console.WriteLine($"[CleanSystemLogJob] Đã xóa {logsToDelete.Count} log hệ thống cũ hơn {cutoffDate:dd/MM/yyyy HH:mm}");
                }
                else
                {
                    _logger.LogInformation("[CleanSystemLogJob] Không có log hệ thống nào cần xóa.");
                    Console.WriteLine("[CleanSystemLogJob] Không có log hệ thống nào cần xóa.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[CleanSystemLogJob] Lỗi: {ex.Message}");
                Console.WriteLine($"[CleanSystemLogJob] Lỗi: {ex.Message}");
                throw;
            }
        }

        private async Task CreateCleanupLogAsync(int deletedCount, DateTime cutoffDate)
        {
            try
            {
                var cleanupLog = new NhatKyHeThong
                {
                    LoaiTaiKhoan = "System",
                    Email = "system@cleanup",
                    MaTaiKhoan = 0,
                    TenHanhDong = "Xóa log hệ thống",
                    TenBangTacDong = "NhatKyHeThong",
                    MaDoiTuong = null,
                    GiaTriTruoc = null,
                    GiaTriSau = $"Đã xóa {deletedCount} log cũ hơn {cutoffDate:dd/MM/yyyy HH:mm}",
                    DiaChiIP = "127.0.0.1",
                    TrinhDuyet = "System",
                    ThoiGianTao = DateTime.Now
                };

                _context.NhatKyHeThongs.Add(cleanupLog);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"[CleanSystemLogJob] Lỗi khi tạo log cleanup: {ex.Message}");
                Console.WriteLine($"[CleanSystemLogJob] Lỗi khi tạo log cleanup: {ex.Message}");
            }
        }
    }
}