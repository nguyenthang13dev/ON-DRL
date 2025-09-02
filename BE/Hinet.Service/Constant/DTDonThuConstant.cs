using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.Constant
{
    public class TrangThaiDonThuConstant
    {
        [DisplayName("Văn thư chờ tiếp nhận")]
        public static string CHOTIEPNHANVANTHU => "CHOTIEPNHANVANTHU";

        [DisplayName("Đã gửi văn thư")]
        public static string DAGUIVANTHU => "DAGUIVANTHU";

        [DisplayName("Đã gửi chánh thanh tra")]
        public static string DAGUICHANHTHANHTRA => "DAGUICHANHTHANHTRA";

        [DisplayName("Đã gửi phó chánh")]
        public static string DAGUIPHOCHANHTHANHTRA => "DAGUIPHOCHANHTHANHTRA";

        [DisplayName("Đã gửi thanh tra viên")]
        public static string DAGUITHANHTRAVIEN => "DAGUITHANHTRAVIEN";

        [DisplayName("Văn thư từ chối")]
        public static string VANTHUTUCHOI => "VANTHUTUCHOI";

        [DisplayName("Rút đơn")]
        public static string RUTDON => "RUTDON";

        [DisplayName("Chuyển đơn")]
        public static string CHUYENDON => "CHUYENDON";
    }

    public class TrangThaiPhanCongDonThuConstant
    {
        [DisplayName("Đang xử lý")]
        public static string DANGXULY => "DANGXULY";

        [DisplayName("Đã hoàn thành")]
        public static string DAXULY=> "DAXULY";
    }

    public class TabDonThuConstant
    {
        [DisplayName("Chờ tiếp nhận")]
        public static string ChoTiepNhan => "ChoTiepNhan";
        [DisplayName("Đang xử lý")]
        public static string DangXuLy => "DangXuLy";
        [DisplayName("Đã xử lý")]
        public static string DaXuLy => "DaXuLy";
        [DisplayName("Trả về")]
        public static string TraVe => "TraVe";
        [DisplayName("Rút đơn")]
        public static string RutDon => "RutDon";
        [DisplayName("Chuyển đơn")]
        public static string ChuyenDon => "ChuyenDon";
        [DisplayName("Tất cả")]
        public static string TatCa => "TatCa";
    }

    public class NguonTiepNhanConstant
    {
        [DisplayName("Tiếp công dân")]
        public static string TIEPCONGDAN => "TIEPCONGDAN";

        [DisplayName("Văn bản")]
        public static string VANBAN => "VANBAN";

        [DisplayName("Dịch vụ công")]
        public static string DICHVUCONG => "DICHVUCONG";

        [DisplayName("Chuyển tiếp")]
        public static string CHUYENTIEP => "CHUYENTIEP";

        [DisplayName("Tất cả")]
        public static string TATCA => "TATCA";
    }
}