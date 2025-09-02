using IronBarCode;

namespace Hinet.Core.BarCodeProvider
{
    public class BarCodeProvider
    {

        public static string Generate(string? text)
        {
            var myBarcode = BarcodeWriter.CreateBarcode(text, BarcodeWriterEncoding.EAN8);
            myBarcode.ResizeTo(400, 150);
            var guid = Guid.NewGuid().ToString();
            guid = text ?? "";
            myBarcode.SaveAsImage("BarCode/" + guid + ".png");
            return guid;

        }

    }
}
