//using System.ComponentModel;
//using System.Diagnostics;
//using System.Security.Cryptography.X509Certificates;
//using CommonHelper.File;
//using iTextSharp.text.pdf;
//using iTextSharp.text.pdf.security;
//using QuestPDF.Fluent;
//using QuestPDF.Helpers;
//using QuestPDF.Infrastructure;


//namespace CommonHelper.Pdf
//{
//    public static class PdfHelper
//    {
//        private const string BASE_PATH = "/wwwroot/uploads";

//        private static int GetPdfPageCount(string pdfPath)
//        {
//            using (var reader = new PdfReader(pdfPath))
//            {
//                return reader.NumberOfPages;
//            }
//        }

//        public static PdfConvertOutput GetPdfConvertOutput(string inputPath)
//        {
//            var fullPath = FileHelper.GetAbsoluteFilePath(inputPath);

//            if (!System.IO.File.Exists(fullPath))
//            {
//                throw new FileNotFoundException("File đầu vào không tồn tại.", fullPath);
//            }

//            string outputDir = Path.GetDirectoryName(fullPath);
//            string outputFileName = Path.GetFileNameWithoutExtension(fullPath) + ".pdf";
//            string outputPath = Path.Combine(outputDir, outputFileName);

//            if (!Path.GetExtension(fullPath).Equals(".pdf", StringComparison.OrdinalIgnoreCase))
//            {
//                string libreOfficePath = @"C:\Program Files\LibreOffice\program\soffice.exe";

//                if (System.IO.File.Exists(outputPath))
//                {
//                    System.IO.File.Delete(outputPath);
//                }

//                var startInfo = new ProcessStartInfo
//                {
//                    FileName = libreOfficePath,
//                    Arguments = $"--headless --convert-to pdf --outdir \"{outputDir}\" \"{fullPath}\"",
//                    CreateNoWindow = true,
//                    UseShellExecute = false,
//                    RedirectStandardOutput = true,
//                    RedirectStandardError = true
//                };

//                using (var process = Process.Start(startInfo))
//                {
//                    string output = process.StandardOutput.ReadToEnd();
//                    string error = process.StandardError.ReadToEnd();
//                    process.WaitForExit();

//                    if (process.ExitCode != 0)
//                    {
//                        throw new Exception($"Không thể tạo file PDF.\nExitCode: {process.ExitCode}\nError: {error}");
//                    }
//                }

//                if (!System.IO.File.Exists(outputPath))
//                {
//                    throw new Exception("Không tìm thấy file PDF sau khi chuyển đổi.");
//                }
//            }
//            else
//            {
//                outputPath = fullPath;
//            }

//            string relativePdfPath = FileHelper.GetRelativeFilePath(outputPath);

//            return new PdfConvertOutput
//            {
//                PdfPath = relativePdfPath,
//                SoTo = GetPdfPageCount(outputPath)
//            };
//        }

//        public static async Task<string> ExportToPdf<T>(IEnumerable<T> data)
//        {
//            if (data == null || !data.Any())
//            {
//                // Trả về file PDF rỗng nếu không có dữ liệu
//                return await CreateEmptyPdfFile();
//            }

//            QuestPDF.Settings.License = LicenseType.Community;

//            var properties = typeof(T).GetProperties();

//            var stream = new MemoryStream();

//            Document.Create(container =>
//            {
//                container.Page(page =>
//                {
//                    page.Size(PageSizes.A4);
//                    page.Margin(1, Unit.Centimetre);
//                    page.PageColor(Colors.White);
//                    page.DefaultTextStyle(x => x.FontSize(10));

//                    page.Content().Table(table =>
//                    {
//                        table.ColumnsDefinition(columns =>
//                        {
//                            columns.RelativeColumn(1f);
//                            foreach (var prop in properties)
//                                columns.RelativeColumn(3f); 
//                        });

//                        // Header
//                        table.Header(header =>
//                        {
//                            // STT
//                            header.Cell()
//                                .Border(0.5f)
//                                .Background(Colors.Grey.Lighten3)
//                                .AlignCenter()
//                                .PaddingTop(5)
//                                .Text("STT")
//                                .Bold()
//                                .FontSize(11);
//                            foreach (var prop in properties)
//                            {
//                                var displayNameAttr = prop.GetCustomAttributes(typeof(DisplayNameAttribute), false)
//                                    .FirstOrDefault() as DisplayNameAttribute;
//                                var columnTitle = displayNameAttr?.DisplayName ?? prop.Name;

//                                header.Cell()
//                                    .Border(0.5f)
//                                    .Background(Colors.Grey.Lighten3)
//                                    .Padding(5)
//                                    .Text(columnTitle)
//                                    .Bold()
//                                    .FontSize(11);
//                            }
//                        });

//                        // Data
//                        int stt = 1;
//                        foreach (var item in data)
//                        {
//                            // Cột STT
//                            table.Cell()
//                                .Border(0.5f)
//                                .Padding(5)
//                                .Text(stt.ToString())
//                                .AlignCenter();

//                            stt++;
//                            foreach (var prop in properties)
//                            {
//                                var value = prop.GetValue(item);
//                                string displayValue = value switch
//                                {
//                                    DateTime date => date.ToString("dd/MM/yyyy"),
//                                    null => string.Empty,
//                                    _ => value.ToString()
//                                };

//                                table.Cell()
//                                    .Border(0.5f)
//                                    .Padding(5)
//                                    .Text(displayValue);
//                            }
//                        }
//                    });
//                });
//            }).GeneratePdf(stream);

//            stream.Position = 0;
//            return Convert.ToBase64String(stream.ToArray());
//        }

