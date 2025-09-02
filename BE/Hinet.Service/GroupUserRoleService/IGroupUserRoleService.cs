using Hinet.Model.Entities;
using Hinet.Service.GroupUserRoleService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.GroupUserRoleService
{
    public interface IGroupUserRoleService : IService<GroupUserRole>
    {
        Task<PagedList<GroupUserRoleDto>> GetData(GroupUserRoleSearch search);
        Task<GroupUserRoleDto?> GetDto(Guid id);
    }
}
