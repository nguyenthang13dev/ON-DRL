using Hinet.Model.Entities;
using Hinet.Service.DA_NoiDungCuocHopService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;

namespace Hinet.Service.DA_NoiDungCuocHopService
{
    public interface IDA_NoiDungCuocHopService : IService<DA_NoiDungCuocHop>
    {
        Task<PagedList<DA_NoiDungCuocHopDto>> GetData(DA_NoiDungCuocHopSearch search);
        Task<DA_NoiDungCuocHopDto?> GetDto(Guid id);
        Task<List<DA_NoiDungCuocHopDto>> ListCuocHopByDuAn(Guid? id, DA_NoiDungCuocHopSearch search);
    }
}
