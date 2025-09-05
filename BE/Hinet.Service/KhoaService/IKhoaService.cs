// Hinet.Service/KhoaService/IKhoaService.cs
using Hinet.Model.MongoEntities;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.KhoaService.Dto;
namespace Hinet.Service.KhoaService
{
    public interface IKhoaService : IService<Khoa>
    {
        Task<PagedList<KhoaDto>> GetData(KhoaSearch search);
        Task<KhoaDto> GetDto(Guid id);
    }
}
