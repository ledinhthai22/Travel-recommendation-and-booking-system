using travel_recommendation_and_booking_system.DTOs;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface INewsletterService
    {
        Task<bool> SubscribeAsync(NewsletterDTO newsletter); // gửi newsletter
        Task<PageDTO<NewsletterResponseDTO>> GetPagedNewslettersAsync(int pageNumber, int pageSize); // danh sách newsletter
    }
}
