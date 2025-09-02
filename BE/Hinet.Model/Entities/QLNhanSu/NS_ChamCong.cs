using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities.QLNhanSu
{
    [Table("NS_ChamCong")]
    public class NS_ChamCong : AuditableEntity
    {
        [Required]
        public Guid? NhanSuId { get; set; } // FK → Nhân viên

        [Required]
        public DateTime NgayLamViec { get; set; }

        public TimeSpan? GioVao { get; set; }

        public TimeSpan? GioRa { get; set; }

        [Column(TypeName = "decimal(4,2)")]
        public decimal SoGioLam { get; set; } = 0;

        public byte TrangThai { get; set; } = 0; // 0 = Bình thường, 1 = Đi muộn, 2 = Về sớm, 3 = Chưa chấm công

        public bool DiMuon { get; set; } = false;

        public bool VeSom { get; set; } = false;

        [StringLength(255)]
        public DateTime NgayTao { get; set; } = DateTime.Now;
        public string MaNV { get; set; }
    }
}
