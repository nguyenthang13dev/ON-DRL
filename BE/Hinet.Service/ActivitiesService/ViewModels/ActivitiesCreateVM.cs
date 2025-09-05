using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.ActivitiesService.ViewModels
{
    public class ActivitiesCreateVM
    {

        public DateTime? StartDate { get; set; }

        public string? Name { get; set; }

        public string? Description { get; set; }
        public Guid? Image { get; set; }

    }
}