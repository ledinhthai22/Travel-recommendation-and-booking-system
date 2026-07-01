using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.DTOs.LogSystem;
using travel_recommendation_and_booking_system.DTOs.Promotion;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class PromotionService : IPromotionService
    {
        private readonly AppDbContext _context;
        private readonly ILogService _logService;
        private readonly ICurrentUserService _currentUserService;
        public PromotionService(AppDbContext context, ILogService logService, ICurrentUserService currentUserService)
        {
            _context = context;
            _logService = logService;
            _currentUserService = currentUserService;
        }
        public async Task<PageDTO<PromotionResponseDTO>> GetPagedPromotionsAsync(int pageNumber, int pageSize, PromotionDTO promotion)
        {
            if (pageNumber < 1)
                pageNumber = 1;

            if (pageSize < 1)
                pageSize = 10;

            var query = _context.UuDais
            .Where(x => x.NgayXoa == null)
            .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(promotion?.MaCode) || !string.IsNullOrWhiteSpace(promotion?.TenUuDai))
            {
                var keyword = (promotion?.MaCode ?? promotion?.TenUuDai)?.Trim().ToLower();

                query = query.Where(x =>
                    x.MaCode.ToLower().Contains(keyword) ||
                    x.TenUuDai.ToLower().Contains(keyword)
                );
            }


            if (promotion!.TrangThai != null)
            {
                query = query.Where(x => x.TrangThai == promotion.TrangThai);
            }



            int totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(x => x.NgayTao)
                .ThenBy(x => x.MaUuDai)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new PromotionResponseDTO
                {
                    MaUuDai = x.MaUuDai,
                    MaCode = x.MaCode,
                    TenUuDai = x.TenUuDai,
                    PhanTramGiam = x.PhanTramGiam,
                    DieuKienApDung = x.DieuKienApDung,
                    NgayBatDau = x.NgayBatDau,
                    NgayHetHan = x.NgayHetHan,
                    SoLuongToiDa = x.SoLuongToiDa,
                    TrangThai = x.TrangThai,
                    NgayTao = x.NgayTao
                })
                .ToListAsync();
            return new PageDTO<PromotionResponseDTO>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
        public async Task<PromotionResponseDTO?> GetPromotionByIdAsync(int id)
        {
            if (id <= 0)
            {
                return null;
            }

            var promotion = await _context.UuDais.AsNoTracking()
                .Where(n => n.MaUuDai == id && n.NgayXoa == null)
                .Select(x => new PromotionResponseDTO
                {
                    MaUuDai = x.MaUuDai,
                    MaCode = x.MaCode,
                    TenUuDai = x.TenUuDai,
                    PhanTramGiam = x.PhanTramGiam,
                    DieuKienApDung = x.DieuKienApDung,
                    NgayBatDau = x.NgayBatDau,
                    NgayHetHan = x.NgayHetHan,
                    SoLuongToiDa = x.SoLuongToiDa,
                    TrangThai = x.TrangThai,
                    NgayTao = x.NgayTao
                })
                .FirstOrDefaultAsync();
            return promotion;
        }
        public async Task<PromotionResponseDTO> CreateAsync(PromotionDTO promotion)
        {
            var now = DateTime.Now;

            if (promotion.NgayBatDau >= promotion.NgayHetHan)
            {
                throw new Exception("Ngày bắt đầu phải nhỏ hơn ngày hết hạn.");
            }

            if (promotion.NgayHetHan.ToUniversalTime() <= now)
            {
                throw new Exception("Ngày hết hạn phải lớn hơn thời điểm hiện tại.");
            }
            var existedCode = await _context.UuDais.AnyAsync(x => x.MaCode == promotion.MaCode && x.NgayXoa == null && x.TrangThai != 4);

            if (existedCode)
            {
                throw new Exception("Mã khuyến mãi đã tồn tại.");
            }

            var newPromotion = new UuDai
            {
                MaCode = promotion.MaCode,
                TenUuDai = promotion.TenUuDai,
                PhanTramGiam = promotion.PhanTramGiam,
                DieuKienApDung = promotion.DieuKienApDung,
                NgayBatDau = promotion.NgayBatDau,
                NgayHetHan = promotion.NgayHetHan,
                SoLuongToiDa = promotion.SoLuongToiDa,
                NgayTao = now
            };

            if (now < promotion.NgayBatDau)
            {
                newPromotion.TrangThai = 1; // Chờ kích hoạt
            }
            else if (now >= promotion.NgayHetHan)
            {
                newPromotion.TrangThai = 4; // Hết hạn
            }
            else
            {
                newPromotion.TrangThai = 2; // Đang hoạt động
            }

            _context.UuDais.Add(newPromotion);
            await _context.SaveChangesAsync();
            var currentAccount = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NguoiDung;
            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = currentAccount,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),

                TenHanhDong = ActionLogDTO.Tao,

                TenBangTacDong = TableNameDTO.UuDai,

                MaDoiTuong = newPromotion.MaUuDai,

                GiaTriSau = new
                {
                    newPromotion.MaCode,
                    newPromotion.TenUuDai,
                    newPromotion.PhanTramGiam,
                    newPromotion.NgayBatDau,
                    newPromotion.NgayHetHan,
                    newPromotion.SoLuongToiDa,
                    newPromotion.TrangThai
                }
            });
            return new PromotionResponseDTO
            {
                MaUuDai = newPromotion.MaUuDai,
                MaCode = newPromotion.MaCode,
                TenUuDai = newPromotion.TenUuDai,
                PhanTramGiam = newPromotion.PhanTramGiam,
                DieuKienApDung = newPromotion.DieuKienApDung,
                NgayBatDau = newPromotion.NgayBatDau,
                NgayHetHan = newPromotion.NgayHetHan,
                SoLuongToiDa = newPromotion.SoLuongToiDa,
                TrangThai = newPromotion.TrangThai,
                NgayTao = newPromotion.NgayTao,
                NgayCapNhat = newPromotion.NgayCapNhat
            };
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var promotion = await _context.UuDais.FindAsync(id);

            if (promotion == null)
            {
                throw new Exception("Không tìm thấy chương trình ưu đãi.");
            }

            if (promotion.TrangThai != 4 && promotion.TrangThai != 1)
            {
                throw new Exception("Chỉ được phép xóa các ưu đãi chờ kích hoạt hoặc hết hạn");
            }
            var oldData = new
            {
                promotion.MaUuDai,
                promotion.MaCode,
                promotion.TenUuDai,
                promotion.SoLuongToiDa,
                promotion.TrangThai
            };
            promotion.NgayXoa = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            var currentAccount = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NguoiDung;
            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = currentAccount,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),

                TenHanhDong = ActionLogDTO.Xoa,

                TenBangTacDong = TableNameDTO.UuDai,

                MaDoiTuong = promotion.MaUuDai,

                GiaTriTruoc = oldData,

                GiaTriSau = new
                {
                    promotion.NgayXoa
                }
            });

            return true;
        }
        public async Task<PromotionResponseDTO?> UpdateAsync(int id, PromotionDTO promotion)
        {
            var existedPromotion = await _context.UuDais
                .FirstOrDefaultAsync(x => x.MaUuDai == id && x.NgayXoa == null);

            if (existedPromotion == null)
            {
                throw new Exception("Không tìm thấy chương trình ưu đãi.");
            }

            if (existedPromotion.TrangThai == 4)
            {
                throw new Exception("Không thể cập nhật ưu đãi đã hết hạn.");
            }
            var now = DateTime.Now;

            if (promotion.NgayBatDau >= promotion.NgayHetHan)
            {
                throw new Exception(
                    "Ngày bắt đầu phải nhỏ hơn ngày hết hạn."
                );
            }

            if (promotion.NgayHetHan <= now)
            {
                throw new Exception(
                    "Ngày hết hạn phải lớn hơn thời điểm hiện tại."
                );
            }
            var oldData = new
            {
                existedPromotion.MaCode,
                existedPromotion.TenUuDai,
                existedPromotion.PhanTramGiam,
                existedPromotion.DieuKienApDung,
                existedPromotion.NgayBatDau,
                existedPromotion.NgayHetHan,
                existedPromotion.SoLuongToiDa,
                existedPromotion.TrangThai
            };
            var duplicateCode = await _context.UuDais
                .AnyAsync(x =>
                    x.MaCode == promotion.MaCode
                    && x.MaUuDai != id
                    && x.NgayXoa == null);

            if (duplicateCode)
            {
                throw new Exception("Mã khuyến mãi đã tồn tại.");
            }
            existedPromotion.MaCode = promotion.MaCode;
            existedPromotion.TenUuDai = promotion.TenUuDai;
            existedPromotion.PhanTramGiam = promotion.PhanTramGiam;
            existedPromotion.DieuKienApDung = promotion.DieuKienApDung;
            existedPromotion.NgayBatDau = promotion.NgayBatDau;
            existedPromotion.NgayHetHan = promotion.NgayHetHan;
            existedPromotion.SoLuongToiDa = promotion.SoLuongToiDa;
            existedPromotion.NgayCapNhat = DateTime.UtcNow;


            if (existedPromotion.TrangThai != 3)
            {
                if (now < existedPromotion.NgayBatDau)
                {
                    existedPromotion.TrangThai = 1;
                }
                else if (now >= existedPromotion.NgayHetHan)
                {
                    existedPromotion.TrangThai = 4;
                }
                else
                {
                    existedPromotion.TrangThai = 2;
                }
            }

            await _context.SaveChangesAsync();
            var currentAccount = _currentUserService.GetUserId() == 1? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NguoiDung;
            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = currentAccount,
                Email = _currentUserService.GetEmail(),
                MaTaiKhoan = _currentUserService.GetUserId(),

                TenHanhDong = ActionLogDTO.CapNhat,

                TenBangTacDong = TableNameDTO.UuDai,

                MaDoiTuong = existedPromotion.MaUuDai,

                GiaTriTruoc = oldData,

                GiaTriSau = new
                {
                    existedPromotion.MaCode,
                    existedPromotion.TenUuDai,
                    existedPromotion.PhanTramGiam,
                    existedPromotion.DieuKienApDung,
                    existedPromotion.NgayBatDau,
                    existedPromotion.NgayHetHan,
                    existedPromotion.SoLuongToiDa,
                    existedPromotion.TrangThai
                }
            });
            return new PromotionResponseDTO
            {
                MaUuDai = existedPromotion.MaUuDai,
                MaCode = existedPromotion.MaCode,
                TenUuDai = existedPromotion.TenUuDai,
                PhanTramGiam = existedPromotion.PhanTramGiam,
                DieuKienApDung = existedPromotion.DieuKienApDung,
                NgayBatDau = existedPromotion.NgayBatDau,
                NgayHetHan = existedPromotion.NgayHetHan,
                SoLuongToiDa = existedPromotion.SoLuongToiDa,
                TrangThai = existedPromotion.TrangThai,
                NgayTao = existedPromotion.NgayTao,
                NgayCapNhat = existedPromotion.NgayCapNhat
            };
        }
        public async Task<bool> ChangeStatusAsync(int id, bool isActive)
        {
            var promotion = await _context.UuDais
                .FirstOrDefaultAsync(x =>
                    x.MaUuDai == id &&
                    x.NgayXoa == null);

            if (promotion == null)
            {
                throw new Exception("Không tìm thấy chương trình ưu đãi.");
            }

            if (promotion.TrangThai == 4)
            {
                throw new Exception("Ưu đãi đã hết hạn.");
            }

            if (promotion.TrangThai == 1)
            {
                throw new Exception("Ưu đãi chưa đến ngày kích hoạt.");
            }

            if (!isActive)
            {
                if (promotion.TrangThai != 2)
                {
                    throw new Exception(
                        "Chỉ ưu đãi đang hoạt động mới được ngưng."
                    );
                }

                promotion.TrangThai = 3;
            }
            else
            {
                if (promotion.TrangThai != 3)
                {
                    throw new Exception(
                        "Chỉ ưu đãi đang ngưng mới được kích hoạt."
                    );
                }

                promotion.TrangThai = 2;
            }
            var oldData = new
            {
                promotion.TrangThai
            };

            promotion.NgayCapNhat = DateTime.Now;

            await _context.SaveChangesAsync();
            var currentAccount = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien : AccountTypeDTO.NguoiDung;
            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = currentAccount,

                MaTaiKhoan = _currentUserService.GetUserId(),
                Email = _currentUserService.GetEmail(),
                TenHanhDong = ActionLogDTO.CapNhat,

                TenBangTacDong = TableNameDTO.UuDai,

                MaDoiTuong = promotion.MaUuDai,

                GiaTriTruoc = oldData,

                GiaTriSau = new
                {
                    promotion.TrangThai
                }
            });

            return true;
        }
        public async Task<List<PromotionResponseDTO>> GetPromotionsForSelectAsync(int? status = null)
        {
            var query = _context.UuDais
                .Where(p => p.NgayXoa == null)
                .AsQueryable();

            if (status.HasValue)
            {
                query = query.Where(p => p.TrangThai == status.Value);
            }
            else
            {

                query = query.Where(p => p.TrangThai == 1);
            }

            var today = DateTime.Now.Date;
            query = query.Where(p => p.NgayBatDau <= today && p.NgayHetHan >= today);

            var promotions = await query
                .OrderByDescending(p => p.NgayTao)
                .Select(p => new PromotionResponseDTO
                {
                    MaUuDai = p.MaUuDai,     
                    MaCode = p.MaCode,
                })
                .ToListAsync();

            return promotions;
        }
    }

}
