using System.Globalization;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.DTOs.LogSystem;
using travel_recommendation_and_booking_system.DTOs.Schedule;
using travel_recommendation_and_booking_system.DTOs.ScheduleDetails;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;
using travel_recommendation_and_booking_system.Validations;

namespace travel_recommendation_and_booking_system.Services
{
    public class ScheduleService : IScheduleService
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;
        private const string DEFAULT_SCHEDULE_IMAGE = "default-schedule.jpg";
        private readonly ILogService _logService;
        private readonly ICurrentUserService _currentUserService;
        private const string CacheVersionKey = "tour:cache:version";

        public ScheduleService(
            AppDbContext context,
            ILogService logService,
            ICurrentUserService currentUserService,
            IMemoryCache cache)
        {
            _context = context;
            _logService = logService;
            _currentUserService = currentUserService;
            _cache = cache;
        }

        // ─── Cache Helper ──────────────────────────────────────────────────────────

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

        private string VKey(string key) => $"v{GetCacheVersion()}:{key}";

        private void ClearTourCache(int tourId)
        {
            // Clear detail cache
            var detailKey = VKey($"tour:detail:{tourId}");
            _cache.Remove(detailKey);

            // Clear slug cache nếu có
            var tour = _context.Tours.AsNoTracking().FirstOrDefault(t => t.MaTour == tourId);
            if (tour != null && !string.IsNullOrEmpty(tour.Slug))
            {
                var slugKey = VKey($"tour:detail:slug:{tour.Slug.ToLower()}");
                _cache.Remove(slugKey);
            }

            // Bump version để invalidate tất cả list cache
            BumpCacheVersion();

            Console.WriteLine($"[CACHE] Cleared cache for tour {tourId}");
        }

        // ─── Helpers ──────────────────────────────────────────────────────────

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

        private async Task<string> SaveScheduleImageAsync(ScheduleDTO dto)
        {
            if (dto.DuongDanAnh == null) return "";

            if (dto.DuongDanAnh.Length > 10 * 1024 * 1024)
                throw new Exception("File ảnh không được vượt quá 10MB.");

            string[] permittedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtension = Path.GetExtension(dto.DuongDanAnh.FileName).ToLowerInvariant();

            if (!permittedExtensions.Contains(fileExtension))
                throw new Exception("Chỉ chấp nhận file ảnh JPG, PNG, GIF.");

            var detailLocationIds = dto.ChiTietLichTrinh?
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
            string maTour = dto.MaTour.ToString();
            string tenLichTrinh = ToSafeFileName(dto.TenLichTrinh);
            string diemThamQuan = ToSafeFileName(tenDiemThamQuan ?? "khong_co_diem_tham_quan");
            string fileName = $"{timeStamp}_{maTour}_{tenLichTrinh}_{diemThamQuan}{fileExtension}";

            string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "img", "schedules");
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            string path = Path.Combine(folderPath, fileName);
            using (var stream = new FileStream(path, FileMode.Create))
                await dto.DuongDanAnh.CopyToAsync(stream);