//        public static async Task<string> ExportToPdfAndSave<T>(IEnumerable<T> data)
//        {
//            if (data == null || !data.Any())
//            {
//                // Tạo file PDF rỗng nếu không có dữ liệu
//                return await CreateEmptyPdfFile();
//            }

//            QuestPDF.Settings.License = LicenseType.Community;

//            var properties = typeof(T).GetProperties();

//            // Tạo thư mục nếu chưa tồn tại
//            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "temps");
//            if (!Directory.Exists(uploadsPath))
//            {
//                Directory.CreateDirectory(uploadsPath);
//            }

//            // Tên file PDF
//            var fileName = $"export_{DateTime.Now:yyyyMMdd_HHmmss}.pdf";
//            var filePath = Path.Combine(uploadsPath, fileName);

//            // Tạo file PDF
//            Document.Create(container =>
//            {
//                container.Page(page =>
//                {
//                    page.Size(PageSizes.A4);
//                    page.Margin(1, Unit.Centimetre);
//                    page.PageColor(Colors.White);
//                    page.DefaultTextStyle(x => x.FontSize(10));

//                    page.Content().Table(table =>
//                    {
//                        table.ColumnsDefinition(columns =>
//                        {
//                            columns.RelativeColumn(1f);
//                            foreach (var prop in properties)
//                                columns.RelativeColumn(3f);
//                        });

//                        // Header
//                        table.Header(header =>
//                        {  // STT
//                            header.Cell()
//                                .Border(0.5f)
//                                .Background(Colors.Grey.Lighten3)
//                                .AlignCenter()
//                                .PaddingTop(5)
//                                .Text("STT")
//                                .Bold()
//                                .FontSize(11);
//                            foreach (var prop in properties)
//                            {
//                                var displayNameAttr = prop.GetCustomAttributes(typeof(DisplayNameAttribute), false)
//                                    .FirstOrDefault() as DisplayNameAttribute;
//                                var columnTitle = displayNameAttr?.DisplayName ?? prop.Name;

//                                header.Cell()
//                                    .Border(0.5f)
//                                    .Background(Colors.Grey.Lighten3)
//                                    .Padding(5)
//                                    .Text(columnTitle)
//                                    .Bold()
//                                    .FontSize(11);
//                            }
//                        });

//                        // Data
//                        int stt = 1;
//                        foreach (var item in data)
//                        {   // Cột STT
//                            table.Cell()
//                                .Border(0.5f)
//                                .Padding(5)
//                                .Text(stt.ToString())
//                                .AlignCenter();

//                            stt++;
//                            foreach (var prop in properties)
//                            {
//                                var value = prop.GetValue(item);
//                                string displayValue = value switch
//                                {
//                                    DateTime date => date.ToString("dd/MM/yyyy"),
//                                    null => string.Empty,
//                                    _ => value.ToString()
//                                };

//                                table.Cell()
//                                    .Border(0.5f)
//                                    .Padding(5)
//                                    .Text(displayValue);
//                            }
//                        }
//                    });
//                });
//            }).GeneratePdf(filePath);

//            // Trả về đường dẫn tương đối
//            var relativePath = Path.Combine("uploads", "temps", fileName).Replace("\\", "/");
//            return relativePath;
//        }

//        private static async Task<string> CreateEmptyPdfFile()
//        {
//            var stream = new MemoryStream();

//            Document.Create(container =>
//            {
//                container.Page(page =>
//                {
//                    page.Size(PageSizes.A4);
//                    page.Margin(1, Unit.Centimetre);
//                    page.PageColor(Colors.White);
//                    page.Content().PaddingVertical(20).Text("No data available").FontSize(12);
//                });
//            }).GeneratePdf(stream);

//            stream.Position = 0;
//            return Convert.ToBase64String(stream.ToArray());
//        }

//        public static List<CertificateInfo> GetSignaturePdf(string pdfFilePath)
//        {
//            var absolutePath = FileHelper.GetAbsoluteFilePath(pdfFilePath);
//            var certificates = new List<CertificateInfo>();
//            try
//            {
//                using (PdfReader pdfReader = new PdfReader(absolutePath))
//                {
//                    AcroFields signatureFields = pdfReader.AcroFields;
//                    var signatureList = signatureFields.GetSignatureNames();

//                    if (signatureList.Count == 0)
//                    {
//                        return certificates;
//                    }

//                    foreach (string signatureName in signatureList)
//                    {
//                        PdfPKCS7 signatureData = signatureFields.VerifySignature(signatureName);
//                        X509Certificate2 certificate = new X509Certificate2(signatureData.SigningCertificate.GetEncoded());

//                        certificates.Add(new CertificateInfo
//                        {
//                            CN = certificate.GetNameInfo(X509NameType.SimpleName, false),
//                            SignedAt = signatureData.SignDate.ToString("dd/MM/yyyy, hh:mm:ss"),
//                            SignersIdentity = certificate.Verify(),
//                            DocumentModified = !signatureData.Verify()
//                        });
//                    }
//                }
//            }
//            catch (Exception ex)
//            {
//                Console.WriteLine($"Lỗi khi đọc chữ ký PDF: {ex.Message}");
//            }

//            return certificates;
//        }
//    }
//    public class PdfConvertOutput
//    {
//        public string? PdfPath { get; set; }
//        public int SoTo { get; set; }
//    }

//    public class CertificateInfo
//    {
//        public bool InvalidSignature
//        {
//            get
//            {
//                return SignersIdentity && !DocumentModified;
//            }
//        }

//        public string? CN { get; set; }
//        public string? SignedAt { get; set; }
//        public bool SignersIdentity { get; set; }
//        public bool DocumentModified { get; set; }
//    }
//}
