using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.OperationService.Dto
{
    public class PermissionDto
    {
        public string? ModuleCode { get; set; }
        public string? ModuleName { get; set; }
        public Dictionary<string, bool> Permissions { get; set; } = new();
    }
}
