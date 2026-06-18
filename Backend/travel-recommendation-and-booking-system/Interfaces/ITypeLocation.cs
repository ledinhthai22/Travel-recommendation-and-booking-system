using DTOs.Page;
using travel_recommendation_and_booking_system.DTOs.TypeLocation;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface ITypeLocation
    {
        Task<List<TypeLocationReponseDTO>> GetAllAsync();
        Task<PageDTO<TypeLocationReponseDTO>> getTypeLocationAsync(int pageNumber, int pageSize, string? key); 
        Task<bool> CreateTypeLocationAsync(TypeLocationDTO dto);
        Task<bool> UpdateTypeLocationAsync(int id, TypeLocationDTO dto);
        Task<bool> DeleteTypeLocationAsync(int id);
    }
}
