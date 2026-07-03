namespace travel_recommendation_and_booking_system.Interfaces
{
    public record TrainResult(int RowCount, string ModelPath, bool Success, string? Message = null);

    public interface ITourRecommendationTrainer
    {
        Task<TrainResult> TrainAndSaveAsync(string outputPath = "Models/tour-recommender.zip");
    }
}