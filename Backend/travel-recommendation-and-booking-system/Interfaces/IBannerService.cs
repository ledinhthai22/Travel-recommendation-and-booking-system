using DTOs.Page;
using travel_recommendation_and_booking_system.DTOs.Banner;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IBannerService
    {
        Task<BannerResponseDTO> GetBanner();
        Task<PageDTO<BannerResponseDTO>> GetBannerAsync(int pageNumber, int pageSize, string? key, bool? status); // danh sách tìm kiếm banner
        Task<bool> CreateBannerAsync(BannerDTO banner); // thêm banner
        Task<bool> UpdateBannerAsync(int id, BannerDTO request); // update thông tin banner
        Task<bool> SoftDeleteBannerAsync(int id); // cập nhật trạng thái (xóa mềm)
    }
}
