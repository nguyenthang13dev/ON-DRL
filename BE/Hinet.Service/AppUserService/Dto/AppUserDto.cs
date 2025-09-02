using Hinet.Model.Entities;
using Hinet.Service.OperationService.Dto;

namespace Hinet.Service.AppUserService.Dto
{
    public class AppUserDto
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public int Gender { get; set; }
        public string? Picture { get; set; }
        public List<string> ListRole { get; set; }
        public List<string> ListOperation { get; set; }
        public Guid? DonViId { get; set; }
        public bool? IsSSO { get; set; }
        public bool? isHasRole { get; set; }
        public string? AnhDaiDien { get; set; }
        public string? TenDonVi_txt { get; set; }
        public Guid IdJoin { get; set; }
        public Guid? IdNhanSu { get; set; }
        public string? UserName { get; set; }

        public static AppUserDto FromAppUser(AppUser user)
        {
            return new AppUserDto()
            {
                Gender = user.Gender,
                Id = user.Id.ToString(),
                Email = user.Email,
                Name = user.Name ?? "",
                Picture = user.Picture,
                DonViId = user.DonViId,
                IdJoin = user.Id,
                IdNhanSu = user.IdNhanSu
            };
        }
    }

    public class UserInfoDto : AppUserDto
    {
        public List<MenuDataDto>? MenuData { get; set; }
        public List<PermissionDto>? Permissions { get; set; }
        public string? CapBac { get; set; }
    }
}
