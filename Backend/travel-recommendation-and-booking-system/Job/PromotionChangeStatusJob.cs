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
            var now = DateTime.Now;

            var promotions = await _context.UuDais
                .Where(x => x.NgayXoa == null)
                .ToListAsync();

            foreach (var item in promotions)
            {
                var start = item.NgayBatDau;
                var end = item.NgayHetHan;

                int oldStatus = item.TrangThai;

                if (item.SoLuongToiDa <= 0)
                {
                    item.TrangThai = 5;
                }
                if (now == item.NgayBatDau)
                {
                    item.TrangThai = 2;
                }
                if (now >= end)
                {
                    item.TrangThai = 4;
                }
                if (now < start)
                {
                    item.TrangThai = 1;
                }
                if (item.TrangThai == 3)
                {
                    continue;
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