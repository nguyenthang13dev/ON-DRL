using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.GroupTelegramService.ViewModels
{
    public class GroupTelegramCreateVM
    {
        [StringLength(100)]
        public string GroupName { get; set; } // Tên nhóm
        [StringLength(100)]
        public string ChatId { get; set; } // chat_id nhóm Telegram
        [StringLength(200)]
        public string? Description { get; set; } // Mô tả
        [StringLength(100)]
        public string? EventTypeCode { get; set; } // Loại sự kiện nhận thông báo (có thể null nếu là nhóm chung)
    }
}
