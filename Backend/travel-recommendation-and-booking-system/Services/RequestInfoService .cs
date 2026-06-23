using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Services
{
    public class RequestInfoService : IRequestInfoService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RequestInfoService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string? GetIpAddress()
        {
            var context = _httpContextAccessor.HttpContext;

            var forwardedIp = context?.Request.Headers["X-Forwarded-For"].FirstOrDefault();

            if (!string.IsNullOrWhiteSpace(forwardedIp))
                return forwardedIp;

            return context?.Connection.RemoteIpAddress?.ToString();
        }
        public string? GetUserAgent()
        {
            return _httpContextAccessor.HttpContext?
                .Request.Headers["User-Agent"]
                .ToString();
        }
    }
}
