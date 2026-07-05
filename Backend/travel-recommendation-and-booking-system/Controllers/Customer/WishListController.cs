using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using travel_recommendation_and_booking_system.Constants;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Controllers.Customer
{
    [Route("api/customer/[controller]")]
    [ApiController]
    [Authorize(Policy = "UserOnly")]
    public class WishListController : ControllerBase
    {
        private readonly ITourService _tour;
        private readonly IRecommendationService _recommendation;
        private readonly ITourRecommendationService _tourRecommendation;
        private readonly ICurrentUserService _currentUserService;
        public WishListController(ITourService tour, IRecommendationService recommendation, ITourRecommendationService tourRecommendation,ICurrentUserService currentUserService)
        {
            _tour = tour;
            _recommendation = recommendation;
            _tourRecommendation = tourRecommendation;
            _currentUserService = currentUserService;
        }

        [HttpGet("wishlist-ids")]
        public async Task<IActionResult> GetWishlistIds()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int maNguoiDung))
                return Unauthorized();

            var ids = await _tour.GetFavoriteTourIdsAsync(maNguoiDung);
            return Ok(ids);
        }

        [HttpGet]
        public async Task<IActionResult> GetWishlist([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int maNguoiDung))
            {
                return Unauthorized("Không xác định được danh tính người dùng.");
            }

            try
            {
                var data = await _tour.GetFavoriteToursAsync(maNguoiDung, pageNumber, pageSize);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        [HttpPost("{tourId}")]
        public async Task<IActionResult> AddToWishlist(int tourId)
        {
            // 1. Xác thực người dùng
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int maNguoiDung))
            {
                return Unauthorized(new { message = "Không xác định được danh tính người dùng." });
            }
            try
            {
                var isSuccess = await _tour.AddFavoriteTourAsync(maNguoiDung, tourId);
                await _recommendation.UpdatePreference(
                    maNguoiDung,
                    tourId,
                    RecommendationWeights.WishlistTour,
                    true
                );
                if (isSuccess)
                {
                    var tour = await _tour.GetTourByIdAsync(tourId);
                    return Ok(new { message = "Đã thêm vào danh sách yêu thích thành công!" });
                }

                return BadRequest(new { message = "Tour không tồn tại hoặc đã có sẵn trong danh sách yêu thích của bạn." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi hệ thống: {ex.Message}" });
            }

        }

        [HttpDelete]
        public async Task<IActionResult> DeleteWishlist([FromBody] List<int> tourIds)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int maNguoiDung))
            {
                return Unauthorized("Không xác định được danh tính người dùng.");
            }

            try
            {
                var isSuccess = await _tour.DeleteFavoriteToursAsync(maNguoiDung, tourIds);
                if (isSuccess)
                {
                    foreach (var tourId in tourIds)
                    {
                        await _recommendation.UpdatePreference(
                            maNguoiDung,
                            tourId,
                            RecommendationWeights.WishlistTour,
                            false
                        );
                    }

                    return Ok(new
                    {
                        message = "Đã xóa khỏi danh sách yêu thích thành công!"
                    });
                }
                if (isSuccess)
                {


                    return Ok(new { message = "Đã xóa khỏi danh sách yêu thích thành công!" });
                }

                return BadRequest(new { message = "Không tìm thấy tour cần xóa hoặc danh sách ID rỗng." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi hệ thống: {ex.Message}" });
            }
        }

        [HttpPost("confirm-interest/{id}")]
        public async Task<IActionResult> ConfirmInterest(int id)
        {
            var tour = await _tour.GetTourByIdAsync(id);
            if (tour == null) return NotFound();

            var currentUser = _currentUserService.GetUserId();
            await _tourRecommendation.TrackDeepInterestAsync(
               currentUser,
               id
           );
            return Ok();
        }

    }
}
