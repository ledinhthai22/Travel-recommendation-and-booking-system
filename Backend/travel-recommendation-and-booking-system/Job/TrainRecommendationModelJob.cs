using Hangfire;
using travel_recommendation_and_booking_system.Interfaces;

namespace travel_recommendation_and_booking_system.Job
{
    public class TrainRecommendationModelJob
    {
        private readonly ITourRecommendationTrainer _trainer;
        private readonly ILogger<TrainRecommendationModelJob> _logger;

        public TrainRecommendationModelJob(
            ITourRecommendationTrainer trainer,
            ILogger<TrainRecommendationModelJob> logger)
        {
            _trainer = trainer;
            _logger = logger;
        }

        [AutomaticRetry(Attempts = 3)]
        public async Task TrainRecommendationModel()
        {


            var result = await _trainer.TrainAndSaveAsync();

            if (result.Success)
            {
                _logger.LogInformation(result.Message);
            }
            else
            {
                _logger.LogWarning(result.Message);
            }
        }
    }
}