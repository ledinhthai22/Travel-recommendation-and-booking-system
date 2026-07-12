using Microsoft.Extensions.Caching.Memory;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Services
{
    public class BannerCacheService : IBannerCacheService
    {
        private readonly IMemoryCache _cache;

        private const string DetailVersionPrefix = "banner:cache:version:detail:";
        private const string ListVersionKey = "banner:cache:version:list";
        private const string ActiveVersionKey = "banner:cache:version:active";

        private static readonly TimeSpan VersionTtl = TimeSpan.FromDays(1);

        public BannerCacheService(IMemoryCache cache)
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

        public string DetailKey(int bannerId)
        {
            var version = GetVersion(DetailVersionPrefix + bannerId);
            return $"v{version}:banner:detail:{bannerId}";
        }

        public string ListKey(string suffix)
        {
            var version = GetVersion(ListVersionKey);
            return $"v{version}:banner:list:{suffix}";
        }

        public string ActiveKey()
        {
            var version = GetVersion(ActiveVersionKey);
            return $"v{version}:banner:active";
        }

        public void InvalidateBannerDetail(int bannerId)
        {
            BumpVersion(DetailVersionPrefix + bannerId);
            InvalidateActive();
        }

        public void InvalidateLists()
        {
            BumpVersion(ListVersionKey);
        }

        public void InvalidateActive()
        {
            BumpVersion(ActiveVersionKey);
        }

        public void InvalidateAll()
        {
            BumpVersion(ListVersionKey);
            BumpVersion(ActiveVersionKey);
        }
    }
}