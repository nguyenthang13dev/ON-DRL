using Hinet.Model.Entities;
using Hinet.Service.DM_DuLieuDanhMucService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;

namespace Hinet.Service.DM_DuLieuDanhMucService
{
    public interface IDM_DuLieuDanhMucService : IService<DM_DuLieuDanhMuc>
    {
        Task<PagedList<DM_DuLieuDanhMucDto>> GetData(DM_DuLieuDanhMucSearch search);
        Task<DM_DuLieuDanhMucDto> GetDtoByCode(string Code);
        Task<DM_DuLieuDanhMucDto> GetDto(Guid id);
        Task<List<DropdownOption>> GetDropdownByGroupCode(string groupCode);
        Task<List<DropdownOption>> GetDropdownCodeByGroupCode(string groupCode);
        Task<List<DM_DuLieuDanhMucDto>> GetListDataByGroupCode(string groupCode);
        Task<List<DropdownOptionTree>> GetDropdownOptionTrees(string groupCode);
        Task<List<DropdownOption>> GetDropdownCodeByGroupCodeAndNote(string groupCode, string note);
        Task<DropdownOptionTree> GetEduLevelTreeOption( Guid? idNhomDanhMuc, bool disabledParent = true);
        Task<List<DropdownOption>> GetDropDownByDonViId(Guid Id);
    }
}