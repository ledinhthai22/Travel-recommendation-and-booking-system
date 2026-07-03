using System.Text;
using System.Text.Json;

namespace travel_recommendation_and_booking_system.Services
{
    public class GeminiService
    {
        private readonly string _apiKey;
        private readonly string _modelUrl;
        private static readonly HttpClient _httpClient = new HttpClient();

        public GeminiService(IConfiguration configuration)
        {
            _apiKey = configuration["GeminiSettings:ApiKey"];
            _modelUrl = configuration["GeminiSettings:ModelUrl"];
        }

        public async Task<string> AnalyzeReviewSentiment(string noiDung)
        {
            try
            {
                string prompt = $@"Nhiệm vụ: Phân tích cảm xúc bình luận du lịch.
                Bình luận: '{noiDung}'
                Quy tắc: Trả về duy nhất 1 trong 2 từ sau: 'Positive' hoặc 'Negative'. Không thêm bất kỳ từ ngữ nào khác.";

                string url = _modelUrl + _apiKey;

                var requestBody = new
                {
                    contents = new[]
                    {
                        new { parts = new[] { new { text = prompt } } }
                    }
                };

                var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(url, content);

                if (!response.IsSuccessStatusCode) return "Error";

                string jsonResponse = await response.Content.ReadAsStringAsync();

                using var document = JsonDocument.Parse(jsonResponse);
                var text = document.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text").GetString()?.Trim() ?? "";

                if (text.Contains("Positive", StringComparison.OrdinalIgnoreCase)) return "Positive";
                if (text.Contains("Negative", StringComparison.OrdinalIgnoreCase)) return "Negative";

                return "Neutral";
            }
            catch (Exception)
            {
                return "Error";
            }
        }
    }
}