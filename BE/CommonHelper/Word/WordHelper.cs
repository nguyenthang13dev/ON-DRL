using System.Diagnostics;
using System.Reflection;
using Xceed.Words.NET;

namespace CommonHelper.Word
{
    public static class WordHelper
    {
        public class FileConversionResult
        {
            public string? FilePath { get; set; }
            public bool Status { get; set; }
            public string? ErrorMessage { get; set; }
        }

        public static void ConvertDocxToPdf(string inputPath, string outputDir, string? outputFileName = null)
        {
            string libreOfficePath = @"C:\Program Files\LibreOffice\program\soffice.exe";
            ProcessStartInfo startInfo = new ProcessStartInfo
            {
                FileName = libreOfficePath,
                Arguments = $"--headless --convert-to pdf --outdir \"{outputDir}\" \"{inputPath}\"",
                CreateNoWindow = true,
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true
            };

            using (Process process = Process.Start(startInfo))
            {
                string output = process.StandardOutput.ReadToEnd();
                string error = process.StandardError.ReadToEnd();
                process.WaitForExit();

                if (process.ExitCode != 0)
                {
                    throw new Exception($"Không thể tạo file PDF: {error}");
                }
            }

            if (!string.IsNullOrEmpty(outputFileName))
            {
                string generatedPdfPath = Path.Combine(outputDir, Path.GetFileNameWithoutExtension(inputPath) + ".pdf");
                string finalPdfPath = Path.Combine(outputDir, outputFileName);
                
                if (!System.IO.File.Exists(generatedPdfPath))
                    throw new Exception("Không tìm thấy file PDF sau khi chuyển đổi.");

                System.IO.File.Move(generatedPdfPath, finalPdfPath, overwrite: true);
            }
        }


        // Nếu method ReplacePlaceholders hỗ trợ IDictionary<string, object>
        public static void ReplacePlaceholdersWithDictionary(string filePath, Dictionary<string, string>? data)
        {
            using (var document = DocX.Load(filePath))
            {
                foreach (var kvp in data)
                {
                    var placeholder = "[[" + kvp.Key + "]]";
                    var rawValue = kvp.Value?.ToString();
                    var value = string.IsNullOrEmpty(rawValue) ? "........................." : rawValue;
                    document.ReplaceText(placeholder, value);
                }

                document.Save();
            }
        }


        public static void ReplacePlaceholdersAsync(string filePath, object data)
        {
            using (var document = DocX.Load(filePath))
            {
                foreach (var prop in data.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance))
                {
                    var placeholder = "[[" + prop.Name + "]]";
                    var rawValue = prop.GetValue(data)?.ToString();
                    var value = string.IsNullOrEmpty(rawValue) ? "........................." : rawValue;
                    document.ReplaceText(placeholder, value);
                }

                document.Save();
            }
        }


        public static string ConvertWordToHtml(string filePath)
        {
            var libreOfficePath = @"C:\Program Files\LibreOffice\program\soffice.exe";
            if (!System.IO.File.Exists(filePath))
                throw new FileNotFoundException("File Word không tồn tại", filePath);

            var outputDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "htmloutput");
            Directory.CreateDirectory(outputDirectory);

            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = libreOfficePath,
                    Arguments = $"--headless --convert-to html:\"XHTML Writer File:UTF8\" --outdir \"{outputDirectory}\" \"{filePath}\"",
                    CreateNoWindow = true,
                    UseShellExecute = false
                }
            };

            process.Start();
            process.WaitForExit();

            var htmlFileName = Path.GetFileNameWithoutExtension(filePath) + ".html";
            var htmlFilePath = Path.Combine(outputDirectory, htmlFileName);

            if (!System.IO.File.Exists(htmlFilePath))
                throw new Exception("Chuyển đổi file Word sang HTML thất bại.");
            // Xóa thư mục tạm chứa html sau khi đọc xong docx
            //Directory.Delete(outputDirectory, recursive: true);


            return System.IO.File.ReadAllText(htmlFilePath);
        }

        public static FileConversionResult ToPDF(string inputPath, string outputDirectory)
        {
            var libreOfficePath = @"C:\Program Files\LibreOffice\program\soffice.exe";
            var outputFilePath = Path.Combine(outputDirectory, Path.GetFileNameWithoutExtension(inputPath) + ".pdf");
            var result = new FileConversionResult();

            try
            {
                var processInfo = new ProcessStartInfo
                {
                    FileName = libreOfficePath,
                    Arguments = $"--headless --convert-to pdf \"{inputPath}\" --outdir \"{outputDirectory}\" --norestore",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var process = Process.Start(processInfo);
                if (process != null)
                {
                    process.WaitForExit();

                    var output = process.StandardOutput.ReadToEnd();
                    var error = process.StandardError.ReadToEnd();
                    if (process.ExitCode == 0 && System.IO.File.Exists(outputFilePath))
                    {
                        result.FilePath = outputFilePath;
                        result.Status = true;
                        result.ErrorMessage = string.IsNullOrEmpty(error) ? "No errors" : error.Trim();
                    }
                    else
                    {
                        result.FilePath = null;
                        result.Status = false;
                        result.ErrorMessage = string.IsNullOrEmpty(error) ? "Unknown error" : error.Trim();
                    }
                }
                else
                {
                    result.Status = false;
                    result.ErrorMessage = "Unable to start LibreOffice process.";
                }
            }
            catch (Exception ex)
            {
                result.Status = false;
                result.ErrorMessage = ex.Message;
            }

            return result;
        }
    }
}