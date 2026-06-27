using DTOs.Page;
using travel_recommendation_and_booking_system.DTOs.Location;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface ILocationService
    {
        Task<List<LocationDTO>> GetAllAsync();
        Task<List<LocationCardResponseDTO>> GetLocationCardsAsync(int? limit = null);
        Task<PageDTO<LocationReponseDTO>> GetLocationAsync(int pageNumber, int pageSize, string? key, bool? status);
        Task<bool> CreateLocationAsync(LocationDTO location);
        Task<bool> UpdateLocationAsync(int id, LocationDTO location);
        Task<bool> SoftDeleteLocationAsync(int id);
    }
}
