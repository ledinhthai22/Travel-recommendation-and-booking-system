using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Constants;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Common;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.DTOs.LogSystem;
using travel_recommendation_and_booking_system.DTOs.Notifications;
using travel_recommendation_and_booking_system.DTOs.TourBooking;
using travel_recommendation_and_booking_system.DTOs.UserProfile;
using travel_recommendation_and_booking_system.Helpers;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;
using System.Diagnostics;

namespace travel_recommendation_and_booking_system.Services
{
    public class RefundService : IRefundService
    {
        private readonly AppDbContext _context;
        private readonly ILogService _logService;
        private readonly ICurrentUserService _currentUserService;
        private readonly IEmailService _emailService;
        private readonly INotificationService _notificationService;
        private readonly IDashboardNotifier _dashboardNotifier;
        private readonly ILogger<RefundService> _logger;

        #region Constants

        private const int TC_CHUA_THANH_TOAN = BookingConstants.TC_CHUA_THANH_TOAN;
        private const int TC_DA_DAT_COC = BookingConstants.TC_DA_DAT_COC;
        private const int TC_DA_THANH_TOAN_DU = BookingConstants.TC_DA_THANH_TOAN_DU;
        private const int TC_DANG_HOAN_TIEN = BookingConstants.TC_DANG_HOAN_TIEN;
        private const int TC_DA_HOAN_TIEN = BookingConstants.TC_DA_HOAN_TIEN;
        private const int TC_MAT_COC = BookingConstants.TC_MAT_COC;

        private const int DON_CHO_THANH_TOAN = BookingConstants.DON_CHO_THANH_TOAN;
        private const int DON_CHO_DUYET = BookingConstants.DON_CHO_DUYET;
        private const int DON_DA_DUYET = BookingConstants.DON_DA_DUYET;
        private const int DON_DANG_DIEN_RA = BookingConstants.DON_DANG_DIEN_RA;
        private const int DON_HOAN_TAT = BookingConstants.DON_HOAN_TAT;
        private const int DON_DA_HUY = BookingConstants.DON_DA_HUY;

        private const int TT_CHO_XU_LY = BookingConstants.TT_CHO_XU_LY;
        private const int TT_THANH_CONG = BookingConstants.TT_THANH_CONG;
        private const int TT_THAT_BAI = BookingConstants.TT_THAT_BAI;
        private const int TT_DA_HUY = BookingConstants.TT_DA_HUY;

        private const int LOAI_DAT_COC = BookingConstants.LOAI_DAT_COC;
        private const int LOAI_THANH_TOAN_PHAN_CON_LAI = BookingConstants.LOAI_THANH_TOAN_PHAN_CON_LAI;
        private const int LOAI_THANH_TOAN_TOAN_BO = BookingConstants.LOAI_THANH_TOAN_TOAN_BO;
        private const int LOAI_HOAN_TIEN = BookingConstants.LOAI_HOAN_TIEN;

        private const int PTTT_VNPAY = BookingConstants.PTTT_VNPAY;
        private const int PTTT_TIEN_MAT = BookingConstants.PTTT_TIEN_MAT;
        private const int PTTT_CHUYEN_KHOAN = BookingConstants.PTTT_CHUYEN_KHOAN;

        #endregion

        public RefundService(
            AppDbContext context,
            ILogService logService,
            ICurrentUserService currentUserService,
            IEmailService emailService,
            INotificationService notificationService,
            IDashboardNotifier dashboardNotifier,
            ILogger<RefundService> logger)
        {
            _context = context;
            _logService = logService;
            _currentUserService = currentUserService;
            _emailService = emailService;
            _notificationService = notificationService;
            _dashboardNotifier = dashboardNotifier;
            _logger = logger;
        }

        #region Helper Methods

        private static string GetFinancialStatusName(int status) => BookingConstants.GetFinancialStatusName(status);
        private static string GetOrderStatusName(int status) => BookingConstants.GetOrderStatusName(status);
        private static string GetPaymentStatusName(int status) => BookingConstants.GetPaymentStatusName(status);
        private static string GetPaymentMethodName(int method) => BookingConstants.GetPaymentMethodName(method);
        private static bool IsOrderCancelled(int status) => BookingConstants.IsOrderCancelled(status);
        private static bool IsOrderCompleted(int status) => BookingConstants.IsOrderCompleted(status);

        private string FormatPrice(decimal price)
        {
            return price.ToString("#,##0", System.Globalization.CultureInfo.InvariantCulture)
                        .Replace(",", ".");
        }

        private static ThanhToan? GetRefundPayment(ICollection<ThanhToan> payments)
        {
            return payments?.Where(p => p.LoaiThanhToan == LOAI_HOAN_TIEN)
                           .OrderByDescending(p => p.NgayThanhToan)
                           .FirstOrDefault();
        }

        private static ThanhToan? GetLatestPayment(ICollection<ThanhToan> payments)
        {
            return payments?.OrderByDescending(p => p.NgayThanhToan).FirstOrDefault();
        }

        private static int GetLatestPaymentStatus(ICollection<ThanhToan> payments)
        {
            return payments?.OrderByDescending(p => p.NgayThanhToan)
                           .Select(p => p.TrangThaiThanhToan)
                           .FirstOrDefault() ?? 0;
        }

        private async Task<string> GetNhanVienNameAsync(int maNhanVien)
        {
            var ten = await _context.NhanViens
                .Where(x => x.MaNhanVien == maNhanVien && x.NgayXoa == null)
                .Select(x => x.HoTen)
                .FirstOrDefaultAsync();

            return string.IsNullOrEmpty(ten) ? $"NV{maNhanVien}" : ten;
        }

        // Debug helper method
        private void LogDebug(string method, string message, object? data = null)
        {
            var logMessage = $"[{method}] {message}";
            if (data != null)
            {
                logMessage += $" | Data: {System.Text.Json.JsonSerializer.Serialize(data)}";
            }

            Console.WriteLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff} - {logMessage}");
            _logger.LogDebug(logMessage);
        }

        private void LogError(string method, string message, Exception? ex = null)
        {
            var logMessage = $"[{method}] ERROR: {message}";
            Console.WriteLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff} - {logMessage}");

