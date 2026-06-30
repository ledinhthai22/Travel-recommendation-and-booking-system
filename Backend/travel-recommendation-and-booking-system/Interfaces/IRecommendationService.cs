using travel_recommendation_and_booking_system.Models;

namespace Interfaces
{
    public interface IRecommendationService
    {
        Task UpdatePreference(int userId, int tourTypeId, float weight);
    }
}
