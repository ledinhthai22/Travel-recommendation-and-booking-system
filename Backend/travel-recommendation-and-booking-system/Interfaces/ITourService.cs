using DTOs.Page;
using travel_recommendation_and_booking_system.DTOs.Hotel;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.DTOs.Tour_KS;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface ITourService
    {
        Task<PageDTO<TourReponseDTO>> GetPagedTourAsync( int pageNumber,int pageSize, string key, bool? status);
        Task<TourReponseDTO?> GetTourByIdAsync(int id);
        Task<int> CreateTourAsync(TourDTO tour, List<IFormFile> images);
        Task<bool> UpdateTourAsync(int id, TourDTO tour,List<IFormFile>? images);
        Task<bool> DeleteTourAsync(int id);
        Task<bool> SetMainImageAsync(int imageId);
        Task<bool> DeleteImageAsync(int imageId);
        Task<bool> AddToTourAsync(Tour_KSDTO dto);
        Task<bool> RemoveFromTourAsync(int maTour, int maKhachSan);

    }
}
