using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.ActivitiesService.ViewModels
{
    public class ActivitiesEditVM : ActivitiesCreateVM
    {
        public Guid? Id { get; set; }
    }
}