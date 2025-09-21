using Hinet.Model.MongoEntities;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;
using Hinet.Service.SinhVienService.Dto;

namespace Hinet.Service.SinhVienService
{
    public interface ISinhVienService : IService<SinhVien>
    {
        Task<PagedList<SinhVienDto>> GetData(SinhVienSearch search);
        Task<SinhVienDto> GetDto(Guid id);
        Task<List<DropdownOption>> GetDropdownByLopHanhChinh(Guid lopHanhChinhId);
        Task<List<DropdownOption>> GetDropdownByKhoa(Guid khoaId);
    }
}