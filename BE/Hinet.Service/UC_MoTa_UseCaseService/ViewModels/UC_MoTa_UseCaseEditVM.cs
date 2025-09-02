using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.UC_MoTa_UseCaseService.ViewModels
{
    public class UC_MoTa_UseCaseEditVM : UC_MoTa_UseCaseCreateVM
    {
        public Guid? Id { get; set; }
    }
}