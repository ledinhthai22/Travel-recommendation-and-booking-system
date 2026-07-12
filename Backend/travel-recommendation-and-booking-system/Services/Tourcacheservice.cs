using Microsoft.Extensions.Caching.Memory;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Services
{

    public class TourCacheService : ITourCacheService
    {
        private readonly IMemoryCache _cache;

        private const string ListVersionKey = "tour:cache:version:list";
        private const string DetailVersionPrefix = "tour:cache:version:detail:";
        private const string DetailSlugVersionPrefix = "tour:cache:version:detail:slug:";

        private static readonly TimeSpan VersionTtl = TimeSpan.FromDays(1);

        public TourCacheService(IMemoryCache cache)
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

        public string DetailKey(int tourId)
        {
            var version = GetVersion(DetailVersionPrefix + tourId);
            return $"v{version}:tour:detail:{tourId}";
        }

        public string DetailSlugKey(string slug)
        {
            var normalized = slug.Trim().ToLower();
            var version = GetVersion(DetailSlugVersionPrefix + normalized);
            return $"v{version}:tour:detail:slug:{normalized}";
        }

        public string ListKey(string suffix)
        {
            var version = GetVersion(ListVersionKey);
            return $"v{version}:{suffix}";
        }

        public void InvalidateTourDetail(int tourId, string? slug = null)
        {
            BumpVersion(DetailVersionPrefix + tourId);

            if (!string.IsNullOrWhiteSpace(slug))
            {
                var normalized = slug.Trim().ToLower();
                BumpVersion(DetailSlugVersionPrefix + normalized);
            }
        }

        public void InvalidateLists()
        {
            BumpVersion(ListVersionKey);
        }
    }
}