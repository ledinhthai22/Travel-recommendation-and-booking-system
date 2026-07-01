using Microsoft.AspNetCore.SignalR;

namespace travel_recommendation_and_booking_system.SignalR
{
    public class TravelRecommendationHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"✅ Connected: {Context.ConnectionId}");

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"❌ Disconnected: {Context.ConnectionId}");

            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinUserGroup(string userId)
        {
            Console.WriteLine($"JoinUserGroup({userId})");

            if (string.IsNullOrWhiteSpace(userId))
                return;

            await Groups.AddToGroupAsync(
                Context.ConnectionId,
                $"USER_{userId}"
            );

            Console.WriteLine($"Đã join USER_{userId}");

            await Clients.Caller.SendAsync(
                "JoinedGroup",
                $"USER_{userId}"
            );
        }

        public async Task LeaveUserGroup(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return;

            await Groups.RemoveFromGroupAsync(
                Context.ConnectionId,
                $"USER_{userId}"
            );
        }

        public async Task JoinAdminGroup()
        {
            Console.WriteLine("Join ADMIN_GROUP");

            await Groups.AddToGroupAsync(
                Context.ConnectionId,
                "ADMIN_GROUP"
            );

            await Clients.Caller.SendAsync(
                "JoinedGroup",
                "ADMIN_GROUP"
            );
        }

        public async Task LeaveAdminGroup()
        {
            await Groups.RemoveFromGroupAsync(
                Context.ConnectionId,
                "ADMIN_GROUP"
            );
        }
    }
}