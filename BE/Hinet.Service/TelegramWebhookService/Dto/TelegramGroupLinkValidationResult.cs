using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.TelegramWebhookService.Dto
{
    public class TelegramGroupLinkValidationResult
    {
        public bool IsValid { get; set; }
        public string GroupName { get; set; }
        public string EventTypeCode { get; set; }
    }
}
