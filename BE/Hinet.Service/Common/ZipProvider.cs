using Hinet.Model.Entities;
using System;
using System.Collections.Generic;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.Common
{
    public static class ZipProvider
    {


        public static string GetDataJson(byte[] byteFile)
        {
            string jsonContent = string.Empty;
            using (var gzipstream = new GZipStream(new MemoryStream(byteFile), CompressionMode.Decompress))
            {
                using (var zipStream = new MemoryStream())
                {
                    gzipstream.CopyTo(zipStream);

                    zipStream.Position = 0;
                    using (var zipArchive = new ZipArchive(zipStream, ZipArchiveMode.Read))
                    {
                        var jsonEntry = zipArchive.GetEntry("data.json");
                        if (jsonEntry == null)
                            throw new Exception("Không tìm thấy file data.json trong file GZ-ZIP.");
                        using (var reader = new StreamReader(jsonEntry.Open()))
                        {
                            jsonContent = reader.ReadToEnd();
                        }
                    }
                }
            }
            return jsonContent;
        }


        public static async Task<bool> CreateFileByEntry(byte[] resultFile,List<TaiLieuDinhKem> lstFiles)
        {
            // Process the gzip file to extract its entries
            using (var memoryStream = new MemoryStream(resultFile))
            using (var gzipStream = new GZipStream(memoryStream, CompressionMode.Decompress))
            using (var archive = new ZipArchive(gzipStream, ZipArchiveMode.Read))
            {

                foreach (var fileItem in lstFiles)
                {
                    string fileName = Path.GetFileName(fileItem.DuongDanFile.TrimStart('/', '\\'));
                    string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads", fileItem.DuongDanFile.TrimStart('/', '\\'));
                    string fileDirectory = Path.GetDirectoryName(filePath);
                    if (!Directory.Exists(fileDirectory))
                    {
                        Directory.CreateDirectory(fileDirectory);
                    }

                    foreach (var entry in archive.Entries)
                    {
                        if (entry.Name.Equals(fileName, StringComparison.OrdinalIgnoreCase))
                        {
                            using (var entryStream = entry.Open())
                            using (var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write))
                            {
                                await entryStream.CopyToAsync(fileStream);
                            }
                            break; 
                        }
                    }
                }
            }
            return true;
        }
    }
}
