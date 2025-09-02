using Hinet.Model.Entities;
using Hinet.Model.Entities.LuuTruBQP;
using Hinet.Service.ArcPlanService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.ArcPlanService
{
    public interface IArcPlanService : IService<ArcPlan>
    {
        Task<PagedList<ArcPlanDto>> GetData(ArcPlanSearch search);
        Task<ArcPlanDto?> GetDto(Guid id);
    }
}
