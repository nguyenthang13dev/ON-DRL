using Hinet.Service.Dto;

namespace Hinet.Service.QLNhanSu.NS_NhanSuService.ViewModels
{
    public class NS_NhanSuSearch : SearchBase
    {
        public Guid? ChucVuId { get; set; }
        public Guid? PhongBanId { get; set; }
        public DateTime? NgayVaoLam { get; set; }
        public byte? GioiTinh { get; set; }
        public byte? TrangThai { get; set; }
        public string? MaNV { get; set; }
        public string? HoTen { get; set; }
        public string? CMND { get; set; }
        public string? DienThoai { get; set; }
    }
}
