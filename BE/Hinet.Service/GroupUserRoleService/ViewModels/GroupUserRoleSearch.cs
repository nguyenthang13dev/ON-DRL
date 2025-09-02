using Hinet.Service.Dto;

namespace Hinet.Service.GroupUserRoleService.Dto
{
    public class GroupUserRoleSearch : SearchBase
    {
        public Guid? GroupUserId {get; set; }
		public Guid? RoleId {get; set; }
    }
}
