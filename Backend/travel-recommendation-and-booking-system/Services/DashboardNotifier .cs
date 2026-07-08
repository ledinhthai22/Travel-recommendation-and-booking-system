using Microsoft.AspNetCore.SignalR;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.SignalR
{
    public class DashboardNotifier : IDashboardNotifier
    {
        private readonly IHubContext<TravelRecommendationHub> _hubContext;

        public DashboardNotifier(IHubContext<TravelRecommendationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task NotifyDashboardChangedAsync(string eventType, object? data = null)
        {
            // Chỉ gửi cho nhóm admin đang xem dashboard
            await _hubContext.Clients.Group("ADMIN_GROUP")
                .SendAsync("DashboardChanged", new
                {
                    EventType = eventType, // "NewBooking", "NewPayment", "OrderStatusChanged"...
                    Data = data,
                    Timestamp = DateTime.Now
                });
        }
    }
}