using Hinet.Model.Entities;
using Hinet.Service.DepartmentService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.DepartmentService.ViewModels;
using Hinet.Service.Dto;

namespace Hinet.Service.DepartmentService
{
    public interface IDepartmentService : IService<Department>
    {
        Task<PagedList<FormTemplateDto>> GetData(DepartmentSearch search);
        Task<FormTemplateDto> GetDtoByCode(string code);
        Task<FormTemplateDto> GetDto(Guid id);
        List<DepartmentHierarchy> GetDepartmentHierarchy();

        Task<FormTemplateDto> GetDetail(Guid id);

        Task<List<DropdownOption>> GetDropDown(string? selected);
        Task<List<DropdownOption>> GetDropDownByShortName(string? shortName);

        Task<List<DropdownOption>> GetDropRolesInDepartment(Guid? departmentId, Guid? userId);

        Task<List<DropdownOptionTree>> GetDropdownTreeOption(bool disabledParent = true);

        List<DepartmentVM> BuildDepartmentHierarchy();

        Task<List<DepartmentExport>> GetDepartmentExportData(string type);
        List<Guid> GetChildIds(List<Guid> ids);
        Task<List<DropdownOptionTree>> GetDropdownTreeOptionByUserDepartment(bool disabledParent = true, Guid? donViId = null);
        Task<List<DropdownOptionTree>> GetSubAndCurrentUnitDropdownTreeByUserDepartment(bool disabledParent = true, Guid? donViId = null);
        Task<List<DropdownOptionTree>> GetCodeDropdownTreeOption(bool disabledParent = true);
        Task<Guid> GetUserIdByRoleAndDepartment(Guid donViId, string maVaiTro);
    }
}