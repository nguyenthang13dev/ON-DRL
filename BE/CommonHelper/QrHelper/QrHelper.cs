using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using ZXing;
using ZXing.SkiaSharp;
using SkiaSharp;
using ZXing.Common;
using System.IO;
namespace CommonHelper.QrHelper
{
    public class QrHelper
    {
        public static string? DecodeQrFromStream(IFormFile file)
        {
            if (file.Length == 0)
            {
                return null;
            }
            using Stream stream = new MemoryStream();
            file.CopyTo(stream);
            // Reset vị trí stream về đầu
            stream.Position = 0;
            using var skBitmap = SKBitmap.Decode(stream);
            if (skBitmap == null)
                return null;
            var reader = new ZXing.SkiaSharp.BarcodeReader
            {
                AutoRotate = true,
                TryInverted = true,
                Options = new DecodingOptions
                {
                    TryHarder = true,
                    PossibleFormats = new[] { BarcodeFormat.QR_CODE },
                    CharacterSet = "UTF-8",
                    PureBarcode = false
                }
            };
            var result = reader.Decode(skBitmap);
            return result?.Text;
        }

        public static string? DecodeQrFromFilePath(string FilePath)
        {
            if (string.IsNullOrWhiteSpace(FilePath) || ! System.IO.File.Exists(FilePath))
            {
                return null;
            }

            using var memoryStream = new MemoryStream();
            using (var fileStream = System.IO.File.OpenRead(FilePath))
            {
                fileStream.CopyTo(memoryStream);
            }

            // Reset vị trí stream về đầu
            memoryStream.Position = 0;

            using var skBitmap = SKBitmap.Decode(memoryStream);
            if (skBitmap == null)
                return null;

            var reader = new ZXing.SkiaSharp.BarcodeReader
            {
                AutoRotate = true,
                TryInverted = true,
                Options = new DecodingOptions
                {
                    TryHarder = true,
                    PossibleFormats = new[] { BarcodeFormat.QR_CODE },
                    CharacterSet = "UTF-8",
                    PureBarcode = false
                }
            };

            var result = reader.Decode(skBitmap);
            return result?.Text;
        }

        public  static bool CheckkDecode(IFormFile file, string FilePath)
        {
            var qrcodeInput = DecodeQrFromStream(file);
            var qrcodeOutPut = DecodeQrFromFilePath(FilePath);
            if (qrcodeInput == qrcodeOutPut)
            {
                return true;
            } else
            {
                return false;
            }
        }
    }
}
