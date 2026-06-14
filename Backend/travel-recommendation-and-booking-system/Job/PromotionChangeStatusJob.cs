using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.SignalR;

namespace travel_recommendation_and_booking_system.Jobs
{
    public class PromotionStatusJob
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<TravelRecommendationHub> _hub;

        public PromotionStatusJob(
            AppDbContext context,
            IHubContext<TravelRecommendationHub> hub)
        {
            _context = context;
            _hub = hub;
        }

        public async Task UpdatePromotionStatus()
        {
            var now = DateTime.UtcNow;

            var promotions = await _context.UuDais
                .Where(x => x.NgayXoa == null)
                .ToListAsync();

            foreach (var item in promotions)
            {
                int oldStatus = item.TrangThai;

                // Ưu tiên hết hạn
                if (now > item.NgayHetHan)
                {
                    item.TrangThai = 4;
                }
                // Nếu admin đã ngưng thì giữ nguyên
                else if (item.TrangThai == 3)
                {
                    continue;
                }
                // Chưa đến ngày bắt đầu
                else if (now < item.NgayBatDau)
                {
                    item.TrangThai = 1;
                }
                // Đang trong thời gian hiệu lực
                else
                {
                    item.TrangThai = 2;
                }

                if (oldStatus != item.TrangThai)
                {
                    item.NgayCapNhat = now;

                    await _hub.Clients.All.SendAsync(
                        "PromotionStatusChanged",
                        item.MaUuDai,
                        item.TrangThai
                    );
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}