using Hinet.Model.Entities;
using Hinet.Service.AppUserService.Dto;
using Hinet.Service.AppUserService.ViewModels;
using Hinet.Service.AspNetUsersService.Dto;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;

namespace Hinet.Service.AppUserService
{
    public interface IAppUserService : IService<AppUser>
    {
        Task<LoginResponseDto> LoginUser(string email, string password);

        Task<string> ResetPassword(string email, string baseUri);

        Task<AppUserDto> ChangePassword(Guid? id, string oldPassword, string newPassword, string confirmPassword);

        Task<LoginResponseDto> RefreshToken(string refreshToken);

        Task<AppUserDto> CheckLogin(Guid? id);

        Task LogoutUser();

        Task<AppUser?> GetByUserName(string UserName);

        Task<UserInfoDto> GetInfo(Guid? id);

        Task<AppUserDto> RegisterUser(RegisterViewModel model);
        Task<List<UserDto>?> GetUsersByRoleIds(List<Guid> idsVaiTroTiepNhan, Guid? donviId = null);
        Task<List<DropdownOption>> GetDropDownUser(Guid? id);
    }
}