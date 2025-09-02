using Hinet.Model.Entities;
using Hinet.Service.AspNetUsersService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.AspNetUsersService
{
    public interface IAspNetUsersService : IService<AppUser>
    {
        Task<PagedList<UserDto>> GetData(AspNetUsersSearch search, UserDto userDto = null);

        Task<AspNetUsersDto> GetDto(Guid id);

        Task<List<AppUser>> GetUserByCanBoIds(List<Guid> canboIds);

        Task<AppUser> GetUserByCanBoId(Guid? canboId);
        Task<List<AppUser>> GetUserByIdDonVi(Guid IdDonVi);
        Task<List<AppUser>> GetUserByIdDonViAndIdRole(Guid IdDonVi, Guid IdRole);
    }
}