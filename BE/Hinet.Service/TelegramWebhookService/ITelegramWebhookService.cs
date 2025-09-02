using Hinet.Service.GroupTelegramService.ViewModels;
using Hinet.Service.TelegramWebhookService.Dto;
using System;
using System.Threading.Tasks;

namespace Hinet.Service.TelegramWebhookService
{
    public interface ITelegramWebhookService
    {
        Guid? ValidateTelegramLinkJwt(string jwt);
        string GenerateTelegramLinkToken(Guid userId);
        bool ValidateTelegramGroupLinkJwt(string jwt, string eventTypeCode);
        string GenerateGroupTelegramLinkToken(string groupName, string eventTypeCode);
        TelegramGroupLinkValidationResult ValidateTelegramGroupLinkJwtAndExtractData(string jwt);
    }

}