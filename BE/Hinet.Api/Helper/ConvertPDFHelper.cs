using Hinet.Service.TaiLieuDinhKemService;
using IronPdf;
using Microsoft.AspNetCore.Hosting;
namespace Hinet.Api.Hellper
{
    //Helper dùng để convert về pdf
    public class ConvertPDFHelper
    {
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ConvertPDFHelper(ITaiLieuDinhKemService taiLieuDinhKemService, IWebHostEnvironment webHostEnvironment)
        {
            _taiLieuDinhKemService = taiLieuDinhKemService;
            _webHostEnvironment = webHostEnvironment;
        }
        private const string BASE_PATH = "wwwroot/uploads/";
        public static readonly List<string> AllowedTypeImage = new List<string>
        {
            ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff"
        };
        public static readonly List<string> AllowedTypePPTX = new List<string>
        {
            ".pptx", ".ppt" 
        };
        public async Task<bool>? ConvertImageToPdf(string filePath,string AttachId)
        {
            try
            {
                // Định nghĩa đường dẫn thư mục convert
                string outputFolder = Path.Combine(_webHostEnvironment.ContentRootPath, $"{BASE_PATH}convert/");
                // Lấy danh sách file từ service
                var attachments = await _taiLieuDinhKemService.GetByIdsAsync(AttachId);

                if (attachments is not null && attachments.Any())
                {
                    var attach = attachments.FirstOrDefault();
                    if (attach is null) return false; // Kiểm tra null an toàn
                    // Tạo tên file mới
                    string timestamp = DateTime.Now.ToString("dd_MM_yyyy_HH_mm_ss");
                    string fileName = $"{timestamp}_{attach.TenTaiLieu.Substring(0, attach.TenTaiLieu.LastIndexOf("."))}.pdf";
                    string outputFilePath = Path.Combine(outputFolder, fileName);
                    // Kiểm tra và tạo thư mục nếu chưa tồn tại
                    if (!Directory.Exists(outputFolder))
                    {
                        Directory.CreateDirectory(outputFolder);
                    }
                    // Chuyển đổi ảnh sang PDF
                    string inputFilePath = Path.Combine(_webHostEnvironment.ContentRootPath, $"{BASE_PATH}{filePath}");
                    using (PdfDocument pdf = ImageToPdfConverter.ImageToPdf(inputFilePath))
                    {
                        pdf.SaveAs(outputFilePath);
                    }
                    // Cập nhật đường dẫn file PDF vào DB
                    attach.DuongDanFilePDF = $"/convert/{fileName}";
                    await _taiLieuDinhKemService.AddOrEditPath($"/convert/{fileName}", attach.Id);

                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        //Helper dùng để convert pptx
        public  void ConvertPPTXToPdf(string filePath = "", string fileName = "")
        {
            string outfilePath = "/wwwroot/uploads/convert/";
            outfilePath = outfilePath + Guid.NewGuid().ToString() + fileName;
            PdfDocument pdf = ImageToPdfConverter.ImageToPdf(filePath);
            pdf.SaveAs(outfilePath);
        }
        //Helper dùng để convert html string
        public  void ConvertHTMLStrToPdf(string filePath = "", string fileName = "")
        {
            string outfilePath = "/wwwroot/uploads/convert/";
            outfilePath = outfilePath + Guid.NewGuid().ToString() + fileName;
            PdfDocument pdf = ImageToPdfConverter.ImageToPdf(filePath);
            pdf.SaveAs(outfilePath);
        }
    }
}
