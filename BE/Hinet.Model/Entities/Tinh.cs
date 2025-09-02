using System.ComponentModel.DataAnnotations.Schema;

namespace Hinet.Model.Entities
{
    [Table("Tinh")]
    public class Tinh : AuditableEntity
    {
        public string? TenTinh { get; set; }
        public string? MaTinh { get; set; }
        public string? Loai { get; set; }
    }
}
