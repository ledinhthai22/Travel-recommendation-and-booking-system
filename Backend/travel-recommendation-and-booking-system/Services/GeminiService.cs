using GenerativeAI;

namespace travel_recommendation_and_booking_system.Services
{
    public class GeminiService
    {
        private readonly string _apiKey;

        public GeminiService(IConfiguration configuration)
        {
            _apiKey = configuration["GeminiSettings:ApiKey"];
        }

        public async Task<string> AnalyzeReviewSentiment(string noiDung)
        {
            try
            {
                var model = new GenerativeModel("gemini-1.5-flash", _apiKey);

                string prompt = $"Phân tích cảm xúc bình luận du lịch sau: '{noiDung}'. " +
                                "Nếu là khen ngợi hoặc bình thường, trả về 'Positive'. " +
                                "Nếu là chê bai, tiêu cực hoặc thô tục, trả về 'Negative'. " +
                                "Không giải thích, chỉ trả về đúng 1 từ duy nhất.";

                var response = await model.GenerateContentAsync(prompt);
                return response.Text.Trim();
            }
            catch
            {
                return "Negative";
            }
        }

    }
}
