using System.Reflection;
using Xceed.Words.NET;

namespace Hinet.Api.Helper
{
    public class ExportWordCustom
    {

        public static void ExportHopDongLaoDongAsync(string filePath, object data)
        {
            using (var document = DocX.Load(filePath))
            {
                document.ReplaceText("{{day}}", DateTime.Now.Day.ToString());
                document.ReplaceText("{{month}}", DateTime.Now.Month.ToString());
                document.ReplaceText("{{year}}", DateTime.Now.Year.ToString());
                foreach (var prop in data.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance))
                {
                    var placeholder = "{{" + prop.Name + "}}";
                    var rawValue = prop.GetValue(data)?.ToString();
                    var value = string.IsNullOrEmpty(rawValue) ? "........................." : rawValue;
                    if (prop.Name.ToUpper() == "NgayHetHan".ToUpper())
                    {
                        if (data.GetType().GetProperty("LoaiHopDong").GetValue(data)?.ToString().ToUpper() == "Vô thời hạn".ToUpper())
                        {
                            value = "Không xác định";
                        }
                    }
                    document.ReplaceText(placeholder, value);

                    if (prop.Name.ToUpper() == "LoaiHopDong".ToUpper())
                    {
                        if((value.ToUpper() == "Vô thời hạn".ToUpper() || value.ToUpper() == "Chính thức".ToUpper()))
                        {
                            placeholder = "{{ThuongHoTro}}";
                            value = "Thưởng, hỗ trợ";
                            document.ReplaceText(placeholder, value);
                            placeholder = "{{thuong}}";
                            value = "thưởng, ";
                            document.ReplaceText(placeholder, value);
                        }
                        else
                        {
                            placeholder = "{{Thuong}}";
                            value = "Hỗ trợ";
                            document.ReplaceText(placeholder, value);
                            placeholder = "{{thuong}}";
                            value = "";
                            document.ReplaceText(placeholder, value);

                        }
                    }
                   
                }

                document.Save();
            }
        }
    }
}