            if (ex != null)
            {
                Console.WriteLine($"Exception: {ex.GetType().Name}");
                Console.WriteLine($"Message: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"InnerException: {ex.InnerException.Message}");
                    Console.WriteLine($"InnerStackTrace: {ex.InnerException.StackTrace}");
                }
                _logger.LogError(ex, logMessage);
            }
            else
            {
                _logger.LogError(logMessage);
            }
        }

        #endregion

        #region Refund Management

        public async Task<RefundPolicyDTO> CalculateRefundPolicyAsync(int maDonDatTour)
        {
            var method = nameof(CalculateRefundPolicyAsync);
            LogDebug(method, $"Bắt đầu tính chính sách hoàn tiền cho đơn {maDonDatTour}");

            try
            {
                var order = await _context.DonDatTours
                    .Include(x => x.ChuyenKhoiHanh)
                    .Include(x => x.ThanhToans)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour)
                    ?? throw new KeyNotFoundException("Không tìm thấy đơn đặt tour");

                LogDebug(method, $"Đã tìm thấy đơn: MaDatCho={order.MaDatCho}, NgayKhoiHanh={order.ChuyenKhoiHanh?.NgayKhoiHanh:yyyy-MM-dd}");

                var policy = RefundPolicyEngine.CalculateRefundPolicy(
                    order.ChuyenKhoiHanh.NgayKhoiHanh,
                    DateTime.Now
                );

                LogDebug(method, $"Chính sách: DaysBeforeDeparture={policy.DaysBeforeDeparture}, RefundRate={policy.RefundRate}, IsRefundable={policy.IsRefundable}");

                var successfulPayment = order.ThanhToans?
                    .Where(p => p.TrangThaiThanhToan == TT_THANH_CONG && p.LoaiThanhToan != LOAI_HOAN_TIEN)
                    .OrderByDescending(p => p.NgayThanhToan)
                    .FirstOrDefault();

                var result = new RefundPolicyDTO
                {
                    DaysBeforeDeparture = policy.DaysBeforeDeparture,
                    RefundRate = policy.RefundRate,
                    Policy = policy.Policy,
                    IsRefundable = policy.IsRefundable,
                    EstimatedRefundAmount = successfulPayment != null
                        ? Math.Round(successfulPayment.TongTienThanhToan * policy.RefundRate, 0)
                        : 0,
                    EstimatedLostAmount = successfulPayment != null
                        ? Math.Round(successfulPayment.TongTienThanhToan * (1 - policy.RefundRate), 0)
                        : 0
                };

                LogDebug(method, $"Kết quả: EstimatedRefundAmount={result.EstimatedRefundAmount}, EstimatedLostAmount={result.EstimatedLostAmount}");
                return result;
            }
            catch (Exception ex)
            {
                LogError(method, $"Lỗi tính chính sách hoàn tiền cho đơn {maDonDatTour}", ex);
                throw;
            }
        }

        public async Task<bool> ConfirmRefundAsync(int maThanhToan, int maNhanVien)
        {
            var method = nameof(ConfirmRefundAsync);
            LogDebug(method, $"=== BẮT ĐẦU ===");
            LogDebug(method, $"maThanhToan={maThanhToan}, maNhanVien={maNhanVien}");

            var stopwatch = Stopwatch.StartNew();

            try
            {
                LogDebug(method, "Đang truy vấn dữ liệu giao dịch...");

                var thanhToan = await _context.ThanhToans
                    .Include(t => t.DonDatTour)
                        .ThenInclude(d => d.NguoiDung)
                    .Include(t => t.DonDatTour)
                        .ThenInclude(d => d.ChuyenKhoiHanh)
                            .ThenInclude(c => c.Tour)
                    .FirstOrDefaultAsync(t => t.MaThanhToan == maThanhToan)
                    ?? throw new KeyNotFoundException("Không tìm thấy giao dịch");

                LogDebug(method, $"Đã tìm thấy giao dịch: MaThanhToan={thanhToan.MaThanhToan}, LoaiThanhToan={thanhToan.LoaiThanhToan}, TrangThai={thanhToan.TrangThaiThanhToan}");
                LogDebug(method, $"Order: MaDatCho={thanhToan.DonDatTour?.MaDatCho}, TongTien={thanhToan.DonDatTour?.TongTien}");
                LogDebug(method, $"Khách hàng: Email={thanhToan.DonDatTour?.NguoiDung?.Email}, HoTen={thanhToan.DonDatTour?.NguoiDung?.HoTen}");
                LogDebug(method, $"Số tiền hoàn: {thanhToan.SoTienHoan}");

                // Validate
                if (thanhToan.LoaiThanhToan != LOAI_HOAN_TIEN)
                {
                    LogError(method, $"Giao dịch không phải là hoàn tiền: LoaiThanhToan={thanhToan.LoaiThanhToan}");
                    throw new InvalidOperationException("Giao dịch không phải là hoàn tiền");
                }

                if (thanhToan.TrangThaiThanhToan != TT_CHO_XU_LY)
                {
                    LogError(method, $"Giao dịch không ở trạng thái chờ xử lý: TrangThai={thanhToan.TrangThaiThanhToan}");
                    throw new InvalidOperationException("Giao dịch không ở trạng thái chờ xử lý hoàn tiền");
                }

                if (thanhToan.SoTienHoan == null || thanhToan.SoTienHoan <= 0)
                {
                    LogError(method, $"Số tiền hoàn không hợp lệ: {thanhToan.SoTienHoan}");
                    throw new InvalidOperationException("Số tiền hoàn không hợp lệ");
                }

                if (thanhToan.NgayHoanTien != null)
                {
                    LogError(method, $"Giao dịch đã được xác nhận trước đó: NgayHoanTien={thanhToan.NgayHoanTien}");
                    throw new InvalidOperationException("Giao dịch này đã được xác nhận trước đó");
                }

                var oldStatus = thanhToan.TrangThaiThanhToan;
                var nhanVien = await GetNhanVienNameAsync(maNhanVien);
                LogDebug(method, $"Tên nhân viên xử lý: {nhanVien}");

                // Update refund payment
                thanhToan.TrangThaiThanhToan = TT_THANH_CONG;
                thanhToan.NgayHoanTien = DateTime.Now;
                thanhToan.MaNhanVienXuLyHoan = maNhanVien;
                thanhToan.NoiDung = (thanhToan.NoiDung ?? "") + $" - Admin {nhanVien} xác nhận hoàn tiền";
                thanhToan.NgayXacNhan = DateTime.Now;

                LogDebug(method, $"Đã cập nhật giao dịch: TrangThai={thanhToan.TrangThaiThanhToan}, NgayHoanTien={thanhToan.NgayHoanTien}");

                var order = thanhToan.DonDatTour;
                if (order != null)
                {
                    order.TrangThaiTaiChinh = TC_DA_HOAN_TIEN;
                    order.NgayCapNhat = DateTime.Now;

                    order.AppendStatusHistory(
                        DON_DA_HUY,
                        DON_DA_HUY,
                        "Xác nhận hoàn tiền",
                        $"Admin {nhanVien} xác nhận hoàn {thanhToan.SoTienHoan:N0}đ"
                    );

                    LogDebug(method, $"Đã cập nhật đơn: TrangThaiTaiChinh={order.TrangThaiTaiChinh}");
                }

                await _context.SaveChangesAsync();
                LogDebug(method, $"Đã lưu vào database (thời gian: {stopwatch.ElapsedMilliseconds}ms)");

                // GỬI EMAIL - CÓ LOG CHI TIẾT
                try
                {
                    LogDebug(method, "Bắt đầu gửi email hoàn tiền...");

                    if (order == null)
                    {
                        LogError(method, "KHÔNG GỬI EMAIL: Order null");
                    }
                    else if (order.NguoiDung == null)
                    {
                        LogError(method, "KHÔNG GỬI EMAIL: NguoiDung null");
                    }
                    else if (string.IsNullOrEmpty(order.NguoiDung.Email))
                    {
                        LogError(method, $"KHÔNG GỬI EMAIL: Email khách hàng rỗng (MaNguoiDung={order.MaNguoiDung})");
                    }
                    else
                    {
                        LogDebug(method, $"Đang gửi email đến: {order.NguoiDung.Email}");
                        await _emailService.SendRefundCompletedAsync(order, thanhToan);
                        LogDebug(method, "GỬI EMAIL THÀNH CÔNG!");
                    }
                }
                catch (Exception ex)
                {
                    LogError(method, "LỖI GỬI EMAIL", ex);
                    // Không throw để không làm gián đoạn flow
                }

                // GỬI NOTIFICATION
                try
                {
                    LogDebug(method, "Bắt đầu tạo notification...");
                    if (order != null)
                    {
                        await _notificationService.CreateForUserAsync(
                            order.MaNguoiDung,
                            new CreateNotificationDTO
                            {
                                TieuDe = "Hoàn tiền thành công",
                                NoiDung = $"Đơn {order.MaDatCho} đã được hoàn tiền {FormatPrice(thanhToan.SoTienHoan ?? 0)}đ.",
                                LoaiThongBao = (int)NotificationType.Payment,
                                LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                            });
                        LogDebug(method, "Tạo notification thành công");
                    }
                }
                catch (Exception ex)
                {
                    LogError(method, "Lỗi tạo notification", ex);
                }

                // GHI LOG
                try
                {
                    LogDebug(method, "Bắt đầu ghi log...");
                    await _logService.LoggingAsync(new LogDTO
                    {
                        LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                        Email = _currentUserService.GetEmail(),
                        MaTaiKhoan = maNhanVien,
                        TenHanhDong = ActionLogDTO.XacNhanHoanTien,
                        TenBangTacDong = TableNameDTO.ThanhToan,
                        MaDoiTuong = maThanhToan,
                        GiaTriTruoc = new { TrangThaiThanhToan = oldStatus },
                        GiaTriSau = new
                        {
                            thanhToan.NgayHoanTien,
                            thanhToan.SoTienHoan,
                            MaNhanVienXuLyHoan = maNhanVien,
                            TrangThaiThanhToan = thanhToan.TrangThaiThanhToan
                        }
                    });
                    LogDebug(method, "Ghi log thành công");
                }
                catch (Exception ex)
                {
                    LogError(method, "Lỗi ghi log", ex);
                }

                // NOTIFY DASHBOARD
                try
                {
                    LogDebug(method, "Bắt đầu notify dashboard...");
                    await _dashboardNotifier.NotifyDashboardChangedAsync("RefundConfirmed", new
                    {
                        order?.MaDonDatTour,
                        TrangThaiTaiChinh = order?.TrangThaiTaiChinh
                    });
                    LogDebug(method, "Notify dashboard thành công");
                }
                catch (Exception ex)
                {
                    LogError(method, "Lỗi notify dashboard", ex);
                }

                LogDebug(method, $"=== KẾT THÚC (thời gian: {stopwatch.ElapsedMilliseconds}ms) ===");
                return true;
            }
            catch (KeyNotFoundException ex)
            {
                LogError(method, "Không tìm thấy dữ liệu", ex);
                throw;
            }
            catch (InvalidOperationException ex)
            {
                LogError(method, "Lỗi nghiệp vụ", ex);
                throw;
            }
            catch (Exception ex)
            {
                LogError(method, "LỖI KHÔNG XÁC ĐỊNH", ex);
                throw;
            }
        }

        public async Task<bool> ConfirmRefundForOrderAsync(int maDonDatTour)
        {
            var method = nameof(ConfirmRefundForOrderAsync);
            LogDebug(method, $"Bắt đầu xác nhận hoàn tiền cho đơn {maDonDatTour}");

            try
            {
                var order = await _context.DonDatTours
                    .Include(x => x.ThanhToans)
                    .Include(x => x.NguoiDung)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour)
                    ?? throw new KeyNotFoundException("Không tìm thấy đơn đặt tour");

                LogDebug(method, $"Đã tìm thấy đơn: MaDatCho={order.MaDatCho}, TrangThaiTaiChinh={order.TrangThaiTaiChinh}");

                if (order.TrangThaiTaiChinh != TC_DANG_HOAN_TIEN)
                {
                    LogError(method, $"Đơn không ở trạng thái đang hoàn tiền: {order.TrangThaiTaiChinh}");
                    throw new InvalidOperationException("Đơn không ở trạng thái đang hoàn tiền.");
                }

                var refundPayment = GetRefundPayment(order.ThanhToans);
                if (refundPayment == null || refundPayment.TrangThaiThanhToan != TT_CHO_XU_LY)
                {
                    LogError(method, "Không tìm thấy giao dịch hoàn tiền đang chờ xử lý");
                    throw new InvalidOperationException("Không tìm thấy giao dịch hoàn tiền đang chờ xử lý.");
                }

                LogDebug(method, $"Tìm thấy giao dịch hoàn tiền: MaThanhToan={refundPayment.MaThanhToan}, SoTienHoan={refundPayment.SoTienHoan}");

                var oldStatus = refundPayment.TrangThaiThanhToan;
                var maNhanVien = _currentUserService.GetUserId();
                var nhanVien = await GetNhanVienNameAsync(maNhanVien);

                refundPayment.TrangThaiThanhToan = TT_THANH_CONG;
                refundPayment.NgayHoanTien = DateTime.Now;
                refundPayment.MaNhanVienXuLyHoan = maNhanVien;
                refundPayment.NgayXacNhan = DateTime.Now;

                order.TrangThaiTaiChinh = TC_DA_HOAN_TIEN;
                order.NgayCapNhat = DateTime.Now;

                order.AppendStatusHistory(
                    DON_DA_HUY,
                    DON_DA_HUY,
                    "Xác nhận hoàn tiền",
                    $"Admin {nhanVien} xác nhận"
                );

                await _context.SaveChangesAsync();
                LogDebug(method, "Đã lưu vào database");

                // GỬI EMAIL
                try
                {
                    LogDebug(method, $"Đang gửi email đến: {order.NguoiDung?.Email}");
                    await _emailService.SendRefundCompletedAsync(order, refundPayment);
                    LogDebug(method, "Gửi email thành công");
                }
                catch (Exception ex)
                {
                    LogError(method, "Lỗi gửi email", ex);
                }

                // GỬI NOTIFICATION
                try
                {
                    await _notificationService.CreateForUserAsync(
                        order.MaNguoiDung,
                        new CreateNotificationDTO
                        {
                            TieuDe = "Hoàn tiền thành công",
                            NoiDung = $"Đơn {order.MaDatCho} đã được hoàn tiền {FormatPrice(refundPayment.SoTienHoan ?? 0)}đ.",
                            LoaiThongBao = (int)NotificationType.Payment,
                            LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                        });
                    LogDebug(method, "Tạo notification thành công");
                }
                catch (Exception ex)
                {
                    LogError(method, "Lỗi tạo notification", ex);
                }

                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NhanVien,
                    Email = _currentUserService.GetEmail(),
                    MaTaiKhoan = maNhanVien,
                    TenHanhDong = ActionLogDTO.XacNhanHoanTien,
                    TenBangTacDong = TableNameDTO.ThanhToan,
                    MaDoiTuong = refundPayment.MaThanhToan,
                    GiaTriTruoc = new { TrangThaiThanhToan = oldStatus },
                    GiaTriSau = new
                    {
                        TrangThaiThanhToan = refundPayment.TrangThaiThanhToan,
                        NgayHoanTien = refundPayment.NgayHoanTien
                    }
                });

                await _dashboardNotifier.NotifyDashboardChangedAsync("RefundConfirmed", new
                {
                    order.MaDonDatTour,
                    TrangThaiTaiChinh = order.TrangThaiTaiChinh
                });

                LogDebug(method, "=== KẾT THÚC ===");
                return true;
            }
            catch (Exception ex)
            {
                LogError(method, $"Lỗi xác nhận hoàn tiền cho đơn {maDonDatTour}", ex);
                throw;
            }
        }

        public async Task<bool> RejectRefundAsync(int maThanhToan, int maNhanVien, string lyDoTuChoi)
        {
            var method = nameof(RejectRefundAsync);
            LogDebug(method, $"Bắt đầu từ chối hoàn tiền: maThanhToan={maThanhToan}, lyDo={lyDoTuChoi}");

            try
            {
                if (string.IsNullOrWhiteSpace(lyDoTuChoi))
                {
                    LogError(method, "Lý do từ chối rỗng");
                    throw new InvalidOperationException("Vui lòng nhập lý do từ chối");
                }

                var thanhToan = await _context.ThanhToans
                    .Include(t => t.DonDatTour)
                    .FirstOrDefaultAsync(t => t.MaThanhToan == maThanhToan)
                    ?? throw new KeyNotFoundException("Không tìm thấy giao dịch");

                LogDebug(method, $"Tìm thấy giao dịch: LoaiThanhToan={thanhToan.LoaiThanhToan}, TrangThai={thanhToan.TrangThaiThanhToan}");

                if (thanhToan.LoaiThanhToan != LOAI_HOAN_TIEN)
                {
                    LogError(method, $"Giao dịch không phải là hoàn tiền: {thanhToan.LoaiThanhToan}");
                    throw new InvalidOperationException("Giao dịch không phải là hoàn tiền");
                }

                if (thanhToan.TrangThaiThanhToan != TT_CHO_XU_LY)
                {
                    LogError(method, $"Giao dịch không ở trạng thái chờ xử lý: {thanhToan.TrangThaiThanhToan}");
                    throw new InvalidOperationException("Giao dịch không ở trạng thái chờ xử lý");
                }

                if (thanhToan.NgayHoanTien != null)
                {
                    LogError(method, $"Giao dịch đã được xử lý trước đó: NgayHoanTien={thanhToan.NgayHoanTien}");
                    throw new InvalidOperationException("Giao dịch này đã được xử lý trước đó");
                }

                var oldStatus = thanhToan.TrangThaiThanhToan;
                var nhanVien = await GetNhanVienNameAsync(maNhanVien);

                thanhToan.TrangThaiThanhToan = TT_DA_HUY;
                thanhToan.NoiDung = (thanhToan.NoiDung ?? "") + $" - Admin {nhanVien} từ chối hoàn tiền. Lý do: {lyDoTuChoi}";
                thanhToan.NgayXacNhan = DateTime.Now;

                LogDebug(method, $"Đã cập nhật giao dịch: TrangThai={thanhToan.TrangThaiThanhToan}");

                var order = thanhToan.DonDatTour;
                if (order != null)
                {
                    order.TrangThaiTaiChinh = TC_MAT_COC;
                    order.NgayCapNhat = DateTime.Now;
                    order.LyDoTuChoiHuy = lyDoTuChoi;
                    order.AdminNote = (order.AdminNote ?? "") + $" | Từ chối hoàn tiền: {lyDoTuChoi}";

                    order.AppendStatusHistory(
                        DON_DA_HUY,
                        DON_DA_HUY,
                        "Từ chối hoàn tiền",
                        $"Admin {nhanVien} từ chối hoàn tiền. Lý do: {lyDoTuChoi}"
                    );

                    LogDebug(method, $"Đã cập nhật đơn: TrangThaiTaiChinh={order.TrangThaiTaiChinh}");
                }

                await _context.SaveChangesAsync();
                LogDebug(method, "Đã lưu vào database");

                // GỬI NOTIFICATION
                try
                {
                    if (order != null)
                    {
                        await _notificationService.CreateForUserAsync(
                            order.MaNguoiDung,
                            new CreateNotificationDTO
                            {
                                TieuDe = "Từ chối hoàn tiền",
                                NoiDung = $"Yêu cầu hoàn tiền cho đơn {order.MaDatCho} đã bị từ chối. Lý do: {lyDoTuChoi}",
                                LoaiThongBao = (int)NotificationType.Payment,
                                LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                            });
                        LogDebug(method, "Tạo notification thành công");
                    }
                }
                catch (Exception ex)
                {
                    LogError(method, "Lỗi tạo notification", ex);
                }

                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                    Email = _currentUserService.GetEmail(),
                    MaTaiKhoan = maNhanVien,
                    TenHanhDong = ActionLogDTO.TuChoiHoanTien,
                    TenBangTacDong = TableNameDTO.ThanhToan,
                    MaDoiTuong = maThanhToan,
                    GiaTriTruoc = new { TrangThaiThanhToan = oldStatus },
                    GiaTriSau = new
                    {
                        TrangThaiThanhToan = thanhToan.TrangThaiThanhToan,
                        LyDoTuChoi = lyDoTuChoi,
                        MaNhanVien = maNhanVien
                    }
                });

                LogDebug(method, "=== KẾT THÚC ===");
                return true;
            }
            catch (Exception ex)
            {
                LogError(method, $"Lỗi từ chối hoàn tiền cho giao dịch {maThanhToan}", ex);
                throw;
            }
        }

        public async Task<PageDTO<PendingRefundDTO>> GetPendingRefundsAsync(int page, int pageSize)
        {
            var method = nameof(GetPendingRefundsAsync);
            LogDebug(method, $"Bắt đầu lấy danh sách hoàn tiền chờ xử lý: page={page}, pageSize={pageSize}");

            try
            {
                if (page < 1) page = 1;
                if (pageSize < 1) pageSize = 10;

                var query = _context.ThanhToans
                    .AsNoTracking()
                    .Include(x => x.DonDatTour)
                        .ThenInclude(x => x.ChuyenKhoiHanh)
                            .ThenInclude(x => x.Tour)
                    .Include(x => x.DonDatTour)
                        .ThenInclude(x => x.NguoiDung)
                    .Where(t => t.LoaiThanhToan == LOAI_HOAN_TIEN
                                && t.TrangThaiThanhToan == TT_CHO_XU_LY
                                && t.SoTienHoan != null
                                && t.SoTienHoan > 0
                                && t.NgayHoanTien == null
                                && t.DonDatTour.TrangThaiDon == DON_DA_HUY
                                && t.DonDatTour.TrangThaiTaiChinh == TC_DANG_HOAN_TIEN)
                    .OrderByDescending(t => t.NgayThanhToan)
                    .AsQueryable();

                var totalItems = await query.CountAsync();
                LogDebug(method, $"Tổng số bản ghi: {totalItems}");

                var items = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(t => new PendingRefundDTO
                    {
                        MaThanhToan = t.MaThanhToan,
                        MaDonDatTour = t.MaDonDatTour,
                        MaDatCho = t.DonDatTour.MaDatCho,
                        TenTour = t.DonDatTour.ChuyenKhoiHanh.Tour.TenTour,
                        HoTenKhachHang = t.DonDatTour.NguoiDung.HoTen,
                        SoDienThoai = t.DonDatTour.NguoiDung.SoDienThoai,
                        Email = t.DonDatTour.NguoiDung.Email ?? "",
                        TongTienThanhToan = t.TongTienThanhToan,
                        SoTienHoan = t.SoTienHoan,
                        LyDoHuy = t.DonDatTour.LyDoHuy,
                        NgayThanhToan = t.NgayThanhToan,
                        NgayKhoiHanh = t.DonDatTour.ChuyenKhoiHanh.NgayKhoiHanh,
                        TongTien = t.DonDatTour.TongTien,
                        TrangThaiTaiChinh = t.DonDatTour.TrangThaiTaiChinh,
                        PhuongThucThanhToan = GetPaymentMethodName(t.PhuongThucThanhToan),
                        TrangThaiDon = t.DonDatTour.TrangThaiDon,
                        TenTrangThaiTaiChinh = GetFinancialStatusName(t.DonDatTour.TrangThaiTaiChinh),
                        TenTrangThaiDon = GetOrderStatusName(t.DonDatTour.TrangThaiDon)
                    })
                    .ToListAsync();

                LogDebug(method, $"Lấy được {items.Count} bản ghi");

                var result = new PageDTO<PendingRefundDTO>
                {
                    Items = items,
                    PageNumber = page,
                    TotalItems = totalItems,
                    PageSize = pageSize
                };

                return result;
            }
            catch (Exception ex)
            {
                LogError(method, "Lỗi lấy danh sách hoàn tiền chờ xử lý", ex);
                throw;
            }
        }

        public async Task<bool> ProcessRefundAsync(int maDonDatTour, int maNhanVien)
        {
            var method = nameof(ProcessRefundAsync);
            LogDebug(method, $"Bắt đầu xử lý hoàn tiền cho đơn {maDonDatTour}");

            try
            {
                var order = await _context.DonDatTours
                    .Include(x => x.ThanhToans)
                    .Include(x => x.NguoiDung)
                    .Include(x => x.ChuyenKhoiHanh)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour)
                    ?? throw new KeyNotFoundException("Không tìm thấy đơn đặt tour");

                LogDebug(method, $"Tìm thấy đơn: MaDatCho={order.MaDatCho}, TrangThaiTaiChinh={order.TrangThaiTaiChinh}");

                if (order.TrangThaiTaiChinh != TC_DANG_HOAN_TIEN)
                {
                    LogError(method, $"Đơn không ở trạng thái đang hoàn tiền: {order.TrangThaiTaiChinh}");
                    throw new InvalidOperationException("Đơn không ở trạng thái đang hoàn tiền");
                }

                var refundPayment = GetRefundPayment(order.ThanhToans);

                if (refundPayment == null || refundPayment.TrangThaiThanhToan != TT_CHO_XU_LY)
                {
                    LogError(method, "Không tìm thấy giao dịch hoàn tiền đang chờ xử lý");
                    throw new InvalidOperationException("Không tìm thấy giao dịch hoàn tiền đang chờ xử lý");
                }

                LogDebug(method, $"Tìm thấy giao dịch hoàn tiền: MaThanhToan={refundPayment.MaThanhToan}");

                var result = await ConfirmRefundAsync(refundPayment.MaThanhToan, maNhanVien);
                LogDebug(method, $"Kết quả: {result}");

                return result;
            }
            catch (Exception ex)
            {
                LogError(method, $"Lỗi xử lý hoàn tiền cho đơn {maDonDatTour}", ex);
                throw;
            }
        }

        public async Task<bool> RefundDepositAsync(int maDonDatTour, string lyDoHoan)
        {
            var method = nameof(RefundDepositAsync);
            LogDebug(method, $"Bắt đầu hoàn cọc cho đơn {maDonDatTour}, lý do: {lyDoHoan}");

            try
            {
                if (string.IsNullOrWhiteSpace(lyDoHoan))
                {
                    LogError(method, "Lý do hoàn rỗng");
                    throw new InvalidOperationException("Vui lòng nhập lý do hoàn cọc.");
                }

                var order = await _context.DonDatTours
                    .Include(x => x.NguoiDung)
                    .Include(x => x.ThanhToans)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour)
                    ?? throw new KeyNotFoundException("Không tìm thấy đơn đặt tour");

                LogDebug(method, $"Tìm thấy đơn: MaDatCho={order.MaDatCho}, TrangThaiTaiChinh={order.TrangThaiTaiChinh}, TrangThaiDon={order.TrangThaiDon}");

                if (order.TrangThaiTaiChinh != TC_DA_DAT_COC)
                {
                    LogError(method, $"Đơn không ở trạng thái đã đặt cọc: {order.TrangThaiTaiChinh}");
                    throw new InvalidOperationException("Chỉ có thể hoàn cọc cho đơn đã đặt cọc.");
                }

                if (IsOrderCompleted(order.TrangThaiDon))
                {
                    LogError(method, $"Đơn đã hoàn tất: {order.TrangThaiDon}");
                    throw new InvalidOperationException("Đơn đã hoàn tất, không thể hoàn cọc.");
                }

                if (IsOrderCancelled(order.TrangThaiDon))
                {
                    LogError(method, $"Đơn đã bị hủy: {order.TrangThaiDon}");
                    throw new InvalidOperationException("Đơn đã bị hủy.");
                }

                var oldFinancialStatus = order.TrangThaiTaiChinh;
                var oldOrderStatus = order.TrangThaiDon;

                order.TrangThaiTaiChinh = TC_DANG_HOAN_TIEN;
                order.LyDoHuy = lyDoHoan;
                order.NgayHuy = DateTime.Now;
                order.NgayCapNhat = DateTime.Now;

                order.AppendStatusHistory(oldOrderStatus, order.TrangThaiDon, "Hoàn cọc", $"Lý do: {lyDoHoan}");

                var depositPayment = order.ThanhToans
                    .Where(p => p.LoaiThanhToan == LOAI_DAT_COC && p.TrangThaiThanhToan == TT_THANH_CONG)
                    .OrderByDescending(p => p.NgayThanhToan)
                    .FirstOrDefault();

                if (depositPayment != null)
                {
                    depositPayment.TrangThaiThanhToan = TT_CHO_XU_LY;
                    depositPayment.SoTienHoan = depositPayment.TongTienThanhToan;
                    depositPayment.NgayHoanTien = null;
                    depositPayment.NoiDung = (depositPayment.NoiDung ?? "") + $" - Hoàn cọc theo yêu cầu. Lý do: {lyDoHoan}";
                    depositPayment.LyDoHoanTien = lyDoHoan;

                    LogDebug(method, $"Đã cập nhật giao dịch cọc: MaThanhToan={depositPayment.MaThanhToan}, SoTienHoan={depositPayment.SoTienHoan}");
                }
                else
                {
                    LogError(method, "Không tìm thấy giao dịch cọc để hoàn");
                }

                await _context.SaveChangesAsync();
                LogDebug(method, "Đã lưu vào database");

                // GỬI NOTIFICATION
                try
                {
                    await _notificationService.CreateForUserAsync(
                        order.MaNguoiDung,
                        new CreateNotificationDTO
                        {
                            TieuDe = "Đang xử lý hoàn cọc",
                            NoiDung = $"Đơn {order.MaDatCho} đang được xử lý hoàn cọc. Lý do: {lyDoHoan}",
                            LoaiThongBao = (int)NotificationType.Payment,
                            LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                        });
                    LogDebug(method, "Tạo notification thành công");
                }
                catch (Exception ex)
                {
                    LogError(method, "Lỗi tạo notification", ex);
                }

                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NhanVien,
                    Email = _currentUserService.GetEmail(),
                    MaTaiKhoan = _currentUserService.GetUserId(),
                    TenHanhDong = ActionLogDTO.HoanTien,
                    TenBangTacDong = TableNameDTO.DonDatTour,
                    MaDoiTuong = maDonDatTour,
                    GiaTriTruoc = new { TrangThaiTaiChinh = oldFinancialStatus, TrangThaiDon = oldOrderStatus },
                    GiaTriSau = new { TrangThaiTaiChinh = order.TrangThaiTaiChinh, TrangThaiDon = order.TrangThaiDon }
                });

                await _dashboardNotifier.NotifyDashboardChangedAsync("DepositRefunded", new
                {
                    MaDonDatTour = maDonDatTour,
                    TrangThaiTaiChinh = order.TrangThaiTaiChinh
                });

                LogDebug(method, "=== KẾT THÚC ===");
                return true;
            }
            catch (Exception ex)
            {
                LogError(method, $"Lỗi hoàn cọc cho đơn {maDonDatTour}", ex);
                throw;
            }
        }

        #endregion

        #region Payment & Deposit Management

        public async Task<bool> XacNhanDaDatCocAsync(int maDonDatTour, int maNhanVien, int phuongThucThanhToan, decimal soTienThu)
        {
            var method = nameof(XacNhanDaDatCocAsync);
            LogDebug(method, $"Bắt đầu xác nhận đặt cọc: maDonDatTour={maDonDatTour}, soTienThu={soTienThu}, phuongThuc={phuongThucThanhToan}");

            try
            {
                if (phuongThucThanhToan == PTTT_VNPAY)
                {
                    LogError(method, "VNPay được xác nhận tự động");
                    throw new InvalidOperationException("VNPay được xác nhận tự động qua cổng thanh toán.");
                }

                if (phuongThucThanhToan != PTTT_TIEN_MAT && phuongThucThanhToan != PTTT_CHUYEN_KHOAN)
                {
                    LogError(method, $"Phương thức thanh toán không hợp lệ: {phuongThucThanhToan}");
                    throw new InvalidOperationException("Phương thức thanh toán không hợp lệ. Chỉ chấp nhận Tiền mặt hoặc Chuyển khoản.");
                }

                if (soTienThu <= 0)
                {
                    LogError(method, $"Số tiền thu không hợp lệ: {soTienThu}");
                    throw new InvalidOperationException("Số tiền thu phải lớn hơn 0.");
                }

                var order = await _context.DonDatTours
                    .Include(x => x.NguoiDung)
                    .Include(x => x.ThanhToans)
                    .Include(x => x.ChuyenKhoiHanh)
                        .ThenInclude(x => x.Tour)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour)
                    ?? throw new KeyNotFoundException("Không tìm thấy đơn đặt tour");

                LogDebug(method, $"Tìm thấy đơn: MaDatCho={order.MaDatCho}, TrangThaiDon={order.TrangThaiDon}, TongTien={order.TongTien}, TienCoc={order.TienCoc}");

                if (order.TrangThaiDon != DON_CHO_THANH_TOAN)
                {
                    LogError(method, $"Đơn không ở trạng thái chờ thanh toán: {order.TrangThaiDon}");
                    throw new InvalidOperationException($"Đơn không ở trạng thái chờ thanh toán. Trạng thái hiện tại: {GetOrderStatusName(order.TrangThaiDon)}");
                }

                if (RefundPolicyEngine.IsDepositDeadlineExpired(order.NgayDat, DateTime.Now))
                {
                    LogError(method, $"Đã quá hạn đặt cọc: NgayDat={order.NgayDat}");
                    throw new InvalidOperationException($"Đã quá hạn đặt cọc ({BookingConstants.DEPOSIT_DEADLINE_HOURS} giờ).");
                }

                if (soTienThu < order.TienCoc)
                {
                    LogError(method, $"Số tiền thu không đủ cọc: {soTienThu} < {order.TienCoc}");
                    throw new InvalidOperationException($"Số tiền thu ({soTienThu:N0}đ) không đủ tiền cọc ({order.TienCoc:N0}đ)");
                }

                if (order.SoTienDaThanhToan + soTienThu > order.TongTien)
                {
                    LogError(method, $"Số tiền thanh toán vượt quá tổng: {order.SoTienDaThanhToan} + {soTienThu} > {order.TongTien}");
                    throw new InvalidOperationException($"Số tiền thanh toán vượt quá tổng giá trị đơn ({order.TongTien:N0}đ)");
                }

                var oldStatusDon = order.TrangThaiDon;
                var oldFinancialStatus = order.TrangThaiTaiChinh;
                var nhanVien = await GetNhanVienNameAsync(maNhanVien);

                order.SoTienDaThanhToan += soTienThu;
                LogDebug(method, $"Cập nhật SoTienDaThanhToan: {order.SoTienDaThanhToan}");

                if (order.SoTienDaThanhToan >= order.TongTien)
                {
                    order.TrangThaiTaiChinh = TC_DA_THANH_TOAN_DU;
                    order.TrangThaiDon = DON_DA_DUYET;
                    order.NgayDuyet = DateTime.Now;
                    order.MaNhanVienDuyet = maNhanVien;
                    LogDebug(method, $"Thanh toán đủ: Chuyển sang DON_DA_DUYET");
                }
                else
                {
                    order.TrangThaiTaiChinh = TC_DA_DAT_COC;
                    order.TrangThaiDon = DON_CHO_DUYET;
                    LogDebug(method, $"Thanh toán cọc: Chuyển sang DON_CHO_DUYET");
                }

                order.NgayCapNhat = DateTime.Now;

                order.AppendStatusHistory(oldStatusDon, order.TrangThaiDon, "Đặt cọc", $"Admin {nhanVien} ghi nhận cọc {soTienThu:N0}đ");

                var loaiThanhToan = order.SoTienDaThanhToan >= order.TongTien
                    ? LOAI_THANH_TOAN_TOAN_BO
                    : LOAI_DAT_COC;

                var phuongThucText = phuongThucThanhToan == PTTT_TIEN_MAT ? "Tiền mặt" : "Chuyển khoản";

                _context.ThanhToans.Add(new ThanhToan
                {
                    MaDonDatTour = maDonDatTour,
                    PhuongThucThanhToan = phuongThucThanhToan,
                    TongTienThanhToan = soTienThu,
                    NgayThanhToan = DateTime.Now,
                    TrangThaiThanhToan = TT_THANH_CONG,
                    LoaiThanhToan = loaiThanhToan,
                    NoiDung = $"Admin {nhanVien} xác nhận thu {phuongThucText} - Đặt cọc cho đơn {order.MaDatCho}",
                    NgayXacNhan = DateTime.Now
                });

                await _context.SaveChangesAsync();
                LogDebug(method, "Đã lưu vào database");

                // GỬI NOTIFICATION
                try
                {
                    await _notificationService.CreateForUserAsync(
                        order.MaNguoiDung,
                        new CreateNotificationDTO
                        {
                            TieuDe = order.SoTienDaThanhToan >= order.TongTien ? "Thanh toán đầy đủ thành công" : "Đã ghi nhận đặt cọc",
                            NoiDung = order.SoTienDaThanhToan >= order.TongTien
                                ? $"Đơn {order.MaDatCho} đã được thanh toán đầy đủ và xác nhận."
                                : $"Đơn {order.MaDatCho} đã được ghi nhận đặt cọc và đang chờ duyệt.",
                            LoaiThongBao = (int)NotificationType.Payment,
                            LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                        });
                    LogDebug(method, "Tạo notification thành công");
                }
                catch (Exception ex)
                {
                    LogError(method, "Lỗi tạo notification", ex);
                }

                // GHI LOG
                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = _currentUserService.GetRoleId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NhanVien,
                    Email = _currentUserService.GetEmail(),
                    MaTaiKhoan = maNhanVien,
                    TenHanhDong = ActionLogDTO.CapNhat,
                    TenBangTacDong = TableNameDTO.DonDatTour,
                    MaDoiTuong = maDonDatTour,
                    GiaTriTruoc = new { TrangThaiDon = oldStatusDon, TrangThaiTaiChinh = oldFinancialStatus },
                    GiaTriSau = new
                    {
                        TrangThaiDon = order.TrangThaiDon,
                        TrangThaiTaiChinh = order.TrangThaiTaiChinh,
                        SoTienThu = soTienThu,
                        PhuongThucThanhToan = phuongThucThanhToan
                    }
                });

                await _dashboardNotifier.NotifyDashboardChangedAsync("PaymentStatusChanged", new
                {
                    MaDonDatTour = maDonDatTour,
                    TrangThaiDon = order.TrangThaiDon,
                    TrangThaiTaiChinh = order.TrangThaiTaiChinh
                });

                LogDebug(method, "=== KẾT THÚC ===");
                return true;
            }
            catch (Exception ex)
            {
                LogError(method, $"Lỗi xác nhận đặt cọc cho đơn {maDonDatTour}", ex);
                throw;
            }
        }

        public async Task<bool> UpdatePaymentStatusAsync(int maDonDatTour, int trangThai, int maNhanVien, decimal soTienThanhToanLanNay)
        {
            var method = nameof(UpdatePaymentStatusAsync);
            LogDebug(method, $"Bắt đầu cập nhật thanh toán: maDonDatTour={maDonDatTour}, trangThai={trangThai}, soTien={soTienThanhToanLanNay}");

            try
            {
                if (!new[] { TT_THANH_CONG, TT_THAT_BAI, TT_DA_HUY }.Contains(trangThai))
                {
                    LogError(method, $"Trạng thái thanh toán không hợp lệ: {trangThai}");
                    throw new InvalidOperationException("Trạng thái thanh toán không hợp lệ.");
                }

                if (trangThai == TT_THANH_CONG && soTienThanhToanLanNay <= 0)
                {
                    LogError(method, $"Số tiền thanh toán không hợp lệ: {soTienThanhToanLanNay}");
                    throw new InvalidOperationException("Số tiền thanh toán phải lớn hơn 0.");
                }

                var order = await _context.DonDatTours
                    .Include(x => x.NguoiDung)
                    .Include(x => x.ThanhToans)
                    .Include(x => x.NhanVien)
                    .Include(x => x.ChuyenKhoiHanh)
                        .ThenInclude(x => x.Tour)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour)
                    ?? throw new KeyNotFoundException("Không tìm thấy đơn đặt tour");

                LogDebug(method, $"Tìm thấy đơn: MaDatCho={order.MaDatCho}, TrangThaiDon={order.TrangThaiDon}, SoTienDaThanhToan={order.SoTienDaThanhToan}");

                if (IsOrderCancelled(order.TrangThaiDon))
                {
                    LogError(method, $"Đơn đã bị hủy: {order.TrangThaiDon}");
                    throw new InvalidOperationException("Đơn đã bị hủy, không thể cập nhật thanh toán.");
                }

                if (order.SoTienDaThanhToan + soTienThanhToanLanNay > order.TongTien)
                {
                    LogError(method, $"Số tiền vượt quá tổng: {order.SoTienDaThanhToan} + {soTienThanhToanLanNay} > {order.TongTien}");
                    throw new InvalidOperationException($"Số tiền thanh toán vượt quá tổng giá trị đơn ({order.TongTien:N0}đ)");
                }

                var oldStatusDon = order.TrangThaiDon;
                var oldFinancialStatus = order.TrangThaiTaiChinh;
                var oldPaymentStatus = GetLatestPaymentStatus(order.ThanhToans);
                var latestPayment = GetLatestPayment(order.ThanhToans);
                var paymentMethod = latestPayment?.PhuongThucThanhToan ?? PTTT_TIEN_MAT;
                var nhanVien = await GetNhanVienNameAsync(maNhanVien);

                order.SoTienDaThanhToan += soTienThanhToanLanNay;
                LogDebug(method, $"Cập nhật SoTienDaThanhToan: {order.SoTienDaThanhToan}");

                if (order.SoTienDaThanhToan >= order.TongTien)
                {
                    order.TrangThaiTaiChinh = TC_DA_THANH_TOAN_DU;

                    if (order.CoCanhBaoCongNo)
                    {
                        order.CoCanhBaoCongNo = false;
                        order.NgayGanCoCanhBao = null;
                    }

                    if (order.TrangThaiDon == DON_CHO_DUYET || order.TrangThaiDon == DON_CHO_THANH_TOAN)
                    {
                        order.TrangThaiDon = DON_DA_DUYET;
                        order.NgayDuyet = DateTime.Now;
                        order.MaNhanVienDuyet = maNhanVien;
                        LogDebug(method, "Thanh toán đủ: Chuyển sang DON_DA_DUYET");
                    }
                }
                else if (order.SoTienDaThanhToan > 0)
                {
                    order.TrangThaiTaiChinh = TC_DA_DAT_COC;
                    if (order.TrangThaiDon == DON_CHO_THANH_TOAN)
                    {
                        order.TrangThaiDon = DON_CHO_DUYET;
                        LogDebug(method, "Thanh toán cọc: Chuyển sang DON_CHO_DUYET");
                    }
                }

                order.NgayCapNhat = DateTime.Now;

                var loaiThanhToan = order.SoTienDaThanhToan >= order.TongTien
                    ? LOAI_THANH_TOAN_TOAN_BO
                    : LOAI_THANH_TOAN_PHAN_CON_LAI;

                var phuongThucText = paymentMethod == PTTT_TIEN_MAT ? "Tiền mặt" :
                                      paymentMethod == PTTT_CHUYEN_KHOAN ? "Chuyển khoản" : "VNPay";

                _context.ThanhToans.Add(new ThanhToan
                {
                    MaDonDatTour = maDonDatTour,
                    PhuongThucThanhToan = paymentMethod,
                    TongTienThanhToan = soTienThanhToanLanNay,
                    NgayThanhToan = DateTime.Now,
                    TrangThaiThanhToan = trangThai == TT_THANH_CONG ? TT_THANH_CONG : trangThai,
                    LoaiThanhToan = loaiThanhToan,
                    NoiDung = $"Admin {nhanVien} xác nhận thu {phuongThucText} - Thanh toán cho đơn {order.MaDatCho}",
                    NgayXacNhan = trangThai == TT_THANH_CONG ? DateTime.Now : null
                });

                order.AppendStatusHistory(oldStatusDon, order.TrangThaiDon, "Cập nhật thanh toán", $"Admin {nhanVien} ghi nhận thanh toán {soTienThanhToanLanNay:N0}đ");

                await _context.SaveChangesAsync();
                LogDebug(method, "Đã lưu vào database");

                // GỬI NOTIFICATION
                try
                {
                    await _notificationService.CreateForUserAsync(
                        order.MaNguoiDung,
                        new CreateNotificationDTO
                        {
                            TieuDe = order.SoTienDaThanhToan >= order.TongTien ? "Thanh toán đầy đủ thành công" : "Cập nhật thanh toán",
                            NoiDung = order.SoTienDaThanhToan >= order.TongTien
                                ? $"Đơn {order.MaDatCho} đã được thanh toán đầy đủ."
                                : $"Đơn {order.MaDatCho} đã được cập nhật thanh toán.",
                            LoaiThongBao = (int)NotificationType.Payment,
                            LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                        });
                    LogDebug(method, "Tạo notification thành công");
                }
                catch (Exception ex)
                {
                    LogError(method, "Lỗi tạo notification", ex);
                }

                // GHI LOG
                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = _currentUserService.GetRoleId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NhanVien,
                    Email = _currentUserService.GetEmail(),
                    MaTaiKhoan = maNhanVien,
                    TenHanhDong = ActionLogDTO.CapNhat,
                    TenBangTacDong = TableNameDTO.DonDatTour,
                    MaDoiTuong = maDonDatTour,
                    GiaTriTruoc = new { TrangThaiDon = oldStatusDon, TrangThaiTaiChinh = oldFinancialStatus, TrangThaiThanhToan = oldPaymentStatus },
                    GiaTriSau = new
                    {
                        TrangThaiDon = order.TrangThaiDon,
                        TrangThaiTaiChinh = order.TrangThaiTaiChinh,
                        TrangThaiThanhToan = trangThai,
                        SoTienThanhToanLanNay = soTienThanhToanLanNay
                    }
                });

                await _dashboardNotifier.NotifyDashboardChangedAsync("PaymentStatusChanged", new
                {
                    MaDonDatTour = maDonDatTour,
                    TrangThaiThanhToan = trangThai
                });

                LogDebug(method, "=== KẾT THÚC ===");
                return true;
            }
            catch (Exception ex)
            {
                LogError(method, $"Lỗi cập nhật thanh toán cho đơn {maDonDatTour}", ex);
                throw;
            }
        }

        public async Task<bool> UpdateDepositStatusAsync(int maDonDatTour, int trangThaiTaiChinh, int maNhanVien)
        {
            var method = nameof(UpdateDepositStatusAsync);
            LogDebug(method, $"Bắt đầu cập nhật trạng thái tài chính: maDonDatTour={maDonDatTour}, trangThai={trangThaiTaiChinh}");

            try
            {
                if (!new[] { TC_CHUA_THANH_TOAN, TC_DA_DAT_COC, TC_DA_THANH_TOAN_DU, TC_MAT_COC, TC_DA_HOAN_TIEN, TC_DANG_HOAN_TIEN }.Contains(trangThaiTaiChinh))
                {
                    LogError(method, $"Trạng thái tài chính không hợp lệ: {trangThaiTaiChinh}");
                    throw new InvalidOperationException("Trạng thái tài chính không hợp lệ.");
                }

                var order = await _context.DonDatTours
                    .Include(x => x.NguoiDung)
                    .Include(x => x.ThanhToans)
                    .Include(x => x.ChuyenKhoiHanh)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour)
                    ?? throw new KeyNotFoundException("Không tìm thấy đơn đặt tour");

                LogDebug(method, $"Tìm thấy đơn: MaDatCho={order.MaDatCho}, TrangThaiTaiChinh hiện tại={order.TrangThaiTaiChinh}");

                var oldFinancialStatus = order.TrangThaiTaiChinh;
                var oldOrderStatus = order.TrangThaiDon;
                var nhanVien = await GetNhanVienNameAsync(maNhanVien);

                order.TrangThaiTaiChinh = trangThaiTaiChinh;
                order.NgayCapNhat = DateTime.Now;

                order.AppendStatusHistory(oldOrderStatus, order.TrangThaiDon, "Cập nhật trạng thái tài chính", $"Trạng thái: {GetFinancialStatusName(trangThaiTaiChinh)}");

                if (trangThaiTaiChinh == TC_DA_THANH_TOAN_DU && !IsOrderCancelled(order.TrangThaiDon))
                {
                    if (order.TrangThaiDon == DON_CHO_THANH_TOAN || order.TrangThaiDon == DON_CHO_DUYET)
                    {
                        order.TrangThaiDon = DON_DA_DUYET;
                        order.NgayDuyet = DateTime.Now;
                        order.MaNhanVienDuyet = maNhanVien;
                        LogDebug(method, "Thanh toán đủ: Chuyển sang DON_DA_DUYET");
                    }
                }

                await _context.SaveChangesAsync();
                LogDebug(method, "Đã lưu vào database");

                // GỬI NOTIFICATION
                try
                {
                    await _notificationService.CreateForUserAsync(
                        order.MaNguoiDung,
                        new CreateNotificationDTO
                        {
                            TieuDe = "Cập nhật trạng thái tài chính",
                            NoiDung = $"Đơn {order.MaDatCho} đã được cập nhật trạng thái: {GetFinancialStatusName(trangThaiTaiChinh)}.",
                            LoaiThongBao = (int)NotificationType.Payment,
                            LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                        });
                    LogDebug(method, "Tạo notification thành công");
                }
                catch (Exception ex)
                {
                    LogError(method, "Lỗi tạo notification", ex);
                }

                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = _currentUserService.GetRoleId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NhanVien,
                    Email = _currentUserService.GetEmail(),
                    MaTaiKhoan = _currentUserService.GetUserId(),
                    TenHanhDong = ActionLogDTO.CapNhat,
                    TenBangTacDong = TableNameDTO.DonDatTour,
                    MaDoiTuong = maDonDatTour,
                    GiaTriTruoc = new { TrangThaiTaiChinh = oldFinancialStatus, TrangThaiDon = oldOrderStatus },
                    GiaTriSau = new { TrangThaiTaiChinh = order.TrangThaiTaiChinh, TrangThaiDon = order.TrangThaiDon }
                });

                await _dashboardNotifier.NotifyDashboardChangedAsync("DepositStatusChanged", new
                {
                    MaDonDatTour = maDonDatTour,
                    TrangThaiTaiChinh = trangThaiTaiChinh
                });

                LogDebug(method, "=== KẾT THÚC ===");
                return true;
            }
            catch (Exception ex)
            {
                LogError(method, $"Lỗi cập nhật trạng thái tài chính cho đơn {maDonDatTour}", ex);
                throw;
            }
        }

        public async Task<bool> UpdateInvoiceStatusAsync(int maDonDatTour, int trangThai)
        {
            var method = nameof(UpdateInvoiceStatusAsync);
            LogDebug(method, $"Bắt đầu cập nhật trạng thái đơn: maDonDatTour={maDonDatTour}, trangThai={trangThai}");

            try
            {
                if (IsOrderCancelled(trangThai))
                {
                    LogError(method, $"Không được cập nhật trực tiếp trạng thái hủy");
                    throw new InvalidOperationException("Vui lòng dùng chức năng Hủy đơn để hủy, không cập nhật trực tiếp trạng thái này.");
                }

                if (!new[] { DON_CHO_THANH_TOAN, DON_CHO_DUYET, DON_DA_DUYET, DON_DANG_DIEN_RA, DON_HOAN_TAT }.Contains(trangThai))
                {
                    LogError(method, $"Trạng thái đơn không hợp lệ: {trangThai}");
                    throw new InvalidOperationException("Trạng thái đơn không hợp lệ.");
                }

                var order = await _context.DonDatTours
                    .Include(x => x.NguoiDung)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour)
                    ?? throw new KeyNotFoundException("Không tìm thấy đơn đặt tour");

                LogDebug(method, $"Tìm thấy đơn: MaDatCho={order.MaDatCho}, Trạng thái hiện tại={order.TrangThaiDon}");

                var oldStatus = order.TrangThaiDon;

                // Validate state transitions
                if (oldStatus == DON_CHO_THANH_TOAN && trangThai != DON_CHO_DUYET && trangThai != DON_DA_DUYET)
                {
                    LogError(method, $"Không thể chuyển từ {oldStatus} sang {trangThai}");
                    throw new InvalidOperationException("Từ 'Chờ thanh toán' chỉ có thể chuyển sang 'Chờ duyệt' hoặc 'Đã duyệt' (nếu thanh toán đủ).");
                }

                if (oldStatus == DON_CHO_DUYET && trangThai != DON_DA_DUYET)
                {
                    LogError(method, $"Không thể chuyển từ {oldStatus} sang {trangThai}");
                    throw new InvalidOperationException("Từ 'Chờ duyệt' chỉ có thể chuyển sang 'Đã duyệt'.");
                }

                if (oldStatus == DON_DA_DUYET && trangThai != DON_DANG_DIEN_RA && trangThai != DON_HOAN_TAT)
                {
                    LogError(method, $"Không thể chuyển từ {oldStatus} sang {trangThai}");
                    throw new InvalidOperationException("Từ 'Đã duyệt' chỉ có thể chuyển sang 'Đang diễn ra' hoặc 'Hoàn tất'.");
                }

                if (oldStatus == DON_DANG_DIEN_RA && trangThai != DON_HOAN_TAT)
                {
                    LogError(method, $"Không thể chuyển từ {oldStatus} sang {trangThai}");
                    throw new InvalidOperationException("Từ 'Đang diễn ra' chỉ có thể chuyển sang 'Hoàn tất'.");
                }

                order.TrangThaiDon = trangThai;
                order.NgayCapNhat = DateTime.Now;

                if (trangThai == DON_DA_DUYET && order.NgayDuyet == null)
                {
                    order.NgayDuyet = DateTime.Now;
                    order.MaNhanVienDuyet = _currentUserService.GetUserId();
                    LogDebug(method, "Cập nhật NgayDuyet và MaNhanVienDuyet");
                }

                order.AppendStatusHistory(oldStatus, order.TrangThaiDon, "Cập nhật trạng thái", $"Chuyển sang {GetOrderStatusName(trangThai)}");

                await _context.SaveChangesAsync();
                LogDebug(method, "Đã lưu vào database");

                // GỬI NOTIFICATION
                try
                {
                    var (title, content) = order.TrangThaiDon switch
                    {
                        DON_DA_DUYET => ("Đơn đặt tour đã được xác nhận", $"Đơn {order.MaDatCho} đã được xác nhận."),
                        DON_DANG_DIEN_RA => ("Chuyến đi đang diễn ra", $"Chuyến đi {order.MaDatCho} đang diễn ra."),
                        DON_HOAN_TAT => ("Chuyến đi đã hoàn tất", $"Đơn {order.MaDatCho} đã hoàn tất. Cảm ơn bạn đã đồng hành cùng chúng tôi."),
                        _ => (null, null)
                    };

                    if (title != null)
                    {
                        await _notificationService.CreateForUserAsync(
                            order.MaNguoiDung,
                            new CreateNotificationDTO
                            {
                                TieuDe = title,
                                NoiDung = content ?? "",
                                LoaiThongBao = (int)NotificationType.Booking,
                                LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                            });
                        LogDebug(method, "Tạo notification thành công");
                    }
                }
                catch (Exception ex)
                {
                    LogError(method, "Lỗi tạo notification", ex);
                }

                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NhanVien,
                    Email = _currentUserService.GetEmail(),
                    MaTaiKhoan = _currentUserService.GetUserId(),
                    TenHanhDong = ActionLogDTO.CapNhat,
                    TenBangTacDong = TableNameDTO.DonDatTour,
                    MaDoiTuong = maDonDatTour,
                    GiaTriTruoc = new { TrangThaiDon = oldStatus },
                    GiaTriSau = new { TrangThaiDon = order.TrangThaiDon }
                });

                await _dashboardNotifier.NotifyDashboardChangedAsync("OrderStatusChanged", new
                {
                    order.MaDonDatTour,
                    TrangThaiMoi = order.TrangThaiDon
                });

                LogDebug(method, "=== KẾT THÚC ===");
                return true;
            }
            catch (Exception ex)
            {
                LogError(method, $"Lỗi cập nhật trạng thái đơn {maDonDatTour}", ex);
                throw;
            }
        }

        #endregion

        #region User Refund

        public async Task<bool> ConfirmRefundUserAsync(int maThanhToan)
        {
            var method = nameof(ConfirmRefundUserAsync);
            LogDebug(method, $"Bắt đầu xác nhận hoàn tiền cho user: maThanhToan={maThanhToan}");

            try
            {
                var userId = _currentUserService.GetUserId();
                LogDebug(method, $"UserId: {userId}");

                var result = await ConfirmRefundAsync(maThanhToan, userId);
                LogDebug(method, $"Kết quả: {result}");

                return result;
            }
            catch (Exception ex)
            {
                LogError(method, $"Lỗi xác nhận hoàn tiền cho user", ex);
                throw;
            }
        }

        #endregion
    }
}