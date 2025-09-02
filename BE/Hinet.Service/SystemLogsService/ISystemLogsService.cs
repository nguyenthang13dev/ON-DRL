using Hinet.Model.Entities;
using Hinet.Service.SystemLogsService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.SystemLogsService
{
    public interface ISystemLogsService : IService<SystemLogs>
    {
        Task<PagedList<SystemLogsDto>> GetData(SystemLogsSearch search);
        Task<SystemLogsDto?> GetDto(Guid id);
    }
}
