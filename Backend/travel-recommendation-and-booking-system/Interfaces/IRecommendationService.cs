namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IRecommendationService
    {
        Task UpdatePreference(int userId, int tourId, float weight, bool isAdd);
        Task<float> GetPersonalizedScoreAsync(int userId, int tourId);
        Task<Dictionary<int, float>> GetCachedScoresForUserAsync(int userId);
    }
}