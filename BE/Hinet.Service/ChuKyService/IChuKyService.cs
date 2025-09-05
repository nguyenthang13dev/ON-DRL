using Hinet.Model.Entities;
using Hinet.Service.ChuKyService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.ChuKyService
{
    public interface IChuKyService : IService<ChuKy>
    {
        Task<List<ChuKyDto>?> GetChuKy(Guid? userId);
        Task<PagedList<ChuKyDto>> GetData(ChuKySearch search);
        Task<ChuKyDto?> GetDto(Guid id);
    }
}
