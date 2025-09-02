using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.UC_UseCaseService.ViewModels
{
    public class UC_UseCaseEditVM : UC_UseCaseCreateVM
    {
        public Guid? Id { get; set; }
    }
}