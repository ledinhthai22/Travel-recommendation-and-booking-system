using DTOs.Page;
using travel_recommendation_and_booking_system.DTOs;
using travel_recommendation_and_booking_system.DTOs.Promotion;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IPromotionService
    {
        Task<PageDTO<PromotionResponseDTO>> GetPagedPromotionsAsync(int pageNumber, int pageSize, PromotionDTO promotion); // lấy danh sách tất cả ưu đãi
        Task<PromotionResponseDTO?> GetPromotionByIdAsync(int id); // lấy thông tin chi tiết của ưu đãi
        Task<PromotionResponseDTO> CreateAsync(PromotionDTO promotion); // Tạo ưu đãi
        Task<PromotionResponseDTO?> UpdateAsync(int id, PromotionDTO promotion); // Cập nhật ưu đãi
        Task<bool> ChangeStatusAsync(int id, bool isActive); // thay đổi trạng thái ưu đãi
        Task<bool> DeleteAsync(int id); // xóa ưu đãi
        Task<List<PromotionResponseDTO>> GetPromotionsForSelectAsync(int? status = null);
    }
}
