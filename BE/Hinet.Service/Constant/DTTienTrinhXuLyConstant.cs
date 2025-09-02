using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.Constant
{
    public class TrangThaiTienTrinhXuLyConstant
    {
        [DisplayName("Chưa xử lý")]
        public static string CHUAXULY => "CHUAXULY";
        [DisplayName("Đang xử lý")]
        public static string DANGXULY => "DANGXULY";
        [DisplayName("Chờ duyệt")]
        public static string CHODUYET => "CHODUYET";
        [DisplayName("Đã hoàn thành")]
        public static string DAHOANTHANH => "DAHOANTHANH";
    }
}