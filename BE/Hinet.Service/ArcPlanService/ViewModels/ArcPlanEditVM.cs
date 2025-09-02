using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.ArcPlanService.ViewModels
{
    public class ArcPlanEditVM : ArcPlanCreateVM
    {
        public Guid? Id { get; set; }
    }
}