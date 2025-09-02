using Hinet.Service.RoleService.ViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.DepartmentService.ViewModels
{
    public class DepartmentVM
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Code { get; set; }
        public Guid? ParentId { get; set; }
        public long? Priority { get; set; } = 1;
        public int Level { get; set; }
        public bool IsActive { get; set; } = true;
        public List<DepartmentVM> DepartmentChilds { get; set; } = new List<DepartmentVM>();
        public List<RoleVM> Roles { get; set; } = new List<RoleVM>();
    }
}
