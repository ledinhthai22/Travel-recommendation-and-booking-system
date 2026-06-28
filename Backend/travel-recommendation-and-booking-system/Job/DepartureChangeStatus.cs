using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.SignalR;

namespace travel_recommendation_and_booking_system.Job
{
    public class DepartureChangeStatus
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<TravelRecommendationHub> _hub;

        public DepartureChangeStatus(AppDbContext context, IHubContext<TravelRecommendationHub> hub)
        {
            _context = context;
            _hub = hub;
        }


        public async Task UpdateStatusesAsync()
        {
            var now = DateTime.Now;


            var departures = await _context.ChuyenKhoiHanhs
                .Where(c => c.NgayXoa == null && c.TrangThai != 0 && c.TrangThai != 4)
                .ToListAsync();

            var updatedDeparturesLog = new List<object>();
            bool hasChanges = false;

            foreach (var chuyen in departures)
            {
                int correctStatus = GetCorrectStatus(chuyen.NgayKhoiHanh, chuyen.NgayKetThuc, now);

                if (chuyen.TrangThai != correctStatus)
                {
                    int oldStatus = chuyen.TrangThai;
                    chuyen.TrangThai = correctStatus;
                    hasChanges = true;

                    updatedDeparturesLog.Add(new
                    {
                        chuyen.MaChuyen,
                        chuyen.MaChuyenCode,
                        OldStatus = oldStatus,
                        NewStatus = correctStatus
                    });
                }
            }

            if (hasChanges)
            {
                await _context.SaveChangesAsync();


                await _hub.Clients.All.SendAsync("ReceiveDepartureStatusBroadcast", updatedDeparturesLog);
            }
        }

        
        private int GetCorrectStatus(DateTime ngayKhoiHanh, DateTime ngayKetThuc, DateTime now)
        {
            if (now < ngayKhoiHanh)
                return 1; 
            if (now >= ngayKhoiHanh && now <= ngayKetThuc)
                return 2;
            return 4;   
        }
    }
}