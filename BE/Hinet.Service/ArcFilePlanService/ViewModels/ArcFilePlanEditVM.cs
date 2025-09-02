using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.ArcFilePlanService.ViewModels
{
    public class ArcFilePlanEditVM : ArcFilePlanCreateVM
    {
        public Guid? Id { get; set; }
    }
}