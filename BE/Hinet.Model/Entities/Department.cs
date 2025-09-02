using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hinet.Model.Entities
{
    [Table("Department")]
    public class Department : AuditableEntity
    {
        [Required]
        [StringLength(250)]
        public string Name { get; set; }
        public string? ShortName { get; set; }
        [Required]
        [StringLength(250)]
        [RegularExpression("^[a-zA-Z0-9_-]+$", ErrorMessage = "Mã chỉ chứa chữ, số, gạch dưới hoặc gạch ngang")]
        public string Code { get; set; }
        public Guid? ParentId { get; set; }
        public long? Priority { get; set; } = 1;
        public int Level { get; set; }
        public string Loai { get; set; }
        public bool IsActive { get; set; } = true;
        public string? DiaDanh { get; set; }
        public string? CapBac { get; set; }
        public int? SoNgayTiepTrenThang { get; set; }
    }
}
