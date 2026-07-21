using Hangfire;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Constants;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.DTOs.LogSystem;
using travel_recommendation_and_booking_system.DTOs.Notifications;
using travel_recommendation_and_booking_system.Helpers;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Job
{
    public class BookingStatusJob
    {
        private readonly AppDbContext _context;
        private readonly ILogger<BookingStatusJob> _logger;
        private readonly INotificationService _notificationService;
        private readonly IDashboardNotifier _dashboardNotifier;
        private readonly ILogService _logService;
        private readonly IEmailService _emailService;

        public BookingStatusJob(
            AppDbContext context,
            ILogger<BookingStatusJob> logger,
            INotificationService notificationService,
            IDashboardNotifier dashboardNotifier,
            ILogService logService,
            IEmailService emailService)
        {
            _context = context;
            _logger = logger;
            _notificationService = notificationService;
            _dashboardNotifier = dashboardNotifier;
            _logService = logService;
            _emailService = emailService;
        }

        #region Helper Methods

      
        private static ThanhToan? GetSuccessfulPayment(ICollection<ThanhToan> payments)
        {
            return payments?.Where(p => p.TrangThaiThanhToan == BookingConstants.TT_THANH_CONG
                                        && p.LoaiThanhToan != BookingConstants.LOAI_HOAN_TIEN)
                           .OrderByDescending(p => p.NgayThanhToan)
                           .FirstOrDefault();
        }

        #endregion

        #region 1. Tự động chuyển "Đã duyệt" → "Đang diễn ra"

        [AutomaticRetry(Attempts = 3)]
        public async Task UpdateToInProgressAsync()
        {
            var today = DateTime.Today;
            var now = DateTime.Now;

            var bookings = await _context.DonDatTours
                .Include(x => x.ChuyenKhoiHanh)
                .Include(x => x.NguoiDung)
                .Where(x => x.TrangThaiDon == BookingConstants.DON_DA_DUYET
                            && x.TrangThaiTaiChinh == BookingConstants.TC_DA_THANH_TOAN_DU
                            && x.ChuyenKhoiHanh != null
                            && x.ChuyenKhoiHanh.NgayKhoiHanh.Date <= today)
                .ToListAsync();

            if (!bookings.Any())
            {
                _logger.LogInformation("[BookingStatusJob] Không có đơn nào cần chuyển sang Đang diễn ra.");
                return;
            }

            int successCount = 0;
            int failCount = 0;

            foreach (var booking in bookings)
            {
                try
                {
                    var oldStatus = booking.TrangThaiDon;

                    booking.TrangThaiDon = BookingConstants.DON_DANG_DIEN_RA;
                    booking.NgayCapNhat = now;

                    booking.AppendStatusHistory(oldStatus, booking.TrangThaiDon, "Tự động chuyển sang Đang diễn ra", "Ngày khởi hành đã đến");

                    await _notificationService.CreateForUserAsync(
                        booking.MaNguoiDung,
                        new CreateNotificationDTO
                        {
                            TieuDe = "Tour đã bắt đầu",
                            NoiDung = $"Chuyến đi {booking.MaDatCho} đã bắt đầu. Chúc bạn có một hành trình vui vẻ!",
                            LoaiThongBao = (int)NotificationType.Booking,
                            LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                        });

                    await _logService.LoggingAsync(new LogDTO
                    {
                        LoaiTaiKhoan = AccountTypeDTO.HeThong,
                        Email = "system@auto-update",
                        MaTaiKhoan = 0,
                        TenHanhDong = ActionLogDTO.CapNhat,
                        TenBangTacDong = TableNameDTO.DonDatTour,
                        MaDoiTuong = booking.MaDonDatTour,
                        GiaTriTruoc = new { TrangThaiDon = oldStatus },
                        GiaTriSau = new { TrangThaiDon = booking.TrangThaiDon, LyDo = "Tự động chuyển sang Đang diễn ra" }
                    });

                    successCount++;
                    _logger.LogInformation($"[BookingStatusJob] Đã chuyển đơn {booking.MaDatCho} sang Đang diễn ra");
                }
                catch (Exception ex)
                {
                    failCount++;
                    _logger.LogError(ex, $"[BookingStatusJob] Lỗi chuyển đơn {booking.MaDatCho} sang Đang diễn ra");
                }
            }

            await _context.SaveChangesAsync();
            _logger.LogInformation($"[BookingStatusJob] Đã chuyển {successCount} đơn sang Đang diễn ra, thất bại: {failCount}");
        }

        #endregion

        #region 2. Tự động hủy đơn chưa thanh toán quá hạn (24h)

        [AutomaticRetry(Attempts = 3)]
        public async Task AutoCancelExpiredDepositsAsync()
        {
            var deadlineHours = BookingConstants.DEPOSIT_DEADLINE_HOURS;
            var expiredTime = DateTime.Now.AddHours(-deadlineHours);

            var bookings = await _context.DonDatTours
                .Include(x => x.ChuyenKhoiHanh)
                .Include(x => x.NguoiDung)
                .Where(x => x.TrangThaiDon == BookingConstants.DON_CHO_THANH_TOAN
                            && x.TrangThaiTaiChinh == BookingConstants.TC_CHUA_THANH_TOAN
                            && x.NgayDat <= expiredTime)
                .ToListAsync();

            if (!bookings.Any())
            {
                _logger.LogInformation($"[BookingStatusJob] Không có đơn nào quá hạn thanh toán ({deadlineHours}h).");
                return;
            }

            int successCount = 0;
            int failCount = 0;

            foreach (var booking in bookings)
            {
                try
                {
                    // Lưu lại thông tin cần thiết trước khi sửa
                    var oldStatus = booking.TrangThaiDon;
                    var oldFinancialStatus = booking.TrangThaiTaiChinh;
                    var soKhach = booking.SoNguoiLon + booking.SoTreEm + booking.SoEmBe;
                    var maChuyen = booking.MaChuyen;
                    var maNguoiDung = booking.MaNguoiDung;
                    var maDatCho = booking.MaDatCho;
                    var maDonDatTour = booking.MaDonDatTour;

                    // Cập nhật đơn
                    booking.TrangThaiDon = BookingConstants.DON_DA_HUY;
                    booking.TrangThaiTaiChinh = BookingConstants.TC_CHUA_THANH_TOAN;
                    booking.LyDoHuy = $"Tự động hủy do quá hạn thanh toán ({deadlineHours} giờ)";
                    booking.NgayHuy = DateTime.Now;
                    booking.NgayCapNhat = DateTime.Now;

                    // Cập nhật số chỗ
                    if (booking.ChuyenKhoiHanh != null)
                    {
                        booking.ChuyenKhoiHanh.SoChoDaDat = Math.Max(0, booking.ChuyenKhoiHanh.SoChoDaDat - soKhach);
                    }

                    booking.AppendStatusHistory(oldStatus, booking.TrangThaiDon, "Tự động hủy quá hạn thanh toán", $"Quá hạn {deadlineHours} giờ");

                    // Lưu từng đơn một để tránh concurrency
                    await _context.SaveChangesAsync();

                    // Gửi thông báo sau khi lưu thành công
                    try
                    {
                        await _notificationService.CreateForUserAsync(
                            maNguoiDung,
                            new CreateNotificationDTO
                            {
                                TieuDe = "Đơn đặt tour đã bị hủy",
                                NoiDung = $"Đơn {maDatCho} đã bị hủy do quá hạn thanh toán ({deadlineHours} giờ).",
                                LoaiThongBao = (int)NotificationType.Booking,
                                LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                            });
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"[BookingStatusJob] Lỗi gửi thông báo cho đơn {maDatCho}");
                    }

                    try
                    {
                        var user = await _context.NguoiDungs.FindAsync(maNguoiDung);
                        if (user != null && !string.IsNullOrWhiteSpace(user.Email))
                        {
                            // Cần load lại booking để gửi email
                            var refreshedBooking = await _context.DonDatTours
                                .Include(x => x.NguoiDung)
                                .Include(x => x.ChuyenKhoiHanh)
                                .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour);

                            if (refreshedBooking != null)
                            {
                                await _emailService.SendBookingCancelledAsync(refreshedBooking);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"[BookingStatusJob] Lỗi gửi email cho đơn {maDatCho}");
                    }

                    try
                    {
                        await _logService.LoggingAsync(new LogDTO
                        {
                            LoaiTaiKhoan = AccountTypeDTO.HeThong,
                            Email = "system@auto-cancel",
                            MaTaiKhoan = 0,
                            TenHanhDong = ActionLogDTO.CapNhat,
                            TenBangTacDong = TableNameDTO.DonDatTour,
                            MaDoiTuong = maDonDatTour,
                            GiaTriTruoc = new { TrangThaiDon = oldStatus, TrangThaiTaiChinh = oldFinancialStatus },
                            GiaTriSau = new { TrangThaiDon = booking.TrangThaiDon, TrangThaiTaiChinh = booking.TrangThaiTaiChinh, LyDo = booking.LyDoHuy }
                        });
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"[BookingStatusJob] Lỗi ghi log cho đơn {maDatCho}");
                    }

                    successCount++;
                    _logger.LogInformation($"[BookingStatusJob] Đã tự động hủy đơn {maDatCho} do quá hạn thanh toán");
                }
                catch (DbUpdateConcurrencyException ex)
                {
                    // Xử lý concurrency: refresh và thử lại
                    failCount++;
                    _logger.LogWarning(ex, $"[BookingStatusJob] Conflict khi hủy đơn {booking.MaDatCho}, sẽ thử lại lần sau.");

                    // Detach entity hiện tại để refresh
                    _context.Entry(booking).State = EntityState.Detached;
                }
                catch (Exception ex)
                {
                    failCount++;
                    _logger.LogError(ex, $"[BookingStatusJob] Lỗi hủy đơn {booking.MaDatCho} do quá hạn thanh toán");
                }
            }

            _logger.LogInformation($"[BookingStatusJob] Đã tự động hủy {successCount} đơn quá hạn thanh toán, thất bại: {failCount}");
        }

        #endregion

        #region 3. Tự động hủy đơn đã duyệt nhưng chưa thanh toán phần còn lại

        [AutomaticRetry(Attempts = 3)]
        public async Task AutoCancelUnpaidRemainingAsync()
        {
            var now = DateTime.Now;
            var deadlineDate = now.AddDays(3);

            var bookings = await _context.DonDatTours
                .Include(x => x.ChuyenKhoiHanh)
                .Include(x => x.NguoiDung)
                .Include(x => x.ThanhToans)
                .Where(x => x.TrangThaiDon == BookingConstants.DON_DA_DUYET
                            && x.TrangThaiTaiChinh == BookingConstants.TC_DA_DAT_COC
                            && x.ChuyenKhoiHanh != null
                            && x.ChuyenKhoiHanh.NgayKhoiHanh <= deadlineDate
                            && x.ChuyenKhoiHanh.NgayKhoiHanh > now
                            && x.SoTienDaThanhToan < x.TongTien)
                .ToListAsync();

            if (!bookings.Any())
            {
                _logger.LogInformation("[BookingStatusJob] Không có đơn nào cần hủy do chưa thanh toán phần còn lại.");
                return;
            }

            int successCount = 0;
            int failCount = 0;

            foreach (var booking in bookings)
            {
                try
                {
                    var oldStatus = booking.TrangThaiDon;
                    var oldFinancialStatus = booking.TrangThaiTaiChinh;
                    var soKhach = booking.SoNguoiLon + booking.SoTreEm + booking.SoEmBe;
                    var maDonDatTour = booking.MaDonDatTour;
                    var maDatCho = booking.MaDatCho;
                    var maNguoiDung = booking.MaNguoiDung;

                    var policy = RefundPolicyEngine.CalculateRefundPolicy(
                        booking.ChuyenKhoiHanh.NgayKhoiHanh,
                        now
                    );

                    var successfulPayment = GetSuccessfulPayment(booking.ThanhToans);

                    booking.TrangThaiDon = BookingConstants.DON_DA_HUY;
                    booking.LyDoHuy = "Tự động hủy do không thanh toán phần còn lại trước ngày khởi hành";
                    booking.NgayHuy = now;
                    booking.NgayCapNhat = now;
                    booking.NgayXuLyHuy = now;

                    decimal refundAmount = 0;
                    decimal refundRate = policy.RefundRate;

                    if (successfulPayment != null && successfulPayment.TongTienThanhToan > 0)
                    {
                        refundAmount = Math.Round(successfulPayment.TongTienThanhToan * refundRate, 0);

                        if (refundAmount > 0)
                        {
                            booking.TrangThaiTaiChinh = BookingConstants.TC_DANG_HOAN_TIEN;

                            var refundPayment = new ThanhToan
                            {
                                MaDonDatTour = maDonDatTour,
                                PhuongThucThanhToan = successfulPayment.PhuongThucThanhToan,
                                TongTienThanhToan = successfulPayment.TongTienThanhToan,
                                SoTienHoan = refundAmount,
                                NgayThanhToan = now,
                                TrangThaiThanhToan = BookingConstants.TT_CHO_XU_LY,
                                LoaiThanhToan = BookingConstants.LOAI_HOAN_TIEN,
                                NoiDung = $"Tự động hoàn tiền do hủy - {policy.Policy}",
                                MaGiaoDich = $"AUTO_REFUND_{maDatCho}_{DateTime.Now:yyyyMMddHHmmss}",
                                LyDoHoanTien = booking.LyDoHuy
                            };
                            _context.ThanhToans.Add(refundPayment);
                        }
                        else
                        {
                            booking.TrangThaiTaiChinh = BookingConstants.TC_MAT_COC;
                        }
                    }
                    else
                    {
                        booking.TrangThaiTaiChinh = BookingConstants.TC_MAT_COC;
                    }

                    if (booking.ChuyenKhoiHanh != null)
                    {
                        booking.ChuyenKhoiHanh.SoChoDaDat = Math.Max(0, booking.ChuyenKhoiHanh.SoChoDaDat - soKhach);
                    }

                    booking.AppendStatusHistory(oldStatus, booking.TrangThaiDon, "Tự động hủy do chưa thanh toán phần còn lại",
                        $"Hủy trước {policy.DaysBeforeDeparture} ngày, hoàn {policy.RefundRate * 100}%");

                    await _context.SaveChangesAsync();

                    // Gửi thông báo sau khi lưu thành công
                    try
                    {
                        await _notificationService.CreateForUserAsync(
                            maNguoiDung,
                            new CreateNotificationDTO
                            {
                                TieuDe = "Đơn đặt tour đã bị hủy tự động",
                                NoiDung = $"Đơn {maDatCho} đã bị hủy do không thanh toán phần còn lại trước ngày khởi hành. {(refundAmount > 0 ? $"Số tiền đang xử lý hoàn: {refundAmount:N0}đ" : "Không được hoàn tiền")}.",
                                LoaiThongBao = (int)NotificationType.Booking,
                                LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                            });
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"[BookingStatusJob] Lỗi gửi thông báo cho đơn {maDatCho}");
                    }

                    try
                    {
                        if (!string.IsNullOrWhiteSpace(booking.NguoiDung?.Email))
                        {
                            if (refundAmount > 0)
                            {
                                var refund = booking.ThanhToans.LastOrDefault(t => t.LoaiThanhToan == BookingConstants.LOAI_HOAN_TIEN);
                                await _emailService.SendRefundProcessingAsync(booking, refund);
                            }
                            else
                            {
                                await _emailService.SendCancelNoRefundAsync(booking);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"[BookingStatusJob] Lỗi gửi email cho đơn {maDatCho}");
                    }

                    await _logService.LoggingAsync(new LogDTO
                    {
                        LoaiTaiKhoan = AccountTypeDTO.HeThong,
                        Email = "system@auto-cancel-remaining",
                        MaTaiKhoan = 0,
                        TenHanhDong = ActionLogDTO.CapNhat,
                        TenBangTacDong = TableNameDTO.DonDatTour,
                        MaDoiTuong = maDonDatTour,
                        GiaTriTruoc = new { TrangThaiDon = oldStatus, TrangThaiTaiChinh = oldFinancialStatus },
                        GiaTriSau = new
                        {
                            TrangThaiDon = booking.TrangThaiDon,
                            TrangThaiTaiChinh = booking.TrangThaiTaiChinh,
                            SoTienHoan = refundAmount,
                            TyLeHoan = refundRate,
                            LyDo = booking.LyDoHuy
                        }
                    });

                    await _dashboardNotifier.NotifyDashboardChangedAsync("OrderStatusChanged", new
                    {
                        booking.MaDonDatTour,
                        TrangThaiMoi = booking.TrangThaiDon,
                        LyDo = "Tự động hủy do chưa thanh toán phần còn lại"
                    });

                    successCount++;
                    _logger.LogInformation($"[BookingStatusJob] Đã tự động hủy đơn {maDatCho} do chưa thanh toán phần còn lại");
                }
                catch (DbUpdateConcurrencyException ex)
                {
                    failCount++;
                    _logger.LogWarning(ex, $"[BookingStatusJob] Conflict khi hủy đơn {booking.MaDatCho}, sẽ thử lại lần sau.");
                    _context.Entry(booking).State = EntityState.Detached;
                }
                catch (Exception ex)
                {
                    failCount++;
                    _logger.LogError(ex, $"[BookingStatusJob] Lỗi hủy đơn {booking.MaDatCho} do chưa thanh toán phần còn lại");
                }
            }

            _logger.LogInformation($"[BookingStatusJob] Đã tự động hủy {successCount} đơn do chưa thanh toán phần còn lại, thất bại: {failCount}");
        }

        #endregion

        #region 4. Tự động chuyển "Đang diễn ra" → "Hoàn tất"

        [AutomaticRetry(Attempts = 3)]
        public async Task AutoCompleteBookingsAsync()
        {
            var now = DateTime.Now;

            var bookings = await _context.DonDatTours
                .Include(x => x.ChuyenKhoiHanh)
                .Include(x => x.NguoiDung)
                .Include(x => x.ThanhToans)
                .Where(x => x.TrangThaiDon == BookingConstants.DON_DANG_DIEN_RA
                            && x.ChuyenKhoiHanh != null
                            && x.ChuyenKhoiHanh.NgayKetThuc < now)
                .ToListAsync();

            if (!bookings.Any())
            {
                _logger.LogInformation("[BookingStatusJob] Không có đơn nào cần hoàn tất.");
                return;
            }

            int successCount = 0;
            int failCount = 0;

            foreach (var booking in bookings)
            {
                try
                {
                    var latestPaymentStatus = booking.ThanhToans?
                        .OrderByDescending(p => p.NgayThanhToan)
                        .Select(p => p.TrangThaiThanhToan)
                        .FirstOrDefault() ?? 0;

                    if (latestPaymentStatus != BookingConstants.TT_THANH_CONG)
                    {
                        _logger.LogWarning($"[BookingStatusJob] Đơn {booking.MaDatCho} chưa thanh toán thành công, không thể hoàn tất.");
                        continue;
                    }

                    var oldStatus = booking.TrangThaiDon;

                    booking.TrangThaiDon = BookingConstants.DON_HOAN_TAT;
                    booking.NgayCapNhat = now;

                    booking.AppendStatusHistory(oldStatus, booking.TrangThaiDon, "Tự động hoàn tất", "Tour đã kết thúc");

                    await _notificationService.CreateForUserAsync(
                        booking.MaNguoiDung,
                        new CreateNotificationDTO
                        {
                            TieuDe = "Chuyến đi đã hoàn tất",
                            NoiDung = $"Cảm ơn bạn đã đồng hành cùng chúng tôi. Đơn {booking.MaDatCho} đã hoàn tất.",
                            LoaiThongBao = (int)NotificationType.Booking,
                            LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                        });

                    await _logService.LoggingAsync(new LogDTO
                    {
                        LoaiTaiKhoan = AccountTypeDTO.HeThong,
                        Email = "system@auto-complete",
                        MaTaiKhoan = 0,
                        TenHanhDong = ActionLogDTO.CapNhat,
                        TenBangTacDong = TableNameDTO.DonDatTour,
                        MaDoiTuong = booking.MaDonDatTour,
                        GiaTriTruoc = new { TrangThaiDon = oldStatus },
                        GiaTriSau = new { TrangThaiDon = booking.TrangThaiDon, LyDo = "Tự động hoàn tất do tour đã kết thúc" }
                    });

                    await _dashboardNotifier.NotifyDashboardChangedAsync("OrderStatusChanged", new
                    {
                        booking.MaDonDatTour,
                        TrangThaiMoi = booking.TrangThaiDon,
                        LyDo = "Tour đã kết thúc"
                    });

                    successCount++;
                    _logger.LogInformation($"[BookingStatusJob] Đã hoàn tất đơn {booking.MaDatCho}");
                }
                catch (DbUpdateConcurrencyException ex)
                {
                    failCount++;
                    _logger.LogWarning(ex, $"[BookingStatusJob] Conflict khi hoàn tất đơn {booking.MaDatCho}");
                    _context.Entry(booking).State = EntityState.Detached;
                }
                catch (Exception ex)
                {
                    failCount++;
                    _logger.LogError(ex, $"[BookingStatusJob] Lỗi hoàn tất đơn {booking.MaDatCho}");
                }
            }

            await _context.SaveChangesAsync();
            _logger.LogInformation($"[BookingStatusJob] Đã hoàn tất {successCount} đơn, thất bại: {failCount}");
        }

        #endregion

        #region 5. Tự động gỡ cờ công nợ

        [AutomaticRetry(Attempts = 3)]
        public async Task AutoClearOverdueFlagsAsync()
        {
            var bookings = await _context.DonDatTours
                .Where(x => x.CoCanhBaoCongNo
                            && x.TrangThaiTaiChinh == BookingConstants.TC_DA_THANH_TOAN_DU)
                .ToListAsync();

            if (!bookings.Any())
            {
                _logger.LogInformation("[BookingStatusJob] Không có đơn nào cần gỡ cờ công nợ.");
                return;
            }

            foreach (var booking in bookings)
            {
                booking.CoCanhBaoCongNo = false;
                booking.NgayGanCoCanhBao = null;
                booking.NgayCapNhat = DateTime.Now;
            }

            await _context.SaveChangesAsync();
            _logger.LogInformation($"[BookingStatusJob] Đã gỡ cờ công nợ cho {bookings.Count} đơn");
        }

        #endregion
    }
}