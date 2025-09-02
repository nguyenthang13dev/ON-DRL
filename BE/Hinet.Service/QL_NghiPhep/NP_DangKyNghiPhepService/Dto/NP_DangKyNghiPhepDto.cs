using Hinet.Model.Entities.NghiPhep;
using Hinet.Service.Common;
using Hinet.Service.Constant.NghiPhep;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QL_NghiPhep.NP_DangKyNghiPhepService.Dto
{
    public class NP_DangKyNghiPhepDto : NP_DangKyNghiPhep
    {
        public string? HoVaTen { get; set; }
        public string? TenLoaiPhep { get; set; }
        public string? TrangThai_txt {
            set => ConstantExtension.GetName<TrangThaiNghiPhepConstant>(TrangThai.ToString());
        }
        public Guid? IdNhanSu { get; set; }
    }

    public class NgayPhepDto
    {
        public int TongSoNgayPhep { get; set; }
        public decimal SoNgayPhepConLai { get; set; }
        public decimal SoNgayPhepDaSuDung { get; set; }
    }

    public class PreviewDto
    {
        public string? Path { get; set; }
    }

    public class ThongKeNghiPhepDto
    {
        public int TaoMoi { get; set; }
        public int DaGuiTruongBan { get; set; }
        public int TruongBanPheDuyet { get; set; }
        public int TruongBanTuChoi { get; set; }
        public int GuiTongGiamDoc { get; set; }
        public int TongGiamDocPheDuyet { get; set; }
        public int TongGiamDocTuChoi { get; set; }
    }

    public class ViewDangKyDto
    {
        public string? Thu { get; set; }
        public int Ngay { get; set; }
        public int Thang { get; set; }
        public int Nam { get; set; }
        public string? HoTen { get; set;}
        public string? ChucVu { get; set;}
        public string? BoPhan { get; set;}
        public string? SoDienThoai { get; set;}
        public string? DiaChi { get; set;}
        public string? SoNgayNghi { get; set; }
        public string? TuNgay { get; set; }
        public string? DenNgay { get; set; }
        public string? LyDo { get; set; }
        public string? HoTenBanGiao { get; set; }
        public string? BoPhanBanGiao { get; set; }
        public string? CongViecBanGiao { get; set; }
        public string? HoTenTruongBan { get; set; }
        public string? HoTenTongGiamDoc { get; set; }
    }

    public class LichSuNghiPhepDto
    {
        public double SoNgayMacDinh { get; set; }
        public decimal SoNgayNghi { get; set; }
        public int TrangThai { get; set; }
        public string? LoaiPhep { get; set; }
    }
}
