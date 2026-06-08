using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class ContactService: IContactService
    {
        private readonly AppDbContext _context;
        public ContactService(AppDbContext context)
        {
            _context = context;
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
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<PageDTO<ContactResponseDTO>> GetPagedContactsAsync(int pageNumber, int pageSize)
        {
            if(pageNumber < 1)
            {
                pageSize = 1;
            }
            if(pageSize < 1)
            {
                pageSize = 10;
            }

            var query = _context.LienHes.Where(l =>l.NgayXoa == null);
            int totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(l=>l.NgayTao)
                .Skip((pageNumber-1)*pageSize)
                .Take(pageSize)
                .Select(l=> new ContactResponseDTO
                {
                    MaLienHe = l.MaLienHe,
                    HoTen = l.HoTen,
                    Email = l.Email,
                    SodienThoai = l.SoDienThoai,
                    NoiDung = l.NoiDung,
                    TrangThai = l.TrangThai,
                    NgayTao = l.NgayTao
                }
                ).ToListAsync();

            return new PageDTO<ContactResponseDTO>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
    }
}
