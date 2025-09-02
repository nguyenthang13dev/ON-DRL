using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hinet.Model.Entities
{
    [Table("GroupTelegram")]
    public class GroupTelegram : AuditableEntity
    {
        [StringLength(100)]
        public string GroupName { get; set; } // Tên nhóm
        [StringLength(100)]
        public string ChatId { get; set; } // chat_id nhóm Telegram
        [StringLength(200)]
        public string? Description { get; set; } // Mô tả
        [StringLength(100)]
        public string? EventTypeCode { get; set; } // Loại sự kiện nhận thông báo (có thể null nếu là nhóm chung)
        public bool IsActive { get; set; } = true;
    }
}