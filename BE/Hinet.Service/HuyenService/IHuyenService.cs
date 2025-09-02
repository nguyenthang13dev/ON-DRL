using Hinet.Model.Entities;
using Hinet.Service.HuyenService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;

namespace Hinet.Service.HuyenService
{
    public interface IHuyenService : IService<Huyen>
    {
        Task<PagedList<HuyenDto>> GetData(HuyenSearch search);

        Task<List<DropdownOption>> GetDropdownByMaTinh(string MaTinh);

        Task<HuyenDto> GetDto(Guid id);
    }
}