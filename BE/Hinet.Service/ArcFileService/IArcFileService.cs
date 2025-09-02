using Hinet.Model.Entities;
using Hinet.Model.Entities.LuuTruBQP;
using Hinet.Service.ArcFileService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.ArcFileService
{
    public interface IArcFileService : IService<ArcFile>
    {
        Task<PagedList<ArcFileDto>> GetData(ArcFileSearch search);
        Task<ArcFileDto?> GetDto(Guid id);
    }
}
