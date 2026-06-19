using DTOs.Page;
using travel_recommendation_and_booking_system.DTOs.Vehicle;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IVehicleService {
        Task<List<VehicleReponseDTO>> GetAllAsync();
        Task<PageDTO<VehicleReponseDTO>> GetVehicleAsync(int pageNumber, int pageSize, string? key, bool? status);
        Task<bool> CreateVehicleAsync(VehicleDTO dto);
        Task<bool> UpdateVehicleAsync(int id, VehicleDTO dto);
        Task<bool> SoftDeleteVehicleAsync(int id);
    }
}
