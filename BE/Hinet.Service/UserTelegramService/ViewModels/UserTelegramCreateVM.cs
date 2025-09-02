using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.UserTelegramService.ViewModels
{
    public class UserTelegramCreateVM
    {
        public string? FullName { get; set; }
        public Guid UserId { get; set; }
        [StringLength(100)]
        public string ChatId { get; set; }
        public bool? IsActive { get; set; } = true;
    }
}
