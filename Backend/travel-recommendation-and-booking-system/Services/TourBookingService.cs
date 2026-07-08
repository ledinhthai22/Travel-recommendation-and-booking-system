using DTOs.Page;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Constants;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.DTOs.LogSystem;
using travel_recommendation_and_booking_system.DTOs.Notifications;
using travel_recommendation_and_booking_system.DTOs.TourBooking;
using travel_recommendation_and_booking_system.Helpers;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;
using travel_recommendation_and_booking_system.Services.PdfBuilders;
using travel_recommendation_and_booking_system.SignalR;

namespace travel_recommendation_and_booking_system.Services
{
    public class TourBookingService : ITourBookingService
    {
        private readonly AppDbContext _context;
        private readonly ILogService _logService;
        private readonly ICurrentUserService _currentUserService;
        private readonly IHubContext<TravelRecommendationHub> _hubContext;
        private readonly IEmailService _emailService;
        private readonly INotificationService _notificationService;
        private readonly IRecommendationService _RecommendationService;
        private readonly IDashboardNotifier _dashboardNotifier;
        public TourBookingService(AppDbContext context, ILogService logService,
            ICurrentUserService currentUserService,
            IHubContext<TravelRecommendationHub> hubContext,
            IEmailService emailService,
            INotificationService notificationService,
            IRecommendationService recommendationService,
            IDashboardNotifier dashboardNotifier
            
            )
        {
            _context = context;
            _logService = logService;
            _currentUserService = currentUserService;
            _hubContext = hubContext;
            _emailService = emailService;
            _notificationService = notificationService;
            _RecommendationService = recommendationService;
            _dashboardNotifier = dashboardNotifier;
        }


        private static int GetTrangThaiThanhToan(ICollection<ThanhToan> thanhToans)
        {
            if (thanhToans == null || !thanhToans.Any()) return 0;
            return thanhToans
                .OrderByDescending(t => t.NgayThanhToan)
                .Select(t => t.TrangThaiThanhToan)
                .FirstOrDefault();
        }

        private static ThanhToan? GetThanhToanThanhCong(ICollection<ThanhToan> thanhToans) =>
            thanhToans?
                .Where(t => t.TrangThaiThanhToan == 1)
                .OrderByDescending(t => t.NgayThanhToan)
                .FirstOrDefault();
        private static ThanhToan? GetThanhToanGanNhat(ICollection<ThanhToan> thanhToans) =>
        thanhToans?
            .OrderByDescending(t => t.NgayThanhToan)
            .FirstOrDefault();

        private static string GetTenPhuongThuc(int ma) => ma switch
        {
            1 => "VNPay",
            2 => "Tiền mặt",
            3 => "Chuyển khoản",
            _ => "Không xác định"
        };

        private static string GetTenTrangThaiThanhToan(int ma) => ma switch
        {
            0 => "Chờ thanh toán",
            1 => "Thành công",
            2 => "Thất bại",
            3 => "Đã hoàn tiền",
            4 => "Chờ hoàn tiền",
            _ => "Không xác định"
        };

        private static bool CanTransition(int oldStatus, int newStatus) =>
        oldStatus switch
        {
            // Bỏ newStatus == 4 khỏi các nhánh — hủy đơn phải đi qua CancelOrderAsync
            // để đảm bảo giải phóng chỗ (SoChoDaDat) và tạo bản ghi hoàn tiền đúng quy trình.
            1 => newStatus == 2,
            2 => newStatus == 3,
            3 => false,
            _ => false
        };

        public async Task<PageDTO<TourBookingResponseDTO>> GetPagedDonDatToursAsync(string? keyword, int? trangThaiDon, int? trangThaiThanhToan, DateTime? ngayDat, int page, int size)
        {
            page = Math.Max(1, page);
            size = Math.Max(1, size);

            var query = _context.DonDatTours
                .AsNoTracking()
                .Include(x => x.NguoiDung)
                .Include(x => x.ChuyenKhoiHanh).ThenInclude(x => x.Tour).ThenInclude(x => x.HinhAnhTours)
                .Include(x => x.NhanVien)
                .Include(x => x.ThanhToans)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
                query = query.Where(x =>
                    x.MaDatCho.Contains(keyword) ||
                    x.NguoiDung.HoTen.Contains(keyword) ||
                    x.ChuyenKhoiHanh.MaChuyenCode.Contains(keyword)
                    );

            if (trangThaiDon.HasValue)
                query = query.Where(x => x.TrangThaiDon == trangThaiDon.Value);

            // Filter theo TrangThaiThanhToan từ bảng ThanhToan, không từ DonDatTour
            if (trangThaiThanhToan.HasValue)
                query = query.Where(x =>
                    x.ThanhToans
                        .OrderByDescending(t => t.NgayThanhToan)
                        .Select(t => (int?)t.TrangThaiThanhToan)
                        .FirstOrDefault() == trangThaiThanhToan.Value
                    || (!x.ThanhToans.Any() && trangThaiThanhToan.Value == 0));

            if (ngayDat.HasValue)
                query = query.Where(x => x.NgayDat.Date == ngayDat.Value.Date);

            int totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(x => x.NgayDat)
                .Skip((page - 1) * size)
                .Take(size)
                .Select(x => new TourBookingResponseDTO
                {
                    MaDonDatTour = x.MaDonDatTour,
                    MaDatCho = x.MaDatCho,
                    TenKhachHang = x.NguoiDung.HoTen,
                    MaCodeChuyen = x.ChuyenKhoiHanh.MaChuyenCode,
                    DiemKhoiHanh = x.ChuyenKhoiHanh.DiemKhoiHanh,
                    DiemDen = x.ChuyenKhoiHanh.DiemDen,
                    NgayKhoiHanh = x.ChuyenKhoiHanh.NgayKhoiHanh,
                    TongTien = x.TongTien,
                    TrangThaiDon = x.TrangThaiDon,
                    NgayDuyet = x.NgayDuyet,
                    NhanVienDuyet = x.NhanVien != null ? x.NhanVien.HoTen : null,

                    TrangThaiThanhToan = x.ThanhToans
                        .OrderByDescending(t => t.NgayThanhToan)
                        .Select(t => (int?)t.TrangThaiThanhToan)
                        .FirstOrDefault() ?? 0,

                    PhuongThucThanhToan = x.ThanhToans
                    .OrderByDescending(t => t.NgayThanhToan)
                    .Select(t => t.PhuongThucThanhToan == 1 ? "VNPay"
                               : t.PhuongThucThanhToan == 2 ? "Tiền mặt"
                               : t.PhuongThucThanhToan == 3 ? "Chuyển khoản"
                               : "Không xác định")
                    .FirstOrDefault(),

                                    MaGiaoDich = x.ThanhToans
                    .OrderByDescending(t => t.NgayThanhToan)
                    .Select(t => t.MaGiaoDich)
                    .FirstOrDefault(),

                                    NgayThanhToan = x.ThanhToans
                    .OrderByDescending(t => t.NgayThanhToan)
                    .Select(t => (DateTime?)t.NgayThanhToan)
                    .FirstOrDefault()
                })
                .ToListAsync();

            return new PageDTO<TourBookingResponseDTO>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = page,
                PageSize = size
            };
        }

