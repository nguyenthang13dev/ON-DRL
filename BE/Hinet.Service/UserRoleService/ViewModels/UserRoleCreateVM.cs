
using System.ComponentModel.DataAnnotations;

namespace Hinet.Service.UserRoleService.ViewModels
{
    public class UserRoleCreateVM
    {
        [Required]
		public Guid UserId {get; set; }

		public List<string>? RoleCode {get; set; }

        //[Required]
        //public Guid? DeparmentId{ get; set; }
        public List<Guid>? IdGroupRoles { get; set; }
    }

    public class UserRoleCreateVM_GanNguoi
    {
        [Required]
        public Guid UserId { get; set; }

        public List<Guid> ListDataRole { get; set; }
    }
}