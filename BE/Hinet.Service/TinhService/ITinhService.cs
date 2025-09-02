using Hinet.Model.Entities;
using Hinet.Service.TinhService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;

namespace Hinet.Service.TinhService
{
    public interface ITinhService : IService<Tinh>
    {
        Task<PagedList<TinhDto>> GetData(TinhSearch search);

        Task<TinhDto> GetDto(Guid id);

        Task<List<DropdownOption>> GetDropdown();
    }
}