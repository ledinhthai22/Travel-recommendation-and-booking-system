using Microsoft.AspNetCore.SignalR;

namespace travel_recommendation_and_booking_system.SignalR
{
    public class TravelRecommendationHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"Connected: {Context.ConnectionId}");

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"Disconnected: {Context.ConnectionId}");

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
            var roleClaim = Context.User?.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            if (roleClaim != "1")
            {
                await Clients.Caller.SendAsync("Error", "Không có quyền truy cập");
                return;
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, "ADMIN_GROUP");
            await Clients.Caller.SendAsync("JoinedGroup", "ADMIN_GROUP");
        }

        public async Task LeaveAdminGroup()
        {
            await Groups.RemoveFromGroupAsync(
                Context.ConnectionId,
                "ADMIN_GROUP"
            );
        }
        public async Task JoinStaffGroup(string staffId)
        {
            Console.WriteLine($"JoinStaffGroup({staffId})");
            if (string.IsNullOrWhiteSpace(staffId)) return;

            await Groups.AddToGroupAsync(Context.ConnectionId, $"STAFF_{staffId}");
            await Clients.Caller.SendAsync("JoinedGroup", $"STAFF_{staffId}");
        }

        public async Task LeaveStaffGroup(string staffId)
        {
            if (string.IsNullOrWhiteSpace(staffId)) return;
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"STAFF_{staffId}");
        }
    }
}