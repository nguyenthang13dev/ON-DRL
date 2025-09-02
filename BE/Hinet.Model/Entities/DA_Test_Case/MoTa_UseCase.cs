using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    [Table("UC_MoTa_UseCase")]
    public class UC_MoTa_UseCase : AuditableEntity
    {
        public Guid IdUseCase { get; set; }
        public string HanhDong { get; set; }
        public string? MoTaKiemThu { get; set; }
        public string? TinhHuongKiemThu { get; set; }
        public string? KetQuaMongDoi { get; set; }
        public string? TaiKhoan { get; set; }
        public string? LinkHeThong { get; set; }
        public string? TrangThai { get; set; }
        public string? MoTaLoi { get; set; }
        public string? GhiChu { get; set; }
    }
}
