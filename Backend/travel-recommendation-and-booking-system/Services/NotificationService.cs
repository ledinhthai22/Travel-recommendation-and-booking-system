using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Notifications;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;
using travel_recommendation_and_booking_system.SignalR;

namespace travel_recommendation_and_booking_system.Services
{
    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<TravelRecommendationHub> _hubContext;

        public NotificationService(AppDbContext context, IHubContext<TravelRecommendationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

     

        public async Task CreateForUserAsync(int userId, CreateNotificationDTO dto)
        {
            var notification = new ThongBao
            {
                TieuDe = dto.TieuDe,
                NoiDung = dto.NoiDung,
                LoaiThongBao = dto.LoaiThongBao,
                LinkChiTiet = dto.LinkChiTiet,
                NgayTao = DateTime.Now
            };
            _context.ThongBaos.Add(notification);
            await _context.SaveChangesAsync();

            var receiver = new ThongBaoNguoiNhan
            {
                MaThongBao = notification.MaThongBao,
                MaNguoiDung = userId,
                DaDoc = false,
                NgayNhan = DateTime.Now
            };
            _context.ThongBaoNguoiNhans.Add(receiver);
            await _context.SaveChangesAsync();

            await PushRealtime(notification, userId, null);
        }

        public async Task CreateForStaffAsync(int staffId, CreateNotificationDTO dto)
        {
            var notification = new ThongBao
            {
                TieuDe = dto.TieuDe,
                NoiDung = dto.NoiDung,
                LoaiThongBao = dto.LoaiThongBao,
                LinkChiTiet = dto.LinkChiTiet,
                NgayTao = DateTime.Now
            };
            _context.ThongBaos.Add(notification);
            await _context.SaveChangesAsync();

            var receiver = new ThongBaoNguoiNhan
            {
                MaThongBao = notification.MaThongBao,
                MaNhanVien = staffId,
                DaDoc = false,
                NgayNhan = DateTime.Now
            };
            _context.ThongBaoNguoiNhans.Add(receiver);
            await _context.SaveChangesAsync();

            await PushRealtime(notification, null, staffId);
        }

        public async Task CreateForUsersAsync(List<int> userIds, CreateNotificationDTO dto)
        {
            if (userIds == null || !userIds.Any()) return;

            var notification = new ThongBao
            {
                TieuDe = dto.TieuDe,
                NoiDung = dto.NoiDung,
                LoaiThongBao = dto.LoaiThongBao,
                LinkChiTiet = dto.LinkChiTiet,
                NgayTao = DateTime.Now
            };
            _context.ThongBaos.Add(notification);
            await _context.SaveChangesAsync();

            var receivers = userIds.Select(id => new ThongBaoNguoiNhan
            {
                MaThongBao = notification.MaThongBao,
                MaNguoiDung = id,
                DaDoc = false,
                NgayNhan = DateTime.Now
            }).ToList();

            _context.ThongBaoNguoiNhans.AddRange(receivers);
            await _context.SaveChangesAsync();

            // Gửi realtime song song để tối ưu thời gian phản hồi
            var tasks = userIds.Select(id => PushRealtime(notification, id, null));
            await Task.WhenAll(tasks);
        }

        public async Task CreateForStaffsAsync(List<int> staffIds, CreateNotificationDTO dto)
        {
            if (staffIds == null || !staffIds.Any()) return;

            var notification = new ThongBao
            {
                TieuDe = dto.TieuDe,
                NoiDung = dto.NoiDung,
                LoaiThongBao = dto.LoaiThongBao,
                LinkChiTiet = dto.LinkChiTiet,
                NgayTao = DateTime.Now
            };
            _context.ThongBaos.Add(notification);
            await _context.SaveChangesAsync();

            var receivers = staffIds.Select(id => new ThongBaoNguoiNhan
            {
                MaThongBao = notification.MaThongBao,
                MaNhanVien = id,
                DaDoc = false,
                NgayNhan = DateTime.Now
            }).ToList();

            _context.ThongBaoNguoiNhans.AddRange(receivers);
            await _context.SaveChangesAsync();

            var tasks = staffIds.Select(id => PushRealtime(notification, null, id));
            await Task.WhenAll(tasks);
        }


        public async Task<List<NotificationDTO>> GetNotificationsForUserAsync(int userId, int page = 1, int pageSize = 20)
        {
            return await _context.ThongBaoNguoiNhans
                .Where(tn => tn.MaNguoiDung == userId)
                .OrderByDescending(tn => tn.ThongBao.NgayTao)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(tn => new NotificationDTO
                {
                    MaThongBao = tn.MaThongBao,
                    TieuDe = tn.ThongBao.TieuDe,
                    NoiDung = tn.ThongBao.NoiDung,
                    LoaiThongBao = tn.ThongBao.LoaiThongBao,
                    DaDoc = tn.DaDoc,
                    NgayTao = tn.ThongBao.NgayTao,
                    LinkChiTiet = tn.ThongBao.LinkChiTiet
                })
                .ToListAsync();
        }

        public async Task<List<NotificationDTO>> GetNotificationsForStaffAsync(int staffId, int page = 1, int pageSize = 20)
        {
            return await _context.ThongBaoNguoiNhans
                .Where(tn => tn.MaNhanVien == staffId)
                .OrderByDescending(tn => tn.ThongBao.NgayTao)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(tn => new NotificationDTO
                {
                    MaThongBao = tn.MaThongBao,
                    TieuDe = tn.ThongBao.TieuDe,
                    NoiDung = tn.ThongBao.NoiDung,
                    LoaiThongBao = tn.ThongBao.LoaiThongBao,
                    DaDoc = tn.DaDoc,
                    NgayTao = tn.ThongBao.NgayTao,
                    LinkChiTiet = tn.ThongBao.LinkChiTiet
                })
                .ToListAsync();
        }



        public async Task MarkAsReadAsync(int notificationId, int? userId = null, int? staffId = null)
        {
            var query = _context.ThongBaoNguoiNhans.Where(tn => tn.MaThongBao == notificationId);

            if (userId.HasValue)
                query = query.Where(tn => tn.MaNguoiDung == userId);
            else if (staffId.HasValue)
                query = query.Where(tn => tn.MaNhanVien == staffId);
            else
                return; 

            var receiver = await query.FirstOrDefaultAsync();
            if (receiver == null || receiver.DaDoc) return;

            receiver.DaDoc = true;
            receiver.NgayDoc = DateTime.Now;

            await _context.SaveChangesAsync();
        }

        public async Task MarkAllAsReadAsync(int? userId = null, int? staffId = null)
        {
            var query = _context.ThongBaoNguoiNhans.Where(tn => !tn.DaDoc);

            if (userId.HasValue)
                query = query.Where(tn => tn.MaNguoiDung == userId);
            else if (staffId.HasValue)
                query = query.Where(tn => tn.MaNhanVien == staffId);
            else
                return;

           
            await query.ExecuteUpdateAsync(setters => setters
                .SetProperty(tn => tn.DaDoc, true)
                .SetProperty(tn => tn.NgayDoc, DateTime.Now));
        }

        public async Task<int> GetUnreadCountAsync(int? userId = null, int? staffId = null)
        {
            var query = _context.ThongBaoNguoiNhans.Where(tn => !tn.DaDoc);

            if (userId.HasValue)
                query = query.Where(tn => tn.MaNguoiDung == userId);
            else if (staffId.HasValue)
                query = query.Where(tn => tn.MaNhanVien == staffId);
            else
                return 0;

            return await query.CountAsync();
        }



        private async Task PushRealtime(ThongBao notification, int? userId, int? staffId)
        {
            var dto = new NotificationDTO
            {
                MaThongBao = notification.MaThongBao,
                TieuDe = notification.TieuDe,
                NoiDung = notification.NoiDung,
                LoaiThongBao = notification.LoaiThongBao,
                NgayTao = notification.NgayTao,
                LinkChiTiet = notification.LinkChiTiet,
                DaDoc = false
            };

            // Gửi cho user nếu có userId
            if (userId.HasValue)
            {
                await _hubContext.Clients
                    .Group($"USER_{userId.Value}")
                    .SendAsync("ReceiveNotification", dto);

                // Log để debug
                Console.WriteLine($"[PushRealtime] Sent to USER_{userId.Value}: {notification.TieuDe}");
            }

            // Gửi cho staff nếu có staffId
            if (staffId.HasValue)
            {
                await _hubContext.Clients
                    .Group($"STAFF_{staffId.Value}")
                    .SendAsync("ReceiveNotification", dto);

                // Log để debug
                Console.WriteLine($"[PushRealtime] Sent to STAFF_{staffId.Value}: {notification.TieuDe}");
            }
        }

    }
}