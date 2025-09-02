using Microsoft.AspNetCore.StaticFiles;

namespace Hinet.Api.Hellper
{
    public static class ConvertToBase64
    {
        private const string BASE_PATH = "wwwroot/uploads/";
        public static string GetContentFile(string filePath, IWebHostEnvironment webHostEnvironment)
        {
            if (string.IsNullOrWhiteSpace(filePath))
            {
                throw new ArgumentNullException(nameof(filePath));
            }

            filePath = BASE_PATH + filePath;
            
            var fullPath = Path.Combine(webHostEnvironment.ContentRootPath, filePath);
            var provider = new FileExtensionContentTypeProvider();

            if (File.Exists(fullPath))
            {
                string contentType;
                if (!provider.TryGetContentType(filePath, out contentType))
                {
                    contentType = "application/octet-stream"; // Default content type
                }

               
                var fileBytes = File.ReadAllBytes(fullPath); // Sửa thành `fullPath`
                var base64String = $"data:{contentType};base64,{Convert.ToBase64String(fileBytes)}";
                return base64String;
            }

            return string.Empty;
        }

        public static string GetBase64Content(string base64String)
        {
            if (string.IsNullOrEmpty(base64String))
                return string.Empty; // Nếu rỗng, trả về chuỗi rỗng

            var parts = base64String.Split(',');
            return parts.Length > 1 ? parts[1] : string.Empty; // Tránh lỗi IndexOutOfRange
        }
    }
}
