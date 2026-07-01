namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface ICurrentUserService
    {
        int GetUserId();

        int GetRoleId();

        string GetEmail();
    }
}