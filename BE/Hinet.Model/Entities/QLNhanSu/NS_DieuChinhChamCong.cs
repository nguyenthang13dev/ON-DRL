using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities.QLNhanSu
{
    [Table("NS_DieuChinhChamCong")]
    public class NS_DieuChinhChamCong : AuditableEntity
    {
        [Required]
        public Guid? ChamCongId { get; set; } // FK → ChamCong

        [Required]
        public Guid? NhanSuId { get; set; } // FK → NhanVien (người yêu cầu)

        public DateTime NgayYeuCau { get; set; } = DateTime.Now;

        [Required]
        [StringLength(255)]
        public string LyDo { get; set; }

        public TimeSpan? GioVaoMoi { get; set; }

        public TimeSpan? GioRaMoi { get; set; }

        public byte TrangThai { get; set; } = 0; // 0=Chờ duyệt, 1=Đã duyệt, 2=Từ chối

        public Guid? NguoiDuyet { get; set; } // FK → NhanVien (người duyệt)

        public DateTime? NgayDuyet { get; set; }

        [StringLength(255)]
        public string GhiChuQuanLy { get; set; }
    }
}
