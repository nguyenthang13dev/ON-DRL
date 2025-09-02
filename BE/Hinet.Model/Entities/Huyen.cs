using System.ComponentModel.DataAnnotations.Schema;

namespace Hinet.Model.Entities
{
    [Table("Huyen")]
    public class Huyen : AuditableEntity
    {
        public string? TenHuyen { get; set; }
        public string? MaHuyen { get; set; }
        public string? MaTinh { get; set; }
        public string? Loai { get; set; }
    }
}
