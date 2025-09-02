using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hinet.Model.Entities.LuuTruBQP
{
    [Table("ArcTransfer")]
    public class ArcTransfer: AuditableEntity
    {

        [StringLength(1000)]
        [Required]
        public string CanCu { get; set; }
        
        [Required]
        public Guid? UserIDGiao { get; set; }
        
        [StringLength(100)]
        [Required]
        public string ChucVuGiao { get; set; }
        
        [Required]
        public Guid? UserIDNhan { get; set; }
        
        [StringLength(100)]
        [Required]
        public string ChucVuNhan { get; set; }
        
        [StringLength(200)]
        [Required]
        public string TenKhoiTaiLieu { get; set; }
        
        [StringLength(200)]
        [Required]
        public string ThoiGianHoSo { get; set; }
        
        [Required]
        public int? TongSoHop { get; set; }
        
        [Required]
        public int? TongSoHoSo { get; set; }
        
        [Required]
        public decimal? SoMetHoSo { get; set; }
        
        [Required]
        public int? TongSoHoSoDienTu { get; set; }
        
        [Required]
        public int? TongSoTepTin { get; set; }
        
        [Required]
        public string TinhTrangTaiLieu { get; set; }
        
        [Required]
        public DateTime? NgayGiaoNhan { get; set; }
        
        [Required]
        public Guid? NguonGiaoNhan { get; set; }
        
    }
}