using System.Globalization;
using System.Text;
using DTOs.Page;
using Interfaces;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Constants;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Departure;
using travel_recommendation_and_booking_system.DTOs.FavoriteTour;
using travel_recommendation_and_booking_system.DTOs.ImageTour;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.DTOs.LogSystem;
using travel_recommendation_and_booking_system.DTOs.Schedule;
using travel_recommendation_and_booking_system.DTOs.ScheduleDetails;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.DTOs.Tour_KS;
using travel_recommendation_and_booking_system.DTOs.TypeTour;
using travel_recommendation_and_booking_system.Helper;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;
using travel_recommendation_and_booking_system.Validations;

namespace travel_recommendation_and_booking_system.Services
{
    public class TourService : ITourService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly ILogService _logService;
        private readonly ICurrentUserService _currentUserService;
        private const string DEFAULT_SCHEDULE_IMAGE = "default-schedule.jpg";
        private readonly IRecommendationService _recommendation;

        public TourService(AppDbContext context, IWebHostEnvironment env, ILogService logService, ICurrentUserService currentUserService,IRecommendationService recommendation)
        {
            _context = context;
            _env = env;
            _logService = logService;
            _currentUserService = currentUserService;
            _recommendation = recommendation;
        }


        public async Task<int> CreateFullTourAsync(TourFullCreateDTO dto, List<IFormFile> images, List<IFormFile> scheduleImages)
        {
            validatorSheduleTour.ValidateSchedules(dto.LichTrinh);
            ValidateDuplicateScheduleDay(dto.LichTrinh);
            ValidateContinuousScheduleDay(dto.LichTrinh);
            ValidateTourDuration(dto.TourInfo.Ngay, dto.LichTrinh);

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 1. Tạo Tour
                var tourEntity = new Tour
                {
                    TenTour = dto.TourInfo.TenTour,
                    MaLoaiTour = dto.TourInfo.MaLoaiTour,
                    Slug = SlugHelper.GenerateSlug(dto.TourInfo.TenTour),
                    MoTa = dto.TourInfo.MoTa,
                    Ngay = dto.TourInfo.Ngay,
                    Dem = dto.TourInfo.Dem,
                    TrangThai = 1,
                    NgayTao = DateTime.Now,
                    NgayCapNhat = DateTime.Now
                };

                _context.Tours.Add(tourEntity);
                await _context.SaveChangesAsync(); // sinh MaTour

                // 2. Upload ảnh tour
                if (images != null && images.Any())
                    await UploadImagesTourAsync(tourEntity.MaTour, images);

                // 3. Tạo LichTrinh — mỗi ngày gắn 1 khách sạn riêng qua MaKhachSan
                int imageIndex = 0;
                var lichTrinhMap = new Dictionary<int, LichTrinh>();

                foreach (var schedule in dto.LichTrinh)
                {
                    string duongDanAnhDB = DEFAULT_SCHEDULE_IMAGE;

                    if (scheduleImages != null && imageIndex < scheduleImages.Count)
                    {
                        var fileAnh = scheduleImages[imageIndex];
                        if (fileAnh != null && fileAnh.Length > 0)
                        {
                            duongDanAnhDB = await SaveScheduleImageAsync(
                                fileAnh,
                                tourEntity.MaTour,
                                schedule.TenLichTrinh,
                                schedule.ChiTietLichTrinh,
                                schedule.SoThuTuNgay
                            );
                        }
                        imageIndex++;
                    }

                    var schEntity = new LichTrinh
                    {
                        MaTour = tourEntity.MaTour,
                        SoThuTuNgay = schedule.SoThuTuNgay,
                        BuaAn = schedule.BuaAn,
                        HoatDongChinh = schedule.HoatDongChinh,
                        DuongDanAnh = duongDanAnhDB,
                        LuuY = schedule.LuuY,
                        TrangThai = true,
                        TenLichTrinh = schedule.TenLichTrinh,
                        MaKhachSan = (schedule.MaKhachSan.HasValue && schedule.MaKhachSan > 0)
                                            ? schedule.MaKhachSan
                                            : null,                    // ← khách sạn theo ngày
                        NgayTao = DateTime.Now,
                        NgayCapNhat = DateTime.Now
                    };

                    _context.LichTrinhs.Add(schEntity);

                    if (schedule.ChiTietLichTrinh != null)
                    {
                        foreach (var detail in schedule.ChiTietLichTrinh)
                        {
                            _context.CTLichTrinhs.Add(new CTLichTrinh
                            {
                                LichTrinh = schEntity,
                                MaDiaDiem = detail.MaDiaDiem,
                                GioBatDau = detail.GioBatDau,
                                GioKetThuc = detail.GioKetThuc,
                                HoatDong = detail.HoatDong
                            });
                        }
                    }

                    lichTrinhMap[schedule.SoThuTuNgay] = schEntity;
                }

                await _context.SaveChangesAsync(); // sinh MaLichTrinh cho tất cả

                // 4. Tạo ChuyenKhoiHanh
                if (dto.ChuyenKhoiHanhs != null)
                {
                    foreach (var dep in dto.ChuyenKhoiHanhs)
                    {
                        var chuyen = dep.ChuyenKhoiHanh;

                        if (chuyen.NgayKetThuc <= chuyen.NgayKhoiHanh)
                            throw new Exception("Chuyến khởi hành: Ngày kết thúc phải lớn hơn ngày khởi hành.");

                        if (chuyen.NgayKhoiHanh <= DateTime.Now)
                            throw new Exception("Chuyến khởi hành: Ngày khởi hành phải ở tương lai.");

                        if (dep.DanhSachGia == null || !dep.DanhSachGia.Any())
                            throw new Exception("Chuyến khởi hành: Phải có ít nhất 1 mức giá.");
                        bool TrongNuoc = true;
                        var tenPhuongTien = await GetTenPhuongTienAsync(chuyen.MaPhuongTien);
                        var maChuyenCode = await GenerateUniqueCodeAsync(
                            TrongNuoc,
                            chuyen.DiemKhoiHanh,
                            tenPhuongTien,
                            chuyen.NgayKhoiHanh);

                        var depEntity = new ChuyenKhoiHanh
                        {
                            MaTour = tourEntity.MaTour,
                            MaHDV = chuyen.MaHDV,
                            MaPhuongTien = chuyen.MaPhuongTien,
                            MaChuyenCode = maChuyenCode,
                            NgayKhoiHanh = chuyen.NgayKhoiHanh,
                            NgayKetThuc = chuyen.NgayKetThuc,
                            DiemKhoiHanh = chuyen.DiemKhoiHanh,
                            DiemDen = chuyen.DiemDen,
                            GioDenNoiDi = chuyen.GioDenNoiDi,
                            GioDenNoiVe = chuyen.GioDenNoiVe,
                            GhiChu = chuyen.GhiChu,
                            SoChoToiDa = chuyen.SoChoToiDa,
                            TrangThai = GetDepartureStatus(chuyen.NgayKhoiHanh, chuyen.NgayKetThuc)
                        };

                        _context.ChuyenKhoiHanhs.Add(depEntity);

                        foreach (var gia in dep.DanhSachGia)
                        {
                            _context.GiaChuyens.Add(new GiaChuyen
                            {
                                ChuyenKhoiHanh = depEntity,
                                GiaNguoiLon = gia.GiaNguoiLon,
                                GiaTreEm = gia.GiaTreEm,
                                GiaEmBe = gia.GiaEmBe,
                                PhuThuPhongDon = gia.PhuThuPhongDon
                            });
                        }
                    }
                }

                // 5. Tính GiaTu
                tourEntity.GiaTu = dto.ChuyenKhoiHanhs != null && dto.ChuyenKhoiHanhs.Any()
                    ? dto.ChuyenKhoiHanhs.SelectMany(x => x.DanhSachGia).Min(x => x.GiaNguoiLon)
                    : 0;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                    Email = _currentUserService.GetEmail(),
                    MaTaiKhoan = _currentUserService.GetUserId() ?? 0,
                    TenHanhDong = ActionLogDTO.Tao,
                    TenBangTacDong = TableNameDTO.Tour,
                    MaDoiTuong = tourEntity.MaTour,
                    GiaTriSau = new
                    {
                        tourEntity.MaTour,
                        tourEntity.TenTour,
                        tourEntity.MaLoaiTour,
                        tourEntity.Ngay,
                        tourEntity.Dem,
                        tourEntity.TrangThai,
                    }
                });

                return tourEntity.MaTour;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> UpdateFullTourAsync(int tourId, TourFullCreateDTO dto, List<IFormFile> images, List<IFormFile> scheduleImages)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                
                var existingTour = await _context.Tours
                    .FirstOrDefaultAsync(t => t.MaTour == tourId);

                if (existingTour == null) return false;

                var oldData = new
                {
                    existingTour.TenTour,
                    existingTour.MaLoaiTour,
                    existingTour.MoTa,
                    existingTour.Ngay,
                    existingTour.Dem,
                    existingTour.TrangThai
                };

                if (dto?.TourInfo != null)
                {
                    existingTour.TenTour = dto.TourInfo.TenTour;
                    existingTour.Slug = SlugHelper.GenerateSlug(dto.TourInfo.TenTour);
                    existingTour.MaLoaiTour = dto.TourInfo.MaLoaiTour;
                    existingTour.MoTa = dto.TourInfo.MoTa;
                    existingTour.Ngay = dto.TourInfo.Ngay;
                    existingTour.Dem = dto.TourInfo.Dem;
                    existingTour.TrangThai = dto.TourInfo.TrangThai;
                    existingTour.NgayCapNhat = DateTime.Now;
                }

                if (images != null && images.Any())
                    await UploadImagesTourAsync(tourId, images);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                    Email = _currentUserService.GetEmail(),
                    MaTaiKhoan = _currentUserService.GetUserId() ?? 0,
                    TenHanhDong = ActionLogDTO.CapNhat,
                    TenBangTacDong = TableNameDTO.Tour,
                    MaDoiTuong = existingTour.MaTour,
                    GiaTriTruoc = oldData,
                    GiaTriSau = new
                    {
                        existingTour.TenTour,
                        existingTour.MaLoaiTour,
                        existingTour.MoTa,
                        existingTour.Ngay,
                        existingTour.Dem,
                        existingTour.TrangThai
                    }
                });

                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        public async Task<TourReponseDTO?> GetTourDetailAsync(int tourId)
        {
            var tour = await _context.Tours
                .Include(t => t.LichTrinhs).ThenInclude(l => l.CTLichTrinhs)
                .Include(t => t.LichTrinhs).ThenInclude(l => l.KhachSan)  // ← KS theo ngày
                .Include(t => t.ChuyenKhoiHanhs).ThenInclude(c => c.GiaChuyens)
                .Include(t => t.HinhAnhTours)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.MaTour == tourId);

            if (tour == null) return null;

            return new TourReponseDTO
            {
                TourInfo = new TourDTO
                {
                    MaTour = tour.MaTour,
                    TenTour = tour.TenTour,
                    MaLoaiTour = tour.MaLoaiTour,
                    Slug = tour.Slug,
                    MoTa = tour.MoTa,
                    Ngay = tour.Ngay,
                    Dem = tour.Dem,
                    TrangThai = tour.TrangThai
                },

                Images = tour.HinhAnhTours?
                    .Where(a => a.NgayXoa == null)
                    .OrderBy(a => a.SoThuTu)
                    .Select(a => new ImageTourResponseDTO
                    {
                        MaAnhTour = a.MaAnhTour,
                        DuongDanAnh = a.DuongDanAnh,
                        AnhChinh = a.AnhChinh,
                        SoThuTu = a.SoThuTu
                    }).ToList() ?? new List<ImageTourResponseDTO>(),

                LichTrinh = tour.LichTrinhs?
                    .Where(l => l.NgayXoa == null)
                    .OrderBy(l => l.SoThuTuNgay)
                    .Select(l => new ScheduleReponseDTO
                    {
                        MaLichTrinh = l.MaLichTrinh,
                        MaTour = l.MaTour,
                        TenLichTrinh = l.TenLichTrinh,
                        SoThuTuNgay = l.SoThuTuNgay,
                        BuaAn = l.BuaAn,
                        HoatDongChinh = l.HoatDongChinh,
                        LuuY = l.LuuY,
                        TrangThai = l.TrangThai,
                        DuongDanAnh = l.DuongDanAnh,
                        // ← khách sạn của ngày này
                        MaKhachSan = l.MaKhachSan,
                        TenKhachSan = l.KhachSan != null ? l.KhachSan.TenKhachSan : null,
                        SlugKhachSan = l.KhachSan != null ? l.KhachSan.Slug : null,
                        SoSaoKhachSan = l.KhachSan != null ? l.KhachSan.SoSao : (int?)null,
                        ChiTietLichTrinhs = l.CTLichTrinhs?
                            .OrderBy(ct => ct.GioBatDau)
                            .Select(ct => new ScheduleDetailsDTO
                            {
                                MaCTLT = ct.MaCTLT,
                                MaLichTrinh = ct.MaLichTrinh,
                                MaDiaDiem = ct.MaDiaDiem,
                                GioBatDau = ct.GioBatDau,
                                GioKetThuc = ct.GioKetThuc,
                                HoatDong = ct.HoatDong
                            }).ToList() ?? new List<ScheduleDetailsDTO>()
                    }).ToList() ?? new List<ScheduleReponseDTO>(),

                ChuyenKhoiHanhs = tour.ChuyenKhoiHanhs?
                    .Select(c => new DepartureFullDTO
                    {
                        ChuyenKhoiHanh = new DepartureDTO
                        {
                            MaChuyen = c.MaChuyen,
                            MaHDV = c.MaHDV,
                            MaPhuongTien = c.MaPhuongTien,
                            MaChuyenCode = c.MaChuyenCode,
                            NgayKhoiHanh = c.NgayKhoiHanh,
                            NgayKetThuc = c.NgayKetThuc,
                            DiemKhoiHanh = c.DiemKhoiHanh,
                            DiemDen = c.DiemDen,
                            GioDenNoiDi = c.GioDenNoiDi,
                            GioDenNoiVe = c.GioDenNoiVe,
                            SoChoToiDa = c.SoChoToiDa,
                            SoChoDaDat = c.SoChoDaDat,
                            TrangThai = c.TrangThai,
                            GhiChu = c.GhiChu
                        },
                        DanhSachGia = c.GiaChuyens?
                            .Select(g => new GiaChuyenDTO
                            {
                                GiaNguoiLon = g.GiaNguoiLon,
                                GiaTreEm = g.GiaTreEm,
                                GiaEmBe = g.GiaEmBe,
                                PhuThuPhongDon = g.PhuThuPhongDon
                            }).ToList() ?? new List<GiaChuyenDTO>()
                    }).ToList() ?? new List<DepartureFullDTO>()
            };
        }
        //xem chi tiết bằng Slug cho client
        public async Task<TourReponseDTO?> GetTourDetailBySlugAsync(string slug)
        {
            var now = DateTime.Now;

            var tour = await _context.Tours
                .Include(t => t.LichTrinhs).ThenInclude(l => l.CTLichTrinhs).ThenInclude(d => d.DiaDiem)
                .Include(t => t.LichTrinhs).ThenInclude(l => l.KhachSan)  // ← KS theo ngày
                .Include(t => t.ChuyenKhoiHanhs).ThenInclude(pt => pt.PhuongTien)
                .Include(t => t.ChuyenKhoiHanhs).ThenInclude(c => c.GiaChuyens)
                .Include(t => t.HinhAnhTours)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Slug == slug.Trim().ToLower() && t.NgayXoa == null);

            if (tour == null) return null;

            return new TourReponseDTO
            {
                TourInfo = new TourDTO
                {
                    MaTour = tour.MaTour,
                    TenTour = tour.TenTour,
                    GiaTu = tour.GiaTu,
                    MaLoaiTour = tour.MaLoaiTour,
                    MoTa = tour.MoTa,
                    Ngay = tour.Ngay,
                    Dem = tour.Dem,
                    TrangThai = tour.TrangThai
                },

                Images = tour.HinhAnhTours?
                    .Where(a => a.NgayXoa == null)
                    .OrderBy(a => a.SoThuTu)
                    .Select(a => new ImageTourResponseDTO
                    {
                        MaAnhTour = a.MaAnhTour,
                        DuongDanAnh = a.DuongDanAnh,
                        AnhChinh = a.AnhChinh,
                        SoThuTu = a.SoThuTu
                    }).ToList() ?? new List<ImageTourResponseDTO>(),

                LichTrinh = tour.LichTrinhs?
                    .Where(l => l.NgayXoa == null)
                    .OrderBy(l => l.SoThuTuNgay)
                    .Select(l => new ScheduleReponseDTO
                    {
                        MaLichTrinh = l.MaLichTrinh,
                        MaTour = l.MaTour,
                        TenLichTrinh = l.TenLichTrinh,
                        SoThuTuNgay = l.SoThuTuNgay,
                        BuaAn = l.BuaAn,
                        HoatDongChinh = l.HoatDongChinh,
                        LuuY = l.LuuY,
                        TrangThai = l.TrangThai,
                        DuongDanAnh = l.DuongDanAnh,
                        // ← khách sạn của ngày này
                        MaKhachSan = l.MaKhachSan,
                        TenKhachSan = l.KhachSan != null ? l.KhachSan.TenKhachSan : null,
                        SlugKhachSan = l.KhachSan != null ? l.KhachSan.Slug : null,
                        SoSaoKhachSan = l.KhachSan != null ? l.KhachSan.SoSao : (int?)null,
                        ChiTietLichTrinhs = l.CTLichTrinhs?
                            .OrderBy(ct => ct.GioBatDau)
                            .Select(ct => new ScheduleDetailsDTO
                            {
                                MaCTLT = ct.MaCTLT,
                                MaLichTrinh = ct.MaLichTrinh,
                                MaDiaDiem = ct.MaDiaDiem,
                                TenDiaDiem = ct.DiaDiem != null ? ct.DiaDiem.TenDiaDiem : null,
                                GioBatDau = ct.GioBatDau,
                                GioKetThuc = ct.GioKetThuc,
                                HoatDong = ct.HoatDong
                            }).ToList() ?? new List<ScheduleDetailsDTO>()
                    }).ToList() ?? new List<ScheduleReponseDTO>(),

                ChuyenKhoiHanhs = tour.ChuyenKhoiHanhs?
                    .Where(c => c.NgayXoa == null
                             && c.NgayKhoiHanh >= now
                             && c.TrangThai != 3
                             && c.TrangThai != 4
                             && c.SoChoToiDa > 0
                             && (c.SoChoToiDa - c.SoChoDaDat) > 0)
                    .OrderBy(c => c.NgayKhoiHanh)
                    .Select(c => new DepartureFullDTO
                    {
                        ChuyenKhoiHanh = new DepartureDTO
                        {
                            MaChuyen = c.MaChuyen,
                            MaHDV = c.MaHDV,
                            MaPhuongTien = c.MaPhuongTien,
                            TenPhuongTien = c.PhuongTien != null ? c.PhuongTien.TenPhuongTien : null,
                            Icon = c.PhuongTien != null ? c.PhuongTien.Icon : null,
                            MaChuyenCode = c.MaChuyenCode,
                            NgayKhoiHanh = c.NgayKhoiHanh,
                            NgayKetThuc = c.NgayKetThuc,
                            DiemKhoiHanh = c.DiemKhoiHanh,
                            DiemDen = c.DiemDen,
                            GioDenNoiDi = c.GioDenNoiDi,
                            GioDenNoiVe = c.GioDenNoiVe,
                            SoChoToiDa = c.SoChoToiDa,
                            SoChoDaDat = c.SoChoDaDat,
                            TrangThai = c.TrangThai,
                            GhiChu = c.GhiChu
                        },
                        DanhSachGia = c.GiaChuyens?
                            .Select(g => new GiaChuyenDTO
                            {
                                GiaNguoiLon = g.GiaNguoiLon,
                                GiaTreEm = g.GiaTreEm,
                                GiaEmBe = g.GiaEmBe,
                                PhuThuPhongDon = g.PhuThuPhongDon
                            }).ToList() ?? new List<GiaChuyenDTO>()
                    }).ToList() ?? new List<DepartureFullDTO>()
            };
        }
        //Lấy danh sách tour theo địa điểm 
        public async Task<TourByLocationResponseDTO?> GetToursByLocationSlugAsync(string locationSlug)
        {
            if (string.IsNullOrWhiteSpace(locationSlug))
                return null;

            var location = await _context.DiaDiems
                .AsNoTracking()
                .FirstOrDefaultAsync(x =>
                    x.Slug == locationSlug.Trim().ToLower()
                    && x.NgayXoa == null);

            if (location == null)
                return null;

            var tourIds = await _context.CTLichTrinhs
                .AsNoTracking()
                .Where(x =>
                    x.MaDiaDiem == location.MaDiaDiem &&
                    x.LichTrinh.NgayXoa == null)
                .Select(x => x.LichTrinh.MaTour)
                .Distinct()
                .ToListAsync();

            var tours = await _context.Tours
              .Include(x => x.HinhAnhTours)
              .Include(x => x.ChuyenKhoiHanhs)
              .AsNoTracking()
              .Where(x =>
                  tourIds.Contains(x.MaTour) &&
                  x.TrangThai == 1 &&
                  x.NgayXoa == null)
              .Select(x => new TourCardResponseDTO
              {
                  MaTour = x.MaTour,
                  TenTour = x.TenTour,
                  Slug = x.Slug,
                  MoTa = x.MoTa,
                  Ngay = x.Ngay,
                  Dem = x.Dem,

                  GiaTu = x.GiaTu, 

                  HinhAnhChinh = x.HinhAnhTours
                      .Where(i => i.NgayXoa == null)
                      .OrderByDescending(i => i.AnhChinh)
                      .ThenBy(i => i.SoThuTu)
                      .Select(i => i.DuongDanAnh)
                      .FirstOrDefault(),

                  DiemDens = x.ChuyenKhoiHanhs
                      .Where(c => c.TrangThai != 4)
                      .Select(c => c.DiemDen)
                      .Distinct()
                      .ToList()
              })
              .ToListAsync();

            return new TourByLocationResponseDTO
            {
                TenDiaDiem = location.TenDiaDiem,
                Slug = location.Slug,
                Tours = tours
            };
        }
        public async Task<bool> SoftDeleteTourAsync(int tourId)
        {
            var tour = await _context.Tours
                .Include(t => t.ChuyenKhoiHanhs)
                .FirstOrDefaultAsync(t => t.MaTour == tourId);

            if (tour == null || tour.NgayXoa != null) return false;

            bool hasRunningDeparture = tour.ChuyenKhoiHanhs.Any(x =>
                x.NgayXoa == null && x.TrangThai == 2);

            if (hasRunningDeparture)
                throw new Exception("Tour đang có chuyến khởi hành diễn ra, không thể xóa.");

            var oldData = new
            {
                tour.MaTour,
                tour.TenTour,
                tour.TrangThai
            };

            tour.NgayXoa = DateTime.Now;
            tour.NgayCapNhat = DateTime.Now;
            tour.TrangThai = 3;

            var result = await _context.SaveChangesAsync() > 0;
            if (!result) return false;

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId() ?? 0,
                TenHanhDong = ActionLogDTO.Xoa,
                TenBangTacDong = TableNameDTO.Tour,
                MaDoiTuong = tour.MaTour,
                GiaTriTruoc = oldData,
                GiaTriSau = new
                {
                    tour.MaTour,
                    tour.TrangThai,
                    tour.NgayXoa
                }
            });

            return true;
        }

        public async Task<PageDTO<TourReponseDTO>> GetPagedTourAsync(int page, int pageSize, string? searchTerm, int? status)
        {
            var query = _context.Tours
                .Include(t => t.LoaiHinhTour)
                .Where(t => t.NgayXoa == null)
                
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
                query = query.Where(t => t.TenTour.Contains(searchTerm));

            if (status.HasValue)
                query = query.Where(t => t.TrangThai == status.Value);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(t => t.MaTour)
                .AsNoTracking()
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new TourReponseDTO
                {
                    TourInfo = new TourDTO
                    {
                        MaTour = t.MaTour,
                        TenTour = t.TenTour,
                        MaLoaiTour = t.MaLoaiTour,
                        TenLoaiTour = t.LoaiHinhTour.TenLoaiTour,
                        MoTa = t.MoTa,
                        Ngay = t.Ngay,
                        Dem = t.Dem,
                        TrangThai = t.TrangThai
                    },
                    Images = t.HinhAnhTours
                        .Where(img => img.NgayXoa == null)
                        .Select(img => new ImageTourResponseDTO
                        {
                            MaAnhTour = img.MaAnhTour,
                            DuongDanAnh = img.DuongDanAnh,
                            AnhChinh = img.AnhChinh
                        }).ToList()
                })
                .ToListAsync();

            return new PageDTO<TourReponseDTO>
            {
                Items = items,
                TotalItems = totalCount,
                PageNumber = page,
                PageSize = pageSize
            };
        }
        public async Task<List<TourSelectDTO>> GetToursForSelectAsync(string? keyword = null, int? status = null)
        {
            var query = _context.Tours
                .Where(t => t.NgayXoa == null)
                .AsQueryable();

            // Lọc theo từ khóa
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var lowerKey = keyword.ToLower();
                query = query.Where(t =>
                    t.TenTour.ToLower().Contains(lowerKey) 
                );
            }

            // Lọc theo trạng thái
            if (status.HasValue)
            {
                query = query.Where(t => t.TrangThai == status.Value);
            }
            else
            {
                // Mặc định chỉ lấy tour đang hoạt động
                query = query.Where(t => t.TrangThai == 1);
            }

            var tours = await query
                .OrderBy(t => t.TenTour)
                .Select(t => new TourSelectDTO
                {
                    MaTour = t.MaTour,
                    TenTour = t.TenTour
                })
                .ToListAsync();

            return tours;
        }

        public async Task<bool> SetMainImageAsync(int imageId)
        {
            var image = await _context.HinhAnhTours.FirstOrDefaultAsync(x => x.MaAnhTour == imageId);
            if (image == null) throw new Exception("Không tìm thấy ảnh");

            var images = await _context.HinhAnhTours
                .Where(x => x.MaTour == image.MaTour)
                .ToListAsync();

            foreach (var item in images)
                item.AnhChinh = false;

            image.AnhChinh = true;
            image.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId() ?? 0,
                TenHanhDong = "Đặt ảnh chính",
                TenBangTacDong = TableNameDTO.HinhAnhTour,
                MaDoiTuong = image.MaAnhTour,
                GiaTriSau = new
                {
                    image.MaAnhTour,
                    image.MaTour,
                    image.DuongDanAnh,
                    image.AnhChinh
                }
            });

            return true;
        }

        public async Task<bool> DeleteImageAsync(int imageId)
        {
            var image = await _context.HinhAnhTours.FirstOrDefaultAsync(x => x.MaAnhTour == imageId);
            if (image == null) throw new Exception("Không tìm thấy ảnh");

            var oldData = new
            {
                image.MaAnhTour,
                image.MaTour,
                image.DuongDanAnh,
                image.AnhChinh
            };

            bool isMainImage = image.AnhChinh;
            int maTour = image.MaTour;
            string? oldPath = image.DuongDanAnh;

            _context.HinhAnhTours.Remove(image);
            await _context.SaveChangesAsync();

            DeletePhysicalFile(oldPath);

            if (isMainImage)
            {
                var nextImage = await _context.HinhAnhTours
                    .Where(x => x.MaTour == maTour)
                    .OrderBy(x => x.SoThuTu)
                    .FirstOrDefaultAsync();

                if (nextImage != null)
                {
                    nextImage.AnhChinh = true;
                    await _context.SaveChangesAsync();
                }
            }

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                MaTaiKhoan = _currentUserService.GetUserId() ?? 0,
                TenHanhDong = ActionLogDTO.Xoa,
                TenBangTacDong = TableNameDTO.HinhAnhTour,
                MaDoiTuong = image.MaAnhTour,
                GiaTriTruoc = oldData
            });

            return true;
        }

        public async Task<bool> ChangeStatusAsync(int maTour, int trangThai)
        {
            var tour = await _context.Tours
                .Include(t => t.LichTrinhs)
                .Include(t => t.HinhAnhTours)
                .Include(t => t.ChuyenKhoiHanhs)
                .FirstOrDefaultAsync(t => t.MaTour == maTour && t.NgayXoa == null);

            if (tour == null)
                throw new Exception("Không tìm thấy tour.");

            if (tour.TrangThai == 3)
                throw new Exception("Tour đã ngừng kinh doanh, không thể thay đổi.");

            if (tour.TrangThai == trangThai)
                return true;

            var oldStatus = tour.TrangThai;

            switch (trangThai)
            {
                case 1:
                    ValidateTourForOpen(tour);
                    break;

                case 2:
                    break;

                case 3:
                    bool hasRunningDeparture = tour.ChuyenKhoiHanhs.Any(x =>
                        x.NgayXoa == null && x.TrangThai == 2);

                    if (hasRunningDeparture)
                        throw new Exception("Tour đang có chuyến khởi hành diễn ra, không thể ngừng kinh doanh.");
                    break;

                default:
                    throw new Exception("Trạng thái không hợp lệ.");
            }

            tour.TrangThai = trangThai;
            tour.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId() ?? 0,
                TenHanhDong = ActionLogDTO.CapNhatTrangThai,
                TenBangTacDong = TableNameDTO.Tour,
                MaDoiTuong = tour.MaTour,
                GiaTriTruoc = new { TrangThai = oldStatus },
                GiaTriSau = new { TrangThai = tour.TrangThai }
            });

            return true;
        }

        private void DeletePhysicalFile(string? duongDanAnh)
        {
            if (string.IsNullOrEmpty(duongDanAnh)) return;

            var relativePath = duongDanAnh.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            string filePath = Path.Combine(_env.WebRootPath, relativePath);

            if (File.Exists(filePath))
                File.Delete(filePath);
        }

        private async Task UploadImagesTourAsync(int maTour, List<IFormFile> images)
        {
            if (images == null || !images.Any()) return;

            var uploadFolder = Path.Combine(_env.WebRootPath, "img", "tour");
            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            bool hasMainImage = await _context.HinhAnhTours
                .AnyAsync(x => x.MaTour == maTour && x.AnhChinh);

            int index = await _context.HinhAnhTours
                .Where(x => x.MaTour == maTour)
                .Select(x => (int?)x.SoThuTu)
                .MaxAsync() ?? 0;
            index++;

            foreach (var file in images)
            {
                var fileName = $"{DateTime.Now:yyyyMMddHHmmssfff}_{maTour}_{index}{Path.GetExtension(file.FileName)}";
                var fullPath = Path.Combine(uploadFolder, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                    await file.CopyToAsync(stream);

                _context.HinhAnhTours.Add(new HinhAnhTour
                {
                    MaTour = maTour,
                    DuongDanAnh = $"/img/tour/{fileName}",
                    AnhChinh = !hasMainImage,
                    SoThuTu = index,
                    NgayTao = DateTime.Now,
                    NgayCapNhat = DateTime.Now
                });

                hasMainImage = true;
                index++;
            }

            await _context.SaveChangesAsync();
        }

        private int GetDepartureStatus(DateTime ngayKhoiHanh, DateTime ngayKetThuc)
        {
            var now = DateTime.Now;

            if (now < ngayKhoiHanh) return 1;
            if (now >= ngayKhoiHanh && now <= ngayKetThuc) return 2;
            return 3;
        }

        private void ValidateImage(IFormFile file, int ngay)
        {
            if (file.Length > 10 * 1024 * 1024)
                throw new Exception($"Ảnh ngày {ngay} vượt quá dung lượng 10MB");

            var extensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!extensions.Contains(extension))
                throw new Exception($"Ảnh ngày {ngay} sai định dạng ảnh");
        }

        private static readonly Dictionary<string, string> LocationCodeMap = new()
        {
            ["Hồ Chí Minh"] = "HCM",
            ["Hà Nội"] = "HN",
            ["Đà Nẵng"] = "DN"
        };

        private static readonly Dictionary<string, string> VehicleCodeMap = new()
        {
            ["Máy Bay"] = "MB",
            ["Ô tô Du Lịch"] = "OT",
            ["Tàu Hỏa"] = "TH",
            ["Tàu Thủy"] = "TT",
            ["Xe Máy Trekking"] = "XM"
        };

        private async Task<string> GenerateUniqueCodeAsync(bool trongNuoc, string diemKhoiHanh, string tenPhuongTien, DateTime ngayKhoiHanh)
        {
            var regionCode = trongNuoc ? "TN" : "NN";
            var locationCode = LocationCodeMap.GetValueOrDefault(diemKhoiHanh?.Trim() ?? "", "XX");
            var vehicleCode = VehicleCodeMap.GetValueOrDefault(tenPhuongTien?.Trim() ?? "", "XX");
            var dateCode = ngayKhoiHanh.ToString("ddMMyy");
            var prefix = $"{regionCode}-{locationCode}-{vehicleCode}-{dateCode}-";

            var existingCount = await _context.ChuyenKhoiHanhs
                .CountAsync(c => c.MaChuyenCode.StartsWith(prefix));

            int seq = existingCount + 1;
            string code;
            do
            {
                code = $"{prefix}{seq:D3}";
                seq++;
            }
            while (await _context.ChuyenKhoiHanhs.AnyAsync(c => c.MaChuyenCode == code));

            return code;
        }

        private async Task<string> GetTenPhuongTienAsync(int maPhuongTien)
        {
            var pt = await _context.PhuongTiens
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.MaPhuongTien == maPhuongTien);
            return pt?.TenPhuongTien ?? "";
        }
        private static string ToSafeFileName(string value)
        {
            if (string.IsNullOrWhiteSpace(value)) return "khong_co_ten";

            value = value.Trim().ToLowerInvariant();


            value = value.Replace("đ", "d").Replace("Đ", "D");

            value = value.Normalize(NormalizationForm.FormD);

            var builder = new StringBuilder();
            foreach (var c in value)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                    builder.Append(c);
            }

            value = builder.ToString().Normalize(NormalizationForm.FormC);

            foreach (char c in Path.GetInvalidFileNameChars())
                value = value.Replace(c, '_');

            value = value.Replace(" ", "_");

            while (value.Contains("__"))
                value = value.Replace("__", "_");

            return value;
        }

        //yêu thích
        public async Task<List<int>> GetFavoriteTourIdsAsync(int userId)
        {
            return await _context.DanhSachYeuThichs
                .Where(y => y.MaNguoiDung == userId)
                .Select(y => y.MaTour)
                .ToListAsync();
        }

        public async Task<PageDTO<FavoriteTourRepnoseDTO>> GetFavoriteToursAsync(int userId, int pageNumber = 1, int pageSize = 10)
        {
            if (pageNumber <= 0) pageNumber = 1;
            if (pageSize <= 0) pageSize = 10;
            var query = _context.DanhSachYeuThichs.AsNoTracking().Where(y => y.MaNguoiDung == userId);

            var totalCount = await query.CountAsync();

            var rawData = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(y => new
                {
                    MaTour = y.Tour.MaTour,
                    TenTour = y.Tour.TenTour,
                    Ngay = y.Tour.Ngay,
                    Dem = y.Tour.Dem,
                    DiemDen = y.Tour.ChuyenKhoiHanhs.Select(y => y.DiemDen).FirstOrDefault() ?? null,
                    DuongDanAnh = y.Tour.HinhAnhTours.Where(a => a.AnhChinh == true).Select(a => a.DuongDanAnh).FirstOrDefault(),
                    DanhSachGia = y.Tour.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Select(g => g.GiaNguoiLon).ToList(),

                    ReviewCount = y.Tour.DanhGias.Count(),
                    CacDiemDanhGia = y.Tour.DanhGias.Select(d => d.DiemDanhGia).ToList()
                })
                .ToListAsync();

            var favoriteTours = rawData.Select(x => new FavoriteTourRepnoseDTO
            {
                Matour = x.MaTour,
                TenTour = x.TenTour,
                ThoiGianTour = x.Dem > 0 ? $"{x.Ngay} ngày {x.Dem} đêm" : $"{x.Ngay} ngày",
                DiemDen = x.DiemDen,

                DuongDanAnh = x.DuongDanAnh ?? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",

                GiaTour = x.DanhSachGia.Any() ? (decimal)x.DanhSachGia.Min() : 0,

                ReviewCount = x.ReviewCount,
                DiemDanhGia = x.CacDiemDanhGia.Any()
                         ? Math.Round(x.CacDiemDanhGia.Average(d => (double)d), 1)
                         : 0
            }).ToList();

            return new PageDTO<FavoriteTourRepnoseDTO>
            {
                Items = favoriteTours,
                TotalItems = totalCount,
                PageSize = pageSize,
                PageNumber = pageNumber
            };
        }

        public async Task<bool> DeleteFavoriteToursAsync(int userId, List<int> tourIds)
        {
            if (tourIds == null || !tourIds.Any()) return false;

            var Listitem = await _context.DanhSachYeuThichs.Where(y => y.MaNguoiDung == userId && tourIds.Contains(y.MaTour)).ToListAsync();

            if (!Listitem.Any()) return false;

            _context.DanhSachYeuThichs.RemoveRange(Listitem);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> AddFavoriteTourAsync(int userId, int tourId)
        {
            var item = await _context.DanhSachYeuThichs.AnyAsync(y => y.MaNguoiDung == userId && y.MaTour == tourId);

            if (item) return false;

            var newFavorite = new DanhSachYeuThich
            {
                MaNguoiDung = userId,
                MaTour = tourId
            };

            _context.DanhSachYeuThichs.Add(newFavorite);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<Tour> GetTourByIdAsync(int id)
        {
            return await _context.Tours
                .Include(t => t.LoaiHinhTour)
                .FirstOrDefaultAsync(t => t.MaTour == id);
        }

        //Tour du lịch nổi bật (lượt đặt)
        public async Task<List<TourCardDTO>> GetBestToursCardAsync(int? limit = null)
        {
            // 1. Tạo query (chưa thực thi)
            var query = _context.Tours
                .AsNoTracking() // Thêm AsNoTracking để tối ưu hiệu năng
                .Where(t => t.TrangThai == 1 && t.NgayXoa == null)
                .OrderByDescending(t => t.LuotDat)
                .Select(t => new TourCardDTO
                {
                    MaTour = t.MaTour,
                    TenTour = t.TenTour,
                    Ngay = t.Ngay,
                    Dem = t.Dem,
                    slug = t.Slug,
                    DiemDen = t.ChuyenKhoiHanhs.FirstOrDefault() != null
                                ? t.ChuyenKhoiHanhs.FirstOrDefault().DiemDen
                                : "Đang cập nhật",
                    DuongDanAnh = t.HinhAnhTours.FirstOrDefault(a => a.AnhChinh == true).DuongDanAnh ?? "",
                    GiaChuyen = t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Any()
                                ? t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Min(g => g.GiaNguoiLon)
                                : 0,
                    DiemDanhGia = t.DanhGias.Any() ? Math.Round(t.DanhGias.Average(d => (double)d.DiemDanhGia), 1) : 0,
                    SoLuongDanhGia = t.DanhGias.Count(),
                    LuotDat = t.LuotDat
                });

            // 2. Áp dụng giới hạn nếu limit có giá trị
            if (limit.HasValue && limit.Value > 0)
            {
                return await query.Take(limit.Value).ToListAsync();
            }

            // 3. Nếu không có limit, lấy toàn bộ (hoặc bạn có thể đặt limit mặc định ở đây)
            return await query.ToListAsync();
        }
        // tour mới nhất
        public async Task<List<TourCardDTO>> GetLatestToursAsync(int? limit = null)
        {
            var query = _context.Tours
                .AsNoTracking()
                .Where(t => t.TrangThai == 1 && t.NgayXoa == null)
                .OrderByDescending(t => t.NgayTao)
                .Select(t => new TourCardDTO
                {
                    MaTour = t.MaTour,
                    TenTour = t.TenTour,
                    Dem = t.Dem,
                    slug = t.Slug,
                    Ngay = t.Ngay,
                    DiemDen = t.ChuyenKhoiHanhs.FirstOrDefault() != null
                                ? t.ChuyenKhoiHanhs.FirstOrDefault().DiemDen
                                : "Đang cập nhật",
                    DuongDanAnh = t.HinhAnhTours.FirstOrDefault(a => a.AnhChinh == true).DuongDanAnh ?? "",
                    GiaChuyen = t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Any()
                                ? t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Min(g => g.GiaNguoiLon)
                                : 0,
                    DiemDanhGia = t.DanhGias.Any() ? Math.Round(t.DanhGias.Average(d => (double)d.DiemDanhGia), 1) : 0,
                    SoLuongDanhGia = t.DanhGias.Count()
                });

            if (limit.HasValue && limit.Value > 0)
            {
                return await query.Take(limit.Value).ToListAsync();
            }

            return await query.ToListAsync();
        }

        // tour dành riêng cho bạn
        public async Task<List<TourCardDTO>> GetTourDesignJustForYouAsync(int userId, int? limit = null)
        {
            // 1. Lấy dữ liệu sở thích (cần lấy cả danh sách để tính tổng điểm)
            var topPreferences = await _context.SoThichNguoiDungs
                .AsNoTracking()
                .Where(s => s.MaNguoiDung == userId)
                .ToListAsync();

            var locationScores = await _context.SoThichDiaDiemNguoiDungs
                .AsNoTracking()
                .Where(ui => ui.MaNguoiDung == userId)
                .ToListAsync();

            var favoriteTourIds = await _context.DanhSachYeuThichs
                .Where(y => y.MaNguoiDung == userId)
                .Select(y => y.MaTour)
                .ToListAsync();

            // 2. Query Tour
            var allTours = await _context.Tours
                .AsNoTracking()
                .Include(t => t.LichTrinhs).ThenInclude(l => l.CTLichTrinhs).ThenInclude(ct => ct.DiaDiem)
                .Include(t => t.HinhAnhTours)
                .Include(t => t.ChuyenKhoiHanhs).ThenInclude(ckh => ckh.GiaChuyens)
                .Include(t => t.DanhGias)
                .AsSplitQuery()
                .Where(t => t.TrangThai == 1 && t.NgayXoa == null)
                .ToListAsync();

            // 3. Tính điểm và sắp xếp
            var result = allTours
                .Select(t => new
                {
                    Tour = t,
                    TotalScore = (favoriteTourIds.Contains(t.MaTour) ? 1000 : 0) +
                                 (t.LichTrinhs.SelectMany(lt => lt.CTLichTrinhs).Sum(ct =>
                                    locationScores.FirstOrDefault(ls => ls.MaDiaDiem == ct.MaDiaDiem)?.DiemYeuThich ?? 0)) +
                                 (topPreferences.FirstOrDefault(p => p.MaLoaiTour == t.MaLoaiTour)?.DiemYeuThich ?? 0)
                })
                .OrderByDescending(x => x.TotalScore)
                .Select(x => new TourCardDTO // Bây giờ lấy từ x.Tour
                {
                    MaTour = x.Tour.MaTour,
                    TenTour = x.Tour.TenTour,
                    DuongDanAnh = x.Tour.HinhAnhTours?.FirstOrDefault(l => l.AnhChinh == true)?.DuongDanAnh ?? "default-image.jpg",
                    Ngay = x.Tour.Ngay,
                    Dem = x.Tour.Dem,
                    slug = x.Tour.Slug,
                    DiemDen = x.Tour.LichTrinhs?.SelectMany(l => l.CTLichTrinhs)?.Select(ct => ct.DiaDiem.TenDiaDiem)?.FirstOrDefault() ?? "Đang cập nhật",
                    GiaChuyen = x.Tour.ChuyenKhoiHanhs?.SelectMany(ckh => ckh.GiaChuyens)?.OrderBy(gc => gc.GiaNguoiLon)?.Select(gc => gc.GiaNguoiLon)?.FirstOrDefault() ?? 0,
                    DiemDanhGia = x.Tour.DanhGias?.Any() == true ? Math.Round(x.Tour.DanhGias.Average(d => (double)d.DiemDanhGia), 1) : 0,
                    SoLuongDanhGia = x.Tour.DanhGias?.Count() ?? 0,
                    IsFavorite = favoriteTourIds.Contains(x.Tour.MaTour),
                    LuotDat = x.Tour.LuotDat
                })
                .ToList();

            return limit.HasValue && limit.Value > 0 ? result.Take(limit.Value).ToList() : result;
        }

        // Có thể bạn quan tâm
        public async Task<List<TourCardDTO>> GetRecommendedToursAsync(int userId, int? limit = null)
        {
            // 1. Lấy dữ liệu sở thích (Loại tour & Địa điểm)
            var topPreferences = await _context.SoThichNguoiDungs
                .AsNoTracking()
                .Where(s => s.MaNguoiDung == userId)
                .ToListAsync();

            var locationScores = await _context.SoThichDiaDiemNguoiDungs
                .AsNoTracking()
                .Where(ui => ui.MaNguoiDung == userId)
                .ToListAsync();

            var favoriteTourIds = await _context.DanhSachYeuThichs
                .AsNoTracking()
                .Where(y => y.MaNguoiDung == userId)
                .Select(y => y.MaTour)
                .ToListAsync();

            // 2. Query Tour (Include đầy đủ để lấy dữ liệu tính điểm)
            var allTours = await _context.Tours
                .AsNoTracking()
                .Include(t => t.LichTrinhs).ThenInclude(l => l.CTLichTrinhs).ThenInclude(ct => ct.DiaDiem)
                .Include(t => t.HinhAnhTours)
                .Include(t => t.ChuyenKhoiHanhs).ThenInclude(ckh => ckh.GiaChuyens)
                .Include(t => t.DanhGias)
                .AsSplitQuery()
                .Where(t => t.TrangThai == 1 && t.NgayXoa == null)
                .ToListAsync();

            // 3. Tính điểm và sắp xếp theo TotalScore (giống hàm JustForYou)
            var result = allTours
                .Select(t => new
                {
                    Tour = t,
                    // Logic tính điểm: Yêu thích (ưu tiên cao) + Điểm Địa điểm + Điểm Loại tour
                    TotalScore = (favoriteTourIds.Contains(t.MaTour) ? 1000 : 0) +
                                 (t.LichTrinhs.SelectMany(lt => lt.CTLichTrinhs).Sum(ct =>
                                     locationScores.FirstOrDefault(ls => ls.MaDiaDiem == ct.MaDiaDiem)?.DiemYeuThich ?? 0)) +
                                 (topPreferences.FirstOrDefault(p => p.MaLoaiTour == t.MaLoaiTour)?.DiemYeuThich ?? 0)
                })
                .OrderByDescending(x => x.TotalScore) // Sắp xếp theo tổng điểm
                .ThenByDescending(x => x.Tour.LuotDat) // Nếu bằng điểm thì ưu tiên tour hot
                .Select(x => new TourCardDTO
                {
                    MaTour = x.Tour.MaTour,
                    TenTour = x.Tour.TenTour,
                    DuongDanAnh = x.Tour.HinhAnhTours?.FirstOrDefault(l => l.AnhChinh == true)?.DuongDanAnh ?? "default-image.jpg",
                    Ngay = x.Tour.Ngay,
                    Dem = x.Tour.Dem,
                    slug = x.Tour.Slug,
                    DiemDen = x.Tour.LichTrinhs?.SelectMany(l => l.CTLichTrinhs)?.Select(ct => ct.DiaDiem.TenDiaDiem)?.FirstOrDefault() ?? "Đang cập nhật",
                    GiaChuyen = x.Tour.ChuyenKhoiHanhs?.SelectMany(ckh => ckh.GiaChuyens)?.OrderBy(gc => gc.GiaNguoiLon)?.Select(gc => gc.GiaNguoiLon)?.FirstOrDefault() ?? 0,
                    DiemDanhGia = x.Tour.DanhGias?.Any() == true ? Math.Round(x.Tour.DanhGias.Average(d => (double)d.DiemDanhGia), 1) : 0,
                    SoLuongDanhGia = x.Tour.DanhGias?.Count() ?? 0,
                    IsFavorite = favoriteTourIds.Contains(x.Tour.MaTour),
                    LuotDat = x.Tour.LuotDat
                })
                .ToList();

            return limit.HasValue && limit.Value > 0 ? result.Take(limit.Value).ToList() : result;
        }

        //Gợi ý cho chuyến tiếp theo
        public async Task<List<TourCardDTO>> GetNextTripSuggestionsAsync(int userId, int? limit = null)
        {
            var recentTypeIds = await _context.SoThichNguoiDungs
                .AsNoTracking()
                .Where(s => s.MaNguoiDung == userId)
                .OrderByDescending(s => s.NgayCapNhat)
                .Take(3)
                .Select(s => s.MaLoaiTour)
                .ToListAsync();

            var tourDaDatIds = await _context.DonDatTours
                .AsNoTracking()
                .Where(d => d.MaNguoiDung == userId)
                .Select(d => d.ChuyenKhoiHanh.MaTour)
                .Distinct()
                .ToListAsync();

            var query = _context.Tours
                .AsNoTracking()
                .Where(t => t.TrangThai == 1 && t.NgayXoa == null)
                .Where(t => !tourDaDatIds.Contains(t.MaTour))
                .OrderByDescending(t => recentTypeIds.Contains(t.MaLoaiTour))
                .ThenByDescending(t => t.LuotDat)
                .ThenByDescending(t => t.NgayTao)
                .Take(limit ?? 8)
                .Select(t => new TourCardDTO
                {
                    MaTour = t.MaTour,
                    TenTour = t.TenTour,
                    Ngay = t.Ngay,
                    Dem = t.Dem,
                    slug = t.Slug,
                    DiemDen = t.ChuyenKhoiHanhs.Select(c => c.DiemDen).FirstOrDefault() ?? "Đang cập nhật",
                    DuongDanAnh = t.HinhAnhTours.FirstOrDefault(a => a.AnhChinh == true).DuongDanAnh ?? "default-image.jpg",
                    GiaChuyen = t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Min(g => (decimal?)g.GiaNguoiLon) ?? 0,
                    DiemDanhGia = t.DanhGias.Any() ? Math.Round(t.DanhGias.Average(d => (double)d.DiemDanhGia), 1) : 0,
                    SoLuongDanhGia = t.DanhGias.Count(),
                    LuotDat = t.LuotDat
                });

            return await query.ToListAsync();
        }

        // tìm kiếm chuyến đi
        public async Task<PageDTO<TourCardDTO>> GetFilteredToursAsync(TourFilterParamsDTO p)
        {
            // 1. Khởi tạo query từ Tours
            var query = _context.Tours
                .AsNoTracking()
                .Where(t => t.TrangThai == 1 && t.NgayXoa == null);

            // 2. Lọc theo từ khóa (Search)
            if (!string.IsNullOrWhiteSpace(p.Keyword))
                query = query.Where(t => t.TenTour.Contains(p.Keyword) || t.ChuyenKhoiHanhs.Any(c => c.DiemDen.Contains(p.Keyword)));

            // 3. Lọc theo Danh mục
            if (!string.IsNullOrWhiteSpace(p.Category) && p.Category != "Tất cả")
                query = query.Where(t => t.LoaiHinhTour.TenLoaiTour == p.Category);

            // 4. Lọc theo Giá tối đa (MaxPrice)
            if (p.MaxPrice.HasValue)
                query = query.Where(t => t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Any()
                                     && t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Min(g => g.GiaNguoiLon) <= p.MaxPrice);

            // 5. Lọc theo Đánh giá
            if (p.Ratings != null && p.Ratings.Any())
            {
                var minRating = p.Ratings.Min();
                query = query.Where(t => t.DanhGias.Any() && t.DanhGias.Average(d => (double?)d.DiemDanhGia) >= minRating);
            }

            // 6. Lọc theo Số ngày (DayFilters)
            if (p.DayFilters != null && p.DayFilters.Any())
            {
                query = query.Where(t => p.DayFilters.Any(f =>
                    (f == "2-3" && t.Ngay >= 2 && t.Ngay <= 3) ||
                    (f == "4-7" && t.Ngay >= 4 && t.Ngay <= 7) ||
                    (f == "7+" && t.Ngay > 7)));
            }

            // 7. Sắp xếp (Sorting)
            query = p.Sort switch
            {
                "price_asc" => query.OrderBy(t => t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Min(g => g.GiaNguoiLon)),
                "price_desc" => query.OrderByDescending(t => t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Min(g => g.GiaNguoiLon)),
                "rating" => query.OrderByDescending(t => t.DanhGias.Average(d => (double?)d.DiemDanhGia)),
                _ => query.OrderByDescending(t => t.LuotDat)
            };

            // 8. Đếm và Phân trang
            int totalItems = await query.CountAsync();
            var items = await query.Skip((p.PageNumber - 1) * p.PageSize).Take(p.PageSize)
               .Select(t => new TourCardDTO
               {
                   // Thông tin cơ bản từ bảng Tour
                   MaTour = t.MaTour,
                   TenTour = t.TenTour,
                   slug = t.Slug,
                   Ngay = t.Ngay,
                   Dem = t.Dem,

                   DiemDen = t.ChuyenKhoiHanhs.FirstOrDefault() != null
              ? t.ChuyenKhoiHanhs.FirstOrDefault().DiemDen
              : "Đang cập nhật",

                   DuongDanAnh = t.HinhAnhTours.FirstOrDefault(a => a.AnhChinh == true).DuongDanAnh ?? "",

                   GiaChuyen = t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Any()
                ? t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Min(g => g.GiaNguoiLon)
                : 0,

                   DiemDanhGia = t.DanhGias.Any()
                  ? Math.Round(t.DanhGias.Average(d => (double)d.DiemDanhGia), 1)
                  : 0,

                   SoLuongDanhGia = t.DanhGias.Count(),

                   LuotDat = t.LuotDat
               }).ToListAsync();

            return new PageDTO<TourCardDTO> { Items = items, TotalItems = totalItems, PageNumber = p.PageNumber, PageSize = p.PageSize };
        }

        private async Task<string> SaveScheduleImageAsync(IFormFile file, int maTour, string tenLichTrinh, List<ScheduleDetailsDTO>? chiTietLichTrinhs, int soThuTuNgay)
        {
            if (file == null || file.Length == 0) return DEFAULT_SCHEDULE_IMAGE;

            ValidateImage(file, soThuTuNgay);

            var detailLocationIds = chiTietLichTrinhs?
                .Select(x => x.MaDiaDiem)
                .Where(x => x > 0)
                .Distinct()
                .ToList() ?? new List<int>();

            var tenDiemThamQuan = await _context.DiaDiems
                .Where(x => detailLocationIds.Contains(x.MaDiaDiem))
                .OrderBy(x => x.MaDiaDiem)
                .Select(x => x.TenDiaDiem)
                .FirstOrDefaultAsync();

            string timeStamp = DateTime.Now.ToString("ssmmHHddMMyyyy");
            string safeTenLichTrinh = ToSafeFileName(tenLichTrinh);
            string safeDiemThamQuan = ToSafeFileName(tenDiemThamQuan ?? "khong_co_diem_tham_quan");
            string extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            string fileName = $"{timeStamp}_{maTour}_{safeTenLichTrinh}_{safeDiemThamQuan}{extension}";

            string uploadsFolder = Path.Combine(_env.WebRootPath, "img", "schedules");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            string fullPath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
                await file.CopyToAsync(stream);

            return $"/img/schedules/{fileName}";
        }

        private void ValidateDuplicateScheduleDay(List<ScheduleDTO> schedules)
        {
            var duplicatedDays = schedules
                .GroupBy(x => x.SoThuTuNgay)
                .Where(x => x.Count() > 1)
                .Select(x => x.Key)
                .ToList();

            if (duplicatedDays.Any())
                throw new Exception($"Ngày lịch trình bị trùng: {string.Join(", ", duplicatedDays)}");
        }

        private void ValidateContinuousScheduleDay(List<ScheduleDTO> schedules)
        {
            var days = schedules
                .Select(x => x.SoThuTuNgay)
                .OrderBy(x => x)
                .ToList();

            for (int i = 0; i < days.Count; i++)
            {
                if (days[i] != i + 1)
                    throw new Exception($"Thiếu ngày {i + 1} trong lịch trình.");
            }
        }

        private void ValidateTourDuration(int soNgay, List<ScheduleDTO> schedules)
        {
            if (schedules.Count != soNgay)
                throw new Exception($"Tour {soNgay} ngày nhưng hiện có {schedules.Count} lịch trình.");
        }

        private void ValidateTourForOpen(Tour tour)
        {
            if (!tour.LichTrinhs.Any(x => x.NgayXoa == null))
                throw new Exception("Tour chưa có lịch trình.");

            if (!tour.HinhAnhTours.Any(x => x.NgayXoa == null))
                throw new Exception("Tour chưa có hình ảnh.");

            if (tour.HinhAnhTours.Count(x => x.NgayXoa == null && x.AnhChinh) != 1)
                throw new Exception("Tour phải có đúng 1 ảnh chính.");

            if (!tour.ChuyenKhoiHanhs.Any(x =>
                    x.NgayXoa == null &&
                    x.NgayKhoiHanh > DateTime.Now &&
                    x.SoChoToiDa > 0))
            {
                throw new Exception("Tour phải có ít nhất 1 chuyến khởi hành còn chỗ trong tương lai.");
            }
        }

        //tính điểm xem lướt
        public async Task TrackViewTourAsync(int userId, int tourId)
        {
            var interaction = await _context.TrangThaiTuongTacs
                .FirstOrDefaultAsync(t => t.MaNguoiDung == userId && t.MaTour == tourId);

            if (interaction == null)
            {
                _context.TrangThaiTuongTacs.Add(new TrangThaiTuongTac
                {
                    MaNguoiDung = userId,
                    MaTour = tourId,
                    DaXemChiTiet = true
                });

                await _recommendation.UpdatePreference(userId, tourId, RecommendationWeights.ViewTour, true);
            }
            else if (!interaction.DaXemChiTiet)
            {
                interaction.DaXemChiTiet = true;

                await _recommendation.UpdatePreference(userId, tourId, RecommendationWeights.ViewTour, true);
            }

            await _context.SaveChangesAsync();
        }

        // tính điểm xem lâu
        public async Task TrackDeepInterestAsync(int userId, int tourId)
        {
            var interaction = await _context.TrangThaiTuongTacs
                .FirstOrDefaultAsync(t => t.MaNguoiDung == userId && t.MaTour == tourId);

            if (interaction == null)
            {
                _context.TrangThaiTuongTacs.Add(new TrangThaiTuongTac
                {
                    MaNguoiDung = userId,
                    MaTour = tourId,
                    DaXemChiTiet = true,
                    DaQuanTamLau = true
                });
                await _recommendation.UpdatePreference(userId, tourId,RecommendationWeights.ConfirmInterest, true);
            }
            else if (!interaction.DaQuanTamLau)
            {
                interaction.DaQuanTamLau = true;
                await _recommendation.UpdatePreference(userId, tourId, RecommendationWeights.ConfirmInterest, true);
            }

            await _context.SaveChangesAsync();
        }
    }

}