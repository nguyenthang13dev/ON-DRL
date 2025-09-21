// Hinet.Service/GiaoVienService/IGiaoVienService.cs
using Hinet.Model.MongoEntities;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;
using Hinet.Service.GiaoVienService.Dto;

namespace Hinet.Service.GiaoVienService
{
    public interface IGiaoVienService : IService<GiaoVien>
    {
        Task<PagedList<GiaoVienDto>> GetData(GiaoVienSearch search);
        Task<GiaoVienDto> GetDto(Guid id);
        Task<List<DropdownOption>> GetDropdownByKhoa(Guid khoaId);
    }
}
