using IronBarCode;
using QRCoder;

namespace Hinet.Core.BarCodeProvider
{
    public class QRCodeProvider
    {

        public static string Generate(string? text, string fileName = "")
        {
            var qrGenerator = new QRCodeGenerator();
            var qrCodeData = qrGenerator.CreateQrCode(text, QRCodeGenerator.ECCLevel.Q);
            var qrCode = new QRCode(qrCodeData);
            var qrCodeImage = qrCode.GetGraphic(20);
            if (string.IsNullOrEmpty(fileName))
            {
                fileName = Guid.NewGuid().ToString();
            }
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "qr");
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }
            var path  = Path.Combine(folderPath, fileName + ".png");
            qrCodeImage.Save(path);

            return fileName;

        }

    }
}
