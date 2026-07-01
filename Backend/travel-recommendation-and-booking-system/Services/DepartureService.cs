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

        public DepartureService(AppDbContext context, ILogService logService, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
            _logService = logService;
        }


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

        private static int CalcTrangThai(DateTime ngayKhoiHanh, DateTime ngayKetThuc, int soLuongCho)
        {
            var now = DateTime.Now;
            if (soLuongCho <= 0) return 0;
            if (now < ngayKhoiHanh) return 1;
            if (now >= ngayKhoiHanh && now <= ngayKetThuc) return 2;
            return 3;
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

            // Chỉ lấy chuyến chưa khởi hành và còn chỗ
            var now = DateTime.Now;
            query = query.Where(c => c.NgayKhoiHanh > now && c.SoChoToiDa > c.SoChoDaDat);

            // Lọc theo tour
            if (tourId.HasValue && tourId.Value > 0)
            {
                query = query.Where(c => c.MaTour == tourId.Value);
            }

            // Tìm kiếm theo từ khóa
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var lowerKey = keyword.ToLower();
                query = query.Where(c =>
                    c.MaChuyenCode.ToLower().Contains(lowerKey) ||
                    c.DiemKhoiHanh.ToLower().Contains(lowerKey) ||
                    c.DiemDen.ToLower().Contains(lowerKey) ||
                    c.Tour.TenTour.ToLower().Contains(lowerKey)
                );
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
        private async Task<string> GetTenPhuongTienAsync(int maPhuongTien)
        {
            var pt = await _context.PhuongTiens
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.MaPhuongTien == maPhuongTien);
            return pt?.TenPhuongTien ?? "";
        }



        public async Task<bool> AddDepartureFullAsync(DepartureFullDTO dto)
        {
            var dep = dto.ChuyenKhoiHanh;


            if (dep.NgayKhoiHanh >= dep.NgayKetThuc)
                throw new Exception("Ngày khởi hành phải nhỏ hơn ngày kết thúc.");

            if (dep.NgayKhoiHanh.Date < DateTime.Today)
                throw new Exception("Ngày khởi hành không được là ngày trong quá khứ.");

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {

                var tenPhuongTien = await GetTenPhuongTienAsync(dep.MaPhuongTien);
                bool TrongNuoc = true;
                var maChuyenCode = await GenerateUniqueCodeAsync(TrongNuoc,dep.DiemKhoiHanh, tenPhuongTien, dep.NgayKhoiHanh);

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
                var currentAccount = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NguoiDung;
                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = currentAccount,

                    MaTaiKhoan = _currentUserService.GetUserId() ?? 0,
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


        public async Task<bool> UpdateDepartureAsync(int maChuyen, DepartureFullDTO dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {

                var chuyen = await _context.ChuyenKhoiHanhs
                    .Include(c => c.GiaChuyens)
                    .FirstOrDefaultAsync(c => c.MaChuyen == maChuyen);
                if (chuyen == null)
                    return false;

                if (DateTime.Now >= chuyen.NgayKhoiHanh)
                {
                    throw new Exception(
                        "Chuyến đã khởi hành, không được phép chỉnh sửa."
                    );
                }
                // Thêm check này sau khi lấy được chuyen, trước khi update
                if (chuyen.SoChoDaDat > 0)
                    throw new Exception("Chuyến đã có khách đặt, không được phép chỉnh sửa.");

                if (chuyen.TrangThai == 3)
                    throw new Exception("Chuyến đã kết thúc, không được phép chỉnh sửa.");
                var oldData = new
                {
                    chuyen.MaHDV,
                    chuyen.MaPhuongTien,
                    chuyen.DiemKhoiHanh,
                    chuyen.DiemDen,
                    chuyen.NgayKhoiHanh,
                    chuyen.GioDenNoiDi,
                    chuyen.NgayKetThuc,
                    chuyen.GioDenNoiVe,
                    chuyen.SoChoDaDat,
                    chuyen.SoChoToiDa,
                    chuyen.TrangThai,
                    chuyen.GhiChu
                };
                if (chuyen == null) return false;

                var dep = dto.ChuyenKhoiHanh;

                if (dep.NgayKhoiHanh >= dep.NgayKetThuc)
                    throw new Exception("Ngày khởi hành phải nhỏ hơn ngày kết thúc.");


                chuyen.MaHDV = dep.MaHDV;
                chuyen.MaPhuongTien = dep.MaPhuongTien;
                chuyen.DiemKhoiHanh = dep.DiemKhoiHanh;
                chuyen.DiemDen = dep.DiemDen;
                chuyen.NgayKhoiHanh = dep.NgayKhoiHanh;
                chuyen.GioDenNoiDi = dep.GioDenNoiDi;
                chuyen.NgayKetThuc = dep.NgayKetThuc;
                chuyen.GioDenNoiVe = dep.GioDenNoiVe;
                chuyen.SoChoToiDa = dep.SoChoToiDa;
                chuyen.SoChoDaDat = dep.SoChoDaDat ?? 0;
                chuyen.TrangThai = CalcTrangThai(dep.NgayKhoiHanh, dep.NgayKetThuc, dep.SoChoToiDa);
                chuyen.GhiChu = dep.GhiChu;
                chuyen.NgayCapNhat = DateTime.Now;


                _context.GiaChuyens.RemoveRange(chuyen.GiaChuyens);
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
                }

                await _context.SaveChangesAsync();
                await UpdateTourGiaTuAsync(chuyen.MaTour);
                await _context.SaveChangesAsync();
                var currentAccount = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NguoiDung;
                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = currentAccount,

                    MaTaiKhoan = _currentUserService.GetUserId() ?? 0,
                    Email = _currentUserService.GetEmail(),
                    TenHanhDong = ActionLogDTO.CapNhat,

                    TenBangTacDong = TableNameDTO.ChuyenKhoiHanh,

                    MaDoiTuong = chuyen.MaChuyen,

                    GiaTriTruoc = oldData,

                    GiaTriSau = new
                    {
                        chuyen.MaHDV,
                        chuyen.MaPhuongTien,
                        chuyen.DiemKhoiHanh,
                        chuyen.DiemDen,
                        chuyen.NgayKhoiHanh,
                        chuyen.NgayKetThuc,
                        chuyen.SoChoToiDa,
                        chuyen.TrangThai,
                        chuyen.GhiChu
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

        public async Task<bool> DeleteDepartureAsync(int maChuyen)
        {
            var chuyen = await _context.ChuyenKhoiHanhs.FindAsync(maChuyen);

            // Kiểm tra nếu không tìm thấy trong Database
            if (chuyen == null)
            {
                // Log ra để kiểm tra xem ID gửi lên có tồn tại trong DB thật không
                Console.WriteLine($"[DELETE ERROR] Không tìm thấy chuyenKhoiHanh nào có MaChuyen = {maChuyen}");
                return false;
            }

            // Nếu đã xóa mềm trước đó rồi thì báo thành công luôn thay vì trả về 404 gây hiểu lầm cho Frontend
            if (chuyen.NgayXoa != null)
            {
                return true;
            }

            if (chuyen.TrangThai == 2) throw new Exception("Chuyến đã khởi hành, không thể xóa.");
            if (chuyen.TrangThai == 3) throw new Exception("Chuyến đã kết thúc, không thể xóa.");

            var oldData = new
            {
                chuyen.MaChuyen,
                chuyen.MaChuyenCode,
                chuyen.MaTour,
                chuyen.TrangThai
            };

            // Thực hiện xóa mềm
            chuyen.NgayXoa = DateTime.Now;

            // Bọc Try-Catch để tránh việc MaTour = 0 làm crash cả hàm xóa
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
                // Vẫn tiếp tục cho phép xóa chuyến dù tính toán giá tour gặp lỗi dữ liệu liên kết
            }

            await _context.SaveChangesAsync();

            // Ghi Log hệ thống
            var currentAccount = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NguoiDung;
            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = currentAccount,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId() ?? 0,
                TenHanhDong = ActionLogDTO.Xoa,
                TenBangTacDong = TableNameDTO.ChuyenKhoiHanh,
                MaDoiTuong = chuyen.MaChuyen,
                GiaTriTruoc = oldData,
                GiaTriSau = new { chuyen.NgayXoa }
            });

            return true;
        }
        private async Task<bool> HasStartedDepartureAsync(int maTour)
        {
            return await _context.ChuyenKhoiHanhs
                .AnyAsync(x =>
                    x.MaTour == maTour &&
                    x.NgayXoa == null &&
                    (x.TrangThai == 2 || x.TrangThai == 3));
        }
        private async Task UpdateTourGiaTuAsync(int maTour)
        {
            var now = DateTime.Now;
            var giaMin = await _context.GiaChuyens
             .Where(g =>
                 g.ChuyenKhoiHanh.MaTour == maTour &&
                 g.ChuyenKhoiHanh.NgayXoa == null &&
                 g.ChuyenKhoiHanh.NgayKhoiHanh >= now) // <-- THÊM ĐIỀU KIỆN NÀY
             .Select(g => (decimal?)g.GiaNguoiLon)
             .MinAsync() ?? 0;

            var tour = await _context.Tours.FindAsync(maTour);
            if (tour != null)
            {
                tour.GiaTu = giaMin;
                tour.NgayCapNhat = DateTime.Now;
            }
        }
    }
}