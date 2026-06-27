using System.Globalization;
using System.Text;
using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Departure;
using travel_recommendation_and_booking_system.DTOs.FavoriteTour;
using travel_recommendation_and_booking_system.DTOs.ImageTour;
using travel_recommendation_and_booking_system.DTOs.Schedule;
using travel_recommendation_and_booking_system.DTOs.ScheduleDetails;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;
using travel_recommendation_and_booking_system.Validations;

namespace travel_recommendation_and_booking_system.Services
{
    public class TourService : ITourService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private const string DEFAULT_SCHEDULE_IMAGE = "default-schedule.jpg";

        public TourService(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        private static string ToSafeFileName(string value)
        {
            if (string.IsNullOrWhiteSpace(value)) return "khong_co_ten";

            value = value.Trim().ToLowerInvariant().Normalize(NormalizationForm.FormD);

            var builder = new StringBuilder();

            foreach (var c in value)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    builder.Append(c);
                }
            }

            value = builder.ToString().Normalize(NormalizationForm.FormC);
            value = value.Replace("đ", "d").Replace("Đ", "D");

            foreach (char c in Path.GetInvalidFileNameChars())
            {
                value = value.Replace(c, '_');
            }

            value = value.Replace(" ", "_");

            while (value.Contains("__"))
            {
                value = value.Replace("__", "_");
            }

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
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            string fullPath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

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
                throw new Exception(
                    $"Tour {soNgay} ngày nhưng hiện có {schedules.Count} lịch trình.");
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
                throw new Exception(
                    "Tour phải có ít nhất 1 chuyến khởi hành còn chỗ trong tương lai.");
            }
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
                {
                    await UploadImagesTourAsync(tourEntity.MaTour, images);
                }

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
                            throw new Exception(
                                $"Chuyến {chuyen.MaChuyenCode}: Ngày kết thúc phải lớn hơn ngày khởi hành.");

                        if (chuyen.NgayKhoiHanh <= DateTime.Now)
                            throw new Exception(
                                $"Chuyến {chuyen.MaChuyenCode}: Ngày khởi hành phải ở tương lai.");


                        if (dep.DanhSachGia == null || !dep.DanhSachGia.Any())
                            throw new Exception(
                                $"Chuyến {chuyen.MaChuyenCode}: Phải có ít nhất 1 mức giá.");
                        //var trongNuoc = await GetTrongNuocAsync(dep.MaTour);
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

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
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

                if (dto?.TourInfo != null)
                {
                    existingTour.TenTour = dto.TourInfo.TenTour;
                    existingTour.MaLoaiTour = dto.TourInfo.MaLoaiTour;
                    existingTour.MoTa = dto.TourInfo.MoTa;
                    existingTour.Ngay = dto.TourInfo.Ngay;
                    existingTour.Dem = dto.TourInfo.Dem;
                    existingTour.TrongNuoc = dto.TourInfo.TrongNuoc;
                    existingTour.TrangThai = dto.TourInfo.TrangThai;
                    existingTour.NgayCapNhat = DateTime.Now;
                }

                if (images != null && images.Any())
                {
                    await UploadImagesTourAsync(tourId, images);
                }

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
                    MoTa = tour.MoTa,
                    Ngay = tour.Ngay,
                    Dem = tour.Dem,
                    TrongNuoc = tour.TrongNuoc,
                    TrangThai = tour.TrangThai
                },

                TenKhachSans = tour.Tour_KhachSans?
                    .Select(tk => tk.KhachSan?.TenKhachSan)
                    .Where(name => name != null)
                    .ToList() ?? new List<string>(),

                MaKhachSans = tour.Tour_KhachSans?
                    .Select(tk => tk.MaKhachSan)
                    .ToList() ?? new List<int>(),

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

            tour.NgayXoa = DateTime.Now;
            tour.NgayCapNhat = DateTime.Now;
            tour.TrangThai = 3;
            await _context.SaveChangesAsync();
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
            {
                item.AnhChinh = false;
            }

            image.AnhChinh = true;
            image.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteImageAsync(int imageId)
        {
            var image = await _context.HinhAnhTours.FirstOrDefaultAsync(x => x.MaAnhTour == imageId);
            if (image == null) throw new Exception("Không tìm thấy ảnh");

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

            return true;
        }

        public async Task<bool> ChangeStatusAsync(int maTour, int trangThai)
        {
            var tour = await _context.Tours
                .Include(t => t.LichTrinhs)
                .Include(t => t.HinhAnhTours)
                .Include(t => t.ChuyenKhoiHanhs)
                .FirstOrDefaultAsync(t =>
                    t.MaTour == maTour &&
                    t.NgayXoa == null);

            if (tour == null)
                throw new Exception("Không tìm thấy tour.");

            if (tour.TrangThai == 3)
                throw new Exception("Tour đã ngừng kinh doanh, không thể thay đổi.");

            if (tour.TrangThai == trangThai)
                return true;

            switch (trangThai)
            {
                case 1: // Mở bán 
                    ValidateTourForOpen(tour);
                    break;

                case 2: // Tạm ngưng
                    break;

                case 3: // Ngừng kinh doanh
                    bool hasRunningDeparture = tour.ChuyenKhoiHanhs.Any(x =>
                        x.NgayXoa == null && x.TrangThai == 2);

                    if (hasRunningDeparture)
                        throw new Exception(
                            "Tour đang có chuyến khởi hành diễn ra, không thể ngừng kinh doanh.");
                    break;

                default:
                    throw new Exception("Trạng thái không hợp lệ.");
            }

            tour.TrangThai = trangThai;
            tour.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();
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
                {
                    await file.CopyToAsync(stream);
                }

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

            if (now < ngayKhoiHanh)
                return 1; // Sắp khởi hành

            if (now >= ngayKhoiHanh && now <= ngayKetThuc)
                return 2; // Đang diễn ra

            return 3; // Đã kết thúc
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

        private async Task<string> GenerateUniqueCodeAsync(
            bool trongNuoc,
            string diemKhoiHanh,
            string tenPhuongTien,
            DateTime ngayKhoiHanh)
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
        private async Task<bool> GetTrongNuocAsync(int maTour)
        {
            var tour = await _context.Tours
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.MaTour == maTour);
            return tour?.TrongNuoc ?? true;
        }


        //yêu thích

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
                .FirstOrDefaultAsync(t => t.MaLoaiTour == id);
        }

        // lấy ds tour hot (theo hành vi ng dùng nếu ng dùng mới)
        public async Task<List<Tour>> GetTopTrendingToursAsync()
        {
            return await _context.Tours
        .Include(t => t.ChuyenKhoiHanhs)
        .OrderByDescending(t => t.ChuyenKhoiHanhs.SelectMany(c => c.DonDatTours).Count())
        .Take(4)
        .ToListAsync();
        }

        //Tour du lịch nổi bật (lượt đặt)
        public async Task<List<TourCardDTO>> GetBestToursCardAsync()
        {
            return await _context.Tours
            .Where(t => t.TrangThai == 1 && t.NgayXoa == null)
            .OrderByDescending(t => t.LuotDat)
            .Take(8)
            .Select(t => new TourCardDTO
            {
                MaTour = t.MaTour,
                TenTour = t.TenTour,
                Ngay = t.Ngay,
                Dem = t.Dem,
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
            })
            .ToListAsync();
            }
        // tour mới nhất
        public async Task<List<TourCardDTO>> GetLatestToursAsync()
        {
            return await _context.Tours
                .Where(t => t.TrangThai == 1 && t.NgayXoa == null)
                .OrderByDescending(t => t.NgayTao)
                .Take(8)
                .Select(t => new TourCardDTO
                {
                    MaTour = t.MaTour,
                    TenTour = t.TenTour,
                    Dem= t.Dem,
                    Ngay=t.Ngay,
                    DiemDen = t.ChuyenKhoiHanhs.FirstOrDefault() != null
                                  ? t.ChuyenKhoiHanhs.FirstOrDefault().DiemDen
                                  : "Đang cập nhật",
                    DuongDanAnh = t.HinhAnhTours.FirstOrDefault(a => a.AnhChinh == true).DuongDanAnh ?? "",
                    GiaChuyen = t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Any()
                                  ? t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Min(g => g.GiaNguoiLon)
                                  : 0,
                    DiemDanhGia = t.DanhGias.Any() ? Math.Round(t.DanhGias.Average(d => (double)d.DiemDanhGia), 1) : 0,
                    SoLuongDanhGia = t.DanhGias.Count()
                })
                .ToListAsync();
        }

        // tour dành riêng cho bạn
        public async Task<List<TourCardDTO>> GetTourDesignJustForYouAsync(int userId)
        {
            // lấy tour yêu thích
            var favoriteTourIds = await _context.DanhSachYeuThichs
                .Where(y => y.MaNguoiDung == userId)
                .Select(y => y.MaTour)
                .ToListAsync();

            // Lấy Top 3 loại hình tour người dùng quan tâm nhất
            var topTypes = await _context.SoThichNguoiDungs
                .Where(s => s.MaNguoiDung == userId)
                .OrderByDescending(s => s.DiemYeuThich)
                .Take(3)
                .Select(s => s.MaLoaiTour)
                .ToListAsync();

            // 3. Truy vấn Tour: Ưu tiên loại hình sở thích + Độ phổ biến
            return await _context.Tours
                .Where(t => t.TrangThai == 1 && t.NgayXoa == null)
                .OrderByDescending(t => topTypes.Contains(t.MaLoaiTour))
                .ThenByDescending(t => t.LuotDat)
                .Take(8)
                .Select(t => new TourCardDTO
                {
                    MaTour = t.MaTour,
                    TenTour = t.TenTour,
                    DuongDanAnh = t.HinhAnhTours.FirstOrDefault(l => l.AnhChinh).DuongDanAnh ?? "default-image.jpg",
                    Ngay = t.Ngay,
                    Dem = t.Dem,
                    DiemDen = t.LichTrinhs.SelectMany(l => l.CTLichTrinhs)
                               .Select(ct => ct.DiaDiem.TinhThanh).FirstOrDefault() ?? "Đang cập nhật",
                    GiaChuyen = t.ChuyenKhoiHanhs
                                .SelectMany(ckh => ckh.GiaChuyens)
                                .OrderBy(gc => gc.GiaNguoiLon)
                                .Select(gc => gc.GiaNguoiLon)
                                .FirstOrDefault(),
                    DiemDanhGia = t.DanhGias.Any() ? t.DanhGias.Average(d => d.DiemDanhGia) : 0,
                    SoLuongDanhGia = t.DanhGias.Count(),
                    IsFavorite = favoriteTourIds.Contains(t.MaTour),
                    LuotDat = t.LuotDat
                })
                .ToListAsync();
        }

        // Có thể bạn quan tâm
        public async Task<List<TourCardDTO>> GetRecommendedToursAsync(int userId)
        {
            // 1. Lấy sở thích
            var topTypes = await _context.SoThichNguoiDungs
                .Where(s => s.MaNguoiDung == userId)
                .OrderByDescending(s => s.DiemYeuThich).Take(3).Select(s => s.MaLoaiTour).ToListAsync();

            var topLocations = await _context.SoThichDiaDiemNguoiDungs
                .Where(s => s.MaNguoiDung == userId)
                .OrderByDescending(s => s.DiemYeuThich).Take(3).Select(s => s.MaDiaDiem).ToListAsync();

            // 2. Query và Mapping trực tiếp
            return await _context.Tours
                .Where(t => t.TrangThai == 1 && t.NgayXoa == null)
                .OrderByDescending(t => topTypes.Contains(t.MaLoaiTour) ||
                                       t.LichTrinhs.Any(l => l.CTLichTrinhs.Any(ct => topLocations.Contains(ct.MaDiaDiem))))
                .ThenByDescending(t => t.LuotDat)
                .Take(8)
                .Select(t => new TourCardDTO
                {
                    MaTour = t.MaTour,
                    TenTour = t.TenTour,
                    Ngay = t.Ngay,
                    Dem = t.Dem,
                    DiemDen = t.ChuyenKhoiHanhs.FirstOrDefault() != null ? t.ChuyenKhoiHanhs.FirstOrDefault().DiemDen : "Đang cập nhật",
                    DuongDanAnh = t.HinhAnhTours.FirstOrDefault(a => a.AnhChinh == true).DuongDanAnh ?? "",
                    GiaChuyen = t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Any() ? t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Min(g => g.GiaNguoiLon) : 0,
                    DiemDanhGia = t.DanhGias.Any() ? Math.Round(t.DanhGias.Average(d => (double)d.DiemDanhGia), 1) : 0,
                    SoLuongDanhGia = t.DanhGias.Count(),
                    LuotDat = t.LuotDat
                })
                .ToListAsync();
        }

        //Gợi ý cho chuyến tiếp theo
        public async Task<List<TourCardDTO>> GetNextTripSuggestionsAsync(int userId)
        {
            // 1. Lấy lịch sử tương tác gần nhất
            var recentTypeIds = await _context.SoThichNguoiDungs
                .Where(s => s.MaNguoiDung == userId)
                .OrderByDescending(s => s.NgayCapNhat)
                .Take(3)
                .Select(s => s.MaLoaiTour)
                .ToListAsync();

            // 2. Lấy danh sách MaTour người dùng đã đặt để loại trừ
            var tourDaDatIds = await _context.DonDatTours
                .Where(d => d.MaNguoiDung == userId)
                .Select(d => d.ChuyenKhoiHanh.MaTour)
                .Distinct()
                .ToListAsync();

            // 3. Query kết hợp: Ưu tiên gợi ý + Lấp đầy bằng tour hot
            // Dùng kỹ thuật OrderByDescending cho kiểu bool (true lên trước, false sau)
            return await _context.Tours
                .Where(t => t.TrangThai == 1 && t.NgayXoa == null)
                .Where(t => !tourDaDatIds.Contains(t.MaTour)) // Loại trừ tour đã đặt
                .OrderByDescending(t => recentTypeIds.Contains(t.MaLoaiTour)) // Ưu tiên loại tour quan tâm
                .ThenByDescending(t => t.LuotDat) // Lấp đầy bằng các tour có nhiều lượt đặt nhất
                .Take(8)
                .Select(t => new TourCardDTO
                {
                    MaTour = t.MaTour,
                    TenTour = t.TenTour,
                    Ngay = t.Ngay,
                    Dem = t.Dem,
                    DiemDen = t.ChuyenKhoiHanhs.FirstOrDefault() != null
                                ? t.ChuyenKhoiHanhs.FirstOrDefault().DiemDen : "Đang cập nhật",
                    DuongDanAnh = t.HinhAnhTours.FirstOrDefault(a => a.AnhChinh == true).DuongDanAnh ?? "",
                    GiaChuyen = t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Any()
                                ? t.ChuyenKhoiHanhs.SelectMany(c => c.GiaChuyens).Min(g => g.GiaNguoiLon) : 0,
                    DiemDanhGia = t.DanhGias.Any() ? Math.Round(t.DanhGias.Average(d => (double)d.DiemDanhGia), 1) : 0,
                    SoLuongDanhGia = t.DanhGias.Count(),
                    LuotDat = t.LuotDat
                })
                .ToListAsync();
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
    }

}