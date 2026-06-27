using System.Text.Encodings.Web;
using System.Text.Json;
using DTOs.Page;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Log;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;
using travel_recommendation_and_booking_system.SignalR;

namespace travel_recommendation_and_booking_system.Services
{
    public class LogService : ILogService
    {
        private readonly AppDbContext _context;
        private readonly IRequestInfoService _requestInfoService;
        private readonly IHubContext<TravelRecommendationHub> _hubContext;

        public LogService(AppDbContext context, IRequestInfoService requestInfoService, IHubContext<TravelRecommendationHub> hubContext)
        {
            _context = context;
            _requestInfoService = requestInfoService;
            _hubContext = hubContext;
        }

        public async Task LoggingAsync(LogDTO request)
        {
            var log = new NhatKyHeThong
            {
                LoaiTaiKhoan = request.LoaiTaiKhoan,
                MaTaiKhoan = request.MaTaiKhoan,
                Email = request.Email,
                TenHanhDong = request.TenHanhDong,
                TenBangTacDong = request.TenBangTacDong,

                MaDoiTuong = request.MaDoiTuong,

                GiaTriTruoc = request.GiaTriTruoc == null
                ? null
                : JsonSerializer.Serialize(request.GiaTriTruoc, _jsonOptions),

                GiaTriSau = request.GiaTriSau == null
                ? null
                : JsonSerializer.Serialize(request.GiaTriSau, _jsonOptions),
                DiaChiIP = _requestInfoService.GetIpAddress(),

                TrinhDuyet = _requestInfoService.GetUserAgent(),

                ThoiGianTao = DateTime.Now
            };
            Console.WriteLine("SignalR Send Activity Log");
            _context.NhatKyHeThongs.Add(log);

            await _context.SaveChangesAsync();
            await _hubContext.Clients.All.SendAsync(
            "ReceiveActivityLog",
            new
            {
                log.MaNhatKy,
                log.LoaiTaiKhoan,
                log.DiaChiIP,
                log.TrinhDuyet,
                log.Email,
                log.TenHanhDong,
                log.TenBangTacDong,
                log.ThoiGianTao
            });
        }
        public async Task<PageDTO<LogResponseDTO>> GetPagedLogsAsync(int page, int size, string? key, string? accountType, int? accountId)
        {
            if (page < 1)
            {
                page = 1;
            }
            if (size < 1)
            {
                size = 10;
            }

            var query = _context.NhatKyHeThongs.AsNoTracking().AsQueryable();
            if (!string.IsNullOrWhiteSpace(key))
            {
                query = query.Where(n => n.LoaiTaiKhoan.Contains(key) || n.TenHanhDong.Contains(key) || n.TenBangTacDong.Contains(key));
            }

            if (!string.IsNullOrWhiteSpace(accountType))
            {
                query = query.Where(n => n.LoaiTaiKhoan == accountType);
            }

            if (accountId.HasValue)
            {
                query = query.Where(n => n.MaTaiKhoan == accountId.Value);
            }

            int totalItems = await query.CountAsync();

            var items = await query
                .OrderByDescending(n => n.ThoiGianTao)
                .Skip((page - 1) * size)
                .Take(size)
                .Select(n => new LogResponseDTO
                {
                    MaNhatKy = n.MaNhatKy,
                    MaTaiKhoan = n.MaTaiKhoan,
                    Email = n.Email,
                    LoaiTaiKhoan = n.LoaiTaiKhoan,
                    TenHanhDong = n.TenHanhDong,
                    TenBangTacDong = n.TenBangTacDong,
                    MaDoiTuong = n.MaDoiTuong,
                    GiaTriTruoc = n.GiaTriTruoc,
                    GiaTriSau = n.GiaTriSau,
                    DiaChiIP = n.DiaChiIP,
                    TrinhDuyet = n.TrinhDuyet,
                    ThoiGianTao = n.ThoiGianTao
                })
                .ToListAsync();

            return new PageDTO<LogResponseDTO>
            {
                Items = items,
                TotalItems = totalItems,
                PageNumber = page,
                PageSize = size
            };
        }
        public async Task<LogResponseDTO> GetLogByIdAsync(int id)
        {
            var log = await _context.NhatKyHeThongs.AsNoTracking().FirstOrDefaultAsync(n => n.MaNhatKy == id);
            if (log == null)
            {
                return null;
            }
            return new LogResponseDTO
            {
                MaNhatKy = log.MaNhatKy,
                MaTaiKhoan = log.MaTaiKhoan,
                Email = log.Email,
                LoaiTaiKhoan = log.LoaiTaiKhoan,
                TenHanhDong = log.TenHanhDong,
                TenBangTacDong = log.TenBangTacDong,
                MaDoiTuong = log.MaDoiTuong,
                GiaTriTruoc = log.GiaTriTruoc,
                GiaTriSau = log.GiaTriSau,
                DiaChiIP = log.DiaChiIP,
                TrinhDuyet = log.TrinhDuyet,
                ThoiGianTao = log.ThoiGianTao
            };
        }
        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
            Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
            WriteIndented = false
        };
    }
}
