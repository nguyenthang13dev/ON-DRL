using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.Constant
{
    public class FileManagerShareTypeConstant
    {
        [DisplayName("Người dùng")]
        public static string USER => "USER";
        [DisplayName("vai trò")]
        public static string ROLE => "ROLE";
        [DisplayName("Đơn vị/ phòng ban")]
        public static string DEPARTMENT => "DEPARTMENT";
    }
}
