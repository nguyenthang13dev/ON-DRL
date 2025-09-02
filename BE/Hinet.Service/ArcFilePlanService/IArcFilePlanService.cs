using Hinet.Model.Entities;
using Hinet.Model.Entities.LuuTruBQP;
using Hinet.Service.ArcFilePlanService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.ArcFilePlanService
{
    public interface IArcFilePlanService : IService<ArcFilePlan>
    {
        Task<PagedList<ArcFilePlanDto>> GetData(ArcFilePlanSearch search);
        Task<ArcFilePlanDto?> GetDto(Guid id);
    }
}
