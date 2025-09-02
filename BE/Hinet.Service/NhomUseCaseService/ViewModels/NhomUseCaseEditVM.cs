using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.NhomUseCaseService.ViewModels
{
    public class NhomUseCaseEditVM : NhomUseCaseCreateVM
    {
        public Guid? Id { get; set; }
    }
}