using Hinet.Model.Entities;

namespace Hinet.Service.GroupUserService.Dto
{
    public class GroupUserDto : GroupUser
    {
        public List<Guid>? RoleIds { get; set; }
        public List<string>? RoleNames { get; set; }
    }
}
