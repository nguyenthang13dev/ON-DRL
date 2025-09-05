
using System.ComponentModel.DataAnnotations;

namespace Hinet.Service.ConfigFormService.ViewsModels
{
    public class ConfigFormCreateVM
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }  
        public Guid? FileDinhKems { get; set; }
    }
}