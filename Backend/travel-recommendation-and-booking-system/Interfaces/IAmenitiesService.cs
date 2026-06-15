using travel_recommendation_and_booking_system.DTOs.Amenities;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IAmenitiesService
    {
        Task<List<AmenitiesDTO>> GetAllAsync(); // lấy danh sách tất cả tiện nghi

        Task<AmenitiesDTO?> GetByIdAsync(int id); // lấy thông tin chi tiết của tiện nghi

        Task<int> CreateAsync(AmenitiesDTO amenities); // thêm tiện nghi

        Task<bool> UpdateAsync(int id, AmenitiesDTO amenities); // Cập nhật tiện nghi

        Task<bool> DeleteAsync(int id); // xóa tiện nghi
    }
}