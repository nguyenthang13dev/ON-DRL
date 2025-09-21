using Hinet.Model.Entities;
using Hinet.Service.ConfigFormService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;
using Hinet.Model.Entities.ConfigAssign;

namespace Hinet.Service.ConfigFormService
{
    public interface IConfigFormService : IService<ConfigForm>
    {
        Task<PagedList<ConfigFormDto>> GetData(ConfigFormSearchVM search);

        Task<ConfigFormDto> GetDto(Guid id);
        Task<TaiLieuDinhKem> GetTaiLieuDinhKem(Guid Id);
    }
}