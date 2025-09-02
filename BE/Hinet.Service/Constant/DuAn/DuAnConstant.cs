using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.Constant
{
    public class DuAnStatusConstant
    {
        // Status constants for project phases
        [DisplayName("Chờ triển khai")]
        public static string CHO_TRIEN_KHAI { get; set; } = "0";   // Chờ triển khai

        [DisplayName("Đang thực hiện")]
        public static string DANG_THUC_HIEN { get; set; } = "1"; // Đang thực hiện

        [DisplayName("Tạm dừng")]
        public static string TAM_DUNG { get; set; } = "2"; // Tạm dừng

        [DisplayName("Hoàn thành")]
        public static string HOAN_THANH { get; set; } = "3"; // Hoàn thành
    }
}
