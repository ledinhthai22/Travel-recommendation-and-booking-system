using travel_recommendation_and_booking_system.DTOs.Banner;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IBannerCacheService
    {
        string DetailKey(int bannerId);
        string ListKey(string suffix);
        string ActiveKey();
        void InvalidateBannerDetail(int bannerId);
        void InvalidateLists();
        void InvalidateActive();
        void InvalidateAll();
    }
}