        public async Task<TourBookingDetailDTO?> GetDetailAsync(int maDonDatTour)
        {
            var order = await _context.DonDatTours
                .AsNoTracking()
                .Include(x => x.NguoiDung)
                .Include(x => x.ChuyenKhoiHanh).ThenInclude(x => x.Tour).ThenInclude(x => x.HinhAnhTours)
                .Include(x => x.ChuyenKhoiHanh).ThenInclude(x => x.NhanVien)
                .Include(x => x.NhanVien)

                .Include(x => x.UuDai)
                .Include(x => x.KhachHangs)
                .Include(x => x.ThanhToans)
                .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour);

            if (order == null) return null;

            // Lấy giao dịch thành công mới nhất để hiển thị
            var thanhToan = GetThanhToanGanNhat(order.ThanhToans);


            int trangThaiThanhToan = GetTrangThaiThanhToan(order.ThanhToans);

            var hinhAnh = order.ChuyenKhoiHanh.Tour.HinhAnhTours
                .Where(a => a.NgayXoa == null)
                .OrderByDescending(a => a.AnhChinh)
                .ThenBy(a => a.SoThuTu)
                .Select(a => a.DuongDanAnh)
                .FirstOrDefault();

            int soPhongDon = order.KhachHangs.Count(k => k.PhongDon && k.LoaiKhach == 1);

