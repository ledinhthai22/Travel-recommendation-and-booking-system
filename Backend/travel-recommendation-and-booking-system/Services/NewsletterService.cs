using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class NewsletterService : INewsletterService
    {
        private readonly AppDbContext _context;
        public NewsletterService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> SubscribeAsync(NewsletterDTO newsletter)
        {
            bool isExist = await _context.Newsletters.AnyAsync(n => n.Email == newsletter.Email);

            if (isExist)
            {
                return false;
            }

            var newSubscription = new Newsletter
            {
                Email = newsletter.Email,
                NgayGui = DateTime.Now,
            };
            _context.Newsletters.Add(newSubscription);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PageDTO<NewsletterResponseDTO>> GetPagedNewslettersAsync(int pageNumber, int pageSize)
        {
            if (pageNumber < 1)
            {
                pageNumber = 1;
            }
            if (pageSize < 1)
            {
                pageSize = 10;
            }

            var query = _context.Newsletters;

            int totalItems = await query.CountAsync();
            var items = await query
            .OrderByDescending(n => n.NgayGui)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(n => new NewsletterResponseDTO
            {
                MaNewsletter = n.MaNewsletter,
                Email = n.Email,
                NgayGui = n.NgayGui
            })
            .ToListAsync();

            return new PageDTO<NewsletterResponseDTO>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
    }
}
