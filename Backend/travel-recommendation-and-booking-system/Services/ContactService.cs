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
    }
}
