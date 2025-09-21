// Hinet.Service/LopHanhChinhService/ILopHanhChinhService.cs
using Hinet.Model.MongoEntities;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;
using Hinet.Service.LopHanhChinhService.Dto;

namespace Hinet.Service.LopHanhChinhService
{
    public interface ILopHanhChinhService : IService<LopHanhChinh>
    {
        Task<PagedList<LopHanhChinhDto>> GetData(LopHanhChinhSearch search);
        Task<LopHanhChinhDto> GetDto(Guid id);
    }
}

