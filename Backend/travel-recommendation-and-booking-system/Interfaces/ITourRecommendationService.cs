using travel_recommendation_and_booking_system.DTOs.Tour;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface ITourRecommendationService
    {
        Task<List<TourCardDTO>> GetBestToursCardAsync(int? limit = null);
        Task<List<TourCardDTO>> GetLatestToursAsync(int? limit = null);
        Task<List<TourCardDTO>> GetTourDesignJustForYouAsync(int userId, int? limit = null);
        Task<List<TourCardDTO>> GetRecommendedToursAsync(int userId, int? limit = null);
        Task<List<TourCardDTO>> GetNextTripSuggestionsAsync(int userId, int? limit = null);

        Task TrackViewTourAsync(int userId, int tourId);
        Task TrackDeepInterestAsync(int userId, int tourId);
    }
}