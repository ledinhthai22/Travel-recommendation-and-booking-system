using DTOs.Newsletter;
using DTOs.Page;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.DTOs.LogSystem;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Services
{
    public class NewsletterService : INewsletterService
    {
        private readonly AppDbContext _context;
        private readonly ILogService _logService;
        private readonly ICurrentUserService _currentUserService;
        public NewsletterService(AppDbContext context, ILogService logService, ICurrentUserService currentUserService)
        {
            _context = context;
            _logService = logService;
            _currentUserService = currentUserService;
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
            var currentUserId = _currentUserService.GetUserId();
            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = AccountTypeDTO.NguoiDung,
                Email = null,
                MaTaiKhoan = currentUserId ?? 0,

                TenHanhDong = ActionLogDTO.Tao,

                TenBangTacDong = "Newsletter",

                MaDoiTuong = newSubscription.MaNewsletter,

                GiaTriSau = new
                {
                    newSubscription.Email
                }
            });
            return true;
        }
        public async Task<PageDTO<NewsletterResponseDTO>> GetPagedNewslettersAsync(string? keyword, int page, int size)
        {
            if (page < 1)
            {
                page = 1;
            }
            if (size < 1)
            {
                size = 10;
            }

            var query = _context.Newsletters.AsNoTracking().Where(n => n.NgayXoa == null);
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(n => n.Email.Contains(keyword));
            }

            int totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(n => n.NgayGui)
                .Skip((page - 1) * size)
                .Take(size)
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
                PageNumber = page,
                PageSize = size
            };
        }
        public async Task<bool> SoftDeleteNewsletterAsync(int id)
        {
            var newsletter = await _context.Newsletters.FindAsync(id);

            if (newsletter == null || newsletter.NgayXoa != null)
            {
                return false;
            }
            newsletter.NgayXoa = DateTime.Now;
            _context.Newsletters.Update(newsletter);
            await _context.SaveChangesAsync();
            var currentAccount = _currentUserService.GetUserId() == 1 ? AccountTypeDTO.QuanTriVien: AccountTypeDTO.NguoiDung;
            await _logService.LoggingAsync(new LogDTO
            {
                LoaiTaiKhoan = currentAccount,
                MaTaiKhoan = _currentUserService.GetUserId() ?? 0,
                Email = _currentUserService.GetEmail(),
                TenHanhDong = ActionLogDTO.Xoa,
                TenBangTacDong = "Newsletter",
                MaDoiTuong = newsletter.MaNewsletter,
                GiaTriTruoc = new
                {
                    newsletter.Email
                }
            });
            return true;
        }
    }
}
