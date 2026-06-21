using System.Globalization;
using System.Text;
using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Departure;
using travel_recommendation_and_booking_system.DTOs.ImageTour;
using travel_recommendation_and_booking_system.DTOs.Schedule;
using travel_recommendation_and_booking_system.DTOs.ScheduleDetails;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

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

        private async Task<string> SaveScheduleImageAsync(
            IFormFile file,
            int maTour,
            string tenLichTrinh,
            List<ScheduleDetailsDTO>? chiTietLichTrinhs,
            int soThuTuNgay
        )
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

        public async Task<int> CreateFullTourAsync(TourFullCreateDTO dto, List<IFormFile> images, List<IFormFile> scheduleImages)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var tourEntity = new Tour
                {
                    TenTour = dto.TourInfo.TenTour,
                    MaLoaiTour = dto.TourInfo.MaLoaiTour,
                    MoTa = dto.TourInfo.MoTa,
                    ThoiGianTour = dto.TourInfo.ThoiGianTour,
                    DiemKhoiHanh = dto.TourInfo.DiemKhoiHanh,
                    TrongNuoc = dto.TourInfo.TrongNuoc,
                    TrangThai = true,
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

                        var depEntity = new ChuyenKhoiHanh
                        {
                            MaTour = tourEntity.MaTour,
                            MaHDV = chuyen.MaHDV,
                            MaPhuongTien = chuyen.MaPhuongTien,
                            MaChuyenCode = chuyen.MaChuyenCode,
                            //TenChuyen = chuyen.TenChuyen,
                            NgayKhoiHanh = chuyen.NgayKhoiHanh,
                            NgayKetThuc = chuyen.NgayKetThuc,
                            DiemKhoiHanh = chuyen.DiemKhoiHanh,
                            DiemDen = chuyen.DiemDen,
                            GioDenNoiDi = chuyen.GioDenNoiDi,
                            GioDenNoiVe = chuyen.GioDenNoiVe,
                            GhiChu = chuyen.GhiChu,
                            SoLuongCho = chuyen.SoLuongCho,
                            TrangThai = GetDepartureStatus(
                                chuyen.NgayKhoiHanh,
                                chuyen.SoLuongCho
                            )
                        };

                        _context.ChuyenKhoiHanhs.Add(depEntity);

                        if (dep.DanhSachGia != null)
                        {
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
                }
                await _context.SaveChangesAsync();

                var saved = await _context.ChuyenKhoiHanhs
                    .OrderByDescending(x => x.MaChuyen)
                    .FirstOrDefaultAsync();

                Console.WriteLine(
                    $"Saved TrangThai = {saved?.TrangThai}"
                );

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
            var existingTour = await _context.Tours
                .Include(t => t.Tour_KhachSans)
                .FirstOrDefaultAsync(t => t.MaTour == tourId);

            if (existingTour == null) return false;
            if (dto?.TourInfo != null)
            {
                existingTour.TenTour = dto.TourInfo.TenTour;
                existingTour.MaLoaiTour = dto.TourInfo.MaLoaiTour;
                existingTour.MoTa = dto.TourInfo.MoTa;
                existingTour.ThoiGianTour = dto.TourInfo.ThoiGianTour;
                existingTour.DiemKhoiHanh = dto.TourInfo.DiemKhoiHanh;
                existingTour.TrongNuoc = dto.TourInfo.TrongNuoc;
                existingTour.TrangThai = dto.TourInfo.TrangThai;
            }

            if (images != null && images.Any())
            {
                await UploadImagesTourAsync(tourId, images);
            }

            var incomingHotelIds = dto.DanhSachKhachSan ?? new List<int>();
            var currentHotelLinks = existingTour.Tour_KhachSans.ToList();
            var currentHotelIds = currentHotelLinks
                .Select(tk => tk.MaKhachSan)
                .ToList();

            var hotelLinksToRemove = currentHotelLinks
                .Where(tk => !incomingHotelIds.Contains(tk.MaKhachSan))
                .ToList();

            if (hotelLinksToRemove.Count > 0)
            {
                _context.Tour_KhachSans.RemoveRange(hotelLinksToRemove);
            }

            foreach (var maKS in incomingHotelIds.Except(currentHotelIds))
            {
                _context.Tour_KhachSans.Add(new Tour_KhachSan
                {
                    MaTour = tourId,
                    MaKhachSan = maKS
                });
            }

            await _context.SaveChangesAsync();
            return true;
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
                    ThoiGianTour = tour.ThoiGianTour,
                    DiemKhoiHanh = tour.DiemKhoiHanh,
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
                            //TenChuyen = c.TenChuyen,
                            NgayKhoiHanh = c.NgayKhoiHanh,
                            NgayKetThuc = c.NgayKetThuc,
                            DiemKhoiHanh = c.DiemKhoiHanh,
                            DiemDen = c.DiemDen,
                            GioDenNoiDi = c.GioDenNoiDi,
                            GioDenNoiVe = c.GioDenNoiVe,
                            SoLuongCho = c.SoLuongCho,
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
            var tour = await _context.Tours.FindAsync(tourId);
            if (tour == null || tour.NgayXoa != null) return false;

            tour.NgayXoa = DateTime.Now;
            tour.NgayCapNhat = DateTime.Now;
            tour.TrangThai = false;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<PageDTO<TourReponseDTO>> GetPagedTourAsync(int page, int pageSize, string? searchTerm, bool? status)
        {
            var query = _context.Tours
                .Where(t => t.NgayXoa == null)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(t => t.TenTour.Contains(searchTerm) || t.DiemKhoiHanh.Contains(searchTerm));
            }

            if (status.HasValue)
            {
                query = query.Where(t => t.TrangThai == status.Value);
            }

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
                        ThoiGianTour = t.ThoiGianTour,
                        DiemKhoiHanh = t.DiemKhoiHanh,
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

            DeleteFileFromTourFolder(oldPath);

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


        private void DeleteFileFromTourFolder(string? duongDanAnh)
        {
            if (string.IsNullOrEmpty(duongDanAnh)) return;

            var physicalFileName = Path.GetFileName(duongDanAnh);
            string filePath = Path.Combine(_env.WebRootPath, "img", "tour", physicalFileName);

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }

        private async Task UploadImagesTourAsync(int maTour, List<IFormFile> images)
        {
            if (images == null || !images.Any()) return;

            var uploadFolder = Path.Combine(_env.WebRootPath, "img", "tour");
            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }

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


        private int GetDepartureStatus(DateTime ngayKhoiHanh, int soLuongCho)
        {
            if (soLuongCho <= 0)
                return 0;

            var today = DateTime.Today;

            if (ngayKhoiHanh.Date < today)
                return 2;

            // còn hơn 30 ngày mới mở bán
            if ((ngayKhoiHanh.Date - today).TotalDays > 30)
                return 3;

            return 1;
        }
        private void ValidateImage(IFormFile file, int ngay)
        {
            if (file.Length > 10 * 1024 * 1024)
            {
                throw new Exception($"Ảnh ngày {ngay} vượt quá dung lượng 10MB");
            }

            var extensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!extensions.Contains(extension))
            {
                throw new Exception($"Ảnh ngày {ngay} sai định dạng ảnh");
            }
        }
    }
}