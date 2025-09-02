using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.Constant.NghiPhep
{
    public class TrangThaiNghiPhepConstant
    {
        [DisplayName("Tạo mới")]
        public static int TaoMoi => 0;
        [DisplayName("Đã gửi trưởng ban")]
        public static int DaGuiTruongBan => 1;
        [DisplayName("Trưởng ban phê duyệt")]
        public static int TruongBanDuyet => 2;
        [DisplayName("Gửi tổng giảm đốc")]
        public static int GuiTongGiamDoc => 3;
        [DisplayName("Tổng giám đốc phê duyệt")]
        public static int TongGiamDocPheDuyet => 4;
        [DisplayName("Trưởng ban từ chối")]
        public static int TruongBanTuChoi => 5;
        [DisplayName("Tổng giám đốc từ chối")]
        public static int TongGiamDocTuChoi => 6;
        [DisplayName("Hủy đơn đăng ký")]
        public static int HuyDangKy => 7;
    }
}
