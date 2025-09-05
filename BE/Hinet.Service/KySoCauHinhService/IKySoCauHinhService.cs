using Hinet.Model.Entities;
using Hinet.Service.KySoCauHinhService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.KySoCauHinhService
{
    public interface IKySoCauHinhService : IService<KySoCauHinh>
    {
        Task<PagedList<KySoCauHinhDto>> GetData(KySoCauHinhSearch search);
        Task<KySoCauHinhDto?> GetDto(Guid id);
    }
}
