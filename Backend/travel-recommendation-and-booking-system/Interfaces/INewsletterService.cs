using DTOs.Newsletter;
using DTOs.Page;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface INewsletterService
    {
        Task<bool> SubscribeAsync(NewsletterDTO newsletter); // gửi newsletter
        Task<PageDTO<NewsletterResponseDTO>> GetPagedNewslettersAsync(string? keyword,int page,int size); // danh sách tìm kiếm newsletter
        Task<bool> SoftDeleteNewsletterAsync(int id); // xóa mềm
    }
}
