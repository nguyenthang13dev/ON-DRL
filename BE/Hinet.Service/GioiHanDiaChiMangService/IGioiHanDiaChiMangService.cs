using Hinet.Model.Entities;
using Hinet.Service.GioiHanDiaChiMangService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.GioiHanDiaChiMangService
{
    public interface IGioiHanDiaChiMangService : IService<GioiHanDiaChiMang>
    {
        Task<PagedList<GioiHanDiaChiMangDto>> GetData(GioiHanDiaChiMangSearch search);
        Task<GioiHanDiaChiMangDto?> GetDto(Guid id);
    }
}
