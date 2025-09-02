using Hinet.Model.Entities;
using System;

namespace Hinet.Service.GroupTelegramService.Dto
{
    public class GroupTelegramDto: GroupTelegram
    {
        public string tenEventTypeCode { get; set; }
    }
}