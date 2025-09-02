using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QLNhanSu.NS_ChamCongService.Dto
{
    public class NS_ChamCongDto
    {
        public Guid? NhanSuId { get; set; } 

        public DateTime NgayLamViec { get; set; }

        public TimeSpan? GioVao { get; set; }

        public TimeSpan? GioRa { get; set; }

        [Column(TypeName = "decimal(4,2)")]
        public decimal SoGioLam { get; set; } = 0;

        public byte TrangThai { get; set; } = 0; // 0 = Bình thường, 1 = Đi muộn, 2 = Về sớm

        public bool DiMuon { get; set; } = false;

        public bool VeSom { get; set; } = false;
        public string MaNV { get; set; }
        public DateTime? CreateDate { get; set; }
    }
}
