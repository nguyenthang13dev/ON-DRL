using Hinet.Model.Entities;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.GroupTelegramService.Dto;
using Hinet.Service.GroupTelegramService.ViewModels;
using Hinet.Service.TD_ViTriTuyenDungService.Dto;
using Hinet.Service.TD_ViTriTuyenDungService.ViewModel;

namespace Hinet.Service.GroupTelegramService
{
    public interface IGroupTelegramService : IService<GroupTelegram>
    {
        Task<PagedList<GroupTelegramDto>> GetData(GroupTelegramSearch search);
        Task<GroupTelegramDto?> GetDto(Guid id);
        Task<bool> SaveOrUpdateGroupTelegram(GroupTelegramCreateVM model);
        Task<int> UnlinkGroups(List<string> chatIds);
        Task<int> UnlinkGroupsByEventTypeCodes(List<string> eventTypeCodes);
    }
}