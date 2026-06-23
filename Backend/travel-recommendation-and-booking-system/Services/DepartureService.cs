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
            while (await _context.ChuyenKhoiHanhs
                       .AnyAsync(c => c.MaChuyenCode == code));

            return code;
        }

        private static int CalcTrangThai(DateTime ngayKhoiHanh, DateTime ngayKetThuc, int soLuongCho)
        {
            if (soLuongCho <= 0) return 0; // Hết chỗ

            var today = DateTime.Today;
            if (today < ngayKhoiHanh.Date) return 3; // Sắp khởi hành
            if (today <= ngayKetThuc.Date) return 2; // Đang khởi hành
            return 1;                                  // Đã kết thúc
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

                var trongNuoc = await GetTrongNuocAsync(dep.MaTour);
                var tenPhuongTien = await GetTenPhuongTienAsync(dep.MaPhuongTien);
                var maChuyenCode = await GenerateUniqueCodeAsync(
                    trongNuoc, dep.DiemKhoiHanh, tenPhuongTien, dep.NgayKhoiHanh);

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
                            HangKhachSan = item.HangKhachSan,
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

                await transaction.CommitAsync();
                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = AccountTypeDTO.NhanVien,

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
                            HangKhachSan = item.HangKhachSan,
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
                await transaction.CommitAsync();
                await _logService.LoggingAsync(new LogDTO
                {
                    LoaiTaiKhoan = AccountTypeDTO.NhanVien,

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
                        HangKhachSan = g.HangKhachSan,
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

            if (chuyen == null || chuyen.NgayXoa != null)
                return false;

            var oldData = new
            {
                chuyen.MaChuyen,
                chuyen.MaChuyenCode,
                chuyen.MaTour,
                chuyen.TrangThai
            };

            chuyen.NgayXoa = DateTime.Now;

            await _context.SaveChangesAsync();

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NhanVien,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId() ?? 0,

                TenHanhDong = ActionLogDTO.Xoa,

                TenBangTacDong = TableNameDTO.ChuyenKhoiHanh,

                MaDoiTuong = chuyen.MaChuyen,

                GiaTriTruoc = oldData,

                GiaTriSau = new
                {
                    chuyen.NgayXoa
                }
            });

            return true;
        }
    }
}