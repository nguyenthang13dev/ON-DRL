using Hinet.Model.Entities;
using Hinet.Service.GroupUserService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.GroupUserService
{
    public interface IGroupUserService : IService<GroupUser>
    {
        Task<PagedList<GroupUserDto>> GetData(GroupUserSearch search);
        Task<GroupUserDto?> GetDto(Guid id);
    }
}
