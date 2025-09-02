using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Model.Entities.QLNhanSu;
using Hinet.Service.QLNhanSu.NS_NhanSuService.Dto;
using Hinet.Service.QLNhanSu.NS_NhanSuService.ViewModels;

namespace Hinet.Service.QLNhanSu.NS_NhanSuService
{
    public interface INS_NhanSuService : IService<NS_NhanSu>
    {
        Task<PagedList<NS_NhanSuDto>> GetData(NS_NhanSuSearch search);
        Task<NS_NhanSuDto?> GetDto(Guid id);
        Task<NS_NhanSuDto?> GetByMa(string MaNhanSu);
        Task<NS_NhanSu> CreateStaffAsync(NS_NhanSuCreateVM model);
        Task DeleteStaffAsync(Guid id);
        Task<List<BaoCaoThongKeNsDto<NS_NhanSu>>> ThongKeNs(string? search);
        Task<ThongKeHopDongLaoDongDto> ThongKeHDLD();
    }
}
