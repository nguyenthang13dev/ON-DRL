using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    [Table("QLThongBao")]
    public class QLThongBao : AuditableEntity
    {
        public string? TieuDe { get; set; }
        public string? NoiDung { get; set; }
        public DateTime? ThoiGianGui { get; set; }
        public string? MaThongBao { get; set; }
        public string? LoaiThongBao { get; set; } = TypeNotify.ThongBao.ToString(); // 1: Thong bao, 2: Tin tuc
    }
    
    public enum TypeNotify
    {
        ThongBao = 1,
        TinTuc = 2
    }   
}
