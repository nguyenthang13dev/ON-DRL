using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.Constant.QLNhanSu
{
    public class LoaiHopDongLaoDongConstant
    {
        [DisplayName("Chính thức")]
        public static byte ChinhThuc { get; set; } = 1;
        [DisplayName("Thử việc")]
        public static byte ThuViec { get; set; } = 2;
        [DisplayName("Thực tập")]
        public static byte ThucTap { get; set; } = 3;
        [DisplayName("Vô thời hạn")]
        public static byte VoThoiHan { get; set; } = 4;
        [DisplayName("Có thời hạn")]
        public static byte CoThoiHan { get; set; } = 5;
        [DisplayName("Khác")]
        public static byte Khac { get; set; } = 6;
        public static string GetDisplayName(byte loaiHopDong)
        {
            var properties = typeof(LoaiHopDongLaoDongConstant).GetProperties(BindingFlags.Public | BindingFlags.Static);

            foreach (var property in properties)
            {
                if ((byte)property.GetValue(null) == loaiHopDong)
                {
                    var displayNameAttribute = property.GetCustomAttribute<DisplayNameAttribute>();
                    if (displayNameAttribute != null)
                    {
                        return displayNameAttribute.DisplayName;
                    }
                }
            }

            return "Không xác định";
        }
    }
    
}
