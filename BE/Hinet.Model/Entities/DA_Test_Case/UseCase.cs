using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    [Table("UC_UseCase")]
    public class UC_UseCase : AuditableEntity
    {
        public Guid IdDuAn { get; set; }
        public string? TenUseCase { get; set; }
        public string? TacNhanChinh { get; set; }
        public string? TacNhanPhu { get; set; }
        public string? DoCanThiet { get; set; }
        public string? DoPhucTap { get; set; }
        public Guid? ParentId { get; set; }
        public Guid? NhomId { get; set; }
        public string ? MoTa { get; set; }
    }
}
