using Hinet.Service.Dto;
using System;

namespace Hinet.Service.GroupTelegramService.ViewModels
{
    public class GroupTelegramSearch :SearchBase
    {
        public string? GroupName { get; set; }
        public string? ChatId { get; set; }
        public string? EventTypeCode { get; set; }
        public bool? IsActive { get; set; }
    }
}