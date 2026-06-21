using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Departure;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace Services
{
    public class DepartureService : IDepartureService
    {
        private readonly AppDbContext _context;
        public DepartureService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AddDepartureFullAsync(DepartureFullDTO dto)
        {
            var isCodeExisted = await _context.ChuyenKhoiHanhs
            .AnyAsync(c => c.MaChuyenCode.Trim().ToLower() == dto.ChuyenKhoiHanh.MaChuyenCode.Trim().ToLower());
            if (isCodeExisted)
            {
                throw new Exception("Mã chuyến khởi hành đã tồn tại trong hệ thống.");
            }

            if (dto.ChuyenKhoiHanh.NgayKhoiHanh >= dto.ChuyenKhoiHanh.NgayKetThuc)
            {
                throw new Exception("Ngày khởi hành phải nhỏ hơn ngày kết thúc.");
            }

            if (dto.ChuyenKhoiHanh.NgayKhoiHanh < DateTime.Now.Date)
            {
                throw new Exception("Ngày khởi hành không được là ngày trong quá khứ.");
            }
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                int trangThai;

                if (dto.ChuyenKhoiHanh.NgayKhoiHanh.Date > DateTime.Now.Date)
                {
                    trangThai = 3; // Sắp khởi hành
                }
                else if (
                    dto.ChuyenKhoiHanh.NgayKhoiHanh.Date == DateTime.Now.Date
                )
                {
                    trangThai = 2; // Đang khởi hành
                }
                else
                {
                    trangThai = 1; // Đã khởi hành hoặc đã kết thúc
                }
                var chuyen = new ChuyenKhoiHanh
                {
                    MaHDV = dto.ChuyenKhoiHanh.MaHDV,
                    MaTour = dto.ChuyenKhoiHanh.MaTour,
                    MaPhuongTien = dto.ChuyenKhoiHanh.MaPhuongTien,
                    MaChuyenCode = dto.ChuyenKhoiHanh.MaChuyenCode,
                    //TenChuyen = dto.ChuyenKhoiHanh.TenChuyen,
                    DiemKhoiHanh = dto.ChuyenKhoiHanh.DiemKhoiHanh,
                    DiemDen = dto.ChuyenKhoiHanh.DiemDen,
                    NgayKhoiHanh = dto.ChuyenKhoiHanh.NgayKhoiHanh,
                    GioDenNoiDi = dto.ChuyenKhoiHanh.GioDenNoiDi,
                    NgayKetThuc = dto.ChuyenKhoiHanh.NgayKetThuc,
                    GioDenNoiVe = dto.ChuyenKhoiHanh.GioDenNoiVe,
                    SoLuongCho = dto.ChuyenKhoiHanh.SoLuongCho,
                    TrangThai = trangThai,
                    GhiChu = dto.ChuyenKhoiHanh.GhiChu,
                    NgayTao = DateTime.Now,
                    NgayCapNhat = DateTime.Now
                };

                _context.ChuyenKhoiHanhs.Add(chuyen);
                await _context.SaveChangesAsync();

                if (dto.DanhSachGia != null && dto.DanhSachGia.Any())
                {
                    foreach (var item in dto.DanhSachGia)
                    {
                        var gia = new GiaChuyen
                        {
                            Machuyen = chuyen.MaChuyen,
                            HangKhachSan = item.HangKhachSan,
                            GiaNguoiLon = item.GiaNguoiLon,
                            GiaTreEm = item.GiaTreEm,
                            GiaEmBe = item.GiaEmBe,
                            PhuThuPhongDon = item.PhuThuPhongDon,
                            NgayTao = DateTime.Now,
                            NgayCapNhat = DateTime.Now
                        };
                        _context.GiaChuyens.Add(gia);
                    }
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();
                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return false;
            }
        }

        public async Task<bool> UpdateDepartureAsync(int maChuyen, DepartureFullDTO dto)
        {
            Console.WriteLine(
            $"UPDATE maChuyen = {maChuyen}"
            );
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var chuyen = await _context.ChuyenKhoiHanhs
                    .Include(c => c.GiaChuyens)
                    .FirstOrDefaultAsync(c => c.MaChuyen == maChuyen);

                if (chuyen == null) return false;
                if (dto.ChuyenKhoiHanh.NgayKhoiHanh >= dto.ChuyenKhoiHanh.NgayKetThuc)
                {
                    throw new Exception("Ngày khởi hành phải nhỏ hơn ngày kết thúc.");
                }
                int trangThai;

                if (dto.ChuyenKhoiHanh.NgayKhoiHanh.Date > DateTime.Now.Date)
                {
                    trangThai = 3; // Sắp khởi hành
                }
                else if (dto.ChuyenKhoiHanh.NgayKhoiHanh.Date == DateTime.Now.Date)
                {
                    trangThai = 2; // Đang khởi hành
                }
                else
                {
                    trangThai = 1; // Đã khởi hành / kết thúc
                }
                var isCodeExisted = await _context.ChuyenKhoiHanhs
                    .AnyAsync(x =>
                        x.MaChuyen != maChuyen &&
                        x.MaChuyenCode.Trim().ToLower() ==
                        dto.ChuyenKhoiHanh.MaChuyenCode.Trim().ToLower());

                if (isCodeExisted)
                {
                    throw new Exception("Mã chuyến khởi hành đã tồn tại.");
                }
                chuyen.MaHDV = dto.ChuyenKhoiHanh.MaHDV;
                chuyen.MaPhuongTien = dto.ChuyenKhoiHanh.MaPhuongTien;
                chuyen.MaChuyenCode = dto.ChuyenKhoiHanh.MaChuyenCode;
                //chuyen.TenChuyen = dto.ChuyenKhoiHanh.TenChuyen;
                chuyen.DiemKhoiHanh = dto.ChuyenKhoiHanh.DiemKhoiHanh;
                chuyen.DiemDen = dto.ChuyenKhoiHanh.DiemDen;
                chuyen.NgayKhoiHanh = dto.ChuyenKhoiHanh.NgayKhoiHanh;
                chuyen.GioDenNoiDi = dto.ChuyenKhoiHanh.GioDenNoiDi;
                chuyen.NgayKetThuc = dto.ChuyenKhoiHanh.NgayKetThuc;
                chuyen.GioDenNoiVe = dto.ChuyenKhoiHanh.GioDenNoiVe;
                chuyen.SoLuongCho = dto.ChuyenKhoiHanh.SoLuongCho;
                chuyen.TrangThai = trangThai;
                chuyen.GhiChu = dto.ChuyenKhoiHanh.GhiChu;
                chuyen.NgayCapNhat = DateTime.Now;

                _context.GiaChuyens.RemoveRange(chuyen.GiaChuyens);
                await _context.SaveChangesAsync();

                foreach (var item in dto.DanhSachGia)
                {
                    var giaMoi = new GiaChuyen
                    {
                        Machuyen = chuyen.MaChuyen,
                        HangKhachSan = item.HangKhachSan,
                        GiaNguoiLon = item.GiaNguoiLon,
                        GiaTreEm = item.GiaTreEm,
                        GiaEmBe = item.GiaEmBe,
                        PhuThuPhongDon = item.PhuThuPhongDon,
                        NgayTao = DateTime.Now,
                        NgayCapNhat = DateTime.Now
                    };
                    _context.GiaChuyens.Add(giaMoi);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new Exception(
                    $"UpdateDepartureAsync Error: {ex.Message}"
                );
            }
        }

        public async Task<List<DepartureFullDTO>> GetByTourAsync(int maTour)
        {
            var list = await _context.ChuyenKhoiHanhs
                .Include(c => c.GiaChuyens)
                .Where(c => c.MaTour == maTour && c.NgayXoa == null && c.NgayKhoiHanh >= DateTime.Now)
                .OrderByDescending(c => c.NgayKhoiHanh)
                .Select(c => new DepartureFullDTO
                {
                    ChuyenKhoiHanh = new DepartureDTO
                    {
                        MaHDV = c.MaHDV,
                        MaTour = c.MaTour,
                        MaPhuongTien = c.MaPhuongTien,
                        MaChuyenCode = c.MaChuyenCode,
                        //TenChuyen = c.TenChuyen,
                        DiemKhoiHanh = c.DiemKhoiHanh,
                        DiemDen = c.DiemDen,
                        NgayKhoiHanh = c.NgayKhoiHanh,
                        GioDenNoiDi = c.GioDenNoiDi,
                        NgayKetThuc = c.NgayKetThuc,
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
                })
                .ToListAsync();

            return list;
        }

        public async Task<bool> DeleteDepartureAsync(int maChuyen)
        {
            var chuyen = await _context.ChuyenKhoiHanhs.FindAsync(maChuyen);
            if (chuyen == null || chuyen.NgayXoa != null) return false;

            chuyen.NgayXoa = DateTime.Now;
            return await _context.SaveChangesAsync() > 0;
        }


    }
}
