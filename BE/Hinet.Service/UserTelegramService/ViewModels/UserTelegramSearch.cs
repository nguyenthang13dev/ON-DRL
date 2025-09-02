using Hinet.Service.Dto;
using System;

namespace Hinet.Service.UserTelegramService.ViewModels
{
    public class UserTelegramSearch:SearchBase
    {
        public Guid? UserId { get; set; }
        public string? ChatId { get; set; }
        public bool? IsActive { get; set; }
    }
}