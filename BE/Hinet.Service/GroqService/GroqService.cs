using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Hinet.Service.GroqService
{
    public class GroqService : IGroqService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly string _groqApiKey; // Đọc từ cấu hình appsettings

        public GroqService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;

            _groqApiKey = _configuration["Groq:ApiKey"];

            if (string.IsNullOrWhiteSpace(_groqApiKey))
            {
                throw new ArgumentException("Groq API Key is missing in appsettings.json (Groq:ApiKey)");
            }

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _groqApiKey);
        }

        public async Task<string> AnalyzeCvTextAsync(string cvText)
        {
            var prompt = @$"
Hãy phân tích nội dung CV dưới đây để trích xuất dữ liệu và chỉ trả về dạng JSON (Chỉ trả về một JSON duy nhất, không thêm giải thích, không thêm tiêu đề, không dùng markdown hoặc ```).

JSON phải bao gồm các trường: FullName, DateOfBirth, Hometown, Email, PhoneNumber. Nếu không tìm thấy thông tin của trường nào thì để null, chú ý trường DateOfBirth trả về dạng dd/mm/yyyy.

CV:
{cvText}
";

            var request = new
            {
                model = "llama3-70b-8192",
                messages = new[]
                {
                    new { role = "user", content = prompt }
                },
                temperature = 0.3
            };

            var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");
            var url = "https://api.groq.com/openai/v1/chat/completions";

            var response = await _httpClient.PostAsync(url, content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Groq API error: {response.StatusCode} - {error}");
            }

            var responseString = await response.Content.ReadAsStringAsync();

            // Giải mã JSON từ Groq format
            using var jsonDoc = JsonDocument.Parse(responseString);
            var contentText = jsonDoc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return contentText;
        }
    }
}
