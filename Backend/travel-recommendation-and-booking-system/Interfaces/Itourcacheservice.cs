namespace travel_recommendation_and_booking_system.Interfaces
{

    public interface ITourCacheService
    {

        string DetailKey(int tourId);


        string DetailSlugKey(string slug);


        string ListKey(string suffix);


        void InvalidateTourDetail(int tourId, string? slug = null);

        void InvalidateLists();
    }
}