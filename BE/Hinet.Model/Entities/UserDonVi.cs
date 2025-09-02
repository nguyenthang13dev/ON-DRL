using System.ComponentModel.DataAnnotations.Schema;

namespace Hinet.Model.Entities
{
    [Table("UserDonVi")]
    public class UserDonVi: AuditableEntity
    {
        public Guid? UserId { get; set; }
        public Guid? DonViId { get; set; }
    }
}
