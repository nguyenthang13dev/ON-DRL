using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.Constant
{
    public class DataTypeConstant
    {
        [DisplayName("Chữ")]
        public static int Text => 1;
        [DisplayName("Số nguyên")]
        public static int Int => 2;
        [DisplayName("Số thập phân")]
        public static int Double => 3;
        [DisplayName("Danh mục")]
        public static int Select => 4;
    }
}
