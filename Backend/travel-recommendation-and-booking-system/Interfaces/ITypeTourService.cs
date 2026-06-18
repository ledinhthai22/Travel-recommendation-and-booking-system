using DTOs.Page;
using travel_recommendation_and_booking_system.DTOs.TypeLocation;
using travel_recommendation_and_booking_system.DTOs.TypeTour;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface ITypeTourService {
        Task<List<TypeTourReponseDTO>> GetAllAsync();
        Task<PageDTO<TypeTourReponseDTO>> GetTypeTourAsync(int pageNumber, int pageSize, string? key, bool? status);
        Task<bool> CreateTypeTourAsync(TypeTourDTO typetour);
        Task<bool> UpdateTypeTourAsync(int id, TypeTourDTO typetour);
        Task<bool> SoftDeleteTypeTourAsync(int id);
    }
}
