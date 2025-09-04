using Hinet.Model.Entities;
using Hinet.Service.TypeDanhMucService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;

namespace Hinet.Service.TypeDanhMucService
{
    public interface ITypeDanhMucService : IService<TypeDanhMuc>
    {
        Task<PagedList<TypeDanhMucDto>> GetData(TypeDanhMucSearch search);

        Task<TypeDanhMucDto> GetDto(Guid id);

        Task<List<DropdownOption>> GetDropdown();
    }
}