            return $"/img/schedules/{fileName}";
        }

        private void DeleteOldScheduleImage(string? fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName)) return;
            if (fileName == DEFAULT_SCHEDULE_IMAGE) return;

            var physicalFileName = Path.GetFileName(fileName);
            string oldPath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot", "img", "schedules",
                physicalFileName
            );

            if (File.Exists(oldPath))
                File.Delete(oldPath);
        }

        private async Task<bool> HasStartedDepartureAsync(int maTour)
        {
            return await _context.ChuyenKhoiHanhs
                .AnyAsync(x =>
                    x.MaTour == maTour &&
                    x.NgayXoa == null &&
                    (x.TrangThai == 2 || x.TrangThai == 3 || x.SoChoDaDat > 0));
        }

        private async Task<ScheduleReponseDTO> MapToResponseDTO(LichTrinh lichTrinh)
        {
            if (lichTrinh == null) return null;

            return new ScheduleReponseDTO
            {
                MaLichTrinh = lichTrinh.MaLichTrinh,
                MaTour = lichTrinh.MaTour,
                TenLichTrinh = lichTrinh.TenLichTrinh,
                DuongDanAnh = lichTrinh.DuongDanAnh,
                BuaAn = lichTrinh.BuaAn,
                SoThuTuNgay = lichTrinh.SoThuTuNgay,
                HoatDongChinh = lichTrinh.HoatDongChinh,
                LuuY = lichTrinh.LuuY,
                TrangThai = lichTrinh.TrangThai,
                NgayTao = lichTrinh.NgayTao,
                NgayCapNhat = lichTrinh.NgayCapNhat,
                NgayXoa = lichTrinh.NgayXoa,
                MaKhachSan = lichTrinh.MaKhachSan,
                TenKhachSan = lichTrinh.KhachSan != null ? lichTrinh.KhachSan.TenKhachSan : null,
                SlugKhachSan = lichTrinh.KhachSan != null ? lichTrinh.KhachSan.Slug : null,
                SoSaoKhachSan = lichTrinh.KhachSan != null ? lichTrinh.KhachSan.SoSao : (int?)null,
                ChiTietLichTrinhs = await _context.CTLichTrinhs
                    .Where(ct => ct.MaLichTrinh == lichTrinh.MaLichTrinh)
                    .OrderBy(ct => ct.GioBatDau)
                    .Select(ct => new ScheduleDetailsDTO
                    {
                        MaCTLT = ct.MaCTLT,
                        MaLichTrinh = ct.MaLichTrinh,
                        MaDiaDiem = ct.MaDiaDiem,
                        GioBatDau = ct.GioBatDau,
                        GioKetThuc = ct.GioKetThuc,
                        HoatDong = ct.HoatDong
                    })
                    .ToListAsync()
            };
        }

        // ─── CRUD LichTrinh ───────────────────────────────────────────────────

        public async Task<ScheduleReponseDTO> AddScheduleAsync(ScheduleDTO dto)
        {
            validatorSheduleTour.ValidateSchedules(new List<ScheduleDTO> { dto });

            if (await HasStartedDepartureAsync(dto.MaTour))
                throw new Exception("Tour đã có chuyến khởi hành hoặc đã kết thúc, không thể thêm lịch trình.");

            string fileName = await SaveScheduleImageAsync(dto);

            var lichTrinh = new LichTrinh
            {
                MaTour = dto.MaTour,
                TenLichTrinh = dto.TenLichTrinh,
                BuaAn = dto.BuaAn,
                SoThuTuNgay = dto.SoThuTuNgay,
                HoatDongChinh = dto.HoatDongChinh,
                LuuY = dto.LuuY,
                DuongDanAnh = string.IsNullOrEmpty(fileName) ? DEFAULT_SCHEDULE_IMAGE : fileName,
                TrangThai = true,
                MaKhachSan = (dto.MaKhachSan.HasValue && dto.MaKhachSan > 0) ? dto.MaKhachSan : null,
                NgayTao = DateTime.Now,
                NgayCapNhat = DateTime.Now
            };

            _context.LichTrinhs.Add(lichTrinh);
            await _context.SaveChangesAsync();

            var details = dto.ChiTietLichTrinh ?? new List<ScheduleDetailsDTO>();
            foreach (var item in details)
            {
                _context.CTLichTrinhs.Add(new CTLichTrinh
                {
                    MaLichTrinh = lichTrinh.MaLichTrinh,
                    MaDiaDiem = item.MaDiaDiem,
                    GioBatDau = item.GioBatDau,
                    GioKetThuc = item.GioKetThuc,
                    HoatDong = item.HoatDong
                });
            }

            await _context.SaveChangesAsync();

            var currentAccount = _currentUserService.GetUserId() == 1
                ? AccountTypeDTO.QuanTriVien
                : AccountTypeDTO.NguoiDung;

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = currentAccount,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),
                TenHanhDong = ActionLogDTO.Tao,
                TenBangTacDong = TableNameDTO.LichTrinh,
                MaDoiTuong = lichTrinh.MaLichTrinh,
                GiaTriSau = new
                {
                    lichTrinh.MaTour,
                    lichTrinh.TenLichTrinh,
                    lichTrinh.SoThuTuNgay,
                    lichTrinh.BuaAn,
                    lichTrinh.HoatDongChinh,
                    lichTrinh.MaKhachSan
                }
            });

            // 🔥 Clear cache của tour sau khi thêm mới lịch trình
            ClearTourCache(dto.MaTour);

            // TRẢ VỀ DỮ LIỆU MỚI
            var result = await _context.LichTrinhs
                .Include(x => x.KhachSan)
                .FirstOrDefaultAsync(x => x.MaLichTrinh == lichTrinh.MaLichTrinh);

            return await MapToResponseDTO(result);
        }

        public async Task<List<ScheduleReponseDTO>> GetByTourAsync(int maTour)
        {
            return await _context.LichTrinhs
                .AsNoTracking()
                .Include(x => x.KhachSan)
                .Where(x => x.MaTour == maTour && x.NgayXoa == null)
                .OrderBy(x => x.SoThuTuNgay)
                .Select(x => new ScheduleReponseDTO
                {
                    MaLichTrinh = x.MaLichTrinh,
                    MaTour = x.MaTour,
                    TenLichTrinh = x.TenLichTrinh,
                    DuongDanAnh = x.DuongDanAnh,
                    BuaAn = x.BuaAn,
                    SoThuTuNgay = x.SoThuTuNgay,
                    HoatDongChinh = x.HoatDongChinh,
                    LuuY = x.LuuY,
                    TrangThai = x.TrangThai,
                    NgayTao = x.NgayTao,
                    NgayCapNhat = x.NgayCapNhat,
                    NgayXoa = x.NgayXoa,
                    MaKhachSan = x.MaKhachSan,
                    TenKhachSan = x.KhachSan != null ? x.KhachSan.TenKhachSan : null,
                    SlugKhachSan = x.KhachSan != null ? x.KhachSan.Slug : null,
                    SoSaoKhachSan = x.KhachSan != null ? x.KhachSan.SoSao : (int?)null,
                    ChiTietLichTrinhs = x.CTLichTrinhs
                        .OrderBy(ct => ct.GioBatDau)
                        .Select(ct => new ScheduleDetailsDTO
                        {
                            MaCTLT = ct.MaCTLT,
                            MaLichTrinh = ct.MaLichTrinh,
                            MaDiaDiem = ct.MaDiaDiem,
                            GioBatDau = ct.GioBatDau,
                            GioKetThuc = ct.GioKetThuc,
                            HoatDong = ct.HoatDong
                        })
                        .ToList()
                })
                .ToListAsync();
        }

        public async Task<ScheduleReponseDTO> UpdateScheduleAsync(int maLichTrinh, ScheduleDTO dto)
        {
            validatorSheduleTour.ValidateSchedules(new List<ScheduleDTO> { dto });

            var lt = await _context.LichTrinhs
                .Include(x => x.KhachSan)
                .FirstOrDefaultAsync(x => x.MaLichTrinh == maLichTrinh);

            if (lt == null)
                throw new Exception($"Không tìm thấy lịch trình {maLichTrinh}");

            if (await HasStartedDepartureAsync(lt.MaTour))
                throw new Exception("Tour đã có chuyến khởi hành hoặc đã kết thúc, không thể chỉnh sửa lịch trình.");

            var tourId = lt.MaTour;
            var oldData = new
            {
                lt.TenLichTrinh,
                lt.BuaAn,
                lt.SoThuTuNgay,
                lt.HoatDongChinh,
                lt.LuuY,
                lt.TrangThai,
                lt.MaKhachSan
            };

            lt.TenLichTrinh = dto.TenLichTrinh;
            lt.BuaAn = dto.BuaAn;
            lt.SoThuTuNgay = dto.SoThuTuNgay;
            lt.HoatDongChinh = dto.HoatDongChinh;
            lt.LuuY = dto.LuuY;
            lt.TrangThai = dto.TrangThai;
            lt.NgayCapNhat = DateTime.Now;
            lt.MaKhachSan = (dto.MaKhachSan.HasValue && dto.MaKhachSan > 0) ? dto.MaKhachSan : null;

            string? oldImagePath = null;

            if (dto.DuongDanAnh != null)
            {
                dto.MaTour = dto.MaTour > 0 ? dto.MaTour : lt.MaTour;
                var newImagePath = await SaveScheduleImageAsync(dto);

                if (!string.IsNullOrEmpty(newImagePath))
                {
                    oldImagePath = lt.DuongDanAnh;
                    lt.DuongDanAnh = newImagePath;
                }
            }

            // Sync CTLichTrinh
            var oldDetails = await _context.CTLichTrinhs
                .Where(x => x.MaLichTrinh == maLichTrinh)
                .ToListAsync();

            var incomingDetails = dto.ChiTietLichTrinh ?? new List<ScheduleDetailsDTO>();

            var incomingIds = incomingDetails
                .Where(x => x.MaCTLT > 0)
                .Select(x => x.MaCTLT)
                .ToList();

            var deletedDetails = oldDetails
                .Where(x => !incomingIds.Contains(x.MaCTLT))
                .ToList();

            _context.CTLichTrinhs.RemoveRange(deletedDetails);

            foreach (var item in incomingDetails)
            {
                if (item.MaCTLT > 0)
                {
                    var existing = oldDetails.FirstOrDefault(x => x.MaCTLT == item.MaCTLT);
                    if (existing != null)
                    {
                        existing.MaDiaDiem = item.MaDiaDiem;
                        existing.GioBatDau = item.GioBatDau;
                        existing.GioKetThuc = item.GioKetThuc;
                        existing.HoatDong = item.HoatDong;
                    }
                }
                else
                {
                    _context.CTLichTrinhs.Add(new CTLichTrinh
                    {
                        MaLichTrinh = maLichTrinh,
                        MaDiaDiem = item.MaDiaDiem,
                        GioBatDau = item.GioBatDau,
                        GioKetThuc = item.GioKetThuc,
                        HoatDong = item.HoatDong
                    });
                }
            }

            await _context.SaveChangesAsync();

            if (oldImagePath != null)
                DeleteOldScheduleImage(oldImagePath);

            var currentAccount = _currentUserService.GetUserId() == 1
                ? AccountTypeDTO.QuanTriVien
                : AccountTypeDTO.NguoiDung;

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = currentAccount,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),
                TenHanhDong = ActionLogDTO.CapNhat,
                TenBangTacDong = TableNameDTO.LichTrinh,
                MaDoiTuong = lt.MaLichTrinh,
                GiaTriTruoc = oldData,
                GiaTriSau = new
                {
                    lt.TenLichTrinh,
                    lt.BuaAn,
                    lt.SoThuTuNgay,
                    lt.HoatDongChinh,
                    lt.LuuY,
                    lt.TrangThai,
                    lt.MaKhachSan
                }
            });

            // 🔥 Clear cache của tour sau khi update
            ClearTourCache(tourId);

            // TRẢ VỀ DỮ LIỆU MỚI
            var result = await _context.LichTrinhs
                .Include(x => x.KhachSan)
                .FirstOrDefaultAsync(x => x.MaLichTrinh == maLichTrinh);

            return await MapToResponseDTO(result);
        }

        public async Task<bool> DeleteScheduleAsync(int maLichTrinh)
        {
            var lt = await _context.LichTrinhs.FindAsync(maLichTrinh);

            if (lt == null || lt.NgayXoa != null) return false;

            if (await HasStartedDepartureAsync(lt.MaTour))
                throw new Exception("Tour đã có chuyến khởi hành hoặc đã kết thúc, không thể xóa lịch trình.");

            var tourId = lt.MaTour;
            var oldData = new
            {
                lt.MaLichTrinh,
                lt.TenLichTrinh,
                lt.MaTour,
                lt.TrangThai,
                lt.MaKhachSan
            };

            lt.NgayXoa = DateTime.Now;
            lt.NgayCapNhat = DateTime.Now;
            lt.TrangThai = false;

            var result = await _context.SaveChangesAsync() > 0;
            if (!result) return false;

            var currentAccount = _currentUserService.GetUserId() == 1
                ? AccountTypeDTO.QuanTriVien
                : AccountTypeDTO.NguoiDung;

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = currentAccount,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),
                TenHanhDong = ActionLogDTO.Xoa,
                TenBangTacDong = TableNameDTO.LichTrinh,
                MaDoiTuong = lt.MaLichTrinh,
                GiaTriTruoc = oldData,
                GiaTriSau = new { lt.NgayXoa }
            });

            // 🔥 Clear cache của tour sau khi xóa
            ClearTourCache(tourId);

            return true;
        }

        // ─── CRUD CTLichTrinh ─────────────────────────────────────────────────

        public async Task<bool> AddCTLTAsync(ScheduleDetailsDTO dto)
        {
            // Lấy tourId từ maLichTrinh để clear cache sau này
            var lichTrinh = await _context.LichTrinhs
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.MaLichTrinh == dto.MaLichTrinh);

            var ctlt = new CTLichTrinh
            {
                MaLichTrinh = dto.MaLichTrinh,
                MaDiaDiem = dto.MaDiaDiem,
                GioBatDau = dto.GioBatDau,
                GioKetThuc = dto.GioKetThuc,
                HoatDong = dto.HoatDong
            };

            _context.CTLichTrinhs.Add(ctlt);
            await _context.SaveChangesAsync();

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),
                TenHanhDong = ActionLogDTO.Tao,
                TenBangTacDong = TableNameDTO.CTLichTrinh,
                MaDoiTuong = ctlt.MaCTLT,
                GiaTriSau = new
                {
                    ctlt.MaLichTrinh,
                    ctlt.MaDiaDiem,
                    ctlt.GioBatDau,
                    ctlt.GioKetThuc,
                    ctlt.HoatDong
                }
            });

            // 🔥 Clear cache của tour
            if (lichTrinh != null)
            {
                ClearTourCache(lichTrinh.MaTour);
            }

            return true;
        }

        public async Task<List<ScheduleDetailsReponseDTO>> GetByLichTrinhAsync(int maLichTrinh)
        {
            return await _context.CTLichTrinhs
                .Include(x => x.DiaDiem)
                .Where(x => x.MaLichTrinh == maLichTrinh)
                .OrderBy(x => x.GioBatDau)
                .Select(x => new ScheduleDetailsReponseDTO
                {
                    MaCTLT = x.MaCTLT,
                    MaLichTrinh = x.MaLichTrinh,
                    MaDiaDiem = x.MaDiaDiem,
                    TenDiaDiem = x.DiaDiem.TenDiaDiem,
                    GioBatDau = x.GioBatDau,
                    GioKetThuc = x.GioKetThuc,
                    HoatDong = x.HoatDong
                })
                .ToListAsync();
        }

        public async Task<bool> UpdateCTLTAsync(int maCTLT, ScheduleDetailsDTO dto)
        {
            var ctlt = await _context.CTLichTrinhs.FindAsync(maCTLT);
            if (ctlt == null) return false;

            // Lấy tourId để clear cache
            var lichTrinh = await _context.LichTrinhs
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.MaLichTrinh == ctlt.MaLichTrinh);

            var oldData = new
            {
                ctlt.MaDiaDiem,
                ctlt.GioBatDau,
                ctlt.GioKetThuc,
                ctlt.HoatDong
            };

            ctlt.MaLichTrinh = dto.MaLichTrinh;
            ctlt.MaDiaDiem = dto.MaDiaDiem;
            ctlt.GioBatDau = dto.GioBatDau;
            ctlt.GioKetThuc = dto.GioKetThuc;
            ctlt.HoatDong = dto.HoatDong;

            await _context.SaveChangesAsync();

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),
                TenHanhDong = ActionLogDTO.CapNhat,
                TenBangTacDong = TableNameDTO.CTLichTrinh,
                MaDoiTuong = ctlt.MaCTLT,
                GiaTriTruoc = oldData,
                GiaTriSau = new
                {
                    ctlt.MaDiaDiem,
                    ctlt.GioBatDau,
                    ctlt.GioKetThuc,
                    ctlt.HoatDong
                }
            });

            // 🔥 Clear cache của tour
            if (lichTrinh != null)
            {
                ClearTourCache(lichTrinh.MaTour);
            }

            return true;
        }

        public async Task<bool> DeleteCTLTAsync(int maCTLT)
        {
            var ctlt = await _context.CTLichTrinhs.FindAsync(maCTLT);
            if (ctlt == null) return false;

            // Lấy tourId để clear cache
            var lichTrinh = await _context.LichTrinhs
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.MaLichTrinh == ctlt.MaLichTrinh);

            var oldData = new
            {
                ctlt.MaCTLT,
                ctlt.MaLichTrinh,
                ctlt.MaDiaDiem,
                ctlt.HoatDong
            };

            _context.CTLichTrinhs.Remove(ctlt);
            await _context.SaveChangesAsync();

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),
                TenHanhDong = ActionLogDTO.Xoa,
                TenBangTacDong = TableNameDTO.CTLichTrinh,
                MaDoiTuong = ctlt.MaCTLT,
                GiaTriTruoc = oldData
            });

            // 🔥 Clear cache của tour
            if (lichTrinh != null)
            {
                ClearTourCache(lichTrinh.MaTour);
            }

            return true;
        }
    }
}