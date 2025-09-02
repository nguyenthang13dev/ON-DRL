using Hinet.Model.Entities;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.QLNhanSu.NS_NhanSuService.ViewModels
{
    public class NS_NhanSuCreateVM
    {
        [Required]
        public Guid? ChucVuId { get; set; }
        [Required]
        public Guid? PhongBanId { get; set; }
        public DateTime? NgaySinh { get; set; }
        public DateTime? NgayCapCMND { get; set; }
        public DateTime? NgayVaoLam { get; set; }
        public byte? GioiTinh { get; set; }
        public byte? TrangThai { get; set; }
        public string? MaNV { get; set; }
        [Required]
        public string? HoTen { get; set; }
        public string? CMND { get; set; }
        public string? NoiCapCMND { get; set; }
        public string? DiaChiThuongTru { get; set; }
        public string? DiaChiTamTru { get; set; }
        public string? DienThoai { get; set; }
        public string? Email { get; set; }
        public string? MaSoThueCaNhan { get; set; }
        public string? SoTaiKhoanNganHang { get; set; }
        public string? NganHang { get; set; }
    }
}