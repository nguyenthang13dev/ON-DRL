using Hinet.Model.Entities;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Model.Entities.QLNhanSu;
using Hinet.Service.QLNhanSu.NS_HopDongLaoDongService.Dto;
using Hinet.Service.QLNhanSu.NS_HopDongLaoDongService.ViewModels;

namespace Hinet.Service.QLNhanSu.NS_HopDongLaoDongService
{
    public interface INS_HopDongLaoDongService : IService<NS_HopDongLaoDong>
    {
        Task<PagedList<NS_HopDongLaoDongDto>> GetData(NS_HopDongLaoDongSearch search);
        Task<NS_HopDongLaoDongDto?> GetDto(Guid id);
        Task<NS_HopDongLaoDongExportDto?> GetExportDto(Guid idHopDongLaoDong);

    }
}
