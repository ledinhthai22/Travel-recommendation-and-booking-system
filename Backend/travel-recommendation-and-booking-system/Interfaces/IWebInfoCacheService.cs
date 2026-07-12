using travel_recommendation_and_booking_system.DTOs.WebInfo;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IWebInfoCacheService
    {
        string DetailKey(int webInfoId);
        string KeyDetailKey(string key);
        string ListKey(string suffix);
        string SettingsKey();
        void InvalidateWebInfoDetail(int webInfoId, string? key = null);
        void InvalidateSettings();
        void InvalidateLists();
        void InvalidateAll();
    }
}