using travel_recommendation_and_booking_system.DTOs.Departure;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IDepartureService
    {
        Task<bool> AddDepartureFullAsync(DepartureFullDTO dto);
        Task<List<DepartureFullDTO>> GetByTourAsync(int maTour);
        Task<bool> DeleteDepartureAsync(int maChuyen);
        Task<bool> UpdateDepartureAsync(int maChuyen, DepartureFullDTO dto);
        Task<List<DepartureSelectDTO>> GetDeparturesForSelectAsync(int? tourId = null, string? keyword = null);

    }
}
