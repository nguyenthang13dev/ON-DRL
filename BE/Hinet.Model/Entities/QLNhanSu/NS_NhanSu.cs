using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities.QLNhanSu
{
    [Table("NS_NhanSu")]

    public class NS_NhanSu : AuditableEntity
    {
        [Required]
        [StringLength(20)]
        public string MaNV { get; set; }

        [StringLength(250)]
        public string HoTen { get; set; }

        public DateTime? NgaySinh { get; set; }

        public byte? GioiTinh { get; set; } // 0 = Nam, 1 = Nữ , 2 = Khác

        [StringLength(20)]
        public string? CMND { get; set; }

        public DateTime? NgayCapCMND { get; set; }

        [StringLength(350)]
        public string? NoiCapCMND { get; set; }

        [StringLength(350)]
        public string? DiaChiThuongTru { get; set; }

        [StringLength(350)]
        public string? DiaChiTamTru { get; set; }

        [StringLength(20)]
        public string? DienThoai { get; set; }

        [StringLength(250)]
        public string? Email { get; set; }

        public DateTime? NgayVaoLam { get; set; }

        public byte TrangThai { get; set; } = 1; // 1:Đang làm việc, 0: Đã nhỉ việc

        public Guid? ChucVuId { get; set; }

        public Guid? PhongBanId { get; set; }
        public string? ChucVuCode { get; set; }
        public string? PhongBanCode { get; set; }

        [StringLength(20)]
        public string? MaSoThueCaNhan { get; set; }

        [StringLength(50)]
        public string? SoTaiKhoanNganHang { get; set; }

        [StringLength(100)]
        public string? NganHang { get; set; }

        public string? HinhAnh { get; set; }

    }
}
