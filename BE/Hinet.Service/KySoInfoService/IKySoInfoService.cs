using Hinet.Model.Entities;
using Hinet.Service.KySoInfoService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.KySoInfoService
{
    public interface IKySoInfoService : IService<KySoInfo>
    {
        Task<KySoInfo> GetByForm(Guid IdUser, Guid IdForm);
        Task<PagedList<KySoInfoDto>> GetData(KySoInfoSearch search);
        Task<KySoInfoDto?> GetDto(Guid id);
    }
}
