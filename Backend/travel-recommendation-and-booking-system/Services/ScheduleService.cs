using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Schedule;
using travel_recommendation_and_booking_system.DTOs.ScheduleDetails;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class ScheduleService : IScheduleService
    {
        private readonly AppDbContext _context;

        public ScheduleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AddScheduleAsync(ScheduleDTO dto)
        {
            string fileName = "";

            if (dto.DuongDanAnh != null)
            {
                if (dto.DuongDanAnh.Length > 10 * 1024 * 1024)
                    throw new Exception("File ảnh không được vượt quá 10MB.");

                string[] permittedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
                var fileExtension = Path.GetExtension(dto.DuongDanAnh.FileName).ToLowerInvariant();
                if (!permittedExtensions.Contains(fileExtension))
                    throw new Exception("Chỉ chấp nhận file ảnh (JPG, PNG, GIF).");

                string baseName = Path.GetFileNameWithoutExtension(dto.DuongDanAnh.FileName).Replace(" ", "_");
                string timeStamp = DateTime.Now.ToString("yyyyMMddHHmmssfff");
                string uniqueId = Guid.NewGuid().ToString().Substring(0, 6);
                fileName = $"{baseName}_{timeStamp}_{uniqueId}{fileExtension}";

                string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/img/schedules");
                if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

                string path = Path.Combine(folderPath, fileName);
                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await dto.DuongDanAnh.CopyToAsync(stream);
                }
            }

            var lichTrinh = new LichTrinh
            {
                MaTour = dto.MaTour,
                TenLichTrinh = dto.TenLichTrinh,
                BuaAn = dto.BuaAn,
                SoThuTuNgay = dto.SoThuTuNgay,
                HoatDongChinh = dto.HoatDongChinh,
                LuuY = dto.LuuY,
                DuongDanAnh = fileName,
                TrangThai = true,
                NgayTao = DateTime.Now
            };

            _context.LichTrinhs.Add(lichTrinh);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<ScheduleReponseDTO>> GetByTourAsync(int maTour)
        {
            return await _context.LichTrinhs
            .AsNoTracking()
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
                LuuY = x.LuuY
            })
            .ToListAsync();
        }

        public async Task<bool> UpdateSchdeduleAsync(int maLichTrinh, ScheduleDTO dto)
        {
            var lt = await _context.LichTrinhs.FindAsync(maLichTrinh);
            if (lt == null) return false;

            lt.TenLichTrinh = dto.TenLichTrinh;
            lt.BuaAn = dto.BuaAn;
            lt.SoThuTuNgay = dto.SoThuTuNgay;
            lt.HoatDongChinh = dto.HoatDongChinh;
            lt.LuuY = dto.LuuY;
            lt.TrangThai = dto.TrangThai;
            lt.NgayCapNhat = DateTime.Now;

            if (dto.DuongDanAnh != null)
            {
                if (!string.IsNullOrEmpty(lt.DuongDanAnh))
                {
                    string oldPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/img/schedules", lt.DuongDanAnh);
                    if (File.Exists(oldPath))
                    {
                        File.Delete(oldPath);
                    }
                }

                string fileExtension = Path.GetExtension(dto.DuongDanAnh.FileName).ToLowerInvariant();
                string baseName = Path.GetFileNameWithoutExtension(dto.DuongDanAnh.FileName).Replace(" ", "_");
                string timeStamp = DateTime.Now.ToString("yyyyMMddHHmmssfff");
                string uniqueId = Guid.NewGuid().ToString().Substring(0, 6);
                string newFileName = $"{baseName}_{timeStamp}_{uniqueId}{fileExtension}";

                string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/img/schedules");
                if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

                string newPath = Path.Combine(folderPath, newFileName);
                using (var stream = new FileStream(newPath, FileMode.Create))
                {
                    await dto.DuongDanAnh.CopyToAsync(stream);
                }

                lt.DuongDanAnh = newFileName;
            }

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteScheduleAsync(int maLichTrinh)
        {
            var lt = await _context.LichTrinhs.FindAsync(maLichTrinh);
            if (lt == null || lt.NgayXoa != null || lt.TrangThai == true) return false;

            lt.NgayXoa = DateTime.Now;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> AddCTLTAsync(ScheduleDetailsDTO dto)
        {
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
            return true;
        }
        public async Task<List<ScheduleDettailsReponseDTO>> GetByLichTrinhAsync(int maLichTrinh)
        {
            return await _context.CTLichTrinhs
                .Include(x => x.DiaDiem)
                .Where(x => x.MaLichTrinh == maLichTrinh)
                .OrderBy(x => x.GioBatDau)
                .Select(x => new ScheduleDettailsReponseDTO
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

            ctlt.MaLichTrinh = dto.MaLichTrinh;
            ctlt.MaDiaDiem = dto.MaDiaDiem;
            ctlt.GioBatDau = dto.GioBatDau;
            ctlt.GioKetThuc = dto.GioKetThuc;
            ctlt.HoatDong = dto.HoatDong;

            return await _context.SaveChangesAsync() > 0;
        }
        public async Task<bool> DeleteCTLTAsync(int maCTLT)
        {
            var ctlt = await _context.CTLichTrinhs.FindAsync(maCTLT);
            if (ctlt == null) return false;

            _context.CTLichTrinhs.Remove(ctlt);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
