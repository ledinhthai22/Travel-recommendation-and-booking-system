using System.Globalization;
using System.Text;
using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Departure;
using travel_recommendation_and_booking_system.DTOs.ImageTour;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.DTOs.LogSystem;
using travel_recommendation_and_booking_system.DTOs.Schedule;
using travel_recommendation_and_booking_system.DTOs.ScheduleDetails;
using travel_recommendation_and_booking_system.DTOs.Tour;
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

        public TourService(AppDbContext context, IWebHostEnvironment env, ILogService logService, ICurrentUserService currentUserService)
        {
            _context = context;
            _env = env;
            _logService = logService;
            _currentUserService = currentUserService;
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
                    TrongNuoc = dto.TourInfo.TrongNuoc,
                    TrangThai = 1,
                    NgayTao = DateTime.Now,
                    NgayCapNhat = DateTime.Now
                };

                _context.Tours.Add(tourEntity);
                await _context.SaveChangesAsync();

                if (images != null && images.Any())
                    await UploadImagesTourAsync(tourEntity.MaTour, images);

                if (dto.DanhSachKhachSan != null)
                {
                    foreach (var maKS in dto.DanhSachKhachSan)
                    {
                        _context.Tour_KhachSans.Add(new Tour_KhachSan
                        {
                            MaTour = tourEntity.MaTour,
                            MaKhachSan = maKS
                        });
                    }
                }

                int imageIndex = 0;

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
                }

                if (dto.ChuyenKhoiHanhs != null)
                {
                    foreach (var dep in dto.ChuyenKhoiHanhs)
                    {
                        var chuyen = dep.ChuyenKhoiHanh;

                        if (chuyen.NgayKetThuc <= chuyen.NgayKhoiHanh)
                            throw new Exception($"Chuyến khởi hành: Ngày kết thúc phải lớn hơn ngày khởi hành.");

                        if (chuyen.NgayKhoiHanh <= DateTime.Now)
                            throw new Exception($"Chuyến khởi hành: Ngày khởi hành phải ở tương lai.");

                        if (dep.DanhSachGia == null || !dep.DanhSachGia.Any())
                            throw new Exception($"Chuyến khởi hành: Phải có ít nhất 1 mức giá.");

                        var tenPhuongTien = await GetTenPhuongTienAsync(chuyen.MaPhuongTien);
                        var maChuyenCode = await GenerateUniqueCodeAsync(
                            dto.TourInfo.TrongNuoc,
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
                                HangKhachSan = gia.HangKhachSan,
                                GiaNguoiLon = gia.GiaNguoiLon,
                                GiaTreEm = gia.GiaTreEm,
                                GiaEmBe = gia.GiaEmBe,
                                PhuThuPhongDon = gia.PhuThuPhongDon
                            });
                        }
                    }
                }
                if (dto.ChuyenKhoiHanhs != null && dto.ChuyenKhoiHanhs.Any())
                {
                    var giaMin = dto.ChuyenKhoiHanhs
                        .SelectMany(x => x.DanhSachGia)
                        .Min(x => x.GiaNguoiLon);

                    tourEntity.GiaTu = giaMin;
                }
                else
                {
                    tourEntity.GiaTu = 0;
                }

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
                        tourEntity.TrongNuoc,
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
                    .Include(t => t.Tour_KhachSans)
                    .FirstOrDefaultAsync(t => t.MaTour == tourId);

                if (existingTour == null) return false;

                var oldData = new
                {
                    existingTour.TenTour,
                    existingTour.MaLoaiTour,
                    existingTour.MoTa,
                    existingTour.Ngay,
                    existingTour.Dem,
                    existingTour.TrongNuoc,
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
                    existingTour.TrongNuoc = dto.TourInfo.TrongNuoc;
                    existingTour.TrangThai = dto.TourInfo.TrangThai;
                    existingTour.NgayCapNhat = DateTime.Now;
                }

                if (images != null && images.Any())
                    await UploadImagesTourAsync(tourId, images);

                var incomingHotelIds = dto.DanhSachKhachSan ?? new List<int>();
                var currentHotelLinks = existingTour.Tour_KhachSans.ToList();
                var currentHotelIds = currentHotelLinks.Select(tk => tk.MaKhachSan).ToList();

                var hotelLinksToRemove = currentHotelLinks
                    .Where(tk => !incomingHotelIds.Contains(tk.MaKhachSan))
                    .ToList();

                if (hotelLinksToRemove.Count > 0)
                    _context.Tour_KhachSans.RemoveRange(hotelLinksToRemove);

                foreach (var maKS in incomingHotelIds.Except(currentHotelIds))
                {
                    _context.Tour_KhachSans.Add(new Tour_KhachSan
                    {
                        MaTour = tourId,
                        MaKhachSan = maKS
                    });
                }

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
                        existingTour.TrongNuoc,
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
        //xem chi tiết bằng Id
        public async Task<TourReponseDTO?> GetTourDetailAsync(int tourId)
        {
            var tour = await _context.Tours
                .Include(t => t.Tour_KhachSans).ThenInclude(tk => tk.KhachSan)
                .Include(t => t.LichTrinhs).ThenInclude(l => l.CTLichTrinhs)
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
                    TrongNuoc = tour.TrongNuoc,
                    TrangThai = tour.TrangThai
                },

                KhachSans = tour.Tour_KhachSans?
                .Where(tk => tk.KhachSan != null)
                .Select(tk => new HotelInfoDTO
                {
                    MaKhachSan = tk.MaKhachSan,
                    TenKhachSan = tk.KhachSan.TenKhachSan,
                    Slug = tk.KhachSan.Slug,
                    SoSao = tk.KhachSan.SoSao
                })
                .ToList() ?? new List<HotelInfoDTO>(),

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
                            TrangThai = c.TrangThai,
                            GhiChu = c.GhiChu
                        },
                        DanhSachGia = c.GiaChuyens?
                            .Select(g => new GiaChuyenDTO
                            {
                                HangKhachSan = g.HangKhachSan,
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
            var tour = await _context.Tours
                .Include(t => t.Tour_KhachSans).ThenInclude(tk => tk.KhachSan)
                .Include(t => t.LichTrinhs).ThenInclude(l => l.CTLichTrinhs).ThenInclude(d => d.DiaDiem)
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
                    TrongNuoc = tour.TrongNuoc,
                    TrangThai = tour.TrangThai
                },

                KhachSans = tour.Tour_KhachSans?
                .Where(tk => tk.KhachSan != null)
                .Select(tk => new HotelInfoDTO
                {
                    MaKhachSan = tk.MaKhachSan,
                    TenKhachSan = tk.KhachSan.TenKhachSan,
                    Slug = tk.KhachSan.Slug,
                    SoSao = tk.KhachSan.SoSao
                })
                .ToList() ?? new List<HotelInfoDTO>(),

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
                            TrangThai = c.TrangThai,
                            GhiChu = c.GhiChu
                        },
                        DanhSachGia = c.GiaChuyens?
                            .Select(g => new GiaChuyenDTO
                            {
                                HangKhachSan = g.HangKhachSan,
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
                  TrongNuoc = x.TrongNuoc,

                  GiaTu = x.GiaTu, // thêm dòng này

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
                .Where(t => t.NgayXoa == null)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
                query = query.Where(t => t.TenTour.Contains(searchTerm));

            if (status.HasValue)
                query = query.Where(t => t.TrangThai == status.Value);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(t => t.MaTour)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new TourReponseDTO
                {
                    TourInfo = new TourDTO
                    {
                        MaTour = t.MaTour,
                        TenTour = t.TenTour,
                        MaLoaiTour = t.MaLoaiTour,
                        MoTa = t.MoTa,
                        TrongNuoc = t.TrongNuoc,
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

    }
}