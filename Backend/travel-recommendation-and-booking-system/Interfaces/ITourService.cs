using DTOs.Page;
using travel_recommendation_and_booking_system.DTOs;
using travel_recommendation_and_booking_system.DTOs.FavoriteTour;
using travel_recommendation_and_booking_system.DTOs.Tour;
using travel_recommendation_and_booking_system.DTOs.TypeTour;
using travel_recommendation_and_booking_system.Models;

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
        Task<List<TourSelectDTO>> GetToursForSelectAsync(string? keyword = null, int? status = null);


        Task<List<int>> GetFavoriteTourIdsAsync(int userId);
        Task<PageDTO<FavoriteTourRepnoseDTO>> GetFavoriteToursAsync(int userId, int pageNumber = 1, int pageSize = 10);
        Task<bool> DeleteFavoriteToursAsync(int userId, List<int> tourIds);
        Task<bool> AddFavoriteTourAsync(int userId, int tourId);
        Task<Tour> GetTourByIdAsync(int id);
        Task<List<TourCardResponseDTO>> GetFeaturedToursAsync(int take = 12);
        Task<List<TourCardResponseDTO>> GetNewlyUpdatedToursAsync(int take = 8);
        Task<List<TourCardResponseDTO>> GetToursByFeaturedDestinationAsync(string diemDen, int take = 6);
        Task<List<TourCardResponseDTO>> GetMostBookedToursAsync(int take = 8);
        Task<PageDTO<TourCardDTO>> FilterToursAsync(FilterTourDTO request);
        Task<List<TourCardDTO>> GetRelatedToursAsync(int maTour, int take = 6);
        Task<List<TourCardResponseDTO>> GetRelatedToursByHotelAsync(int maKhachSan);
        Task<PageDTO<SearchResponse>> SearchToursAsync(SearchDTO request);
    }
}