            return new TourBookingDetailDTO
            {
                MaDonDatTour = order.MaDonDatTour,
                MaDatCho = order.MaDatCho,
                TenNguoiDat = order.NguoiDung.HoTen,
                SoDienThoai = order.NguoiDung.SoDienThoai,
                Email = order.NguoiDung.Email,
                GhiChu = order.GhiChu,

                Tour = new TourInfoDTO
                {
                    MaTour = order.ChuyenKhoiHanh.Tour.MaTour,
                    TenTour = order.ChuyenKhoiHanh.Tour.TenTour,
                    HinhAnh = hinhAnh
                },

                Chuyen = new ChuyenInfoDTO
                {
                    MaChuyen = order.ChuyenKhoiHanh.MaChuyen,
                    MaChuyenCode = order.ChuyenKhoiHanh.MaChuyenCode,
                    DiemKhoiHanh = order.ChuyenKhoiHanh.DiemKhoiHanh,
                    DiemDen = order.ChuyenKhoiHanh.DiemDen,
                    NgayKhoiHanh = order.ChuyenKhoiHanh.NgayKhoiHanh,
                    NgayKetThuc = order.ChuyenKhoiHanh.NgayKetThuc,
                    TenHuongDanVien = order.ChuyenKhoiHanh.NhanVien?.HoTen
                },


                TenUuDai = order.UuDai?.TenUuDai,
                MaCode = order.UuDai?.MaCode,

                SoNguoiLon = order.SoNguoiLon,
                SoTreEm = order.SoTreEm,
                SoEmBe = order.SoEmBe,
                SoPhongDon = soPhongDon,

                GiaNguoiLonTaiDat = order.GiaNguoiLonTaiDat,
                GiaTreEmTaiDat = order.GiaTreEmTaiDat,
                GiaEmBeTaiDat = order.GiaEmBeTaiDat,
                PhuThuPhongDonTaiDat = order.PhuThuPhongDonTaiDat,
                GiaTriGiamTaiDat = order.GiaTriGiamTaiDat,
                TongTien = order.TongTien,

                // Lấy từ ThanhToan, không từ DonDatTour
                TrangThaiThanhToan = trangThaiThanhToan,
                TrangThaiDon = order.TrangThaiDon,
                NgayDat = order.NgayDat,
                NgayDuyet = order.NgayDuyet,
                NhanVienDuyet = order.NhanVien?.HoTen,

                DanhSachHanhKhach = order.KhachHangs.Select(k => new KhachHangDTO
                {
                    MaKhachHang = k.MaKhachHang,
                    HoTen = k.HoTen,
                    SoDienThoai = k.SoDienThoai,
                    Email = k.Email,
                    NgaySinh = k.NgaySinh,
                    GioiTinh = k.GioiTinh,
                    LoaiKhach = k.LoaiKhach,
                    PhongDon = k.PhongDon
                }).ToList(),

                ThongTinThanhToan = thanhToan == null ? null : new ThanhToanDTO
                {
                    MaThanhToan = thanhToan.MaThanhToan,
                    PhuongThucThanhToan = thanhToan.PhuongThucThanhToan,
                    TenPhuongThuc = GetTenPhuongThuc(thanhToan.PhuongThucThanhToan),
                    MaGiaoDich = thanhToan.MaGiaoDich,
                    NoiDung = thanhToan.NoiDung,
                    NgayThanhToan = thanhToan.NgayThanhToan,
                    TrangThaiThanhToan = thanhToan.TrangThaiThanhToan,
                    TenTrangThai = GetTenTrangThaiThanhToan(thanhToan.TrangThaiThanhToan),
                    TongTienThanhToan = thanhToan.TongTienThanhToan,
                }
            };
        }

        public async Task<bool> ApproveAsync(int maDonDatTour, int maNhanVien)
        {
            var order = await _context.DonDatTours
                .Include(x => x.NguoiDung)
                .Include(x => x.ChuyenKhoiHanh)
                    .ThenInclude(x => x.Tour)
                .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour);

            if (order == null)
                return false;

            if (order.TrangThaiDon != 1)
                throw new InvalidOperationException("Chỉ có thể duyệt đơn đang ở trạng thái Chờ duyệt.");

            var oldStatus = order.TrangThaiDon;

            order.TrangThaiDon = 2;
            order.MaNhanVienDuyet = maNhanVien;
            order.NgayDuyet = DateTime.Now;
            order.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            await _notificationService.CreateForUserAsync(
                order.MaNguoiDung,
                new CreateNotificationDTO
                {
                    TieuDe = "Đơn đặt tour đã được xác nhận",
                    NoiDung = $"Đơn {order.MaDatCho} - {order.ChuyenKhoiHanh?.Tour?.TenTour} đã được xác nhận.",
                    LoaiThongBao = (int)NotificationType.Booking,
                    LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                });

            await _dashboardNotifier.NotifyDashboardChangedAsync("OrderStatusChanged", new
            {
                order.MaDonDatTour,
                TrangThaiMoi = order.TrangThaiDon
            });



            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = _currentUserService.GetUserId() == 1
                    ? AccountTypeDTO.QuanTriVien
                    : AccountTypeDTO.NhanVien,

                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = maNhanVien,
                TenHanhDong = ActionLogDTO.CapNhat,
                TenBangTacDong = TableNameDTO.DonDatTour,
                MaDoiTuong = maDonDatTour,

                GiaTriTruoc = new
                {
                    TrangThaiDon = oldStatus
                },

                GiaTriSau = new
                {
                    TrangThaiDon = order.TrangThaiDon,
                    MaNhanVienDuyet = order.MaNhanVienDuyet,
                    NgayDuyet = order.NgayDuyet
                }
            });

            return true;
        }


        public async Task<bool> CancelOrderAsync(int maDonDatTour, string lyDoHuy)
        {
            if (string.IsNullOrWhiteSpace(lyDoHuy))
                throw new InvalidOperationException("Vui lòng nhập lý do hủy đơn.");

            var order = await _context.DonDatTours
                .Include(x => x.NguoiDung)
                .Include(x => x.ChuyenKhoiHanh)
                    .ThenInclude(x => x.Tour)
                .Include(x => x.ThanhToans)
                .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour);

            if (order == null)
                return false;

            if (order.TrangThaiDon == 3)
                throw new InvalidOperationException("Không thể hủy đơn đã hoàn tất.");

            if (order.TrangThaiDon == 4)
                throw new InvalidOperationException("Đơn này đã bị hủy trước đó.");

            var oldStatusDon = order.TrangThaiDon;

            // Kiểm tra thanh toán
            var gdThanhCong = GetThanhToanThanhCong(order.ThanhToans);
            int trangThaiThanhToanHienTai = GetTrangThaiThanhToan(order.ThanhToans);

            var now = DateTime.Now;
            decimal soTienHoan = 0;

            if (gdThanhCong != null)
            {
                // Áp cùng chính sách tỷ lệ hoàn như khách tự hủy (CancelBookingAsync)
                decimal tyLeHoan = RefundHelper.TinhTyLeHoanTien(order.ChuyenKhoiHanh.NgayKhoiHanh, now);
                soTienHoan = Math.Round(gdThanhCong.TongTienThanhToan * tyLeHoan, 0);

                if (soTienHoan > 0)
                {
                    // FIX: cập nhật ngay trên bản ghi thanh toán thành công gốc,
                    // không tạo bản ghi ThanhToan mới nữa. Bug cũ: tạo record mới và gán
                    // TongTienThanhToan = soTienHoan nhưng KHÔNG set SoTienHoan
                    // => GetPendingRefundsAsync đọc t.SoTienHoan luôn ra null/0.
                    gdThanhCong.SoTienHoan = soTienHoan;
                    gdThanhCong.TrangThaiThanhToan = 4; // Chờ hoàn tiền — admin xử lý thủ công
                    _context.ThanhToans.Update(gdThanhCong);
                }
                // Nếu tỷ lệ hoàn = 0% (hủy sát ngày), giữ nguyên trạng thái thanh toán hiện tại
            }

            // Trả chỗ lại cho chuyến khởi hành
            var soKhach = order.SoNguoiLon + order.SoTreEm + order.SoEmBe;
            order.ChuyenKhoiHanh.SoChoDaDat -= soKhach;

            order.TrangThaiDon = 4;
            order.LyDoHuy = lyDoHuy.Trim();
            order.NgayCapNhat = now;

            await _context.SaveChangesAsync();

            await _notificationService.CreateForUserAsync(
                order.MaNguoiDung,
                new CreateNotificationDTO
                {
                    TieuDe = "Đơn đặt tour đã bị hủy",
                    NoiDung = $"Đơn {order.MaDatCho} đã bị hủy. Lý do: {lyDoHuy}. Nếu đã thanh toán, hệ thống sẽ tiến hành hoàn tiền.",
                    LoaiThongBao = (int)NotificationType.Booking,
                    LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                });

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = _currentUserService.GetUserId() == 1
                    ? AccountTypeDTO.QuanTriVien
                    : AccountTypeDTO.NhanVien,

                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),

                TenHanhDong = ActionLogDTO.CapNhat,
                TenBangTacDong = TableNameDTO.DonDatTour,
                MaDoiTuong = maDonDatTour,

                GiaTriTruoc = new
                {
                    TrangThaiDon = oldStatusDon,
                    TrangThaiThanhToan = trangThaiThanhToanHienTai
                },

                GiaTriSau = new
                {
                    TrangThaiDon = order.TrangThaiDon,
                    TrangThaiThanhToan = gdThanhCong != null ? (soTienHoan > 0 ? 4 : trangThaiThanhToanHienTai) : trangThaiThanhToanHienTai,
                    LyDoHuy = lyDoHuy
                }
            });
            await _dashboardNotifier.NotifyDashboardChangedAsync("OrderStatusChanged", new
            {
                order.MaDonDatTour,
                TrangThaiMoi = order.TrangThaiDon
            });
            return true;
        }

        public async Task<bool> CompleteOrderAsync(int maDonDatTour)
        {
            var order = await _context.DonDatTours
                .Include(x => x.NguoiDung)
                .Include(x => x.ChuyenKhoiHanh)
                    .ThenInclude(x => x.Tour)
                .Include(x => x.ThanhToans)
                .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour);

            if (order == null)
                return false;

            if (order.TrangThaiDon != 2)
                throw new InvalidOperationException("Chỉ có thể hoàn tất những đơn hàng ở trạng thái Đã duyệt.");

            int trangThaiThanhToan = GetTrangThaiThanhToan(order.ThanhToans);

            if (trangThaiThanhToan != 1)
                throw new InvalidOperationException("Đơn hàng chưa thanh toán thành công, không thể hoàn tất.");

            if (order.ChuyenKhoiHanh?.NgayKetThuc > DateTime.Now)
                throw new InvalidOperationException(
                    $"Tour chưa kết thúc (Ngày kết thúc: {order.ChuyenKhoiHanh.NgayKetThuc:dd/MM/yyyy}). Chưa thể hoàn tất đơn.");

            var oldStatus = order.TrangThaiDon;

            order.TrangThaiDon = 3;
            order.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            await _notificationService.CreateForUserAsync(
                order.MaNguoiDung,
                new CreateNotificationDTO
                {
                    TieuDe = "Chuyến đi đã hoàn tất",
                    NoiDung = $"Cảm ơn bạn đã đồng hành cùng chúng tôi. Đơn {order.MaDatCho} đã hoàn tất.",
                    LoaiThongBao = (int)NotificationType.Booking,
                    LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                });





            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = _currentUserService.GetUserId() == 1
                    ? AccountTypeDTO.QuanTriVien
                    : AccountTypeDTO.NhanVien,

                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),

                TenHanhDong = ActionLogDTO.CapNhat,
                TenBangTacDong = TableNameDTO.DonDatTour,
                MaDoiTuong = maDonDatTour,

                GiaTriTruoc = new
                {
                    TrangThaiDon = oldStatus
                },

                GiaTriSau = new
                {
                    TrangThaiDon = order.TrangThaiDon
                }
            });
            await _dashboardNotifier.NotifyDashboardChangedAsync("OrderStatusChanged", new
            {
                order.MaDonDatTour,
                TrangThaiMoi = order.TrangThaiDon
            });

            return true;
        }


        public async Task<bool> UpdatePaymentStatusAsync(int maDonDatTour, int trangThai,int maNhanVien)
        {
            if (!new[] { 0, 1, 2, 3 }.Contains(trangThai))
                throw new InvalidOperationException("Trạng thái thanh toán không hợp lệ.");

            var order = await _context.DonDatTours
              .Include(x => x.NguoiDung)
              .Include(x => x.ThanhToans)
              .Include(x => x.NhanVien)
              .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour);

            if (order == null)
                return false;

            int oldTrangThaiThanhToan = GetTrangThaiThanhToan(order.ThanhToans);

            
            var giaoDichGanNhat = GetThanhToanGanNhat(order.ThanhToans);
            int phuongThucThanhToan = giaoDichGanNhat?.PhuongThucThanhToan ?? 2;

            _context.ThanhToans.Add(new ThanhToan
            {
                MaDonDatTour = maDonDatTour,
                PhuongThucThanhToan = phuongThucThanhToan,
                MaGiaoDich = $"ADJUST-{order.MaDatCho}-{DateTime.Now:yyyyMMddHHmmss}",
                NoiDung = $"Điều chỉnh trạng thái thanh toán đơn {order.MaDatCho}",
                TongTienThanhToan = order.TongTien,
                NgayThanhToan = DateTime.Now,
                TrangThaiThanhToan = trangThai
            });

            order.TrangThaiDon = 2;
            order.MaNhanVienDuyet = maNhanVien;

            order.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();



            await _notificationService.CreateForUserAsync(
                order.MaNguoiDung,
                new CreateNotificationDTO
                {
                    TieuDe = "Trạng thái thanh toán được cập nhật",
                    NoiDung = $"Thanh toán của đơn {order.MaDatCho} đã được cập nhật.",
                    LoaiThongBao = (int)NotificationType.Payment,
                    LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                });




            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = _currentUserService.GetRoleId() == 1
                    ? AccountTypeDTO.QuanTriVien
                    : AccountTypeDTO.NhanVien,

                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),

                TenHanhDong = ActionLogDTO.CapNhat,
                TenBangTacDong = TableNameDTO.DonDatTour,
                MaDoiTuong = maDonDatTour,

                GiaTriTruoc = new
                {
                    TrangThaiThanhToan = oldTrangThaiThanhToan
                },

                GiaTriSau = new
                {
                    TrangThaiThanhToan = trangThai
                }
            });
            await _dashboardNotifier.NotifyDashboardChangedAsync("PaymentStatusChanged", new
            {
                MaDonDatTour = maDonDatTour,
                TrangThaiThanhToan = trangThai
            });
            return true;
        }


        public async Task<bool> UpdateInvoiceStatusAsync(int maDonDatTour, int trangThai)
        {
            if (trangThai == 4)
                throw new InvalidOperationException("Vui lòng dùng chức năng Hủy đơn (CancelOrderAsync) để hủy, không cập nhật trực tiếp trạng thái này.");

            if (!new[] { 1, 2, 3 }.Contains(trangThai))
                throw new InvalidOperationException("Trạng thái đơn không hợp lệ.");
            var order = await _context.DonDatTours
                .Include(x => x.NguoiDung)          
                .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour);

            if (order == null) return false;

            if (!CanTransition(order.TrangThaiDon, trangThai))
                throw new InvalidOperationException("Không được phép chuyển trạng thái này.");

            var oldStatus = order.TrangThaiDon;
            order.TrangThaiDon = trangThai;
            order.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();


            var (tieuDe, noiDung) = trangThai switch
            {
                2 => ("Đơn đặt tour đã được xác nhận", $"Đơn {order.MaDatCho} đã được xác nhận."),
                3 => ("Chuyến đi đã hoàn tất", $"Đơn {order.MaDatCho} đã hoàn tất. Cảm ơn bạn đã đồng hành cùng chúng tôi."),
                4 => ("Đơn đặt tour đã bị hủy", $"Đơn {order.MaDatCho} đã bị hủy."),
                _ => (null, null)
            };

            if (tieuDe != null)
            {
                await _notificationService.CreateForUserAsync(
                    order.MaNguoiDung,
                    new CreateNotificationDTO
                    {
                        TieuDe = tieuDe,
                        NoiDung = noiDung ?? "",
                        LoaiThongBao = (int)NotificationType.Booking,
                        LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                    });
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
            return true;
        }

        public async Task<int> CreateBookingByAdminAsync(CreateBookingAdminDTO dto)
        {
            const int maxRetry = 3;
            int maDonDatTour = 0;

            for (int attempt = 1; attempt <= maxRetry; attempt++)
            {
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    var user = await _context.NguoiDungs
                        .FirstOrDefaultAsync(x => x.MaNguoiDung == dto.MaNguoiDung)
                        ?? throw new KeyNotFoundException("Người dùng không tồn tại");

                    var chuyen = await _context.ChuyenKhoiHanhs
                        .Include(x => x.Tour)
                        .Include(x => x.GiaChuyens)
                        .FirstOrDefaultAsync(x => x.MaChuyen == dto.MaChuyen)
                        ?? throw new KeyNotFoundException("Chuyến không tồn tại");

                    if (chuyen.TrangThai != 1)
                        throw new InvalidOperationException("Chuyến không còn mở bán");

                    var tongKhach = dto.SoNguoiLon + dto.SoTreEm + dto.SoEmBe;
                    if (tongKhach <= 0)
                        throw new InvalidOperationException("Số khách phải lớn hơn 0");

                    var daDat = await _context.DonDatTours
                        .Where(x => x.MaChuyen == dto.MaChuyen && x.TrangThaiDon != 4)
                        .SumAsync(x => x.SoNguoiLon + x.SoTreEm + x.SoEmBe);

                    var conLai = chuyen.SoChoToiDa - daDat;
                    if (conLai < tongKhach)
                        throw new InvalidOperationException($"Không đủ chỗ. Còn lại: {conLai}");

                    // Kiểm tra số lượng hành khách
                    var soNguoiLonList = dto.DanhSachHanhKhach.Count(k => k.LoaiKhach == 1);
                    var soTreEmList = dto.DanhSachHanhKhach.Count(k => k.LoaiKhach == 2);
                    var soEmBeList = dto.DanhSachHanhKhach.Count(k => k.LoaiKhach == 3);

                    if (soNguoiLonList != dto.SoNguoiLon || soTreEmList != dto.SoTreEm || soEmBeList != dto.SoEmBe)
                        throw new InvalidOperationException("Số lượng hành khách trong danh sách không khớp.");

                    var gia = chuyen.GiaChuyens.FirstOrDefault()
                        ?? throw new InvalidOperationException("Chuyến chưa có bảng giá");

                    var nhanVien = await _context.NhanViens
                        .FirstOrDefaultAsync(x => x.MaNhanVien == dto.MaNhanVien);

                    int soPhongDon = dto.DanhSachHanhKhach.Count(k => k.PhongDon && k.LoaiKhach == 1);

                    decimal tongTien = dto.SoNguoiLon * gia.GiaNguoiLon +
                                       dto.SoTreEm * gia.GiaTreEm +
                                       dto.SoEmBe * gia.GiaEmBe +
                                       soPhongDon * gia.PhuThuPhongDon;

                    var thanhToanNgay = dto.ThanhToanNgay && dto.PhuongThucThanhToan == 2;

                    var maDatCho = $"CKH{DateTime.Now:yyyyMMddHHmmssfff}{Random.Shared.Next(100, 999)}";

                    var order = new DonDatTour
                    {
                        MaNguoiDung = dto.MaNguoiDung,
                        MaChuyen = dto.MaChuyen,
                        MaDatCho = maDatCho,
                        MaUuDai = dto.MaUuDai,
                        GhiChu = dto.GhiChu ?? "",
                        SoNguoiLon = dto.SoNguoiLon,
                        SoTreEm = dto.SoTreEm,
                        SoEmBe = dto.SoEmBe,
                        SoPhongDon = soPhongDon,
                        GiaNguoiLonTaiDat = gia.GiaNguoiLon,
                        GiaTreEmTaiDat = gia.GiaTreEm,
                        GiaEmBeTaiDat = gia.GiaEmBe,
                        PhuThuPhongDonTaiDat = gia.PhuThuPhongDon,
                        GiaTriGiamTaiDat = 0,
                        TongTien = tongTien,
                        NgayDat = DateTime.Now,
                        NgayCapNhat = DateTime.Now,
                        TrangThaiDon = thanhToanNgay ? 2 : 1,
                        MaNhanVienDuyet = thanhToanNgay ? dto.MaNhanVien : null,
                        NgayDuyet = thanhToanNgay ? DateTime.Now : null,
                    };

                    _context.DonDatTours.Add(order);

                    var khachHangs = dto.DanhSachHanhKhach.Select(k => new KhachHang
                    {
                        DonDatTour = order,
                        HoTen = k.HoTen,
                        SoDienThoai = k.SoDienThoai,
                        Email = k.Email,
                        NgaySinh = k.NgaySinh,
                        GioiTinh = k.GioiTinh,
                        LoaiKhach = k.LoaiKhach,
                        PhongDon = k.PhongDon,
                    }).ToList();

                    _context.KhachHangs.AddRange(khachHangs);

                    chuyen.SoChoDaDat += tongKhach;
                    chuyen.NgayCapNhat = DateTime.Now;

                    await _context.SaveChangesAsync();

                    if (thanhToanNgay)
                    {
                        _context.ThanhToans.Add(new ThanhToan
                        {
                            MaDonDatTour = order.MaDonDatTour,
                            PhuongThucThanhToan = 2,
                            MaGiaoDich = $"CASH-{maDatCho}",
                            NoiDung = $"Thu tiền mặt tại quầy - {chuyen.MaChuyenCode}",
                            NgayThanhToan = DateTime.Now,
                            TongTienThanhToan = tongTien,
                            TrangThaiThanhToan = 1,
                        });
                    }
                    else if (dto.PhuongThucThanhToan == 3)
                    {
                        _context.ThanhToans.Add(new ThanhToan
                        {
                            MaDonDatTour = order.MaDonDatTour,
                            PhuongThucThanhToan = 3,
                            MaGiaoDich = $"TRANSFER-{maDatCho}",
                            NoiDung = $"Chờ xác minh chuyển khoản",
                            NgayThanhToan = DateTime.Now,
                            TongTienThanhToan = tongTien,
                            TrangThaiThanhToan = 0,
                        });
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();



                    await _notificationService.CreateForUserAsync(
                        dto.MaNguoiDung,
                        new CreateNotificationDTO
                        {
                            TieuDe = "Đặt tour thành công",
                            NoiDung = $"Đơn đặt tour {maDatCho} của bạn đã được tạo thành công.",
                            LoaiThongBao = (int)NotificationType.Booking,
                            LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                        });


                    if (_currentUserService.GetRoleId() == 2)
                    {
                        var adminIds = await _context.NhanViens
                            .Where(x => x.MaVaiTro == 1)
                            .Select(x => x.MaNhanVien)
                            .ToListAsync();

                        if (adminIds.Any())
                        {
                            await _notificationService.CreateForStaffsAsync(
                                adminIds,
                                new CreateNotificationDTO
                                {
                                    TieuDe = "Nhân viên tạo đơn đặt tour",
                                    NoiDung = $"{_currentUserService.GetEmail()} vừa tạo đơn {maDatCho} cho khách {user.HoTen}.",
                                    LoaiThongBao = (int)NotificationType.Booking,
                                    LinkChiTiet = $"/Quan-ly/Don-dat-cac-chuyen-di"
                                });
                        }
                    }

                    await _hubContext.Clients.All.SendAsync("BookingCreated", new
                    {
                        MaDonDatTour = order.MaDonDatTour,
                        MaDatCho = order.MaDatCho,
                        TongTien = order.TongTien,
                        NgayDat = order.NgayDat
                    });
                    await _dashboardNotifier.NotifyDashboardChangedAsync("NewBooking", new
                    {
                        order.MaDonDatTour,
                        order.NgayDat,
                        order.TrangThaiDon
                    });
                    maDonDatTour = order.MaDonDatTour;
                    break; // Thành công → thoát retry
                }
                catch (DbUpdateConcurrencyException) when (attempt < maxRetry)
                {
                    await transaction.RollbackAsync();
                    foreach (var entry in _context.ChangeTracker.Entries())
                        entry.State = EntityState.Detached;
                    await Task.Delay(100 * attempt);
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }

            if (maDonDatTour == 0)
                throw new InvalidOperationException("Hệ thống đang bận, vui lòng thử lại.");

            // Log
            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NhanVien,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),
                TenHanhDong = ActionLogDTO.Tao,
                TenBangTacDong = TableNameDTO.DonDatTour,
                MaDoiTuong = maDonDatTour,
                GiaTriSau = new
                {
                    MaDonDatTour = maDonDatTour,
                    MaNguoiDung = dto.MaNguoiDung,
                    MaChuyen = dto.MaChuyen,
                    SoNguoiLon = dto.SoNguoiLon,
                    SoTreEm = dto.SoTreEm,
                    SoEmBe = dto.SoEmBe,
                    PhuongThucThanhToan = dto.PhuongThucThanhToan
                }
            });

            return maDonDatTour;
        }


        public async Task<bool> UpdateBookingByAdminAsync(UpdateBookingAdminDTO dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var order = await _context.DonDatTours
                    .Include(x => x.ChuyenKhoiHanh)
                    .FirstOrDefaultAsync(x => x.MaDonDatTour == dto.MaDonDatTour)
                    ?? throw new KeyNotFoundException("Không tìm thấy đơn đặt tour");

                if (order.TrangThaiDon == 3)
                    throw new InvalidOperationException("Đơn đã hoàn tất, không thể chỉnh sửa");

                if (order.TrangThaiDon == 4)
                    throw new InvalidOperationException("Đơn đã bị hủy");

                var oldValue = new
                {
                    order.SoNguoiLon,
                    order.SoTreEm,
                    order.SoEmBe,

                    order.MaUuDai,
                    order.TrangThaiDon
                };

                if (dto.SoNguoiLon.HasValue) order.SoNguoiLon = dto.SoNguoiLon.Value;
                if (dto.SoTreEm.HasValue) order.SoTreEm = dto.SoTreEm.Value;
                if (dto.SoEmBe.HasValue) order.SoEmBe = dto.SoEmBe.Value;
                if (dto.MaUuDai.HasValue) order.MaUuDai = dto.MaUuDai;

                var soKhachCu = oldValue.SoNguoiLon + oldValue.SoTreEm + oldValue.SoEmBe;
                var soKhachMoi = order.SoNguoiLon + order.SoTreEm + order.SoEmBe;
                var delta = soKhachMoi - soKhachCu;

                if (delta != 0)
                {
                    order.ChuyenKhoiHanh!.SoChoDaDat += delta;
                    order.ChuyenKhoiHanh.NgayCapNhat = DateTime.Now;
                }

                var daDat = await _context.DonDatTours
                    .Where(x => x.MaChuyen == order.MaChuyen
                             && x.MaDonDatTour != order.MaDonDatTour
                             && x.TrangThaiDon != 4)
                    .SumAsync(x => x.SoNguoiLon + x.SoTreEm + x.SoEmBe);

                if (order.ChuyenKhoiHanh.SoChoToiDa - daDat < soKhachMoi)
                    throw new InvalidOperationException("Không đủ chỗ sau khi cập nhật");

                if (dto.TrangThaiDon.HasValue)
                {
                    if (dto.TrangThaiDon.Value == 4)
                        throw new InvalidOperationException("Vui lòng dùng chức năng Hủy đơn (CancelOrderAsync) để hủy, không cập nhật trực tiếp trạng thái này.");

                    if (!new[] { 1, 2, 3 }.Contains(dto.TrangThaiDon.Value))
                        throw new InvalidOperationException("Trạng thái không hợp lệ");

                    order.TrangThaiDon = dto.TrangThaiDon.Value;
                }

                order.NgayCapNhat = DateTime.Now;
                await _context.SaveChangesAsync();
                if (dto.TrangThaiDon.HasValue && dto.TrangThaiDon.Value != oldValue.TrangThaiDon)
                {
                    var nguoiDung = await _context.NguoiDungs.FindAsync(order.MaNguoiDung);
                    if (nguoiDung != null)
                    {
                        var (tieuDe, noiDung) = dto.TrangThaiDon.Value switch
                        {
                            2 => ("Đơn đặt tour đã được xác nhận", $"Đơn {order.MaDatCho} đã được xác nhận."),
                            3 => ("Chuyến đi đã hoàn tất", $"Đơn {order.MaDatCho} đã hoàn tất."),
                            4 => ("Đơn đặt tour đã bị hủy", $"Đơn {order.MaDatCho} đã bị hủy."),
                            _ => (null, null)
                        };

                        if (tieuDe != null)
                        {
                            await _notificationService.CreateForUserAsync(
                                order.MaNguoiDung,
                                new CreateNotificationDTO
                                {
                                    TieuDe = tieuDe,
                                    NoiDung = noiDung,
                                    LoaiThongBao = (int)NotificationType.Booking,
                                    LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                                });
                        }
                    }
                }
                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NhanVien,
                    Email = _currentUserService.GetEmail(),
                    MaTaiKhoan = _currentUserService.GetUserId(),
                    TenHanhDong = ActionLogDTO.CapNhat,
                    TenBangTacDong = TableNameDTO.DonDatTour,
                    MaDoiTuong = dto.MaDonDatTour,
                    GiaTriTruoc = oldValue,
                    GiaTriSau = new { order.SoNguoiLon, order.SoTreEm, order.SoEmBe, order.MaUuDai, order.TrangThaiDon }
                });
                if (dto.TrangThaiDon.HasValue && dto.TrangThaiDon.Value != oldValue.TrangThaiDon)
                {
                    await _dashboardNotifier.NotifyDashboardChangedAsync("OrderStatusChanged", new
                    {
                        order.MaDonDatTour,
                        TrangThaiMoi = order.TrangThaiDon
                    });
                }
                await transaction.CommitAsync();
                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<ReserveSeatsResultDTO> ReserveSeatsAsync(int maNguoiDung, ReserveSeatsDTO dto)
        {
            var tongCho = dto.SoNguoiLon + dto.SoTreEm + dto.SoEmBe;
            if (tongCho <= 0)
                throw new InvalidOperationException("Số chỗ phải lớn hơn 0");

            var cuGiuCho = await _context.GiuChos
                .Where(x => x.MaChuyen == dto.MaChuyen && x.MaNguoiDung == maNguoiDung)
                .ToListAsync();
            _context.GiuChos.RemoveRange(cuGiuCho);

            var chuyen = await _context.ChuyenKhoiHanhs
                .FirstOrDefaultAsync(x => x.MaChuyen == dto.MaChuyen)
                ?? throw new KeyNotFoundException("Chuyến không tồn tại");

            if (chuyen.TrangThai != 1)
                throw new InvalidOperationException("Chuyến không còn mở bán");

            var choGiuHienTai = await _context.GiuChos
                .Where(x => x.MaChuyen == dto.MaChuyen
                         && x.MaNguoiDung != maNguoiDung
                         && x.ThoiGianHetHan > DateTime.Now)
                .SumAsync(x => (int?)x.SoChoGiu) ?? 0;

            var conLai = chuyen.SoChoToiDa - chuyen.SoChoDaDat - choGiuHienTai;
            if (conLai < tongCho)
                throw new InvalidOperationException($"Không đủ chỗ. Hiện còn: {conLai} chỗ");

            var giuCho = new GiuCho
            {
                MaChuyen = dto.MaChuyen,
                MaNguoiDung = maNguoiDung,
                SoChoGiu = tongCho,
                ThoiGianHetHan = DateTime.Now.AddMinutes(15),
                NgayTao = DateTime.Now
            };

            _context.GiuChos.Add(giuCho);
            await _context.SaveChangesAsync();

            return new ReserveSeatsResultDTO
            {
                MaGiuCho = giuCho.MaGiuCho,
                ThoiGianHetHan = giuCho.ThoiGianHetHan,
                SoChoConLai = conLai - tongCho
            };
        }

        public async Task ReleaseReservationAsync(int maGiuCho, int maNguoiDung)
        {
            var giuCho = await _context.GiuChos
                .FirstOrDefaultAsync(x => x.MaGiuCho == maGiuCho && x.MaNguoiDung == maNguoiDung);

            if (giuCho == null) return;

            _context.GiuChos.Remove(giuCho);
            await _context.SaveChangesAsync();
        }

        public async Task<int> CreateBookingByClientAsync(int maNguoiDung, CreateBookingClientDTO dto, int? maGiuCho)
        {
            const int maxRetry = 3;
            for (int attempt = 1; attempt <= maxRetry; attempt++)
            {
                using var transaction = await _context.Database.BeginTransactionAsync();
                try
                {
                    var chuyen = await _context.ChuyenKhoiHanhs
                        .Include(x => x.Tour).ThenInclude(x => x.HinhAnhTours)
                        .Include(x => x.GiaChuyens)
                        .FirstOrDefaultAsync(x => x.MaChuyen == dto.MaChuyen)
                        ?? throw new KeyNotFoundException("Chuyến không tồn tại");

                    if (chuyen.TrangThai != 1)
                        throw new InvalidOperationException("Chuyến không còn mở bán");

                    var tongKhach = dto.SoNguoiLon + dto.SoTreEm + dto.SoEmBe;
                    GiuCho? giuCho = null;

                    if (maGiuCho.HasValue)
                    {
                        giuCho = await _context.GiuChos
                            .FirstOrDefaultAsync(x => x.MaGiuCho == maGiuCho.Value && x.MaNguoiDung == maNguoiDung);

                        if (giuCho == null || giuCho.ThoiGianHetHan <= DateTime.Now)
                            throw new InvalidOperationException("Phiên giữ chỗ đã hết hạn.");

                        if (giuCho.SoChoGiu < tongKhach)
                            throw new InvalidOperationException("Số chỗ giữ không khớp.");
                    }
                    else
                    {
                        var choGiuNguoiKhac = await _context.GiuChos
                            .Where(x => x.MaChuyen == dto.MaChuyen && x.MaNguoiDung != maNguoiDung && x.ThoiGianHetHan > DateTime.Now)
                            .SumAsync(x => (int?)x.SoChoGiu) ?? 0;

                        var conLai = chuyen.SoChoToiDa - chuyen.SoChoDaDat - choGiuNguoiKhac;
                        if (conLai < tongKhach)
                            throw new InvalidOperationException($"Không đủ chỗ. Còn lại: {conLai}");
                    }

                    var gia = chuyen.GiaChuyens.FirstOrDefault()
                        ?? throw new InvalidOperationException("Chuyến chưa có bảng giá");

                    UuDai? uuDai = null;
                    decimal giaTriGiam = 0;
                    if (dto.MaUuDai.HasValue)
                    {
                        uuDai = await _context.UuDais
                            .FirstOrDefaultAsync(x => x.MaUuDai == dto.MaUuDai.Value
                                                   && x.TrangThai == 1
                                                   && x.NgayBatDau <= DateTime.Now
                                                   && x.NgayHetHan >= DateTime.Now
                                                   && x.SoLuongDaDung < x.SoLuongToiDa)
                            ?? throw new InvalidOperationException("Mã ưu đãi không hợp lệ.");
                    }

                    int soPhongDon = dto.DanhSachHanhKhach.Count(k => k.PhongDon && k.LoaiKhach == 1);
                    decimal tongTienGoc = dto.SoNguoiLon * gia.GiaNguoiLon + dto.SoTreEm * gia.GiaTreEm + dto.SoEmBe * gia.GiaEmBe;
                    decimal phuThuPhongDon = soPhongDon * gia.PhuThuPhongDon;

                    if (uuDai != null && tongTienGoc >= uuDai.DieuKienApDung)
                        giaTriGiam = Math.Round(tongTienGoc * uuDai.PhanTramGiam / 100, 0);

                    decimal tongTien = tongTienGoc + phuThuPhongDon - giaTriGiam;

                    var maDatCho = $"BK{DateTime.Now:yyyyMMddHHmmssfff}{Random.Shared.Next(100, 999)}";

                    var order = new DonDatTour
                    {
                        MaNguoiDung = maNguoiDung,
                        MaChuyen = dto.MaChuyen,
                        MaDatCho = maDatCho,
                        MaUuDai = dto.MaUuDai,
                        SoNguoiLon = dto.SoNguoiLon,
                        SoTreEm = dto.SoTreEm,
                        SoEmBe = dto.SoEmBe,
                        SoPhongDon = soPhongDon,
                        GhiChu = dto.GhiChu ?? "",
                        GiaNguoiLonTaiDat = gia.GiaNguoiLon,
                        GiaTreEmTaiDat = gia.GiaTreEm,
                        GiaEmBeTaiDat = gia.GiaEmBe,
                        PhuThuPhongDonTaiDat = gia.PhuThuPhongDon,
                        GiaTriGiamTaiDat = giaTriGiam,
                        TongTien = tongTien,
                        NgayDat = DateTime.Now,
                        NgayCapNhat = DateTime.Now,
                        TrangThaiDon = 1,
                    };

                    _context.DonDatTours.Add(order);
                    await _context.SaveChangesAsync();

                    var thanhToan = new ThanhToan
                    {
                        MaDonDatTour = order.MaDonDatTour,
                        PhuongThucThanhToan = dto.PhuongThucThanhToan ?? 2,
                        NgayThanhToan = DateTime.Now,
                        TongTienThanhToan = tongTien,
                        NoiDung = $"Thanh toán cho đơn {maDatCho}",
                        TrangThaiThanhToan = (dto.PhuongThucThanhToan == 1) ? 1 : 0,
                    };
                    _context.ThanhToans.Add(thanhToan);

                    if (dto.DanhSachHanhKhach.Any())
                    {
                        var khachHangs = dto.DanhSachHanhKhach.Select(k => new KhachHang
                        {
                            MaDonDatTour = order.MaDonDatTour,
                            HoTen = k.HoTen,
                            SoDienThoai = k.SoDienThoai,
                            Email = k.Email,
                            NgaySinh = k.NgaySinh,
                            GioiTinh = k.GioiTinh,
                            LoaiKhach = k.LoaiKhach,
                            PhongDon = k.PhongDon,
                        }).ToList();

                        _context.KhachHangs.AddRange(khachHangs);
                    }

                    chuyen.SoChoDaDat += tongKhach;
                    chuyen.NgayCapNhat = DateTime.Now;

                    if (uuDai != null) uuDai.SoLuongDaDung++;

                    if (giuCho != null) _context.GiuChos.Remove(giuCho);

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    // ====== Các tác vụ phụ (không được phép làm rollback booking đã commit) ======

                    // Cập nhật preference cho recommendation - cô lập riêng, lỗi không ảnh hưởng booking
                    try
                    {
                        await _RecommendationService.UpdatePreference(
                            maNguoiDung,
                            chuyen.MaTour,
                            RecommendationWeights.BookTour,
                            true
                        );
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[CreateBookingByClientAsync] UpdatePreference error: {ex.Message}");
                    }

                    // Thông báo cho client + nhân viên
                    try
                    {
                        await _notificationService.CreateForUserAsync(
                            maNguoiDung,
                            new CreateNotificationDTO
                            {
                                TieuDe = "Đặt tour thành công",
                                NoiDung = $"Đơn đặt tour {order.MaDatCho} của bạn đã được tạo thành công.",
                                LoaiThongBao = (int)NotificationType.Booking,
                                LinkChiTiet = $"/Thong-Tin-Ca-Nhan"
                            });

                        var staffIds = await _context.NhanViens
                            .Where(x => x.NgayXoa == null &&
                                       (x.MaVaiTro == RoleIds.Admin ||
                                        x.MaVaiTro == RoleIds.Staff))
                            .Select(x => x.MaNhanVien)
                            .ToListAsync();

                        await _notificationService.CreateForStaffsAsync(
                            staffIds,
                            new CreateNotificationDTO
                            {
                                TieuDe = "Có đơn đặt tour mới",
                                NoiDung = $"Khách hàng vừa đặt đơn {order.MaDatCho}.",
                                LoaiThongBao = (int)NotificationType.Booking,
                                LinkChiTiet = $"/Quan-ly/Don-dat-cac-chuyen-di"
                            });
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[CreateBookingByClientAsync] Notification error: {ex.Message}");
                    }

                    // Gửi email xác nhận - cô lập riêng
                    try
                    {
                        await _emailService.SendBookingConfirmationAsync(order);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[CreateBookingByClientAsync] Email error: {ex.Message}");
                    }

                    // Bắn realtime SignalR - cô lập riêng
                    try
                    {
                        await _hubContext.Clients.All.SendAsync("BookingCreated", new
                        {
                            MaDonDatTour = order.MaDonDatTour,
                            MaDatCho = order.MaDatCho,
                            TongTien = order.TongTien,
                            NgayDat = order.NgayDat
                        });
                        await _dashboardNotifier.NotifyDashboardChangedAsync("NewBooking", new
                        {
                            order.MaDonDatTour,
                            order.NgayDat,
                            order.TrangThaiDon
                        });
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[CreateBookingByClientAsync] Realtime error: {ex.Message}");
                    }

                    return order.MaDonDatTour;
                }
                catch (DbUpdateConcurrencyException) when (attempt < maxRetry)
                {
                    await transaction.RollbackAsync();
                    foreach (var entry in _context.ChangeTracker.Entries())
                        entry.State = EntityState.Detached;
                    await Task.Delay(100 * attempt);
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }

            throw new InvalidOperationException("Hệ thống đang bận, vui lòng thử lại.");
        }

        public async Task<List<UserBookingListDTO>> GetUserBookingsAsync(int maNguoiDung)
        {
            var list = await _context.DonDatTours
                .AsNoTracking()
                .Where(x => x.MaNguoiDung == maNguoiDung)
                .Include(x => x.ChuyenKhoiHanh).ThenInclude(x => x.Tour).ThenInclude(x => x.HinhAnhTours)
                .Include(x => x.ThanhToans)
                .OrderByDescending(x => x.NgayDat)
                .ToListAsync();

            return list.Select(x => new UserBookingListDTO
            {
                MaDonDatTour = x.MaDonDatTour,
                MaDatCho = x.MaDatCho,
                TenTour = x.ChuyenKhoiHanh.Tour.TenTour,
                HinhAnh = x.ChuyenKhoiHanh.Tour.HinhAnhTours
                                    .OrderBy(h => h.SoThuTu)
                                    .Select(h => h.DuongDanAnh)
                                    .FirstOrDefault(),
                NgayKhoiHanh = x.ChuyenKhoiHanh.NgayKhoiHanh,
                NgayKetThuc = x.ChuyenKhoiHanh.NgayKetThuc,
                DiemKhoiHanh = x.ChuyenKhoiHanh.DiemKhoiHanh,
                DiemDen = x.ChuyenKhoiHanh.DiemDen,
                SoNguoiLon = x.SoNguoiLon,
                SoTreEm = x.SoTreEm,
                SoEmBe = x.SoEmBe,
                TongTien = x.TongTien,
                TrangThaiDon = x.TrangThaiDon,
                NgayDat = x.NgayDat,
                TrangThaiThanhToan = GetTrangThaiThanhToan(x.ThanhToans),
            }).ToList();
        }

        public async Task<TourBookingDetailDTO?> GetUserBookingDetailAsync(int maDonDatTour, int maNguoiDung)
        {
            var exists = await _context.DonDatTours
                .AsNoTracking()
                .AnyAsync(x => x.MaDonDatTour == maDonDatTour && x.MaNguoiDung == maNguoiDung);

            if (!exists) return null;

            return await GetDetailAsync(maDonDatTour);
        }

        public async Task<bool> CancelByUserAsync(int maDonDatTour, int maNguoiDung)
        {
            var order = await _context.DonDatTours
                .Include(x => x.ChuyenKhoiHanh)
                .FirstOrDefaultAsync(x => x.MaDonDatTour == maDonDatTour && x.MaNguoiDung == maNguoiDung)
                ?? throw new KeyNotFoundException("Không tìm thấy đơn đặt tour");

            if (order.TrangThaiDon != 1)
                throw new InvalidOperationException("Chỉ có thể hủy đơn đang chờ duyệt.");

            var soKhach = order.SoNguoiLon + order.SoTreEm + order.SoEmBe;
            order.ChuyenKhoiHanh.SoChoDaDat -= soKhach;

            var oldStatus = order.TrangThaiDon;
            order.TrangThaiDon = 4;
            order.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NguoiDung,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = maNguoiDung,
                TenHanhDong = ActionLogDTO.CapNhat,
                TenBangTacDong = TableNameDTO.DonDatTour,
                MaDoiTuong = maDonDatTour,
                GiaTriTruoc = new { TrangThaiDon = oldStatus },
                GiaTriSau = new { TrangThaiDon = order.TrangThaiDon }
            });

            return true;
        }


        public async Task<bool> UpdatePassengerAsync(int maKhachHang, UpdatePassengerDTO dto)
        {
            var khach = await _context.KhachHangs
                .Include(x => x.DonDatTour)
                .FirstOrDefaultAsync(x => x.MaKhachHang == maKhachHang);

            if (khach == null) return false;

            if (khach.DonDatTour.TrangThaiDon >= 3)
                throw new InvalidOperationException("Không thể chỉnh sửa hành khách của đơn đã hoàn tất hoặc đã hủy.");

            var oldValue = new
            {
                khach.HoTen,
                khach.SoDienThoai,
                khach.Email,
                khach.NgaySinh,
                khach.GioiTinh,
                khach.LoaiKhach,
                khach.PhongDon
            };

            khach.HoTen = dto.HoTen;
            khach.SoDienThoai = dto.SoDienThoai;
            khach.NgaySinh = dto.NgaySinh;
            khach.GioiTinh = dto.GioiTinh;
            khach.LoaiKhach = dto.LoaiKhach;
            khach.PhongDon = dto.PhongDon;

            khach.DonDatTour.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NhanVien,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),
                TenHanhDong = ActionLogDTO.CapNhat,
                TenBangTacDong = TableNameDTO.DonDatTour,
                MaDoiTuong = maKhachHang,
                GiaTriTruoc = oldValue,
                GiaTriSau = new { dto.HoTen, dto.SoDienThoai, dto.NgaySinh, dto.GioiTinh, dto.LoaiKhach, dto.PhongDon }
            });

            return true;
        }
        private static string BuildFileName(ChuyenInfoDTO chuyen, int tongSoKhach)
        {
            // Format: MãChuyến_NgàyKhởiHành_SốLượngKhách.pdf
            var ngay = chuyen.NgayKhoiHanh.ToString("ddMMyyyy");
            var maChuyen = chuyen.MaChuyenCode.Replace(" ", "").Replace("/", "-");
            return $"{maChuyen}_{ngay}_{tongSoKhach}_khach.pdf";
        }

        public async Task<(byte[] Pdf, string FileName)> GenerateContractsPdfWithNameAsync(List<int> maDonDatTours)
        {
            var details = new List<TourBookingDetailDTO>();

            foreach (var id in maDonDatTours)
            {
                var detail = await GetDetailAsync(id);
                if (detail == null) continue;

                if (detail.TrangThaiDon < 2 || detail.TrangThaiDon == 4)
                    throw new InvalidOperationException($"Đơn {detail.MaDatCho} chưa được duyệt hoặc đã hủy, không thể in hợp đồng.");

                details.Add(detail);
            }

            if (!details.Any())
                throw new InvalidOperationException("Không có đơn hợp lệ để in.");

            var pdf = ContractPdfBuilder.GenerateContractsPdf(details);

            int tongKhach = details.Sum(d => d.SoNguoiLon + d.SoTreEm + d.SoEmBe);
            var fileName = BuildFileName(details[0].Chuyen, tongKhach);

            return (pdf, fileName);
        }

        public async Task<(byte[] Pdf, string FileName)> GenerateContractsPdfByChuyenWithNameAsync(int maChuyen)
        {
            var ids = await _context.DonDatTours
                .Where(x => x.MaChuyen == maChuyen && x.TrangThaiDon >= 2 && x.TrangThaiDon != 4)
                .Select(x => x.MaDonDatTour)
                .ToListAsync();

            if (!ids.Any())
                throw new InvalidOperationException("Chuyến này chưa có đơn nào được duyệt.");

            return await GenerateContractsPdfWithNameAsync(ids);
        }
    }
}