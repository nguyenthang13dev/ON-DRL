using Hinet.Model.Entities;
using Hinet.Service.User_GroupUserService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.User_GroupUserService
{
    public interface IUser_GroupUserService : IService<User_GroupUser>
    {
        Task<PagedList<User_GroupUserDto>> GetData(User_GroupUserSearch search);
        Task<User_GroupUserDto?> GetDto(Guid id);
    }
}
