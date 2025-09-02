using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities.TuyenDung
{
    public class TD_TuyenDung:AuditableEntity
    {
        [StringLength(250)]
        public string TenViTri { get; set; }
        public Guid? PhongBanId { get; set; }
        public int SoLuongCanTuyen { get; set; }
        public DateOnly NgayBatDau { get; set; }
        public DateOnly NgayKetThuc { get; set; }
        public string? MoTa { get; set; }
        public TinhTrang_TuyenDung TinhTrang { get; set; } = 0;
        public Loai_TuyenDung Loai { get; set; } = 0;
        public HinhThuc_TuyenDung HinhThuc { get; set; } = 0;
    }
    public enum TinhTrang_TuyenDung
    {
        DangTuyen,
        DaDong,
        Hoan
    }
     public enum Loai_TuyenDung
    {
        ThucTap,
        NhanVien,
        Hoan
    }
     public enum HinhThuc_TuyenDung
    {
        FullTime,
        PartTime
    }
}
