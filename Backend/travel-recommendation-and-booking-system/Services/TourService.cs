using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Departure;
using travel_recommendation_and_booking_system.DTOs.ImageTour;
using travel_recommendation_and_booking_system.DTOs.Schedule;
using travel_recommendation_and_booking_system.DTOs.ScheduleDetails;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.DTOs.Tour_KS;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class TourService:ITourService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        public TourService(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<int> CreateFullTourAsync(TourFullCreateDTO dto, List<IFormFile> images)
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
                    SoLuongToiDa = dto.TourInfo.SoLuongToiDa,
                    DiemKhoiHanh = dto.TourInfo.DiemKhoiHanh,
                    TrangThai = true,
                    NgayTao = DateTime.Now,
                    NgayCapNhat = DateTime.Now
                };
                _context.Tours.Add(tourEntity);
                await _context.SaveChangesAsync();

                if (images != null && images.Any())
                {
                    await UploadImagesTourAsync(tourEntity.MaTour, tourEntity.TenTour, images);
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
                    string duongDanAnhDB = "default-schedule.jpg";

                    if (images != null && imageIndex < images.Count)
                    {
                        var fileAnh = images[imageIndex];

                        if (fileAnh.Length > 0)
                        {
                            if (fileAnh.Length > 10 * 1024 * 1024)
                            {
                                throw new Exception($"Ảnh của lịch trình ngày {schedule.SoThuTuNgay} vượt quá dung lượng 10MB.");
                            }

                            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
                            var extension = Path.GetExtension(fileAnh.FileName).ToLower();
                            if (!allowedExtensions.Contains(extension))
                            {
                                throw new Exception($"Ảnh của lịch trình ngày {schedule.SoThuTuNgay} sai định dạng. Chỉ nhận ảnh.");
                            }

                            string timeStamp = DateTime.Now.ToString("yyyyMMddHHmmssfff");
                            string randomChars = Guid.NewGuid().ToString("N").Substring(0, 6);
                            string newFileName = $"{timeStamp}_{randomChars}{extension}";

                            string uploadsFolder = Path.Combine(_env.WebRootPath, "img","schedules");
                            if (!Directory.Exists(uploadsFolder))
                            {
                                Directory.CreateDirectory(uploadsFolder);
                            }

                            string filePath = Path.Combine(uploadsFolder, newFileName);

                            using (var stream = new FileStream(filePath, FileMode.Create))
                            {
                                await fileAnh.CopyToAsync(stream);
                            }

                            duongDanAnhDB = newFileName;
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
                        LuuY=schedule.LuuY,
                        TrangThai =true,

                        TenLichTrinh = schedule.TenLichTrinh
                    };

                    _context.LichTrinhs.Add(schEntity);

                    if (schedule.ChiTietLichTrinhs != null)
                    {
                        foreach (var detail in schedule.ChiTietLichTrinhs)
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

                foreach (var dep in dto.ChuyenKhoiHanhs)
                {
                    var chuyen = dep.ChuyenKhoiHanh;

                    var depEntity = new ChuyenKhoiHanh
                    {
                        MaTour = tourEntity.MaTour,
                        MaHDV = chuyen.MaHDV,
                        MaPhuongTien = chuyen.MaPhuongTien,
                        MaChuyenCode = chuyen.MaChuyenCode,
                        TenChuyen = chuyen.TenChuyen,
                        NgayKhoiHanh = chuyen.NgayKhoiHanh,
                        NgayKetThuc = chuyen.NgayKetThuc,
                        DiemKhoiHanh = chuyen.DiemKhoiHanh,
                        DiemDen = chuyen.DiemDen,
                        GioDenNoiDi = chuyen.GioDenNoiDi,
                        GioDenNoiVe = chuyen.GioDenNoiVe,
                        GhiChu = chuyen.GhiChu,
                        SoLuongCho = chuyen.SoLuongCho
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

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return tourEntity.MaTour;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> UpdateFullTourAsync(int tourId, TourFullCreateDTO dto, List<IFormFile> images)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var tourEntity = await _context.Tours.FindAsync(tourId);
                if (tourEntity == null) return false;

                tourEntity.TenTour = dto.TourInfo.TenTour;
                tourEntity.MaLoaiTour = dto.TourInfo.MaLoaiTour;
                tourEntity.MoTa = dto.TourInfo.MoTa;
                tourEntity.ThoiGianTour = dto.TourInfo.ThoiGianTour;
                tourEntity.SoLuongToiDa = dto.TourInfo.SoLuongToiDa;
                tourEntity.DiemKhoiHanh = dto.TourInfo.DiemKhoiHanh;
                tourEntity.TrangThai= dto.TourInfo.TrangThai;
                tourEntity.NgayCapNhat = DateTime.Now;

                var oldSchedules = _context.LichTrinhs.Where(s => s.MaTour == tourId).ToList();
                var oldScheduleIds = oldSchedules.Select(s => s.MaLichTrinh).ToList();

                _context.CTLichTrinhs.RemoveRange(_context.CTLichTrinhs.Where(c => oldScheduleIds.Contains(c.MaLichTrinh)));
                _context.LichTrinhs.RemoveRange(oldSchedules);
                _context.Tour_KhachSans.RemoveRange(_context.Tour_KhachSans.Where(t => t.MaTour == tourId));

                var oldChuyen = _context.ChuyenKhoiHanhs.Where(c => c.MaTour == tourId).ToList();
                var oldChuyenIds = oldChuyen.Select(c => c.MaChuyen).ToList();
                _context.GiaChuyens.RemoveRange(_context.GiaChuyens.Where(g => oldChuyenIds.Contains(g.Machuyen)));
                _context.ChuyenKhoiHanhs.RemoveRange(oldChuyen);

                if (dto.DanhSachKhachSan != null)
                {
                    foreach (var maKS in dto.DanhSachKhachSan)
                        _context.Tour_KhachSans.Add(new Tour_KhachSan { MaTour = tourId, MaKhachSan = maKS });
                }

                int imageIndex = 0;
                foreach (var schedule in dto.LichTrinh)
                {
                    string duongDanAnhDB = "default-schedule.jpg";

                    if (images != null && imageIndex < images.Count && images[imageIndex].Length > 0)
                    {
                        ValidateImage(images[imageIndex], schedule.SoThuTuNgay);

                        var oldSch = oldSchedules.FirstOrDefault(s => s.SoThuTuNgay == schedule.SoThuTuNgay);
                        DeleteFileFromFolder(oldSch?.DuongDanAnh);

                        duongDanAnhDB = SaveFileAndGetName(images[imageIndex]);
                        imageIndex++;
                    }
                    else
                    {
                        var oldSch = oldSchedules.FirstOrDefault(s => s.SoThuTuNgay == schedule.SoThuTuNgay);
                        duongDanAnhDB = oldSch?.DuongDanAnh ?? "default-schedule.jpg";
                    }

                    var schEntity = new LichTrinh
                    {
                        MaTour = tourId,
                        SoThuTuNgay = schedule.SoThuTuNgay,
                        BuaAn = schedule.BuaAn,
                        HoatDongChinh = schedule.HoatDongChinh,
                        DuongDanAnh = duongDanAnhDB,
                        LuuY = schedule.LuuY,
                        TrangThai = true,
                        TenLichTrinh = schedule.TenLichTrinh
                    };
                    _context.LichTrinhs.Add(schEntity);
                    await _context.SaveChangesAsync(); 

                    if (schedule.ChiTietLichTrinhs != null)
                    {
                        foreach (var detail in schedule.ChiTietLichTrinhs)
                        {
                            _context.CTLichTrinhs.Add(new CTLichTrinh
                            {
                                MaLichTrinh = schEntity.MaLichTrinh,
                                MaDiaDiem = detail.MaDiaDiem,
                                GioBatDau = detail.GioBatDau,
                                GioKetThuc = detail.GioKetThuc,
                                HoatDong = detail.HoatDong
                            });
                        }
                    }
                }

                foreach (var dep in dto.ChuyenKhoiHanhs)
                {
                    var c = dep.ChuyenKhoiHanh;
                    var depEntity = new ChuyenKhoiHanh { MaTour = tourId, MaHDV = c.MaHDV, MaPhuongTien = c.MaPhuongTien, MaChuyenCode = c.MaChuyenCode, TenChuyen = c.TenChuyen, NgayKhoiHanh = c.NgayKhoiHanh, NgayKetThuc = c.NgayKetThuc, DiemKhoiHanh = c.DiemKhoiHanh, DiemDen = c.DiemDen, GioDenNoiDi = c.GioDenNoiDi, GioDenNoiVe = c.GioDenNoiVe, GhiChu = c.GhiChu, SoLuongCho = c.SoLuongCho };
                    _context.ChuyenKhoiHanhs.Add(depEntity);
                    await _context.SaveChangesAsync();
                    foreach (var gia in dep.DanhSachGia)
                        _context.GiaChuyens.Add(new GiaChuyen { Machuyen = depEntity.MaChuyen, HangKhachSan = gia.HangKhachSan, GiaNguoiLon = gia.GiaNguoiLon, GiaTreEm = gia.GiaTreEm, GiaEmBe = gia.GiaEmBe, PhuThuPhongDon = gia.PhuThuPhongDon });
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<TourReponseDTO> GetTourDetailAsync(int tourId)
        {
            var tour = await _context.Tours
                .Include(t => t.Tour_KhachSans).ThenInclude(tk => tk.KhachSan)
                .Include(t => t.LichTrinhs).ThenInclude(l => l.CTLichTrinhs)
                .Include(t => t.ChuyenKhoiHanhs).ThenInclude(c => c.GiaChuyens)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.MaTour == tourId);

            if (tour == null) return null;

            var dto = new TourReponseDTO
            {
                TourInfo = new TourDTO
                {
                    TenTour = tour.TenTour,
                    MaLoaiTour = tour.MaLoaiTour,
                    MoTa = tour.MoTa,
                    ThoiGianTour = tour.ThoiGianTour,
                    SoLuongToiDa = tour.SoLuongToiDa,
                    DiemKhoiHanh = tour.DiemKhoiHanh,
                    TrangThai = tour.TrangThai
                },
                TenKhachSans = tour.Tour_KhachSans.Select(tk => tk.KhachSan.TenKhachSan).ToList(),

                LichTrinh = tour.LichTrinhs.OrderBy(l => l.SoThuTuNgay).Select(l => new ScheduleReponseDTO
                {
                    MaTour = l.MaTour,
                    TenLichTrinh = l.TenLichTrinh,
                    SoThuTuNgay = l.SoThuTuNgay,
                    BuaAn = l.BuaAn,
                    HoatDongChinh = l.HoatDongChinh,
                    LuuY = l.LuuY,
                    TrangThai = l.TrangThai,
                    DuongDanAnh = l.DuongDanAnh, 
                    ChiTietLichTrinhs = l.CTLichTrinhs.Select(ct => new ScheduleDetailsDTO
                    {
                        MaDiaDiem = ct.MaDiaDiem,
                        GioBatDau = ct.GioBatDau,
                        GioKetThuc = ct.GioKetThuc,
                        HoatDong = ct.HoatDong
                    }).ToList()
                }).ToList(),

                ChuyenKhoiHanhs = tour.ChuyenKhoiHanhs.Select(c => new DepartureFullDTO
                {
                    ChuyenKhoiHanh = new DepartureDTO
                    {
                        MaHDV = c.MaHDV,
                        MaPhuongTien = c.MaPhuongTien,
                        MaChuyenCode = c.MaChuyenCode,
                        TenChuyen = c.TenChuyen,
                        NgayKhoiHanh = c.NgayKhoiHanh,
                        NgayKetThuc = c.NgayKetThuc,
                        DiemKhoiHanh = c.DiemKhoiHanh,
                        DiemDen = c.DiemDen,
                        GioDenNoiDi = c.GioDenNoiDi,
                        GioDenNoiVe = c.GioDenNoiVe,
                        SoLuongCho = c.SoLuongCho,
                        GhiChu = c.GhiChu
                    },
                    DanhSachGia = c.GiaChuyens.Select(g => new GiaChuyenDTO
                    {
                        HangKhachSan = g.HangKhachSan,
                        GiaNguoiLon = g.GiaNguoiLon,
                        GiaTreEm = g.GiaTreEm,
                        GiaEmBe = g.GiaEmBe,
                        PhuThuPhongDon = g.PhuThuPhongDon
                    }).ToList()
                }).ToList()
            };

            return dto;
        }

        public async Task<bool> SoftDeleteTourAsync(int tourId)
        {
            var tour = await _context.Tours.FindAsync(tourId);
            if (tour == null || tour.NgayXoa != null || tour.TrangThai==true) return false;

            tour.NgayXoa = null;
            tour.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PageDTO<TourReponseDTO>> GetPagedTourAsync(int page, int pageSize, string searchTerm, bool? status)
        {
            var query = _context.Tours.AsQueryable();

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
                .Select(t => new TourDTO
                {
                    TenTour = t.TenTour,
                    MaLoaiTour = t.MaLoaiTour,
                    MoTa = t.MoTa,
                    ThoiGianTour = t.ThoiGianTour,
                    SoLuongToiDa = t.SoLuongToiDa,
                    DiemKhoiHanh = t.DiemKhoiHanh,
                    TrangThai = t.TrangThai
                })
                .ToListAsync();

            return new PageDTO<TourReponseDTO> 
            {
                TotalItems = totalCount,
                PageNumber = page,
                PageSize = pageSize 
            };
        }


        ////thêm tour
        //public async Task<int> CreateTourAsync(TourDTO tour, List<IFormFile> images, List<int>? danhSachMaKhachSan)
        //{
        //    var existedTour = await _context.Tours.AnyAsync(x => x.NgayXoa == null && x.TenTour.Trim().ToLower() == tour.TenTour.Trim().ToLower());

        //    if (existedTour)
        //        throw new Exception("Tour đã tồn tại");

        //    if (images != null && images.Count > 0)
        //    {
        //        ValidateImages(images);
        //    }

        //    var entity = new Tour
        //    {
        //        TenTour = tour.TenTour,
        //        MaLoaiTour = tour.MaLoaiTour,
        //        MoTa = tour.MoTa,
        //        ThoiGianTour = tour.ThoiGianTour,
        //        SoLuongToiDa = tour.SoLuongToiDa,
        //        DiemKhoiHanh = tour.DiemKhoiHanh,
        //        TrangThai = true,
        //        NgayTao = DateTime.Now,
        //        NgayCapNhat = DateTime.Now
        //    };

        //    _context.Tours.Add(entity);
        //    await _context.SaveChangesAsync();

        //    if (images != null && images.Count > 0)
        //    {
        //        await UploadImagesTourAsync(entity.MaTour,tour.TenTour, images);
        //    }

        //    if (danhSachMaKhachSan != null && danhSachMaKhachSan.Any())
        //    {
        //        foreach (var maKS in danhSachMaKhachSan)
        //        {
        //            _context.Tour_KhachSans.Add(new Tour_KhachSan
        //            {
        //                MaTour = entity.MaTour,
        //                MaKhachSan = maKS
        //            });
        //        }
        //        await _context.SaveChangesAsync();
        //    }

        //    return entity.MaTour;
        //}

        ////cập nhật tour
        //public async Task<bool> UpdateTourAsync(int id, TourDTO tourDto, List<IFormFile>? images, List<int>? danhSachMaKhachSan)
        //{
        //    var entity = await _context.Tours
        //.FirstOrDefaultAsync(x => x.MaTour == id && x.NgayXoa == null);

        //    if (entity == null)
        //    {
        //        throw new Exception("Không tìm thấy tour");
        //    }

        //    entity.TenTour = tourDto.TenTour;
        //    entity.MaLoaiTour = tourDto.MaLoaiTour;
        //    entity.MoTa = tourDto.MoTa;
        //    entity.TrangThai = tourDto.TrangThai;
        //    entity.ThoiGianTour = tourDto.ThoiGianTour;
        //    entity.SoLuongToiDa = tourDto.SoLuongToiDa;
        //    entity.DiemKhoiHanh = tourDto.DiemKhoiHanh;
        //    entity.NgayCapNhat = DateTime.Now;

        //    if (images != null && images.Any())
        //    {
        //        ValidateImages(images);

        //        await UploadImagesTourAsync(id, tourDto.TenTour, images);
        //    }

        //    if (danhSachMaKhachSan != null)
        //    {
        //        var oldHotels = _context.Tour_KhachSans.Where(x => x.MaTour == id);
        //        _context.Tour_KhachSans.RemoveRange(oldHotels);

        //        foreach (var maKS in danhSachMaKhachSan)
        //        {
        //            _context.Tour_KhachSans.Add(new Tour_KhachSan
        //            {
        //                MaTour = id,
        //                MaKhachSan = maKS
        //            });
        //        }
        //    }
        //    await _context.SaveChangesAsync();

        //    return true;
        //}
        //xóa tour
        //public async Task<bool> DeleteTourAsync(int id)
        //{
        //    var entity = await _context.Tours.FirstOrDefaultAsync(x => x.MaTour == id && x.NgayXoa == null);

        //    if (entity == null)
        //    {
        //        throw new Exception("Không tìm thấy tour");
        //    }
        //    if (entity.TrangThai)
        //    {
        //        throw new Exception("Chỉ được phép xóa các tour ngưng hoạt động");
        //    }
        //    entity.NgayXoa = DateTime.Now;

        //    await _context.SaveChangesAsync();

        //    return true;
        //}
        // xem chi tiết
        //public async Task<TourReponseDTO?> GetTourByIdAsync(int id)
        //{
        //    var tour = await _context.Tours
        //        .AsNoTracking()
        //        .Include(x => x.HinhAnhTours)
        //        .Include(x => x.LoaiHinhTour)
        //        .FirstOrDefaultAsync(x => x.MaTour == id && x.NgayXoa == null);

        //    if (tour == null) return null;

        //    return new TourReponseDTO
        //    {
        //        MaTour = tour.MaTour,
        //        MaLoaiTour = tour.MaLoaiTour,
        //        TenTour = tour.TenTour,
        //        MoTa = tour.MoTa,
        //        ThoiGianTour = tour.ThoiGianTour,
        //        SoLuongToiDa = tour.SoLuongToiDa,
        //        LuotDat = tour.LuotDat,
        //        LuotXem = tour.LuotXem,
        //        DiemKhoiHanh = tour.DiemKhoiHanh,
        //        TrangThai = tour.TrangThai,
        //        NgayTao = tour.NgayTao,
        //        NgayCapNhat = tour.NgayCapNhat,
        //        NgayXoa = tour.NgayXoa,

        //        HinhAnh = tour.HinhAnhTours.Select(img => new ImageTourDTO
        //        {
        //            MaAnhTour = img.MaAnhTour,
        //            MaTour = img.MaTour,
        //            DuongDanAnh = img.DuongDanAnh,
        //            AnhChinh = img.AnhChinh,
        //            SoThuTu = img.SoThuTu
        //        }).ToList()
        //    };
        //}

        //danh sách tour
        //public async Task<PageDTO<TourReponseDTO>> GetPagedTourAsync(int pageNumber, int pageSize, string key, bool? status)
        //{
        //    pageNumber = pageNumber < 1 ? 1 : pageNumber;
        //    pageSize = pageSize < 1 ? 10 : pageSize;

        //    var query = _context.Tours
        //        .AsNoTracking()
        //        .Include(x => x.HinhAnhTours)
        //        .Where(x => x.NgayXoa == null);

        //    if (!string.IsNullOrWhiteSpace(key))
        //    {
        //        query = query.Where(x => x.TenTour.Contains(key) || x.DiemKhoiHanh.Contains(key));
        //    }

        //    if (status.HasValue)
        //    {
        //        query = query.Where(x => x.TrangThai == status.Value);
        //    }

        //    var totalItems = await query.CountAsync();

        //    var items = await query
        //        .OrderByDescending(x => x.NgayTao)
        //        .Skip((pageNumber - 1) * pageSize)
        //        .Take(pageSize)
        //        .Select(x => new TourReponseDTO
        //        {
        //            MaTour = x.MaTour,
        //            TenTour = x.TenTour,
        //            MaLoaiTour = x.MaLoaiTour,
        //            MoTa = x.MoTa,
        //            ThoiGianTour = x.ThoiGianTour,
        //            SoLuongToiDa = x.SoLuongToiDa,
        //            LuotDat = x.LuotDat,
        //            LuotXem = x.LuotXem,
        //            DiemKhoiHanh = x.DiemKhoiHanh,
        //            TrangThai = x.TrangThai,
        //            NgayTao = x.NgayTao,
        //            NgayCapNhat = x.NgayCapNhat,
        //            NgayXoa = x.NgayXoa,

        //            HinhAnh = x.HinhAnhTours.Select(img => new ImageTourDTO
        //            {
        //                MaAnhTour = img.MaAnhTour,
        //                MaTour = img.MaTour,
        //                DuongDanAnh = img.DuongDanAnh,
        //                AnhChinh = img.AnhChinh,
        //                SoThuTu = img.SoThuTu
        //            }).ToList()
        //        })
        //        .ToListAsync();

        //    return new PageDTO<TourReponseDTO>
        //    {
        //        Items = items,
        //        TotalItems = totalItems,
        //        PageNumber = pageNumber,
        //        PageSize = pageSize,
        //    };
        //}
        //public async Task<bool> AddToTourAsync(Tour_KSDTO dto)
        //{
        //    var exists = await _context.Tour_KhachSans
        //        .AnyAsync(x => x.MaTour == dto.MaTour && x.MaKhachSan == dto.MaKhachSan);
        //    if (exists) return false;

        //    var item = new Tour_KhachSan { MaTour = dto.MaTour, MaKhachSan = dto.MaKhachSan };
        //    _context.Tour_KhachSans.Add(item);
        //    return await _context.SaveChangesAsync() > 0;
        //}

        //public async Task<bool> RemoveFromTourAsync(int maTour, int maKhachSan)
        //{
        //    var item = await _context.Tour_KhachSans
        //        .FirstOrDefaultAsync(x => x.MaTour == maTour && x.MaKhachSan == maKhachSan);
        //    if (item == null) return false;

        //    _context.Tour_KhachSans.Remove(item);
        //    return await _context.SaveChangesAsync() > 0;
        //}

        //private


        public async Task<bool> SetMainImageAsync(int imageId)
        {
            var image = await _context.HinhAnhTours.FirstOrDefaultAsync(x => x.MaAnhTour == imageId);

            if (image == null)
                throw new Exception("Không tìm thấy ảnh");

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
            var image = await _context.HinhAnhTours
                .FirstOrDefaultAsync(x => x.MaAnhTour == imageId);

            if (image == null)
                throw new Exception("Không tìm thấy ảnh");

            bool isMainImage = image.AnhChinh;
            int maTour = image.MaTour;

            _context.HinhAnhTours.Remove(image);

            await _context.SaveChangesAsync();

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

        private async Task UploadImagesTourAsync(int maTour, string tenTour, List<IFormFile> images)
        {
            if (images == null || !images.Any())
                return;

            var uploadFolder = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot/img/tour");

            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            bool hasMainImage = await _context.HinhAnhTours
                .AnyAsync(x => x.MaTour == maTour && x.AnhChinh);

            int index = await _context.HinhAnhTours
                .CountAsync(x => x.MaTour == maTour) + 1;

            foreach (var file in images)
            {
                var fileName = $"{DateTime.Now:yyyyMMddHHmmssfff}_{maTour}_{index}{Path.GetExtension(file.FileName)}";
                var fullPath = Path.Combine(uploadFolder, fileName);

                using var stream = new FileStream(fullPath, FileMode.Create);
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

        private string SaveFileAndGetName(IFormFile file)
        {
            string uploadsFolder = Path.Combine(_env.WebRootPath, "img", "schedule");
            string newFileName = $"{DateTime.Now:yyyyMMddHHmmssfff}_{Guid.NewGuid().ToString("N").Substring(0, 6)}{Path.GetExtension(file.FileName)}";

            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            using (var stream = new FileStream(Path.Combine(uploadsFolder, newFileName), FileMode.Create))
            {
                file.CopyTo(stream);
            }
            return newFileName;
        }

        private void DeleteFileFromFolder(string fileName)
        {
            if (string.IsNullOrEmpty(fileName) || fileName == "default-schedule.jpg") return;
            string filePath = Path.Combine(_env.WebRootPath, "img", "schedules", fileName);
            if (File.Exists(filePath)) File.Delete(filePath);
        }

        private void ValidateImage(IFormFile file, int ngay)
        {
            if (file.Length > 10 * 1024 * 1024) throw new Exception($"Ảnh ngày {ngay} > 10MB");
            var extensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            if (!extensions.Contains(Path.GetExtension(file.FileName).ToLower())) throw new Exception($"Ảnh ngày {ngay} sai định dạng");
        }

    }
}
