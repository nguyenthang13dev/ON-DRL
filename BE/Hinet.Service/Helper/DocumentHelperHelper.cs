using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using Microsoft.AspNetCore.Http;
using System.Text;
using System.IO;
using DocumentFormat.OpenXml.Packaging;

namespace Hinet.Service.Helper
{
    public static class DocumentHelper
    {
        /// <summary>
        /// Xử lý trích xuất nội dung từ file PDF hoặc DOCX
        /// </summary>
        public static string ExtractText(IFormFile file)
        {
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            return extension switch
            {
                ".pdf" => ExtractTextFromPdf(file),
                ".docx" => ExtractTextFromDocx(file),
                ".doc" => throw new NotSupportedException("Định dạng .doc chưa được hỗ trợ. Vui lòng chuyển sang .docx."),
                _ => throw new NotSupportedException("Định dạng file không được hỗ trợ.")
            };
        }

        /// <summary>
        /// Trích xuất nội dung từ PDF bằng iText7
        /// </summary>
        public static string ExtractTextFromPdf(IFormFile file)
        {
            var text = new StringBuilder();

            using var stream = file.OpenReadStream();
            using var pdfReader = new PdfReader(stream);
            using var pdfDoc = new PdfDocument(pdfReader);

            int numberOfPages = pdfDoc.GetNumberOfPages();

            for (int i = 1; i <= numberOfPages; i++)
            {
                var page = pdfDoc.GetPage(i);
                var content = PdfTextExtractor.GetTextFromPage(page);
                text.AppendLine(content);
            }

            return text.ToString();
        }

        /// <summary>
        /// Trích xuất nội dung từ DOCX bằng OpenXML SDK
        /// </summary>
        public static string ExtractTextFromDocx(IFormFile file)
        {
            using var stream = file.OpenReadStream();
            using var wordDoc = WordprocessingDocument.Open(stream, false);
            var body = wordDoc.MainDocumentPart?.Document?.Body;

            return body?.InnerText ?? string.Empty;
        }
    }
}
