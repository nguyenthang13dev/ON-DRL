using Hinet.Model.Entities;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.GroupTelegramService.Dto;
using Hinet.Service.GroupTelegramService.ViewModels;
using Hinet.Service.UserTelegramService.Dto;
using Hinet.Service.UserTelegramService.ViewModels;

namespace Hinet.Service.UserTelegramService
{
    public interface IUserTelegramService : IService<UserTelegram>
    {
        Task<PagedList<UserTelegramDto>> GetData(UserTelegramSearch search);
        Task<UserTelegramDto?> GetDto(Guid id);
        Task<bool> SaveOrUpdateUserTelegram(Guid userId, string chatId, string? FullName);
        Task<bool> UnlinkAllTelegramAccount(List<Guid> userIds);
        Task<bool> UnlinkTelegramAccountId(List<Guid> userTelegramIds);
        Task<bool> UnlinkByChatIds(List<string> chatIds);

    }
}