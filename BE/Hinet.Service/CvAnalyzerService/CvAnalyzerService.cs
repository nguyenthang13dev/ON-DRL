using Hinet.Service.GeminiService.Response;
using Hinet.Service.GeminiService;
using Hinet.Service.Helper;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hinet.Service.CvAnalyzerService.Dto;
using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace Hinet.Service.CvAnalyzerService
{

        public class CvAnalyzerService : ICvAnalyzerService
        {
            private readonly IGeminiService _geminiService;
        private readonly ILogger<CvAnalyzerService> _logger;

            public CvAnalyzerService(IGeminiService geminiService, ILogger<CvAnalyzerService> logger)
            {
                _geminiService = geminiService;
            _logger = logger;
            }

        public async Task<CvAnalyzeDto?> AnalyzeCvAsync(IFormFile file)
        {
         

            string? responseText = null;
            try
            {
                // Phân tích cv thành text rồi gemini mới phân tích 
                //responseText = await _geminiService.AnalyzeCvTextAsync(cvText);

                responseText = await _geminiService.AnalyzeCVFileAsync(file);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi gọi Gemini API");
                // Trường hợp có lỗi khác như network, bạn vẫn fallback
            }

            // Nếu responseText null, có thể do rate limit hoặc lỗi -> dùng local extractor
            if (string.IsNullOrWhiteSpace(responseText))
            {
                var cvText = DocumentHelper.ExtractText(file);
                _logger.LogInformation("cvText: {cvText}", cvText);

                if (string.IsNullOrWhiteSpace(cvText) || cvText.Trim().Length < 10)
                {
                    return null;
                }
                _logger.LogWarning("Gemini API bị giới hạn hoặc không phản hồi. Sử dụng fallback local CVExtractor.");
                responseText = CVExtractor.ExtractInfoAsJson(cvText);
            }

            var jsonOnly = ExtractJsonFromText(responseText);
            if (string.IsNullOrWhiteSpace(jsonOnly))
            {
                _logger.LogError("Không tìm được JSON hợp lệ trong responseText");
                return null;
            }

            try
            {
                return JsonSerializer.Deserialize<CvAnalyzeDto>(jsonOnly);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi deserialize CvAnalyzeDto từ jsonText: {jsonOnly}", jsonOnly);
                return null;
            }
        }


        private string ExtractJsonFromText(string rawText)
        {
            int start = rawText.IndexOf('{');
            int end = rawText.LastIndexOf('}');

            if (start >= 0 && end >= 0 && end > start)
            {
                return rawText.Substring(start, end - start + 1);
            }

            return null;
        }



    }

}
