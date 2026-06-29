using Microsoft.AspNetCore.SignalR;

namespace travel_recommendation_and_booking_system.SignalR
{
    public class TravelRecommendationHub : Hub
    {
        public async Task JoinUserGroup(string userId)
        {
            await Groups.AddToGroupAsync(
                Context.ConnectionId,
                $"USER_{userId}"  
            );
        }

        public async Task LeaveUserGroup(string userId)
        {
            await Groups.RemoveFromGroupAsync(
                Context.ConnectionId,
                $"USER_{userId}"
            );
        }
    }
}
