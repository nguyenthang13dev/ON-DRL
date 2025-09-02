using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.Constant.NghiPhep
{
    public class VaiTroNghiPhepConstant
    {
        [DisplayName("Quản lý tất cả đơn nghỉ phép")]
        public static string QUANLYNGHIPHEP_ALL => "QUANLYNGHIPHEP_ALL";
        [DisplayName("Quản lý đơn nghỉ phép của phòng ban")]
        public static string QUANLYNGHIPHEP_PHONG => "QUANLYNGHIPHEP_PHONG";

        [DisplayName("Duyệt đơn nghỉ phép toàn bộ công ty")]
        public static string PHEDUYETNGHIPHEP_ALL => "PHEDUYETNGHIPHEP_ALL";
        [DisplayName("Duyệt đơn nghỉ phép của phòng ban")]
        public static string PHEDUYETNGHIPHEP_PHONG => "PHEDUYETNGHIPHEP_PHONG";

        [DisplayName("Từ chối đơn nghỉ phép của phòng ban")]
        public static string TUCHOINGHIPHEP_PHONG => "TUCHOINGHIPHEP_PHONG";
        [DisplayName("Từ chối đơn nghỉ phép toàn bộ công ty")]
        public static string TUCHOINGHIPHEP_ALL => "TUCHOINGHIPHEP_ALL";

        [DisplayName("Tạo đơn đăng ký nghỉ phép")]
        public static string NP_DangKyNghiPhep_create => "NP_DangKyNghiPhep_create";

        [DisplayName("Xóa đơn đăng ký nghỉ phép")]
        public static string NP_DangKyNghiPhep_delete => "NP_DangKyNghiPhep_delete";
    }
}
