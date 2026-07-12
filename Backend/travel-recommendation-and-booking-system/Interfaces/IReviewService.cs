using DTOs.Page;
using travel_recommendation_and_booking_system.DTOs.Review;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IReviewService
    {
        //ql
        Task<PageDTO<ReviewReponseDTO>> GetReviewsAsync(int page, int pageSize, string? key, int? diem, bool? trangThai);
        Task<bool> UpdateReviewStatusAsync(int maDanhGia, bool trangThai);
        Task<int> BatchUpdateStatusAsync(List<int> ids, bool trangThai);
        //user
        Task AddReviewAsync(ReviewDTO dto);
        Task ProcessReviewsBatchAsync();
        //client
        Task<List<ReviewReponseDTO>> GetTop3ReviewAsync();
        Task<ReviewDetailDTO?> GetReviewDetailAsync(int maDanhGia);

    }
}
