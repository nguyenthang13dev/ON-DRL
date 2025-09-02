using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hinet.Model.Entities
{
    [Table("DM_DuLieuDanhMuc")]
    public class DM_DuLieuDanhMuc : AuditableEntity
    {
        public Guid? GroupId { get; set; }
        [Required]
        [StringLength(255)]
        public string Name { get; set; }
        [Required]
        [StringLength(255)]
        public string Code { get; set; }
        public string? Note { get; set; }
        public int? Priority { get; set; }

        public Guid? DonViId { get; set; }
        public Guid? ParentId { get; set; }
        public string? DuongDanFile { get; set; }
        public string? NoiDung { get; set; }
        public Guid? FileDinhKem { get; set; }
    }
}
