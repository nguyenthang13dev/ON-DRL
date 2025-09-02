using Hinet.Service.DepartmentService.ViewModels;


namespace Hinet.Service.UserRoleService.ViewModels
{
    public class UserRoleVM
    {
        public Guid UserId { get; set; }

        public List<DepartmentVM> Departments { get; set; } = new List<DepartmentVM>();
    }
}
