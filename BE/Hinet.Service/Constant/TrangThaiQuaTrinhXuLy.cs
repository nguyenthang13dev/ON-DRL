using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.Constant
{
    public class TrangThaiQuaTrinhXuLy
    {
        [DisplayName("Chưa xử lý")]
        public static int CHUA_XULY => 1;


        [DisplayName("Đã xử lý")]
        public static int DA_XULY => 2;
        [DisplayName("Đã xem")]
        public static int DA_XEM => 3;
        [DisplayName("Nhật để biết")]
        public static int XEM_DE_BIET => 4;
    }
}
