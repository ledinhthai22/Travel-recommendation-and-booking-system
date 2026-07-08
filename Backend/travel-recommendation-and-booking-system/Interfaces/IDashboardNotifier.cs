namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IDashboardNotifier
    {
        Task NotifyDashboardChangedAsync(string eventType, object? data = null);
    }
}