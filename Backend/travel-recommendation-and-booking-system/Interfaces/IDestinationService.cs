using DTOs.Destination;
using travel_recommendation_and_booking_system.DTOs.Destination;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IDestinationService
    {
        Task<List<DestinationDTO>> GetTopDestinationsAsync(); // địa điểm nổi bật
        Task<List<DestinationTourDTO>> GetRecommendedLocationsAsync(int userId); // địa điểm dành cho bạn
    }
}
