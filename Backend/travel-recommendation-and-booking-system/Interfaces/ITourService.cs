using DTOs.Page;
using travel_recommendation_and_booking_system.DTOs.Tour;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface ITourService
    {

        Task<int> CreateFullTourAsync(TourFullCreateDTO dto, List<IFormFile> images, List<IFormFile> scheduleImages);
        Task<bool> UpdateFullTourAsync(int tourId, TourFullCreateDTO dto, List<IFormFile> images, List<IFormFile> scheduleImages);
        Task<TourReponseDTO?> GetTourDetailBySlugAsync(string slug);
        Task<TourReponseDTO> GetTourDetailAsync(int tourId);
        Task<TourByLocationResponseDTO?> GetToursByLocationSlugAsync(string locationSlug);
        Task<bool> SoftDeleteTourAsync(int tourId);
        Task<PageDTO<TourReponseDTO>> GetPagedTourAsync(int page, int pageSize, string? searchTerm, int? status);
        Task<bool> ChangeStatusAsync(int maTour, int trangThai);
        Task<bool> SetMainImageAsync(int imageId);
        Task<bool> DeleteImageAsync(int imageId);


    }
}
