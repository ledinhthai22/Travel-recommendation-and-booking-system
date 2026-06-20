using DTOs.Page;
using travel_recommendation_and_booking_system.DTOs.Hotel;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IHotelService
    {
        Task<List<HotelDTO>> GetAllAsync();
        Task<PageDTO<HotelResponseDTO>> GetPagedHotelAsync(int pageNumber, int pageSize, HotelDTO hotel);
        Task<HotelResponseDTO?> GetHotelByIdAsync(int id);
        Task<int> CreateHotelAsync(CreateHotelDTO hotel, List<IFormFile> images);
        Task<bool> UpdateHotelAsync(int id, CreateHotelDTO hotel, List<IFormFile>? images);
        Task<bool> UpdateStatusAsync(int id, bool status);
        Task<bool> DeleteAsync(int id);
        Task<bool> SetMainImageAsync(int imageId);
        Task<bool> DeleteImageAsync(int imageId);
    }
}