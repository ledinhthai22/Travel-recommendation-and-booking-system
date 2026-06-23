using DTOs.Page;
using travel_recommendation_and_booking_system.DTOs.FavoriteTour;
using travel_recommendation_and_booking_system.DTOs.Hotel;
using travel_recommendation_and_booking_system.DTOs.Tour;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface ITourService
    {
        //ql tour
        Task<int> CreateFullTourAsync(TourFullCreateDTO dto, List<IFormFile> images, List<IFormFile> scheduleImages);
        Task<bool> UpdateFullTourAsync(int tourId, TourFullCreateDTO dto, List<IFormFile> images, List<IFormFile> scheduleImages);
        Task<TourReponseDTO> GetTourDetailAsync(int tourId);
        Task<bool> SoftDeleteTourAsync(int tourId);
        Task<PageDTO<TourReponseDTO>> GetPagedTourAsync(int page, int pageSize, string? searchTerm, bool? status);
        Task<bool> SetMainImageAsync(int imageId);
        Task<bool> DeleteImageAsync(int imageId);

        // tour yêu thích
        Task<PageDTO<FavoriteTourRepnoseDTO>> GetFavoriteToursAsync(int userId, int pageNumber = 1, int pageSize = 10);
        Task<bool> DeleteFavoriteToursAsync(int userId, List<int> tourIds);
        Task<bool> AddFavoriteTourAsync(int userId, int tourId);

    }
}
