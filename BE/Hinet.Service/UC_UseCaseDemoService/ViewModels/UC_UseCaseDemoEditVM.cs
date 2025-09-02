using System.ComponentModel.DataAnnotations;

namespace Hinet.Service.UC_UseCaseDemoService.ViewModels
{
    public class UC_UseCaseDemoEditVM : UC_UseCaseDemoCreateVM
    {
        public Guid Id { get; set; }
    }
}