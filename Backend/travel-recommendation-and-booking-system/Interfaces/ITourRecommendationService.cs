using DTOs.Destination;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.DTOs.TypeTour;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface ITourRecommendationService
    {
        Task<List<TourCardResponseDTO>> GetBestToursCardAsync(int? limit = null);
        Task<List<TourCardResponseDTO>> GetLatestToursAsync(int? limit = null);
        Task<List<TourCardResponseDTO>> GetTourDesignJustForYouAsync(int userId, int? limit = null);
        Task<List<TourCardResponseDTO>> GetRecommendedToursAsync(int userId, int? limit = null);
        Task<List<TourCardResponseDTO>> GetNextTripSuggestionsAsync(int userId, int? limit = null);
        Task<List<DestinationTourDTO>> GetDestinationsForYouAsync(int userId, IReadOnlyCollection<int>? excludeDestinationIds = null, int? limit = null);
        Task TrackViewTourAsync(int userId, int tourId);
        Task TrackDeepInterestAsync(int userId, int tourId);
    }
}