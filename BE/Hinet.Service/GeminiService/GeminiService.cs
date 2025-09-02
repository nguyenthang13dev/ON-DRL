using Hinet.Service.GeminiService.Response;
using Hinet.Service.Helper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Hinet.Service.GeminiService
{
    public class GeminiService : IGeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly string _geminiApiKey; // TODO: Đọc từ cấu hình appsettings

        public GeminiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;

            _geminiApiKey = _configuration["Gemini:ApiKey"];

            if (string.IsNullOrWhiteSpace(_geminiApiKey))
            {
                throw new ArgumentException("Gemini API Key is missing in appsettings.json (Gemini:ApiKey)");
            }
        }

        public async Task<string?> AnalyzeCvTextAsync(string cvText)
        {
            var prompt = @$"
Hãy phân tích nội dung CV dưới đây để trích xuất dữ liệu và chỉ trả về chuỗi JSON (không bao quanh bởi 
hoặc giải thích).

JSON phải bao gồm các trường: FullName, DateOfBirth, Hometown, Email, PhoneNumber. Nếu không tìm thấy thông tin của trường nào thì để null, chú ý trường DateOfBirth trả về dạng dd/mm/yyyy.

CV:
{cvText}
";

            var request = new
            {
                contents = new[]
                {
            new
            {
                parts = new[]
                {
                    new { text = prompt }
                }
            }
        }
            };

            var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");
            var url = $"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key={_geminiApiKey}";

            var response = await _httpClient.PostAsync(url, content);

            if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
            {
                // Đạt giới hạn free tier
                return null;
            }

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Gemini API error: {response.StatusCode} - {error}");
            }

            var responseJson = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseJson);
            var root = doc.RootElement;

            var text = root
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return text ?? "";
        }

        public async Task<string?> AnalyzeCVFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File không hợp lệ");

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var fileBytes = memoryStream.ToArray();
            var base64Content = Convert.ToBase64String(fileBytes);

            var mimeType = file.ContentType; // Ví dụ: "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

            var promptText = @"
Hãy phân tích file CV đính kèm và trích xuất dữ liệu dưới dạng chuỗi JSON (không được thêm lời giải thích hay văn bản ngoài JSON).

JSON phải gồm: FullName, DateOfBirth, Hometown, Email, PhoneNumber. Nếu không tìm thấy thông tin, hãy để null. Trường DateOfBirth định dạng dd/mm/yyyy.";

            var requestBody = new
            {
                contents = new[]
                {
            new
            {
                parts = new object[]
                {
                    new { text = promptText },
                    new
                    {
                        inline_data = new
                        {
                            mime_type = mimeType,
                            data = base64Content
                        }
                    }
                }
            }
        }
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var url = $"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key={_geminiApiKey}";

            var response = await _httpClient.PostAsync(url, content);

            if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
            {
                return null;
            }

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Gemini API error: {response.StatusCode} - {error}");
            }

            var responseJson = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseJson);
            var root = doc.RootElement;

            var result = root
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return result ?? "";
        }


    }
}