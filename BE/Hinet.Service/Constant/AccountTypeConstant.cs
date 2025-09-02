using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.Constant
{
    public class AccountTypeConstant
    {
        [DisplayName("Tài khoản người dùng cuối")]
        public static string EndUser { get; set; } = "EndUser";
        [DisplayName("Tài khoản xử lý nghiệp vụ")]
        public static string BussinessUser { get; set; } = "BussinessUser";

        [DisplayName("Tài khoản truy cập api")]
        public static string AccountApi { get; set; } = "AccountApi";
    }
}
