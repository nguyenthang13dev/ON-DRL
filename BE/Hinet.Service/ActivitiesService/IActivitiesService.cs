using Hinet.Model.Entities;
using Hinet.Service.ActivitiesService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.ActivitiesService
{
    public interface IActivitiesService : IService<Activities>
    {
        Task<PagedList<ActivitiesDto>> GetData(ActivitiesSearch search);
        Task<ActivitiesDto?> GetDto(Guid id);
    }
}
