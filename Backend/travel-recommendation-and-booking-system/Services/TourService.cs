using System.Globalization;
using System.Text;
using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs;
using travel_recommendation_and_booking_system.DTOs.Departure;
using travel_recommendation_and_booking_system.DTOs.FavoriteTour;
using travel_recommendation_and_booking_system.DTOs.ImageTour;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.DTOs.LogSystem;
using travel_recommendation_and_booking_system.DTOs.Review;
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
        private readonly IMemoryCache _cache;
        private const string DEFAULT_SCHEDULE_IMAGE = "default-schedule.jpg";
        private const string CacheVersionKey = "tour:cache:version";
        private static readonly TimeSpan ListCacheDuration = TimeSpan.FromMinutes(10);
        private static readonly TimeSpan DetailCacheDuration = TimeSpan.FromMinutes(5);

        private int GetCacheVersion()
        {
            return _cache.GetOrCreate(CacheVersionKey, entry =>
            {
                entry.SlidingExpiration = TimeSpan.FromDays(1);
                return 1;
            });
        }

        private void BumpCacheVersion()
        {
            var current = GetCacheVersion();
            _cache.Set(CacheVersionKey, current + 1, TimeSpan.FromDays(1));
        }

        private void ClearTourCache(int tourId)
        {
            var detailKey = VKey($"tour:detail:{tourId}");
            _cache.Remove(detailKey);

            var tour = _context.Tours.AsNoTracking().FirstOrDefault(t => t.MaTour == tourId);
            if (tour != null && !string.IsNullOrEmpty(tour.Slug))
            {
                var slugKey = VKey($"tour:detail:slug:{tour.Slug.ToLower()}");
                _cache.Remove(slugKey);
            }
            BumpCacheVersion();
        }

        private string VKey(string key) => $"v{GetCacheVersion()}:{key}";

        public TourService(AppDbContext context, IWebHostEnvironment env, ILogService logService, ICurrentUserService currentUserService, IMemoryCache cache)
        {
            _context = context;
            _env = env;
            _logService = logService;
            _currentUserService = currentUserService;
            _cache = cache;
        }


        private DateTime CalculateAutoEndDate(DateTime ngayKhoiHanh, List<ScheduleDTO> schedules)
        {
            if (schedules == null || !schedules.Any())
                return ngayKhoiHanh.Date.AddDays(1).AddSeconds(-1);

            var lastDay = schedules.OrderByDescending(x => x.SoThuTuNgay).First();
            var latestEndTime = lastDay.ChiTietLichTrinh?
                .Where(x => !string.IsNullOrEmpty(x.GioKetThuc))
                .Select(x => TimeSpan.Parse(x.GioKetThuc))
                .Max() ?? new TimeSpan(23, 59, 0);

            return ngayKhoiHanh.Date
                .AddDays(lastDay.SoThuTuNgay - 1)
                .Add(latestEndTime);
        }

        private void ValidateEndDateWithSchedule(DepartureDTO departure, List<ScheduleDTO> schedules)
        {
            if (schedules == null || !schedules.Any()) return;

            var lastDay = schedules.OrderByDescending(x => x.SoThuTuNgay).First();
            if (lastDay == null) return;

            var latestEndTime = lastDay.ChiTietLichTrinh?
                .Where(x => !string.IsNullOrEmpty(x.GioKetThuc))
                .Select(x => TimeSpan.Parse(x.GioKetThuc))
                .Max();

            if (!latestEndTime.HasValue) return;

            var expectedEndDate = departure.NgayKhoiHanh.Date
                .AddDays(lastDay.SoThuTuNgay - 1)
                .Add(latestEndTime.Value);

            if (departure.NgayKetThuc < expectedEndDate)
            {
                throw new Exception(
                    $"Ngày kết thúc chuyến ({departure.NgayKetThuc:dd/MM/yyyy HH:mm}) phải >= " +
                    $"{expectedEndDate:dd/MM/yyyy HH:mm} do hoạt động cuối cùng của ngày {lastDay.SoThuTuNgay} kết thúc lúc này."
                );
            }
        }

        private async Task ValidateDuplicateDeparture(DepartureFullDTO departure, int? excludeMaChuyen = null)
        {
            var chuyen = departure.ChuyenKhoiHanh;

            var query = _context.ChuyenKhoiHanhs
                .Where(x =>
                    x.MaTour == chuyen.MaTour &&
                    x.NgayXoa == null &&
                    x.NgayKhoiHanh.Date == chuyen.NgayKhoiHanh.Date);

            if (excludeMaChuyen.HasValue)
                query = query.Where(x => x.MaChuyen != excludeMaChuyen.Value);

            var exists = await query.AnyAsync();
            if (exists)
                throw new Exception($"Đã có chuyến khởi hành vào ngày {chuyen.NgayKhoiHanh:dd/MM/yyyy} cho tour này.");
        }


        private async Task<bool> HasAnyDepartureAsync(int maTour)
        {
            return await _context.ChuyenKhoiHanhs
                .AnyAsync(x =>
                    x.MaTour == maTour &&
                    x.NgayXoa == null);
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
                await _context.SaveChangesAsync();

                if (images != null && images.Any())
                    await UploadImagesTourAsync(tourEntity.MaTour, images);

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

                    if (schedule.MaKhachSan.HasValue && schedule.MaKhachSan > 0)
                    {
                        var hotel = await _context.KhachSans
                            .FirstOrDefaultAsync(x =>
                                x.MaKhachSan == schedule.MaKhachSan &&
                                x.NgayXoa == null &&
                                x.TrangThai);

                        if (hotel == null)
                        {
                            throw new Exception(
                                $"Khách sạn ngày {schedule.SoThuTuNgay} không hợp lệ.");
                        }
                    }

                    var schEntity = new LichTrinh
                    {
                        MaTour = tourEntity.MaTour,
                        SoThuTuNgay = schedule.SoThuTuNgay,
                        BuaAn = schedule.BuaAn,
                        DuongDanAnh = duongDanAnhDB,
                        LuuY = schedule.LuuY,
                        TrangThai = true,
                        TenLichTrinh = schedule.TenLichTrinh,
                        MaKhachSan = (schedule.MaKhachSan.HasValue && schedule.MaKhachSan > 0)
                                            ? schedule.MaKhachSan
                                            : null,
                        NgayTao = DateTime.Now,
                        NgayCapNhat = DateTime.Now
                    };

                    _context.LichTrinhs.Add(schEntity);

                    if (schedule.ChiTietLichTrinh != null)
                    {
                        foreach (var detail in schedule.ChiTietLichTrinh)
                        {
                            DiaDiem? location = null;

                            if (detail.MaDiaDiem.HasValue && detail.MaDiaDiem > 0)
                            {
                                location = await _context.DiaDiems
                                    .FirstOrDefaultAsync(x =>
                                        x.MaDiaDiem == detail.MaDiaDiem &&
                                        x.NgayXoa == null &&
                                        x.TrangThai);

                                if (location == null)
                                {
                                    throw new Exception(
                                        $"Địa điểm {detail.MaDiaDiem} không tồn tại hoặc đã ngưng hoạt động.");
                                }
                            }

                            _context.CTLichTrinhs.Add(new CTLichTrinh
                            {
                                LichTrinh = schEntity,
                                MaDiaDiem = (detail.MaDiaDiem.HasValue && detail.MaDiaDiem > 0)
                                    ? detail.MaDiaDiem
                                    : null,
                                GioBatDau = detail.GioBatDau,
                                GioKetThuc = detail.GioKetThuc,
                                HoatDong = detail.HoatDong
                            });
                        }
                    }

                    lichTrinhMap[schedule.SoThuTuNgay] = schEntity;
                }

                await _context.SaveChangesAsync();


                if (dto.ChuyenKhoiHanhs != null)
                {
                    foreach (var dep in dto.ChuyenKhoiHanhs)
                    {
                        var chuyen = dep.ChuyenKhoiHanh;

                        
                        ValidateEndDateWithSchedule(chuyen, dto.LichTrinh);

                      
                        if (chuyen.NgayKhoiHanh <= DateTime.Now)
                            throw new Exception("Chuyến khởi hành: Ngày khởi hành phải ở tương lai.");

                        
                        if (dep.DanhSachGia == null || !dep.DanhSachGia.Any())
                            throw new Exception("Chuyến khởi hành: Phải có ít nhất 1 mức giá.");

                    
                        await ValidateDuplicateDeparture(dep);

                     
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

                tourEntity.GiaTu = dto.ChuyenKhoiHanhs != null && dto.ChuyenKhoiHanhs.Any()
                    ? dto.ChuyenKhoiHanhs.SelectMany(x => x.DanhSachGia).Min(x => x.GiaNguoiLon)
                    : 0;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                BumpCacheVersion();

                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                    Email = _currentUserService.GetEmail(),
                    MaTaiKhoan = _currentUserService.GetUserId(),
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
                    .FirstOrDefaultAsync(t => t.MaTour == tourId && t.NgayXoa == null);

                if (existingTour == null) return false;

                
                bool hasAnyDeparture = await HasAnyDepartureAsync(tourId);
                bool hasBooking = await _context.ChuyenKhoiHanhs
                    .AnyAsync(x =>
                        x.MaTour == tourId &&
                        x.NgayXoa == null &&
                        x.SoChoDaDat > 0);

              
                if (hasBooking)
                {
                    throw new Exception("Tour đã có khách đặt, không được thay đổi thông tin.");
                }

                
                //if (hasAnyDeparture)
                //{
                  
                //    if (existingTour.Ngay != dto.TourInfo.Ngay || existingTour.Dem != dto.TourInfo.Dem)
                //    {
                //        throw new Exception("Tour đã có chuyến khởi hành, không được thay đổi số ngày/đêm.");
                //    }
                //}

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
                    existingTour.NgayCapNhat = DateTime.Now;
                }

                if (images != null && images.Any())
                    await UploadImagesTourAsync(tourId, images);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                ClearTourCache(tourId);

                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                    Email = _currentUserService.GetEmail(),
                    MaTaiKhoan = _currentUserService.GetUserId(),
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
            var cacheKey = VKey($"tour:detail:{tourId}");
            if (_cache.TryGetValue(cacheKey, out TourReponseDTO? cached))
                return cached;

            var tour = await _context.Tours
                .Include(t => t.LichTrinhs).ThenInclude(l => l.CTLichTrinhs)
                .Include(t => t.LichTrinhs).ThenInclude(l => l.KhachSan)
                .Include(t => t.ChuyenKhoiHanhs).ThenInclude(c => c.GiaChuyens)
                .Include(t => t.HinhAnhTours)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.MaTour == tourId);

            if (tour == null) return null;

            var result = new TourReponseDTO
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
                        LuuY = l.LuuY,
                        TrangThai = l.TrangThai,
                        DuongDanAnh = l.DuongDanAnh,
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
                    .Where(c => c.NgayXoa == null)
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

            _cache.Set(cacheKey, result, DetailCacheDuration);
            return result;
        }

        public async Task<TourReponseDTO?> GetTourDetailBySlugAsync(string slug)
        {
            var normalizedSlug = slug.Trim().ToLower();
            var cacheKey = VKey($"tour:detail:slug:{normalizedSlug}");
            if (_cache.TryGetValue(cacheKey, out TourReponseDTO? cached))
                return cached;

            var now = DateTime.Now;

            var tour = await _context.Tours
                .AsNoTracking()
                .AsSplitQuery()
                .Include(t => t.LichTrinhs.Where(l => l.NgayXoa == null))
                    .ThenInclude(l => l.CTLichTrinhs)
                    .ThenInclude(d => d.DiaDiem)
                .Include(t => t.LichTrinhs.Where(l => l.NgayXoa == null))
                    .ThenInclude(l => l.KhachSan)
                .Include(t => t.ChuyenKhoiHanhs.Where(c =>
                        c.NgayXoa == null
                     && c.NgayKhoiHanh >= now
                     && c.TrangThai != 3
                     && c.TrangThai != 4
                     && c.SoChoToiDa > 0
                     && (c.SoChoToiDa - c.SoChoDaDat) > 0))
                    .ThenInclude(c => c.PhuongTien)
                .Include(t => t.ChuyenKhoiHanhs.Where(c =>
                        c.NgayXoa == null
                     && c.NgayKhoiHanh >= now
                     && c.TrangThai != 3
                     && c.TrangThai != 4
                     && c.SoChoToiDa > 0
                     && (c.SoChoToiDa - c.SoChoDaDat) > 0))
                    .ThenInclude(c => c.GiaChuyens)
                .Include(t => t.HinhAnhTours.Where(a => a.NgayXoa == null))
                .Include(t => t.DanhGias.Where(d => d.NgayXoa == null))
                    .ThenInclude(d => d.NguoiDung)
                .FirstOrDefaultAsync(t => t.Slug == normalizedSlug && t.NgayXoa == null);

            if (tour == null) return null;

            var validDepartures = tour.ChuyenKhoiHanhs?.ToList() ?? new List<ChuyenKhoiHanh>();

            if (!validDepartures.Any())
                return null;

            var result = new TourReponseDTO
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
                    .OrderBy(a => a.SoThuTu)
                    .Select(a => new ImageTourResponseDTO
                    {
                        MaAnhTour = a.MaAnhTour,
                        DuongDanAnh = a.DuongDanAnh,
                        AnhChinh = a.AnhChinh,
                        SoThuTu = a.SoThuTu
                    }).ToList() ?? new List<ImageTourResponseDTO>(),

                LichTrinh = tour.LichTrinhs?
                    .OrderBy(l => l.SoThuTuNgay)
                    .Select(l => new ScheduleReponseDTO
                    {
                        MaLichTrinh = l.MaLichTrinh,
                        MaTour = l.MaTour,
                        TenLichTrinh = l.TenLichTrinh,
                        SoThuTuNgay = l.SoThuTuNgay,
                        BuaAn = l.BuaAn,
                        LuuY = l.LuuY,
                        TrangThai = l.TrangThai,
                        DuongDanAnh = l.DuongDanAnh,
                        MaKhachSan = l.MaKhachSan,
                        TenKhachSan = l.KhachSan?.TenKhachSan,
                        SlugKhachSan = l.KhachSan?.Slug,
                        SoSaoKhachSan = l.KhachSan?.SoSao,
                        ChiTietLichTrinhs = l.CTLichTrinhs?
                            .OrderBy(ct => ct.GioBatDau)
                            .Select(ct => new ScheduleDetailsDTO
                            {
                                MaCTLT = ct.MaCTLT,
                                MaLichTrinh = ct.MaLichTrinh,
                                MaDiaDiem = ct.MaDiaDiem,
                                TenDiaDiem = ct.DiaDiem?.TenDiaDiem,
                                GioBatDau = ct.GioBatDau,
                                GioKetThuc = ct.GioKetThuc,
                                HoatDong = ct.HoatDong
                            }).ToList() ?? new List<ScheduleDetailsDTO>()
                    }).ToList() ?? new List<ScheduleReponseDTO>(),

                ChuyenKhoiHanhs = validDepartures
                    .OrderBy(c => c.NgayKhoiHanh)
                    .Select(c => new DepartureFullDTO
                    {
                        ChuyenKhoiHanh = new DepartureDTO
                        {
                            MaChuyen = c.MaChuyen,
                            MaHDV = c.MaHDV,
                            MaPhuongTien = c.MaPhuongTien,
                            TenPhuongTien = c.PhuongTien?.TenPhuongTien,
                            Icon = c.PhuongTien?.Icon,
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
                    }).ToList(),

                DanhGia = tour.DanhGias?
                    .OrderByDescending(d => d.NgayTao)
                    .Select(d => new ReviewDTO
                    {
                        MaNguoiDung = d.MaNguoiDung,
                        MaTour = d.MaTour,
                        HoTen = d.NguoiDung.HoTen,
                        DiemDanhGia = d.DiemDanhGia,
                        NoiDung = d.NoiDung,
                        NgayTao = d.NgayTao
                    }).ToList() ?? new List<ReviewDTO>()
            };
            BumpCacheVersion();
            _cache.Set(cacheKey, result, DetailCacheDuration);
            return result;
        }



        public async Task<TourByLocationResponseDTO?> GetToursByLocationSlugAsync(string locationSlug)
        {
            if (string.IsNullOrWhiteSpace(locationSlug))
                return null;

            var normalizedSlug = locationSlug.Trim().ToLower();
            var cacheKey = VKey($"tour:bylocation:{normalizedSlug}");
            if (_cache.TryGetValue(cacheKey, out TourByLocationResponseDTO? cached))
                return cached;

            var now = DateTime.Now;

            var location = await _context.DiaDiems
                .AsNoTracking()
                .FirstOrDefaultAsync(x =>
                    x.Slug == normalizedSlug
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
                .Include(x => x.LoaiHinhTour)
                .Include(x => x.DanhGias)
                .AsNoTracking()
                .Where(x =>
                    tourIds.Contains(x.MaTour) &&
                    x.TrangThai == 1 &&
                    x.NgayXoa == null &&
                    x.ChuyenKhoiHanhs.Any(c =>
                        c.NgayXoa == null &&
                        c.NgayKhoiHanh >= now &&
                        c.TrangThai != 3 &&
                        c.TrangThai != 4 &&
                        c.SoChoToiDa > 0 &&
                        (c.SoChoToiDa - c.SoChoDaDat) > 0))
                .Select(x => new TourCardResponseDTO
                {
                    MaTour = x.MaTour,
                    TenTour = x.TenTour,
                    Slug = x.Slug,
                    MoTa = x.MoTa,
                    Ngay = x.Ngay,
                    Dem = x.Dem,
                    GiaTu = x.GiaTu,
                    MaLoaiTour = x.MaLoaiTour,
                    TenLoaiTour = x.LoaiHinhTour != null ? x.LoaiHinhTour.TenLoaiTour : null,
                    HinhAnhChinh = x.HinhAnhTours
                        .Where(i => i.NgayXoa == null)
                        .OrderByDescending(i => i.AnhChinh)
                        .ThenBy(i => i.SoThuTu)
                        .Select(i => i.DuongDanAnh)
                        .FirstOrDefault(),
                    DiemDens = x.ChuyenKhoiHanhs
                        .Where(c => c.NgayXoa == null
                                 && c.NgayKhoiHanh >= now
                                 && c.TrangThai != 3
                                 && c.TrangThai != 4
                                 && c.SoChoToiDa > 0
                                 && (c.SoChoToiDa - c.SoChoDaDat) > 0)
                        .Select(c => c.DiemDen)
                        .Distinct()
                        .ToList()
                })
                .ToListAsync();

            var result = new TourByLocationResponseDTO
            {
                TenDiaDiem = location.TenDiaDiem,
                Slug = location.Slug,
                Tours = tours
            };

            _cache.Set(cacheKey, result, ListCacheDuration);
            return result;
        }

        public async Task<bool> SoftDeleteTourAsync(int tourId)
        {
            var tour = await _context.Tours
                .Include(t => t.ChuyenKhoiHanhs)
                .FirstOrDefaultAsync(t => t.MaTour == tourId);

            if (tour == null || tour.NgayXoa != null) return false;

            bool hasRunningDeparture = tour.ChuyenKhoiHanhs.Any(x =>
               x.NgayXoa == null &&
                 x.TrangThai == 2);

            if (hasRunningDeparture)
            {
                throw new Exception(
                    "Tour đang diễn ra, không thể xóa.");
            }

            bool hasBooking = tour.ChuyenKhoiHanhs.Any(x =>
            x.NgayXoa == null &&
            x.SoChoDaDat > 0);

            if (hasBooking)
            {
                throw new Exception(
                    "Tour đã phát sinh đơn đặt chỗ, không thể xóa.");
            }

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

            ClearTourCache(tourId);

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),
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
                .OrderByDescending(t => t.NgayCapNhat)
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

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var lowerKey = keyword.ToLower();
                query = query.Where(t =>
                    t.TenTour.ToLower().Contains(lowerKey)
                );
            }

            if (status.HasValue)
            {
                query = query.Where(t => t.TrangThai == status.Value);
            }
            else
            {
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
            var image = await _context.HinhAnhTours
                .FirstOrDefaultAsync(x => x.MaAnhTour == imageId && x.NgayXoa == null);
            if (image == null) throw new Exception("Không tìm thấy ảnh");

            var images = await _context.HinhAnhTours
                .Where(x => x.MaTour == image.MaTour && x.NgayXoa == null)
                .ToListAsync();
            int maTour = image.MaTour;
            foreach (var item in images)
                item.AnhChinh = false;

            image.AnhChinh = true;
            image.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            ClearTourCache(maTour);

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),
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
            var image = await _context.HinhAnhTours
                 .FirstOrDefaultAsync(x => x.MaAnhTour == imageId);

            if (image == null)
                throw new Exception("Không tìm thấy ảnh");

            var imageCount = await _context.HinhAnhTours
                .CountAsync(x => x.MaTour == image.MaTour && x.NgayXoa == null);

            if (imageCount <= 1)
                throw new Exception("Tour phải có ít nhất 1 ảnh, không thể xóa ảnh cuối cùng.");

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
                    .Where(x => x.MaTour == maTour && x.NgayXoa == null)
                    .OrderBy(x => x.SoThuTu)
                    .FirstOrDefaultAsync();

                if (nextImage != null)
                {
                    nextImage.AnhChinh = true;
                    await _context.SaveChangesAsync();
                }
            }

            ClearTourCache(maTour);

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                MaTaiKhoan = _currentUserService.GetUserId(),
                Email = _currentUserService.GetEmail(),
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
                        x.NgayXoa == null &&
                        x.TrangThai == 2);

                    if (hasRunningDeparture)
                        throw new Exception(
                            "Tour đang có chuyến khởi hành diễn ra.");

                    bool hasBooking = tour.ChuyenKhoiHanhs.Any(x =>
                        x.NgayXoa == null &&
                        x.SoChoDaDat > 0);

                    if (hasBooking)
                        throw new Exception(
                            "Tour đã có khách đặt, không thể ngừng kinh doanh.");

                    break;
                default:
                    throw new Exception("Trạng thái không hợp lệ.");
            }

            tour.TrangThai = trangThai;
            tour.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();

            ClearTourCache(maTour);

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),
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
            var query = _context.DanhSachYeuThichs.Include(y => y.Tour).ThenInclude(y => y.LoaiHinhTour).AsNoTracking().Where(y => y.MaNguoiDung == userId);

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
                    CacDiemDanhGia = y.Tour.DanhGias.Select(d => d.DiemDanhGia).ToList(),
                    LoaiHinhTour = y.Tour.LoaiHinhTour != null ? y.Tour.LoaiHinhTour.TenLoaiTour : null
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
                         : 0,
                TenLoaiTour = x.LoaiHinhTour ?? "Đang cập nhật"
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

        private async Task<string> SaveScheduleImageAsync(IFormFile file, int maTour, string tenLichTrinh, List<ScheduleDetailsDTO>? chiTietLichTrinhs, int soThuTuNgay)
        {
            if (file == null || file.Length == 0) return DEFAULT_SCHEDULE_IMAGE;

            ValidateImage(file, soThuTuNgay);

            var detailLocationIds = chiTietLichTrinhs?
                .Where(x => x.MaDiaDiem.HasValue && x.MaDiaDiem > 0)
                .Select(x => x.MaDiaDiem!.Value)
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



        public async Task<List<TourCardResponseDTO>> GetFeaturedToursAsync(int take = 12)
        {
            var cacheKey = VKey($"tour:featured:{take}");
            if (_cache.TryGetValue(cacheKey, out List<TourCardResponseDTO>? cached))
                return cached!;

            var now = DateTime.Now;

            var scored = await _context.Tours
                .AsNoTracking()
                .Where(t => t.TrangThai == 1 && t.NgayXoa == null)
                .Select(t => new
                {
                    t.MaTour,
                    t.LuotDat,
                    t.LuotXem,
                    t.NgayTao,
                    RatingCount = t.DanhGias.Count(),
                    AvgRating = t.DanhGias.Any() ? t.DanhGias.Average(d => d.DiemDanhGia) : 0
                })
                .ToListAsync();

            var topIds = scored
                .OrderByDescending(x =>
                    x.LuotDat * 0.45 +
                    x.AvgRating * 25 +
                    x.RatingCount * 0.8 +
                    x.LuotXem * 0.05 +
                    (now - x.NgayTao).TotalDays * -0.12)
                .Take(take)
                .ToDictionary(x => x.MaTour, x => x);

            var ids = topIds.Keys.ToList();

            var details = await _context.Tours
                .AsNoTracking()
                .Where(t => ids.Contains(t.MaTour))
                .Select(t => new
                {
                    t.MaTour,
                    t.TenTour,
                    t.Slug,
                    t.MoTa,
                    t.Ngay,
                    t.Dem,
                    t.GiaTu,
                    TenLoaiTour = t.LoaiHinhTour != null ? t.LoaiHinhTour.TenLoaiTour : null,
                    HinhAnhChinh = t.HinhAnhTours
                        .Where(i => i.NgayXoa == null)
                        .OrderByDescending(i => i.AnhChinh)
                        .Select(i => i.DuongDanAnh)
                        .FirstOrDefault(),
                    DiemDens = t.ChuyenKhoiHanhs
                        .Where(c => c.NgayXoa == null && c.NgayKhoiHanh >= now)
                        .Select(c => c.DiemDen)
                        .Distinct()
                        .ToList()
                })
                .ToListAsync();

            var result = ids
             .Select(id => details.First(d => d.MaTour == id))
             .Select(x => new TourCardResponseDTO
             {
                 MaTour = x.MaTour,
                 TenTour = x.TenTour,
                 Slug = x.Slug,
                 MoTa = x.MoTa?.Length > 120 ? x.MoTa.Substring(0, 120) + "..." : x.MoTa,
                 Ngay = x.Ngay,
                 Dem = x.Dem,
                 GiaTu = x.GiaTu,
                 TenLoaiTour = x.TenLoaiTour,
                 HinhAnhChinh = x.HinhAnhChinh,
                 DiemDens = x.DiemDens,
                 SoDanhGia = topIds[x.MaTour].RatingCount,
                 DiemDanhGia = Math.Round(topIds[x.MaTour].AvgRating, 1),
                 LuotDat = topIds[x.MaTour].LuotDat,
                 LuotXem = topIds[x.MaTour].LuotXem
             })
             .ToList();

            _cache.Set(cacheKey, result, ListCacheDuration);
            BumpCacheVersion();
            return result;
        }

        public async Task<List<TourCardResponseDTO>> GetNewlyUpdatedToursAsync(int take = 8)
        {
            var cacheKey = VKey($"tour:newlyupdated:{take}");
            if (_cache.TryGetValue(cacheKey, out List<TourCardResponseDTO>? cached))
                return cached!;

            var now = DateTime.Now;

            var result = await _context.Tours
                .Include(t => t.HinhAnhTours)
                .Include(t => t.ChuyenKhoiHanhs)
                .Include(t => t.LoaiHinhTour)
                .Include(t => t.DanhGias)
                .Where(t => t.TrangThai == 1 && t.NgayXoa == null)
                .OrderByDescending(t => t.NgayTao)
                .Select(t => new TourCardResponseDTO
                {
                    MaTour = t.MaTour,
                    TenTour = t.TenTour,
                    Slug = t.Slug,
                    MoTa = t.MoTa,
                    Ngay = t.Ngay,
                    Dem = t.Dem,
                    GiaTu = t.GiaTu,
                    TenLoaiTour = t.LoaiHinhTour.TenLoaiTour,

                    HinhAnhChinh = t.HinhAnhTours
                        .Where(i => i.NgayXoa == null)
                        .OrderByDescending(i => i.AnhChinh)
                        .Select(i => i.DuongDanAnh)
                        .FirstOrDefault(),

                    DiemDens = t.ChuyenKhoiHanhs
                        .Where(c => c.NgayXoa == null && c.NgayKhoiHanh >= now)
                        .Select(c => c.DiemDen)
                        .Distinct()
                        .ToList(),

                    SoDanhGia = t.DanhGias.Count(),
                    DiemDanhGia = t.DanhGias.Any() ? Math.Round(t.DanhGias.Average(d => d.DiemDanhGia), 1) : 0,
                    LuotDat = t.LuotDat,
                    LuotXem = t.LuotXem
                })
                .Take(take)
                .ToListAsync();

            _cache.Set(cacheKey, result, ListCacheDuration);
            BumpCacheVersion();
            return result;
        }

        public async Task<List<TourCardResponseDTO>> GetToursByFeaturedDestinationAsync(string diemDen, int take = 6)
        {
            if (string.IsNullOrWhiteSpace(diemDen))
                return new List<TourCardResponseDTO>();

            var normalizedDiemDen = diemDen.ToLower().Trim();
            var cacheKey = VKey($"tour:bydestination:{normalizedDiemDen}:{take}");
            if (_cache.TryGetValue(cacheKey, out List<TourCardResponseDTO>? cached))
                return cached!;

            var now = DateTime.Now;

            var result = await _context.Tours
                .Include(t => t.HinhAnhTours)
                .Include(t => t.ChuyenKhoiHanhs)
                .Include(t => t.LoaiHinhTour)
                .Where(t => t.TrangThai == 1
                         && t.NgayXoa == null
                         && t.ChuyenKhoiHanhs.Any(c =>
                             c.NgayXoa == null
                             && c.DiemDen.ToLower().Contains(normalizedDiemDen)
                             && c.NgayKhoiHanh >= now))
                .Select(t => new
                {
                    Tour = t,
                    AvgRating = t.DanhGias.Any() ? t.DanhGias.Average(d => d.DiemDanhGia) : 0,
                    RatingCount = t.DanhGias.Count()
                })
                .OrderByDescending(x =>
                    x.Tour.LuotDat * 0.4 +
                    x.AvgRating * 25 +
                    x.RatingCount * 0.8)
                .Select(x => new TourCardResponseDTO
                {
                    MaTour = x.Tour.MaTour,
                    TenTour = x.Tour.TenTour,
                    Slug = x.Tour.Slug,
                    MoTa = x.Tour.MoTa,
                    Ngay = x.Tour.Ngay,
                    Dem = x.Tour.Dem,
                    GiaTu = x.Tour.GiaTu,
                    TenLoaiTour = x.Tour.LoaiHinhTour.TenLoaiTour,

                    HinhAnhChinh = x.Tour.HinhAnhTours
                        .Where(i => i.NgayXoa == null)
                        .OrderByDescending(i => i.AnhChinh)
                        .Select(i => i.DuongDanAnh)
                        .FirstOrDefault(),

                    DiemDens = x.Tour.ChuyenKhoiHanhs
                        .Where(c => c.NgayXoa == null && c.NgayKhoiHanh >= now)
                        .Select(c => c.DiemDen)
                        .Distinct()
                        .ToList(),

                    SoDanhGia = x.RatingCount,
                    DiemDanhGia = Math.Round(x.AvgRating, 1),
                    LuotDat = x.Tour.LuotDat
                })
                .Take(take)
                .ToListAsync();

            _cache.Set(cacheKey, result, ListCacheDuration);
            BumpCacheVersion();
            return result;
        }

        public async Task<List<TourCardResponseDTO>> GetMostBookedToursAsync(int take = 8)
        {
            var cacheKey = VKey($"tour:mostbooked:{take}");
            if (_cache.TryGetValue(cacheKey, out List<TourCardResponseDTO>? cached))
                return cached!;

            var now = DateTime.Now;

            var result = await _context.Tours
                .Include(t => t.HinhAnhTours)
                .Include(t => t.ChuyenKhoiHanhs)
                .Include(t => t.LoaiHinhTour)
                .Include(t => t.DanhGias)
                .Where(t => t.TrangThai == 1 && t.NgayXoa == null)
                .OrderByDescending(t =>
                    t.ChuyenKhoiHanhs
                        .Where(c => c.NgayXoa == null)
                        .Sum(c => (int?)c.SoChoDaDat) ?? 0)
                .Select(t => new TourCardResponseDTO
                {
                    MaTour = t.MaTour,
                    TenTour = t.TenTour,
                    Slug = t.Slug,
                    MoTa = t.MoTa,
                    Ngay = t.Ngay,
                    Dem = t.Dem,
                    GiaTu = t.GiaTu,
                    TenLoaiTour = t.LoaiHinhTour.TenLoaiTour,

                    HinhAnhChinh = t.HinhAnhTours
                        .Where(i => i.NgayXoa == null)
                        .OrderByDescending(i => i.AnhChinh)
                        .Select(i => i.DuongDanAnh)
                        .FirstOrDefault(),

                    DiemDens = t.ChuyenKhoiHanhs
                        .Where(c => c.NgayXoa == null && c.NgayKhoiHanh >= now)
                        .Select(c => c.DiemDen)
                        .Distinct()
                        .ToList(),

                    SoDanhGia = t.DanhGias.Count(),
                    DiemDanhGia = t.DanhGias.Any() ? Math.Round(t.DanhGias.Average(d => d.DiemDanhGia), 1) : 0,
                    LuotXem = t.LuotXem,
                    LuotDat = t.ChuyenKhoiHanhs
                        .Where(c => c.NgayXoa == null)
                        .Sum(c => (int?)c.SoChoDaDat) ?? 0
                })
                .Take(take)
                .ToListAsync();

            _cache.Set(cacheKey, result, ListCacheDuration);
            BumpCacheVersion();
            return result;
        }

        public async Task<List<TourCardDTO>> GetRelatedToursAsync(int maTour, int take = 6)
        {
            var cacheKey = VKey($"tour:related:{maTour}:{take}");
            if (_cache.TryGetValue(cacheKey, out List<TourCardDTO>? cached))
                return cached!;

            var currentTour = await _context.Tours
                .Include(t => t.ChuyenKhoiHanhs)
                .FirstOrDefaultAsync(t => t.MaTour == maTour);

            if (currentTour == null)
                return new List<TourCardDTO>();

            var diemDenChinh = currentTour.ChuyenKhoiHanhs
                .Where(x => x.NgayXoa == null)
                .Select(x => x.DiemDen)
                .FirstOrDefault();

            var relatedTours = await _context.Tours
                .Include(t => t.LoaiHinhTour)
                .Include(t => t.HinhAnhTours)
                .Include(t => t.DanhGias)
                .Include(t => t.ChuyenKhoiHanhs)
                    .ThenInclude(c => c.GiaChuyens)
                .Where(t =>
                    t.MaTour != maTour &&
                    t.TrangThai == 1 &&
                    t.NgayXoa == null)
                .OrderByDescending(t =>
                    t.MaLoaiTour == currentTour.MaLoaiTour ? 100 : 0)
                .ThenByDescending(t =>
                    t.ChuyenKhoiHanhs.Any(c =>
                        c.DiemDen == diemDenChinh) ? 50 : 0)
                .ThenByDescending(t => t.LuotDat)
                .Select(t => new TourCardDTO
                {
                    MaTour = t.MaTour,
                    TenTour = t.TenTour,
                    slug = t.Slug,

                    MaLoaiTour = t.MaLoaiTour,
                    TenLoaiTour = t.LoaiHinhTour.TenLoaiTour,

                    Ngay = t.Ngay,
                    Dem = t.Dem,

                    GiaChuyen = t.ChuyenKhoiHanhs
                        .SelectMany(c => c.GiaChuyens)
                        .Min(g => (decimal?)g.GiaNguoiLon) ?? 0,

                    DuongDanAnh = t.HinhAnhTours
                        .Where(x => x.AnhChinh)
                        .Select(x => x.DuongDanAnh)
                        .FirstOrDefault(),

                    DiemDen = t.ChuyenKhoiHanhs
                        .Select(c => c.DiemDen)
                        .FirstOrDefault(),

                    SoDanhGia = t.DanhGias.Count(),
                    DiemDanhGia = t.DanhGias.Any() ? Math.Round(t.DanhGias.Average(d => d.DiemDanhGia), 1) : 0,
                    LuotXem = t.LuotXem,
                    LuotDat = t.ChuyenKhoiHanhs
                        .Where(c => c.NgayXoa == null)
                        .Sum(c => (int?)c.SoChoDaDat) ?? 0
                })
                .Take(take)
                .ToListAsync();

            _cache.Set(cacheKey, relatedTours, ListCacheDuration);
            BumpCacheVersion();
            return relatedTours;
        }

        public async Task<List<TourCardResponseDTO>> GetRelatedToursByHotelAsync(int maKhachSan)
        {
            var cacheKey = VKey($"tour:relatedbyhotel:{maKhachSan}");
            if (_cache.TryGetValue(cacheKey, out List<TourCardResponseDTO>? cached))
                return cached!;

            var diaChiKhachSan = await _context.KhachSans
                .Where(x => x.MaKhachSan == maKhachSan)
                .Select(x => x.DiaChi)
                .FirstOrDefaultAsync();

            if (string.IsNullOrEmpty(diaChiKhachSan))
                return new();

            var result = await _context.Tours
                .Include(x => x.LoaiHinhTour)
                .Include(x => x.HinhAnhTours)
                .Include(x => x.ChuyenKhoiHanhs)
                .Include(x => x.DanhGias)
                .Where(x =>
                    x.TrangThai == 1 &&
                    x.NgayXoa == null &&
                    x.ChuyenKhoiHanhs.Any(c =>
                        c.DiemDen.Contains(diaChiKhachSan)))
                .Take(8)
                .Select(t => new TourCardResponseDTO
                {
                    MaTour = t.MaTour,
                    TenTour = t.TenTour,
                    Slug = t.Slug,
                    Ngay = t.Ngay,
                    Dem = t.Dem,
                    GiaTu = t.GiaTu,
                    TenLoaiTour = t.LoaiHinhTour.TenLoaiTour,

                    HinhAnhChinh = t.HinhAnhTours
                        .Where(i => i.NgayXoa == null)
                        .OrderByDescending(i => i.AnhChinh)
                        .Select(i => i.DuongDanAnh)
                        .FirstOrDefault(),

                    DiemDens = t.ChuyenKhoiHanhs
                        .Select(c => c.DiemDen)
                        .Distinct()
                        .ToList(),

                    SoDanhGia = t.DanhGias.Count(),
                    DiemDanhGia = t.DanhGias.Any() ? Math.Round(t.DanhGias.Average(d => d.DiemDanhGia), 1) : 0,
                    LuotDat = t.LuotDat,
                    LuotXem = t.LuotXem
                })
                .ToListAsync();

            _cache.Set(cacheKey, result, ListCacheDuration);
            BumpCacheVersion();
            return result;
        }

        public async Task<PageDTO<TourCardDTO>> FilterToursAsync(FilterTourDTO request)
        {
            var query = _context.Tours
                .Include(t => t.LoaiHinhTour)
                .Include(t => t.HinhAnhTours)
                .Include(t => t.DanhGias)
                .Include(t => t.ChuyenKhoiHanhs)
                    .ThenInclude(c => c.GiaChuyens)
                .AsQueryable();

            query = query.Where(t => t.TrangThai == 1 && t.NgayXoa == null);

            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                query = query.Where(t => t.TenTour.Contains(request.Keyword));
            }

            if (request.MaLoaiTour.HasValue)
            {
                query = query.Where(t => t.MaLoaiTour == request.MaLoaiTour.Value);
            }

            if (request.NgayTu.HasValue && request.NgayDen.HasValue)
            {
                query = query.Where(t => t.Ngay >= request.NgayTu.Value && t.Ngay <= request.NgayDen.Value);
            }
            else if (request.NgayTu.HasValue)
            {
                query = query.Where(t => t.Ngay >= request.NgayTu.Value);
            }

            if (!string.IsNullOrEmpty(request.DiemDen))
            {
                var diemDenParam = request.DiemDen.Trim();
                bool isId = int.TryParse(diemDenParam, out var diaDiemId);

                query = query.Where(t =>
                    t.LichTrinhs.Any(l =>
                        l.NgayXoa == null &&
                        l.CTLichTrinhs.Any(ct =>
                            ct.DiaDiem.NgayXoa == null &&
                            (isId
                                ? ct.DiaDiem.MaDiaDiem == diaDiemId
                                : ct.DiaDiem.Slug == diemDenParam)
                        )));
            }

            if (request.MinPrice.HasValue)
            {
                query = query.Where(t =>
                    t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens)
                     .Any(g => g.GiaNguoiLon >= request.MinPrice));
            }

            if (request.MaxPrice.HasValue)
            {
                query = query.Where(t =>
                    t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens)
                     .Any(g => g.GiaNguoiLon <= request.MaxPrice));
            }

            var totalRecords = await query.CountAsync();
            var data = await query
                .OrderByDescending(t => t.LuotDat)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(t => new TourCardDTO
                {
                    MaTour = t.MaTour,
                    TenTour = t.TenTour,
                    MaLoaiTour = t.MaLoaiTour,
                    TenLoaiTour = t.LoaiHinhTour.TenLoaiTour,
                    Ngay = t.Ngay,
                    Dem = t.Dem,
                    slug = t.Slug,
                    LuotDat = t.LuotDat,
                    LuotXem = t.LuotXem,

                    GiaChuyen = t.ChuyenKhoiHanhs
                        .SelectMany(c => c.GiaChuyens)
                        .Min(g => (decimal?)g.GiaNguoiLon) ?? 0,

                    DuongDanAnh = t.HinhAnhTours
                        .Where(x => x.AnhChinh)
                        .Select(x => x.DuongDanAnh)
                        .FirstOrDefault(),

                    DiemDen = t.ChuyenKhoiHanhs
                        .Where(c => c.NgayXoa == null)
                        .Select(c => c.DiemDen)
                        .FirstOrDefault(),

                    SoDanhGia = t.DanhGias.Count(),
                    DiemDanhGia = t.DanhGias.Any() ? Math.Round(t.DanhGias.Average(d => d.DiemDanhGia), 1) : 0
                })
                .ToListAsync();

            return new PageDTO<TourCardDTO>
            {
                Items = data,
                TotalItems = totalRecords,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }

        public async Task<PageDTO<SearchResponse>> SearchToursAsync(SearchDTO request)
        {
            var query = _context.Tours
                .AsNoTracking()
                .Where(t => t.TrangThai == 1 && t.NgayXoa == null)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.Keyword))
            {
                var keyword = request.Keyword.Trim();
                query = query.Where(t => t.TenTour.Contains(keyword));
            }

            if (request.MaLoaiTour.HasValue)
            {
                query = query.Where(t => t.MaLoaiTour == request.MaLoaiTour.Value);
            }

            if (request.NgayTu.HasValue)
            {
                query = query.Where(t => t.Ngay >= request.NgayTu.Value);
            }

            if (request.NgayDen.HasValue)
            {
                query = query.Where(t => t.Ngay <= request.NgayDen.Value);
            }

            if (!string.IsNullOrWhiteSpace(request.DiemDen))
            {
                var diemDen = request.DiemDen.Trim().ToLower();

                query = query.Where(t =>
                    t.ChuyenKhoiHanhs.Any(c =>
                        c.NgayXoa == null &&
                        c.TrangThai == 1 &&
                        c.DiemDen.ToLower().Contains(diemDen))
                    ||
                    t.LichTrinhs.Any(l =>
                        l.NgayXoa == null &&
                        l.CTLichTrinhs.Any(ct =>
                            ct.DiaDiem.NgayXoa == null &&
                            ct.DiaDiem.TinhThanh.ToLower().Contains(diemDen)
                        ))
                );
            }

            if (request.NgayDi.HasValue || request.NgayVe.HasValue)
            {
                var ngayDi = request.NgayDi?.Date;
                var ngayVe = request.NgayVe?.Date;

                query = query.Where(t =>
                    t.ChuyenKhoiHanhs.Any(c =>
                        c.NgayXoa == null &&
                        c.TrangThai == 1 &&
                        (!ngayDi.HasValue || c.NgayKhoiHanh.Date >= ngayDi.Value) &&
                        (!ngayVe.HasValue || c.NgayKetThuc.Date <= ngayVe.Value)));
            }

            if (request.MinPrice.HasValue || request.MaxPrice.HasValue)
            {
                query = query.Where(t =>
                    t.ChuyenKhoiHanhs
                        .Where(c => c.NgayXoa == null && c.TrangThai == 1)
                        .SelectMany(c => c.GiaChuyens)
                        .Any(g => g.NgayXoa == null &&
                                  (!request.MinPrice.HasValue || g.GiaNguoiLon >= request.MinPrice.Value) &&
                                  (!request.MaxPrice.HasValue || g.GiaNguoiLon <= request.MaxPrice.Value)));
            }

            var totalItems = await query.CountAsync();
            var items = await query
                .OrderByDescending(t => t.LuotDat)
                .ThenBy(t => t.TenTour)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(t => new SearchResponse
                {
                    MaTour = t.MaTour,
                    TenTour = t.TenTour,
                    Slug = t.Slug,
                    Ngay = t.Ngay,
                    Dem = t.Dem,
                    LoaiHinhTour = t.LoaiHinhTour != null ? t.LoaiHinhTour.TenLoaiTour : "",
                    GiaTu = t.ChuyenKhoiHanhs
                        .Where(c => c.NgayXoa == null && c.TrangThai == 1)
                        .SelectMany(c => c.GiaChuyens)
                        .Where(g => g.NgayXoa == null)
                        .Select(g => (decimal?)g.GiaNguoiLon)
                        .Min() ?? 0,
                    DuongDanAnh = t.HinhAnhTours
                        .Where(a => a.NgayXoa == null)
                        .OrderByDescending(a => a.AnhChinh)
                        .ThenBy(a => a.SoThuTu)
                        .Select(a => a.DuongDanAnh)
                        .FirstOrDefault() ?? "",
                    DiemDen = t.ChuyenKhoiHanhs
                        .Where(c => c.NgayXoa == null && c.TrangThai == 1)
                        .OrderBy(c => c.NgayKhoiHanh)
                        .Select(c => c.DiemDen)
                        .FirstOrDefault() ?? "",
                    SoDanhGia = t.DanhGias.Count(),
                    DiemDanhGia = t.DanhGias.Any() ? Math.Round(t.DanhGias.Average(d => d.DiemDanhGia), 1) : 0,
                    LuotDat = t.LuotDat,
                    LuotXem = t.LuotXem
                })
                .ToListAsync();

            return new PageDTO<SearchResponse>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }
    }
}