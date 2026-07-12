using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Departure;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.DTOs.LogSystem;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace Services
{
    public class DepartureService : IDepartureService
    {
        private readonly AppDbContext _context;
        private readonly ILogService _logService;
        private readonly ICurrentUserService _currentUserService;
        private readonly ITourCacheService _tourCache;

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
        };

        public DepartureService(
            AppDbContext context,
            ILogService logService,
            ICurrentUserService currentUserService,
            ITourCacheService tourCache)
        {
            _context = context;
            _currentUserService = currentUserService;
            _logService = logService;
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
        /// Chuyến khởi hành ảnh hưởng tới GiaTu, SoChoDaDat, LuotDat (dùng trong list
        /// most-booked/related) và danh sách chuyến hiển thị ở trang chi tiết tour,
        /// nên cần vô hiệu hóa cả cache chi tiết lẫn cache danh sách.
        /// </summary>
        private async Task InvalidateTourCacheAsync(int tourId)
        {
            var slug = await GetTourSlugAsync(tourId);
            _tourCache.InvalidateTourDetail(tourId, slug);
            _tourCache.InvalidateLists();
        }


        private async Task<string> GenerateUniqueCodeAsync(
            bool trongNuoc,
            string diemKhoiHanh,
            string tenPhuongTien,
            DateTime ngayKhoiHanh,
            int? excludeMaChuyen = null)
        {
            var regionCode = trongNuoc ? "TN" : "NN";
            var locationCode = LocationCodeMap.GetValueOrDefault(diemKhoiHanh?.Trim() ?? "", "XX");
            var vehicleCode = VehicleCodeMap.GetValueOrDefault(tenPhuongTien?.Trim() ?? "", "XX");
            var dateCode = ngayKhoiHanh.ToString("ddMMyy");
            var prefix = $"{regionCode}-{locationCode}-{vehicleCode}-{dateCode}-";

            var countQuery = _context.ChuyenKhoiHanhs
                .Where(c => c.MaChuyenCode.StartsWith(prefix));
            if (excludeMaChuyen.HasValue)
                countQuery = countQuery.Where(c => c.MaChuyen != excludeMaChuyen.Value);

            var existingCount = await countQuery.CountAsync();

            int seq = existingCount + 1;
            string code;
            do
            {
                code = $"{prefix}{seq:D3}";
                seq++;
            }
            while (await _context.ChuyenKhoiHanhs.AnyAsync(c =>
                c.MaChuyenCode == code && (!excludeMaChuyen.HasValue || c.MaChuyen != excludeMaChuyen.Value)));

            return code;
        }

        private static bool ParseTrongNuocFromCode(string? code)
        {
            if (string.IsNullOrWhiteSpace(code)) return true;
            var prefix = code.Split('-')[0];
            return prefix != "NN";
        }

        private static int CalcTrangThai(DateTime ngayKhoiHanh, DateTime ngayKetThuc, int soLuongCho)
        {
            var now = DateTime.Now;
            if (soLuongCho <= 0) return 0;
            if (now < ngayKhoiHanh) return 1;
            if (now >= ngayKhoiHanh && now <= ngayKetThuc) return 2;
            return 3;
        }

        private async Task<string> GetTenPhuongTienAsync(int maPhuongTien)
        {
            var pt = await _context.PhuongTiens
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.MaPhuongTien == maPhuongTien);
            return pt?.TenPhuongTien ?? "";
        }

        private async Task UpdateTourGiaTuAsync(int maTour)
        {
            var now = DateTime.Now;
            var giaMin = await _context.GiaChuyens
                .Where(g =>
                    g.ChuyenKhoiHanh.MaTour == maTour &&
                    g.ChuyenKhoiHanh.NgayXoa == null &&
                    g.ChuyenKhoiHanh.NgayKhoiHanh >= now)
                .Select(g => (decimal?)g.GiaNguoiLon)
                .MinAsync() ?? 0;

            var tour = await _context.Tours.FindAsync(maTour);
            if (tour != null)
            {
                tour.GiaTu = giaMin;
                tour.NgayCapNhat = DateTime.Now;
            }
        }

        private async Task ValidateHDVAvailability(int maHDV, DateTime ngayKhoiHanh, int? excludeMaChuyen = null)
        {
            var thang = ngayKhoiHanh.Month;
            var nam = ngayKhoiHanh.Year;

            var query = _context.ChuyenKhoiHanhs
                .Where(c => c.MaHDV == maHDV
                         && c.NgayXoa == null
                         && c.NgayKhoiHanh.Month == thang
                         && c.NgayKhoiHanh.Year == nam);

            if (excludeMaChuyen.HasValue)
                query = query.Where(c => c.MaChuyen != excludeMaChuyen.Value);

            var daCoChuyen = await query.AnyAsync();
            if (daCoChuyen)
                throw new Exception($"Hướng dẫn viên đã có chuyến khởi hành khác trong tháng {thang}/{nam}, không thể thêm.");
        }

        private async Task ValidateDuplicateDepartureDate(DepartureDTO departure, int? excludeMaChuyen = null)
        {
            var query = _context.ChuyenKhoiHanhs
                .Where(x =>
                    x.MaTour == departure.MaTour &&
                    x.NgayXoa == null &&
                    x.NgayKhoiHanh.Date == departure.NgayKhoiHanh.Date);

            if (excludeMaChuyen.HasValue)
                query = query.Where(x => x.MaChuyen != excludeMaChuyen.Value);

            var exists = await query.AnyAsync();
            if (exists)
                throw new Exception($"Đã có chuyến khởi hành vào ngày {departure.NgayKhoiHanh:dd/MM/yyyy} cho tour này.");
        }

        private void ValidateSeats(DepartureDTO departure, int? existingSoChoDaDat = null)
        {
            if (departure.SoChoToiDa <= 0)
                throw new Exception("Số chỗ tối đa phải lớn hơn 0.");

            if (existingSoChoDaDat.HasValue && departure.SoChoToiDa < existingSoChoDaDat.Value)
            {
                throw new Exception(
                    $"Số chỗ tối đa ({departure.SoChoToiDa}) không thể nhỏ hơn số chỗ đã đặt ({existingSoChoDaDat.Value}).");
            }
        }


        public async Task<List<DepartureSelectDTO>> GetDeparturesForSelectAsync(int? tourId = null, string? keyword = null)
        {
            var query = _context.ChuyenKhoiHanhs
                .Include(c => c.Tour)
                .Include(c => c.NhanVien)
                .Include(c => c.PhuongTien)
                .Include(c => c.GiaChuyens)
                .Where(c => c.NgayXoa == null)
                .AsQueryable();

            var now = DateTime.Now;
            query = query.Where(c => c.NgayKhoiHanh > now && c.SoChoToiDa > c.SoChoDaDat);

            if (tourId.HasValue && tourId.Value > 0)
            {
                query = query.Where(c => c.MaTour == tourId.Value);
            }

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var lowerKey = keyword.ToLower();
                query = query.Where(c =>
                    c.MaChuyenCode.ToLower().Contains(lowerKey) ||
                    c.DiemKhoiHanh.ToLower().Contains(lowerKey) ||
                    c.DiemDen.ToLower().Contains(lowerKey) ||
                    c.Tour.TenTour.ToLower().Contains(lowerKey));
            }

            var departures = await query
                .OrderBy(c => c.NgayKhoiHanh)
                .Select(c => new DepartureSelectDTO
                {
                    MaChuyen = c.MaChuyen,
                    MaChuyenCode = c.MaChuyenCode,
                    MaTour = c.MaTour,
                    TenTour = c.Tour.TenTour,
                    DiemKhoiHanh = c.DiemKhoiHanh,
                    DiemDen = c.DiemDen,
                    NgayKhoiHanh = c.NgayKhoiHanh,
                    NgayKetThuc = c.NgayKetThuc,
                    SoChoToiDa = c.SoChoToiDa,
                    SoChoDaDat = c.SoChoDaDat,
                    SoChoConLai = c.SoChoToiDa - c.SoChoDaDat,
                    TrangThai = c.TrangThai,
                    TenHuongDanVien = c.NhanVien.HoTen,
                    TenPhuongTien = c.PhuongTien.TenPhuongTien,
                    GiaNguoiLon = c.GiaChuyens.OrderByDescending(g => g.NgayTao).Select(g => g.GiaNguoiLon).FirstOrDefault(),
                    GiaTreEm = c.GiaChuyens.OrderByDescending(g => g.NgayTao).Select(g => g.GiaTreEm).FirstOrDefault(),
                    GiaEmBe = c.GiaChuyens.OrderByDescending(g => g.NgayTao).Select(g => g.GiaEmBe).FirstOrDefault(),
                    PhuThuPhongDon = c.GiaChuyens.OrderByDescending(g => g.NgayTao).Select(g => g.PhuThuPhongDon).FirstOrDefault()
                })
                .ToListAsync();

            return departures;
        }

        public async Task<List<DepartureFullDTO>> GetByTourAsync(int maTour)
        {
            return await _context.ChuyenKhoiHanhs
                .Include(c => c.GiaChuyens)
                .Where(c => c.MaTour == maTour && c.NgayXoa == null && c.NgayKhoiHanh >= DateTime.Now)
                .OrderByDescending(c => c.NgayKhoiHanh)
                .Select(c => new DepartureFullDTO
                {
                    ChuyenKhoiHanh = new DepartureDTO
                    {
                        MaChuyen = c.MaChuyen,
                        MaHDV = c.MaHDV,
                        MaTour = c.MaTour,
                        MaPhuongTien = c.MaPhuongTien,
                        MaChuyenCode = c.MaChuyenCode,
                        DiemKhoiHanh = c.DiemKhoiHanh,
                        DiemDen = c.DiemDen,
                        NgayKhoiHanh = c.NgayKhoiHanh,
                        GioDenNoiDi = c.GioDenNoiDi,
                        NgayKetThuc = c.NgayKetThuc,
                        GioDenNoiVe = c.GioDenNoiVe,
                        SoChoToiDa = c.SoChoToiDa,
                        SoChoDaDat = c.SoChoDaDat,
                        TrangThai = c.TrangThai,
                        GhiChu = c.GhiChu
                    },
                    DanhSachGia = c.GiaChuyens.Select(g => new GiaChuyenDTO
                    {
                        GiaNguoiLon = g.GiaNguoiLon,
                        GiaTreEm = g.GiaTreEm,
                        GiaEmBe = g.GiaEmBe,
                        PhuThuPhongDon = g.PhuThuPhongDon
                    }).ToList()
                })
                .ToListAsync();
        }


        public async Task<bool> AddDepartureFullAsync(DepartureFullDTO dto) // kiểm tra lại HDV có đang trống trong tháng đó không mới  được thêm vào hướng dẫn chuyến khởi hành
        {
            var dep = dto.ChuyenKhoiHanh;

            if (dep.NgayKhoiHanh >= dep.NgayKetThuc)
                throw new Exception("Ngày khởi hành phải nhỏ hơn ngày kết thúc.");

            if (dep.NgayKhoiHanh.Date < DateTime.Today)
                throw new Exception("Ngày khởi hành không được là ngày trong quá khứ.");
            var getUserId = _currentUserService.GetUserId();
            ValidateSeats(dep);
            await ValidateHDVAvailability(getUserId, dep.NgayKhoiHanh);

            await ValidateDuplicateDepartureDate(dep);

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var tenPhuongTien = await GetTenPhuongTienAsync(dep.MaPhuongTien);
                bool TrongNuoc = true;
                var maChuyenCode = await GenerateUniqueCodeAsync(TrongNuoc, dep.DiemKhoiHanh, tenPhuongTien, dep.NgayKhoiHanh);

                var chuyen = new ChuyenKhoiHanh
                {
                    MaHDV = dep.MaHDV,
                    MaTour = dep.MaTour,
                    MaPhuongTien = dep.MaPhuongTien,
                    MaChuyenCode = maChuyenCode,
                    DiemKhoiHanh = dep.DiemKhoiHanh,
                    DiemDen = dep.DiemDen,
                    NgayKhoiHanh = dep.NgayKhoiHanh,
                    GioDenNoiDi = dep.GioDenNoiDi,
                    NgayKetThuc = dep.NgayKetThuc,
                    GioDenNoiVe = dep.GioDenNoiVe,
                    SoChoToiDa = dep.SoChoToiDa,
                    TrangThai = CalcTrangThai(dep.NgayKhoiHanh, dep.NgayKetThuc, dep.SoChoToiDa),
                    GhiChu = dep.GhiChu,
                    NgayTao = DateTime.Now,
                    NgayCapNhat = DateTime.Now
                };

                _context.ChuyenKhoiHanhs.Add(chuyen);
                await _context.SaveChangesAsync();

                if (dto.DanhSachGia?.Any() == true)
                {
                    foreach (var item in dto.DanhSachGia)
                    {
                        _context.GiaChuyens.Add(new GiaChuyen
                        {
                            Machuyen = chuyen.MaChuyen,
                            GiaNguoiLon = item.GiaNguoiLon,
                            GiaTreEm = item.GiaTreEm,
                            GiaEmBe = item.GiaEmBe,
                            PhuThuPhongDon = item.PhuThuPhongDon,
                            NgayTao = DateTime.Now,
                            NgayCapNhat = DateTime.Now
                        });
                    }
                    await _context.SaveChangesAsync();
                }

                await UpdateTourGiaTuAsync(dep.MaTour);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                await InvalidateTourCacheAsync(dep.MaTour);
                var currentAccount = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NguoiDung;

                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = currentAccount,
                    MaTaiKhoan = _currentUserService.GetUserId(),
                    Email = _currentUserService.GetEmail(),
                    TenHanhDong = ActionLogDTO.Tao,
                    TenBangTacDong = TableNameDTO.ChuyenKhoiHanh,
                    MaDoiTuong = chuyen.MaChuyen,
                    GiaTriSau = new
                    {
                        chuyen.MaChuyen,
                        chuyen.MaChuyenCode,
                        chuyen.MaTour,
                        chuyen.MaHDV,
                        chuyen.MaPhuongTien,
                        chuyen.DiemKhoiHanh,
                        chuyen.DiemDen,
                        chuyen.NgayKhoiHanh,
                        chuyen.NgayKetThuc,
                        chuyen.SoChoToiDa
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


        public async Task<DepartureFullDTO> UpdateDepartureAsync(int maChuyen, DepartureFullDTO dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var chuyen = await _context.ChuyenKhoiHanhs
                    .Include(c => c.GiaChuyens)
                    .FirstOrDefaultAsync(c => c.MaChuyen == maChuyen);

                if (chuyen == null)
                    throw new Exception($"Không tìm thấy chuyến {maChuyen}");

                var dep = dto.ChuyenKhoiHanh;
                var tourId = chuyen.MaTour;


                if (dep.NgayKhoiHanh >= dep.NgayKetThuc)
                    throw new Exception("Ngày khởi hành phải nhỏ hơn ngày kết thúc.");

                if (DateTime.Now >= dep.NgayKhoiHanh)
                    throw new Exception("Chuyến đã khởi hành hoặc đã qua, không được chỉnh sửa.");


                ValidateSeats(dep, chuyen.SoChoDaDat);
                await ValidateDuplicateDepartureDate(dep, maChuyen);
                var getUserID = _currentUserService.GetUserId();
                await ValidateHDVAvailability(getUserID, dep.NgayKhoiHanh, maChuyen);


                await ValidateDuplicateDepartureDate(dep, maChuyen);


                var tenPhuongTien = await GetTenPhuongTienAsync(dep.MaPhuongTien);
                var trongNuoc = ParseTrongNuocFromCode(chuyen.MaChuyenCode);
                var newCode = await GenerateUniqueCodeAsync(trongNuoc, dep.DiemKhoiHanh, tenPhuongTien, dep.NgayKhoiHanh, maChuyen);

                chuyen.MaChuyenCode = newCode;
                chuyen.MaHDV = dep.MaHDV;
                chuyen.MaPhuongTien = dep.MaPhuongTien;
                chuyen.DiemKhoiHanh = dep.DiemKhoiHanh;
                chuyen.DiemDen = dep.DiemDen;
                chuyen.NgayKhoiHanh = dep.NgayKhoiHanh;
                chuyen.GioDenNoiDi = dep.GioDenNoiDi;
                chuyen.NgayKetThuc = dep.NgayKetThuc;
                chuyen.GioDenNoiVe = dep.GioDenNoiVe;
                chuyen.SoChoToiDa = dep.SoChoToiDa;
                chuyen.GhiChu = dep.GhiChu;
                chuyen.NgayCapNhat = DateTime.Now;
                chuyen.TrangThai = CalcTrangThai(dep.NgayKhoiHanh, dep.NgayKetThuc, dep.SoChoToiDa);

                if (chuyen.GiaChuyens.Any())
                {
                    _context.GiaChuyens.RemoveRange(chuyen.GiaChuyens);
                }

                if (dto.DanhSachGia?.Any() == true)
                {
                    foreach (var item in dto.DanhSachGia)
                    {
                        _context.GiaChuyens.Add(new GiaChuyen
                        {
                            Machuyen = chuyen.MaChuyen,
                            GiaNguoiLon = item.GiaNguoiLon,
                            GiaTreEm = item.GiaTreEm,
                            GiaEmBe = item.GiaEmBe,
                            PhuThuPhongDon = item.PhuThuPhongDon,
                            NgayTao = DateTime.Now,
                            NgayCapNhat = DateTime.Now
                        });
                    }
                }

                await _context.SaveChangesAsync();

                await UpdateTourGiaTuAsync(tourId);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                await InvalidateTourCacheAsync(tourId);

                var currentAccount = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NguoiDung;
                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = currentAccount,
                    MaTaiKhoan = _currentUserService.GetUserId(),
                    Email = _currentUserService.GetEmail(),
                    TenHanhDong = ActionLogDTO.CapNhat,
                    TenBangTacDong = TableNameDTO.ChuyenKhoiHanh,
                    MaDoiTuong = chuyen.MaChuyen,
                    GiaTriSau = new
                    {
                        chuyen.MaChuyen,
                        chuyen.MaChuyenCode,
                        chuyen.MaHDV,
                        chuyen.MaPhuongTien,
                        chuyen.DiemKhoiHanh,
                        chuyen.NgayKhoiHanh,
                        chuyen.SoChoToiDa
                    }
                });


                return new DepartureFullDTO
                {
                    ChuyenKhoiHanh = new DepartureDTO
                    {
                        MaChuyen = chuyen.MaChuyen,
                        MaHDV = chuyen.MaHDV,
                        MaTour = chuyen.MaTour,
                        MaPhuongTien = chuyen.MaPhuongTien,
                        MaChuyenCode = chuyen.MaChuyenCode,
                        DiemKhoiHanh = chuyen.DiemKhoiHanh,
                        DiemDen = chuyen.DiemDen,
                        NgayKhoiHanh = chuyen.NgayKhoiHanh,
                        GioDenNoiDi = chuyen.GioDenNoiDi,
                        NgayKetThuc = chuyen.NgayKetThuc,
                        GioDenNoiVe = chuyen.GioDenNoiVe,
                        SoChoToiDa = chuyen.SoChoToiDa,
                        SoChoDaDat = chuyen.SoChoDaDat,
                        TrangThai = chuyen.TrangThai,
                        GhiChu = chuyen.GhiChu
                    },
                    DanhSachGia = chuyen.GiaChuyens.Select(g => new GiaChuyenDTO
                    {
                        GiaNguoiLon = g.GiaNguoiLon,
                        GiaTreEm = g.GiaTreEm,
                        GiaEmBe = g.GiaEmBe,
                        PhuThuPhongDon = g.PhuThuPhongDon
                    }).ToList()
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"[UPDATE ERROR] {ex.Message}");
                Console.WriteLine(ex.ToString());
                throw;
            }
        }


        public async Task<bool> DeleteDepartureAsync(int maChuyen)
        {
            var chuyen = await _context.ChuyenKhoiHanhs.FindAsync(maChuyen);

            if (chuyen == null)
            {
                return false;
            }

            if (chuyen.NgayXoa != null)
            {
                return true;
            }


            if (chuyen.SoChoDaDat > 0)
                throw new Exception($"Chuyến đã có {chuyen.SoChoDaDat} khách đặt, không thể xóa.");

            if (chuyen.TrangThai == 2)
                throw new Exception("Chuyến đã khởi hành, không thể xóa.");
            if (chuyen.TrangThai == 3)
                throw new Exception("Chuyến đã kết thúc, không thể xóa.");

            var tourId = chuyen.MaTour;
            var oldData = new
            {
                chuyen.MaChuyen,
                chuyen.MaChuyenCode,
                chuyen.MaTour,
                chuyen.TrangThai,
                chuyen.SoChoDaDat
            };

            chuyen.NgayXoa = DateTime.Now;

            try
            {
                if (chuyen.MaTour > 0)
                {
                    await UpdateTourGiaTuAsync(chuyen.MaTour);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[WARN] Lỗi cập nhật giá tour: {ex.Message}");
            }

            await _context.SaveChangesAsync();

            if (tourId > 0)
            {
                await InvalidateTourCacheAsync(tourId);
            }

            var currentAccount = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NguoiDung;
            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = currentAccount,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),
                TenHanhDong = ActionLogDTO.Xoa,
                TenBangTacDong = TableNameDTO.ChuyenKhoiHanh,
                MaDoiTuong = chuyen.MaChuyen,
                GiaTriTruoc = oldData,
                GiaTriSau = new { chuyen.NgayXoa }
            });

            return true;
        }

    }
}