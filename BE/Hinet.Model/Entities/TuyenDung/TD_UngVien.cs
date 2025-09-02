using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities.TuyenDung
{
    [Table("TD_UngVien")]
    public class TD_UngVien : AuditableEntity
    {

        [StringLength(250)]
        public string? HoTen { get; set; }

        public DateTime? NgaySinh { get; set; }

        public GioiTinh_UngVien? GioiTinh { get; set; } // 0: Nam, 1: Nữ, 2: Khác

        [StringLength(250)]
        public string? Email { get; set; }

        [StringLength(250)]
        public string? SoDienThoai { get; set; }

        [StringLength(250)]
        public string? DiaChi { get; set; }

        [StringLength(200)]
        public string? TrinhDoHocVan { get; set; }

        [StringLength(500)]
        public string? KinhNghiem { get; set; }

        [StringLength(550)]
        public string CVFile { get; set; }

        public DateTime? NgayUngTuyen { get; set; }
        public DateTime? ThoiGianPhongVan { get; set; }
        public TrangThai_UngVien TrangThai { get; set; } = TrangThai_UngVien.ChuaXetDuyet;
        public string? GhiChuUngVien { get; set; }
        public Guid TuyenDungId { get; set; }
    }
    public enum TrangThai_UngVien
    {
        ChuaXetDuyet = 0, // Chưa xét duyệt
        DaXetDuyet = 1, // Đã xét duyệt
        DangChoPhongVan = 2, // Đang chờ phỏng vấn
        DaNhanViec = 3, // Đã nhận việc
        DaTuChoi = 4, // Đã từ chối
        DatPhongVan = 5 // Đạt Phỏng vấn
    }
    public enum GioiTinh_UngVien
    {
        Nam = 0,
        Nu = 1,
        Khac = 2
    }
}
