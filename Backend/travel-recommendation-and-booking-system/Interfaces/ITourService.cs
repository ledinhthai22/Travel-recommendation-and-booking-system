using DTOs.Page;
using travel_recommendation_and_booking_system.DTOs.FavoriteTour;
using travel_recommendation_and_booking_system.DTOs.Hotel;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface ITourService
    {
        //ql tour
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

        // tour yêu thích
        Task<PageDTO<FavoriteTourRepnoseDTO>> GetFavoriteToursAsync(int userId, int pageNumber = 1, int pageSize = 10);
        Task<bool> DeleteFavoriteToursAsync(int userId, List<int> tourIds);
        Task<bool> AddFavoriteTourAsync(int userId, int tourId);
        Task<Tour> GetTourByIdAsync(int id);
        //Home
        //chưa đăng nhập
        Task<List<Tour>> GetTopTrendingToursAsync(); // ds tour host 
        Task<List<TourCardDTO>> GetBestToursCardAsync(); // tour nổi bật
        Task<List<TourCardDTO>> GetLatestToursAsync(); // tour mới
        //đăng nhập
        Task<List<TourCardDTO>> GetTourDesignJustForYouAsync(int userId); // tour dành riêng cho bạn

        Task<List<TourCardDTO>> GetRecommendedToursAsync(int userId); // Có thể bạn quan tâm

        Task<List<TourCardDTO>> GetNextTripSuggestionsAsync(int userId); // gợi ý cho chuyến tiếp theo

        Task<PageDTO<TourCardDTO>> GetFilteredToursAsync(TourFilterParamsDTO p); // tìm kiếm tour
    }
}
