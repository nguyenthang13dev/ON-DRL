
using System.ComponentModel.DataAnnotations;

namespace Hinet.Service.ConfigFormService.ViewsModels
{
    public class ConfigFormEditVM : ConfigFormCreateVM
    {
        public Guid? Id { get; set; }
    }
}