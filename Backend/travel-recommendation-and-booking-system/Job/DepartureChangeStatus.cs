using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.Models;
using travel_recommendation_and_booking_system.SignalR;

namespace travel_recommendation_and_booking_system.Job
{
    public class DepartureChangeStatus
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<TravelRecommendationHub> _hub;
        private readonly ILogger<DepartureChangeStatus> _logger;

        private const int STATUS_FULL = 0;
        private const int STATUS_UPCOMING = 1;
        private const int STATUS_ONGOING = 2;
        private const int STATUS_COMPLETED = 3;
        private const int STATUS_CANCELLED = 5;

        public DepartureChangeStatus(
            AppDbContext context,
            IHubContext<TravelRecommendationHub> hub,
            ILogger<DepartureChangeStatus> logger)
        {
            _context = context;
            _hub = hub;
            _logger = logger;
        }

        public async Task UpdateStatusesAsync()
        {
            var now = DateTime.Now;

            var departures = await _context.ChuyenKhoiHanhs
                .Where(c => c.NgayXoa == null && c.TrangThai != STATUS_CANCELLED)
                .ToListAsync();

            var updatedDeparturesLog = new List<object>();
            bool hasChanges = false;

            foreach (var chuyen in departures)
            {
                int correctStatus = GetCorrectStatus(chuyen, now);

                if (chuyen.TrangThai != correctStatus)
                {
                    int oldStatus = chuyen.TrangThai;
                    chuyen.TrangThai = correctStatus;
                    chuyen.NgayCapNhat = now;
                    hasChanges = true;

                    updatedDeparturesLog.Add(new
                    {
                        chuyen.MaChuyen,
                        chuyen.MaChuyenCode,
                        chuyen.MaTour,
                        OldStatus = oldStatus,
                        NewStatus = correctStatus,
                        UpdatedAt = now
                    });

                    _logger.LogInformation(
                        "[Departure Status] Chuyến {Code} đổi từ {Old} -> {New}",
                        chuyen.MaChuyenCode, oldStatus, correctStatus
                    );
                }
            }

            if (hasChanges)
            {
                await _context.SaveChangesAsync();
                await _hub.Clients.All.SendAsync("ReceiveDepartureStatusBroadcast", updatedDeparturesLog);
            }
        }

        private int GetCorrectStatus(ChuyenKhoiHanh c, DateTime now)
        {
            if (c.TrangThai == STATUS_CANCELLED)
                return STATUS_CANCELLED;

            var soChoConLai = c.SoChoToiDa - c.SoChoDaDat;

            if (soChoConLai <= 0 && now < c.NgayKhoiHanh)
                return STATUS_FULL;

            if (soChoConLai <= 0 && now >= c.NgayKhoiHanh && now <= c.NgayKetThuc)
                return STATUS_ONGOING;

            if (now < c.NgayKhoiHanh)
                return STATUS_UPCOMING;

            if (now >= c.NgayKhoiHanh && now <= c.NgayKetThuc)
                return STATUS_ONGOING;

            return STATUS_COMPLETED;
        }

        private bool ShouldUpdateStatus(ChuyenKhoiHanh c, DateTime now)
        {
            if (c.TrangThai == STATUS_CANCELLED)
                return false;

            if (c.TrangThai == STATUS_COMPLETED && now > c.NgayKetThuc)
                return false;

            return true;
        }
    }
}