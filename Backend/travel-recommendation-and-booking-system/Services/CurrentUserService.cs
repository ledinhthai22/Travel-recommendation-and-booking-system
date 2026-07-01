using System.Security.Claims;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int GetUserId()
        {
            var value = _httpContextAccessor.HttpContext?
                .User?
                .FindFirst(ClaimTypes.NameIdentifier)?
                .Value;

            if (!int.TryParse(value, out int id))
            {
                throw new UnauthorizedAccessException("Không tìm thấy UserId trong token.");
            }

            return id;
        }

        public int GetRoleId()
        {
            var value = _httpContextAccessor.HttpContext?
                .User?
                .FindFirst(ClaimTypes.Role)?
                .Value;

            if (!int.TryParse(value, out int id))
            {
                throw new UnauthorizedAccessException("Không tìm thấy RoleId trong token.");
            }

            return id;
        }

        public string GetEmail()
        {
            var email = _httpContextAccessor.HttpContext?
                .User?
                .FindFirst(ClaimTypes.Email)?
                .Value;

            if (string.IsNullOrWhiteSpace(email))
            {
                throw new UnauthorizedAccessException("Không tìm thấy Email trong token.");
            }

            return email;
        }
    }
}