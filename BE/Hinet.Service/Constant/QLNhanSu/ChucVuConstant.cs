using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.Constant.QLNhanSu
{
    public class ChucVuConstant
    {
        [DisplayName("Tổng giám đốc")]
        public static string CEO { get; set; } = "CEO";
        [DisplayName("Giám đốc công nghệ")]
        public static string CTO { get; set; } = "CTO";
    }

    public class VaiTroNhanSuConstant
    {
        [DisplayName("Xem toàn bộ nhân sự")]
        public static string ViewAllNS { get; set; } = "ViewAllNS";
    }
}
