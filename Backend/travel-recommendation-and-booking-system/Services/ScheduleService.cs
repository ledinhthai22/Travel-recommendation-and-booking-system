using System.Globalization;
using System.Text;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using Microsoft.EntityFrameworkCore;
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
        private const string DEFAULT_SCHEDULE_IMAGE = "default-schedule.jpg";
        private readonly ILogService _logService;
        private readonly ICurrentUserService _currentUserService;
        private readonly ITourCacheService _tourCache;

        public ScheduleService(
            AppDbContext context,
            ILogService logService,
            ICurrentUserService currentUserService,
            ITourCacheService tourCache)
        {
            _context = context;
            _logService = logService;
            _currentUserService = currentUserService;
            _tourCache = tourCache;
        }

        /// <summary>
        /// Lấy slug hiện tại của tour để vô hiệu hóa đúng cache chi tiết theo slug.
        /// </summary>
        private async Task<string?> GetTourSlugAsync(int tourId)
        {
            return await _context.Tours
                .AsNoTracking()
                .Where(t => t.MaTour == tourId)
                .Select(t => t.Slug)
                .FirstOrDefaultAsync();
        }

        /// <summary>
        /// Lịch trình/chi tiết lịch trình ảnh hưởng trang chi tiết tour và việc tìm tour
        /// theo địa điểm (GetToursByLocationSlugAsync), nên vô hiệu hóa cả 2 loại cache.
        /// </summary>
        private async Task InvalidateTourCacheAsync(int tourId)
        {
            var slug = await GetTourSlugAsync(tourId);
            _tourCache.InvalidateTourDetail(tourId, slug);
            _tourCache.InvalidateLists();
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

        private async Task<bool> HasAnyDepartureAsync(int maTour)
        {
            return await _context.ChuyenKhoiHanhs
                .AnyAsync(x =>
                    x.MaTour == maTour &&
                    x.NgayXoa == null);
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
                        HoatDong = ct.HoatDong,
                        LoaiHoatDong = ct.LoaiHoatDong // MỚI
                    })
                    .ToListAsync()
            };
        }

        public async Task<ScheduleReponseDTO> AddScheduleAsync(ScheduleDTO dto)
        {
            validatorSheduleTour.ValidateSchedules(new List<ScheduleDTO> { dto });

            if (await HasAnyDepartureAsync(dto.MaTour))
                throw new Exception("Tour đã có chuyến khởi hành, không thể thêm lịch trình.");

            string fileName = await SaveScheduleImageAsync(dto);

            var lichTrinh = new LichTrinh
            {
                MaTour = dto.MaTour,
                TenLichTrinh = dto.TenLichTrinh,
                BuaAn = dto.BuaAn,
                SoThuTuNgay = dto.SoThuTuNgay,
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
                    MaDiaDiem = (item.MaDiaDiem.HasValue && item.MaDiaDiem > 0) ? item.MaDiaDiem : null,
                    GioBatDau = item.GioBatDau,
                    GioKetThuc = item.GioKetThuc,
                    LoaiHoatDong = item.LoaiHoatDong,
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
                    lichTrinh.MaKhachSan
                }
            });

            await InvalidateTourCacheAsync(dto.MaTour);

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
                            HoatDong = ct.HoatDong,
                            LoaiHoatDong = ct.LoaiHoatDong // MỚI
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

            var tourId = lt.MaTour;
            var oldData = new
            {
                lt.TenLichTrinh,
                lt.BuaAn,
                lt.SoThuTuNgay,
                lt.LuuY,
                lt.TrangThai,
                lt.MaKhachSan
            };

            lt.TenLichTrinh = dto.TenLichTrinh;
            lt.BuaAn = dto.BuaAn;
            lt.SoThuTuNgay = dto.SoThuTuNgay;
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
                        existing.MaDiaDiem = (item.MaDiaDiem.HasValue && item.MaDiaDiem > 0) ? item.MaDiaDiem : null;
                        existing.GioBatDau = item.GioBatDau;
                        existing.GioKetThuc = item.GioKetThuc;
                        existing.HoatDong = item.HoatDong;
                        existing.LoaiHoatDong = item.LoaiHoatDong;
                    }
                }
                else
                {
                    _context.CTLichTrinhs.Add(new CTLichTrinh
                    {
                        MaLichTrinh = maLichTrinh,
                        MaDiaDiem = (item.MaDiaDiem.HasValue && item.MaDiaDiem > 0) ? item.MaDiaDiem : null,
                        GioBatDau = item.GioBatDau,
                        GioKetThuc = item.GioKetThuc,
                        HoatDong = item.HoatDong,
                        LoaiHoatDong = item.LoaiHoatDong,
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
                    lt.LuuY,
                    lt.TrangThai,
                    lt.MaKhachSan
                }
            });

            await InvalidateTourCacheAsync(tourId);

            var result = await _context.LichTrinhs
                .Include(x => x.KhachSan)
                .FirstOrDefaultAsync(x => x.MaLichTrinh == maLichTrinh);

            return await MapToResponseDTO(result);
        }

        public async Task<bool> DeleteScheduleAsync(int maLichTrinh)
        {
            var lt = await _context.LichTrinhs.FindAsync(maLichTrinh);

            if (lt == null || lt.NgayXoa != null) return false;

            var tourId = lt.MaTour;
            var oldData = new
            {
                lt.MaLichTrinh,
                lt.TenLichTrinh,
                lt.MaTour,
                lt.TrangThai,
                lt.MaKhachSan,
                lt.SoThuTuNgay
            };

            // Xóa mềm lịch trình
            lt.NgayXoa = DateTime.Now;
            lt.NgayCapNhat = DateTime.Now;
            lt.TrangThai = false;

            // Lưu thay đổi để xóa mềm
            var deleteResult = await _context.SaveChangesAsync() > 0;
            if (!deleteResult) return false;

            // Lấy tất cả lịch trình còn lại của tour, sắp xếp theo số thứ tự ngày
            var remainingSchedules = await _context.LichTrinhs
                .Where(x => x.MaTour == tourId && x.NgayXoa == null)
                .OrderBy(x => x.SoThuTuNgay)
                .ToListAsync();

            // Cập nhật lại số thứ tự ngày cho các lịch trình còn lại
            int newOrder = 1;
            foreach (var schedule in remainingSchedules)
            {
                // Chỉ cập nhật nếu số thứ tự hiện tại khác với số thứ tự mới
                if (schedule.SoThuTuNgay != newOrder)
                {
                    schedule.SoThuTuNgay = newOrder;
                    schedule.NgayCapNhat = DateTime.Now;

                    // Cập nhật tên lịch trình nếu cần (tùy theo logic nghiệp vụ)
                    // schedule.TenLichTrinh = $"Hành trình Ngày {newOrder}";
                }
                newOrder++;
            }

            // Lưu thay đổi số thứ tự
            await _context.SaveChangesAsync();

            // Log hành động xóa
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
                GiaTriSau = new
                {
                    lt.NgayXoa,
                    SoThuTuNgayMoi = "Đã xóa và cập nhật lại số thứ tự cho các ngày còn lại"
                }
            });

            // Log thêm về việc cập nhật số thứ tự
            foreach (var schedule in remainingSchedules)
            {
                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = currentAccount,
                    Email = _currentUserService.GetEmail(),
                    MaTaiKhoan = _currentUserService.GetUserId(),
                    TenHanhDong = ActionLogDTO.CapNhat,
                    TenBangTacDong = TableNameDTO.LichTrinh,
                    MaDoiTuong = schedule.MaLichTrinh,
                    GiaTriSau = new
                    {
                        schedule.SoThuTuNgay,
                        schedule.NgayCapNhat,
                        LyDo = "Cập nhật lại số thứ tự sau khi xóa ngày khác"
                    }
                });
            }

            await InvalidateTourCacheAsync(tourId);

            return true;
        }

        public async Task<bool> AddCTLTAsync(ScheduleDetailsDTO dto)
        {
            var lichTrinh = await _context.LichTrinhs
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.MaLichTrinh == dto.MaLichTrinh);

            if (lichTrinh != null && await HasAnyDepartureAsync(lichTrinh.MaTour))
                throw new Exception("Tour đã có chuyến khởi hành, không thể thêm chi tiết lịch trình.");

            var ctlt = new CTLichTrinh
            {
                MaLichTrinh = dto.MaLichTrinh,
                MaDiaDiem = (dto.MaDiaDiem.HasValue && dto.MaDiaDiem > 0) ? dto.MaDiaDiem : null,
                GioBatDau = dto.GioBatDau,
                GioKetThuc = dto.GioKetThuc,
                HoatDong = dto.HoatDong,
                LoaiHoatDong = dto.LoaiHoatDong // MỚI
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
                    ctlt.HoatDong,
                    ctlt.LoaiHoatDong // MỚI
                }
            });

            if (lichTrinh != null)
            {
                await InvalidateTourCacheAsync(lichTrinh.MaTour);
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
                    HoatDong = x.HoatDong,
                    LoaiHoatDong = x.LoaiHoatDong // MỚI
                })
                .ToListAsync();
        }

        public async Task<bool> UpdateCTLTAsync(int maCTLT, ScheduleDetailsDTO dto)
        {
            var ctlt = await _context.CTLichTrinhs.FindAsync(maCTLT);
            if (ctlt == null) return false;

            var lichTrinh = await _context.LichTrinhs
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.MaLichTrinh == ctlt.MaLichTrinh);

            if (lichTrinh != null && await HasAnyDepartureAsync(lichTrinh.MaTour))
                throw new Exception("Tour đã có chuyến khởi hành, không thể sửa chi tiết lịch trình.");

            var oldData = new
            {
                ctlt.MaDiaDiem,
                ctlt.GioBatDau,
                ctlt.GioKetThuc,
                ctlt.HoatDong,
                ctlt.LoaiHoatDong // MỚI
            };

            ctlt.MaLichTrinh = dto.MaLichTrinh;
            ctlt.MaDiaDiem = (dto.MaDiaDiem.HasValue && dto.MaDiaDiem > 0) ? dto.MaDiaDiem : null;
            ctlt.GioBatDau = dto.GioBatDau;
            ctlt.GioKetThuc = dto.GioKetThuc;
            ctlt.HoatDong = dto.HoatDong;
            ctlt.LoaiHoatDong = dto.LoaiHoatDong; // MỚI

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
                    ctlt.HoatDong,
                    ctlt.LoaiHoatDong // MỚI
                }
            });

            if (lichTrinh != null)
            {
                await InvalidateTourCacheAsync(lichTrinh.MaTour);
            }

            return true;
        }

        public async Task<bool> DeleteCTLTAsync(int maCTLT)
        {
            var ctlt = await _context.CTLichTrinhs.FindAsync(maCTLT);
            if (ctlt == null) return false;

            var lichTrinh = await _context.LichTrinhs
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.MaLichTrinh == ctlt.MaLichTrinh);

            if (lichTrinh != null && await HasAnyDepartureAsync(lichTrinh.MaTour))
                throw new Exception("Tour đã có chuyến khởi hành, không thể xóa chi tiết lịch trình.");

            var oldData = new
            {
                ctlt.MaCTLT,
                ctlt.MaLichTrinh,
                ctlt.MaDiaDiem,
                ctlt.HoatDong,
                ctlt.LoaiHoatDong // MỚI
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

            if (lichTrinh != null)
            {
                await InvalidateTourCacheAsync(lichTrinh.MaTour);
            }

            return true;
        }
    }
}