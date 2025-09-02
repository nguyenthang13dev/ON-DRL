using Hinet.Model.Entities;
using Hinet.Service.XaService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;

namespace Hinet.Service.XaService
{
    public interface IXaService : IService<Xa>
    {
        Task<PagedList<XaDto>> GetData(XaSearch search);

        Task<List<DropdownOption>> GetDropdownByMaHuyen(string MaHuyen);

        Task<XaDto> GetDto(Guid id);
    }
}