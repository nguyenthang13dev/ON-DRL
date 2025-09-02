
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hinet.Model.Entities.DA_Test_Case
{
    [Table("TacNhan_UseCase")]
    public class TacNhan_UseCase : AuditableEntity
    {
        [Key]
        [StringLength(50)]
        [Required]
        public string maTacNhan { get; set; }

        [StringLength(250)]
        [Required]
        public string tenTacNhan { get; set; }
        public Guid idDuAn { get; set; }
    }
}
