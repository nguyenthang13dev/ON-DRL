using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities.QLNhanSu
{
    [Table("NS_HopDongLaoDong")]
    public class NS_HopDongLaoDong : AuditableEntity
    {
        [Required]
        public Guid? NhanSuId { get; set; } // FK → NhanVien

        [StringLength(50)]
        public string? SoHopDong { get; set; }

        public DateTime? NgayKy { get; set; }

        public DateTime? NgayHetHan { get; set; }

        /// <summary>
        /// 1 = Chính thức, 2 = Thử việc, 3 = Thực tập, 4 = Vô thời hạn, 5 = Có thời hạn, 6 = Khác
        /// </summary>
        public byte? LoaiHopDong { get; set; }

        [StringLength(255)]
        public string? GhiChu { get; set; }
    }
}
