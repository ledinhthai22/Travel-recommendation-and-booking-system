using Microsoft.Extensions.Caching.Memory;
using travel_recommendation_and_booking_system.Interfaces;

namespace Services
{
    public class WebInfoCacheService : IWebInfoCacheService
    {
        private readonly IMemoryCache _cache;

        private const string DetailVersionPrefix = "webinfo:cache:version:detail:";
        private const string KeyVersionPrefix = "webinfo:cache:version:key:";
        private const string SettingsVersionKey = "webinfo:cache:version:settings";
        private const string ListVersionKey = "webinfo:cache:version:list";

        private static readonly TimeSpan VersionTtl = TimeSpan.FromDays(1);

        public WebInfoCacheService(IMemoryCache cache)
        {
            _cache = cache;
        }

        private int GetVersion(string versionKey)
        {
            return _cache.GetOrCreate(versionKey, entry =>
            {
                entry.SlidingExpiration = VersionTtl;
                return 1;
            });
        }

        private void BumpVersion(string versionKey)
        {
            var current = GetVersion(versionKey);
            _cache.Set(versionKey, current + 1, VersionTtl);
        }

        public string DetailKey(int webInfoId)
        {
            var version = GetVersion(DetailVersionPrefix + webInfoId);
            return $"v{version}:webinfo:detail:{webInfoId}";
        }

        public string KeyDetailKey(string key)
        {
            var normalized = key.Trim().ToLower();
            var version = GetVersion(KeyVersionPrefix + normalized);
            return $"v{version}:webinfo:key:{normalized}";
        }

        public string ListKey(string suffix)
        {
            var version = GetVersion(ListVersionKey);
            return $"v{version}:webinfo:list:{suffix}";
        }

        public string SettingsKey()
        {
            var version = GetVersion(SettingsVersionKey);
            return $"v{version}:webinfo:settings";
        }

        public void InvalidateWebInfoDetail(int webInfoId, string? key = null)
        {
            BumpVersion(DetailVersionPrefix + webInfoId);

            if (!string.IsNullOrWhiteSpace(key))
            {
                var normalized = key.Trim().ToLower();
                BumpVersion(KeyVersionPrefix + normalized);
            }

            InvalidateSettings();
        }

        public void InvalidateSettings()
        {
            BumpVersion(SettingsVersionKey);
        }

        public void InvalidateLists()
        {
            BumpVersion(ListVersionKey);
        }

        public void InvalidateAll()
        {
            BumpVersion(SettingsVersionKey);
            BumpVersion(ListVersionKey);
        }
    }
}