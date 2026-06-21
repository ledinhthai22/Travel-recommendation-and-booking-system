using DTOs.Page;
using travel_recommendation_and_booking_system.DTOs.Tour;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface ITourService
    {

        Task<int> CreateFullTourAsync(TourFullCreateDTO dto, List<IFormFile> images, List<IFormFile> scheduleImages);
        Task<bool> UpdateFullTourAsync(int tourId, TourFullCreateDTO dto, List<IFormFile> images, List<IFormFile> scheduleImages);
        Task<TourReponseDTO> GetTourDetailAsync(int tourId);
        Task<bool> SoftDeleteTourAsync(int tourId);
        Task<PageDTO<TourReponseDTO>> GetPagedTourAsync(int page, int pageSize, string? searchTerm, bool? status);

        //Task<PageDTO<TourReponseDTO>> GetPagedTourAsync( int pageNumber,int pageSize, string key, bool? status);
        //Task<TourReponseDTO?> GetTourByIdAsync(int id);
        //Task<int> CreateTourAsync(TourDTO tour, List<IFormFile> images, List<int>? danhSachMaKhachSan);
        //Task<bool> UpdateTourAsync(int id, TourDTO tour,List<IFormFile>? images, List<int>? danhSachMaKhachSan);
        //Task<bool> DeleteTourAsync(int id);
        Task<bool> SetMainImageAsync(int imageId);
        Task<bool> DeleteImageAsync(int imageId);
        //Task<bool> AddToTourAsync(Tour_KSDTO dto);
        //Task<bool> RemoveFromTourAsync(int maTour, int maKhachSan);

    }
}
