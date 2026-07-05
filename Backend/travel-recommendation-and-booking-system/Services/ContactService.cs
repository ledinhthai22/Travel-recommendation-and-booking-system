using DTOs.Contact;
using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.DTOs.LogSystem;
using travel_recommendation_and_booking_system.DTOs.Notifications;   
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class ContactService : IContactService
    {
        private readonly AppDbContext _context;
        private readonly ILogService _logService;
        private readonly ICurrentUserService _currentUserService;
        private readonly INotificationService _notificationService;  

        public ContactService(
            AppDbContext context,
            ILogService logService,
            ICurrentUserService currentUserService,
            INotificationService notificationService)   
        {
            _context = context;
            _logService = logService;
            _currentUserService = currentUserService;
            _notificationService = notificationService;
        }

        public async Task<bool> SendContactAsync(ContactDTO contact)
        {
            try
            {
                var lienhe = new LienHe
                {
                    HoTen = contact.HoTen,
                    Email = contact.Email,
                    SoDienThoai = contact.SoDienThoai,
                    NoiDung = contact.NoiDung,
                    NgayTao = DateTime.Now,
                    TrangThai = false
                };

                _context.LienHes.Add(lienhe);
                await _context.SaveChangesAsync();

                var staffIds = await _context.NhanViens
                    .Where(x => x.NgayXoa == null)
                    .Select(x => x.MaNhanVien)
                    .ToListAsync();

                await _notificationService.CreateForStaffsAsync(
                    staffIds,
                    new CreateNotificationDTO
                    {
                        TieuDe = "Liên hệ mới",
                        NoiDung = $"Khách hàng {contact.HoTen} vừa gửi liên hệ.",
                        LoaiThongBao = 1, // Contact
                        LinkChiTiet = "/Quan-ly/Lien-he"
                    });

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<PageDTO<ContactResponseDTO>> GetPagedContactsAsync(int pageNumber, int pageSize, string? key, bool? status)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;

            var query = _context.LienHes.Where(l => l.NgayXoa == null).AsNoTracking();

            if (status.HasValue)
            {
                query = query.Where(l => l.TrangThai == status.Value);
            }

            if (!string.IsNullOrWhiteSpace(key))
            {
                var lowerKey = key.ToLower();
                query = query.Where(l => l.HoTen.ToLower().Contains(lowerKey)
                                      || l.Email.ToLower().Contains(lowerKey)
                                      || l.NoiDung.ToLower().Contains(lowerKey));
            }

            int totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(l => l.NgayTao)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(l => new ContactResponseDTO
                {
                    MaLienHe = l.MaLienHe,
                    HoTen = l.HoTen,
                    Email = l.Email,
                    SodienThoai = l.SoDienThoai,
                    NoiDung = l.NoiDung,
                    TrangThai = l.TrangThai,
                    NgayTao = l.NgayTao
                })
                .ToListAsync();

            return new PageDTO<ContactResponseDTO>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<bool> SoftDeleteContactAsync(int id)
        {
            var contact = await _context.LienHes.FindAsync(id);

            if (contact == null || contact.NgayXoa != null || contact.TrangThai == false)
            {
                return false;
            }

            contact.NgayXoa = DateTime.Now;
            _context.LienHes.Update(contact);
            await _context.SaveChangesAsync();

            var currentAccount = _currentUserService.GetUserId() == 1
                ? AccountTypeDTO.QuanTriVien
                : AccountTypeDTO.NguoiDung;

            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = currentAccount,
                MaTaiKhoan = _currentUserService.GetUserId(),
                Email = _currentUserService.GetEmail(),
                TenHanhDong = ActionLogDTO.Xoa,
                TenBangTacDong = "LienHe",
                MaDoiTuong = contact.MaLienHe,
                GiaTriTruoc = new
                {
                    contact.Email,
                    contact.HoTen,
                    contact.SoDienThoai,
                    contact.NoiDung
                }
            });

            return true;
        }

        public async Task<ContactResponseDTO?> GetContactByIdAsync(int id)
        {
            var contact = await _context.LienHes.FirstOrDefaultAsync(l => l.MaLienHe == id && l.NgayXoa == null);
            if (contact == null)
            {
                return null;
            }

            if (!contact.TrangThai)
            {
                contact.TrangThai = true;
                _context.LienHes.Update(contact);
                await _context.SaveChangesAsync();
            }

            return new ContactResponseDTO
            {
                MaLienHe = contact.MaLienHe,
                HoTen = contact.HoTen,
                Email = contact.Email,
                SodienThoai = contact.SoDienThoai,
                NoiDung = contact.NoiDung,
                TrangThai = contact.TrangThai,
                NgayTao = contact.NgayTao
            };
        }
    }
}