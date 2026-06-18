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
                int oldStatus = item.TrangThai;

                if (item.SoLuongToiDa <= 0)
                {
                    item.TrangThai = 5;
                }
                else if (DateTime.Now >= item.NgayHetHan)
                {
                    item.TrangThai = 4;
                }
                else if (DateTime.Now >= item.NgayBatDau)
                {
                    item.TrangThai = 2;
                }
                else if (item.TrangThai == 3 && item.NgayHetHan < DateTime.Now)
                {
                    item.TrangThai = 4;
                }
                else
                {
                    item.TrangThai = 1;
                }

                if (oldStatus != item.TrangThai)
                {
                    item.NgayCapNhat = DateTime.Now;

                    await _hub.Clients.All.SendAsync(
                        "PromotionStatusChanged",
                        item.MaUuDai,
                        item.SoLuongToiDa,
                        item.TrangThai
                    );
                }
            }

            await _context.SaveChangesAsync();
        }
    }
}