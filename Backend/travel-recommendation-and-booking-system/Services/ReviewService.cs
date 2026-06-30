using DTOs.Page;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Review;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;
using Microsoft.AspNetCore.SignalR;
using travel_recommendation_and_booking_system.SignalR;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;
using System.Security.Claims;

namespace travel_recommendation_and_booking_system.Services
{
    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _context;
        private readonly GeminiService _geminiService;
        private readonly IHubContext<TravelRecommendationHub> _hubContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ReviewService(AppDbContext context, GeminiService geminiService, IHubContext<TravelRecommendationHub> hubContext, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _geminiService = geminiService;
            _hubContext = hubContext;
            _httpContextAccessor = httpContextAccessor;
        }

        //ql
        public async Task<PageDTO<ReviewReponseDTO>> GetReviewsAsync(int page, int pageSize, string? key, int? diem, bool? trangThai)
        {
            if (page < 1)
            {
                page = 1;
            }
            if (pageSize < 1)
            {
                pageSize = 10;
            }
            var query = _context.DanhGias
            .Include(d => d.NguoiDung)
            .Include(d => d.Tour)
            .AsQueryable();
            if (!string.IsNullOrEmpty(key))
                query = query.Where(d => d.NoiDung.Contains(key) || d.NguoiDung.HoTen.Contains(key));

            if (diem.HasValue)
                query = query.Where(d => d.DiemDanhGia == diem);

            if (trangThai.HasValue)
                query = query.Where(d => d.TrangThai == trangThai);

            var totalItems = await query.CountAsync();

            var reviews = await query
                .OrderByDescending(d => d.NgayTao)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(d => new ReviewReponseDTO
                {
                    MaDanhGia = d.MaDanhGia,
                    TenNguoiDung = d.NguoiDung.HoTen,
                    TenTour = d.Tour.TenTour,
                    DiemDanhGia = d.DiemDanhGia,
                    IsProcessedByAI = d.IsProcessed,
                    GhiChuKiemDuyet = d.GhiChuKiemDuyet,
                    NoiDung = d.NoiDung,
                    TrangThai = d.TrangThai,
                    NgayTao = d.NgayTao.ToString("dd/MM/yyyy")
                }).ToListAsync();

            return new PageDTO<ReviewReponseDTO> { Items = reviews, TotalItems = totalItems, PageNumber = page, PageSize = pageSize };
        }

        public async Task<bool> UpdateReviewStatusAsync(int maDanhGia, bool trangThai)
        {
            var review = await _context.DanhGias.FindAsync(maDanhGia);
            if (review == null) return false;

            var adminName = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Name)?.Value ?? "Quản trị viên";
            review.TrangThai = trangThai;
            review.IsProcessed = true;
            review.GhiChuKiemDuyet = $"{adminName} cập nhật thủ công lúc {DateTime.Now:HH:mm dd/MM}";
            review.NgayCapNhat = DateTime.Now;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<int> BatchUpdateStatusAsync(List<int> ids, bool trangThai)
        {
            var adminName = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.Name)?.Value ?? "Quản trị viên";
            string ghiChu = $"{adminName} cập nhật hàng loạt lúc {DateTime.Now:HH:mm dd/MM}";
            return await _context.DanhGias
                .Where(r => ids.Contains(r.MaDanhGia))
                .ExecuteUpdateAsync(s => s
                    .SetProperty(r => r.TrangThai, trangThai)
                    .SetProperty(r => r.NgayCapNhat, DateTime.Now)
                    .SetProperty(r => r.GhiChuKiemDuyet,ghiChu)
                    .SetProperty(r => r.IsProcessed,true)
                );
        }

        // user
        public async Task AddReviewAsync(ReviewDTO dto)
        {
            if (dto.MaNguoiDung <= 0 || dto.MaTour <= 0)
            {
                throw new Exception("Thông tin người dùng hoặc tour không hợp lệ!");
            }

            var daDanhGia = await _context.DanhGias.AnyAsync(d => d.MaNguoiDung == dto.MaNguoiDung && d.MaTour == dto.MaTour && d.NgayXoa == null);

            if (daDanhGia)
            {
                throw new Exception("Mỗi tour bạn chỉ được phép đánh giá một lần duy nhất!");
            }
            var newReview = new DanhGia
            {
                MaNguoiDung = dto.MaNguoiDung,
                MaTour = dto.MaTour,
                NoiDung = dto.NoiDung,
                DiemDanhGia = dto.DiemDanhGia,
                TrangThai = false,
                IsProcessed = false,
                GhiChuKiemDuyet = "Đang chờ xử lý...",
                NgayTao = DateTime.Now
            };

             _context.DanhGias.Add(newReview);
            await _context.SaveChangesAsync();
        }

        public async Task ProcessReviewsBatchAsync()
        {
            var pendingReviews = await _context.DanhGias
                .Where(r => !r.IsProcessed)
                .OrderBy(r => r.NgayTao)
                .Take(20)
                .ToListAsync();

            if (!pendingReviews.Any()) return;

            foreach (var review in pendingReviews)
            {
                if (review.IsProcessed) continue;
                try
                {
                    var sentiment = await _geminiService.AnalyzeReviewSentiment(review.NoiDung);
                    string cleanResult = sentiment.Trim().Replace(".", "").Replace("\n", "").Replace("\r", "").Replace(" ", "");
                    bool isPositive = cleanResult.Equals("Positive", StringComparison.OrdinalIgnoreCase);

                    review.TrangThai = isPositive;
                    review.IsProcessed = true;
                    review.GhiChuKiemDuyet = isPositive ? "Tự động duyệt: Tích cực" : "Tự động đánh dấu: Tiêu cực/Cần xem lại";
                    await Task.Delay(12000);
                }
                catch (Exception ex)
                {
                    review.IsProcessed = true;
                    review.GhiChuKiemDuyet = "Lỗi AI: " + ex.Message;
                }
            }

            await _context.SaveChangesAsync();

            var updatedData = pendingReviews.Select(r => new
            {
                maDanhGia = r.MaDanhGia,
                trangThai = r.TrangThai,
                isProcessedByAI = r.IsProcessed,
                ghiChuKiemDuyet = r.GhiChuKiemDuyet
            }).ToList();
            await _hubContext.Clients.All.SendAsync("ReviewStatusUpdated", updatedData);
        }

        public async Task<List<ReviewReponseDTO>> GetTop3ReviewAsync()
        {
            return await _context.DanhGias
        .Include(d => d.NguoiDung)
        .Where(d => d.TrangThai == true && d.DiemDanhGia ==5)
        .OrderByDescending(d => d.NgayTao)
        .Take(3)
        .Select(d => new ReviewReponseDTO
        {
            TenNguoiDung = d.NguoiDung.HoTen,
            NoiDung = d.NoiDung,
            DiemDanhGia = d.DiemDanhGia,
            DuongDanAnh = d.NguoiDung.DuongDanAnh
        })
        .ToListAsync();
        }
    }
}