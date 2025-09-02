using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hinet.Model.Entities
{
    [Table("UserTelegram")]
    public class UserTelegram : AuditableEntity
    {
        public string? FullName{ get; set; } 
        public Guid UserId { get; set; } 
        [StringLength(100)]
        public string ChatId { get; set; } 
        public DateTime LinkedAt { get; set; } = DateTime.UtcNow; 
        public bool IsActive { get; set; } = true; 
    }
}